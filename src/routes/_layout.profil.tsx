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

      <section className="mb-5 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">Mesures (Harris–Benedict)</h3>
        <div className="grid grid-cols-2 gap-3">
          <NumField label="Âge" value={profil.age} onChange={(v) => setProfil({ age: v })} suffix="ans" />
          <NumField label="Taille" value={profil.taille_cm} onChange={(v) => setProfil({ taille_cm: v })} suffix="cm" />
        </div>
        <div className="mt-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Sexe</p>
          <div className="flex gap-2">
            {(["homme", "femme"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setProfil({ sexe: s })}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium capitalize transition ${
                  profil.sexe === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Niveau d'activité</p>
          <select
            value={profil.activite}
            onChange={(e) => setProfil({ activite: e.target.value as typeof profil.activite })}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="sedentaire">Sédentaire</option>
            <option value="leger">Léger</option>
            <option value="moderement_actif">Modérément actif</option>
            <option value="tres_actif">Très actif</option>
            <option value="athlete">Athlète</option>
          </select>
        </div>
        <p className="mt-3 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
          BMR <b className="text-foreground">{Math.round((profil.sexe === "homme" ? 88.362 + 13.397*profil.poids_kg + 4.799*profil.taille_cm - 5.677*profil.age : 447.593 + 9.247*profil.poids_kg + 3.098*profil.taille_cm - 4.330*profil.age))} kcal</b> · TDEE <b className="text-foreground">{tdee} kcal</b> · Objectif <b className="text-foreground">{profil.objectif_calories_jour} kcal</b>
        </p>
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

      <section className="mb-5 rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)]">
        <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-muted-foreground">Mes exclusions alimentaires</h3>
        <p className="mb-3 text-xs text-muted-foreground">Aliments que l'IA évitera dans tes plannings.</p>
        <ExclusionBlock
          title="Temporaires"
          hint="pause de quelques semaines"
          icon={<Clock className="size-3" />}
          tone="warning"
          ids={preferences.bannis_temporaire}
          onRemove={(id) => removeBan("temporaire", id)}
          onAdd={() => setExclusionPicker("temporaire")}
        />
        <div className="my-3 h-px bg-border" />
        <ExclusionBlock
          title="Définitifs"
          hint="allergie, dégoût, intolérance"
          icon={<InfinityIcon className="size-3" />}
          tone="danger"
          ids={preferences.bannis_definitif}
          onRemove={(id) => removeBan("definitif", id)}
          onAdd={() => setExclusionPicker("definitif")}
        />
      </section>

      {exclusionPicker && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50" onClick={() => setExclusionPicker(null)}>
          <div className="max-h-[80vh] w-full overflow-y-auto rounded-t-3xl bg-card p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-xl">
                Ajouter une exclusion {exclusionPicker === "temporaire" ? "temporaire" : "définitive"}
              </h3>
              <button onClick={() => setExclusionPicker(null)} aria-label="Fermer"><X className="size-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ALIMENTS.map((a) => {
                const banned = isBanned(a.id);
                return (
                  <button
                    key={a.id}
                    disabled={banned}
                    onClick={() => { addBan(exclusionPicker, a.id); setExclusionPicker(null); }}
                    className={`rounded-xl p-3 text-left text-sm transition ${
                      banned ? "bg-muted/40 text-muted-foreground opacity-50" : "bg-muted hover:bg-muted/70"
                    }`}
                  >
                    <p className="truncate font-medium">{a.nom}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{a.categorie}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
          const a = ALIMENTS_MAP[id];
          const label = a?.nom ?? id;
          return (
            <span key={id} className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${toneClass}`}>
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