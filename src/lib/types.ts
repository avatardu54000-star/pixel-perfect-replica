export type CategorieAliment =
  | "viande" | "poisson" | "laitier" | "feculents"
  | "legumes" | "fruits" | "epicerie" | "custom";

export type TypeRepas = "petit_dejeuner" | "dejeuner" | "diner" | "dessert" | "collation";

export interface MacrosBase {
  kcal: number;
  proteines: number;
  glucides: number;
  lipides: number;
  fibres?: number;
}

export interface Aliment {
  id: string;
  nom: string;
  marque?: string;
  categorie: CategorieAliment;
  pour_100g: MacrosBase;
  prix_kg_estime: number;
  custom?: boolean;
}

export interface IngredientRecette {
  aliment_id: string;
  quantite_g_par_portion: number;
}

export interface Recette {
  id: string;
  nom: string;
  description: string;
  emoji: string;
  cuisine: "italienne" | "asiatique" | "française" | "méditerranéenne" | "brésilienne" | "autre";
  type_repas: TypeRepas;
  batch_cooking: boolean;
  temps_total_minutes: number;
  nb_portions_base: number;
  ingredients: IngredientRecette[];
  etapes: string[];
  pourquoi: string;
  conservation_jours: number;
  tags: string[];
}

export interface RepasPlanifie {
  type: TypeRepas;
  recette_id: string;
  portions: number;
  /** Ingredients override (uniquement pour cette occurrence dans la semaine). */
  custom_ingredients?: IngredientRecette[];
  /**
   * Statut spécifique aux slots "Repas libre" (issus du batch cooking).
   * - undefined / "vide" : non renseigné → bloque le total journalier
   * - "pas_de_repas" : compté comme 0 kcal
   * - "log" : macros saisies manuellement via libre_macros
   */
  libre_statut?: "vide" | "pas_de_repas" | "log";
  libre_macros?: MacrosBase;
  /** Repas explicitement marqué comme non consommé ce jour (0 kcal). */
  non_pris?: boolean;
}

export interface JourPlanifie {
  date: string; // ISO
  repas: RepasPlanifie[];
}

export interface Semaine {
  id: string;
  numero: number;
  date_debut: string;
  jours: JourPlanifie[];
  note_check_in?: string;
  batch_config?: BatchConfig;
}

export interface BatchConfig {
  satMaxHours: 1 | 2 | 3;
  /** Noms (optionnels) des recettes batch, dans l'ordre. La couleur dépend de l'index. */
  recipes: { name: string }[];
  /** Pour chaque jour (0..6) et chaque repas, index de recette ou null = repas frais. */
  assignments: {
    dejeuner: (number | null)[];
    diner: (number | null)[];
  };
}

export interface Profil {
  nom: string;
  sexe: "homme" | "femme";
  age: number;
  taille_cm: number;
  poids_kg: number;
  poids_initial_kg: number;
  masse_musculaire_kg?: number;
  masse_grasse_kg?: number;
  taux_graisse_pct?: number;
  tour_taille_cm?: number;
  activite: "sedentaire" | "leger" | "moderement_actif" | "tres_actif" | "athlete";
  objectif: "seche_musculaire" | "maintien" | "prise_masse";
  objectif_calories_jour: number;
  objectif_proteines_g: number;
}

export interface Preferences {
  bannis_temporaire: string[];
  bannis_definitif: string[];
  cuisines_preferees: string[];
  budget_mensuel: number;
}

export interface PoidsEntry { date: string; poids: number; }