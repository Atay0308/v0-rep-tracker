/**
 * Muscle group selection page
 */

"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Search } from "lucide-react"
import { MUSCLE_GROUPS } from "@/lib/exercises-data"
import type { MuscleGroup } from "@/types/workout"

export default function SelectMusclePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const workoutId = params.id

  const handleMuscleSelect = (muscleGroup: MuscleGroup) => {
    router.push(`/workout/${workoutId}/select-exercise?muscle=${muscleGroup}`)
  }

  const muscleImages: Record<MuscleGroup, string> = {
    Bauch: "/fitness-abs-core-muscles.jpg",
    Beine: "/fitness-legs-quadriceps-muscles.jpg",
    Bizeps: "/fitness-biceps-arm-muscles.jpg",
    Brust: "/fitness-chest-pectorals-muscles.jpg",
    Nacken: "/fitness-neck-trapezius-muscles.jpg",
    Rücken: "/fitness-back-lats-muscles.jpg",
    Schultern: "/fitness-shoulders-deltoids-muscles.jpg",
    Trizeps: "/fitness-triceps-arm-muscles.jpg",
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <button onClick={() => router.back()} className="text-blue-500 hover:text-blue-400">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">Muskelbereich auswählen</h1>
        <button className="text-blue-500 hover:text-blue-400">
          <Search className="w-6 h-6" />
        </button>
      </header>

      {/* Muscle groups grid */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {MUSCLE_GROUPS.map((muscle) => (
          <button
            key={muscle}
            onClick={() => handleMuscleSelect(muscle)}
            className="relative aspect-square rounded-2xl overflow-hidden group"
          >
            <img src={muscleImages[muscle] || "/placeholder.svg"} alt={muscle} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-4">
              <span className="text-white text-lg font-semibold">{muscle}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
