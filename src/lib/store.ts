import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BatchConfig, PoidsEntry, Preferences, Profil, Semaine } from "./types";
import { genererSemaineBatch, genererSemaineDefaut, startOfWeek } from "./nutrition";

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
  setProfil: (p: Partial<Profil>) => void;
  setPreferences: (p: Partial<Preferences>) => void;
  ajouterSemaine: () => Semaine;
  ajouterSemaineBatch: (cfg: BatchConfig) => Semaine;
  setSemaineActive: (id: string) => void;
  changerRepas: (semaineId: string, jourIndex: number, type: string, recetteId: string) => void;
  ajouterPoids: (poids: number) => void;
}

function ensureFirstSemaine(): { semaines: Semaine[]; activeId: string } {
  const s = genererSemaineDefaut(1, startOfWeek());
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
        setProfil: (p) => set({ profil: { ...get().profil, ...p } }),
        setPreferences: (p) => set({ preferences: { ...get().preferences, ...p } }),
        ajouterSemaine: () => {
          const sems = get().semaines;
          const last = sems[sems.length - 1];
          const nextStart = last ? new Date(last.date_debut) : startOfWeek();
          if (last) nextStart.setDate(nextStart.getDate() + 7);
          const s = genererSemaineDefaut((last?.numero ?? 0) + 1, nextStart);
          set({ semaines: [...sems, s], semaineActiveId: s.id });
          return s;
        },
        ajouterSemaineBatch: (cfg) => {
          const sems = get().semaines;
          const last = sems[sems.length - 1];
          const nextStart = last ? new Date(last.date_debut) : startOfWeek();
          if (last) nextStart.setDate(nextStart.getDate() + 7);
          const s = genererSemaineBatch((last?.numero ?? 0) + 1, nextStart, cfg);
          set({ semaines: [...sems, s], semaineActiveId: s.id });
          return s;
        },
        setSemaineActive: (id) => set({ semaineActiveId: id }),
        changerRepas: (semaineId, jourIndex, type, recetteId) => {
          const sems = get().semaines.map((s) => {
            if (s.id !== semaineId) return s;
            const jours = s.jours.map((j, i) => {
              if (i !== jourIndex) return j;
              const repas = j.repas.map((r) => (r.type === type ? { ...r, recette_id: recetteId } : r));
              return { ...j, repas };
            });
            return { ...s, jours };
          });
          set({ semaines: sems });
        },
        ajouterPoids: (poids) => {
          const date = new Date().toISOString().slice(0, 10);
          const hist = [...get().historiquePoids.filter((e) => e.date !== date), { date, poids }];
          set({ historiquePoids: hist, profil: { ...get().profil, poids_kg: poids } });
        },
      };
    },
    { name: "myfuelapp-v1" },
  ),
);

export function useSemaineActive() {
  return useApp((s) => s.semaines.find((x) => x.id === s.semaineActiveId) ?? s.semaines[0]);
}