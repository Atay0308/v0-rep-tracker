/**
 * Past workouts history page
 */

"use client"

import { NavigationBar } from "@/components/navigation-bar"
import { HistoryWorkoutCard } from "@/components/history-workout-card"
import { useWorkouts } from "@/hooks/use-workouts"

export default function HistoryPage() {
  const { workouts, isLoading } = useWorkouts()

  const pastWorkouts =
    workouts
      ?.filter((w) => !w.isActive)
      .sort((a, b) => {
        const dateA = new Date(a.date + " " + (a.startTime || "00:00"))
        const dateB = new Date(b.date + " " + (b.startTime || "00:00"))
        return dateB.getTime() - dateA.getTime()
      }) || []

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <header className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Vergangene Trainingseinheiten</h1>
      </header>

      {/* Workouts list */}
      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Laden...</p>
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
