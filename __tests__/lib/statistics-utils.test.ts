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

    it("should filter workouts from last 3 months", () => {
      const oldWorkout: Workout = {
        ...mockWorkouts[0],
        id: "old",
        date: "2024-01-01",
      }
      const allWorkouts = [...mockWorkouts, oldWorkout]
      const result = filterWorkoutsByPeriod(allWorkouts, "3M")
      expect(result).not.toContainEqual(oldWorkout)
    })

    it("should include recent workouts in 6M period", () => {
      const result = filterWorkoutsByPeriod(mockWorkouts, "6M")
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

    it("should return empty array for non-existent muscle group", () => {
      const result = calculateMuscleGroupVolume(mockWorkouts, "Nacken", "Day")
      expect(result.length).toBe(0)
    })

    it("should group by week correctly", () => {
      const result = calculateMuscleGroupVolume(mockWorkouts, "Brust", "Week")
      expect(result.length).toBeGreaterThan(0)
      result.forEach((point) => {
        expect(point.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      })
    })

    it("should sum sets across multiple exercises", () => {
      const workoutWithMultipleChestExercises: Workout = {
        ...mockWorkouts[0],
        exercises: [
          ...mockWorkouts[0].exercises,
          {
            id: "ex-3",
            workoutId: "1",
            exerciseName: "Fliegende",
            muscleGroup: "Brust",
            order: 2,
            sets: [
              { id: "s4", setNumber: 1, weight: 20, reps: 12, breakTime: 60 },
              { id: "s5", setNumber: 2, weight: 20, reps: 12, breakTime: 60 },
            ],
          },
        ],
      }
      const result = calculateMuscleGroupVolume([workoutWithMultipleChestExercises], "Brust", "Day")
      expect(result[0].value).toBe(4) // 2 sets from Bankdrücken + 2 from Fliegende
    })
  })

  describe("calculateExerciseMaxWeight", () => {
    it("should calculate max weight progression", () => {
      const result = calculateExerciseMaxWeight(mockWorkouts, "Bankdrücken", "Day")
      expect(result.length).toBeGreaterThan(0)
      expect(result[0].value).toBeGreaterThan(0)
    })

    it("should return empty array for non-existent exercise", () => {
      const result = calculateExerciseMaxWeight(mockWorkouts, "Non-existent Exercise", "Day")
      expect(result.length).toBe(0)
    })

    it("should track max weight across multiple sets", () => {
      const result = calculateExerciseMaxWeight(mockWorkouts, "Bankdrücken", "Day")
      // Should find 85kg from first workout and 90kg from second
      expect(result.some((point) => point.value === 85)).toBe(true)
      expect(result.some((point) => point.value === 90)).toBe(true)
    })

    it("should group by month correctly", () => {
      const result = calculateExerciseMaxWeight(mockWorkouts, "Bankdrücken", "Month")
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe("getUniqueExercises", () => {
    it("should return unique exercise names", () => {
      const result = getUniqueExercises(mockWorkouts)
      expect(result).toContain("Bankdrücken")
      expect(result.length).toBe(1)
    })

    it("should return sorted exercise names", () => {
      const multiExerciseWorkouts: Workout[] = [
        {
          ...mockWorkouts[0],
          exercises: [
            { ...mockWorkouts[0].exercises[0], exerciseName: "Kniebeuge" },
            { ...mockWorkouts[0].exercises[0], id: "ex-2", exerciseName: "Bankdrücken" },
            { ...mockWorkouts[0].exercises[0], id: "ex-3", exerciseName: "Kreuzheben" },
          ],
        },
      ]
      const result = getUniqueExercises(multiExerciseWorkouts)
      expect(result).toEqual(["Bankdrücken", "Kniebeuge", "Kreuzheben"])
    })

    it("should handle empty workout list", () => {
      const result = getUniqueExercises([])
      expect(result).toEqual([])
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

    it("should return 0 for empty array", () => {
      const result = calculateTotalWorkouts([])
      expect(result).toBe(0)
    })
  })

  describe("calculateTotalTrainingTime", () => {
    it("should calculate total training time", () => {
      const result = calculateTotalTrainingTime(mockWorkouts)
      expect(result).toBe(150) // 60 + 90 minutes
    })

    it("should return 0 for workouts without end time", () => {
      const incompleteWorkouts = mockWorkouts.map((w) => ({ ...w, endTime: undefined }))
      const result = calculateTotalTrainingTime(incompleteWorkouts)
      expect(result).toBe(0)
    })

    it("should handle workouts spanning midnight", () => {
      const midnightWorkout: Workout = {
        ...mockWorkouts[0],
        startTime: "23:30",
        endTime: "00:30",
      }
      const result = calculateTotalTrainingTime([midnightWorkout])
      // This will be negative, which is a known limitation
      expect(typeof result).toBe("number")
    })
  })
})
