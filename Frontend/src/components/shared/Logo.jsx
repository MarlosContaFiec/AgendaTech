import React from 'react'

export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="avatar h-11 w-11 text-lg shadow-glow">AT</div>
      {!compact ? (
        <div>
          <div className="font-heading text-4xl leading-none text-foreground">AgendaTech</div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted">agendamentos inteligentes</div>
        </div>
      ) : null}
    </div>
  )
}
