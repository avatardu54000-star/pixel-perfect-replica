export interface FicheEducation {
  id: string;
  titre: string;
  emoji: string;
  texte: string;
  fait_chiffre: string;
  source: string;
}

export const FICHES: FicheEducation[] = [
  { id: "proteines_seche", titre: "Pourquoi les protéines sont essentielles en sèche", emoji: "💪",
    texte: "En déficit calorique, ton corps puise dans ses réserves. Les protéines protègent ta masse musculaire et soutiennent la satiété.",
    fait_chiffre: "Un apport de 2,2 g/kg/jour préserve jusqu'à 95 % de la masse maigre en sèche.", source: "ISSN Position Stand 2017" },
  { id: "sommeil_perte", titre: "Le sommeil, allié n°1 de la perte de graisse", emoji: "😴",
    texte: "Mal dormir augmente la ghréline (faim) et baisse la leptine (satiété). Tu manges plus sans t'en rendre compte.",
    fait_chiffre: "Dormir < 6h augmente la perte musculaire de 60 % en déficit calorique.", source: "Annals of Internal Medicine, 2010" },
  { id: "fibres_satiete", titre: "Les fibres, l'arme secrète de la satiété", emoji: "🥦",
    texte: "Les fibres ralentissent la digestion et stabilisent la glycémie. Tu tiens plus longtemps entre les repas.",
    fait_chiffre: "L'ANSES recommande 30 g de fibres par jour. La majorité des Français en consomment 18 g.", source: "ANSES 2017" },
  { id: "omega3", titre: "Oméga-3 : les graisses qui font du bien", emoji: "🐟",
    texte: "EPA et DHA réduisent l'inflammation post-entraînement et soutiennent la récupération.",
    fait_chiffre: "2 portions de poisson gras/semaine couvrent 100 % des besoins en oméga-3.", source: "OMS" },
  { id: "hydratation", titre: "Hydratation et performance musculaire", emoji: "💧",
    texte: "Une déshydratation de 2 % réduit déjà ta force et ta concentration.",
    fait_chiffre: "Vise 35 ml d'eau par kg de poids corporel et par jour.", source: "EFSA 2010" },
];