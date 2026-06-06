import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { MacroRing } from "@/components/app/MacroRing";
import { SavoirDuJourCard } from "@/components/app/SavoirDuJourCard";
import { useApp, useSemaineActive } from "@/lib/store";
import { Ban } from "lucide-react";
import { JOURS_LABELS, macrosJourSafe, REPAS_LABELS } from "@/lib/nutrition";
import { getRecette } from "@/lib/recipeLookup";
import { TrendingUp } from "lucide-react";
import { useState } from "react";
import { RepasDetailSheet } from "@/components/app/RepasDetailSheet";
import type { RepasPlanifie } from "@/lib/types";

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 11) return "Bon matin";
  if (h < 17) return "Bon midi";
  return "Bonsoir";
}

function Dashboard() {
  const profil = useApp((s) => s.profil);
  const toggleNonPris = useApp((s) => s.toggleNonPris);
  const semaine = useSemaineActive();
  const todayISO = new Date().toISOString().slice(0, 10);
  const idxByDate = semaine.jours.findIndex((j) => j.date.slice(0, 10) === todayISO);
  const todayIdx = idxByDate >= 0 ? idxByDate : Math.max(0, Math.min(6, (new Date().getDay() + 6) % 7));
  const jourAuj = semaine.jours[todayIdx];
  const macrosSafe = macrosJourSafe(jourAuj, todayIdx, semaine);
  const macros = macrosSafe ?? { kcal: 0, proteines: 0, glucides: 0, lipides: 0, fibres: 0 };
  const incomplete = macrosSafe === null;
  const propProteines = profil.objectif_proteines_g;
  const propLipides = Math.round((profil.objectif_calories_jour * 0.25) / 9);
  const propGlucides = Math.round((profil.objectif_calories_jour - propProteines * 4 - propLipides * 9) / 4);
  const [detail, setDetail] = useState<RepasPlanifie | null>(null);

  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-sm text-muted-foreground">{greeting()},</p>
        <h1 className="text-3xl">{profil.nom} 👋</h1>
      </header>

      <section className="rounded-3xl p-5 text-primary-foreground shadow-[var(--shadow-warm)]" style={{ background: "var(--gradient-warm)" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider opacity-90">Aujourd'hui</p>
            <p className="font-display text-2xl">
              {JOURS_LABELS[todayIdx]} · {incomplete ? "— kcal" : `${Math.round(macros.kcal)} kcal`}
            </p>
            {incomplete && (
              <p className="mt-1 text-[11px] opacity-90">Renseigne tes repas libres pour calculer le total</p>
            )}
          </div>
          <div className="rounded-full bg-white/20 p-3">
            <TrendingUp className="size-6" />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-4 gap-2 text-white">
          <MacroRing label="Kcal" value={macros.kcal} target={profil.objectif_calories_jour} unit="" color="white" />
          <MacroRing label="Prot" value={macros.proteines} target={propProteines} color="white" />
          <MacroRing label="Gluc" value={macros.glucides} target={propGlucides} color="white" />
          <MacroRing label="Lip" value={macros.lipides} target={propLipides} color="white" />
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-lg">Tes repas du jour</h2>
        <div className="space-y-3">
          {jourAuj.repas.map((r) => {
            const slot =
              semaine.batch_config && (r.type === "dejeuner" || r.type === "diner")
                ? semaine.batch_config.assignments[r.type === "dejeuner" ? "dejeuner" : "diner"][todayIdx]
                : null;
            const isLibre =
              !!semaine.batch_config &&
              (r.type === "dejeuner" || r.type === "diner") &&
              (slot === null || slot === undefined);
            if (r.non_pris) {
              return (
                <button
                  key={r.type}
                  onClick={() => toggleNonPris(semaine.id, todayIdx, r.type)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-border bg-muted/30 p-4 text-left opacity-60 transition hover:opacity-90"
                >
                  <div className="grid size-12 place-items-center rounded-xl bg-background text-2xl">🚫</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{REPAS_LABELS[r.type]}</p>
                    <p className="truncate font-semibold text-muted-foreground line-through">Non pris 🚫</p>
                    <p className="text-xs text-muted-foreground/70">0 kcal · tap pour annuler</p>
                  </div>
                </button>
              );
            }
            if (isLibre) {
              return (
                <div
                  key={r.type}
                  className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/40 p-4"
                >
                  <div className="grid size-12 place-items-center rounded-xl bg-background text-2xl">🌿</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{REPAS_LABELS[r.type]}</p>
                    <p className="truncate font-semibold text-muted-foreground">Repas libre 🌿</p>
                    <p className="text-xs text-muted-foreground/70">À improviser selon tes envies</p>
                  </div>
                </div>
              );
            }
            const recette = getRecette(r.recette_id);
            const slotInfo = slot !== null && slot !== undefined ? semaine.batch_config?.recipes[slot] : null;
            const displayName = slotInfo?.name?.trim() || recette?.nom;
            return (
              <button
                key={r.type}
                onClick={() => setDetail(r)}
                className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left shadow-[var(--shadow-soft)] transition hover:bg-muted/40"
              >
                <div className="grid size-12 place-items-center rounded-xl bg-muted text-2xl">{recette?.emoji}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{REPAS_LABELS[r.type]}</p>
                  <p className="truncate font-semibold">{displayName}</p>
                  <p className="text-xs text-muted-foreground">{recette?.temps_total_minutes} min · {recette?.cuisine}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <Link to="/semaines" className="mt-5 block rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 text-center text-sm font-medium text-primary transition hover:bg-primary/10">
        Planifier ma semaine prochaine →
      </Link>

      <div className="mt-6">
        <SavoirDuJourCard />
      </div>

      {detail && <RepasDetailSheet repas={detail} onClose={() => setDetail(null)} />}
    </AppShell>
  );
}