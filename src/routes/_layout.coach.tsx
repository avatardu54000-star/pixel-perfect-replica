import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { SavoirDuJourCard } from "@/components/app/SavoirDuJourCard";
import { useState } from "react";
import { Send, Loader2, ChefHat, RotateCcw } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/_layout/coach")({
  component: CoachPage,
});

const QUESTIONS: { q: string; label: string }[] = [
  { q: "Comment s'est passée ton énergie cette semaine ? Plutôt en forme ou à plat ?", label: "Énergie" },
  { q: "Et le sommeil — tu as bien dormi cette semaine ?", label: "Sommeil" },
  { q: "Combien de séances de muscu tu as réussi à faire ?", label: "Séances muscu" },
  { q: "Tu as eu des fringales ou des sensations de manque ?", label: "Fringales / manques" },
  { q: "Après les repas, tu te sentais plutôt lourd ou léger ?", label: "Digestion" },
  { q: "Un plat que tu as adoré ou détesté cette semaine ?", label: "Plat marquant" },
  { q: "La semaine prochaine, tu as des imprévus (resto, sortie, déplacement) ?", label: "Imprévus" },
  { q: "Tu as envie de quelle cuisine cette semaine ?", label: "Envies cuisine" },
  { q: "Des contraintes de budget particulières ?", label: "Budget" },
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
  "Merci pour ce check-in complet 🙏 J'ai tout ce qu'il me faut. Voici le résumé ci-dessous — quand tu es prêt·e, on génère ton planning de la semaine.";

interface Msg { role: "coach" | "user"; text: string; }

function CoachPage() {
  const checkInDone = useApp((s) => s.checkInDone);
  const setCheckInDone = useApp((s) => s.setCheckInDone);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "coach", text: "Salut ! C'est l'heure du check-in hebdo 💪 Prêt·e à faire le point ensemble ?" },
    { role: "coach", text: QUESTIONS[0].q },
  ]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMsgs((prev) => [...prev, { role: "user", text }]);
    setAnswers((prev) => [...prev, text]);
    setInput("");
    setLoading(true);
    const nextStep = step + 1;
    // Délai naturel entre les réponses
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 900));
    const ack = ACKS[Math.floor(Math.random() * ACKS.length)];
    const replies: Msg[] = [{ role: "coach", text: ack }];
    if (nextStep < QUESTIONS.length) {
      await new Promise((r) => setTimeout(r, 500 + Math.random() * 400));
      replies.push({ role: "coach", text: QUESTIONS[nextStep].q });
    } else {
      await new Promise((r) => setTimeout(r, 600));
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
      { role: "coach", text: QUESTIONS[0].q },
    ]);
    setStep(0);
    setAnswers([]);
    setCheckInDone(false);
  };
  const finished = step >= QUESTIONS.length;

  return (
    <AppShell title="Coach IA" subtitle="Check-in hebdomadaire, sans jugement">
      <div className="mb-4">
        <SavoirDuJourCard />
      </div>
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
        {finished && checkInDone && (
          <div className="mt-4 rounded-2xl border border-success/30 bg-success/10 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-success/90">Résumé du check-in ✅</p>
            <ul className="mt-3 space-y-2">
              {QUESTIONS.map((qq, i) => (
                <li key={i} className="rounded-xl bg-card/70 p-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{qq.label}</p>
                  <p className="mt-0.5 text-sm leading-snug">{answers[i] ?? <span className="italic text-muted-foreground">—</span>}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/semaines"
                search={{ wizard: 1 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)]"
              >
                <ChefHat className="size-4" /> Générer mon planning
              </Link>
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground"
              >
                <RotateCcw className="size-3.5" /> Refaire le check-in
              </button>
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