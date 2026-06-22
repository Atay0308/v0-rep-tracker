/**
 * @file use-workouts.ts
 * @description SWR-Hooks für Workout-Daten — ausschließlich {@link WorkoutUI}.
 *
 * Fetcher rufen Server Actions aus `@/app/actions/workout-actions` auf.
 * SWR läuft nur bei authentifizierter Session (`useWorkoutSwrKey`).
 */

import useSWR from "swr"
import type { WorkoutUI } from "@/types/workout"
import { getWorkouts, getActiveWorkout, getRecentWorkouts } from "@/app/actions/workout-actions"
import { useWorkoutSession, useWorkoutSwrKey } from "@/hooks/use-workout-session"

/** Alle Workouts des eingeloggten Users. */
export function useWorkouts() {
  const { isSessionLoading, isAuthenticated, isUnauthenticated } = useWorkoutSession()
  const swrKey = useWorkoutSwrKey("workouts")

  const { data, error, isLoading, mutate } = useSWR<WorkoutUI[]>(swrKey, getWorkouts)

  return {
    workouts: data,
    isLoading: isSessionLoading || isLoading,
    isAuthenticated,
    isUnauthenticated,
    isError: error,
    error,
    mutate,
  }
}

/** Aktives Workout (falls vorhanden). */
export function useActiveWorkout() {
  const { isSessionLoading, isAuthenticated, isUnauthenticated } = useWorkoutSession()
  const swrKey = useWorkoutSwrKey("active-workout")

  const { data, error, isLoading, mutate } = useSWR<WorkoutUI | null>(swrKey, getActiveWorkout)

  return {
    activeWorkout: data,
    isLoading: isSessionLoading || isLoading,
    isAuthenticated,
    isUnauthenticated,
    isError: error,
    error,
    mutate,
  }
}

/** Letzte abgeschlossene Workouts. */
export function useRecentWorkouts(limit = 3) {
  const { isSessionLoading, isAuthenticated, isUnauthenticated } = useWorkoutSession()
  const swrKey = useWorkoutSwrKey(`recent-workouts-${limit}`)

  const { data, error, isLoading, mutate } = useSWR<WorkoutUI[]>(
    swrKey,
    () => getRecentWorkouts(limit),
  )

  return {
    recentWorkouts: data,
    isLoading: isSessionLoading || isLoading,
    isAuthenticated,
    isUnauthenticated,
    isError: error,
    error,
    mutate,
  }
}
