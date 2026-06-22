/**
 * Statistics Utility Functions
 *
 * Provides functions for calculating and processing workout statistics data.
 * Handles time period filtering, data grouping, and metric calculations.
 */

import type { WorkoutUI, StatDataPoint, TimePeriod, GroupBy, MuscleGroup } from "@/types/workout"
import { startOfWeek, startOfMonth, format, subMonths, isAfter } from "date-fns"
import { calculateDuration } from "@/lib/date-utils" 

/**
 * Filter workouts by time period
 *
 * Returns workouts that fall within the specified time period from now.
 *
 * @param workouts - Array of all workouts
 * @param period - Time period to filter by ("1M", "3M", "6M", "1Y", "ALL")
 * @returns Filtered array of workouts within the time period
 *
 * @example
 * ```ts
 * const recentWorkouts = filterWorkoutsByPeriod(allWorkouts, "6M")
 * // Returns workouts from the last 6 months
 * ```
 */
export function filterWorkoutsByPeriod(workouts: WorkoutUI[], period: TimePeriod): WorkoutUI[] {
  const now = new Date()
  let cutoffDate: Date

  switch (period) {
    case "1M":
      cutoffDate = subMonths(now, 1)
      break
    case "3M":
      cutoffDate = subMonths(now, 3)
      break
    case "6M":
      cutoffDate = subMonths(now, 6)
      break
    case "1Y":
      cutoffDate = subMonths(now, 12)
      break
    case "ALL":
      return workouts
    default:
      return workouts
  }

  return workouts.filter((w) => isAfter(new Date(w.startDate), cutoffDate))
}

/**
 * Calculate volume (total sets) per muscle group over time
 *
 * Groups workouts by time period and calculates the total number of sets
 * performed for a specific muscle group.
 *
 * @param workouts - Array of workouts to analyze
 * @param muscleGroup - Target muscle group to calculate volume for
 * @param groupBy - How to group the data ("Day", "Week", "Month")
 * @returns Array of data points with date and volume (set count)
 *
 * @example
 * ```ts
 * const chestVolume = calculateMuscleGroupVolume(workouts, "Brust", "Week")
 * // Returns weekly chest volume data: [{ date: "2025-01-01", value: 12 }, ...]
 * ```
 */
export function calculateMuscleGroupVolume(
  workouts: WorkoutUI[],
  muscleGroup: MuscleGroup | "",
  groupBy: GroupBy,
): StatDataPoint[] {
  // Only include completed workouts (not active)
  const filtered = workouts.filter((w) => !w.isActive)

  // Group workouts by time period and sum sets
  const grouped = new Map<string, number>()

  filtered.forEach((workout) => {
    const date = new Date(workout.startDate)
    let key: string

    // Determine grouping key based on groupBy parameter
    switch (groupBy) {
      case "Week":
        key = format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd")
        break
      case "Month":
        key = format(startOfMonth(date), "yyyy-MM-dd")
        break
      case "Day":
      default:
        key = format(date, "yyyy-MM-dd")
        break
    }

    // Calculate total sets for the target muscle group in this workout
    const volume = workout.exercises
      .filter((ex) => ex.muscleGroup === muscleGroup)
      .reduce((sum, ex) => sum + ex.sets.length, 0)

    // Add to grouped data
    if (volume > 0)
      grouped.set(key, (grouped.get(key) || 0) + volume)
  })

  // Convert map to array and sort by date
  return Array.from(grouped.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Calculate maximum weight progression for a specific exercise
 *
 * Tracks the maximum weight lifted for an exercise over time,
 * grouped by the specified time period.
 *
 * @param workouts - Array of workouts to analyze
 * @param exerciseName - Name of the exercise to track
 * @param groupBy - How to group the data ("Day", "Week", "Month")
 * @returns Array of data points with date and max weight
 *
 * @example
 * ```ts
 * const benchProgress = calculateExerciseMaxWeight(workouts, "Bankdrücken", "Week")
 * // Returns weekly max bench press: [{ date: "2025-01-01", value: 80 }, ...]
 * ```
 */
export function calculateExerciseMaxWeight(
  workouts: WorkoutUI[],
  exerciseName: string,
  groupBy: GroupBy,
): StatDataPoint[] {
  // Only include completed workouts
  const filtered = workouts.filter((w) => !w.isActive)

  // Group workouts and track max weight
  const grouped = new Map<string, number>()

  filtered.forEach((workout) => {
    const date = new Date(workout.startDate)
    let key: string

    // Determine grouping key
    switch (groupBy) {
      case "Week":
        key = format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd")
        break
      case "Month":
        key = format(startOfMonth(date), "yyyy-MM-dd")
        break
      case "Day":
      default:
        key = format(date, "yyyy-MM-dd")
        break
    }

    // Find all instances of this exercise in the workout
    const exerciseData = workout.exercises.filter((ex) => ex.exerciseName === exerciseName)

    if (exerciseData.length > 0) {
      // Find the maximum weight across all sets
      const maxWeight = Math.max(...exerciseData.flatMap((ex) => ex.sets.map((s) => s.weight)))
      const currentMax = grouped.get(key) || 0
      // Keep the highest weight for this time period
      grouped.set(key, Math.max(currentMax, maxWeight))
    }
  })

  // Convert to array and sort by date
  return Array.from(grouped.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Get all unique exercise names from workouts
 *
 * Extracts and returns a sorted list of all unique exercises
 * that have been performed across all workouts.
 *
 * @param workouts - Array of workouts to extract exercises from
 * @returns Sorted array of unique exercise names
 *
 * @example
 * ```ts
 * const exercises = getUniqueExercises(workouts)
 * // Returns: ["Bankdrücken", "Kniebeuge", "Kreuzheben", ...]
 * ```
 */
export function getUniqueExercises(workouts: WorkoutUI[]): string[] {
  const exercises = new Set<string>()
  workouts.forEach((workout) => {
    workout.exercises.forEach((ex) => {
      exercises.add(ex.exerciseName)
    })
  })
  return Array.from(exercises).sort()
}

/**
 * Calculate total number of completed workouts
 *
 * Counts all workouts that have been finished (not active).
 *
 * @param workouts - Array of all workouts
 * @returns Total count of completed workouts
 *
 * @example
 * ```ts
 * const total = calculateTotalWorkouts(workouts)
 * // Returns: 42
 * ```
 */
export function calculateTotalWorkouts(workouts: WorkoutUI[]): number {
  return workouts.filter((w) => !w.isActive).length
}

/**
 * Calculate total training time across all workouts
 *
 * Sums up the duration of all completed workouts that have
 * both start and end times recorded.
 *
 * @param workouts - Array of all workouts
 * @returns Total training time in minutes
 *
 * @example
 * ```ts
 * const totalMinutes = calculateTotalTrainingTime(workouts)
 * const hours = Math.round(totalMinutes / 60)
 * // Returns total training time in minutes
 * ```
 */
export function calculateTotalTrainingTime(workouts: WorkoutUI[]): number {
  return workouts
    .filter((w) => !w.isActive && w.endTime)
    .reduce((total, w) => {
      const duration = calculateDuration(w.startTime, w.endTime!, w.startDate, w.endDate)
      return total + duration
    }, 0)
}
