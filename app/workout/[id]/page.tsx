"use client"

import { use, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MoreVertical, Trash2 } from "lucide-react"
import useSWR from "swr"
import { useSWRConfig } from "swr"
import { ExerciseCard } from "@/components/exercise-card"
import { DropdownMenu, DropdownMenuItem } from "@/components/dropdown-menu"
import { getWorkout, updateWorkout, deleteWorkout } from "@/lib/workout-api"
import type { Workout, WorkoutSet } from "@/types/workout"

export default function WorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id: workoutId } = use(params)
  const { mutate } = useSWRConfig()

  const { data: workout, mutate: workoutMutate } = useSWR<Workout>(`workout-${workoutId}`, () => getWorkout(workoutId))

  const [localWorkout, setLocalWorkout] = useState<Workout | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (workout && !hasChanges) {
      setLocalWorkout(workout)
    }
  }, [workout, hasChanges])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasChanges])

  const handleUpdateSet = useCallback((exerciseId: string, setId: string, updatedSet: WorkoutSet) => {
    setLocalWorkout((prev) => {
      if (!prev) return prev

      const updatedExercises = prev.exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return {
            ...ex,
            sets: ex.sets.map((s) => (s.id === setId ? updatedSet : s)),
          }
        }
        return ex
      })

      return { ...prev, exercises: updatedExercises }
    })
    setHasChanges(true)
  }, [])

  const handleDeleteSet = useCallback((exerciseId: string, setId: string) => {
    setLocalWorkout((prev) => {
      if (!prev) return prev

      const updatedExercises = prev.exercises.map((ex) => {
        if (ex.id === exerciseId) {
          const newSets = ex.sets.filter((s) => s.id !== setId)
          return {
            ...ex,
            sets: newSets.map((s, idx) => ({ ...s, setNumber: idx + 1 })),
          }
        }
        return ex
      })

      return { ...prev, exercises: updatedExercises }
    })
    setHasChanges(true)
  }, [])

  const handleAddSet = useCallback((exerciseId: string) => {
    setLocalWorkout((prev) => {
      if (!prev) return prev

      const updatedExercises = prev.exercises.map((ex) => {
        if (ex.id === exerciseId) {
          const newSet: WorkoutSet = {
            id: `set-${Date.now()}`,
            setNumber: ex.sets.length + 1,
            weight: 0,
            reps: 0,
            breakTime: 0,
            notes: "",
          }
          return {
            ...ex,
            sets: [...ex.sets, newSet],
          }
        }
        return ex
      })

      return { ...prev, exercises: updatedExercises }
    })
    setHasChanges(true)
  }, [])

  const handleDeleteExercise = useCallback((exerciseId: string) => {
    setLocalWorkout((prev) => {
      if (!prev) return prev

      const updatedExercises = prev.exercises.filter((ex) => ex.id !== exerciseId)
      return { ...prev, exercises: updatedExercises }
    })
    setHasChanges(true)
  }, [])

  const handleAddExercise = async () => {
    if (!localWorkout) return

    if (hasChanges) {
      try {
        await updateWorkout(workoutId, localWorkout)
        setHasChanges(false)
        await workoutMutate()
      } catch (error) {
        console.error("[v0] Failed to save before adding exercise:", error)
      }
    }

    router.push(`/workout/${workoutId}/select-muscle`)
  }

  const handleSaveWorkout = async () => {
    if (!localWorkout || !hasChanges) return

    try {
      await updateWorkout(workoutId, localWorkout)
      setHasChanges(false)
      await workoutMutate()
      await mutate("active-workout")
      await mutate("recent-workouts-3")
      await mutate("workouts")
      alert("Training gespeichert!")
    } catch (error) {
      console.error("[v0] Failed to save workout:", error)
      alert("Fehler beim Speichern")
    }
  }

  const handleSaveAndFinish = async () => {
    if (!localWorkout) return

    try {
      const now = new Date()
      const endTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      const endDate = now.toISOString().split("T")[0]

      await updateWorkout(workoutId, {
        ...localWorkout,
        endTime,
        endDate,
        isActive: false,
      })

      setHasChanges(false)
      await Promise.all([mutate("active-workout"), mutate("recent-workouts-3"), mutate("workouts"), workoutMutate()])

      alert("Training gespeichert!")
      router.push("/")
    } catch (error) {
      console.error("[v0] Failed to save workout:", error)
      alert("Fehler beim Speichern")
    }
  }

  const handleDeleteWorkout = async () => {
    if (!confirm("Möchtest du dieses Training wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
      return
    }

    try {
      await deleteWorkout(workoutId)
      await Promise.all([mutate("active-workout"), mutate("recent-workouts-3"), mutate("workouts")])
      router.replace("/")
    } catch (error) {
      console.error("[v0] Failed to delete workout:", error)
      alert("Fehler beim Löschen des Trainings")
    }
  }

  const handleBack = () => {
    if (hasChanges) {
      if (confirm("Du hast ungespeicherte Änderungen. Möchtest du wirklich zurück?")) {
        router.push("/")
      }
    } else {
      router.push("/")
    }
  }

  if (!localWorkout) {
    return (
      <div className="page flex-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="loading-spinner" style={{ margin: '0 auto var(--spacing-md)' }}></div>
          <p className="text-muted">Laden...</p>
        </div>
      </div>
    )
  }

  const inputStyle = {
    padding: 'var(--spacing-sm) var(--spacing-md)',
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    borderRadius: 'var(--radius-full)',
    border: 'none',
    fontSize: '1rem',
  }

  return (
    <div className="page">
      <header className="page-header">
        <button onClick={handleBack} className="btn btn-ghost btn-icon">
          <ArrowLeft style={{ width: '1.5rem', height: '1.5rem' }} />
        </button>
        <h1 className="page-title">{localWorkout.date.split("-").reverse().join(".")}</h1>
        <DropdownMenu
          trigger={
            <button className="btn btn-ghost btn-icon">
              <MoreVertical style={{ width: '1.5rem', height: '1.5rem' }} />
            </button>
          }
        >
          <DropdownMenuItem onClick={handleDeleteWorkout} variant="danger">
            <Trash2 style={{ width: '1rem', height: '1rem' }} />
            Workout löschen
          </DropdownMenuItem>
        </DropdownMenu>
      </header>

      <div className="page-content">
        <div className="form-group mb-md">
          <label className="form-label">Name</label>
          <input
            type="text"
            value={localWorkout.name}
            onChange={(e) => {
              setLocalWorkout((prev) => (prev ? { ...prev, name: e.target.value } : prev))
              setHasChanges(true)
            }}
            style={{ ...inputStyle, width: '100%' }}
            placeholder="Workout Name"
          />
        </div>

        <div className="flex gap-md mb-md">
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Datum</label>
            <input
              type="text"
              value={localWorkout.date.split("-").reverse().join(". ")}
              readOnly
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Startzeit</label>
            <input
              type="text"
              value={localWorkout.startTime}
              readOnly
              style={{ ...inputStyle, width: '6rem', textAlign: 'center' }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Endzeit</label>
            <input
              type="time"
              value={localWorkout.endTime || ""}
              onChange={(e) => {
                setLocalWorkout((prev) => (prev ? { ...prev, endTime: e.target.value } : prev))
                setHasChanges(true)
              }}
              style={{ ...inputStyle, width: '6rem', textAlign: 'center' }}
            />
          </div>
        </div>

        <div className="form-group mb-lg">
          <label className="form-label">Notizen</label>
          <textarea
            value={localWorkout.notes || ""}
            onChange={(e) => {
              setLocalWorkout((prev) => (prev ? { ...prev, notes: e.target.value } : prev))
              setHasChanges(true)
            }}
            style={{
              ...inputStyle,
              width: '100%',
              minHeight: '5rem',
              borderRadius: 'var(--radius-xl)',
              resize: 'vertical',
            }}
            placeholder="Notizen zum Training..."
          />
        </div>

        {localWorkout.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onUpdateSet={(setId, set) => handleUpdateSet(exercise.id, setId, set)}
            onDeleteSet={(setId) => handleDeleteSet(exercise.id, setId)}
            onAddSet={() => handleAddSet(exercise.id)}
            onDeleteExercise={() => handleDeleteExercise(exercise.id)}
          />
        ))}

        <button
          onClick={handleAddExercise}
          className="btn btn-primary btn-full btn-lg"
          style={{ borderRadius: 'var(--radius-full)', marginTop: 'var(--spacing-lg)' }}
        >
          + Übung hinzufügen
        </button>

        {localWorkout.isActive ? (
          <button
            onClick={handleSaveAndFinish}
            className="btn btn-success btn-full btn-lg"
            style={{ borderRadius: 'var(--radius-full)', marginTop: 'var(--spacing-md)' }}
          >
            Training speichern
          </button>
        ) : (
          hasChanges && (
            <button
              onClick={handleSaveWorkout}
              className="btn btn-full btn-lg"
              style={{ 
                borderRadius: 'var(--radius-full)', 
                marginTop: 'var(--spacing-md)',
                backgroundColor: 'var(--color-warning)',
                color: 'white',
              }}
            >
              Änderungen speichern
            </button>
          )
        )}
      </div>
    </div>
  )
}
