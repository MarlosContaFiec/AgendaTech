import React, { useEffect, useMemo, useState } from 'react'
import { SectionHeader, CalendarGrid } from '../../components/shared'
import { getClientCalendar } from '../../services/client'
import { dateBR, timeBR, currency } from '../../utils/formatters'
import Badge from '../../components/ui/Badge'
import { statusVariant } from './helpers'

export default function CalendarioClientePage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [appointments, setAppointments] = useState([])
  const [selectedDay, setSelectedDay] = useState(null)

  useEffect(() => {
    let active = true
    getClientCalendar().then((res) => {
      if (!active) return
      const data = res?.data || []
      setAppointments(Array.isArray(data) ? data : data?.items || data?.rows || [])
    })
    return () => { active = false }
  }, [])

  const days = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
      const dayAppointments = appointments.filter((a) => a.data_agendamento === dateStr)
      return { label: String(dayNum), day: dayNum, tags: dayAppointments.map(() => ({ cor: '#6c5ce7' })), appointments: dayAppointments }
    })
  }, [appointments, year, month])

  const selectedDayData = selectedDay ? days.find((d) => d.day === selectedDay) : null

  function handleMonthChange(newYear, newMonth) {
    setYear(newYear)
    setMonth(newMonth)
    setSelectedDay(null)
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <SectionHeader title="Calendário pessoal" subtitle="Seus agendamentos no calendário" />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="panel">
          <CalendarGrid
            days={days}
            year={year}
            month={month}
            selectedDay={selectedDay}
            onMonthChange={handleMonthChange}
            onDayClick={(d) => setSelectedDay(d.day)}
          />
        </div>

        <div className="panel">
          <h3 className="font-heading text-2xl text-foreground mb-4">
            {selectedDay ? `Dia ${selectedDay}` : 'Selecione um dia'}
          </h3>
          {selectedDayData?.appointments?.length ? (
            <div className="space-y-3">
              {selectedDayData.appointments.map((a) => (
                <div key={a.id} className="rounded-xl border border-line bg-surface-alt p-3">
                  <div className="text-sm font-medium text-foreground">{a.servico_nome || a.empresa_nome || 'Serviço'}</div>
                  <div className="text-xs text-muted mt-1">{timeBR(a.hora_inicio)} - {timeBR(a.hora_fim)}</div>
                  {a.empresa_nome && <div className="text-xs text-muted">{a.empresa_nome}</div>}
                  {a.valor && <div className="text-xs text-muted">{currency(a.valor)}</div>}
                  <Badge variant={statusVariant(a.status_agendamento)} className="mt-2">{a.status_agendamento}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">{selectedDay ? 'Nenhum agendamento neste dia.' : 'Clique em um dia para ver detalhes.'}</p>
          )}
        </div>
      </div>
    </div>
  )
}
