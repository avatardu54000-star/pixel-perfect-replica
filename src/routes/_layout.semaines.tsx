import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { useApp } from "@/lib/store";
import { JOURS_LABELS, macrosJour, prixSemaine, REPAS_LABELS } from "@/lib/nutrition";
import { RECETTES, RECETTES_MAP } from "@/data/recettes";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { RepasPlanifie } from "@/lib/types";
import { RepasDetailSheet } from "@/components/app/RepasDetailSheet";

export const Route = createFileRoute("/_layout/semaines")({
  component: SemainesPage,
});

function SemainesPage() {
  const semaines = useApp((s) => s.semaines);
  const activeId = useApp((s) => s.semaineActiveId);
  const setActive = useApp((s) => s.setSemaineActive);
  const ajouter = useApp((s) => s.ajouterSemaine);
  const profil = useApp((s) => s.profil);
  const changerRepas = useApp((s) => s.changerRepas);
  const semaine = semaines.find((s) => s.id === activeId) ?? semaines[0];

  const [editing, setEditing] = useState<{ jourIdx: number; type: RepasPlanifie["type"] } | null>(null);
  const [detail, setDetail] = useState<{ jourIdx: number; repas: RepasPlanifie } | null>(null);

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
        <button onClick={() => ajouter()} className="shrink-0 rounded-full border border-primary/40 bg-card p-2 text-primary">
          <Plus className="size-4" />
        </button>
      </div>

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
    </AppShell>
  );
}