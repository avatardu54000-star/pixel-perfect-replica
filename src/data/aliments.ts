import type { Aliment } from "@/lib/types";

export const ALIMENTS: Aliment[] = [
  // Viandes
  { id: "poulet_blanc", nom: "Blanc de poulet", categorie: "viande", pour_100g: { kcal: 110, proteines: 23, glucides: 0, lipides: 1.5, fibres: 0 }, prix_kg_estime: 12 },
  { id: "poulet_cuisse", nom: "Cuisse de poulet", categorie: "viande", pour_100g: { kcal: 170, proteines: 19, glucides: 0, lipides: 10 }, prix_kg_estime: 8 },
  { id: "boeuf_hache_5", nom: "Bœuf haché 5%", categorie: "viande", pour_100g: { kcal: 130, proteines: 22, glucides: 0, lipides: 5 }, prix_kg_estime: 15 },
  { id: "boeuf_hache_15", nom: "Bœuf haché 15%", categorie: "viande", pour_100g: { kcal: 215, proteines: 19, glucides: 0, lipides: 15 }, prix_kg_estime: 11 },
  { id: "filet_mignon_porc", nom: "Filet mignon de porc", categorie: "viande", pour_100g: { kcal: 130, proteines: 22, glucides: 0, lipides: 4 }, prix_kg_estime: 14 },
  { id: "dinde_emincee", nom: "Dinde émincée", categorie: "viande", pour_100g: { kcal: 105, proteines: 22, glucides: 0, lipides: 1.5 }, prix_kg_estime: 13 },
  // Poissons
  { id: "saumon", nom: "Saumon frais", categorie: "poisson", pour_100g: { kcal: 200, proteines: 20, glucides: 0, lipides: 13 }, prix_kg_estime: 22 },
  { id: "thon_conserve", nom: "Thon au naturel", categorie: "poisson", pour_100g: { kcal: 110, proteines: 26, glucides: 0, lipides: 1 }, prix_kg_estime: 18 },
  { id: "sardines", nom: "Sardines", categorie: "poisson", pour_100g: { kcal: 200, proteines: 25, glucides: 0, lipides: 11 }, prix_kg_estime: 10 },
  // Laitiers
  { id: "fromage_blanc_0", nom: "Fromage blanc 0%", categorie: "laitier", pour_100g: { kcal: 47, proteines: 8, glucides: 4, lipides: 0.2 }, prix_kg_estime: 3 },
  { id: "skyr", nom: "Skyr nature", categorie: "laitier", pour_100g: { kcal: 60, proteines: 11, glucides: 4, lipides: 0.2 }, prix_kg_estime: 6 },
  { id: "yaourt_grec_0", nom: "Yaourt grec 0%", categorie: "laitier", pour_100g: { kcal: 60, proteines: 10, glucides: 4, lipides: 0 }, prix_kg_estime: 5 },
  { id: "oeufs", nom: "Œufs entiers", categorie: "laitier", pour_100g: { kcal: 150, proteines: 13, glucides: 0.5, lipides: 11 }, prix_kg_estime: 7 },
  { id: "mozzarella_light", nom: "Mozzarella légère", categorie: "laitier", pour_100g: { kcal: 200, proteines: 22, glucides: 1, lipides: 12 }, prix_kg_estime: 10 },
  { id: "cottage_cheese", nom: "Cottage cheese", categorie: "laitier", pour_100g: { kcal: 95, proteines: 13, glucides: 3, lipides: 4 }, prix_kg_estime: 9 },
  // Féculents
  { id: "riz_basmati", nom: "Riz basmati", categorie: "feculents", pour_100g: { kcal: 350, proteines: 8, glucides: 78, lipides: 1, fibres: 1.5 }, prix_kg_estime: 3 },
  { id: "riz_complet", nom: "Riz complet", categorie: "feculents", pour_100g: { kcal: 340, proteines: 8, glucides: 72, lipides: 2.5, fibres: 3 }, prix_kg_estime: 3.5 },
  { id: "pates_completes", nom: "Pâtes complètes", categorie: "feculents", pour_100g: { kcal: 340, proteines: 13, glucides: 64, lipides: 2.5, fibres: 8 }, prix_kg_estime: 2.5 },
  { id: "quinoa", nom: "Quinoa", categorie: "feculents", pour_100g: { kcal: 370, proteines: 14, glucides: 64, lipides: 6, fibres: 7 }, prix_kg_estime: 8 },
  { id: "avoine", nom: "Flocons d'avoine", categorie: "feculents", pour_100g: { kcal: 370, proteines: 13, glucides: 60, lipides: 7, fibres: 10 }, prix_kg_estime: 3 },
  { id: "pain_complet", nom: "Pain complet", categorie: "feculents", pour_100g: { kcal: 250, proteines: 10, glucides: 45, lipides: 3, fibres: 7 }, prix_kg_estime: 4 },
  { id: "lentilles", nom: "Lentilles vertes", categorie: "feculents", pour_100g: { kcal: 115, proteines: 9, glucides: 20, lipides: 0.4, fibres: 8 }, prix_kg_estime: 3 },
  { id: "pois_chiches", nom: "Pois chiches", categorie: "feculents", pour_100g: { kcal: 140, proteines: 8, glucides: 22, lipides: 2.5, fibres: 7 }, prix_kg_estime: 3 },
  // Légumes
  { id: "brocoli", nom: "Brocoli", categorie: "legumes", pour_100g: { kcal: 35, proteines: 3, glucides: 4, lipides: 0.4, fibres: 3 }, prix_kg_estime: 3 },
  { id: "courgette", nom: "Courgette", categorie: "legumes", pour_100g: { kcal: 17, proteines: 1.2, glucides: 2, lipides: 0.3, fibres: 1.5 }, prix_kg_estime: 2.5 },
  { id: "epinards", nom: "Épinards", categorie: "legumes", pour_100g: { kcal: 23, proteines: 3, glucides: 1, lipides: 0.4, fibres: 2 }, prix_kg_estime: 4 },
  { id: "haricots_verts", nom: "Haricots verts", categorie: "legumes", pour_100g: { kcal: 30, proteines: 2, glucides: 4, lipides: 0.2, fibres: 3 }, prix_kg_estime: 4 },
  { id: "champignons", nom: "Champignons de Paris", categorie: "legumes", pour_100g: { kcal: 22, proteines: 3, glucides: 1, lipides: 0.3, fibres: 1 }, prix_kg_estime: 5 },
  { id: "poivrons", nom: "Poivrons", categorie: "legumes", pour_100g: { kcal: 30, proteines: 1, glucides: 5, lipides: 0.3, fibres: 2 }, prix_kg_estime: 3 },
  { id: "tomates", nom: "Tomates", categorie: "legumes", pour_100g: { kcal: 18, proteines: 0.9, glucides: 3, lipides: 0.2, fibres: 1.5 }, prix_kg_estime: 3 },
  { id: "carottes", nom: "Carottes", categorie: "legumes", pour_100g: { kcal: 35, proteines: 0.9, glucides: 7, lipides: 0.2, fibres: 3 }, prix_kg_estime: 2 },
  { id: "oignons", nom: "Oignons", categorie: "legumes", pour_100g: { kcal: 40, proteines: 1, glucides: 8, lipides: 0.1, fibres: 1.5 }, prix_kg_estime: 1.5 },
  { id: "ail", nom: "Ail", categorie: "legumes", pour_100g: { kcal: 150, proteines: 6, glucides: 28, lipides: 0.5 }, prix_kg_estime: 8 },
  // Fruits
  { id: "banane", nom: "Banane", categorie: "fruits", pour_100g: { kcal: 90, proteines: 1, glucides: 20, lipides: 0.3, fibres: 2.5 }, prix_kg_estime: 2 },
  { id: "pomme", nom: "Pomme", categorie: "fruits", pour_100g: { kcal: 52, proteines: 0.3, glucides: 12, lipides: 0.2, fibres: 2.5 }, prix_kg_estime: 2.5 },
  { id: "fruits_rouges", nom: "Fruits rouges", categorie: "fruits", pour_100g: { kcal: 50, proteines: 1, glucides: 10, lipides: 0.3, fibres: 4 }, prix_kg_estime: 8 },
  { id: "citron", nom: "Citron", categorie: "fruits", pour_100g: { kcal: 30, proteines: 1, glucides: 6, lipides: 0.3 }, prix_kg_estime: 3 },
  // Épicerie
  { id: "huile_olive", nom: "Huile d'olive", categorie: "epicerie", pour_100g: { kcal: 900, proteines: 0, glucides: 0, lipides: 100 }, prix_kg_estime: 12 },
  { id: "tomates_concassees", nom: "Tomates concassées", categorie: "epicerie", pour_100g: { kcal: 25, proteines: 1, glucides: 4, lipides: 0.2 }, prix_kg_estime: 2 },
  { id: "moutarde", nom: "Moutarde à l'ancienne", categorie: "epicerie", pour_100g: { kcal: 120, proteines: 7, glucides: 6, lipides: 8 }, prix_kg_estime: 6 },
  { id: "amandes", nom: "Amandes", categorie: "epicerie", pour_100g: { kcal: 580, proteines: 21, glucides: 10, lipides: 50, fibres: 12 }, prix_kg_estime: 18 },
  { id: "cacao", nom: "Cacao non sucré", categorie: "epicerie", pour_100g: { kcal: 230, proteines: 20, glucides: 15, lipides: 14, fibres: 33 }, prix_kg_estime: 15 },
];

export const ALIMENTS_MAP = Object.fromEntries(ALIMENTS.map((a) => [a.id, a]));