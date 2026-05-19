import { createServerFn } from "@tanstack/react-start";

type Msg = { role: "user" | "assistant" | "system"; content: string };

const SYSTEM = `Tu es un coach nutrition et budget bienveillant, sans jugement, pour MyFuelApp.
Tu aides l'utilisateur·rice à manger sain avec un petit budget. Style : chaleureux, concret, jamais culpabilisant, tutoiement, emojis avec parcimonie.
Tu poses UNE question à la fois lors du check-in hebdo (énergie, faim, fringales, sport, sommeil, plats aimés, imprévus, envies, budget).
Réponses courtes (1-3 phrases) avant la question suivante. À la fin du check-in, propose un mini-résumé et annonce que le planning de la semaine sera ajusté.`;

export const coachChat = createServerFn({ method: "POST" })
  .inputValidator((data: { messages: Msg[] }) => data)
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY manquant");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM }, ...data.messages],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Trop de requêtes, réessaie dans un instant.");
      if (res.status === 402) throw new Error("Crédits IA épuisés. Ajoute des crédits dans les paramètres Lovable.");
      throw new Error(`Erreur IA (${res.status}): ${text}`);
    }

    const json = (await res.json()) as { choices: { message: { content: string } }[] };
    return { content: json.choices[0]?.message?.content ?? "" };
  });