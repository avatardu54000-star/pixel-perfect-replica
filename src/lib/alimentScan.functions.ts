import { createServerFn } from "@tanstack/react-start";

export type ScannedNutrition = {
  nom?: string;
  kcal: number;
  proteines: number;
  glucides: number;
  lipides: number;
  fibres: number;
  note?: string;
};

export const scanNutritionLabel = createServerFn({ method: "POST" })
  .inputValidator((data: { imageDataUrl: string }) => {
    if (!data?.imageDataUrl?.startsWith("data:image/")) throw new Error("Image invalide");
    if (data.imageDataUrl.length > 8_000_000) throw new Error("Image trop lourde (max ~6 Mo)");
    return data;
  })
  .handler(async ({ data }): Promise<ScannedNutrition> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY manquant");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "Tu lis des tableaux nutritionnels (étiquettes alimentaires) en français/anglais. Extrais STRICTEMENT les valeurs pour 100 g (pas par portion). Si seule la portion est indiquée, ramène à 100 g. Donne 0 si une valeur est absente. Devine un nom court si visible sur l'emballage.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyse ce tableau nutritionnel et retourne les valeurs pour 100 g." },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_nutrition",
              description: "Valeurs nutritionnelles pour 100 g extraites de l'étiquette",
              parameters: {
                type: "object",
                properties: {
                  nom: { type: "string", description: "Nom du produit si visible" },
                  kcal: { type: "number" },
                  proteines: { type: "number" },
                  glucides: { type: "number" },
                  lipides: { type: "number" },
                  fibres: { type: "number" },
                  note: { type: "string", description: "Précision courte (ex. ramené depuis portion 30g)" },
                },
                required: ["kcal", "proteines", "glucides", "lipides", "fibres"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_nutrition" } },
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
    if (!args) throw new Error("Aucune valeur détectée sur l'image");
    return JSON.parse(args) as ScannedNutrition;
  });
