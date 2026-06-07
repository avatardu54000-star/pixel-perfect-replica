import { useState } from "react";
import { ArrowLeft, ChevronRight, Plus, Save, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES } from "@/routes/_layout.aliments";
import { ALIMENTS_MAP } from "@/data/aliments";
import { useApp } from "@/lib/store";
import type { Aliment, Recette } from "@/lib/types";

interface Props {
  aliment: Aliment;
  onClose: () => void;
}

function getScore(ratio: number) {
  if (ratio >= 8) return { label: "Excellent", tone: "bg-emerald-500/15 text-emerald-700" };
  if (ratio >= 5) return { label: "Bon", tone: "bg-primary/15 text-primary" };
  if (ratio >= 2) return { label: "Moyen", tone: "bg-amber-500/15 text-amber-700" };
  return { label: "Faible", tone: "bg-muted text-muted-foreground" };
}

export function AlimentDetailSheet({ aliment, onClose }: Props) {
  const ratio = aliment.pour_100g.kcal > 0 ? (aliment.pour_100g.proteines / aliment.pour_100g.kcal) * 100 : 0;
  const score = getScore(ratio);
  const catEmoji = CATEGORIES.find((c) => c.id === aliment.categorie)?.emoji ?? "🍽️";

  const recettesCustom = useApp((s) => s.recettesCustom);
  const sauvegarderRecette = useApp((s) => s.sauvegarderRecetteCustom);

  const [showRecettes, setShowRecettes] = useState(false);
  const [newName, setNewName] = useState(`Recette ${aliment.nom}`);
  const [showNewForm, setShowNewForm] = useState(false);

  const ajouterARecette = (recette: Recette) => {
    if (recette.ingredients.some((i) => i.aliment_id === aliment.id)) {
      toast.info(`${aliment.nom} est déjà dans « ${recette.nom} »`);
      return;
    }
    const updated: Recette = {
      ...recette,
      ingredients: [...recette.ingredients, { aliment_id: aliment.id, quantite_g_par_portion: 100 }],
    };
    sauvegarderRecette(updated);
    toast.success(`${aliment.nom} ajouté à « ${recette.nom} »`);
    setShowRecettes(false);
  };

  const creerNouvelleRecette = () => {
    const id = `custom_${crypto.randomUUID().slice(0, 8)}`;
    const recette: Recette = {
      id,
      nom: newName.trim() || `Recette ${aliment.nom}`,
      description: "Recette créée depuis la fiche aliment.",
      emoji: "🍽️",
      cuisine: "autre",
      type_repas: "dejeuner",
      batch_cooking: false,
      temps_total_minutes: 15,
      nb_portions_base: 1,
      ingredients: [{ aliment_id: aliment.id, quantite_g_par_portion: 100 }],
      etapes: ["Préparer les ingrédients."],
      conservation_jours: 2,
      tags: ["custom"],
    };
    sauvegarderRecette(recette);
    toast.success(`Recette « ${recette.nom} » créée avec ${aliment.nom}`);
    setShowNewForm(false);
    setShowRecettes(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border p-5">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Fiche nutritionnelle</p>
            <h2 className="mt-1 font-display text-xl">
              {catEmoji} {aliment.nom}
            </h2>
            {aliment.marque && <p className="text-xs text-muted-foreground">{aliment.marque}</p>}
          </div>
          <button onClick={onClose} className="rounded-full bg-muted p-2">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {/* Macros grid */}
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 p-3 text-center">
            <Mini label="Kcal" value={Math.round(aliment.pour_100g.kcal)} />
            <Mini label="Protéines" value={`${aliment.pour_100g.proteines}g`} />
            <Mini label="Glucides" value={`${aliment.pour_100g.glucides}g`} />
            <Mini label="Lipides" value={`${aliment.pour_100g.lipides}g`} />
            <Mini label="Fibres" value={`${aliment.pour_100g.fibres ?? 0}g`} />
            <Mini label="Prix" value={`${aliment.prix_kg_estime.toFixed(2)} €/kg`} />
          </div>

          {/* P/kcal score */}
          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/10 p-4">
            <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Sparkles className="size-3" /> Score nutritionnel
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Ratio protéines / kcal</p>
                <p className="font-display text-2xl tabular-nums">
                  {ratio.toFixed(1)}<span className="ml-1 text-xs text-muted-foreground">g / 100 kcal</span>
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${score.tone}`}>{score.label}</span>
            </div>
          </div>

          {/* Add to recipe section */}
          {!showRecettes ? (
            <button
              onClick={() => setShowRecettes(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 py-3 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/10"
            >
              <Plus className="size-4" /> Ajouter à une recette
            </button>
          ) : (
            <div className="rounded-2xl border border-border bg-muted/40 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold">Choisir une recette</p>
                <button onClick={() => { setShowRecettes(false); setShowNewForm(false); }} className="rounded-full bg-card p-1.5">
                  <ArrowLeft className="size-3.5" />
                </button>
              </div>

              {/* New recipe quick option */}
              {!showNewForm ? (
                <button
                  onClick={() => setShowNewForm(true)}
                  className="mb-2 flex w-full items-center gap-2 rounded-xl border-2 border-dashed border-border bg-card px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-primary"
                >
                  <Plus className="size-4" /> Créer une nouvelle recette
                </button>
              ) : (
                <div className="mb-2 space-y-2 rounded-xl bg-card p-3">
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nom de la recette"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <button
                    onClick={creerNouvelleRecette}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
                  >
                    <Save className="size-3.5" /> Créer avec {aliment.nom}
                  </button>
                </div>
              )}

              {/* Custom recipes list */}
              <div className="max-h-56 overflow-y-auto space-y-1">
                {recettesCustom.length === 0 && !showNewForm && (
                  <p className="py-2 text-xs text-center text-muted-foreground">Aucune recette perso.</p>
                )}
                {recettesCustom.map((r) => {
                  const hasIt = r.ingredients.some((i) => i.aliment_id === aliment.id);
                  return (
                    <button
                      key={r.id}
                      onClick={() => !hasIt && ajouterARecette(r)}
                      disabled={hasIt}
                      className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm transition ${
                        hasIt ? "opacity-50 cursor-not-allowed" : "hover:bg-muted"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{r.emoji}</span>
                        <span className="truncate">{r.nom}</span>
                      </span>
                      {hasIt ? (
                        <span className="text-[10px] text-muted-foreground">Déjà présent</span>
                      ) : (
                        <ChevronRight className="size-4 text-muted-foreground" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
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
