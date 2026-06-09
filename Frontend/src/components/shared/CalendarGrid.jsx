import React, { useMemo, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay()
}

export default function CalendarGrid({ days = [], onDayClick, onMonthChange, year: propYear, month: propMonth, selectedDay }) {
  const now = new Date()
  const [internalYear, setInternalYear] = useState(now.getFullYear())
  const [internalMonth, setInternalMonth] = useState(now.getMonth())

  const year = propYear ?? internalYear
  const month = propMonth ?? internalMonth

  const totalDays = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfWeek(year, month)
  const today = now.getFullYear() === year && now.getMonth() === month ? now.getDate() : null

  const dayMap = useMemo(() => {
    const map = {}
    days.forEach((d) => {
      const key = Number(d.label || d.day || d.dia)
      if (key) map[key] = d
    })
    return map
  }, [days])

  function navigate(delta) {
    let newMonth = month + delta
    let newYear = year
    if (newMonth < 0) { newMonth = 11; newYear -= 1 }
    if (newMonth > 11) { newMonth = 0; newYear += 1 }
    if (onMonthChange) {
      onMonthChange(newYear, newMonth)
    } else {
      setInternalYear(newYear)
      setInternalMonth(newMonth)
    }
  }

  const cells = useMemo(() => {
    const arr = []
    for (let i = 0; i < firstDay; i++) arr.push(null)
    for (let d = 1; d <= totalDays; d++) arr.push(d)
    return arr
  }, [firstDay, totalDays])

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="rounded-full p-2 text-muted hover:bg-surface-alt hover:text-foreground transition">
          <FiChevronLeft size={20} />
        </button>
        <h3 className="font-heading text-3xl text-foreground">
          {MONTHS[month]} {year}
        </h3>
        <button onClick={() => navigate(1)} className="rounded-full p-2 text-muted hover:bg-surface-alt hover:text-foreground transition">
          <FiChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {WEEKDAYS.map((label) => (
          <div key={label} className="py-2 text-center text-[.7rem] font-bold uppercase tracking-[.08em] text-muted">
            {label}
          </div>
        ))}
        {cells.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="min-h-12" />
          }
          const dayData = dayMap[day]
          const isToday = day === today
          const isSelected = day === selectedDay
          const hasTags = dayData?.tags?.length > 0

          return (
            <button
              key={`day-${day}`}
              onClick={() => onDayClick?.({ day, ...dayData })}
              className={`relative min-h-12 rounded-xl border p-2 text-sm transition-all hover:-translate-y-[1px] ${
                isSelected
                  ? 'border-purple bg-purple/15 text-white ring-1 ring-purple'
                  : isToday
                  ? 'border-purple/50 bg-purple/8 text-foreground'
                  : 'border-line bg-surface text-muted hover:bg-surface-alt hover:text-foreground'
              }`}
            >
              <span className="block text-left font-medium">{day}</span>
              {hasTags && (
                <div className="absolute right-1.5 top-1.5 flex gap-0.5">
                  {dayData.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: tag.cor || '#00d4ff' }}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
