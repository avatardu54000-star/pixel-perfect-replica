interface Props {
  label: string;
  value: number;
  target: number;
  unit?: string;
  color?: string;
}

export function MacroRing({ label, value, target, unit = "g", color = "var(--primary)" }: Props) {
  const pct = Math.min(1, target > 0 ? value / target : 0);
  const r = 32;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <svg width="80" height="80" className="-rotate-90">
          <circle cx="40" cy="40" r={r} stroke="currentColor" strokeWidth="7" fill="none" opacity="0.18" />
          <circle
            cx="40" cy="40" r={r} stroke={color} strokeWidth="7" fill="none"
            strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 600ms ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold">{Math.round(value)}</span>
          <span className="text-[10px] opacity-70">/{Math.round(target)}{unit}</span>
        </div>
      </div>
      <span className="text-xs font-medium opacity-80">{label}</span>
    </div>
  );
}