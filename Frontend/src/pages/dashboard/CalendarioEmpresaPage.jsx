import React, { useEffect, useMemo, useState } from 'react'
import { SectionHeader, CalendarGrid } from '../../components/shared'
import { getRuleCalendar, listTags } from '../../services/company'
import { Badge } from '../../components/ui'
import { api } from '../../services/api'

export default function CalendarioEmpresaPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [calendarData, setCalendarData] = useState({})
  const [tags, setTags] = useState([])
  const [selectedDay, setSelectedDay] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    const apiMonth = month + 1
    getRuleCalendar(year, apiMonth).then((res) => {
      if (!active) return
      setCalendarData(res?.data || {})
      setLoading(false)
    }).catch(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [year, month])

  useEffect(() => {
    listTags().then((res) => {
      setTags(Array.isArray(res?.data) ? res.data : [])
    })
  }, [])

  const tagMap = useMemo(() => {
    const map = {}
    tags.forEach((t) => { map[t.id] = t })
    return map
  }, [tags])

  const days = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const calDays = calendarData?.dias || calendarData?.days || {}
    return Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1
      const dayKey = String(dayNum).padStart(2, '0')
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${dayKey}`
      const dayTags = calDays[dateKey] || calDays[dayKey] || calDays[dayNum] || []
      const resolvedTags = Array.isArray(dayTags)
        ? dayTags.map((t) => (typeof t === 'object' ? { ...t, cor: t.cor || tagMap[t.tag_id]?.cor || tagMap[t.id]?.cor } : tagMap[t] || { id: t }))
        : []
      return { label: String(dayNum), day: dayNum, tags: resolvedTags }
    })
  }, [calendarData, year, month, tagMap])

  const selectedDayData = selectedDay ? days.find((d) => d.day === selectedDay) : null

  function handleMonthChange(newYear, newMonth) {
    setYear(newYear)
    setMonth(newMonth)
    setSelectedDay(null)
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <SectionHeader title="Calendário" subtitle="Visualize tags e regras por dia" />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="panel">
          {loading && <div className="text-center text-muted py-4 text-sm">Carregando calendário...</div>}
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
          {selectedDayData?.tags?.length ? (
            <div className="space-y-3">
              {selectedDayData.tags.map((tag, i) => (
                <div key={i} className="rounded-xl border border-line bg-surface-alt p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded" style={{ backgroundColor: tag.cor || '#6c5ce7' }} />
                    <span className="text-foreground font-medium">{tag.nome || tag.label || `Tag #${tag.id}`}</span>
                  </div>
                  {tag.info && <p className="mt-1 text-xs text-muted">{tag.info}</p>}
                  <Badge variant={tag.aceita_agendamento === false ? 'danger' : 'success'} className="mt-2">
                    {tag.aceita_agendamento === false ? 'Sem agendamento' : 'Aceita agendamento'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">{selectedDay ? 'Nenhuma tag neste dia.' : 'Clique em um dia para ver detalhes.'}</p>
          )}

          {tags.length > 0 && (
            <div className="mt-6 border-t border-line pt-4">
              <div className="text-xs uppercase tracking-widest text-muted mb-2">Legenda</div>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <div key={t.id} className="flex items-center gap-1.5 text-xs text-muted">
                    <div className="h-3 w-3 rounded" style={{ backgroundColor: t.cor || '#6c5ce7' }} />
                    {t.nome}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
