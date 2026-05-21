import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { useApp } from "@/lib/store";
import { batchSummary, JOURS_LABELS, macrosJour, prixSemaine, REPAS_LABELS } from "@/lib/nutrition";
import { RECETTES, RECETTES_MAP } from "@/data/recettes";
import { useState } from "react";
import { ChefHat, Clock, Package, Plus, Sparkles, X, Wand2 } from "lucide-react";
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
                  return (
                    <button
                      key={r.type}
                      onClick={() => setDetail({ jourIdx, repas: r })}
                      className="rounded-xl bg-muted p-2.5 text-left transition hover:bg-muted/70"
                    >
                      <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{REPAS_LABELS[r.type]}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs font-medium">{recette?.emoji} {recette?.nom}</p>
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

function BatchConfigSheet({ onClose, onConfirm }: { onClose: () => void; onConfirm: (cfg: BatchConfig) => void }) {
  const [dejeunerCount, setDej] = useState<1 | 2 | 3>(2);
  const [dinerCount, setDin] = useState<1 | 2 | 3>(2);
  const [specialNights, setSpecial] = useState<number[]>([4, 6]);
  const [satMaxHours, setSat] = useState<1 | 2 | 3>(2);

  const toggleNight = (i: number) =>
    setSpecial((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  const totalRec = dejeunerCount + dinerCount;
  const tempsEstime = totalRec * 35; // moyenne minutes

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50" onClick={onClose}>
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-card p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl">Mode Batch Cooking</h3>
            <p className="text-xs text-muted-foreground">Configure ton samedi de prep</p>
          </div>
          <button onClick={onClose} aria-label="Fermer"><X className="size-5" /></button>
        </div>

        <div className="space-y-5">
          <Field label="Combien de recettes pour les déjeuners ?" hint={`Chaque recette couvre ~${Math.ceil(7 / dejeunerCount)} jours`}>
            <Segmented value={dejeunerCount} onChange={(v) => setDej(v as 1 | 2 | 3)} options={[1, 2, 3]} />
          </Field>

          <Field label="Combien de recettes pour les dîners ?" hint={`Chaque recette couvre ~${Math.ceil(7 / dinerCount)} jours`}>
            <Segmented value={dinerCount} onChange={(v) => setDin(v as 1 | 2 | 3)} options={[1, 2, 3]} />
          </Field>

          <Field label="Une recette spéciale certains soirs ?" hint="Plat frais non-batch (ex: poisson le vendredi)">
            <div className="flex flex-wrap gap-2">
              {JOURS_LABELS.map((j, i) => {
                const on = specialNights.includes(i);
                return (
                  <button
                    key={j}
                    onClick={() => toggleNight(i)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      on ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {j} soir
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Combien d'heures max en cuisine le samedi ?">
            <Segmented
              value={satMaxHours}
              onChange={(v) => setSat(v as 1 | 2 | 3)}
              options={[1, 2, 3]}
              format={(v) => (v === 3 ? "3h+" : `${v}h`)}
            />
          </Field>

          <div className="rounded-2xl bg-muted p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="size-3.5" /> Estimation
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Stat icon={<ChefHat className="size-4" />} value={`${totalRec}`} label="recettes" />
              <Stat icon={<Clock className="size-4" />} value={`~${Math.round(tempsEstime / 60 * 10) / 10}h`} label="cuisine" />
              <Stat icon={<Package className="size-4" />} value={`${14 - specialNights.length}`} label="tupperware" />
            </div>
            {tempsEstime / 60 > satMaxHours && (
              <p className="mt-3 text-xs text-warning">⚠️ Temps estimé au-dessus de ta limite. Réduis le nombre de recettes.</p>
            )}
          </div>

          <button
            onClick={() => onConfirm({ dejeunerCount, dinerCount, specialNights, satMaxHours })}
            className="w-full rounded-2xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-[var(--shadow-warm)]"
          >
            Générer la semaine
          </button>
        </div>
      </div>
    </div>
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