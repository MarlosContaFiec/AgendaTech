import React from 'react'
import { SectionHeader, CalendarGrid } from '../../components/shared'
import { useCrudList } from '../../hooks/useCrudList'

export default function CalendarioClientePage() {
  const { items } = useCrudList('/api/cliente/calendario', [])
  const days = Array.from({ length: 30 }).map((_, index) => ({
    label: String(index + 1),
    current: index + 1 === 15,
    tags: index % 5 === 0 ? [{ id: index }] : [],
  }))

  return (
    <div className="space-y-5">
      <SectionHeader title="Calendário pessoal" subtitle="Agendamentos dos próximos e últimos dias" />
      <div className="panel">
        <CalendarGrid days={days} />
      </div>
    </div>
  )
}
