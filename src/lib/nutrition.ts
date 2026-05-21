import type { Aliment, BatchConfig, JourPlanifie, Profil, RepasPlanifie, Semaine } from "./types";
import { ALIMENTS_MAP } from "@/data/aliments";
import { RECETTES, RECETTES_MAP } from "@/data/recettes";

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
  const r = RECETTES_MAP[recetteId];
  if (!r) return EMPTY_MACROS;
  let total = EMPTY_MACROS;
  for (const ing of r.ingredients) {
    const a = ALIMENTS_MAP[ing.aliment_id];
    if (!a) continue;
    total = addMacros(total, macrosIngredient(a, ing.quantite_g_par_portion * portions));
  }
  return total;
}

export function macrosRepas(repas: RepasPlanifie[]): MacrosCalc {
  return repas.reduce((acc, r) => addMacros(acc, macrosRecette(r.recette_id, r.portions)), EMPTY_MACROS);
}

export function macrosJour(jour: JourPlanifie) {
  return macrosRepas(jour.repas);
}

export function prixSemaine(semaine: Semaine): number {
  let total = 0;
  for (const j of semaine.jours) {
    for (const r of j.repas) {
      const recette = RECETTES_MAP[r.recette_id];
      if (!recette) continue;
      for (const ing of recette.ingredients) {
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
      const recette = RECETTES_MAP[r.recette_id];
      if (!recette) continue;
      for (const ing of recette.ingredients) {
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