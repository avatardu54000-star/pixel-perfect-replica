import { X, Replace, Clock, Flame, Pencil, Sparkles, ThumbsUp, RefreshCw, Wand2 } from "lucide-react";
import { useState } from "react";
import { ALIMENTS_MAP } from "@/data/aliments";
import { RECETTES } from "@/data/recettes";
import { getRecette } from "@/lib/recipeLookup";
import { macrosIngredient, macrosRecette, macrosRepasPlanifie, resolveIngredients, REPAS_LABELS } from "@/lib/nutrition";
import type { Recette, RepasPlanifie } from "@/lib/types";

interface Props {
  repas: RepasPlanifie;
  onClose: () => void;
  onReplace?: () => void;
  onEdit?: () => void;
  onPick?: (recetteId: string) => void;
}

export function RepasDetailSheet({ repas, onClose, onReplace, onEdit, onPick }: Props) {
  const recette = getRecette(repas.recette_id);
  if (!recette) return null;
  const total = macrosRepasPlanifie(repas);
  const ingredients = resolveIngredients(repas);
  const modifiee = !!repas.custom_ingredients;

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="max-h-[88vh] w-full overflow-y-auto rounded-t-3xl bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-border bg-card/95 p-5 backdrop-blur">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
              {REPAS_LABELS[repas.type]}
            </p>
            <h2 className="mt-1 truncate font-display text-2xl">
              {recette.emoji} {recette.nom}
              {modifiee && <span className="ml-2 align-middle text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">· modifiée</span>}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Clock className="size-3" /> {recette.temps_total_minutes} min</span>
              <span className="capitalize">{recette.cuisine}</span>
              {recette.batch_cooking && <span className="rounded-full bg-accent/20 px-2 py-0.5 text-accent-foreground">batch</span>}
            </div>
          </div>
          <button onClick={onClose} className="shrink-0 rounded-full bg-muted p-2"><X className="size-4" /></button>
        </div>

        <div className="space-y-5 p-5">
          {onPick && (
            <AiSuggestionsPanel currentRecette={recette} repas={repas} onPick={onPick} />
          )}

          <div className="grid grid-cols-4 gap-2 rounded-2xl bg-muted p-3 text-center">
            <Stat label="Kcal" value={Math.round(total.kcal)} icon={<Flame className="size-3" />} />
            <Stat label="Prot" value={`${Math.round(total.proteines)}g`} />
            <Stat label="Gluc" value={`${Math.round(total.glucides)}g`} />
            <Stat label="Lip" value={`${Math.round(total.lipides)}g`} />
          </div>

          <section>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Ingrédients ({repas.portions} portion{repas.portions > 1 ? "s" : ""})
            </h3>
            <ul className="divide-y divide-border overflow-hidden rounded-2xl bg-muted/40">
              {ingredients.map((ing) => {
                const a = ALIMENTS_MAP[ing.aliment_id];
                if (!a) return null;
                const grammes = Math.round(ing.quantite_g_par_portion * repas.portions);
                const m = macrosIngredient(a, grammes);
                return (
                  <li key={ing.aliment_id} className="flex items-center justify-between gap-3 p-3 text-sm">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{a.nom}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {grammes} g · P {m.proteines.toFixed(1)} · G {m.glucides.toFixed(1)} · L {m.lipides.toFixed(1)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-card px-2.5 py-1 text-xs font-semibold tabular-nums">
                      {Math.round(m.kcal)} kcal
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="rounded-2xl bg-accent/15 p-4">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground/80">
              ✨ Pourquoi ce plat est bon pour toi
            </p>
            <p className="text-sm leading-relaxed">{recette.pourquoi}</p>
          </section>

          {recette.etapes.length > 0 && (
            <section>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Préparation · {recette.etapes.length} étapes
                </h3>
                <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
                  📦 Tupperware {recette.conservation_jours} j
                </span>
              </div>
              <ol className="space-y-2">
                {recette.etapes.map((e, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                    <span className="pt-0.5 leading-relaxed">{e}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <div className="grid gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-warm)]"
              >
                <Pencil className="size-4" /> Modifier la recette
              </button>
            )}
            {onReplace && (
              <button
                onClick={onReplace}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
              >
                <Replace className="size-4" /> Remplacer par une autre recette
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 inline-flex items-center gap-1 font-display text-lg tabular-nums">{icon}{value}</p>
    </div>
  );
}

type Consistance = "consistant" | "leger";
type CuisineChoice = "italienne" | "asiatique" | "française" | "méditerranéenne" | "brésilienne" | "autre";

function pickAlternatives(current: Recette, n: number, filter?: (r: Recette) => boolean): Recette[] {
  // Same meal type when possible, else any non-dessert
  const sameType = RECETTES.filter(
    (r) => r.id !== current.id && r.type_repas === current.type_repas,
  );
  const pool = (sameType.length >= n ? sameType : RECETTES.filter((r) => r.id !== current.id)).filter(
    (r) => (filter ? filter(r) : true),
  );
  // Prioritize: different cuisine first to vary, then by kcal proximity
  const scored = pool.map((r) => ({
    r,
    score: (r.cuisine === current.cuisine ? 1 : 0) + Math.random() * 0.3,
  }));
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, n).map((s) => s.r);
}

function AiSuggestionsPanel({
  currentRecette,
  repas,
  onPick,
}: {
  currentRecette: Recette;
  repas: RepasPlanifie;
  onPick: (recetteId: string) => void;
}) {
  const [mode, setMode] = useState<"idle" | "validated" | "alternatives" | "precise" | "result">("idle");
  const [alts, setAlts] = useState<Recette[]>([]);
  const [consistance, setConsistance] = useState<Consistance | null>(null);
  const [cuisinePref, setCuisinePref] = useState<CuisineChoice | null>(null);
  const [suggestion, setSuggestion] = useState<Recette | null>(null);

  const reset = () => {
    setMode("idle");
    setAlts([]);
    setConsistance(null);
    setCuisinePref(null);
    setSuggestion(null);
  };

  const handleAutreIdee = () => {
    setAlts(pickAlternatives(currentRecette, 2));
    setMode("alternatives");
  };

  const handlePrecise = () => {
    setConsistance(null);
    setCuisinePref(null);
    setSuggestion(null);
    setMode("precise");
  };

  const computeSuggestion = (c: Consistance, cuis: CuisineChoice) => {
    const targetKcal = macrosRecette(currentRecette.id, repas.portions).kcal;
    const candidates = RECETTES.filter(
      (r) => r.id !== currentRecette.id && r.type_repas !== "dessert",
    );
    let pool = candidates.filter((r) => r.cuisine === cuis);
    if (pool.length === 0) pool = candidates;
    const scored = pool.map((r) => {
      const k = macrosRecette(r.id, repas.portions).kcal;
      const kcalScore = c === "consistant" ? -k : k; // consistant = + de kcal
      return { r, score: kcalScore + (r.type_repas === repas.type ? -50 : 0) };
    });
    scored.sort((a, b) => a.score - b.score);
    const best = scored[0]?.r ?? candidates[0];
    setSuggestion(best);
    setMode("result");
    void targetKcal;
  };

  if (mode === "validated") {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-success/15 px-4 py-3 text-success">
        <ThumbsUp className="size-4" />
        <p className="text-sm font-semibold">Parfait, on garde cette recette !</p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-primary/20 bg-primary/5 p-3">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
        <Sparkles className="size-3" /> Suggestion IA
      </div>

      {mode === "idle" && (
        <div className="grid grid-cols-3 gap-1.5">
          <ActionBtn icon="👍" label="Parfait" onClick={() => setMode("validated")} />
          <ActionBtn icon="🔄" label="Autre idée" onClick={handleAutreIdee} />
          <ActionBtn icon="✏️" label="Précise" onClick={handlePrecise} />
        </div>
      )}

      {mode === "alternatives" && (
        <div>
          <p className="mb-2 text-xs text-muted-foreground">Voici 2 alternatives pour ce repas :</p>
          <div className="space-y-2">
            {alts.map((r) => (
              <button
                key={r.id}
                onClick={() => onPick(r.id)}
                className="flex w-full items-center gap-3 rounded-xl bg-card p-2.5 text-left transition hover:bg-muted"
              >
                <span className="text-2xl">{r.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{r.nom}</p>
                  <p className="line-clamp-1 text-[11px] text-muted-foreground">
                    {r.cuisine} · {Math.round(macrosRecette(r.id, repas.portions).kcal)} kcal · {Math.round(macrosRecette(r.id, repas.portions).proteines)}g P
                  </p>
                </div>
                <RefreshCw className="size-4 shrink-0 text-primary" />
              </button>
            ))}
          </div>
          <button onClick={reset} className="mt-2 w-full text-center text-[11px] font-medium text-muted-foreground hover:text-foreground">
            Annuler
          </button>
        </div>
      )}

      {mode === "precise" && (
        <div className="space-y-3">
          <div>
            <p className="mb-1.5 text-xs font-semibold">1. Tu veux quelque chose de…</p>
            <div className="grid grid-cols-2 gap-1.5">
              <PickBtn active={consistance === "consistant"} onClick={() => setConsistance("consistant")}>🍖 Consistant</PickBtn>
              <PickBtn active={consistance === "leger"} onClick={() => setConsistance("leger")}>🥗 Léger</PickBtn>
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold">2. Quelle cuisine ?</p>
            <div className="grid grid-cols-3 gap-1.5">
              {(["italienne", "asiatique", "française", "méditerranéenne", "brésilienne", "autre"] as CuisineChoice[]).map((c) => (
                <PickBtn key={c} active={cuisinePref === c} onClick={() => setCuisinePref(c)}>
                  {c}
                </PickBtn>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={reset} className="flex-1 rounded-xl bg-muted py-2 text-xs font-medium text-muted-foreground">
              Annuler
            </button>
            <button
              disabled={!consistance || !cuisinePref}
              onClick={() => computeSuggestion(consistance!, cuisinePref!)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50"
            >
              <Wand2 className="size-3.5" /> Générer
            </button>
          </div>
        </div>
      )}

      {mode === "result" && suggestion && (
        <div>
          <p className="mb-2 text-xs text-muted-foreground">D'après tes envies, je te propose :</p>
          <button
            onClick={() => onPick(suggestion.id)}
            className="flex w-full items-center gap-3 rounded-xl bg-card p-3 text-left transition hover:bg-muted"
          >
            <span className="text-3xl">{suggestion.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{suggestion.nom}</p>
              <p className="line-clamp-1 text-[11px] text-muted-foreground">
                {suggestion.cuisine} · {Math.round(macrosRecette(suggestion.id, repas.portions).kcal)} kcal · {Math.round(macrosRecette(suggestion.id, repas.portions).proteines)}g P
              </p>
            </div>
            <RefreshCw className="size-4 shrink-0 text-primary" />
          </button>
          <div className="mt-2 flex gap-2">
            <button onClick={handlePrecise} className="flex-1 rounded-xl bg-muted py-2 text-xs font-medium text-muted-foreground">
              Reformuler
            </button>
            <button onClick={reset} className="flex-1 rounded-xl bg-muted py-2 text-xs font-medium text-muted-foreground">
              Annuler
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function ActionBtn({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-0.5 rounded-xl bg-card px-2 py-2.5 text-[11px] font-semibold transition hover:bg-muted active:scale-95"
    >
      <span className="text-lg leading-none">{icon}</span>
      {label}
    </button>
  );
}

function PickBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-2 py-1.5 text-[11px] font-semibold capitalize transition ${
        active ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}