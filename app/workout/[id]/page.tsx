"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, MoreVertical } from "lucide-react"
import useSWR from "swr"
import { ExerciseCard } from "@/components/exercise-card"
import { getWorkout, updateWorkout } from "@/lib/workout-api"
import type { Workout, WorkoutSet } from "@/types/workout"
import { use } from "react"

export default function WorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const {id : workoutId} = use(params);

  const { data: workout, mutate } = useSWR<Workout>(`workout-${workoutId}`, () => getWorkout(workoutId))

  const [localWorkout, setLocalWorkout] = useState<Workout | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (workout) {
      setLocalWorkout(workout)
    }
  }, [workout])

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

  const handleAddExercise = () => {
    router.push(`/workout/${workoutId}/select-muscle`)
  }

  const handleSaveWorkout = async () => {
    if (!localWorkout || !hasChanges) return

    try {
      await updateWorkout(workoutId, localWorkout)
      setHasChanges(false)
      mutate()
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

      await updateWorkout(workoutId, {
        ...localWorkout,
        endTime,
        isActive: false,
      })

      setHasChanges(false)
      router.push("/")
    } catch (error) {
      console.error("[v0] Failed to save workout:", error)
      alert("Fehler beim Speichern")
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Laden...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <button onClick={handleBack} className="text-blue-500 hover:text-blue-400">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">{localWorkout.date.split("-").reverse().join(".")}</h1>
        <div className="flex gap-2">
          <button className="text-blue-500 hover:text-blue-400">
            <Clock className="w-6 h-6" />
          </button>
          <button className="text-blue-500 hover:text-blue-400">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <div>
          <label className="text-gray-400 text-sm mb-1 block">Name</label>
          <input
            type="text"
            value={localWorkout.name}
            onChange={(e) => {
              setLocalWorkout((prev) => (prev ? { ...prev, name: e.target.value } : prev))
              setHasChanges(true)
            }}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-full"
            placeholder="Workout Name"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-gray-400 text-sm mb-1 block">Datum</label>
            <input
              type="text"
              value={localWorkout.date.split("-").reverse().join(". ")}
              readOnly
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-full"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Startzeit</label>
            <input
              type="text"
              value={localWorkout.startTime}
              readOnly
              className="w-24 px-4 py-2 bg-blue-600 text-white rounded-full text-center"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Endzeit</label>
            <input
              type="text"
              value={localWorkout.endTime || ""}
              readOnly
              placeholder="--:--"
              className="w-24 px-4 py-2 bg-blue-600 text-white rounded-full text-center"
            />
          </div>
        </div>

        <div>
          <label className="text-gray-400 text-sm mb-1 block">Notizen</label>
          <textarea
            value={localWorkout.notes || ""}
            onChange={(e) => {
              setLocalWorkout((prev) => (prev ? { ...prev, notes: e.target.value } : prev))
              setHasChanges(true)
            }}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-2xl min-h-[80px]"
            placeholder="Notizen zum Training..."
          />
        </div>
      </div>

      <div className="px-4">
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
      </div>

      <div className="px-4 mt-6">
        <button
          onClick={handleAddExercise}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors"
        >
          + Übung hinzufügen
        </button>
      </div>

      {localWorkout.isActive ? (
        <div className="px-4 mt-4">
          <button
            onClick={handleSaveAndFinish}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors"
          >
            Training speichern
          </button>
        </div>
      ) : (
        hasChanges && (
          <div className="px-4 mt-4">
            <button
              onClick={handleSaveWorkout}
              className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-full font-medium transition-colors"
            >
              Änderungen speichern
            </button>
          </div>
        )
      )}
    </div>
  )
}
