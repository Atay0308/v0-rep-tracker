import { createWorkout, updateWorkout, getWorkout } from "@/app/actions/workout-actions"
import type { Workout } from "@/types/workout"

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, "localStorage", { value: localStorageMock })

describe("Workout Flow Integration Tests", () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it("creates a workout, adds exercises, and completes it", async () => {
    // Step 1: Create a new workout
    const newWorkout: Omit<Workout, "id"> = {
      name: "Integration Test Workout",
      date: "2025-01-20",
      startTime: "10:00",
      notes: "",
      isActive: true,
      exercises: [],
    }

    const created = await createWorkout(newWorkout)
    expect(created.id).toBeDefined()
    expect(created.isActive).toBe(true)

    // Step 2: Add an exercise with sets
    const withExercise = await updateWorkout(created.id, {
      exercises: [
        {
          id: "e1",
          workoutId: created.id,
          exerciseName: "Bankdrücken",
          muscleGroup: "Brust",
          order: 1,
          sets: [
            { id: "s1", setNumber: 1, weight: 80, reps: 10, breakTime: 90 },
            { id: "s2", setNumber: 2, weight: 85, reps: 8, breakTime: 90 },
          ],
        },
      ],
    })

    expect(withExercise.exercises.length).toBe(1)
    expect(withExercise.exercises[0].sets.length).toBe(2)

    // Step 3: Complete the workout
    const completed = await updateWorkout(created.id, {
      endTime: "11:30",
      isActive: false,
    })

    expect(completed.isActive).toBe(false)
    expect(completed.endTime).toBe("11:30")

    // Step 4: Verify the workout is saved correctly
    const retrieved = await getWorkout(created.id)
    expect(retrieved.exercises.length).toBe(1)
    expect(retrieved.isActive).toBe(false)
  })

  it("updates set data during workout", async () => {
    // Create workout with exercise
    const workout = await createWorkout({
      name: "Test",
      date: "2025-01-20",
      startTime: "10:00",
      isActive: true,
      exercises: [
        {
          id: "e1",
          workoutId: "temp",
          exerciseName: "Bankdrücken",
          muscleGroup: "Brust",
          order: 1,
          sets: [{ id: "s1", setNumber: 1, weight: 0, reps: 0, breakTime: 0 }],
        },
      ],
    })

    // Update set data
    const updatedExercises = [...workout.exercises]
    updatedExercises[0].sets[0] = {
      ...updatedExercises[0].sets[0],
      weight: 80,
      reps: 10,
    }

    const updated = await updateWorkout(workout.id, {
      exercises: updatedExercises,
    })

    expect(updated.exercises[0].sets[0].weight).toBe(80)
    expect(updated.exercises[0].sets[0].reps).toBe(10)
  })
})
