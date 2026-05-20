import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app/AppShell";
import { useApp } from "@/lib/store";
import { calcTDEE, objectifProteines } from "@/lib/nutrition";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useState } from "react";
import { ALIMENTS, ALIMENTS_MAP } from "@/data/aliments";
import { Clock, Infinity as InfinityIcon, X } from "lucide-react";

export const Route = createFileRoute("/_layout/profil")({
  component: ProfilPage,
});

function ProfilPage() {
  const profil = useApp((s) => s.profil);
  const setProfil = useApp((s) => s.setProfil);
  const preferences = useApp((s) => s.preferences);
  const setPreferences = useApp((s) => s.setPreferences);
  const hist = useApp((s) => s.historiquePoids);
  const ajouterPoids = useApp((s) => s.ajouterPoids);
  const [poids, setPoids] = useState(profil.poids_kg.toString());
  const [nom, setNom] = useState(profil.nom);
  const [exclusionPicker, setExclusionPicker] = useState<"temporaire" | "definitif" | null>(null);
  const tdee = calcTDEE(profil);
  const protCible = objectifProteines(profil);
  const perdu = (profil.poids_initial_kg - profil.poids_kg).toFixed(1);

  const removeBan = (kind: "temporaire" | "definitif", id: string) => {
    const key = kind === "temporaire" ? "bannis_temporaire" : "bannis_definitif";
    setPreferences({ [key]: preferences[key].filter((x) => x !== id) } as Partial<typeof preferences>);
  };
  const addBan = (kind: "temporaire" | "definitif", id: string) => {
    const key = kind === "temporaire" ? "bannis_temporaire" : "bannis_definitif";
    if (preferences[key].includes(id)) return;
    setPreferences({ [key]: [...preferences[key], id] } as Partial<typeof preferences>);
  };
  const isBanned = (id: string) =>
    preferences.bannis_temporaire.includes(id) || preferences.bannis_definitif.includes(id);

  return (
    <AppShell title="Profil" subtitle={`${profil.nom} · ${profil.age} ans`}>
      <section className="mb-5 rounded-2xl p-5 text-primary-foreground shadow-[var(--shadow-warm)]" style={{ background: "var(--gradient-warm)" }}>
        <p className="text-xs uppercase tracking-wider opacity-90">Progression</p>
        <p className="mt-1 font-display text-4xl">−{perdu} kg</p>
        <p className="mt-1 text-sm opacity-90">depuis le début</p>
      </section>

      <section className="mb-5 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">Prénom</h3>
        <div className="flex gap-2">
          <input
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="Ton prénom"
          />
          <button
            onClick={() => setProfil({ nom: nom.trim() || "Toi" })}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Enregistrer
          </button>
        </div>
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

function ExclusionBlock({
  title, hint, icon, tone, ids, onRemove, onAdd,
}: {
  title: string; hint: string; icon: React.ReactNode;
  tone: "warning" | "danger";
  ids: string[]; onRemove: (id: string) => void; onAdd: () => void;
}) {
  const toneClass =
    tone === "warning"
      ? "bg-warning/15 text-warning border-warning/30"
      : "bg-destructive/15 text-destructive border-destructive/30";
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold">
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${toneClass}`}>
          {icon} {title}
        </span>
        <span className="text-muted-foreground">· {hint}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {ids.length === 0 && <p className="text-xs text-muted-foreground">Aucun aliment exclu.</p>}
        {ids.map((id) => {
          const label = id;
          return (
            <span key={id} className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${toneClass}`}>
              {(typeof window !== "undefined" && (window as any)) || null}
              {label}
              <button onClick={() => onRemove(id)} aria-label={`Retirer ${label}`} className="opacity-70 hover:opacity-100">
                <X className="size-3" />
              </button>
            </span>
          );
        })}
        <button
          onClick={onAdd}
          className="rounded-full border border-dashed border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
        >
          + Ajouter
        </button>
      </div>
    </div>
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