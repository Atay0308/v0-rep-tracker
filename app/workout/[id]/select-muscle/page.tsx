"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search } from "lucide-react"
import { MUSCLE_GROUPS } from "@/lib/exercises-data"
import type { MuscleGroup } from "@/types/workout"

export default function SelectMusclePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id: workoutId } = use(params)

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
    <div className="page">
      <header className="page-header">
        <button onClick={() => router.back()} className="btn btn-ghost btn-icon">
          <ArrowLeft style={{ width: '1.5rem', height: '1.5rem' }} />
        </button>
        <h1 className="page-title">Muskelbereich auswählen</h1>
        <button className="btn btn-ghost btn-icon">
          <Search style={{ width: '1.5rem', height: '1.5rem' }} />
        </button>
      </header>

      <div className="muscle-grid" style={{ padding: 'var(--spacing-md)' }}>
        {MUSCLE_GROUPS.map((muscle) => (
          <button
            key={muscle}
            onClick={() => handleMuscleSelect(muscle)}
            className="muscle-card"
            style={{
              position: 'relative',
              aspectRatio: '1',
              padding: 0,
              overflow: 'hidden',
            }}
          >
            <img 
              src={muscleImages[muscle] || "/placeholder.svg"} 
              alt={muscle} 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4), transparent)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: 'var(--spacing-md)',
            }}>
              <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>{muscle}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
