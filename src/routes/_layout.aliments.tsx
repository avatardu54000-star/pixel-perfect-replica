import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Apple, Camera, Loader2, Plus, Search, Sparkles, Trash2, Wand2, X } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { lookupAliment, type AiAlimentResult } from "@/lib/alimentAi.functions";
import { scanNutritionLabel } from "@/lib/alimentScan.functions";
import { AppShell } from "@/components/app/AppShell";
import { ALIMENTS } from "@/data/aliments";
import { useApp } from "@/lib/store";
import type { Aliment, CategorieAliment } from "@/lib/types";

export const Route = createFileRoute("/_layout/aliments")({
  component: AlimentsPage,
});

type Tab = "base" | "mine" | "add";

const CATEGORIES: { id: CategorieAliment; label: string; emoji: string }[] = [
  { id: "viande", label: "Viandes", emoji: "🥩" },
  { id: "poisson", label: "Poissons", emoji: "🐟" },
  { id: "laitier", label: "Laitiers", emoji: "🥛" },
  { id: "feculents", label: "Féculents", emoji: "🌾" },
  { id: "legumes", label: "Légumes", emoji: "🥦" },
  { id: "fruits", label: "Fruits", emoji: "🍎" },
  { id: "epicerie", label: "Épicerie", emoji: "🫙" },
  { id: "custom", label: "Custom", emoji: "✨" },
];

function AlimentsPage() {
  const [tab, setTab] = useState<Tab>("base");
  const customs = useApp((s) => s.alimentsCustom);

  return (
    <AppShell title="Aliments" subtitle="Ta base alimentaire">
      <div className="mb-4 grid grid-cols-3 gap-1 rounded-2xl bg-muted p-1 text-sm font-medium">
        <TabBtn active={tab === "base"} onClick={() => setTab("base")}>Base</TabBtn>
        <TabBtn active={tab === "mine"} onClick={() => setTab("mine")}>
          Mes produits {customs.length > 0 && <span className="ml-1 rounded-full bg-primary/15 px-1.5 text-[10px] text-primary">{customs.length}</span>}
        </TabBtn>
        <TabBtn active={tab === "add"} onClick={() => setTab("add")}>Ajouter</TabBtn>
      </div>

      {tab === "base" && <BaseTab />}
      {tab === "mine" && <MineTab />}
      {tab === "add" && <AddTab onSaved={() => setTab("mine")} />}
    </AppShell>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-2 py-2 transition ${active ? "bg-card text-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground"}`}
    >
      {children}
    </button>
  );
}

function BaseTab() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CategorieAliment | "all">("all");
  const customs = useApp((s) => s.alimentsCustom);
  const ajouter = useApp((s) => s.ajouterAlimentCustom);
  const lookupFn = useServerFn(lookupAliment);
  const [aiState, setAiState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [aiResult, setAiResult] = useState<AiAlimentResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiAdded, setAiAdded] = useState(false);

  const list = useMemo(() => {
    const ql = q.toLowerCase();
    return ALIMENTS.filter((a) => (cat === "all" || a.categorie === cat) && a.nom.toLowerCase().includes(ql));
  }, [q, cat]);

  const showAi = q.trim().length > 1 && list.length === 0;

  const resetAi = () => {
    setAiState("idle"); setAiResult(null); setAiError(null); setAiAdded(false);
  };

  const runAi = async () => {
    setAiState("loading"); setAiError(null); setAiResult(null); setAiAdded(false);
    try {
      const r = await lookupFn({ data: { query: q.trim() } });
      setAiResult(r); setAiState("done");
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "Erreur inconnue"); setAiState("error");
    }
  };

  const ajouterAi = () => {
    if (!aiResult) return;
    const a: Aliment = {
      id: `usr_${crypto.randomUUID().slice(0, 8)}`,
      nom: aiResult.nom,
      categorie: aiResult.categorie,
      pour_100g: {
        kcal: Math.round(aiResult.kcal),
        proteines: Math.round(aiResult.proteines * 10) / 10,
        glucides: Math.round(aiResult.glucides * 10) / 10,
        lipides: Math.round(aiResult.lipides * 10) / 10,
        fibres: Math.round((aiResult.fibres ?? 0) * 10) / 10,
      },
      prix_kg_estime: Math.round((aiResult.prix_kg_estime ?? 0) * 100) / 100,
      custom: true,
    };
    ajouter(a);
    setAiAdded(true);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-xl bg-card px-3 py-2 shadow-[var(--shadow-soft)]">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); resetAi(); }}
          placeholder="Chercher un aliment…"
          className="flex-1 bg-transparent text-sm outline-none"
        />
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <Chip active={cat === "all"} onClick={() => setCat("all")}>Tout</Chip>
        {CATEGORIES.filter((c) => c.id !== "custom").map((c) => (
          <Chip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
            {c.emoji} {c.label}
          </Chip>
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground">{list.length} aliments</p>
      <div className="space-y-2">
        {list.map((a) => <AlimentRow key={a.id} a={a} />)}
      </div>

      {showAi && (
        <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 text-center">
          <Sparkles className="mx-auto size-6 text-primary" />
          <p className="mt-2 text-sm font-semibold">Aucun résultat pour « {q.trim()} »</p>
          <p className="mt-1 text-xs text-muted-foreground">Demande à l'IA de récupérer les valeurs nutritionnelles pour 100 g.</p>

          {aiState !== "done" && (
            <button
              onClick={runAi}
              disabled={aiState === "loading"}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-warm)] disabled:opacity-60"
            >
              {aiState === "loading" ? <Loader2 className="size-3.5 animate-spin" /> : <Wand2 className="size-3.5" />}
              {aiState === "loading" ? "L'IA cherche…" : "Rechercher avec l'IA"}
            </button>
          )}

          {aiState === "error" && (
            <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-left text-xs text-destructive">{aiError}</p>
          )}

          {aiState === "done" && aiResult && (
            <div className="mt-4 rounded-xl bg-card p-3 text-left shadow-[var(--shadow-soft)]">
              <p className="text-sm font-semibold">{aiResult.nom}</p>
              {aiResult.note && <p className="text-[11px] text-muted-foreground">{aiResult.note}</p>}
              <div className="mt-2 grid grid-cols-5 gap-1 text-center">
                <Mini label="Kcal" value={Math.round(aiResult.kcal)} />
                <Mini label="P" value={`${aiResult.proteines}g`} />
                <Mini label="G" value={`${aiResult.glucides}g`} />
                <Mini label="L" value={`${aiResult.lipides}g`} />
                <Mini label="Fib" value={`${aiResult.fibres}g`} />
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">Prix estimé · {aiResult.prix_kg_estime} €/kg</p>
              {aiAdded ? (
                <p className="mt-3 rounded-lg bg-emerald-500/15 px-3 py-2 text-center text-xs font-semibold text-emerald-700">
                  ✓ Ajouté à « Mes produits » ({customs.length + 1})
                </p>
              ) : (
                <button
                  onClick={ajouterAi}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
                >
                  <Plus className="size-3.5" /> Ajouter à mes produits
                </button>
              )}
              <p className="mt-2 text-[10px] italic text-muted-foreground">Valeurs estimées par l'IA — vérifie l'étiquette si tu veux une précision parfaite.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MineTab() {
  const customs = useApp((s) => s.alimentsCustom);
  const supprimer = useApp((s) => s.supprimerAlimentCustom);

  if (customs.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-border p-8 text-center">
        <Apple className="mx-auto size-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-semibold">Aucun produit perso</p>
        <p className="mt-1 text-xs text-muted-foreground">Ajoute tes propres aliments depuis l'onglet « Ajouter ».</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {customs.map((a) => <AlimentRow key={a.id} a={a} onDelete={() => supprimer(a.id)} />)}
    </div>
  );
}

function AlimentRow({ a, onDelete }: { a: Aliment; onDelete?: () => void }) {
  const ratio = a.pour_100g.kcal > 0 ? (a.pour_100g.proteines / a.pour_100g.kcal) * 100 : 0;
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-[var(--shadow-soft)]">
      <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-lg">
        {CATEGORIES.find((c) => c.id === a.categorie)?.emoji ?? "🍽️"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{a.nom}{a.marque && <span className="ml-1 text-xs text-muted-foreground">· {a.marque}</span>}</p>
        <p className="text-[10px] tabular-nums text-muted-foreground">
          {Math.round(a.pour_100g.kcal)} kcal · P {a.pour_100g.proteines}g · G {a.pour_100g.glucides}g · L {a.pour_100g.lipides}g
        </p>
      </div>
      <div className="text-right">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">P/kcal</p>
        <p className="font-display text-sm tabular-nums">{ratio.toFixed(1)}</p>
      </div>
      {onDelete && (
        <button onClick={onDelete} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label="Supprimer">
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${active ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}
    >
      {children}
    </button>
  );
}

function AddTab({ onSaved }: { onSaved: () => void }) {
  const ajouter = useApp((s) => s.ajouterAlimentCustom);
  const [nom, setNom] = useState("");
  const [marque, setMarque] = useState("");
  const [categorie, setCategorie] = useState<CategorieAliment>("custom");
  const [kcal, setKcal] = useState("");
  const [proteines, setProteines] = useState("");
  const [glucides, setGlucides] = useState("");
  const [lipides, setLipides] = useState("");
  const [fibres, setFibres] = useState("");
  const [prix, setPrix] = useState("");

  const scanFn = useServerFn(scanNutritionLabel);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [scanPreview, setPreview] = useState<string | null>(null);
  const [scanState, setScanState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanNote, setScanNote] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setScanState("error"); setScanError("Fichier non supporté (image uniquement)"); return;
    }
    setScanState("loading"); setScanError(null); setScanNote(null);
    try {
      const dataUrl = await new Promise<string>((res, rej) => {
        const fr = new FileReader();
        fr.onload = () => res(fr.result as string);
        fr.onerror = () => rej(new Error("Lecture impossible"));
        fr.readAsDataURL(file);
      });
      setPreview(dataUrl);
      const r = await scanFn({ data: { imageDataUrl: dataUrl } });
      setKcal(String(Math.round(r.kcal)));
      setProteines(String(r.proteines));
      setGlucides(String(r.glucides));
      setLipides(String(r.lipides));
      setFibres(String(r.fibres));
      if (r.nom && !nom.trim()) setNom(r.nom);
      setScanNote(r.note ?? null);
      setScanState("done");
    } catch (e) {
      setScanState("error"); setScanError(e instanceof Error ? e.message : "Erreur inconnue");
    }
  };

  const resetScan = () => {
    setPreview(null); setScanState("idle"); setScanError(null); setScanNote(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const num = (v: string) => {
    const n = parseFloat(v.replace(",", "."));
    return isFinite(n) ? n : 0;
  };

  const scanPreview = useMemo(() => {
    const k = num(kcal);
    const p = num(proteines);
    const ratio = k > 0 ? (p / k) * 100 : 0;
    let score: { label: string; tone: string };
    if (ratio >= 8) score = { label: "Excellent", tone: "bg-emerald-500/15 text-emerald-700" };
    else if (ratio >= 5) score = { label: "Bon", tone: "bg-primary/15 text-primary" };
    else if (ratio >= 2) score = { label: "Moyen", tone: "bg-amber-500/15 text-amber-700" };
    else score = { label: "Faible", tone: "bg-muted text-muted-foreground" };
    return { ratio, score };
  }, [kcal, proteines]);

  const canSave = nom.trim().length > 1 && num(kcal) >= 0 && num(proteines) >= 0;

  const handleSave = () => {
    if (!canSave) return;
    const aliment: Aliment = {
      id: `usr_${crypto.randomUUID().slice(0, 8)}`,
      nom: nom.trim(),
      marque: marque.trim() || undefined,
      categorie,
      pour_100g: {
        kcal: num(kcal),
        proteines: num(proteines),
        glucides: num(glucides),
        lipides: num(lipides),
        fibres: fibres ? num(fibres) : undefined,
      },
      prix_kg_estime: num(prix),
      custom: true,
    };
    ajouter(aliment);
    setNom(""); setMarque(""); setKcal(""); setProteines(""); setGlucides(""); setLipides(""); setFibres(""); setPrix("");
    onSaved();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary">
          <Sparkles className="size-3" /> Scan IA
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Photographie un tableau nutritionnel — l'IA pré-remplit les champs ci-dessous.
        </p>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {!scanPreview && (
          <button
            onClick={() => fileRef.current?.click()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-warm)]"
          >
            <Camera className="size-4" /> Scanner un tableau nutritionnel
          </button>
        )}

        {scanPreview && (
          <div className="mt-3 space-y-2">
            <div className="relative overflow-hidden rounded-xl border border-border bg-card">
              <img src={scanPreview} alt="Aperçu étiquette" className="max-h-56 w-full object-contain" />
              <button
                onClick={resetScan}
                className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-background/90 text-foreground shadow"
                aria-label="Retirer"
              >
                <X className="size-3.5" />
              </button>
            </div>

            {scanState === "loading" && (
              <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" /> Analyse de l'étiquette…
              </p>
            )}
            {scanState === "done" && (
              <p className="rounded-lg bg-emerald-500/15 px-3 py-2 text-center text-xs font-semibold text-emerald-700">
                ✓ Valeurs détectées — vérifie puis valide en bas
                {scanNote && <span className="block font-normal text-emerald-700/80">{scanNote}</span>}
              </p>
            )}
            {scanState === "error" && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{scanError}</p>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-lg border border-border bg-card py-2 text-xs font-medium"
            >
              Choisir une autre photo
            </button>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] space-y-3">
        <Field label="Nom *" value={nom} onChange={setNom} placeholder="Ex. Yaourt Skyr Lidl" />
        <Field label="Marque" value={marque} onChange={setMarque} placeholder="Ex. Milbona" />
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Catégorie</label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategorie(c.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${categorie === c.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card p-4 shadow-[var(--shadow-soft)] space-y-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Pour 100 g</p>
        <div className="grid grid-cols-2 gap-2">
          <NumField label="Kcal" value={kcal} onChange={setKcal} />
          <NumField label="Protéines (g)" value={proteines} onChange={setProteines} />
          <NumField label="Glucides (g)" value={glucides} onChange={setGlucides} />
          <NumField label="Lipides (g)" value={lipides} onChange={setLipides} />
          <NumField label="Fibres (g)" value={fibres} onChange={setFibres} />
          <NumField label="Prix €/kg" value={prix} onChange={setPrix} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-accent/10 p-4">
        <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary">
          <Sparkles className="size-3" /> Aperçu en temps réel
        </p>
        <div className="mt-3 grid grid-cols-4 gap-2 text-center">
          <Mini label="Kcal" value={Math.round(num(kcal))} />
          <Mini label="P" value={`${num(proteines)}g`} />
          <Mini label="G" value={`${num(glucides)}g`} />
          <Mini label="L" value={`${num(lipides)}g`} />
        </div>
        <div className="mt-3 flex items-center justify-between rounded-xl bg-card/70 p-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Ratio protéines / kcal</p>
            <p className="font-display text-2xl tabular-nums">{preview.ratio.toFixed(1)}<span className="ml-1 text-xs text-muted-foreground">g / 100 kcal</span></p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${preview.score.tone}`}>{preview.score.label}</span>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={!canSave}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-warm)] disabled:opacity-50"
      >
        <Plus className="size-4" /> Sauvegarder l'aliment
      </button>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

function NumField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm tabular-nums outline-none focus:border-primary"
      />
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