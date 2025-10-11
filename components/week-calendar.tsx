/**
 * Week calendar component for date navigation
 */

"use client"

import { getWeekDays } from "@/lib/date-utils"
import { cn } from "@/lib/utils"

export function WeekCalendar() {
  const weekDays = getWeekDays()

  return (
    <div className="flex gap-2 justify-center">
      {weekDays.map((day, index) => (
        <button
          key={index}
          className={cn(
            "flex flex-col items-center justify-center rounded-2xl px-4 py-3 min-w-[60px] transition-colors",
            day.isToday ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700",
          )}
        >
          <span className="text-2xl font-semibold">{day.day}</span>
          <span className="text-xs mt-1">{day.dayName}</span>
        </button>
      ))}
    </div>
  )
}
