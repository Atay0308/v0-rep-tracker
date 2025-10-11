/**
 * New workout page - creates a new workout and redirects to muscle group selection
 */

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createWorkout } from "@/lib/workout-api"

export default function NewWorkoutPage() {
  const router = useRouter()

  useEffect(() => {
    const initWorkout = async () => {
      try {
        console.log("[v0] Creating new workout...")
        const now = new Date()
        const workout = await createWorkout({
          name: "",
          date: now.toISOString().split("T")[0],
          startTime: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
          endTime: undefined,
          notes: "",
          isActive: true,
          exercises: [],
        })

        console.log("[v0] Workout created with ID:", workout.id)
        console.log("[v0] Navigating to select-muscle page...")
        router.push(`/workout/${workout.id}/select-muscle`)
      } catch (error) {
        console.error("[v0] Failed to create workout:", error)
        alert("Fehler beim Erstellen des Trainings. Bitte versuchen Sie es erneut.")
        router.push("/")
      }
    }

    initWorkout()
  }, [router])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-400">Training wird erstellt...</p>
      </div>
    </div>
  )
}
