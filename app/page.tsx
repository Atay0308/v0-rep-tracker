/**
 * @file app/page.tsx
 * @description Home page. Displays current date, week calender, active workout (if any) and recent workouts.
 *              Handles authentication state to show appropriate prompts and content.
 */

"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Plus, Play } from "lucide-react"
import Link from "next/link"
import { WeekCalendar } from "@/components/week-calendar"
import { WorkoutCard } from "@/components/workout-card"
import { NavigationBar } from "@/components/navigation-bar"
import { useActiveWorkout, useRecentWorkouts } from "@/hooks/use-workouts"
import { useWorkoutSession } from "@/hooks/use-workout-session"
import { formatDateLong } from "@/lib/date-utils"
import { formatWorkoutError } from "@/lib/format-workout-error"
import {
  WorkoutAuthBanner,
  WorkoutAuthPrompt,
  WorkoutLoadingScreen,
} from "@/components/workout/workout-page-state"

function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, isUnauthenticated, hasUserId, isSessionLoading } =
    useWorkoutSession()
  const showAuthBanner =
    searchParams.get("authRequired") === "1" && (!isAuthenticated || !hasUserId)

  /** Nach Login: `authRequired` aus der URL entfernen (kommt von Middleware-Redirect). */
  useEffect(() => {
    if (isSessionLoading) return
    if (searchParams.get("authRequired") === "1" && isAuthenticated && hasUserId) {
      router.replace("/")
    }
  }, [isSessionLoading, isAuthenticated, hasUserId, searchParams, router])

  const {
    activeWorkout,
    isLoading: activeLoading,
    isError: activeError,
    error: activeErr,
    mutate: mutateActive,
  } = useActiveWorkout()

  const {
    recentWorkouts,
    isLoading: recentLoading,
    isError: recentError,
    error: recentErr,
    mutate: mutateRecent,
  } = useRecentWorkouts(3)

  const today = new Date()
  const canStartWorkout = isAuthenticated && hasUserId && !activeLoading

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {showAuthBanner && <WorkoutAuthBanner />}

      <header className="p-6">
        <div className="text-gray-400 text-sm mb-1">{formatDateLong(today).split(",")[0]}</div>
        <h1 className="text-2xl font-bold text-white">{formatDateLong(today).split(",")[1]}</h1>
      </header>

      <div className="px-6 mb-8">
        <WeekCalendar />
      </div>

      <div className="px-6 mb-8">
        {isUnauthenticated || (isAuthenticated && !hasUserId && !isSessionLoading) ? (
          <WorkoutAuthPrompt />
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6 whitespace-pre-line">
              {activeWorkout ? "Training fortsetzen" : "Neues Training\nstarten"}
            </h2>

            {activeError ? (
              <p className="text-red-400 text-sm mb-4">{formatWorkoutError(activeErr)}</p>
            ) : null}

            {activeLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
              </div>
            ) : canStartWorkout ? (
              <Link
                href={activeWorkout ? `/workout/${activeWorkout.id}` : "/workout/new"}
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full transition-colors ${
                  activeWorkout ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                }`}
                aria-label={activeWorkout ? "Training fortsetzen" : "Neues Training starten"}
              >
                {activeWorkout ? (
                  <Play className="w-10 h-10 text-white fill-white" />
                ) : (
                  <Plus className="w-10 h-10 text-white" />
                )}
              </Link>
            ) : null}

            {activeError && (
              <button
                type="button"
                onClick={() => mutateActive()}
                className="mt-3 text-sm text-blue-500 hover:text-blue-400"
              >
                Erneut laden
              </button>
            )}
          </div>
        )}
      </div>

      <div className="px-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Letzten 3 Trainingseinheiten</h3>

        {isUnauthenticated ? (
          <p className="text-gray-400 text-center py-8 text-sm">
            Nach dem Login siehst du hier deine letzten Trainings.
          </p>
        ) : recentLoading ? (
          <div className="text-gray-400 text-center py-8">Laden…</div>
        ) : recentError ? (
          <div className="text-center py-8">
            <p className="text-red-400 text-sm mb-2">{formatWorkoutError(recentErr)}</p>
            <button
              type="button"
              onClick={() => mutateRecent()}
              className="text-blue-500 hover:text-blue-400 text-sm"
            >
              Erneut versuchen
            </button>
          </div>
        ) : recentWorkouts && recentWorkouts.length > 0 ? (
          <div className="flex justify-center">
            <div className="overflow-x-auto pb-4 max-w-full">
              <div className="flex gap-4 justify-center">
                {recentWorkouts.map((workout) => (
                  <div key={workout.id} className="w-80 flex-shrink-0">
                    <WorkoutCard workout={workout} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8">Noch keine Trainingseinheiten</div>
        )}
      </div>

      <NavigationBar />
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<WorkoutLoadingScreen message="Startseite wird geladen…" />}>
      <HomeContent />
    </Suspense>
  )
}
