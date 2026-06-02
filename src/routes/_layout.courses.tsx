import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { useSemaineActive } from "@/lib/store";
import { listeCourses, prixSemaine } from "@/lib/nutrition";
import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_layout/courses")({
  component: CoursesPage,
});

const BUDGET_SEMAINE = 87; // 350 € / mois ÷ 4 semaines

type RayonId = "boucherie" | "fruits_legumes" | "cremerie" | "epicerie" | "surgeles";

const RAYONS: { id: RayonId; label: string; categories: string[] }[] = [
  { id: "boucherie", label: "🥩 Boucherie", categories: ["viande", "poisson"] },
  { id: "fruits_legumes", label: "🥬 Fruits & Légumes", categories: ["fruits", "legumes"] },
  { id: "cremerie", label: "🧀 Crèmerie", categories: ["laitier"] },
  { id: "epicerie", label: "🥫 Épicerie", categories: ["feculents", "epicerie", "custom"] },
  { id: "surgeles", label: "🧊 Surgelés", categories: ["surgeles"] },
];

function CoursesPage() {
  const semaine = useSemaineActive();
  const items = listeCourses(semaine);
  const prix = prixSemaine(semaine);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const overBudget = prix > BUDGET_SEMAINE;
  const ecart = prix - BUDGET_SEMAINE;
  const totalArticles = items.length;
  const articlesCoches = items.filter((i) => checked.has(i.aliment.id)).length;

  return (
    <AppShell title="Liste de courses" subtitle={`Semaine ${semaine.numero} · ${articlesCoches}/${totalArticles} articles`}>
      {items.length === 0 && (
        <div className="mb-5 rounded-2xl border border-dashed border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Pas encore de planning pour cette semaine — configure ton batch cooking pour générer la liste.
          </p>
        </div>
      )}

      {RAYONS.map((rayon) => {
        const filtered = items
          .filter((i) => rayon.categories.includes(i.aliment.categorie))
          .sort((a, b) => a.aliment.nom.localeCompare(b.aliment.nom));
        if (!filtered.length) return null;
        const sousTotal = filtered.reduce((s, i) => s + i.cout, 0);
        return (
          <section key={rayon.id} className="mb-5">
            <div className="mb-2 flex items-baseline justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{rayon.label}</h3>
              <span className="text-xs tabular-nums text-muted-foreground">{sousTotal.toFixed(2)} €</span>
            </div>
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
                    <span className={`text-sm font-semibold tabular-nums ${isChecked ? "text-muted-foreground line-through" : "text-primary"}`}>
                      {i.cout.toFixed(2)} €
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {items.length > 0 && (
        <div
          className={`sticky bottom-20 mt-6 rounded-2xl p-4 shadow-[var(--shadow-warm)] ${
            overBudget ? "bg-warning/15 text-warning-foreground" : "bg-card"
          }`}
        >
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Total estimé semaine</p>
              <p className="font-display text-3xl text-primary tabular-nums">{prix.toFixed(2)} €</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Budget hebdo</p>
              <p className="font-semibold tabular-nums">{BUDGET_SEMAINE} €</p>
              <p className="text-[10px] text-muted-foreground">350 € / mois ÷ 4</p>
            </div>
          </div>
          {overBudget ? (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-warning/20 px-3 py-2 text-sm text-warning">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <p className="leading-snug">
                <strong>Dépassement de {ecart.toFixed(2)} €.</strong> Envisage des MDD, remplace une viande par des
                œufs/légumineuses ou ajuste les portions.
              </p>
            </div>
          ) : (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-success/15 px-3 py-2 text-sm text-success">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              <p className="leading-snug">
                Dans le budget — il te reste <strong>{Math.abs(ecart).toFixed(2)} €</strong> de marge cette semaine.
              </p>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}