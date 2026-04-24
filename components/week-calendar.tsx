"use client"

import { getWeekDays } from "@/lib/date-utils"

export function WeekCalendar() {
  const weekDays = getWeekDays()

  return (
    <div className="week-calendar">
      {weekDays.map((day, index) => (
        <button
          key={index}
          className="week-day"
          style={{
            backgroundColor: day.isToday ? 'var(--color-primary)' : 'var(--color-secondary)',
            color: day.isToday ? 'white' : 'var(--color-muted)',
            borderRadius: 'var(--radius-xl)',
            transition: 'background-color var(--transition-fast)',
          }}
        >
          <span className="text-2xl font-bold">{day.day}</span>
          <span className="text-xs" style={{ marginTop: 'var(--spacing-xs)' }}>{day.dayName}</span>
        </button>
      ))}
    </div>
  )
}
