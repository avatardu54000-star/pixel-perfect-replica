import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { useApp } from "@/lib/store";
import { calcTDEE, objectifProteines } from "@/lib/nutrition";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useState } from "react";

export const Route = createFileRoute("/_layout/profil")({
  component: ProfilPage,
});

function ProfilPage() {
  const profil = useApp((s) => s.profil);
  const setProfil = useApp((s) => s.setProfil);
  const hist = useApp((s) => s.historiquePoids);
  const ajouterPoids = useApp((s) => s.ajouterPoids);
  const [poids, setPoids] = useState(profil.poids_kg.toString());
  const tdee = calcTDEE(profil);
  const protCible = objectifProteines(profil);
  const perdu = (profil.poids_initial_kg - profil.poids_kg).toFixed(1);

  return (
    <AppShell title="Profil" subtitle={`${profil.nom} · ${profil.age} ans`}>
      <section className="mb-5 rounded-2xl p-5 text-primary-foreground shadow-[var(--shadow-warm)]" style={{ background: "var(--gradient-warm)" }}>
        <p className="text-xs uppercase tracking-wider opacity-90">Progression</p>
        <p className="mt-1 font-display text-4xl">−{perdu} kg</p>
        <p className="mt-1 text-sm opacity-90">depuis le début</p>
      </section>

      <section className="mb-5 grid grid-cols-2 gap-3">
        <Stat label="Poids actuel" value={`${profil.poids_kg} kg`} />
        <Stat label="Taille" value={`${profil.taille_cm} cm`} />
        <Stat label="TDEE" value={`${tdee} kcal`} />
        <Stat label="Protéines cible" value={`${protCible} g`} />
        {profil.masse_grasse_kg && <Stat label="Masse grasse" value={`${profil.masse_grasse_kg} kg`} />}
        {profil.masse_musculaire_kg && <Stat label="Masse musc." value={`${profil.masse_musculaire_kg} kg`} />}
      </section>

      <section className="mb-5 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Évolution du poids</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={hist}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 10 }} width={30} />
              <Tooltip />
              <Line type="monotone" dataKey="poids" stroke="var(--primary)" strokeWidth={2.5} dot={{ fill: "var(--primary)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex gap-2">
          <input
            type="number" step="0.1" value={poids} onChange={(e) => setPoids(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="Poids du jour"
          />
          <button
            onClick={() => ajouterPoids(parseFloat(poids))}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Enregistrer
          </button>
        </div>
      </section>

      <section className="mb-5 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Objectif</h3>
        <div className="flex gap-2">
          {(["seche_musculaire", "maintien", "prise_masse"] as const).map((obj) => (
            <button
              key={obj}
              onClick={() => setProfil({ objectif: obj, objectif_proteines_g: objectifProteines({ ...profil, objectif: obj }) })}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
                profil.objectif === obj ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {obj === "seche_musculaire" ? "Sèche" : obj === "maintien" ? "Maintien" : "Prise"}
            </button>
          ))}
        </div>
      </section>

      <p className="px-2 text-center text-xs text-muted-foreground">
        💡 Pense à refaire un bilan balance connectée toutes les 6-8 semaines pour affiner tes données.
      </p>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card p-3 shadow-[var(--shadow-soft)]">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-xl">{value}</p>
    </div>
  );
}