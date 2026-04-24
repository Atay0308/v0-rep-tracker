"use client"

import { use, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Search, Plus, MoreVertical, X } from "lucide-react"
import { getExercisesByMuscleGroup, addCustomExercise } from "@/lib/exercises-data"
import { updateWorkout, getWorkout } from "@/lib/workout-api"
import type { MuscleGroup, WorkoutExercise } from "@/types/workout"

export default function SelectExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { id: workoutId } = use(params)
  const muscleGroup = searchParams.get("muscle") as MuscleGroup

  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newExerciseName, setNewExerciseName] = useState("")
  const [exercises, setExercises] = useState(muscleGroup ? getExercisesByMuscleGroup(muscleGroup) : [])

  const filteredExercises = exercises.filter((ex) => ex.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleExerciseSelect = async (exerciseName: string) => {
    try {
      const workout = await getWorkout(workoutId)

      const newExercise: WorkoutExercise = {
        id: `ex-${Date.now()}`,
        workoutId,
        exerciseName,
        muscleGroup,
        order: workout.exercises.length + 1,
        sets: [
          {
            id: `set-${Date.now()}`,
            setNumber: 1,
            weight: 0,
            reps: 0,
            breakTime: 0,
            notes: "",
          },
        ],
      }

      await updateWorkout(workoutId, {
        exercises: [...workout.exercises, newExercise],
      })

      router.push(`/workout/${workoutId}`)
    } catch (error) {
      console.error("[v0] Failed to add exercise:", error)
    }
  }

  const handleAddCustomExercise = () => {
    if (!newExerciseName.trim() || !muscleGroup) return

    const newExercise = addCustomExercise(muscleGroup, newExerciseName.trim())
    setExercises([...exercises, newExercise])
    setNewExerciseName("")
    setShowAddDialog(false)
  }

  const handleDeleteExercise = (exerciseId: string) => {
    if (confirm("Möchtest du diese Übung wirklich löschen?")) {
      setExercises(exercises.filter((ex) => ex.id !== exerciseId))
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <button onClick={() => router.back()} className="btn btn-ghost btn-icon">
          <ArrowLeft style={{ width: '1.5rem', height: '1.5rem' }} />
        </button>
        <h1 className="page-title">({muscleGroup})</h1>
        <div className="flex gap-sm">
          <button onClick={() => setShowAddDialog(true)} className="btn btn-ghost btn-icon">
            <Plus style={{ width: '1.5rem', height: '1.5rem' }} />
          </button>
          <button onClick={() => setShowSearch(!showSearch)} className="btn btn-ghost btn-icon">
            <Search style={{ width: '1.5rem', height: '1.5rem' }} />
          </button>
        </div>
      </header>

      {showSearch && (
        <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Übung suchen..."
            className="form-input"
            style={{ borderRadius: 'var(--radius-full)' }}
            autoFocus
          />
        </div>
      )}

      <div className="page-content">
        <div className="exercise-list">
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className="exercise-item">
              <button
                onClick={() => handleExerciseSelect(exercise.name)}
                style={{
                  flex: 1,
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                {exercise.name}
              </button>
              <button 
                onClick={() => handleDeleteExercise(exercise.id)} 
                className="btn btn-ghost btn-icon"
                style={{ width: '2rem', height: '2rem' }}
              >
                <MoreVertical style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-muted)' }} />
              </button>
            </div>
          ))}

          {filteredExercises.length === 0 && (
            <div className="text-center text-muted" style={{ padding: 'var(--spacing-xl) 0' }}>
              {searchQuery ? "Keine Übungen gefunden" : "Keine Übungen verfügbar"}
            </div>
          )}
        </div>
      </div>

      {showAddDialog && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: 'var(--spacing-md)',
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '28rem' }}>
            <div className="flex-between mb-md">
              <h2 className="text-xl font-medium">Neue Übung hinzufügen</h2>
              <button onClick={() => setShowAddDialog(false)} className="btn btn-ghost btn-icon">
                <X style={{ width: '1.5rem', height: '1.5rem' }} />
              </button>
            </div>
            <input
              type="text"
              value={newExerciseName}
              onChange={(e) => setNewExerciseName(e.target.value)}
              placeholder="Übungsname"
              className="form-input mb-md"
              style={{ borderRadius: 'var(--radius-full)' }}
              autoFocus
            />
            <div className="flex gap-sm">
              <button
                onClick={() => setShowAddDialog(false)}
                className="btn btn-secondary btn-full"
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                Abbrechen
              </button>
              <button
                onClick={handleAddCustomExercise}
                disabled={!newExerciseName.trim()}
                className="btn btn-primary btn-full"
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
