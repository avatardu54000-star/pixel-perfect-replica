import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { coachChat } from "@/lib/coach.functions";

export const Route = createFileRoute("/_layout/coach")({
  component: CoachPage,
});

const QUESTIONS = [
  "Comment s'est passée ta semaine côté énergie ? Tu te sentais bien ou plutôt à plat ?",
  "Et côté faim — tu avais assez à manger ou tu te sentais en manque ?",
  "Des fringales particulières cette semaine ?",
  "Combien de séances de sport tu as pu faire ?",
  "Tu as bien dormi cette semaine ?",
  "Un plat que tu as adoré ? Un que tu as moins aimé ?",
  "La semaine prochaine, des imprévus (resto, sortie) ?",
  "Envie de quelle cuisine la semaine prochaine ?",
  "Des contraintes budget particulières ?",
];

interface Msg { role: "coach" | "user"; text: string; }

function CoachPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "coach", text: "Salut ! C'est l'heure du check-in hebdo 💪 Prêt·e à faire le point ensemble ?" },
    { role: "coach", text: QUESTIONS[0] },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chat = useServerFn(coachChat);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...msgs, { role: "user", text }];
    setMsgs(next);
    setInput("");
    setLoading(true);
    try {
      const history = next.map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      }));
      const { content } = await chat({ data: { messages: history } });
      setMsgs((prev) => [...prev, { role: "coach", text: content || "…" }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur inconnue";
      setMsgs((prev) => [...prev, { role: "coach", text: `⚠️ ${msg}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Coach IA" subtitle="Check-in hebdomadaire, sans jugement">
      <div className="space-y-3 pb-20">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-[var(--shadow-soft)] ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card rounded-bl-md"
              }`}
            >
              {m.role === "coach" && <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider opacity-70">🤖 Coach</p>}
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-card px-4 py-2.5 text-sm shadow-[var(--shadow-soft)]">
              <Loader2 className="size-4 animate-spin" />
            </div>
          </div>
        )}
      </div>
      <div className="fixed inset-x-0 bottom-16 z-40 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-md gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ta réponse…"
            disabled={loading}
            className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
          />
          <button onClick={send} disabled={loading} className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </button>
        </div>
      </div>
    </AppShell>
  );
}