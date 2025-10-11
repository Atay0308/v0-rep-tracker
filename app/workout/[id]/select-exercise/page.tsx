/**
 * Exercise selection page
 */

"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, Search, Plus, MoreVertical, X } from "lucide-react"
import { getExercisesByMuscleGroup, addCustomExercise } from "@/lib/exercises-data"
import { updateWorkout, getWorkout } from "@/lib/workout-api"
import type { MuscleGroup, WorkoutExercise } from "@/types/workout"

export default function SelectExercisePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const workoutId = params.id
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
            breakTime: 90,
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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <button onClick={() => router.back()} className="text-blue-500 hover:text-blue-400">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">({muscleGroup})</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowAddDialog(true)} className="text-blue-500 hover:text-blue-400">
            <Plus className="w-6 h-6" />
          </button>
          <button onClick={() => setShowSearch(!showSearch)} className="text-blue-500 hover:text-blue-400">
            <Search className="w-6 h-6" />
          </button>
        </div>
      </header>

      {showSearch && (
        <div className="p-4 border-b border-gray-800">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Übung suchen..."
            className="w-full px-4 py-2 bg-gray-900 text-white rounded-full"
            autoFocus
          />
        </div>
      )}

      {/* Exercise list */}
      <div className="p-4">
        {filteredExercises.map((exercise) => (
          <div key={exercise.id} className="flex items-center justify-between p-4 mb-2 bg-gray-900 rounded-lg">
            <button
              onClick={() => handleExerciseSelect(exercise.name)}
              className="flex-1 text-left text-white hover:text-blue-400 transition-colors"
            >
              {exercise.name}
            </button>
            <button onClick={() => handleDeleteExercise(exercise.id)} className="text-gray-400 hover:text-red-500 ml-2">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        ))}

        {filteredExercises.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            {searchQuery ? "Keine Übungen gefunden" : "Keine Übungen verfügbar"}
          </div>
        )}
      </div>

      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Neue Übung hinzufügen</h2>
              <button onClick={() => setShowAddDialog(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <input
              type="text"
              value={newExerciseName}
              onChange={(e) => setNewExerciseName(e.target.value)}
              placeholder="Übungsname"
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-full mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddDialog(false)}
                className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full"
              >
                Abbrechen
              </button>
              <button
                onClick={handleAddCustomExercise}
                disabled={!newExerciseName.trim()}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Background image */}
      <div className="fixed bottom-0 left-0 right-0 h-1/2 -z-10">
        <img
          src="/images/design-mode/%C3%9Cbung%20ausw%C3%A4hlen.png"
          alt="Exercise"
          className="w-full h-full object-cover opacity-30"
        />
      </div>
    </div>
  )
}
