/**
 * Date utility functions for the workout tracker
 */

import { format, startOfWeek, addDays, isToday } from "date-fns"
import { de } from "date-fns/locale"

/**
 * Format date for display (e.g., "Saturday, 25 September")
 */
export function formatDateLong(date: Date): string {
  return format(date, "EEEE, d MMMM", { locale: de })
}

/**
 * Format date for workout cards (e.g., "Di, 23. Sep. 2025")
 */
export function formatDateShort(date: Date): string {
  return format(date, "EEE, d. MMM. yyyy", { locale: de })
}

/**
 * Get current week days for calendar display
 */
export function getWeekDays(referenceDate: Date = new Date()): Array<{
  date: Date
  day: number
  dayName: string
  isToday: boolean
}> {
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 }) // Monday

  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i)
    return {
      date,
      day: date.getDate(),
      dayName: format(date, "EEE", { locale: de }),
      isToday: isToday(date),
    }
  })
}

/**
 * Format time (HH:mm)
 */
export function formatTime(time: string): string {
  return time
}

/**
 * Calculate workout duration in minutes
 * Now handles workouts spanning multiple days correctly
 */
export function calculateDuration(startTime: string, endTime: string, startDate?: string, endDate?: string): number {
  const [startHour, startMin] = startTime.split(":").map(Number)
  const [endHour, endMin] = endTime.split(":").map(Number)

  const startMinutes = startHour * 60 + startMin
  let endMinutes = endHour * 60 + endMin

  // If dates are provided and different, add 24 hours to end time
  if (startDate && endDate && startDate !== endDate) {
    endMinutes += 24 * 60
  }
  // If no dates provided but end time is earlier than start time, assume next day
  else if (endMinutes < startMinutes) {
    endMinutes += 24 * 60
  }

  return endMinutes - startMinutes
}
