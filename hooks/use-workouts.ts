/**
 * Custom hook for workout data fetching with SWR
 */

import useSWR from "swr"
import type { Workout } from "@/types/workout"
import { getWorkouts, getActiveWorkout, getRecentWorkouts } from "@/lib/workout-api"

/**
 * Fetch all workouts
 */
export function useWorkouts() {
  const { data, error, isLoading, mutate } = useSWR<Workout[]>("workouts", getWorkouts)

  return {
    workouts: data,
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Fetch active workout
 */
export function useActiveWorkout() {
  const { data, error, isLoading, mutate } = useSWR<Workout | null>("active-workout", getActiveWorkout)

  return {
    activeWorkout: data,
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Fetch recent workouts
 */
export function useRecentWorkouts(limit = 3) {
  const { data, error, isLoading, mutate } = useSWR<Workout[]>(`recent-workouts-${limit}`, () =>
    getRecentWorkouts(limit),
  )

  return {
    recentWorkouts: data,
    isLoading,
    isError: error,
    mutate,
  }
}
