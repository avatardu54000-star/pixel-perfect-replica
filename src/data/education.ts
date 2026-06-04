export interface FicheEducation {
  id: string;
  titre: string;
  emoji: string;
  texte: string;
  fait_chiffre: string;
  source: string;
  explication_complete: string;
}

export const FICHES: FicheEducation[] = [
  {
    id: "proteines_seche",
    titre: "Pourquoi les protéines sont essentielles en sèche",
    emoji: "💪",
    texte: "En déficit calorique, ton corps puise dans ses réserves. Les protéines protègent ta masse musculaire et soutiennent la satiété.",
    fait_chiffre: "Un apport de 2,2 g/kg/jour préserve jusqu'à 95 % de la masse maigre en sèche.",
    source: "ISSN Position Stand 2017",
    explication_complete:
      "Quand tu es en déficit calorique, ton corps cherche de l'énergie partout. Sans assez de protéines, il puise non seulement dans les graisses mais aussi dans les muscles — ce qui affaiblit ta force et ralentit ton métabolisme de base. Les protéines stimulent également la synthèse musculaire via le mécanisme mTOR et augmentent la thermogenèse alimentaire (tu brûles plus de calories pour les digérer). De plus, elles réduisent la ghréline, l'hormone de la faim, ce qui te permet de tenir plus longtemps entre les repas sans fringale. Pour optimiser : répartis ton apport en 4 prises de 25-40g tout au long de la journée, privilégie les sources complètes (œufs, poisson, volaille, laitages) et n'oublie pas de les entourer d'entraînements de musculation pour maximiser l'anabolisme.",
  },
  {
    id: "sommeil_perte",
    titre: "Le sommeil, allié n°1 de la perte de graisse",
    emoji: "😴",
    texte: "Mal dormir augmente la ghréline (faim) et baisse la leptine (satiété). Tu manges plus sans t'en rendre compte.",
    fait_chiffre: "Dormir < 6h augmente la perte musculaire de 60 % en déficit calorique.",
    source: "Annals of Internal Medicine, 2010",
    explication_complete:
      "Le sommeil régule directement deux hormones clés du métabolisme énergétique : la ghréline (appétit) et la leptine (satiété). Une nuit de moins de 6 heures peut augmenter la ghréline de 28 % et diminuer la leptine de 18 %. Résultat : tu ressens une faim plus intense et moins de satisfaction après un repas. Au-delà des hormones, le manque de sommeil altère la sensibilité à l'insuline et favorise le stockage des graisses au niveau du ventre. La récupération musculaire se fait principalement pendant les phases de sommeil profond, grâce à la sécrétion de l'hormone de croissance. Pour optimiser ton sommeil : vise 7-9h, baisse la température de la chambre à 18-19°C, évite les écrans 1h avant le coucher et privilégie une dernière collation riche en tryptophane (fromage blanc, noix) qui favorise la production de mélatonine.",
  },
  {
    id: "fibres_satiete",
    titre: "Les fibres, l'arme secrète de la satiété",
    emoji: "🥦",
    texte: "Les fibres ralentissent la digestion et stabilisent la glycémie. Tu tiens plus longtemps entre les repas.",
    fait_chiffre: "L'ANSES recommande 30 g de fibres par jour. La majorité des Français en consomment 18 g.",
    source: "ANSES 2017",
    explication_complete:
      "Il existe deux types de fibres : les fibres solubles (avoine, légumineuses, fruits) qui forment un gel dans l'estomac et ralentissent l'absorption des nutriments, et les fibres insolubles (céréales complètes, légumes à feuilles) qui accélèrent le transit intestinal. Ensemble, elles augmentent le volume des aliments dans l'estomac sans ajouter de calories, activant les récepteurs d'étirement qui envoient un signal de satiété au cerveau. Les fibres fermentées par le microbiome produisent aussi des acides gras à chaîne courte (AGCC) comme le butyrate, qui nourrissent les cellules de la muqueuse intestinale et régulent l'inflammation systémique. Pour atteindre 30g/jour : privilégie le pain complet, ajoute des légumineuses à 2 repas par jour, garde la peau des fruits et légumes quand c'est possible, et saupoudre de graines de chia ou de lin sur tes yaourts.",
  },
  {
    id: "omega3",
    titre: "Oméga-3 : les graisses qui font du bien",
    emoji: "🐟",
    texte: "EPA et DHA réduisent l'inflammation post-entraînement et soutiennent la récupération.",
    fait_chiffre: "2 portions de poisson gras/semaine couvrent 100 % des besoins en oméga-3.",
    source: "OMS",
    explication_complete:
      "Les oméga-3 (EPA et DHA) sont des acides gras polyinsaturés essentiels que le corps ne peut pas synthétiser seul. Leur rôle anti-inflammatoire passe par la production de résolvines et protectines, des médiateurs lipidiques qui 'résolvent' l'inflammation chronique liée à l'entraînement intense. Cela réduit les douleurs musculaires (DOMS) et accélère la récupération. Sur le plan métabolique, les oméga-3 améliorent la sensibilité à l'insuline et favorisent l'oxydation des graisses. Le DHA est aussi un composant structural majeur du cerveau et des rétines, améliorant la concentration et la coordination motrice. Sources : saumon, maquereau, sardines, anchois, hareng. Si tu n'aimes pas le poisson, une supplémentation de 1-2g d'huile de poisson par jour est une alternative validée scientifiquement.",
  },
  {
    id: "hydratation",
    titre: "Hydratation et performance musculaire",
    emoji: "💧",
    texte: "Une déshydratation de 2 % réduit déjà ta force et ta concentration.",
    fait_chiffre: "Vise 35 ml d'eau par kg de poids corporel et par jour.",
    source: "EFSA 2010",
    explication_complete:
      "L'eau représente environ 60-70 % du poids corporel et joue un rôle central dans la thermorégulation, le transport des nutriments et l'élimination des déchets métaboliques. Même une perte de 2 % de la masse hydrique (soit 1,5L pour un homme de 75kg) suffit à augmenter la fréquence cardiaque au repos, réduire le volume sanguin et diminuer la viscosité du muscle, ce qui baisse la force et l'endurance. Pendant l'entraînement, la sueur peut faire perdre 0,5 à 2L par heure selon l'intensité et la température. Conseils pratiques : bois un grand verre d'eau au réveil, emmène toujours une gourde, bois par petites gorgées régulières plutôt qu'en grande quantité d'un coup, et après l'effort intense (>1h), privilégie une boisson isotonique pour réapprovisionner aussi le sodium et le potassium perdus dans la sueur.",
  },
  {
    id: "insuline_glucides",
    titre: "L'index glycémique : un outil mal compris",
    emoji: "📈",
    texte: "Ce n'est pas le taux de sucre qui compte, mais la vitesse à laquelle il entre dans le sang. Cela change tout pour l'énergie et le stockage.",
    fait_chiffre: "Un repas à IG bas brûle 80 kcal de plus qu'un repas à IG élevé, tout en procurant plus de satiété.",
    source: "Ludwig et al., JAMA 1999",
    explication_complete:
      "L'index glycémique (IG) mesure la vitesse de montée du glucose sanguin après ingestion d'un aliment. Un pic rapide (IG élevé) déclenche une forte sécrétion d'insuline qui stocke le glucose sous forme de glycogène mais aussi de graisse si les réserves sont pleines. À l'inverse, les aliments à IG bas (légumineuses, céréales complètes, légumes) libèrent l'énergie progressivement, maintenant la glycémie stable et la satiété plus longtemps. Le concept clé est la charge glycémique (IG × quantité de glucides), qui reflète l'impact réel sur le corps. Stratégie : consomme les glucides à IG élevé (pâtes blanches, riz, fruits secs) principalement autour de l'entraînement quand les muscles peuvent les utiliser immédiatement, et privilégie les sources lentes le reste de la journée pour éviter les fringales et les stockages graisseux.",
  },
  {
    id: "repas_post_workout",
    titre: "La fenêtre anabolique existe-t-elle vraiment ?",
    emoji: "⏱️",
    texte: "On pensait qu'il fallait manger dans les 30 minutes après l'effort. La science dit que la fenêtre dure en réalité plusieurs heures.",
    fait_chiffre: "Ton corps reste en mode anabolique jusqu'à 4-5h après l'entraînement de musculation.",
    source: "Schoenfeld et al., JISSN 2013",
    explication_complete:
      "L'idée d'une 'fenêtre anabolique' de 30-60 minutes post-effort est un mythe largement répandu par l'industrie des compléments. En réalité, la synthèse protéique musculaire reste élevée pendant 4 à 5 heures après l'entraînement, voire plus si tu as consommé des protéines avant la séance. Ce qui compte vraiment, c'est ton apport protéique total sur la journée et sa répartition régulière. La seule exception : si tu t'entraînes à jeun le matin, un repas riche en protéines dans les 1-2h qui suivent est recommandé pour stopper le catabolisme. Pour optimiser : consomme 20-40g de protéines de haute qualité (whey, œufs, volaille) dans les 2h suivant l'entraînement, entoure-les de glucides si tu as fait un gros volume (pour reconstituer le glycogène), et n'oublie pas que l'hydratation post-effort est tout aussi cruciale que l'alimentation.",
  },
  {
    id: "musculation_metabolisme",
    titre: "La musculation brûle des calories même au repos",
    emoji: "🔥",
    texte: "Chaque kilo de muscle ajouté augmente ta dépense énergétique de base d'environ 13 kcal par jour au repos.",
    fait_chiffre: "L'effet après-brûleur (EPOC) d'une séance de muscu intense peut durer jusqu'à 38 heures.",
    source: "Borsheim et al., Sports Medicine 2003",
    explication_complete:
      "Le tissu musculaire est métaboliquement actif : il consomme de l'énergie même quand tu es immobile. Plus tu as de masse musculaire, plus ton métabolisme de base est élevé. Mais le vrai atout de la musculation réside dans l'EPOC (Excess Post-exercise Oxygen Consumption), l'oxygène supplémentaire consommé après l'effort pour réparer les fibres, reconstituer le glycogène et restaurer l'homéostasie. Une séance intense avec charges lourdes et courtes pauses génère un EPOC élevé et prolongé. Cela signifie que tu continues de brûler des calories bien après avoir quitté la salle. Pour maximiser cet effet : privilégie les mouvements polyarticulaires (squat, soulevé de terre, rowing), utilise des charges à 70-85 % de ta 1RM avec des séries de 6-12 répétitions, et réduis les temps de repos à 60-90 secondes pour maintenir l'intensité.",
  },
  {
    id: "alcool_perte_graisse",
    titre: "L'alcool : le sabotage silencieux de la sèche",
    emoji: "🍷",
    texte: "L'alcool est le premier carburant que ton corps brûle. Tant qu'il est présent, il ne puise pas dans les graisses.",
    fait_chiffre: "Une consommation modérée réduit la lipolyse (brûlage des graisses) de 73 % pendant plusieurs heures.",
    source: "Siler et al., Am J Clin Nutr 1999",
    explication_complete:
      "L'alcool est traité comme une toxine par le foie : il devient la priorité absolue du métabolisme. Tant que l'alcool circule dans le sang, l'oxydation des lipides est quasiment arrêtée et la synthèse protéique musculaire est inhibée. De plus, l'alcool stimule l'appétit et diminue les inhibitions, ce qui augmente le risque de dérapages alimentaires. Il perturbe aussi le sommeil en réduisant la phase REM, essentielle à la récupération cognitive et physique. Si tu veux optimiser ta sèche sans sacrifier ta vie sociale : limite-toi à 1 verre occasionnel, choisis les boissons faibles en sucre (vin sec, spiritueux sans soda), ne bois jamais à jeun (entoure l'alcool de protéines et de légumes), et hydrate-toi abondamment entre chaque verre.",
  },
  {
    id: "creatine_101",
    titre: "La créatine : le complément le plus sûr et efficace",
    emoji: "⚡",
    texte: "La créatine recharge tes muscles en ATP, le carburant de l'effort explosif. C'est la seule molécule validée par des milliers d'études.",
    fait_chiffre: "La créatine monohydratée augmente la force de 5-15 % et la masse musculaire de 1-2 kg en quelques semaines.",
    source: "Kreider et al., JISSN 2017",
    explication_complete:
      "La créatine est une molécule naturellement présente dans les muscles et synthétisée par le corps à partir d'acides aminés. Elle permet de reconstituer rapidement l'ATP (l'énergie cellulaire), ce qui améliore les performances en efforts courts et intenses (séries de musculation, sprints). Contrairement aux idées reçues, la créatine ne provoque pas de rétention d'eau sous-cutanée désagréable mais une hydratation intracellulaire bénéfique aux muscles. Elle a aussi des bénéfices cognitifs et neurologiques documentés. La forme la plus étudiée et la moins chère est la créatine monohydratée. Protocole : 3-5g par jour, à n'importe quel moment, avec ou sans repas. Pas besoin de phase de charge (20g/jour pendant 5 jours) : la saturation musculaire est atteinte en 2-3 semaines avec une dose quotidienne régulière. Aucun besoin de cycle ni de pause.",
  },
  {
    id: "neat_calories",
    titre: "Le NEAT : les calories que tu brûles sans y penser",
    emoji: "🚶",
    texte: "La thermogenèse liée à l'activité non sportive (NEAT) représente 15-50 % de ta dépense énergétique totale.",
    fait_chiffre: "Une personne active en dehors du sport peut brûler 350 kcal de plus par jour qu'une personne sédentaire.",
    source: "Levine et al., Science 1999",
    explication_complete:
      "Le NEAT (Non-Exercise Activity Thermogenesis) inclut toutes les dépenses énergétiques de la vie quotidienne : marcher, se lever, faire la vaisselle, taper au clavier, gesticuler. Chez certaines personnes, le NEAT peut varier de 200 à 900 kcal par jour selon le niveau d'activité spontanée. En déficit calorique, le corps a tendance à réduire inconsciemment ces micro-mouvements pour économiser de l'énergie — c'est l'adaptation métabolique. Pour contrer cet effet : fais 8000-10000 pas par jour, lève-toi toutes les heures si tu travailles assis, privilégie les escaliers, fais tes courses à pied, et considère un bureau debout. Ces petits gestes cumulés peuvent représenter l'équivalent d'une séance de cardio supplémentaire par semaine sans effort conscient.",
  },
  {
    id: "jeune_intermittent",
    titre: "Le jeûne intermittent : mode ou réalité ?",
    emoji: "🕰️",
    texte: "Réduire sa fenêtre alimentaire à 8h ne magifie pas les résultats, mais peut aider certaines personnes à mieux contrôler leurs calories.",
    fait_chiffre: "Les méta-analyses montrent que le jeûne intermittent n'est pas supérieur au contrôle calorique continu pour la perte de poids.",
    source: "Seimon et al., Obesity Reviews 2019",
    explication_complete:
      "Le jeûne intermittent (16:8, 5:2, etc.) fonctionne principalement par réduction automatique de l'apport calorique quand on raccourcit la fenêtre de prise alimentaire. Hormonalement, le jeûne prolongé (>12-14h) augmente légèrement la sensibilité à l'insuline et favorise la lipolyse, mais ces effets s'estompent quand l'apport calorique total est identique. Le jeûne n'est pas magique et n'est pas adapté à tout le monde : personnes enceintes, adolescents, personnes sous médicaments à heures fixes ou ayant des antécédents de troubles alimentaires doivent l'éviter. Si tu veux essayer : commence par un 12:12, avance progressivement vers 14:10 ou 16:8, garde tes repas principaux nutritifs (protéines + fibres + graisses saines), et n'utilise pas le jeûne comme excuse pour manger n'importe quoi pendant la fenêtre alimentaire.",
  },
  {
    id: "stress_cortisol",
    titre: "Le cortisol : l'hormone qui stocke la graisse du ventre",
    emoji: "🧠",
    texte: "Un stress chronique maintient le cortisol élevé, ce qui stimule l'appétit, favorise les fringales sucrées et dépose la graisse au niveau abdominal.",
    fait_chiffre: "Des niveaux de cortisol chroniquement élevés augmentent le risque d'obésité abdominale de 50 %.",
    source: "Epel et al., Psychosomatic Medicine 2000",
    explication_complete:
      "Le cortisol est une hormone de stress sécrétée par les glandes surrénales. À court terme, elle aide à mobiliser l'énergie. Mais chroniquement élevé, elle augmente la production de glucose par le foie (néoglucogenèse), stimule la lipogenèse (fabrication de graisse) au niveau viscéral et inhibe la synthèse protéique musculaire. Le cortisol affecte aussi le sommeil, ce qui crée un cercle vicieux. Stratégies pour le gérer : pratique une activité physique régulière (même la marche aide), essaie la respiration diaphragmatique ou la méditation de pleine conscience (10 min/jour suffisent), limite le café à 2-3 tasses par jour (la caféine stimule le cortisol), maintiens une alimentation riche en magnésium et en vitamine C, et surtout apprends à déléguer et à poser des limites dans ta vie professionnelle et personnelle.",
  },
  {
    id: "sel_muscle",
    titre: "Le sel : pas si noir que ça pour les sportifs",
    emoji: "🧂",
    texte: "Le sodium est essentiel à la contraction musculaire et à l'équilibre hydrique. En transpirant beaucoup, tu perds du sel qu'il faut remplacer.",
    fait_chiffre: "Un sportif peut perdre 500 à 2000 mg de sodium par heure d'entraînement selon l'intensité.",
    source: "Sawka et al., Medicine & Science in Sports & Exercise 2007",
    explication_complete:
      "Le sodium est un électrolyte crucial pour la transmission nerveuse, la contraction musculaire et le maintien du volume sanguin. En sèche, on a tendance à réduire drastiquement le sel, mais cela peut causer des crampes, de la fatigue et une baisse de performance. Le sodium aide aussi à absorber le glucose et l'eau dans l'intestin, ce qui explique pourquoi les boissons sportives en contiennent. Attention : le sel de table n'est pas le même que le sodium des aliments ultra-transformés qui viennent souvent avec du sucre et des graisses saturées. Privilégie le sel iodé ou le sel de mer pour la cuisson, sale tes repas maison normalement, et si tu transpires beaucement (>1h d'effort intense), envisage une boisson isotonique ou quelques amandes salées post-séance. Les personnes hypertendues doivent toutefois consulter leur médecin.",
  },
  {
    id: "glucides_repas",
    titre: "Quand manger ses glucides pour optimiser la composition",
    emoji: "🍚",
    texte: "Le timing des glucides compte moins que la quantité totale, mais une stratégie intelligente peut booster l'énergie et limiter le stockage.",
    fait_chiffre: "Consommer 80 % de ses glucides avant 16h améliore la sensibilité à l'insuline et réduit la faim nocturne de 25 %.",
    source: "Jakubowicz et al., Obesity 2013",
    explication_complete:
      "Bien que 'les calories soient les calories' à l'échelle d'une journée, le timing des glucides peut influencer ton énergie, ton sommeil et ta satiété. Le matin et autour de l'entraînement, la sensibilité à l'insuline est meilleure et les muscles peuvent stocker le glucose sous forme de glycogène. Le soir, une charge glycémique élevée peut perturber le sommeil et favoriser le stockage graisseux quand l'activité physique est faible. Stratégie pratique : consomme la majorité de tes glucides au petit-déjeuner et au déjeuner (surtout si tu t'entraînes le matin ou le midi), entoure ton entraînement de glucides si tu fais du volume, et au dîner privilégie un repas riche en protéines et légumes avec une portion modérée de glucides complets. Cette approche améliore la concentration diurne, stabilise l'énergie et soutient la récupération nocturne.",
  },
  {
    id: "proteines_vegetales",
    titre: "Les protéines végétales peuvent-elles suffire ?",
    emoji: "🌱",
    texte: "Les protéines végétales sont souvent incomplètes, mais en combinant judicieusement les sources, tu obtiens un profil optimal.",
    fait_chiffre: "Un mélange riz + pois chiches offre un profil aminé comparable au poulet, avec en bonus des fibres et des polyphénols.",
    source: "Mariotti & Gardner, Nutrition Reviews 2019",
    explication_complete:
      "Les protéines sont constituées d'acides aminés, dont 9 sont essentiels (le corps ne peut pas les fabriquer). La plupart des protéines végétales manquent d'un ou plusieurs acides aminés essentiels (la lysine est rare dans les céréales, la méthionine dans les légumineuses). Cependant, en combinant des céréales et des légumineuses dans la même journée (pas nécessairement le même repas), on obtient un profil aminé complet. Sources de qualité : tofu, tempeh, edamame, lentilles, pois chiches, haricots noirs, quinoa, seitan. Attention aux produits transformés : certains steaks végétaux sont riches en sel et en huiles raffinées. Si tu es végétarien ou végétalien, vise 1,8-2,2 g/kg de protéines totales (légèrement plus que les omnivores car le taux d'absorption est inférieur) et diversifie tes sources à chaque repas pour couvrir tous les acides aminés essentiels.",
  },
  {
    id: "microbiome_poids",
    titre: "Ton microbiome influence ta balance",
    emoji: "🦠",
    texte: "Les bactéries intestinales ne digèrent pas seulement les aliments : elles produisent des molécules qui régulent la faim, l'inflammation et le stockage des graisses.",
    fait_chiffre: "Une richesse bactérienne élevée est associée à un indice de masse corporelle 2,5 points plus bas en moyenne.",
    source: "Le Chatelier et al., Nature 2013",
    explication_complete:
      "Le microbiome intestinal contient environ 100 000 milliards de bactéries qui influencent le métabolisme via plusieurs mécanismes : fermentation des fibres en AGCC (butyrate, propionate, acétate) qui régulent l'appétit et l'inflammation ; production de vitamines (K, B12) ; modulation de la barrière intestinale (une barrière poreuse laisse passer des toxines qui déclenchent l'inflammation métabolique). Les Firmicutes (associés à l'obésité) et les Bacteroidetes (associés à la minceur) sont deux phyla clés. Pour nourrir un microbiome diversifié : mange 30 plantes différentes par semaine (fruits, légumes, céréales, légumineuses, noix, graines, herbes, épices), consomme des aliments fermentés (yaourt, kéfir, choucroute, kimchi), limite les édulcorants artificiels et les antibiotiques sauf nécessité médicale, et dors suffisamment car le sommeil influence aussi la composition bactérienne.",
  },
  {
    id: "vitamine_d",
    titre: "Vitamine D : le soleil qui manque aux sportifs",
    emoji: "☀️",
    texte: "La vitamine D est en réalité une hormone stéroïde qui régule plus de 1000 gènes, dont ceux impliqués dans la force musculaire et la récupération.",
    fait_chiffre: "70 % des sportifs en salle ont un taux de vitamine D insuffisant en hiver, ce qui réduit la force de 5-10 %.",
    source: "Larson-Meyer & Willis, Curr Opin Clin Nutr 2010",
    explication_complete:
      "La vitamine D3 (cholécalciférol) est synthétisée par la peau sous l'action des UVB. Elle régule l'absorption du calcium (crucial pour la contraction musculaire et la densité osseuse), la synthèse protéique musculaire, la fonction immunitaire et la récupération. Les personnes vivant en latitudes nordiques (comme la France), travaillant en intérieur, ou ayant une peau foncée sont plus à risque de carence. Symptômes de carence : fatigue chronique, douleurs musculaires inexpliquées, infections fréquentes, baisse de performance. Recommandations : expose bras et jambes 15-30 min par jour sans écran solaire (hors heures de brûlure), consomme des poissons gras et des œufs, et si nécessaire supplémenté en D3 (2000-4000 UI/jour) en hiver après avoir fait doser ta vitamine D (objectif : 40-60 ng/mL).",
  },
  {
    id: "repas_cheats",
    titre: "Le repas libre : stratégie ou dérapage ?",
    emoji: "🍕",
    texte: "Un repas libre planifié peut aider psychologiquement et physiologiquement, mais il doit rester un repas, pas une journée entière de transgression.",
    fait_chiffre: "Un repas libre hebdomadaire augmente la leptine de 30 % et réduit la faim les 2 jours suivants.",
    source: "Dirlewanger et al., Int J Obes 2000",
    explication_complete:
      "En déficit calorique prolongé, les niveaux de leptine (hormone de satiété) chutent, ce qui augmente la faim et ralentit le métabolisme. Un repas libre bien placé peut temporairement remonter la leptine, réinitialiser les hormones thyroïdiennes et donner un break psychologique. Mais attention : le 'cheat meal' peut devenir un 'cheat day' puis un 'cheat weekend', annulant toute la semaine de déficit. Règles d'or : planifie-le à l'avance (idéalement après une grosse séance de jambes ou de dos), mange jusqu'à satiété mais pas jusqu'à nausée, garde les protéines élevées même dans ce repas (pizza avec jambon, burger avec fromage), et reviens immédiatement à ton alimentation structurée le repas suivant. Ne pèse pas le lendemain : la variation de poids est liée à la rétention d'eau et au contenu intestinal, pas à la graisse.",
  },
  {
    id: "proteines_repas_soir",
    titre: "Manger des protéines le soir booste la récupération",
    emoji: "🌙",
    texte: "La synthèse protéique musculaire reste active pendant le sommeil. Un apport de caséine avant le coucher maximise ce processus nocturne.",
    fait_chiffre: "40g de caséine avant le coucher augmentent la synthèse protéique de 22 % pendant le sommeil.",
    source: "Trommelen & van Loon, J Nutr 2016",
    explication_complete:
      "Contrairement à ce qu'on entend souvent, le corps ne stocke pas automatiquement les protéines du soir sous forme de graisse. La synthèse protéique musculaire suit un rythme circadien et reste réceptive aux acides aminés pendant la nuit. La caséine (protéine du lage) se digère lentement (7-8 heures), fournissant un flux continu d'acides aminés pendant le sommeil. Alternative abordable : un fromage blanc 0% ou du skyr nature, qui contiennent majoritairement de la caséine. Si tu préfères éviter les produits laitiers, un shake de protéines végétales (soja, riz+pois) ou une portion de poisson maigre au dîner fonctionnent aussi. L'important est d'avoir consommé au moins 20-40g de protéines dans les 2-3 heures précédant le coucher pour maximiser la récupération musculaire nocturne.",
  },
  {
    id: "marche_fatigue",
    titre: "La marche : le remède sous-estimé à la fatigue chronique",
    emoji: "🌿",
    texte: "Une marche de 20 minutes en plein air réduit le cortisol, améliore la créativité et régule l'appétit mieux qu'une sieste de 30 minutes.",
    fait_chiffre: "Marcher 8000 pas par jour réduit le risque de syndrome métabolique de 50 %.",
    source: "Tudor-Locke & Schuna, Curr Cardiovasc Risk Rep 2012",
    explication_complete:
      "La marche est l'activité physique la plus naturelle et la plus sous-utilisée. Elle stimule la circulation lymphatique, aide à la digestion post-prandiale, expose à la lumière naturelle (régulateur du rythme circadien) et fournit un break mental qui réduit le stress oxydatif du cerveau. Contrairement au cardio intense qui peut augmenter temporairement le cortisol, la marche modérée abaisse les marqueurs de stress et améliore la sensibilité à l'insuline sans fatiguer le système nerveux. Stratégies pratiques : fais des 'walking meetings' au téléphone, descends un arrêt de bus plus tôt, garde tes courses pour le soir, utilise une application de comptage de pas pour te motiver. Même 2×10 minutes de marche rapide après le déjeuner et le dîner suffisent à améliorer la glycémie post-prandiale de manière significative.",
  },
  {
    id: "glutamine_recuperation",
    titre: "La glutamine : l'ami de l'intestin et des défenses",
    emoji: "🛡️",
    texte: "La glutamine est l'acide aminé le plus abondant dans le sang. Elle nourrit les cellules intestinales et soutient le système immunitaire pendant les périodes de surcharge d'entraînement.",
    fait_chiffre: "La glutamine représente 60 % du pool libre d'acides aminés dans le muscle squelettique.",
    source: "Newsholme et al., J Nutr 2001",
    explication_complete:
      "La glutamine est un acide aminé non essentiel qui devient conditionnellement essentiel pendant le stress physique intense. Elle est le carburant préféré des entérocytes (cellules de la muqueuse intestinale) et des lymphocytes T. En période de sèche intense ou de surentraînement, les stocks de glutamine peuvent chuter, ce qui fragilise la barrière intestinale et le système immunitaire. Alors qu'une supplémentation de glutamine isolée n'a pas prouvé d'avantages massifs pour la récupération musculaire chez les sportifs bien nourris, elle peut aider en période de restriction calorique sévère ou d'augmentation soudaine du volume d'entraînement. Sources alimentaires riches : bœuf, volaille, poisson, œufs, chou, épinards, betteraves, haricots. Une cible alimentaire de 5-10g de glutamine par jour est facilement atteinte avec une alimentation variée riche en protéines.",
  },
  {
    id: "cafeine_performances",
    titre: "Caféine : le booster naturel de la force",
    emoji: "☕",
    texte: "La caféine bloque les récepteurs de l'adénosine (fatigue) et stimule la libération d'adrénaline, améliorant force, endurance et concentration.",
    fait_chiffre: "3-6 mg/kg de caféine 30-60 min avant l'effort améliore la performance de 2-4 % en moyenne.",
    source: "Goldstein et al., JISSN 2010",
    explication_complete:
      "La caféine est la substance psychoactive la plus consommée au monde et l'un des rares suppléments sportifs réellement efficaces. Elle agit en bloquant les récepteurs de l'adénosine (molécule du sommeil) dans le cerveau, réduisant la perception de la fatigue. Elle augmente aussi la lipolyse (libération des graisses) et la concentration de calcium dans le muscle, améliorant la contraction. Pour l'optimiser : consomme 3-6 mg/kg 30 à 60 minutes avant l'entraînement (soit 1-2 expressos pour une personne de 70kg), évite de l'ingérer tous les jours pour préserver la sensibilité (cycle 4-5 jours sur / 1-2 jours off), et ne la prends jamais après 14h si tu as des problèmes de sommeil. Attention : la caféine peut augmenter légèrement la pression artérielle et causer des palpitations chez les personnes sensibles. Elle n'est pas magique, mais elle peut faire la différence sur les séries difficiles.",
  },
  {
    id: "entrainement_fasted",
    titre: "Le cardio à jeun : mythe ou réalité ?",
    emoji: "🏃",
    texte: "Faire du cardio le matin à jeun augmente légèrement l'oxydation des graisses pendant l'effort, mais ne garantit pas une perte de graisse totale plus élevée sur la journée.",
    fait_chiffre: "Le cardio à jeun brûle 20 % de lipides de plus pendant la séance, mais l'effet global sur 24h reste identique à un cardio nourri.",
    source: "Schoenfeld et al., JISSN 2014",
    explication_complete:
      "Quand tu es à jeun, les niveaux d'insuline sont bas et le glycogène hépatique est partiellement épuisé, ce qui pousse le corps à utiliser les acides gras comme carburant. Cependant, si tu manges plus tard dans la journée pour compenser, la balance énergétique finale reste la même. Le risque du cardio à jeun : perte de masse musculaire (catabolisme) si la séance est longue ou intense, et risque de vertiges. Si tu choisis cette approche : limite-toi à du cardio basse intensité (marche rapide, vélo léger) de 30-45 minutes maximum, bois de l'eau avant et pendant, et consomme un repas riche en protéines dans l'heure suivante pour stopper le catabolisme. Pour la musculation, évite le jeûn : les séances avec charges nécessitent du glycogène et des acides aminés circulants pour préserver la force et le muscle.",
  },
  {
    id: "repas_pre_workout",
    titre: "Que manger avant la musculation ?",
    emoji: "🥣",
    texte: "Un repas pré-entraînement mal calibré peut te donner des crampes ou te laisser sans énergie. L'équilibre glucides + protéines est la clé.",
    fait_chiffre: "Un repas contenant 1 g/kg de glucides et 0,3 g/kg de protéines 2-3h avant l'entraînement améliore la performance de 10-15 %.",
    source: "Kerksick et al., JISSN 2017",
    explication_complete:
      "Le repas pré-entraînement a pour but de maximiser le glycogène musculaire, de fournir des acides aminés disponibles et d'éviter toute gêne digestive pendant l'effort. Timing : 2-3 heures avant pour un repas complet, 30-60 minutes avant pour un snack léger. Composition : glucides à absorption moyenne (pâtes complètes, riz basmati, pain complet, fruits) pour reconstituer le glycogène sans pic d'insuline brutal, protéines maigres (blanc de poulet, œufs, fromage blanc) pour prévenir le catabolisme, et des graisses limitées (car elles ralentissent la digestion). Évite : aliments riches en fibres juste avant (ballonnements), aliments gras ou frits, et boissons gazeuses. Si tu t'entraînes tôt le matin et que tu n'as pas le temps de manger 2h avant : un shake whey + banane 30 min avant suffit pour fournir l'énergie nécessaire sans inconfort.",
  },
  {
    id: "magnesium_relaxation",
    titre: "Le magnésium : le minéral anti-stress par excellence",
    emoji: "🧘",
    texte: "Le magnésium régule plus de 300 réactions enzymatiques, dont celles du système nerveux et de la relaxation musculaire.",
    fait_chiffre: "75 % de la population française ne couvre pas ses besoins en magnésium, avec des symptômes souvent attribués à tort au stress ou à la fatigue.",
    source: "Coudray et al., Magnesium Research 2005",
    explication_complete:
      "Le magnésium est impliqué dans la transmission nerveuse, la contraction musculaire, la synthèse de l'ATP et la régulation de la glycémie. Un apport insuffisant se traduit par : crampes nocturnes, fatigue chronique, irritabilité, troubles du sommeil, et difficultés de récupération post-entraînement. Les sportifs ont des besoins accrus car la sueur élimine du magnésium. Sources alimentaires : épinards, noix de cajou, amandes, haricots noirs, avocat, chocolat noir (>70 %), graines de courge, saumon. Si tu choisis de supplémenter : privilégie le bisglycinate de magnésium (biodisponibilité élevée, pas d'effet laxatif) ou le thréonate (passe la barrière hémato-encéphalique, bénéfices cognitifs). Dose : 200-400 mg de magnésium élémentaire par jour, au coucher pour favoriser la relaxation. Évite l'oxyde de magnésium (absorption faible) et le chlorure (effet laxatif).",
  },
  {
    id: "lipides_santes",
    titre: "Les bons lipides ne font pas grossir",
    emoji: "🥑",
    texte: "Les graisses saturées et trans sont à limiter, mais les mono- et polyinsaturées sont essentielles à la production hormonale et à l'absorption des vitamines.",
    fait_chiffre: "Les régimes riches en acides gras mono-insaturés (huile d'olive, avocat, amandes) réduisent le risque cardiovasculaire de 20 %.",
    source: "Estruch et al., N Engl J Med 2013 (PREDIMED)",
    explication_complete:
      "Les graisses sont indispensables : elles constituent les membranes cellulaires, servent de précurseurs aux hormones stéroïdiennes (testostérone, œstrogènes, cortisol), transportent les vitamines liposolubles (A, D, E, K) et fournissent une énergie dense (9 kcal/g). La qualité compte plus que la quantité. À favoriser : mono-insaturés (huile d'olive extra-vierge, avocat, amandes, noix de cajou), oméga-3 (poisson gras, graines de lin, chia), et sources naturelles de saturés (œufs, viande, noix de coco en quantité modérée). À limiter fortement : graisses trans (pâtisseries industrielles, friture réchauffée, snacks), huiles raffinées riches en oméga-6 (tournesol, maïs, soja en excès qui déséquilibrent le ratio oméga-6/oméga-3). Objectif : 25-35 % de tes calories en lipides, avec un ratio oméga-6/oméga-3 proche de 4:1 ou mieux 2:1.",
  },
  {
    id: "eau_minceur",
    titre: "Boire avant les repas : l'astuce méconnue",
    emoji: "🥤",
    texte: "Boire 500 ml d'eau 30 minutes avant un repas augmente la satiété et réduit spontanément l'apport calorique du repas suivant.",
    fait_chiffre: "Cette simple habitude réduit l'apport calorique de 13 % au repas suivant, sans effort de volonté.",
    source: "Boschmann et al., J Clin Endocrinol Metab 2003",
    explication_complete:
      "L'eau occupe de l'espace dans l'estomac, active les récepteurs d'étirement et stimule brièvement le métabolisme via la thermogenèse (l'organisme doit chauffer l'eau à température corporelle). De plus, la soif est souvent confondue avec la faim : boire avant de manger permet de distinguer les deux signaux. Conseils pratiques : garde une bouteille d'eau sur ton bureau, fixe des rappels sur ton téléphone, bois un grand verre au réveil et un autre 30 min avant chaque repas principal. Si l'eau plate te lasse : ajoute des rondelles de citron, du concombre, des feuilles de menthe ou utilise une eau pétillante sans sucre. Attention : ne bois pas excessivement pendant le repas car cela peut diluer les sucs digestifs et ralentir la digestion.",
  },
  {
    id: "chocolat_noir",
    titre: "Le chocolat noir : plaisir et antioxydants",
    emoji: "🍫",
    texte: "Le cacao brut est l'un des aliments les plus riches en polyphénols antioxydants, supérieur même au thé vert et aux baies.",
    fait_chiffre: "20g de chocolat noir à 85 % contiennent autant de flavonoïdes qu'une tasse de thé vert, avec seulement 120 kcal.",
    source: "Crozier et al., Chemistry Central Journal 2011",
    explication_complete:
      "Les flavonoïdes du cacao (épicaléchine, catéchine, procyanidines) améliorent la fonction endothéliale (santé des vaisseaux sanguins), réduisent l'inflammation oxydative et peuvent modestement améliorer l'insulinosensibilité. Le cacao contient aussi de la théobromine, un alcaloïde qui stimule légèrement et améliore l'humeur. Pour profiter de ces bienfaits sans les inconvénients : choisis du chocolat noir à au moins 70 % de cacao (idéalement 85 %), limite la portion à 20-30g par jour, et compte ces calories dans ton budget quotidien. Évite les chocolats 'noirs' industriels à 50 % qui contiennent encore beaucoup de sucre et de beurre de cacao ajouté. Le cacao en poudre non sucré (pur cacao) est aussi une excellente option à ajouter dans ton skyr ou tes smoothies.",
  },
  {
    id: "repos_muscles",
    titre: "Le repos : quand les muscles grandissent vraiment",
    emoji: "💤",
    texte: "Ce n'est pas pendant l'entraînement que le muscle se construit, mais pendant le repos qui suit. Sans récupération, le surmenage mène à la stagnation.",
    fait_chiffre: "48 à 72 heures de repos sont nécessaires pour une récupération musculaire complète après une séance intense.",
    source: "Schoenfeld, Sports Medicine 2010",
    explication_complete:
      "L'entraînement de musculation crée des micro-lésions dans les fibres musculaires. C'est pendant la phase de récupération que le corps répare ces dégâts et supercompense en épaississant les fibres (hypertrophie). Ce processus nécessite du temps, des acides aminés et une inflammation contrôlée. Si tu t'entraînes le même groupe musculaire trop souvent sans récupération suffisante, tu entres en surentraînement : les muscles ne se réparent pas, le système nerveux central s'épuise, les performances stagnent ou régressent, et le risque de blessure augmente. Stratégie de récupération : dormir 7-9h par nuit, consommer suffisamment de protéines (1,6-2,2 g/kg), hydrater, pratiquer des sessions de mobilité ou de yoga léger les jours de repos, et utiliser la cryothérapie (douche froide) ou le foam rolling pour améliorer la circulation. Alterne les groupes musculaires : si tu fais pecs le lundi, attends au moins 48h avant de les travailler à nouveau.",
  },
];
