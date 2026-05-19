import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { useState } from "react";
import { Send } from "lucide-react";

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
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const next = step + 1;
    const newMsgs: Msg[] = [...msgs, { role: "user", text: input }];
    if (next < QUESTIONS.length) {
      newMsgs.push({ role: "coach", text: QUESTIONS[next] });
    } else {
      newMsgs.push({ role: "coach", text: "Merci 🙏 Je vais construire un planning équilibré et adapté pour la semaine prochaine. Rendez-vous dans l'onglet Semaines !" });
    }
    setMsgs(newMsgs);
    setStep(next);
    setInput("");
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
      </div>
      <div className="fixed inset-x-0 bottom-16 z-40 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-md gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ta réponse…"
            className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
          />
          <button onClick={send} className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}