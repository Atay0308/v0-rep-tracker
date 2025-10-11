/**
 * Workout card component for history page
 */

import Link from "next/link"
import type { Workout } from "@/types/workout"
import { formatDateShort, calculateDuration } from "@/lib/date-utils"

interface HistoryWorkoutCardProps {
  workout: Workout
}

export function HistoryWorkoutCard({ workout }: HistoryWorkoutCardProps) {
  const duration = workout.endTime ? calculateDuration(workout.startTime, workout.endTime) : 0

  // Group exercises by name and count sets
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
    <div className="mb-6">
      {/* Date header */}
      <div className="text-gray-400 text-sm mb-2">{formatDateShort(new Date(workout.date))}</div>

      {/* Workout card */}
      <div className="rounded-2xl bg-blue-600 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium text-lg">
            {workout.name || "Unbenanntes Training"} ({duration} Min)
          </h3>
        </div>

        <div className="space-y-1 mb-4">
          {exerciseSummary.map((exercise, index) => (
            <div key={index} className="text-white/90 text-sm">
              {exercise.sets}x {exercise.name}
            </div>
          ))}
        </div>

        <div className="text-right">
          <Link
            href={`/workout/${workout.id}`}
            className="inline-block text-white/70 hover:text-white text-sm transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}
