import React from 'react'
import logo from '../../assets/logo.png'

export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
        <img
        src={logo}
        alt='AgendaTech'
        className='h-20 w-20 object-contain'
        />
      {!compact ? (
        <div>
          <div className="font-heading text-4xl leading-none text-foreground">AgendaTech</div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted">agendamentos inteligentes</div>
        </div>
      ) : null}
    </div>
  )
}
