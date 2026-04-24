"use client"

import { useState } from "react"
import { MoreVertical, Trash2 } from "lucide-react"
import { TimerButton } from "./timer-button"
import type { WorkoutSet } from "@/types/workout"

interface SetRowProps {
  set: WorkoutSet
  onUpdate: (set: WorkoutSet) => void
  onDelete: () => void
}

export function SetRow({ set, onUpdate, onDelete }: SetRowProps) {
  const [showMenu, setShowMenu] = useState(false)

  const handleDelete = () => {
    if (confirm("Möchtest du diesen Satz wirklich löschen?")) {
      onDelete()
    }
    setShowMenu(false)
  }

  const inputStyle = {
    width: '4rem',
    padding: 'var(--spacing-xs) var(--spacing-sm)',
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    borderRadius: 'var(--radius-full)',
    textAlign: 'center' as const,
    fontSize: '0.875rem',
    border: 'none',
  }

  return (
    <div className="set-row">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2rem',
        height: '2rem',
        borderRadius: 'var(--radius-full)',
        backgroundColor: 'var(--color-secondary)',
        fontSize: '0.875rem',
      }}>
        {set.setNumber}
      </div>

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
        style={inputStyle}
        placeholder="kg"
      />

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
        style={inputStyle}
        placeholder="reps"
      />

      <input
        type="text"
        value={set.notes || ""}
        onChange={(e) => onUpdate({ ...set, notes: e.target.value })}
        style={{
          ...inputStyle,
          width: '100%',
          flex: 1,
          textAlign: 'left' as const,
        }}
        placeholder="Notizen"
      />

      <TimerButton initialTime={set.breakTime || 0} onTimeChange={(time) => onUpdate({ ...set, breakTime: time })} />

      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="btn btn-ghost btn-icon"
          style={{
            width: '2rem',
            height: '2rem',
            backgroundColor: 'var(--color-secondary)',
          }}
        >
          <MoreVertical style={{ width: '1rem', height: '1rem' }} />
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
  )
}
