/**
 * ExerciseCard Component
 *
 * Displays all sets for a single exercise within a workout.
 *
 * Features:
 * - Exercise name header with delete option
 * - Column labels for set data (weight, reps, notes)
 * - List of all sets with edit/delete capabilities
 * - Add new set button
 * - 3-dot menu for exercise-level actions (delete)
 *
 * All set operations are delegated to parent component via callbacks.
 */

"use client"

import { useState } from "react"
import { MoreVertical, Trash2 } from "lucide-react"
import { SetRow } from "./set-row"
import type { WorkoutExerciseUI, ExerciseSetUI } from "@/types/workout"

interface ExerciseCardProps {
  /** The exercise data including all sets */
  exercise: WorkoutExerciseUI
  /**
   * Callback when a set is updated.
   * `setId` = `set.id` aus `exercise.sets` (wird in der `.map`-Schleife unten übergeben).
   */
  onUpdateSet: (setId: string, set: ExerciseSetUI) => void
  /** Callback when a set is deleted */
  onDeleteSet: (setId: string) => void
  /** Callback when adding a new set */
  onAddSet: () => void
  /** Callback when deleting the entire exercise */
  onDeleteExercise: () => void
}

export function ExerciseCard({ exercise, onUpdateSet, onDeleteSet, onAddSet, onDeleteExercise }: ExerciseCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  /**
   * Handles exercise deletion with confirmation
   */
  const handleDelete = () => {
    if (confirm(`Möchtest du "${exercise.exerciseName}" wirklich löschen?`)) {
      onDeleteExercise()
    }
    setShowMenu(false)
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-4 mb-4">
      {/* Exercise header with name and delete menu */}
      <div className="flex items-center justify-between mb-4 relative">
        <h3 className="text-white font-medium">{exercise.exerciseName}</h3>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="text-gray-400 hover:text-white">
            <MoreVertical className="w-5 h-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-gray-800 rounded-lg shadow-lg z-10 min-w-[150px]">
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-gray-700 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
                Löschen
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Column labels for set data */}
      <div className="flex items-center gap-2 mb-2 text-xs text-gray-400">
        <div className="w-8"></div>
        <div className="w-16 text-center">Gewicht</div>
        <div className="w-16 text-center">Wdh.</div>
        <div className="flex-1 text-center">Notizen</div>
        <div className="w-24"></div>
        <div className="w-8"></div>
      </div>

      {/* List of all sets */}
      {exercise.sets.map((set) => (
        <SetRow
          key={set.id}
          set={set}
          onUpdate={(updatedSet) => onUpdateSet(set.id, updatedSet)}
          onDelete={() => onDeleteSet(set.id)}
        />
      ))}

      {/* Add set button */}
      <button onClick={onAddSet} className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-white transition-colors">
        Satz hinzufügen
      </button>
    </div>
  )
}
