import { useState } from "react";
import { Sparkles, X, BookOpen } from "lucide-react";
import { FICHES, type FicheEducation } from "@/data/education";

function getFicheDuJour(): FicheEducation {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return FICHES[dayOfYear % FICHES.length];
}

export function SavoirDuJourCard() {
  const fiche = getFicheDuJour();
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="rounded-2xl bg-accent p-5 text-accent-foreground shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-90">
          <Sparkles className="size-3.5" /> Le savoir du jour
        </div>
        <h3 className="mt-2 font-display text-xl">{fiche.emoji} {fiche.titre}</h3>
        <p className="mt-2 text-sm opacity-95">{fiche.texte}</p>
        <p className="mt-3 rounded-lg bg-white/10 px-3 py-2 text-xs">📊 {fiche.fait_chiffre}</p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[10px] opacity-70">Source · {fiche.source}</p>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold transition hover:bg-white/25"
          >
            <BookOpen className="size-3.5" /> En savoir plus
          </button>
        </div>
      </section>

      {open && <FicheDetailSheet fiche={fiche} onClose={() => setOpen(false)} />}
    </>
  );
}

function FicheDetailSheet({ fiche, onClose }: { fiche: FicheEducation; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full overflow-y-auto rounded-t-3xl bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-card/95 p-5 backdrop-blur">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
              <Sparkles className="mr-1 inline-block size-3" /> Le savoir du jour
            </p>
            <h2 className="mt-1 font-display text-2xl">
              {fiche.emoji} {fiche.titre}
            </h2>
          </div>
          <button onClick={onClose} className="shrink-0 rounded-full bg-muted p-2">
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <p className="text-sm leading-relaxed">{fiche.texte}</p>

          <div className="rounded-2xl bg-muted p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Fait chiffré
            </p>
            <p className="mt-1 text-sm font-medium">{fiche.fait_chiffre}</p>
          </div>

          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Explication complète
            </h3>
            <p className="text-sm leading-relaxed text-foreground">{fiche.explication_complete}</p>
          </section>

          <p className="text-[10px] text-muted-foreground">Source · {fiche.source}</p>
        </div>
      </div>
    </div>
  );
}
