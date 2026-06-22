/**
 * @file app/history/page.tsx
 * @description Displays all past workouts in a list, sorted by end time
 *              Each workout is rendered as a HistoryWorkoutCard, which shows the workout name, date and time as well as a summary
 *              of the exercises performed
 *
 */

"use client"

import { NavigationBar } from "@/components/navigation-bar"
import { HistoryWorkoutCard } from "@/components/history-workout-card"
import { useWorkouts } from "@/hooks/use-workouts"
import { formatWorkoutError } from "@/lib/format-workout-error"
import { WorkoutLoadingScreen } from "@/components/workout/workout-page-state"

export default function HistoryPage() {
  const { workouts, isLoading, isError, error, mutate } = useWorkouts()

  const pastWorkouts =
    workouts
      ?.filter((w) => !w.isActive)
      .sort((a, b) => {
        const timeA = a.endTime || a.startTime
        const timeB = b.endTime || b.startTime
        const endOrStartDateA = a.endDate ?? a.startDate
        const endOrStartDateB = b.endDate ?? b.startDate
        const dateTimeA = new Date(endOrStartDateA + "T" + timeA + ":00")
        const dateTimeB = new Date(endOrStartDateB + "T" + timeB + ":00")
        const timeDiff = dateTimeB.getTime() - dateTimeA.getTime()
        if (timeDiff === 0) {
          return b.id.localeCompare(a.id)
        }
        return timeDiff
      }) || []

  if (isLoading) {
    return (
      <>
        <WorkoutLoadingScreen message="Verlauf wird geladen…" />
        <NavigationBar />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <header className="relative h-16 border-b border-gray-800">
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-semibold">
          Vergangene Trainingseinheiten
        </h1>
      </header>

      <div className="p-6">
        {isError ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{formatWorkoutError(error)}</p>
            <button
              type="button"
              onClick={() => mutate()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white text-sm"
            >
              Erneut versuchen
            </button>
          </div>
        ) : pastWorkouts.length > 0 ? (
          <div>
            {pastWorkouts.map((workout) => (
              <HistoryWorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Noch keine vergangenen Trainingseinheiten</p>
          </div>
        )}
      </div>

      <NavigationBar />
    </div>
  )
}
