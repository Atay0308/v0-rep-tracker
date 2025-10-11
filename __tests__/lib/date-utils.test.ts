/**
 * Tests for date utility functions
 */

import { formatDateLong, formatDateShort, getWeekDays, calculateDuration } from "@/lib/date-utils"

describe("Date Utils", () => {
  describe("formatDateLong", () => {
    it("should format date in long format", () => {
      const date = new Date("2025-09-25")
      const result = formatDateLong(date)
      expect(result).toContain("September")
    })
  })

  describe("formatDateShort", () => {
    it("should format date in short format", () => {
      const date = new Date("2025-09-23")
      const result = formatDateShort(date)
      expect(result).toContain("Sep")
      expect(result).toContain("2025")
    })
  })

  describe("getWeekDays", () => {
    it("should return 7 days", () => {
      const days = getWeekDays(new Date("2025-09-25"))
      expect(days).toHaveLength(7)
    })

    it("should mark today correctly", () => {
      const today = new Date()
      const days = getWeekDays(today)
      const todayEntry = days.find((d) => d.isToday)
      expect(todayEntry).toBeDefined()
    })
  })

  describe("calculateDuration", () => {
    it("should calculate duration correctly", () => {
      const duration = calculateDuration("18:00", "19:30")
      expect(duration).toBe(90)
    })

    it("should handle same hour", () => {
      const duration = calculateDuration("18:00", "18:45")
      expect(duration).toBe(45)
    })

    it("should handle multiple hours", () => {
      const duration = calculateDuration("14:30", "17:15")
      expect(duration).toBe(165)
    })
  })
})
