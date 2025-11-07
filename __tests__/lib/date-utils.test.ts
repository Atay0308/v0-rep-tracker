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

    it("should include day name", () => {
      const date = new Date("2025-09-25")
      const result = formatDateLong(date)
      expect(result).toMatch(/Donnerstag|Freitag|Samstag|Sonntag|Montag|Dienstag|Mittwoch/)
    })

    it("should include day number", () => {
      const date = new Date("2025-09-25")
      const result = formatDateLong(date)
      expect(result).toContain("25")
    })
  })

  describe("formatDateShort", () => {
    it("should format date in short format", () => {
      const date = new Date("2025-09-23")
      const result = formatDateShort(date)
      expect(result).toContain("Sep")
      expect(result).toContain("2025")
    })

    it("should include day abbreviation", () => {
      const date = new Date("2025-09-23")
      const result = formatDateShort(date)
      expect(result).toMatch(/Mo|Di|Mi|Do|Fr|Sa|So/)
    })

    it("should include day number with period", () => {
      const date = new Date("2025-09-23")
      const result = formatDateShort(date)
      expect(result).toContain("23.")
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

    it("should start week on Monday", () => {
      const days = getWeekDays(new Date("2025-09-25"))
      expect(days[0].dayName).toMatch(/Mo/)
    })

    it("should end week on Sunday", () => {
      const days = getWeekDays(new Date("2025-09-25"))
      expect(days[6].dayName).toMatch(/So/)
    })

    it("should include date objects", () => {
      const days = getWeekDays(new Date("2025-09-25"))
      days.forEach((day) => {
        expect(day.date).toBeInstanceOf(Date)
        expect(typeof day.day).toBe("number")
        expect(typeof day.dayName).toBe("string")
        expect(typeof day.isToday).toBe("boolean")
      })
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

    it("should return 0 for same time", () => {
      const duration = calculateDuration("18:00", "18:00")
      expect(duration).toBe(0)
    })

    it("should handle minutes only difference", () => {
      const duration = calculateDuration("18:15", "18:45")
      expect(duration).toBe(30)
    })

    it("should handle hours only difference", () => {
      const duration = calculateDuration("14:00", "17:00")
      expect(duration).toBe(180)
    })

    it("should handle complex time differences", () => {
      const duration = calculateDuration("09:15", "12:45")
      expect(duration).toBe(210) // 3 hours 30 minutes
    })
  })
})
