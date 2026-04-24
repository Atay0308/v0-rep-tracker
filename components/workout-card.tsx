import Link from "next/link"
import type { Workout } from "@/types/workout"
import { formatDateShort, calculateDuration } from "@/lib/date-utils"

interface WorkoutCardProps {
  workout: Workout
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const duration = workout.endTime ? calculateDuration(workout.startTime, workout.endTime) : 0

  const exerciseSummary = workout.exercises.reduce(
    (acc, exercise) => {
      const existing = acc.find((e) => e.name === exercise.exerciseName)
      if (existing) {
        existing.sets += exercise.sets.length
      } else {
        acc.push({
          name: exercise.exerciseName,
          sets: exercise.sets.length,
        })
      }
      return acc
    },
    [] as Array<{ name: string; sets: number }>,
  )

  return (
    <Link href={`/workout/${workout.id}`}>
      <div style={{
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--color-primary)',
        padding: 'var(--spacing-md)',
        height: '11.25rem',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background-color var(--transition-fast)',
      }}>
        <div className="flex-between mb-sm">
          <h3 className="font-medium text-lg" style={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {workout.name}
          </h3>
          {duration > 0 && (
            <span className="text-sm" style={{ opacity: 0.8, flexShrink: 0, marginLeft: 'var(--spacing-sm)' }}>
              ({duration} Min)
            </span>
          )}
        </div>

        <div className="text-sm mb-sm" style={{ opacity: 0.9 }}>
          {formatDateShort(new Date(workout.date))}
        </div>

        <div style={{ flex: 1, overflow: 'hidden' }}>
          {exerciseSummary.slice(0, 4).map((exercise, index) => (
            <div key={index} className="text-sm" style={{ opacity: 0.9 }}>
              {exercise.sets}x {exercise.name}
            </div>
          ))}
          {exerciseSummary.length > 4 && (
            <div className="text-sm" style={{ opacity: 0.7 }}>
              ... und {exerciseSummary.length - 4} weitere
            </div>
          )}
        </div>

        <div style={{ textAlign: 'right', marginTop: 'var(--spacing-sm)' }}>
          <span className="text-sm" style={{ opacity: 0.7 }}>Details</span>
        </div>
      </div>
    </Link>
  )
}
