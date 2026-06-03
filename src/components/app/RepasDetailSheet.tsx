import { X, Replace, Clock, Flame, Pencil } from "lucide-react";
import { ALIMENTS_MAP } from "@/data/aliments";
import { getRecette } from "@/lib/recipeLookup";
import { macrosIngredient, macrosRepasPlanifie, resolveIngredients, REPAS_LABELS } from "@/lib/nutrition";
import type { RepasPlanifie } from "@/lib/types";

interface Props {
  repas: RepasPlanifie;
  onClose: () => void;
  onReplace?: () => void;
  onEdit?: () => void;
}

export function RepasDetailSheet({ repas, onClose, onReplace, onEdit }: Props) {
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