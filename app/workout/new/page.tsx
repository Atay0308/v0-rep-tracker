"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createWorkout, getActiveWorkout } from "@/lib/workout-api"

export default function NewWorkoutPage() {
  const router = useRouter()
  const hasCreated = useRef(false)

  useEffect(() => {
    if (hasCreated.current) return

    const initWorkout = async () => {
      try {
        hasCreated.current = true

        const existingActive = await getActiveWorkout()
        if (existingActive) {
          router.replace(`/workout/${existingActive.id}`)
          return
        }

        const now = new Date()
        const workout = await createWorkout({
          name: "",
          date: now.toISOString().split("T")[0],
          endDate: undefined,
          startTime: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
          endTime: undefined,
          notes: "",
          isActive: true,
          exercises: [],
        })

        if (!workout.id) {
          throw new Error("Workout ID is missing")
        }

        router.replace(`/workout/${workout.id}`)
      } catch (error) {
        console.error("[v0] Failed to create workout:", error)
        hasCreated.current = false
        alert("Fehler beim Erstellen des Trainings.")
        router.replace("/")
      }
    }

    initWorkout()
  }, [router])

  return (
    <div className="page flex-center" style={{ minHeight: '100vh' }}>
      <div className="text-center">
        <div className="loading-spinner" style={{ margin: '0 auto var(--spacing-md)' }}></div>
        <p className="text-muted">Training wird erstellt...</p>
      </div>
    </div>
  )
}
