import React from 'react'

export default function CalendarGrid({ days = [], onDayClick }) {
  const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-7 gap-2">
        {labels.map((label) => <div key={label} className="py-2 text-center text-[.72rem] font-bold uppercase tracking-[.08em] text-muted">{label}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <button
            key={`${day.label}-${index}`}
            onClick={() => onDayClick?.(day)}
            className={`relative min-h-12 rounded-[12px] border p-2 text-sm transition-all hover:-translate-y-[1px] ${
              day.current ? 'border-purple bg-[rgba(108,92,231,.12)] text-foreground' : 'border-line bg-surface text-muted hover:bg-surface-alt'
            }`}
          >
            <span className="block text-left">{day.label}</span>
            {day.tags?.length ? <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan" /> : null}
          </button>
        ))}
      </div>
    </div>
  )
}
