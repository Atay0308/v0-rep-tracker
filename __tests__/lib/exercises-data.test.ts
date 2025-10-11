/**
 * Tests for exercise data functions
 */

import { getExercisesByMuscleGroup, getExerciseByName, MUSCLE_GROUPS } from "@/lib/exercises-data"

describe("Exercise Data", () => {
  describe("getExercisesByMuscleGroup", () => {
    it("should return exercises for valid muscle group", () => {
      const exercises = getExercisesByMuscleGroup("Brust")
      expect(exercises.length).toBeGreaterThan(0)
      expect(exercises[0]).toHaveProperty("name")
      expect(exercises[0]).toHaveProperty("muscleGroup")
    })

    it("should return all exercises for each muscle group", () => {
      MUSCLE_GROUPS.forEach((muscle) => {
        const exercises = getExercisesByMuscleGroup(muscle)
        expect(exercises.length).toBeGreaterThan(0)
      })
    })
  })

  describe("getExerciseByName", () => {
    it("should find exercise by name", () => {
      const exercise = getExerciseByName("Bankdrücken")
      expect(exercise).toBeDefined()
      expect(exercise?.name).toBe("Bankdrücken")
      expect(exercise?.muscleGroup).toBe("Brust")
    })

    it("should return undefined for non-existent exercise", () => {
      const exercise = getExerciseByName("NonExistentExercise")
      expect(exercise).toBeUndefined()
    })
  })

  describe("MUSCLE_GROUPS", () => {
    it("should contain all expected muscle groups", () => {
      expect(MUSCLE_GROUPS).toContain("Brust")
      expect(MUSCLE_GROUPS).toContain("Beine")
      expect(MUSCLE_GROUPS).toContain("Rücken")
      expect(MUSCLE_GROUPS.length).toBe(8)
    })
  })
})
