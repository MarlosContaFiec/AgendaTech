import React, { useMemo, useState } from 'react'
import { SectionHeader, CalendarGrid } from '../../components/shared'
import { useCrudList } from '../../hooks/useCrudList'
import { getRuleCalendar, getRuleDay, listRules, listTags } from '../../services/company'
import { Button, Badge } from '../../components/ui'

export default function CalendarioEmpresaPage() {
  const [month] = useState({ ano: 2025, mes: 6 })
  const { items } = useCrudList(`/api/regras/calendario?ano=${month.ano}&mes=${month.mes}`, {})
  const days = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    label: String(i + 1),
    current: i + 1 === 10,
    tags: i % 7 === 0 ? [{ id: 1 }] : [],
  })), [])

  return (
    <div className="space-y-5">
      <SectionHeader title="Calendário" subtitle="Dias, tags e regras" />
      <div className="panel">
        <CalendarGrid days={days} />
      </div>
    </div>
  )
}
