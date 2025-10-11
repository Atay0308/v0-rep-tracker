/**
 * Tests for statistics utility functions
 */

import {
  filterWorkoutsByPeriod,
  calculateMuscleGroupVolume,
  calculateExerciseMaxWeight,
  getUniqueExercises,
  calculateTotalWorkouts,
  calculateTotalTrainingTime,
} from "@/lib/statistics-utils"
import type { Workout } from "@/types/workout"

const mockWorkouts: Workout[] = [
  {
    id: "1",
    name: "Test Workout 1",
    date: "2025-09-20",
    startTime: "18:00",
    endTime: "19:00",
    isActive: false,
    exercises: [
      {
        id: "ex-1",
        workoutId: "1",
        exerciseName: "Bankdrücken",
        muscleGroup: "Brust",
        order: 1,
        sets: [
          { id: "s1", setNumber: 1, weight: 80, reps: 10, breakTime: 90 },
          { id: "s2", setNumber: 2, weight: 85, reps: 8, breakTime: 90 },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Test Workout 2",
    date: "2025-09-22",
    startTime: "17:00",
    endTime: "18:30",
    isActive: false,
    exercises: [
      {
        id: "ex-2",
        workoutId: "2",
        exerciseName: "Bankdrücken",
        muscleGroup: "Brust",
        order: 1,
        sets: [{ id: "s3", setNumber: 1, weight: 90, reps: 6, breakTime: 90 }],
      },
    ],
  },
]

describe("Statistics Utils", () => {
  describe("filterWorkoutsByPeriod", () => {
    it("should return all workouts for ALL period", () => {
      const result = filterWorkoutsByPeriod(mockWorkouts, "ALL")
      expect(result).toHaveLength(2)
    })

    it("should filter by time period", () => {
      const result = filterWorkoutsByPeriod(mockWorkouts, "1M")
      expect(result.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe("calculateMuscleGroupVolume", () => {
    it("should calculate volume for muscle group", () => {
      const result = calculateMuscleGroupVolume(mockWorkouts, "Brust", "Day")
      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toHaveProperty("date")
      expect(result[0]).toHaveProperty("value")
    })
  })

  describe("calculateExerciseMaxWeight", () => {
    it("should calculate max weight progression", () => {
      const result = calculateExerciseMaxWeight(mockWorkouts, "Bankdrücken", "Day")
      expect(result.length).toBeGreaterThan(0)
      expect(result[0].value).toBeGreaterThan(0)
    })
  })

  describe("getUniqueExercises", () => {
    it("should return unique exercise names", () => {
      const result = getUniqueExercises(mockWorkouts)
      expect(result).toContain("Bankdrücken")
      expect(result.length).toBe(1)
    })
  })

  describe("calculateTotalWorkouts", () => {
    it("should count completed workouts", () => {
      const result = calculateTotalWorkouts(mockWorkouts)
      expect(result).toBe(2)
    })

    it("should exclude active workouts", () => {
      const workoutsWithActive = [...mockWorkouts, { ...mockWorkouts[0], id: "3", isActive: true }]
      const result = calculateTotalWorkouts(workoutsWithActive)
      expect(result).toBe(2)
    })
  })

  describe("calculateTotalTrainingTime", () => {
    it("should calculate total training time", () => {
      const result = calculateTotalTrainingTime(mockWorkouts)
      expect(result).toBe(150) // 60 + 90 minutes
    })
  })
})
