import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { useApp } from "@/lib/store";
import { batchSummary, isRepasLibre, JOURS_LABELS, macrosJourSafe, prixSemaine, REPAS_LABELS } from "@/lib/nutrition";
import { RECETTES } from "@/data/recettes";
import { getRecette } from "@/lib/recipeLookup";
import { useEffect, useState } from "react";
import { Ban, ChefHat, CheckCircle2, Clock, MessageCircle, Package, Plus, Sparkles, X, Wand2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { BatchConfig, RepasPlanifie } from "@/lib/types";
import type { MacrosBase } from "@/lib/types";
import { RepasDetailSheet } from "@/components/app/RepasDetailSheet";
import { RepasEditSheet } from "@/components/app/RepasEditSheet";

export const Route = createFileRoute("/_layout/semaines")({
  validateSearch: (search: Record<string, unknown>) => ({
    wizard: search.wizard === 1 || search.wizard === "1" ? 1 : undefined,
  }),
  component: SemainesPage,
});

function SemainesPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const semaines = useApp((s) => s.semaines);
  const activeId = useApp((s) => s.semaineActiveId);
  const setActive = useApp((s) => s.setSemaineActive);
  const ajouterBatch = useApp((s) => s.ajouterSemaineBatch);
  const profil = useApp((s) => s.profil);
  const changerRepas = useApp((s) => s.changerRepas);
  const setRepasLibre = useApp((s) => s.setRepasLibre);
  const toggleNonPris = useApp((s) => s.toggleNonPris);
  const checkInDone = useApp((s) => s.checkInDone);
  const semaine = semaines.find((s) => s.id === activeId) ?? semaines[0];

  const [editing, setEditing] = useState<{ jourIdx: number; type: RepasPlanifie["type"] } | null>(null);
  const [detail, setDetail] = useState<{ jourIdx: number; repas: RepasPlanifie } | null>(null);
  const [editIng, setEditIng] = useState<{ jourIdx: number; repas: RepasPlanifie } | null>(null);
  const [batchOpen, setBatchOpen] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState<string | null>(null);
  const [libreLog, setLibreLog] = useState<{ jourIdx: number; type: RepasPlanifie["type"] } | null>(null);

  useEffect(() => {
    if (search.wizard === 1 && checkInDone) {
      setBatchOpen(true);
      navigate({ search: {}, replace: true });
    }
  }, [search.wizard, checkInDone, navigate]);

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

      {checkInDone ? (
        <button
          onClick={() => setBatchOpen(true)}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
        >
          <ChefHat className="size-4" /> Configurer mon batch cooking
          <Plus className="size-4 opacity-70" />
        </button>
      ) : (
        <Link
          to="/coach"
          className="mb-4 flex w-full items-start gap-3 rounded-2xl border border-dashed border-accent/50 bg-accent/10 p-4 text-left transition hover:bg-accent/20"
        >
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground">
            <MessageCircle className="size-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">Fais d'abord ton check-in avec le Coach</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Quelques questions sur ton énergie, tes entraînements et tes envies — l'IA s'en sert pour générer ton planning. →
            </p>
          </div>
        </Link>
      )}

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
          const m = macrosJourSafe(jour, jourIdx, semaine);
          const kcalMax = profil.objectif_calories_jour; // 2100
          const protMin = profil.objectif_proteines_g; // 170
          const incomplete = m === null;
          const kcalOver = !incomplete && m.kcal > kcalMax;
          const protUnder = !incomplete && m.proteines < protMin;
          const quotaKo = !incomplete && (kcalOver || protUnder);
          return (
            <div key={jour.date} className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">{JOURS_LABELS[jourIdx]} {jour.date.slice(8, 10)}/{jour.date.slice(5, 7)}</h3>
                {incomplete ? (
                  <span
                    className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
                    title="Renseigne tous les repas libres pour calculer le total"
                  >
                    — kcal · — P
                  </span>
                ) : (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums ${
                      quotaKo ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"
                    }`}
                    title={`Max ${kcalMax} kcal · Min ${protMin}g protéines`}
                  >
                    <span className={kcalOver ? "font-bold" : ""}>{Math.round(m!.kcal)}</span>
                    /{kcalMax} kcal ·{" "}
                    <span className={protUnder ? "font-bold" : ""}>{Math.round(m!.proteines)}</span>
                    /{protMin}P
                  </span>
                )}
              </div>
              {incomplete && (
                <p className="mb-2 text-[11px] font-medium text-muted-foreground">
                  ⏳ Total masqué — renseigne chaque repas libre ci-dessous
                </p>
              )}
              {quotaKo && !incomplete && (
                <p className="mb-2 text-[11px] font-medium text-destructive">
                  ⚠ Quota non respecté :
                  {kcalOver && ` +${Math.round(m!.kcal - kcalMax)} kcal au-dessus du max`}
                  {kcalOver && protUnder && " · "}
                  {protUnder && `${Math.round(protMin - m!.proteines)}g de protéines manquantes`}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {jour.repas.map((r) => {
                  const recette = getRecette(r.recette_id);
                  const libre = isRepasLibre(r, jourIdx, semaine);
                  const slot =
                    semaine.batch_config && (r.type === "dejeuner" || r.type === "diner")
                      ? semaine.batch_config.assignments[r.type === "dejeuner" ? "dejeuner" : "diner"][jourIdx]
                      : null;
                  const isLibre = libre;
                  if (isLibre) {
                    const st = r.libre_statut ?? "vide";
                    if (st === "pas_de_repas") {
                      return (
                        <button
                          key={r.type}
                          onClick={() => setRepasLibre(semaine.id, jourIdx, r.type, { statut: "vide" })}
                          className="rounded-xl border border-border bg-muted/30 p-2.5 text-left opacity-60 transition hover:opacity-90"
                        >
                          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/70">{REPAS_LABELS[r.type]}</p>
                          <p className="mt-0.5 text-xs font-medium text-muted-foreground line-through">Pas de repas</p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground/70">0 kcal · tap pour annuler</p>
                        </button>
                      );
                    }
                    if (st === "log" && r.libre_macros) {
                      return (
                        <button
                          key={r.type}
                          onClick={() => setLibreLog({ jourIdx, type: r.type })}
                          className="rounded-xl border border-warning/40 bg-warning/10 p-2.5 text-left transition hover:bg-warning/15"
                        >
                          <p className="text-[9px] font-bold uppercase tracking-wider text-warning">{REPAS_LABELS[r.type]} · logué</p>
                          <p className="mt-0.5 text-xs font-medium">📝 {Math.round(r.libre_macros.kcal)} kcal · {Math.round(r.libre_macros.proteines)}g P</p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">tap pour modifier</p>
                        </button>
                      );
                    }
                    return (
                      <div
                        key={r.type}
                        className="rounded-xl border border-dashed border-border bg-muted/40 p-2.5 text-left"
                      >
                        <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/70">
                          {REPAS_LABELS[r.type]}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-muted-foreground">Repas libre 🌿</p>
                        <div className="mt-2 flex flex-col gap-1">
                          <button
                            onClick={() => setLibreLog({ jourIdx, type: r.type })}
                            className="rounded-md bg-primary/15 px-2 py-1 text-[10px] font-semibold text-primary hover:bg-primary/25"
                          >
                            + Ajouter ce que j'ai mangé
                          </button>
                          <button
                            onClick={() => setRepasLibre(semaine.id, jourIdx, r.type, { statut: "pas_de_repas" })}
                            className="rounded-md bg-muted px-2 py-1 text-[10px] font-semibold text-muted-foreground hover:bg-muted/70"
                          >
                            ✕ Pas de repas
                          </button>
                        </div>
                      </div>
                    );
                  }
                  // fallback (kept for safety, was unreachable above)
                  if (false) {
                    return (
                      <div
                        key={r.type}
                        className="rounded-xl border border-dashed border-border bg-muted/40 p-2.5 text-left"
                      >
                        <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/70">
                          {REPAS_LABELS[r.type]}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-muted-foreground">Repas libre 🌿</p>
                      </div>
                    );
                  }
                  const slotInfo = slot !== null && slot !== undefined ? semaine.batch_config?.recipes[slot] : null;
                  const slotColor = slot !== null && slot !== undefined ? RECIPE_COLORS[slot]?.dot : null;
                  const displayName = slotInfo?.name?.trim() || recette?.nom;
                  if (r.non_pris) {
                    return (
                      <button
                        key={r.type}
                        onClick={() => toggleNonPris(semaine.id, jourIdx, r.type)}
                        className="rounded-xl border border-border bg-muted/30 p-2.5 text-left opacity-60 transition hover:opacity-90"
                      >
                        <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/70">{REPAS_LABELS[r.type]}</p>
                        <p className="mt-0.5 text-xs font-medium text-muted-foreground line-through">Non pris 🚫</p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground/70">0 kcal · tap pour annuler</p>
                      </button>
                    );
                  }
                  return (
                    <div
                      key={r.type}
                      onClick={() => setDetail({ jourIdx, repas: r })}
                      className="relative cursor-pointer rounded-xl bg-muted p-2.5 text-left transition hover:bg-muted/70"
                    >
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); toggleNonPris(semaine.id, jourIdx, r.type); }}
                        className="absolute right-1 top-1 rounded-full p-1 text-[10px] text-muted-foreground/50 transition hover:bg-muted-foreground/10 hover:text-destructive"
                        title="Non pris ce jour"
                      >
                        <Ban className="size-3" />
                      </button>
                      <div className="flex items-center gap-1.5">
                        {slotColor && <span className={`inline-block size-1.5 rounded-full ${slotColor}`} />}
                        <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{REPAS_LABELS[r.type]}</p>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-xs font-medium">{recette?.emoji} {displayName}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {libreLog && (() => {
        const jour = semaine.jours[libreLog.jourIdx];
        const repas = jour.repas.find((r) => r.type === libreLog.type);
        const initial = repas?.libre_macros;
        return (
          <LibreLogSheet
            initial={initial}
            label={`${JOURS_LABELS[libreLog.jourIdx]} · ${REPAS_LABELS[libreLog.type]}`}
            onClose={() => setLibreLog(null)}
            onClear={() => {
              setRepasLibre(semaine.id, libreLog.jourIdx, libreLog.type, { statut: "vide" });
              setLibreLog(null);
            }}
            onSubmit={(macros) => {
              setRepasLibre(semaine.id, libreLog.jourIdx, libreLog.type, { statut: "log", macros });
              setLibreLog(null);
              setConfirmMsg("Repas enregistré ✏️");
              setTimeout(() => setConfirmMsg(null), 2500);
            }}
          />
        );
      })()}

      {detail && (
        <RepasDetailSheet
          repas={detail.repas}
          onClose={() => setDetail(null)}
          onReplace={() => {
            setEditing({ jourIdx: detail.jourIdx, type: detail.repas.type });
            setDetail(null);
          }}
          onEdit={() => {
            setEditIng({ jourIdx: detail.jourIdx, repas: detail.repas });
            setDetail(null);
          }}
          onPick={(recetteId) => {
            changerRepas(semaine.id, detail.jourIdx, detail.repas.type, recetteId);
            setDetail(null);
            setConfirmMsg("Recette mise à jour ✨");
            setTimeout(() => setConfirmMsg(null), 3500);
          }}
        />
      )}

      {editIng && (
        <RepasEditSheet
          semaineId={semaine.id}
          jourIdx={editIng.jourIdx}
          repas={editIng.repas}
          onClose={() => setEditIng(null)}
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
          onConfirm={(cfg) => {
            const s = ajouterBatch(cfg);
            const sum = batchSummary(s);
            setBatchOpen(false);
            setConfirmMsg(`Batch cooking configuré — ${sum.tupperware} tupperware à préparer samedi 🎉`);
            setTimeout(() => setConfirmMsg(null), 6000);
          }}
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
      <div className="flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-5 pb-3 pt-5">
          <div>
            <h3 className="font-display text-xl">Mode Batch Cooking</h3>
            <p className="text-xs text-muted-foreground">Tape une case pour l'assigner à la recette active</p>
          </div>
          <button onClick={onClose} aria-label="Fermer"><X className="size-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
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

        </div>

        <div className="sticky bottom-0 border-t border-border bg-card px-5 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3">
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
            <Wand2 className="size-4" /> Valider et générer
          </button>
          <button
            onClick={reset}
            className="mt-2 w-full rounded-2xl py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Réinitialiser la grille
          </button>
        </div>
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

function LibreLogSheet({
  initial,
  label,
  onClose,
  onClear,
  onSubmit,
}: {
  initial?: MacrosBase;
  label: string;
  onClose: () => void;
  onClear: () => void;
  onSubmit: (m: MacrosBase) => void;
}) {
  const [kcal, setKcal] = useState(initial?.kcal?.toString() ?? "");
  const [prot, setProt] = useState(initial?.proteines?.toString() ?? "");
  const [glu, setGlu] = useState(initial?.glucides?.toString() ?? "");
  const [lip, setLip] = useState(initial?.lipides?.toString() ?? "");
  const valid = parseFloat(kcal) >= 0 && parseFloat(prot) >= 0;
  const submit = () => {
    onSubmit({
      kcal: parseFloat(kcal) || 0,
      proteines: parseFloat(prot) || 0,
      glucides: parseFloat(glu) || 0,
      lipides: parseFloat(lip) || 0,
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50" onClick={onClose}>
      <div className="w-full rounded-t-3xl bg-card p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl">Ajouter ce que j'ai mangé</h3>
            <p className="text-xs text-muted-foreground">{label} · saisis tes macros approximatives</p>
          </div>
          <button onClick={onClose} aria-label="Fermer"><X className="size-5" /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <NumInput label="kcal" value={kcal} onChange={setKcal} />
          <NumInput label="Protéines (g)" value={prot} onChange={setProt} />
          <NumInput label="Glucides (g)" value={glu} onChange={setGlu} />
          <NumInput label="Lipides (g)" value={lip} onChange={setLip} />
        </div>
        <button
          disabled={!valid}
          onClick={submit}
          className="mt-4 w-full rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-warm)] disabled:opacity-50"
        >
          Enregistrer
        </button>
        {initial && (
          <button onClick={onClear} className="mt-2 w-full rounded-2xl py-2 text-xs font-medium text-muted-foreground hover:text-destructive">
            Effacer ce log
          </button>
        )}
      </div>
    </div>
  );
}

function NumInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        placeholder="0"
      />
    </label>
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