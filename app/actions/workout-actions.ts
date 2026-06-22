/**
 * @file workout-actions.ts
 * @description Server Actions — öffentliche Server-API für Workout-Daten.
 *
 * @see lib/db/workout-repository.ts
 * @see lib/converters.ts
 */

"use server"

import "server-only"

import { auth } from "@/auth"
import type { WorkoutUI } from "@/types/workout"
import { prismaWorkoutToUIWorkout } from "@/lib/converters"
import * as workoutRepo from "@/lib/db/workout-repository"
import {
  WorkoutActionError,
  unauthorizedError,
} from "@/lib/errors/workout-action-error"

/**
 * Liest die User-ID aus der NextAuth-Session.
 * @throws {WorkoutActionError} UNAUTHORIZED
 */
async function requireUserId(): Promise<string> {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) {
    throw unauthorizedError()
  }
  return userId
}

/**
 * Fängt Repository-Fehler ab und mappt unbekannte Exceptions auf WorkoutActionError.
 */
async function runWorkoutAction<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (error instanceof WorkoutActionError) throw error
    if (error instanceof Error) {
      throw new WorkoutActionError("UNKNOWN", error.message)
    }
    throw new WorkoutActionError("UNKNOWN", "Unbekannter Fehler")
  }
}

/** Eingabe für `createWorkoutAction` — ohne serverseitige Felder `id` / `userId`. */
export type CreateWorkoutInput = Omit<WorkoutUI, "id" | "userId">

/** Alle Workouts des eingeloggten Users. */
export async function getWorkoutsAction(): Promise<WorkoutUI[]> {
  return runWorkoutAction(async () => {
    const userId = await requireUserId()
    const rows = await workoutRepo.findWorkoutsByUser(userId)
    return rows.map(prismaWorkoutToUIWorkout)
  })
}

/** Ein Workout nach ID (nur eigene Daten). */
export async function getWorkoutAction(workoutId: string): Promise<WorkoutUI | null> {
  return runWorkoutAction(async () => {
    const userId = await requireUserId()
    const row = await workoutRepo.findWorkoutById(userId, workoutId)
    return row ? prismaWorkoutToUIWorkout(row) : null
  })
}

/** Aktives Workout oder `null`. */
export async function getActiveWorkoutAction(): Promise<WorkoutUI | null> {
  return runWorkoutAction(async () => {
    const userId = await requireUserId()
    const row = await workoutRepo.findActiveWorkoutByUser(userId)
    return row ? prismaWorkoutToUIWorkout(row) : null
  })
}

/** Letzte abgeschlossene Workouts. */
export async function getRecentWorkoutsAction(limit = 3): Promise<WorkoutUI[]> {
  return runWorkoutAction(async () => {
    const userId = await requireUserId()
    const rows = await workoutRepo.findRecentWorkoutsByUser(userId, limit)
    return rows.map(prismaWorkoutToUIWorkout)
  })
}

/**
 * Neues Workout anlegen.
 * Wenn bereits ein aktives existiert, wird dieses zurückgegeben (kein zweites aktives Training).
 */
export async function createWorkoutAction(input: CreateWorkoutInput): Promise<WorkoutUI> {
  return runWorkoutAction(async () => {
    const userId = await requireUserId()
    return workoutRepo.createWorkoutForUser(userId, input)
  })
}

/** Workout aktualisieren (Kopfdaten und/oder komplette Übungsliste). */
export async function updateWorkoutAction(
  workoutId: string,
  patch: Partial<WorkoutUI>,
): Promise<WorkoutUI> {
  return runWorkoutAction(async () => {
    const userId = await requireUserId()
    const updated = await workoutRepo.updateWorkoutForUser(userId, workoutId, patch)
    return prismaWorkoutToUIWorkout(updated)
  })
}

/** Workout löschen. */
export async function deleteWorkoutAction(workoutId: string): Promise<void> {
  return runWorkoutAction(async () => {
    const userId = await requireUserId()
    await workoutRepo.deleteWorkoutForUser(userId, workoutId)
  })
}

// ---------------------------------------------------------------------------
// Client-Aliase (kurze Namen für Pages / SWR — keine separate workout-api.ts)
// ---------------------------------------------------------------------------

export {
  getWorkoutsAction as getWorkouts,
  getWorkoutAction as getWorkout,
  getActiveWorkoutAction as getActiveWorkout,
  getRecentWorkoutsAction as getRecentWorkouts,
  createWorkoutAction as createWorkout,
  updateWorkoutAction as updateWorkout,
  deleteWorkoutAction as deleteWorkout,
}
