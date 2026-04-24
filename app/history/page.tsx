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
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Vergangene Trainingseinheiten</h1>
      </header>

      <div className="page-content">
        {isLoading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
          </div>
        ) : pastWorkouts.length > 0 ? (
          <div className="exercise-list">
            {pastWorkouts.map((workout) => (
              <HistoryWorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        ) : (
          <div className="text-muted text-center" style={{ padding: 'var(--spacing-xl) 0' }}>
            Noch keine vergangenen Trainingseinheiten
          </div>
        )}
      </div>

      <NavigationBar />
    </div>
  )
}
