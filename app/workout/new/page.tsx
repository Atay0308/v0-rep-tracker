"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createWorkout } from "@/lib/workout-api"

export default function NewWorkoutPage() {
  const router = useRouter()
  const hasCreated = useRef(false)

  useEffect(() => {
    if (hasCreated.current) {
      return
    }

    const initWorkout = async () => {
      try {
        hasCreated.current = true
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

        if (!workout.id) {
          throw new Error("Workout ID is missing")
        }

        router.replace(`/workout/${workout.id}`)
      } catch (error) {
        console.error("Failed to create workout:", error)
        hasCreated.current = false
        alert("Fehler beim Erstellen des Trainings. Bitte versuchen Sie es erneut.")
        router.replace("/")
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
