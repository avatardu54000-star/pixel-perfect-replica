import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Aliment, BatchConfig, IngredientRecette, PoidsEntry, Preferences, Profil, Recette, Semaine } from "./types";
import type { MacrosBase } from "./types";
import { calcTDEE, equilibrerSemaine, genererSemaineBatch, genererSemaineDefaut, objectifProteines, startOfWeek } from "./nutrition";
import { setCustomRecettes } from "./recipeLookup";
import { setCustomAliments } from "./alimentLookup";

const PROFIL_DEFAUT: Profil = {
  nom: "Alex",
  sexe: "homme",
  age: 30,
  taille_cm: 178,
  poids_kg: 76.4,
  poids_initial_kg: 79.8,
  masse_musculaire_kg: 37.1,
  masse_grasse_kg: 13.8,
  taux_graisse_pct: 17.3,
  tour_taille_cm: 84.1,
  activite: "moderement_actif",
  objectif: "seche_musculaire",
  objectif_calories_jour: 2100,
  objectif_proteines_g: 170,
};

const PREFS_DEFAUT: Preferences = {
  bannis_temporaire: [],
  bannis_definitif: ["patate_douce"],
  cuisines_preferees: ["italienne", "asiatique", "méditerranéenne"],
  budget_mensuel: 325,
};

interface State {
  profil: Profil;
  preferences: Preferences;
  semaines: Semaine[];
  historiquePoids: PoidsEntry[];
  semaineActiveId: string | null;
  recettesCustom: Recette[];
  alimentsCustom: Aliment[];
  checkInDone: boolean;
  setProfil: (p: Partial<Profil>) => void;
  setPreferences: (p: Partial<Preferences>) => void;
  ajouterSemaine: () => Semaine;
  ajouterSemaineBatch: (cfg: BatchConfig) => Semaine;
  setSemaineActive: (id: string) => void;
  changerRepas: (semaineId: string, jourIndex: number, type: string, recetteId: string) => void;
  modifierIngredientsRepas: (semaineId: string, jourIndex: number, type: string, ingredients: IngredientRecette[] | undefined) => void;
  changerRecetteEtIngredients: (semaineId: string, jourIndex: number, type: string, recetteId: string, ingredients: IngredientRecette[] | undefined) => void;
  setRepasLibre: (semaineId: string, jourIndex: number, type: string, payload: { statut: "vide" | "pas_de_repas" | "log"; macros?: MacrosBase }) => void;
  toggleNonPris: (semaineId: string, jourIndex: number, type: string) => void;
  sauvegarderRecetteCustom: (recette: Recette) => void;
  ajouterAlimentCustom: (a: Aliment) => void;
  supprimerAlimentCustom: (id: string) => void;
  setCheckInDone: (v: boolean) => void;
  ajouterPoids: (poids: number) => void;
}

function ensureFirstSemaine(): { semaines: Semaine[]; activeId: string } {
  const s = equilibrerSemaine(genererSemaineDefaut(1, startOfWeek()));
  return { semaines: [s], activeId: s.id };
}

export const useApp = create<State>()(
  persist(
    (set, get) => {
      const init = ensureFirstSemaine();
      return {
        profil: PROFIL_DEFAUT,
        preferences: PREFS_DEFAUT,
        semaines: init.semaines,
        historiquePoids: [{ date: new Date().toISOString().slice(0, 10), poids: PROFIL_DEFAUT.poids_kg }],
        semaineActiveId: init.activeId,
        recettesCustom: [],
        alimentsCustom: [],
        checkInDone: false,
        setProfil: (p) => {
          const merged = { ...get().profil, ...p } as Profil;
          // Recompute recommended values only when the user did not explicitly override them in this call.
          if (p.objectif_calories_jour === undefined) {
            const tdee = calcTDEE(merged);
            const offset = merged.objectif === "seche_musculaire" ? -500 : merged.objectif === "prise_masse" ? 300 : 0;
            merged.objectif_calories_jour = tdee + offset;
          }
          if (p.objectif_proteines_g === undefined) {
            merged.objectif_proteines_g = objectifProteines(merged);
          }
          set({ profil: merged });
        },
        setPreferences: (p) => set({ preferences: { ...get().preferences, ...p } }),
        ajouterSemaine: () => {
          const sems = get().semaines;
          const last = sems[sems.length - 1];
          const nextStart = last ? new Date(last.date_debut) : startOfWeek();
          if (last) nextStart.setDate(nextStart.getDate() + 7);
          const s = equilibrerSemaine(genererSemaineDefaut((last?.numero ?? 0) + 1, nextStart));
          set({ semaines: [...sems, s], semaineActiveId: s.id });
          return s;
        },
        ajouterSemaineBatch: (cfg) => {
          const sems = get().semaines;
          const last = sems[sems.length - 1];
          const nextStart = last ? new Date(last.date_debut) : startOfWeek();
          if (last) nextStart.setDate(nextStart.getDate() + 7);
          const s = equilibrerSemaine(genererSemaineBatch((last?.numero ?? 0) + 1, nextStart, cfg));
          set({ semaines: [...sems, s], semaineActiveId: s.id });
          return s;
        },
        setSemaineActive: (id) => set({ semaineActiveId: id }),
        changerRepas: (semaineId, jourIndex, type, recetteId) => {
          const sems = get().semaines.map((s) => {
            if (s.id !== semaineId) return s;
            const jours = s.jours.map((j, i) => {
              if (i !== jourIndex) return j;
              const repas = j.repas.map((r) =>
                r.type === type ? { ...r, recette_id: recetteId, custom_ingredients: undefined } : r,
              );
              return { ...j, repas };
            });
            return { ...s, jours };
          });
          set({ semaines: sems });
        },
        modifierIngredientsRepas: (semaineId, jourIndex, type, ingredients) => {
          const sems = get().semaines.map((s) => {
            if (s.id !== semaineId) return s;
            const jours = s.jours.map((j, i) => {
              if (i !== jourIndex) return j;
              const repas = j.repas.map((r) =>
                r.type === type ? { ...r, custom_ingredients: ingredients } : r,
              );
              return { ...j, repas };
            });
            return { ...s, jours };
          });
          set({ semaines: sems });
        },
        changerRecetteEtIngredients: (semaineId, jourIndex, type, recetteId, ingredients) => {
          const sems = get().semaines.map((s) => {
            if (s.id !== semaineId) return s;
            const jours = s.jours.map((j, i) => {
              if (i !== jourIndex) return j;
              const repas = j.repas.map((r) =>
                r.type === type ? { ...r, recette_id: recetteId, custom_ingredients: ingredients } : r,
              );
              return { ...j, repas };
            });
            return { ...s, jours };
          });
          set({ semaines: sems });
        },
        setRepasLibre: (semaineId, jourIndex, type, payload) => {
          const sems = get().semaines.map((s) => {
            if (s.id !== semaineId) return s;
            const jours = s.jours.map((j, i) => {
              if (i !== jourIndex) return j;
              const repas = j.repas.map((r) =>
                r.type === type
                  ? { ...r, libre_statut: payload.statut, libre_macros: payload.statut === "log" ? payload.macros : undefined }
                  : r,
              );
              return { ...j, repas };
            });
            return { ...s, jours };
          });
          set({ semaines: sems });
        },
        toggleNonPris: (semaineId, jourIndex, type) => {
          const sems = get().semaines.map((s) => {
            if (s.id !== semaineId) return s;
            const jours = s.jours.map((j, i) => {
              if (i !== jourIndex) return j;
              const repas = j.repas.map((r) =>
                r.type === type ? { ...r, non_pris: !r.non_pris } : r,
              );
              return { ...j, repas };
            });
            return { ...s, jours };
          });
          set({ semaines: sems });
        },
        sauvegarderRecetteCustom: (recette) => {
          const list = [...get().recettesCustom.filter((r) => r.id !== recette.id), recette];
          setCustomRecettes(list);
          set({ recettesCustom: list });
        },
        ajouterAlimentCustom: (a) => {
          const list = [...get().alimentsCustom.filter((x) => x.id !== a.id), a];
          setCustomAliments(list);
          set({ alimentsCustom: list });
        },
        supprimerAlimentCustom: (id) => {
          const list = get().alimentsCustom.filter((x) => x.id !== id);
          setCustomAliments(list);
          set({ alimentsCustom: list });
        },
        setCheckInDone: (v) => set({ checkInDone: v }),
        ajouterPoids: (poids) => {
          const date = new Date().toISOString().slice(0, 10);
          const hist = [...get().historiquePoids.filter((e) => e.date !== date), { date, poids }];
          set({ historiquePoids: hist, profil: { ...get().profil, poids_kg: poids } });
        },
      };
    },
    {
      name: "myfuelapp-v1",
      onRehydrateStorage: () => (state) => {
        if (state?.recettesCustom) setCustomRecettes(state.recettesCustom);
        if (state?.alimentsCustom) setCustomAliments(state.alimentsCustom);
        if (state?.semaines) state.semaines = state.semaines.map((s) => equilibrerSemaine(s));
      },
    },
  ),
);

export function useSemaineActive() {
  return useApp((s) => s.semaines.find((x) => x.id === s.semaineActiveId) ?? s.semaines[0]);
}