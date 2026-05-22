import { useMemo, useState } from "react";
import { Plus, Save, Search, Sparkles, Trash2, X } from "lucide-react";
import { ALIMENTS, ALIMENTS_MAP } from "@/data/aliments";
import { getRecette } from "@/lib/recipeLookup";
import { macrosIngredient, REPAS_LABELS, EMPTY_MACROS, addMacros } from "@/lib/nutrition";
import { useApp } from "@/lib/store";
import type { IngredientRecette, Recette, RepasPlanifie } from "@/lib/types";

interface Props {
  semaineId: string;
  jourIdx: number;
  repas: RepasPlanifie;
  onClose: () => void;
}

export function RepasEditSheet({ semaineId, jourIdx, repas, onClose }: Props) {
  const baseRecette = getRecette(repas.recette_id);
  const modifierIngredients = useApp((s) => s.modifierIngredientsRepas);
  const changerEt = useApp((s) => s.changerRecetteEtIngredients);
  const sauvegarderRecette = useApp((s) => s.sauvegarderRecetteCustom);

  const initial: IngredientRecette[] = (repas.custom_ingredients ?? baseRecette?.ingredients ?? []).map((i) => ({ ...i }));
  const [ings, setIngs] = useState<IngredientRecette[]>(initial);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [saveAsNew, setSaveAsNew] = useState(false);
  const [newName, setNewName] = useState(baseRecette ? `${baseRecette.nom} (ma version)` : "Ma recette");

  if (!baseRecette) return null;

  const total = useMemo(() => {
    let t = EMPTY_MACROS;
    for (const ing of ings) {
      const a = ALIMENTS_MAP[ing.aliment_id];
      if (!a) continue;
      t = addMacros(t, macrosIngredient(a, ing.quantite_g_par_portion * repas.portions));
    }
    return t;
  }, [ings, repas.portions]);

  const setQty = (idx: number, v: number) => {
    setIngs(ings.map((i, k) => (k === idx ? { ...i, quantite_g_par_portion: Math.max(0, v) } : i)));
  };
  const remove = (idx: number) => setIngs(ings.filter((_, k) => k !== idx));
  const add = (aliment_id: string) => {
    if (ings.some((i) => i.aliment_id === aliment_id)) {
      setShowAdd(false);
      return;
    }
    setIngs([...ings, { aliment_id, quantite_g_par_portion: 50 }]);
    setShowAdd(false);
    setSearch("");
  };

  const handleSave = () => {
    if (saveAsNew) {
      const id = `custom_${crypto.randomUUID().slice(0, 8)}`;
      const recette: Recette = {
        ...baseRecette,
        id,
        nom: newName.trim() || baseRecette.nom,
        ingredients: ings,
        batch_cooking: false,
        tags: [...baseRecette.tags, "custom"],
      };
      sauvegarderRecette(recette);
      changerEt(semaineId, jourIdx, repas.type, id, undefined);
    } else {
      modifierIngredients(semaineId, jourIdx, repas.type, ings);
    }
    onClose();
  };

  const candidates = ALIMENTS.filter((a) =>
    a.nom.toLowerCase().includes(search.toLowerCase()),
  ).slice(0, 30);

  return (
    <div className="fixed inset-0 z-[60] flex items-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 border-b border-border p-5">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Édition · {REPAS_LABELS[repas.type]}
            </p>
            <h2 className="mt-1 truncate font-display text-xl">
              {baseRecette.emoji} {baseRecette.nom}
            </h2>
          </div>
          <button onClick={onClose} className="rounded-full bg-muted p-2"><X className="size-4" /></button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {/* Total live */}
          <div className="grid grid-cols-4 gap-2 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-3 text-center">
            <Mini label="Kcal" value={Math.round(total.kcal)} />
            <Mini label="Prot" value={`${Math.round(total.proteines)}g`} />
            <Mini label="Gluc" value={`${Math.round(total.glucides)}g`} />
            <Mini label="Lip" value={`${Math.round(total.lipides)}g`} />
          </div>
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Sparkles className="size-3" /> Les macros se mettent à jour à chaque modification.
          </p>

          <div className="space-y-2">
            {ings.map((ing, idx) => {
              const a = ALIMENTS_MAP[ing.aliment_id];
              if (!a) return null;
              const m = macrosIngredient(a, ing.quantite_g_par_portion * repas.portions);
              return (
                <div key={`${ing.aliment_id}-${idx}`} className="flex items-center gap-2 rounded-xl bg-muted p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.nom}</p>
                    <p className="text-[10px] text-muted-foreground">
                      P {m.proteines.toFixed(1)} · G {m.glucides.toFixed(1)} · L {m.lipides.toFixed(1)} · {Math.round(m.kcal)} kcal
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg bg-card px-2 py-1">
                    <input
                      type="number"
                      value={ing.quantite_g_par_portion}
                      onChange={(e) => setQty(idx, parseFloat(e.target.value) || 0)}
                      className="w-14 bg-transparent text-right text-sm font-semibold tabular-nums outline-none"
                    />
                    <span className="text-xs text-muted-foreground">g</span>
                  </div>
                  <button
                    onClick={() => remove(idx)}
                    className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Supprimer"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {!showAdd ? (
            <button
              onClick={() => setShowAdd(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-3 text-sm font-semibold text-muted-foreground transition hover:border-primary hover:text-primary"
            >
              <Plus className="size-4" /> Ajouter un ingrédient
            </button>
          ) : (
            <div className="rounded-2xl border border-border bg-muted/40 p-3">
              <div className="mb-2 flex items-center gap-2 rounded-lg bg-card px-3 py-2">
                <Search className="size-4 text-muted-foreground" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Chercher un aliment…"
                  className="flex-1 bg-transparent text-sm outline-none"
                />
                <button onClick={() => setShowAdd(false)} aria-label="Annuler">
                  <X className="size-4 text-muted-foreground" />
                </button>
              </div>
              <div className="max-h-56 overflow-y-auto">
                {candidates.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => add(a.id)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-muted"
                  >
                    <span className="truncate">{a.nom}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{a.categorie}</span>
                  </button>
                ))}
                {candidates.length === 0 && <p className="p-2 text-xs text-muted-foreground">Aucun résultat.</p>}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-border p-3">
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={saveAsNew}
                onChange={(e) => setSaveAsNew(e.target.checked)}
                className="mt-0.5 size-4 accent-primary"
              />
              <span>
                <b>Sauvegarder comme nouvelle recette</b>
                <p className="text-xs text-muted-foreground">Sinon, modifie ce repas uniquement pour cette semaine.</p>
              </span>
            </label>
            {saveAsNew && (
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nom de la recette"
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            )}
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-border bg-card px-5 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3">
          <button
            onClick={handleSave}
            disabled={ings.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-warm)] disabled:opacity-50"
          >
            <Save className="size-4" /> {saveAsNew ? "Sauvegarder la nouvelle recette" : "Sauvegarder pour cette semaine"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-display text-lg tabular-nums">{value}</p>
    </div>
  );
}