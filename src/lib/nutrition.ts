import type { Aliment, BatchConfig, IngredientRecette, JourPlanifie, Profil, RepasPlanifie, Semaine } from "./types";
import { ALIMENTS_MAP } from "@/data/aliments";
import { RECETTES, RECETTES_MAP } from "@/data/recettes";
import { getRecette } from "./recipeLookup";

export const ACTIVITE_FACTEURS: Record<Profil["activite"], number> = {
  sedentaire: 1.2,
  leger: 1.375,
  moderement_actif: 1.55,
  tres_actif: 1.725,
  athlete: 1.9,
};

export function calcBMR(p: Pick<Profil, "sexe" | "poids_kg" | "taille_cm" | "age">) {
  if (p.sexe === "homme") {
    return 88.362 + 13.397 * p.poids_kg + 4.799 * p.taille_cm - 5.677 * p.age;
  }
  return 447.593 + 9.247 * p.poids_kg + 3.098 * p.taille_cm - 4.330 * p.age;
}

export function calcTDEE(p: Profil) {
  return Math.round(calcBMR(p) * ACTIVITE_FACTEURS[p.activite]);
}

export function objectifProteines(p: Profil) {
  const mult = p.objectif === "seche_musculaire" ? 2.2 : p.objectif === "maintien" ? 1.8 : 2.5;
  return Math.round(p.poids_kg * mult);
}

export interface MacrosCalc {
  kcal: number; proteines: number; glucides: number; lipides: number; fibres: number;
}

export const EMPTY_MACROS: MacrosCalc = { kcal: 0, proteines: 0, glucides: 0, lipides: 0, fibres: 0 };

export function addMacros(a: MacrosCalc, b: MacrosCalc): MacrosCalc {
  return {
    kcal: a.kcal + b.kcal,
    proteines: a.proteines + b.proteines,
    glucides: a.glucides + b.glucides,
    lipides: a.lipides + b.lipides,
    fibres: a.fibres + b.fibres,
  };
}

export function macrosIngredient(aliment: Aliment, grammes: number): MacrosCalc {
  const f = grammes / 100;
  return {
    kcal: aliment.pour_100g.kcal * f,
    proteines: aliment.pour_100g.proteines * f,
    glucides: aliment.pour_100g.glucides * f,
    lipides: aliment.pour_100g.lipides * f,
    fibres: (aliment.pour_100g.fibres ?? 0) * f,
  };
}

export function macrosRecette(recetteId: string, portions = 1): MacrosCalc {
  const r = getRecette(recetteId);
  if (!r) return EMPTY_MACROS;
  let total = EMPTY_MACROS;
  for (const ing of r.ingredients) {
    const a = ALIMENTS_MAP[ing.aliment_id];
    if (!a) continue;
    total = addMacros(total, macrosIngredient(a, ing.quantite_g_par_portion * portions));
  }
  return total;
}

export function resolveIngredients(r: RepasPlanifie): IngredientRecette[] {
  if (r.custom_ingredients) return r.custom_ingredients;
  const rec = getRecette(r.recette_id);
  return rec?.ingredients ?? [];
}

export function macrosRepasPlanifie(r: RepasPlanifie): MacrosCalc {
  let total = EMPTY_MACROS;
  for (const ing of resolveIngredients(r)) {
    const a = ALIMENTS_MAP[ing.aliment_id];
    if (!a) continue;
    total = addMacros(total, macrosIngredient(a, ing.quantite_g_par_portion * r.portions));
  }
  return total;
}

export function macrosRepas(repas: RepasPlanifie[]): MacrosCalc {
  return repas.reduce((acc, r) => addMacros(acc, macrosRepasPlanifie(r)), EMPTY_MACROS);
}

export function macrosJour(jour: JourPlanifie) {
  return macrosRepas(jour.repas);
}

// ===== Équilibrage automatique pour respecter les quotas =====
export const QUOTA_KCAL_MIN = 1950;
export const QUOTA_KCAL_MAX = 2100;
export const QUOTA_PROT_MIN = 170;

/**
 * Ajuste chaque jour d'une semaine pour respecter obligatoirement :
 * - protéines ≥ 170 g
 * - kcal ∈ [1950, 2100]
 * Stratégie : booster la portion de skyr sur le dessert (meilleur ratio P/kcal),
 * et réduire les portions des repas les moins protéinés si on dépasse le plafond kcal.
 */
export function equilibrerSemaine(semaine: Semaine): Semaine {
  const skyr = ALIMENTS_MAP["skyr"];
  const jours = semaine.jours.map((j) => equilibrerJour(j, skyr));
  return { ...semaine, jours };
}

function equilibrerJour(jour: JourPlanifie, skyr: Aliment | undefined): JourPlanifie {
  const repas = jour.repas.map((r) => ({ ...r, custom_ingredients: r.custom_ingredients ? [...r.custom_ingredients] : undefined }));

  // 1) Si trop de kcal : réduire les portions des repas les moins protéinés (sauf dessert)
  for (let guard = 0; guard < 50; guard++) {
    const m = macrosRepas(repas);
    if (m.kcal <= QUOTA_KCAL_MAX) break;
    const candidats = repas
      .map((r, i) => ({ i, r, macros: macrosRepasPlanifie(r) }))
      .filter((x) => x.r.portions > 0.5 && x.r.type !== "dessert")
      .sort((a, b) => a.macros.proteines / Math.max(1, a.macros.kcal) - b.macros.proteines / Math.max(1, b.macros.kcal));
    if (!candidats.length) break;
    candidats[0].r.portions = Math.max(0.5, Math.round((candidats[0].r.portions - 0.1) * 10) / 10);
  }

  // 2) Booster avec du skyr sur le dessert pour atteindre 170 g protéines et ≥ 1950 kcal
  if (skyr) {
    const dessert = repas.find((r) => r.type === "dessert") ?? repas[repas.length - 1];
    if (dessert) {
      const ingr = dessert.custom_ingredients ?? resolveIngredients(dessert).map((i) => ({ ...i }));
      const existing = ingr.find((i) => i.aliment_id === "skyr");
      const baseSkyr = existing?.quantite_g_par_portion ?? 0;

      for (let guard = 0; guard < 60; guard++) {
        const m = macrosRepas(repas);
        const protOk = m.proteines >= QUOTA_PROT_MIN;
        const kcalOk = m.kcal >= QUOTA_KCAL_MIN;
        if (protOk && kcalOk) break;
        if (m.kcal >= QUOTA_KCAL_MAX) break;

        const deficitProt = Math.max(0, QUOTA_PROT_MIN - m.proteines);
        const deficitKcal = Math.max(0, QUOTA_KCAL_MIN - m.kcal);
        const gramsByProt = deficitProt / (skyr.pour_100g.proteines / 100);
        const gramsByKcal = deficitKcal / (skyr.pour_100g.kcal / 100);
        const headroomKcal = (QUOTA_KCAL_MAX - m.kcal) / (skyr.pour_100g.kcal / 100);
        const add = Math.max(20, Math.min(headroomKcal, Math.max(gramsByProt, gramsByKcal)));
        if (add < 5) break;

        const currentTotal = (existing?.quantite_g_par_portion ?? baseSkyr) * dessert.portions;
        const newPerPortion = Math.round((currentTotal + add) / dessert.portions);
        if (existing) {
          existing.quantite_g_par_portion = newPerPortion;
        } else {
          ingr.push({ aliment_id: "skyr", quantite_g_par_portion: newPerPortion });
        }
        dessert.custom_ingredients = ingr;
      }
    }
  }

  return { ...jour, repas };
}

export function prixSemaine(semaine: Semaine): number {
  let total = 0;
  for (const j of semaine.jours) {
    for (const r of j.repas) {
      for (const ing of resolveIngredients(r)) {
        const a = ALIMENTS_MAP[ing.aliment_id];
        if (!a) continue;
        total += (ing.quantite_g_par_portion * r.portions / 1000) * a.prix_kg_estime;
      }
    }
  }
  return Math.round(total * 100) / 100;
}

export interface ListeCoursesItem {
  aliment: Aliment;
  quantite_g: number;
  cout: number;
}

export function listeCourses(semaine: Semaine): ListeCoursesItem[] {
  const map = new Map<string, ListeCoursesItem>();
  for (const j of semaine.jours) {
    for (const r of j.repas) {
      for (const ing of resolveIngredients(r)) {
        const a = ALIMENTS_MAP[ing.aliment_id];
        if (!a) continue;
        const q = ing.quantite_g_par_portion * r.portions;
        const cur = map.get(a.id);
        if (cur) {
          cur.quantite_g += q;
          cur.cout = (cur.quantite_g / 1000) * a.prix_kg_estime;
        } else {
          map.set(a.id, { aliment: a, quantite_g: q, cout: (q / 1000) * a.prix_kg_estime });
        }
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => a.aliment.categorie.localeCompare(b.aliment.categorie));
}

const ORDRE_REPAS: RepasPlanifie["type"][] = ["petit_dejeuner", "dejeuner", "diner", "dessert"];

export function genererSemaineDefaut(numero: number, dateDebut: Date): Semaine {
  const recettesParType: Record<string, string[]> = {
    petit_dejeuner: ["porridge_avoine_cacao"],
    dejeuner: ["bowl_quinoa_poulet", "feijoada_legere"],
    diner: ["poulet_tikka_leger", "boeuf_bolo_verte", "filet_mignon_moutarde", "saumon_brocoli"],
    dessert: ["skyr_bowl_dessert"],
  };
  const jours: JourPlanifie[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(dateDebut);
    d.setDate(d.getDate() + i);
    const repas: RepasPlanifie[] = ORDRE_REPAS.map((type) => {
      const pool = recettesParType[type];
      return { type, recette_id: pool[i % pool.length], portions: 1 };
    });
    jours.push({ date: d.toISOString().slice(0, 10), repas });
  }
  return { id: crypto.randomUUID(), numero, date_debut: dateDebut.toISOString().slice(0, 10), jours };
}

export function genererSemaineBatch(numero: number, dateDebut: Date, cfg: BatchConfig): Semaine {
  const batchDej = RECETTES.filter((r) => r.type_repas === "dejeuner" && r.batch_cooking).map((r) => r.id);
  const batchDin = RECETTES.filter((r) => r.type_repas === "diner" && r.batch_cooking).map((r) => r.id);
  const fraicheDin = RECETTES.filter((r) => r.type_repas === "diner" && !r.batch_cooking).map((r) => r.id);
  const pdj = "porridge_avoine_cacao";
  const dessert = "skyr_bowl_dessert";
  const fraichePick = fraicheDin[0] ?? batchDin[0] ?? "saumon_brocoli";

  // Pool global de recettes batch (déj + dîner) pour assigner à chaque slot
  const pool = [...batchDin, ...batchDej];
  const recipeIds = cfg.recipes.map((_, i) => pool[i % pool.length]);

  const pickFor = (mealType: "dejeuner" | "diner", slotIdx: number | null): string => {
    if (slotIdx === null || slotIdx >= recipeIds.length) return fraichePick;
    return recipeIds[slotIdx];
  };

  const jours: JourPlanifie[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(dateDebut);
    d.setDate(d.getDate() + i);
    const repas: RepasPlanifie[] = [
      { type: "petit_dejeuner", recette_id: pdj, portions: 1 },
      { type: "dejeuner", recette_id: pickFor("dejeuner", cfg.assignments.dejeuner[i] ?? null), portions: 1 },
      { type: "diner", recette_id: pickFor("diner", cfg.assignments.diner[i] ?? null), portions: 1 },
      { type: "dessert", recette_id: dessert, portions: 1 },
    ];
    jours.push({ date: d.toISOString().slice(0, 10), repas });
  }
  return { id: crypto.randomUUID(), numero, date_debut: dateDebut.toISOString().slice(0, 10), jours, batch_config: cfg };
}

export interface BatchSummary {
  recetteIds: string[];
  tempsMinutes: number;
  tupperware: number;
}

export function batchSummary(semaine: Semaine): BatchSummary {
  const counts = new Map<string, number>();
  for (const j of semaine.jours) {
    for (const r of j.repas) {
      const rec = RECETTES_MAP[r.recette_id];
      if (!rec || !rec.batch_cooking) continue;
      counts.set(r.recette_id, (counts.get(r.recette_id) ?? 0) + r.portions);
    }
  }
  let tempsMinutes = 0;
  let tupperware = 0;
  for (const [id, portions] of counts) {
    const rec = RECETTES_MAP[id];
    if (!rec) continue;
    tempsMinutes += rec.temps_total_minutes;
    tupperware += portions;
  }
  return { recetteIds: Array.from(counts.keys()), tempsMinutes, tupperware };
}

export function startOfWeek(d = new Date()): Date {
  const x = new Date(d);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day; // monday
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

export const JOURS_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
export const REPAS_LABELS: Record<RepasPlanifie["type"], string> = {
  petit_dejeuner: "Petit-déj",
  dejeuner: "Déjeuner",
  diner: "Dîner",
  dessert: "Dessert",
  collation: "Collation",
};