import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { useApp } from "@/lib/store";
import { batchSummary, JOURS_LABELS, macrosJour, prixSemaine, REPAS_LABELS } from "@/lib/nutrition";
import { RECETTES, RECETTES_MAP } from "@/data/recettes";
import { useState } from "react";
import { ChefHat, CheckCircle2, Clock, Package, Plus, Sparkles, X, Wand2 } from "lucide-react";
import type { BatchConfig, RepasPlanifie } from "@/lib/types";
import { RepasDetailSheet } from "@/components/app/RepasDetailSheet";

export const Route = createFileRoute("/_layout/semaines")({
  component: SemainesPage,
});

function SemainesPage() {
  const semaines = useApp((s) => s.semaines);
  const activeId = useApp((s) => s.semaineActiveId);
  const setActive = useApp((s) => s.setSemaineActive);
  const ajouterBatch = useApp((s) => s.ajouterSemaineBatch);
  const profil = useApp((s) => s.profil);
  const changerRepas = useApp((s) => s.changerRepas);
  const semaine = semaines.find((s) => s.id === activeId) ?? semaines[0];

  const [editing, setEditing] = useState<{ jourIdx: number; type: RepasPlanifie["type"] } | null>(null);
  const [detail, setDetail] = useState<{ jourIdx: number; repas: RepasPlanifie } | null>(null);
  const [batchOpen, setBatchOpen] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState<string | null>(null);

  const summary = semaine.batch_config ? batchSummary(semaine) : null;

  return (
    <AppShell title="Semaines" subtitle={`Budget estimé · ${prixSemaine(semaine)} €`}>
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {semaines.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
              s.id === semaine.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            Semaine {s.numero}
          </button>
        ))}
      </div>

      <button
        onClick={() => setBatchOpen(true)}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
      >
        <ChefHat className="size-4" /> Configurer mon batch cooking
        <Plus className="size-4 opacity-70" />
      </button>

      {confirmMsg && (
        <div className="mb-4 flex items-start gap-2 rounded-2xl bg-success/15 px-4 py-3 text-success">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          <p className="flex-1 text-sm font-semibold leading-snug">{confirmMsg}</p>
          <button onClick={() => setConfirmMsg(null)} aria-label="Fermer" className="opacity-70 hover:opacity-100">
            <X className="size-4" />
          </button>
        </div>
      )}

      {summary && (
        <section className="mb-4 rounded-2xl p-4 text-primary-foreground shadow-[var(--shadow-warm)]" style={{ background: "var(--gradient-warm)" }}>
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider opacity-90">
            <ChefHat className="size-3.5" /> Batch cooking samedi
          </div>
          <p className="font-display text-lg leading-snug">
            Tu prépares <b>{summary.recetteIds.length}</b> recettes — environ <b>{Math.round(summary.tempsMinutes / 60 * 10) / 10}h</b> en cuisine — <b>{summary.tupperware}</b> tupperware à prévoir.
          </p>
        </section>
      )}

      <div className="space-y-3">
        {semaine.jours.map((jour, jourIdx) => {
          const m = macrosJour(jour);
          const ok = Math.abs(m.kcal - profil.objectif_calories_jour) < 250;
          return (
            <div key={jour.date} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">{JOURS_LABELS[jourIdx]} {jour.date.slice(8, 10)}/{jour.date.slice(5, 7)}</h3>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  ok ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                }`}>
                  {Math.round(m.kcal)} kcal · {Math.round(m.proteines)}P
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {jour.repas.map((r) => {
                  const recette = RECETTES_MAP[r.recette_id];
                  const slot =
                    semaine.batch_config && (r.type === "dejeuner" || r.type === "diner")
                      ? semaine.batch_config.assignments[r.type === "dejeuner" ? "dejeuner" : "diner"][jourIdx]
                      : null;
                  const slotInfo = slot !== null && slot !== undefined ? semaine.batch_config?.recipes[slot] : null;
                  const slotColor = slot !== null && slot !== undefined ? RECIPE_COLORS[slot]?.dot : null;
                  const displayName = slotInfo?.name?.trim() || recette?.nom;
                  return (
                    <button
                      key={r.type}
                      onClick={() => setDetail({ jourIdx, repas: r })}
                      className="relative rounded-xl bg-muted p-2.5 text-left transition hover:bg-muted/70"
                    >
                      <div className="flex items-center gap-1.5">
                        {slotColor && <span className={`inline-block size-1.5 rounded-full ${slotColor}`} />}
                        <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{REPAS_LABELS[r.type]}</p>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs font-medium">{recette?.emoji} {displayName}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {detail && (
        <RepasDetailSheet
          repas={detail.repas}
          onClose={() => setDetail(null)}
          onReplace={() => {
            setEditing({ jourIdx: detail.jourIdx, type: detail.repas.type });
            setDetail(null);
          }}
        />
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={() => setEditing(null)}>
          <div className="w-full rounded-t-3xl bg-card p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-xl">Remplacer · {REPAS_LABELS[editing.type]}</h3>
              <button onClick={() => setEditing(null)}><X className="size-5" /></button>
            </div>
            <div className="max-h-[60vh] space-y-2 overflow-y-auto">
              {RECETTES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => { changerRepas(semaine.id, editing.jourIdx, editing.type, r.id); setEditing(null); }}
                  className="flex w-full items-center gap-3 rounded-xl bg-muted p-3 text-left transition hover:bg-muted/70"
                >
                  <span className="text-2xl">{r.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{r.nom}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">{r.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {batchOpen && (
        <BatchConfigSheet
          onClose={() => setBatchOpen(false)}
          onConfirm={(cfg) => { ajouterBatch(cfg); setBatchOpen(false); }}
        />
      )}
    </AppShell>
  );
}

const RECIPE_COLORS = [
  { bg: "bg-[#F97316] text-white", chip: "bg-[#F97316] text-white", dot: "bg-[#F97316]", name: "Orange" },
  { bg: "bg-[#16A34A] text-white", chip: "bg-[#16A34A] text-white", dot: "bg-[#16A34A]", name: "Vert" },
  { bg: "bg-[#2563EB] text-white", chip: "bg-[#2563EB] text-white", dot: "bg-[#2563EB]", name: "Bleu" },
  { bg: "bg-[#9333EA] text-white", chip: "bg-[#9333EA] text-white", dot: "bg-[#9333EA]", name: "Violet" },
  { bg: "bg-[#DB2777] text-white", chip: "bg-[#DB2777] text-white", dot: "bg-[#DB2777]", name: "Rose" },
  { bg: "bg-[#0D9488] text-white", chip: "bg-[#0D9488] text-white", dot: "bg-[#0D9488]", name: "Sarcelle" },
];

function BatchConfigSheet({ onClose, onConfirm }: { onClose: () => void; onConfirm: (cfg: BatchConfig) => void }) {
  const [recipes, setRecipes] = useState<{ name: string }[]>([{ name: "" }]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [dej, setDej] = useState<(number | null)[]>(Array(7).fill(null));
  const [din, setDin] = useState<(number | null)[]>(Array(7).fill(null));
  const [satMaxHours, setSat] = useState<1 | 2 | 3>(2);

  const totalAssigned = [...dej, ...din].filter((x) => x !== null).length;
  const tempsEstime = recipes.length * 35;

  const toggleCell = (meal: "dej" | "din", i: number) => {
    const setter = meal === "dej" ? setDej : setDin;
    const arr = meal === "dej" ? dej : din;
    const next = [...arr];
    next[i] = next[i] === currentIdx ? null : currentIdx;
    setter(next);
  };

  const addRecipe = () => {
    if (recipes.length >= RECIPE_COLORS.length) return;
    setRecipes((rs) => [...rs, { name: "" }]);
    setCurrentIdx(recipes.length);
  };

  const removeRecipe = (idx: number) => {
    if (recipes.length <= 1) return;
    const reidx = (v: number | null) => (v === idx ? null : v !== null && v > idx ? v - 1 : v);
    setDej(dej.map(reidx));
    setDin(din.map(reidx));
    setRecipes(recipes.filter((_, i) => i !== idx));
    setCurrentIdx(Math.max(0, currentIdx >= recipes.length - 1 ? recipes.length - 2 : currentIdx));
  };

  const renameRecipe = (idx: number, name: string) => {
    setRecipes(recipes.map((r, i) => (i === idx ? { ...r, name } : r)));
  };

  const countFor = (idx: number) =>
    [...dej, ...din].filter((v) => v === idx).length;

  const valid = totalAssigned > 0;

  const reset = () => {
    setRecipes([{ name: "" }]);
    setCurrentIdx(0);
    setDej(Array(7).fill(null));
    setDin(Array(7).fill(null));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50" onClick={onClose}>
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-card p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl">Mode Batch Cooking</h3>
            <p className="text-xs text-muted-foreground">Tape une case pour l'assigner à la recette active</p>
          </div>
          <button onClick={onClose} aria-label="Fermer"><X className="size-5" /></button>
        </div>

        {/* Sélecteur de recette active */}
        <div className="mb-3 flex flex-wrap gap-2">
          {recipes.map((r, i) => {
            const c = RECIPE_COLORS[i];
            const letter = String.fromCharCode(65 + i);
            const active = i === currentIdx;
            return (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  active ? `${c.chip} ring-2 ring-offset-2 ring-offset-card` : "bg-muted text-muted-foreground"
                }`}
                style={active ? { boxShadow: `0 0 0 2px var(--card), 0 0 0 4px ${c.dot.replace("bg-[", "").replace("]", "")}` } : undefined}
              >
                <span className={`inline-block size-2 rounded-full ${active ? "bg-white" : c.dot}`} />
                Recette {letter}
              </button>
            );
          })}
          {recipes.length < RECIPE_COLORS.length && (
            <button
              onClick={addRecipe}
              className="flex items-center gap-1 rounded-full border-2 border-dashed border-border px-3 py-1.5 text-xs font-bold text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              <Plus className="size-3" /> Nouvelle recette
            </button>
          )}
        </div>

        {/* Grille 7 jours × 2 repas */}
        <div className="mb-4 rounded-2xl bg-muted p-3">
          <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1.5">
            <div />
            {JOURS_LABELS.map((j) => (
              <div key={j} className="text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{j}</div>
            ))}
            <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Déj</div>
            {dej.map((v, i) => (
              <Cell key={`d${i}`} value={v} onClick={() => toggleCell("dej", i)} />
            ))}
            <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Dîn</div>
            {din.map((v, i) => (
              <Cell key={`n${i}`} value={v} onClick={() => toggleCell("din", i)} />
            ))}
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">Cases vides = repas frais non-batch</p>
        </div>

        {/* Noms des recettes + portions */}
        <div className="mb-4 space-y-2">
          {recipes.map((r, i) => {
            const c = RECIPE_COLORS[i];
            const letter = String.fromCharCode(65 + i);
            const count = countFor(i);
            return (
              <div key={i} className="flex items-center gap-2 rounded-xl bg-muted p-2.5">
                <span className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${c.chip}`}>{letter}</span>
                <input
                  value={r.name}
                  onChange={(e) => renameRecipe(i, e.target.value)}
                  placeholder="Laisse vide → l'IA choisit"
                  className="min-w-0 flex-1 rounded-md bg-card px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="shrink-0 rounded-full bg-card px-2 py-0.5 text-[11px] font-bold">{count} portion{count > 1 ? "s" : ""}</span>
                {recipes.length > 1 && (
                  <button onClick={() => removeRecipe(i)} className="text-muted-foreground hover:text-destructive" aria-label="Supprimer">
                    <X className="size-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <Field label="Combien d'heures max en cuisine le samedi ?">
          <Segmented
            value={satMaxHours}
            onChange={(v) => setSat(v as 1 | 2 | 3)}
            options={[1, 2, 3]}
            format={(v) => (v === 3 ? "3h+" : `${v}h`)}
          />
        </Field>

        <div className="my-4 rounded-2xl bg-muted p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="size-3.5" /> Estimation
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Stat icon={<ChefHat className="size-4" />} value={`${recipes.length}`} label="recettes" />
            <Stat icon={<Clock className="size-4" />} value={`~${Math.round((tempsEstime / 60) * 10) / 10}h`} label="cuisine" />
            <Stat icon={<Package className="size-4" />} value={`${totalAssigned}`} label="tupperware" />
          </div>
          {tempsEstime / 60 > satMaxHours && (
            <p className="mt-3 text-xs text-warning">⚠️ Temps estimé au-dessus de ta limite. Réduis le nombre de recettes.</p>
          )}
        </div>

        <button
          disabled={!valid}
          onClick={() =>
            onConfirm({
              satMaxHours,
              recipes,
              assignments: { dejeuner: dej, diner: din },
            })
          }
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-[var(--shadow-warm)] disabled:opacity-50"
        >
          <Wand2 className="size-4" /> Générer la semaine
        </button>
        <button
          onClick={reset}
          className="mt-2 w-full rounded-2xl border border-border bg-card py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted"
        >
          Réinitialiser la grille
        </button>
      </div>
    </div>
  );
}

function Cell({ value, onClick }: { value: number | null; onClick: () => void }) {
  const c = value !== null ? RECIPE_COLORS[value] : null;
  const letter = value !== null ? String.fromCharCode(65 + value) : "";
  return (
    <button
      onClick={onClick}
      className={`flex aspect-square items-center justify-center rounded-lg text-xs font-bold transition active:scale-95 ${
        c ? c.bg : "border-2 border-dashed border-border bg-card text-muted-foreground hover:border-primary"
      }`}
    >
      {letter || "·"}
    </button>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-sm font-semibold">{label}</p>
      {hint && <p className="mb-2 text-xs text-muted-foreground">{hint}</p>}
      {children}
    </div>
  );
}

function Segmented<T extends number>({ value, onChange, options, format }: { value: T; onChange: (v: T) => void; options: T[]; format?: (v: T) => string }) {
  return (
    <div className="flex gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
            value === o ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          {format ? format(o) : o}
        </button>
      ))}
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-xl bg-card p-2.5 text-center">
      <div className="mb-1 flex justify-center text-primary">{icon}</div>
      <p className="font-display text-lg leading-none">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}