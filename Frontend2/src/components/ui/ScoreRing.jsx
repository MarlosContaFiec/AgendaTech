export default function ScoreRing({ valor, max = 100, size = 80, strokeWidth = 6 }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(valor / max, 1);
  const off = circ * (1 - pct);
  const cor = pct >= 0.7 ? '#22d48a' : pct >= 0.4 ? '#ffa94d' : '#ff5c7a';
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#2a2f42" strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={cor} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" className="transition-all duration-700" />
      </svg>
      <span className="absolute text-tb-text font-bold text-sm">{valor}</span>
    </div>
  );
}
