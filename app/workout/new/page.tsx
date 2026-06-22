/**
 * @file app/workout/new/page.tsx
 * @description Erstellt ein neues Training und leitet zur Detailseite weiter.
 *
 * Phase 3: Klare Fehleranzeige statt generischem Alert; Ladezustand über WorkoutLoadingScreen.
 */

"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { createWorkout } from "@/app/actions/workout-actions"
import { formatWorkoutError } from "@/lib/format-workout-error"
import { WorkoutLoadingScreen, WorkoutErrorPanel } from "@/components/workout/workout-page-state"
/**
 * description: Displays a loading screen while creating a new workout, then redirects to the workout detail page.
 */
export default function NewWorkoutPage() {
  const router = useRouter()
  const hasCreated = useRef(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (hasCreated.current) return

    const initWorkout = async () => {
      try {
        hasCreated.current = true
        const now = new Date()
        const workout = await createWorkout({
          name: "",
          startDate: now.toISOString().split("T")[0],
          startTime: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
          endDate: undefined,
          endTime: undefined,
          notes: "",
          isActive: true,
          exercises: [],
        })

        if (!workout.id) {
          throw new Error("Workout-ID fehlt nach dem Erstellen")
        }

        router.replace(`/workout/${workout.id}`)
      } catch (err) {
        console.error("[workout] create failed:", err)
        hasCreated.current = false
        setError(formatWorkoutError(err))
      }
    }

    initWorkout()
  }, [router])

  if (error) {
    return (
      <WorkoutErrorPanel
        message={error}
        onRetry={() => {
          setError(null)
          hasCreated.current = false
          window.location.reload()
        }}
      />
    )
  }

  return <WorkoutLoadingScreen message="Training wird erstellt…" />
}
