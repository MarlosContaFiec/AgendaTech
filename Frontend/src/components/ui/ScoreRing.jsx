import React from 'react'
import { scoreColor, scoreLabel } from '../../utils/calculators'

export default function ScoreRing({ score = 0, size = 84 }) {
  const stroke = 6
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const limited = Math.max(0, Math.min(100, Number(score) || 0))
  const offset = circumference - (limited / 100) * circumference
  const color = scoreColor(limited)
  const label = scoreLabel(limited)

  return (
    <div className="inline-flex flex-col items-center justify-center">
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,.08)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" fill="#f0ece4" fontSize={size * 0.26} fontFamily="Bebas Neue">
          {limited.toFixed(1)}
        </text>
      </svg>
      <div className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-muted">{label}</div>
    </div>
  )
}
