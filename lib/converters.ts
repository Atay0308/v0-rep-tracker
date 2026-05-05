
// lib/converters.ts
import type { Workout } from "../generated/prisma/client"
import type { WorkoutUI } from "@/types/workout"

export function prismaWorkoutToDisplay(workout: Workout): WorkoutUI {
  return {
    id: workout.id,
    name: workout.name || undefined,
    startTime: workout.startTime,
    endTime: workout.endTime || undefined,
    notes: workout.notes || undefined,
    isActive: workout.isActive,
    exercises: [], // mapped...
  }
}