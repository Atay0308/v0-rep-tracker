"use client"

import { Plus, Play } from "lucide-react"
import Link from "next/link"
import { WeekCalendar } from "@/components/week-calendar"
import { WorkoutCard } from "@/components/workout-card"
import { NavigationBar } from "@/components/navigation-bar"
import { useActiveWorkout, useRecentWorkouts } from "@/hooks/use-workouts"
import { formatDateLong } from "@/lib/date-utils"

export default function HomePage() {
  const { activeWorkout } = useActiveWorkout()
  const { recentWorkouts, isLoading: recentLoading } = useRecentWorkouts(3)
  const today = new Date()

  return (
    <div className="page">
      <header className="page-content">
        <div className="text-muted text-sm">{formatDateLong(today).split(",")[0]}</div>
        <h1 className="text-2xl font-bold">{formatDateLong(today).split(",")[1]}</h1>
      </header>

      <div className="page-content">
        <WeekCalendar />
      </div>

      <div className="page-content" style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}>
        <h2 className="text-xl font-medium mb-lg" style={{ whiteSpace: 'pre-line' }}>
          {activeWorkout ? "Training fortsetzen" : "Neues Training\nstarten"}
        </h2>
        <Link
          href={activeWorkout ? `/workout/${activeWorkout.id}` : "/workout/new"}
          className="btn btn-icon"
          style={{
            width: '5rem',
            height: '5rem',
            backgroundColor: activeWorkout ? 'var(--color-success)' : 'var(--color-primary)',
          }}
          aria-label={activeWorkout ? "Training fortsetzen" : "Neues Training starten"}
        >
          {activeWorkout ? (
            <Play style={{ width: '2.5rem', height: '2.5rem', fill: 'white' }} />
          ) : (
            <Plus style={{ width: '2.5rem', height: '2.5rem' }} />
          )}
        </Link>
      </div>

      <div className="page-content mt-xl">
        <h3 className="text-lg font-medium text-center mb-md">Letzten 3 Trainingseinheiten</h3>

        {recentLoading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
          </div>
        ) : recentWorkouts && recentWorkouts.length > 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ overflowX: 'auto', paddingBottom: 'var(--spacing-md)', maxWidth: '100%' }}>
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
                {recentWorkouts.map((workout) => (
                  <div key={workout.id} style={{ width: '20rem', flexShrink: 0 }}>
                    <WorkoutCard workout={workout} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-muted text-center" style={{ padding: 'var(--spacing-xl) 0' }}>
            Noch keine Trainingseinheiten
          </div>
        )}
      </div>

      <NavigationBar />
    </div>
  )
}
