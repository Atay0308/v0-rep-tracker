"use client"

import { useState } from "react"
import { MoreVertical, Trash2 } from "lucide-react"
import { SetRow } from "./set-row"
import type { WorkoutExercise, WorkoutSet } from "@/types/workout"

interface ExerciseCardProps {
  exercise: WorkoutExercise
  onUpdateSet: (setId: string, set: WorkoutSet) => void
  onDeleteSet: (setId: string) => void
  onAddSet: () => void
  onDeleteExercise: () => void
}

export function ExerciseCard({ exercise, onUpdateSet, onDeleteSet, onAddSet, onDeleteExercise }: ExerciseCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const handleDelete = () => {
    if (confirm(`Möchtest du "${exercise.exerciseName}" wirklich löschen?`)) {
      onDeleteExercise()
    }
    setShowMenu(false)
  }

  return (
    <div className="card mb-md">
      <div className="flex-between mb-md" style={{ position: 'relative' }}>
        <h3 className="font-medium">{exercise.exerciseName}</h3>
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowMenu(!showMenu)} 
            className="btn btn-ghost btn-icon"
            style={{ width: '2rem', height: '2rem' }}
          >
            <MoreVertical style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-muted)' }} />
          </button>
          {showMenu && (
            <div className="dropdown-menu open">
              <button onClick={handleDelete} className="dropdown-item danger">
                <Trash2 style={{ width: '1rem', height: '1rem' }} />
                Löschen
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="set-row text-xs text-muted" style={{ marginBottom: 'var(--spacing-sm)' }}>
        <div></div>
        <div style={{ textAlign: 'center' }}>Gewicht</div>
        <div style={{ textAlign: 'center' }}>Wdh.</div>
        <div style={{ textAlign: 'center' }}>Notizen</div>
        <div></div>
      </div>

      {exercise.sets.map((set) => (
        <SetRow
          key={set.id}
          set={set}
          onUpdate={(updatedSet) => onUpdateSet(set.id, updatedSet)}
          onDelete={() => onDeleteSet(set.id)}
        />
      ))}

      <button 
        onClick={onAddSet} 
        className="btn btn-ghost btn-full mt-sm text-sm"
      >
        Satz hinzufügen
      </button>
    </div>
  )
}
