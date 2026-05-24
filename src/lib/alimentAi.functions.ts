import { createServerFn } from "@tanstack/react-start";

export type AiAlimentResult = {
  nom: string;
  categorie: "viande" | "poisson" | "laitier" | "feculents" | "legumes" | "fruits" | "epicerie" | "custom";
  kcal: number;
  proteines: number;
  glucides: number;
  lipides: number;
  fibres: number;
  prix_kg_estime: number;
  note?: string;
};

export const lookupAliment = createServerFn({ method: "POST" })
  .inputValidator((data: { query: string }) => data)
  .handler(async ({ data }): Promise<AiAlimentResult> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY manquant");

    const q = String(data.query ?? "").trim().slice(0, 80);
    if (!q) throw new Error("Requête vide");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "Tu es un expert en nutrition. À partir d'un nom d'aliment en français, renvoie les valeurs nutritionnelles MOYENNES POUR 100 g (valeurs réalistes issues des tables Ciqual/USDA) ainsi qu'un prix estimé en €/kg en France. Si l'aliment est trop ambigu ou inconnu, choisis l'interprétation la plus courante.",
          },
          { role: "user", content: `Aliment recherché : « ${q} »` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_aliment",
              description: "Valeurs nutritionnelles pour 100 g + prix au kg",
              parameters: {
                type: "object",
                properties: {
                  nom: { type: "string", description: "Nom propre et clair de l'aliment" },
                  categorie: {
                    type: "string",
                    enum: ["viande", "poisson", "laitier", "feculents", "legumes", "fruits", "epicerie", "custom"],
                  },
                  kcal: { type: "number" },
                  proteines: { type: "number" },
                  glucides: { type: "number" },
                  lipides: { type: "number" },
                  fibres: { type: "number" },
                  prix_kg_estime: { type: "number", description: "Prix moyen en €/kg en France" },
                  note: { type: "string", description: "Précision courte (ex. cru, cuit, marque générique)" },
                },
                required: ["nom", "categorie", "kcal", "proteines", "glucides", "lipides", "fibres", "prix_kg_estime"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_aliment" } },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Trop de requêtes IA, réessaie dans un instant.");
      if (res.status === 402) throw new Error("Crédits IA épuisés. Ajoute des crédits dans les paramètres Lovable.");
      throw new Error(`Erreur IA (${res.status}): ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices: { message: { tool_calls?: { function: { arguments: string } }[] } }[];
    };
    const args = json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) throw new Error("Réponse IA invalide");
    return JSON.parse(args) as AiAlimentResult;
  });
