import {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getActiveWorkout,
  getRecentWorkouts,
} from "@/lib/workout-api"
import type { Workout } from "@/types/workout"

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

describe("Workout API", () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  describe("getWorkouts", () => {
    it("returns all workouts from localStorage", async () => {
      const workouts = await getWorkouts()
      expect(Array.isArray(workouts)).toBe(true)
    })

    it("returns workouts sorted by date descending", async () => {
      const workouts = await getWorkouts()
      if (workouts.length > 1) {
        const dates = workouts.map((w) => new Date(w.date).getTime())
        const sortedDates = [...dates].sort((a, b) => b - a)
        expect(dates).toEqual(sortedDates)
      }
    })
  })

  describe("createWorkout", () => {
    it("creates a new workout with generated ID", async () => {
      const newWorkout: Omit<Workout, "id"> = {
        name: "Test Workout",
        date: "2025-01-20",
        startTime: "10:00",
        notes: "",
        isActive: true,
        exercises: [],
      }

      const created = await createWorkout(newWorkout)

      expect(created.id).toBeDefined()
      expect(created.name).toBe("Test Workout")
      expect(created.isActive).toBe(true)
    })

    it("adds workout to localStorage", async () => {
      const newWorkout: Omit<Workout, "id"> = {
        name: "Test Workout",
        date: "2025-01-20",
        startTime: "10:00",
        notes: "",
        isActive: true,
        exercises: [],
      }

      await createWorkout(newWorkout)
      const workouts = await getWorkouts()

      expect(workouts.some((w) => w.name === "Test Workout")).toBe(true)
    })
  })

  describe("getWorkout", () => {
    it("retrieves a specific workout by ID", async () => {
      const newWorkout: Omit<Workout, "id"> = {
        name: "Specific Workout",
        date: "2025-01-20",
        startTime: "10:00",
        notes: "",
        isActive: true,
        exercises: [],
      }

      const created = await createWorkout(newWorkout)
      const retrieved = await getWorkout(created.id)

      expect(retrieved.id).toBe(created.id)
      expect(retrieved.name).toBe("Specific Workout")
    })

    it("throws error for non-existent workout", async () => {
      await expect(getWorkout("non-existent-id")).rejects.toThrow("Workout not found")
    })
  })

  describe("updateWorkout", () => {
    it("updates workout properties", async () => {
      const newWorkout: Omit<Workout, "id"> = {
        name: "Original Name",
        date: "2025-01-20",
        startTime: "10:00",
        notes: "",
        isActive: true,
        exercises: [],
      }

      const created = await createWorkout(newWorkout)
      const updated = await updateWorkout(created.id, { name: "Updated Name" })

      expect(updated.name).toBe("Updated Name")
      expect(updated.id).toBe(created.id)
    })

    it("preserves unchanged properties", async () => {
      const newWorkout: Omit<Workout, "id"> = {
        name: "Test",
        date: "2025-01-20",
        startTime: "10:00",
        notes: "Original notes",
        isActive: true,
        exercises: [],
      }

      const created = await createWorkout(newWorkout)
      const updated = await updateWorkout(created.id, { name: "New Name" })

      expect(updated.notes).toBe("Original notes")
      expect(updated.date).toBe("2025-01-20")
    })
  })

  describe("deleteWorkout", () => {
    it("removes workout from storage", async () => {
      const newWorkout: Omit<Workout, "id"> = {
        name: "To Delete",
        date: "2025-01-20",
        startTime: "10:00",
        notes: "",
        isActive: true,
        exercises: [],
      }

      const created = await createWorkout(newWorkout)
      await deleteWorkout(created.id)

      await expect(getWorkout(created.id)).rejects.toThrow("Workout not found")
    })
  })

  describe("getActiveWorkout", () => {
    it("returns active workout if exists", async () => {
      const activeWorkout: Omit<Workout, "id"> = {
        name: "Active",
        date: "2025-01-20",
        startTime: "10:00",
        notes: "",
        isActive: true,
        exercises: [],
      }

      await createWorkout(activeWorkout)
      const active = await getActiveWorkout()

      expect(active).not.toBeNull()
      expect(active?.isActive).toBe(true)
    })

    it("returns null if no active workout", async () => {
      localStorageMock.clear()
      localStorageMock.setItem("workout-tracker-data", JSON.stringify([]))

      const active = await getActiveWorkout()
      expect(active).toBeNull()
    })
  })

  describe("getRecentWorkouts", () => {
    it("returns only completed workouts", async () => {
      const recent = await getRecentWorkouts(5)
      expect(recent.every((w) => !w.isActive)).toBe(true)
    })

    it("respects the limit parameter", async () => {
      const recent = await getRecentWorkouts(2)
      expect(recent.length).toBeLessThanOrEqual(2)
    })

    it("returns workouts sorted by date descending", async () => {
      const recent = await getRecentWorkouts(5)
      if (recent.length > 1) {
        const dates = recent.map((w) => new Date(w.date).getTime())
        const sortedDates = [...dates].sort((a, b) => b - a)
        expect(dates).toEqual(sortedDates)
      }
    })
  })
})
