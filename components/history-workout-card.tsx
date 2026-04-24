import Link from "next/link"
import type { Workout } from "@/types/workout"
import { formatDateShort, calculateDuration } from "@/lib/date-utils"

interface HistoryWorkoutCardProps {
  workout: Workout
}

export function HistoryWorkoutCard({ workout }: HistoryWorkoutCardProps) {
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
    <div className="mb-lg">
      <div className="text-muted text-sm mb-sm">
        {formatDateShort(new Date(workout.date))}
      </div>

      <div style={{
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--color-primary)',
        padding: 'var(--spacing-md)',
      }}>
        <div className="flex-between mb-sm">
          <h3 className="font-medium text-lg">
            {workout.name || "Unbenanntes Training"} ({duration} Min)
          </h3>
        </div>

        <div className="mb-md">
          {exerciseSummary.map((exercise, index) => (
            <div key={index} className="text-sm" style={{ opacity: 0.9 }}>
              {exercise.sets}x {exercise.name}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'right' }}>
          <Link
            href={`/workout/${workout.id}`}
            style={{ opacity: 0.7, fontSize: '0.875rem' }}
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}
