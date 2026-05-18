import { scoreColor } from "@/utils/calculators";

export default function ScoreRing({ score, size = 60 }) {
  const r = size * 0.38, circ = 2 * Math.PI * r, offset = circ * (1 - score / 100), color = scoreColor(score);
  return (
    <svg width={size} height={size} viewBox={"0 0 " + size + " " + size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#2a2a52" strokeWidth={size*0.08} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.08}
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        transform={"rotate(-90 " + size/2 + " " + size/2 + ")"} />
      <text x={size/2} y={size/2+5} textAnchor="middle" fill={color} fontSize={size*0.22} fontWeight="800">{score}</text>
    </svg>
  );
}
