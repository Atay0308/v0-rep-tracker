/**
 * WorkoutCard Component
 *
 * Displays a summary of a workout session in a card format.
 * Shows workout name, date, duration, and exercise summary.
 * Clicking the card navigates to the full workout details.
 */

import Link from "next/link"
import type { Workout } from "@/types/workout"
import { formatDateShort, calculateDuration } from "@/lib/date-utils"

interface WorkoutCardProps {
  /** The workout data to display */
  workout: Workout
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  // Calculate workout duration if completed
  const duration = workout.endTime ? calculateDuration(workout.startTime, workout.endTime) : 0

  // Group exercises by name and count total sets
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
      <div className="rounded-2xl bg-blue-600 p-4 hover:bg-blue-700 transition-colors h-[180px] flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium text-lg truncate">{workout.name}</h3>
          {duration > 0 && <span className="text-white/80 text-sm flex-shrink-0 ml-2">({duration} Min)</span>}
        </div>

        <div className="text-white/90 text-sm mb-2">{formatDateShort(new Date(workout.date))}</div>

        <div className="space-y-1 flex-1 overflow-hidden">
          {exerciseSummary.slice(0, 4).map((exercise, index) => (
            <div key={index} className="text-white/90 text-sm truncate">
              {exercise.sets}x {exercise.name}
            </div>
          ))}
          {exerciseSummary.length > 4 && (
            <div className="text-white/70 text-sm">... und {exerciseSummary.length - 4} weitere</div>
          )}
        </div>

        <div className="mt-3 text-right">
          <span className="text-white/70 text-sm">Details</span>
        </div>
      </div>
    </Link>
  )
}
