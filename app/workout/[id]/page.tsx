"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MoreVertical, Trash2 } from "lucide-react"
import useSWR from "swr"
import { useSWRConfig } from "swr"
import { ExerciseCard } from "@/components/exercise-card"
import { getWorkout, updateWorkout, deleteWorkout } from "@/app/actions/workout-actions"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { WorkoutUI, ExerciseSetUI } from "@/types/workout"
import { use } from "react"
import { formatWorkoutError } from "@/lib/format-workout-error"
import {
  WorkoutLoadingScreen,
  WorkoutErrorPanel,
  WorkoutNotFoundPanel,
} from "@/components/workout/workout-page-state"

/** Behält lokale Satz-Eingaben, übernimmt neue Übungen vom Server (nach select-exercise). */
function mergeExercisesFromServer(local: WorkoutUI, server: WorkoutUI): WorkoutUI {
  const localById = new Map(local.exercises.map((e) => [e.id, e]))
  const exercises = server.exercises.map((serverEx) => {
    const localEx = localById.get(serverEx.id)
    return localEx ? { ...serverEx, sets: localEx.sets } : serverEx
  })
  return { ...server, exercises }
}

/**
 * Displays the workout details page, allowing users to view and edit their workout. 
 */
export default function WorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const {id : workoutId} = use(params);
  const { mutate } = useSWRConfig()

  const {
    data: workout,
    error: workoutError,
    isLoading: workoutLoading,
    mutate: workoutMutate,
  } = useSWR<WorkoutUI | null>(`workout-${workoutId}`, () => getWorkout(workoutId), {
    revalidateOnMount: true,
  })

  const [localWorkout, setLocalWorkout] = useState<WorkoutUI | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    void workoutMutate()
  }, [workoutId, workoutMutate])

  useEffect(() => {
    if (!workout) return
    if (!hasChanges) {
      setLocalWorkout(workout)
      return
    }
    // Nach „Übung hinzufügen“: Server hat mehr Übungen, lokale Sätze behalten
    if (
      localWorkout &&
      workout.exercises.length > localWorkout.exercises.length
    ) {
      setLocalWorkout(mergeExercisesFromServer(localWorkout, workout))
    }
  }, [workout, hasChanges, localWorkout])

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

  const handleUpdateSet = useCallback((exerciseId: string, setId: string, updatedSet: ExerciseSetUI) => {
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
          const newSet: ExerciseSetUI = {
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

    // Save current state before navigating
    if (hasChanges) {
      try {
        const fresh = await getWorkout(workoutId)
        if (!fresh) return
        const toSave = mergeExercisesFromServer(localWorkout, fresh)
        await updateWorkout(workoutId, toSave)
        setHasChanges(false)
        await workoutMutate()
      } catch (error) {
        console.error("[v0] Failed to save before adding exercise:", error)
      }
    }

    router.push(`/workout/${workoutId}/select-muscle`)
  }

  const handleSaveWorkout = async () => {
    if (!localWorkout || !hasChanges) {
      return
    }

    try {

      const saved = await updateWorkout(workoutId, localWorkout)

      setHasChanges(false)
      await workoutMutate()
      await mutate("active-workout")
      await mutate("recent-workouts-3")
      await mutate("workouts")

      alert("Training gespeichert!")
    } catch (error) {
      alert(formatWorkoutError(error))
    }
  }

  const handleSaveAndFinish = async () => {
    if (!localWorkout) {
      return
    }

    try {
      const now = new Date()
      const endTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      const endDate = now.toISOString().split("T")[0]

      const saved = await updateWorkout(workoutId, {
        ...localWorkout,
        endTime,
        endDate,
        isActive: false,
      })

      setHasChanges(false)

      await Promise.all([mutate("active-workout"), mutate("recent-workouts-3"), mutate("workouts"), workoutMutate()])

      router.push("/")
    } catch (error) {
      alert(formatWorkoutError(error))
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
      console.error("Failed to delete workout:", error)
      alert(formatWorkoutError(error))
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

  if (workoutLoading) {
    return <WorkoutLoadingScreen message="Training wird geladen…" />
  }

  if (workoutError) {
    return (
      <WorkoutErrorPanel
        message={formatWorkoutError(workoutError)}
        onRetry={() => workoutMutate()}
      />
    )
  }

  if (workout === null) {
    return <WorkoutNotFoundPanel />
  }

  if (!localWorkout) {
    return <WorkoutLoadingScreen />
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <header className="flex items-center justify-between p-4 border-b border-border">
        <button onClick={handleBack} className="text-blue-500 hover:text-blue-400" aria-label="Zurück">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">{localWorkout.startDate.split("-").reverse().join(".")}</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-blue-500 hover:text-blue-400" aria-label="Workout Optionen">
                <MoreVertical className="w-6 h-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleDeleteWorkout}
                className="text-red-500 focus:text-red-500 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Workout löschen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              value={localWorkout.startDate.split("-").reverse().join(". ")}
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
              type="time"
              value={localWorkout.endTime || ""}
              onChange={(e) => {
                setLocalWorkout((prev) => (prev ? { ...prev, endTime: e.target.value } : prev))
                setHasChanges(true)
              }}
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
