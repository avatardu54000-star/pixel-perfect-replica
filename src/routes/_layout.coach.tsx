import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { useState } from "react";
import { Send, Loader2, ChefHat, RotateCcw } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useApp } from "@/lib/store";

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

const ACKS = [
  "Ok, je note 📝",
  "Merci pour le partage 🙏",
  "Compris, ça m'aide beaucoup.",
  "Très clair, on va en tenir compte.",
  "Top, je garde ça en tête.",
  "Reçu 5 sur 5 💪",
  "Parfait, ça oriente bien la semaine.",
  "Noté, je vais ajuster en conséquence.",
  "Merci, c'est précieux comme retour.",
];

const FINAL =
  "Merci pour ce check-in complet 🙏 Voici ce que je retiens : on garde un cap équilibré, on adapte les portions à ton énergie et on respecte ton budget. Je te prépare un planning sur mesure — file dans l'onglet Semaines pour le voir ✨";

interface Msg { role: "coach" | "user"; text: string; }

function CoachPage() {
  const checkInDone = useApp((s) => s.checkInDone);
  const setCheckInDone = useApp((s) => s.setCheckInDone);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "coach", text: "Salut ! C'est l'heure du check-in hebdo 💪 Prêt·e à faire le point ensemble ?" },
    { role: "coach", text: QUESTIONS[0] },
  ]);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMsgs((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);
    const nextStep = step + 1;
    // Simulation : délai réaliste 700-1400ms
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 700));
    const ack = ACKS[Math.floor(Math.random() * ACKS.length)];
    const replies: Msg[] = [{ role: "coach", text: ack }];
    if (nextStep < QUESTIONS.length) {
      await new Promise((r) => setTimeout(r, 400));
      replies.push({ role: "coach", text: QUESTIONS[nextStep] });
    } else {
      await new Promise((r) => setTimeout(r, 500));
      replies.push({ role: "coach", text: FINAL });
      setCheckInDone(true);
    }
    setMsgs((prev) => [...prev, ...replies]);
    setStep(nextStep);
    setLoading(false);
  };

  const reset = () => {
    setMsgs([
      { role: "coach", text: "On refait un point ? 💬" },
      { role: "coach", text: QUESTIONS[0] },
    ]);
    setStep(0);
    setCheckInDone(false);
  };
  const finished = step >= QUESTIONS.length;

  return (
    <AppShell title="Coach IA" subtitle="Check-in hebdomadaire, sans jugement">
      <div className="space-y-3 pb-20">
        {checkInDone && (
          <div className="rounded-2xl border border-success/30 bg-success/10 p-4 text-success">
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Check-in terminé ✅</p>
            <p className="mt-1 text-sm leading-snug">
              Ton planning peut maintenant être généré selon tes réponses.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to="/semaines"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                <ChefHat className="size-3.5" /> Configurer mon batch cooking
              </Link>
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground"
              >
                <RotateCcw className="size-3.5" /> Refaire le check-in
              </button>
            </div>
          </div>
        )}
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
      {!finished && <div className="fixed inset-x-0 bottom-16 z-40 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
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
      </div>}
    </AppShell>
  );
}