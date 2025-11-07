/**
 * SetRow Component
 *
 * Displays a single set within an exercise with editable fields.
 *
 * Features:
 * - Set number badge
 * - Weight input (kg) with decimal support
 * - Reps input (whole numbers)
 * - Notes field for set-specific comments
 * - Timer button for tracking rest time
 * - Delete option via 3-dot menu
 *
 * All changes are immediately propagated to parent via onUpdate callback.
 */

"use client"

import { useState } from "react"
import { MoreVertical, Trash2 } from "lucide-react"
import { TimerButton } from "./timer-button"
import type { WorkoutSet } from "@/types/workout"

interface SetRowProps {
  /** The set data to display and edit */
  set: WorkoutSet
  /** Callback when set data changes */
  onUpdate: (set: WorkoutSet) => void
  /** Callback when set should be deleted */
  onDelete: () => void
}

export function SetRow({ set, onUpdate, onDelete }: SetRowProps) {
  const [showMenu, setShowMenu] = useState(false)

  /**
   * Handles set deletion with confirmation
   */
  const handleDelete = () => {
    if (confirm("Möchtest du diesen Satz wirklich löschen?")) {
      onDelete()
    }
    setShowMenu(false)
  }

  return (
    <div className="flex items-center gap-2 mb-2">
      {/* Set number badge */}
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-white text-sm">
        {set.setNumber}
      </div>

      {/* Weight input - supports decimal values */}
      <input
        type="number"
        min="0"
        step="0.5"
        value={set.weight || ""}
        onChange={(e) => {
          const value = e.target.value
          const numValue = value === "" ? 0 : Math.max(0, Number.parseFloat(value) || 0)
          onUpdate({ ...set, weight: numValue })
        }}
        className="w-16 px-2 py-1 bg-blue-600 text-white rounded-full text-center text-sm"
        placeholder="kg"
      />

      {/* Reps input - whole numbers only */}
      <input
        type="number"
        min="0"
        step="1"
        value={set.reps || ""}
        onChange={(e) => {
          const value = e.target.value
          const numValue = value === "" ? 0 : Math.max(0, Number.parseInt(value) || 0)
          onUpdate({ ...set, reps: numValue })
        }}
        className="w-16 px-2 py-1 bg-blue-600 text-white rounded-full text-center text-sm"
        placeholder="reps"
      />

      {/* Notes input - free text */}
      <input
        type="text"
        value={set.notes || ""}
        onChange={(e) => onUpdate({ ...set, notes: e.target.value })}
        className="flex-1 px-3 py-1 bg-blue-600 text-white rounded-full text-sm placeholder:text-white/50"
        placeholder="Notizen"
      />

      {/* Timer button - tracks rest time and saves to breakTime */}
      <TimerButton initialTime={set.breakTime || 0} onTimeChange={(time) => onUpdate({ ...set, breakTime: time })} />

      {/* Delete menu */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
        {showMenu && (
          <div className="absolute right-0 top-10 bg-gray-800 rounded-lg shadow-lg z-10 min-w-[120px]">
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
  )
}
