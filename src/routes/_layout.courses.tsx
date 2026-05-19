import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { useApp, useSemaineActive } from "@/lib/store";
import { listeCourses, prixSemaine } from "@/lib/nutrition";
import { useState } from "react";

export const Route = createFileRoute("/_layout/courses")({
  component: CoursesPage,
});

const CATEGORIES_ORDRE = ["viande", "poisson", "laitier", "fruits", "legumes", "feculents", "epicerie", "custom"] as const;
const CATEGORIES_LABELS: Record<string, string> = {
  viande: "🥩 Boucherie",
  poisson: "🐟 Poissonnerie",
  laitier: "🧀 Crèmerie",
  fruits: "🍎 Fruits",
  legumes: "🥦 Légumes",
  feculents: "🌾 Féculents",
  epicerie: "🥫 Épicerie",
  custom: "✨ Autres",
};

function CoursesPage() {
  const semaine = useSemaineActive();
  const prefs = useApp((s) => s.preferences);
  const items = listeCourses(semaine);
  const prix = prixSemaine(semaine);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const overBudget = prix * 4.3 > prefs.budget_mensuel;

  return (
    <AppShell title="Liste de courses" subtitle={`Semaine ${semaine.numero}`}>
      <div className="mb-5 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Total estimé</p>
            <p className="font-display text-3xl text-primary">{prix.toFixed(2)} €</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Mensuel cible</p>
            <p className="font-semibold">{prefs.budget_mensuel} €</p>
          </div>
        </div>
        {overBudget && (
          <p className="mt-3 rounded-lg bg-warning/15 px-3 py-2 text-xs text-warning">
            ⚠️ Projection mensuelle au-dessus du budget — pense aux alternatives MDD premium.
          </p>
        )}
      </div>

      {CATEGORIES_ORDRE.map((cat) => {
        const filtered = items.filter((i) => i.aliment.categorie === cat);
        if (!filtered.length) return null;
        return (
          <section key={cat} className="mb-5">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">{CATEGORIES_LABELS[cat]}</h3>
            <div className="overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-soft)]">
              {filtered.map((i) => {
                const isChecked = checked.has(i.aliment.id);
                return (
                  <button
                    key={i.aliment.id}
                    onClick={() => {
                      const n = new Set(checked);
                      if (n.has(i.aliment.id)) n.delete(i.aliment.id); else n.add(i.aliment.id);
                      setChecked(n);
                    }}
                    className="flex w-full items-center gap-3 border-b border-border px-4 py-3 last:border-0 hover:bg-muted/40"
                  >
                    <div className={`grid size-5 place-items-center rounded border-2 ${isChecked ? "border-primary bg-primary" : "border-border"}`}>
                      {isChecked && <span className="text-[10px] text-primary-foreground">✓</span>}
                    </div>
                    <div className={`flex-1 text-left ${isChecked ? "line-through opacity-50" : ""}`}>
                      <p className="text-sm font-medium">{i.aliment.nom}</p>
                      <p className="text-xs text-muted-foreground">
                        {i.quantite_g >= 1000 ? `${(i.quantite_g / 1000).toFixed(2)} kg` : `${Math.round(i.quantite_g)} g`}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-primary">{i.cout.toFixed(2)} €</span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </AppShell>
  );
}