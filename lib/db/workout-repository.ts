/**
 * @file workout-repository.ts
 * @description Einzige Schicht mit direktem Prisma-Zugriff für Workouts.
 *
 * **Verantwortung**
 * - CRUD auf `Workout` inkl. Ownership-Check (`userId`)
 * - Laden mit {@link WORKOUT_WITH_RELATIONS_INCLUDE}
 * - Synchronisation verschachtelter `exercises` / `sets` aus {@link WorkoutUI}
 *
 * **Ruft nicht auf:** `auth()` — `userId` kommt vom Aufrufer (Server Actions).
 * **Gibt zurück:** Prisma-Modelle oder `WorkoutWithRelations`, **kein** `WorkoutUI`.
 * Mapping: `lib/converters.ts`
 *
 * @see app/actions/workout-actions.ts
 */

import "server-only"

import { prisma } from "@/prisma/prisma"
import type { WorkoutUI, WorkoutExerciseUI, ExerciseSetUI } from "@/types/workout"
import {
  WORKOUT_WITH_RELATIONS_INCLUDE,
  type WorkoutWithRelations,
} from "@/lib/db/workout-include"
import {
  workoutUIToPrismaCreateInput,
  workoutUIToPrismaPatch,
  exerciseSetUIToPrismaFields,
  prismaWorkoutToUIWorkout,
  prismaWorkoutBaseToUIWorkout,
} from "@/lib/converters"
import { findOrCreateExerciseId } from "@/lib/db/exercise-repository"
import {
  workoutNotFoundError,
  validationError,
} from "@/lib/errors/workout-action-error"

/** Prüft, ob das Workout dem User gehört; wirft bei fehlendem Zugriff. */
async function assertWorkoutOwned(userId: string, workoutId: string): Promise<void> {
  const row = await prisma.workout.findFirst({
    where: { id: workoutId, userId },
    select: { id: true },
  })
  if (!row) {
    throw workoutNotFoundError()
  }
}

/**
 * Synchronisiert Sätze einer WorkoutExercise-Zeile mit dem UI-Stand.
 * Bestehende IDs werden aktualisiert, unbekannte IDs neu angelegt, fehlende gelöscht.
 */
async function syncExerciseSets(workoutExerciseId: string, sets: ExerciseSetUI[]): Promise<void> {
  const existing = await prisma.exerciseSet.findMany({
    where: { exerciseId: workoutExerciseId },
  })
  const uiIds = new Set(sets.map((s) => s.id))

  for (const row of existing) {
    if (!uiIds.has(row.id)) {
      await prisma.exerciseSet.delete({ where: { id: row.id } })
    }
  }

  for (const uiSet of sets) {
    const fields = exerciseSetUIToPrismaFields(uiSet)
    const match = existing.find((r) => r.id === uiSet.id)

    if (match) {
      await prisma.exerciseSet.update({
        where: { id: uiSet.id },
        data: fields,
      })
    } else {
      await prisma.exerciseSet.create({
        data: {
          exercise: { connect: { id: workoutExerciseId } },
          ...fields,
        },
      })
    }
  }
}

/**
 * Synchronisiert alle Übungen eines Workouts (Reihenfolge, Verknüpfung, Sätze).
 */
async function syncWorkoutExercises(userId: string, workoutId: string, exercises: WorkoutExerciseUI[],)
  : Promise<void> {
  const existing = await prisma.workoutExercise.findMany({
    where: { workoutId },
    select: { id: true },
  })
  const existingIds = new Set(existing.map((e) => e.id))
  const uiIds = new Set(exercises.map((e) => e.id))

  for (const row of existing) {
    if (!uiIds.has(row.id)) {
      await prisma.workoutExercise.delete({ where: { id: row.id } })
    }
  }

  for (let index = 0; index < exercises.length; index++) {
    const uiEx = exercises[index]
    const exerciseId = await findOrCreateExerciseId(uiEx.exerciseName, uiEx.muscleGroup, userId)

    if (existingIds.has(uiEx.id)) {
      await prisma.workoutExercise.update({
        where: { id: uiEx.id },
        data: {
          order: index,
          exercise: { connect: { id: exerciseId } },
        },
      })
      await syncExerciseSets(uiEx.id, uiEx.sets)
    } else {
      const created = await prisma.workoutExercise.create({
        data: {
          workout: { connect: { id: workoutId } },
          order: index,
          exercise: { connect: { id: exerciseId } },
          sets: {
            create: uiEx.sets.map((s) => ({
              ...exerciseSetUIToPrismaFields(s),
            })),
          },
        },
      })
      // UI kann temporäre IDs (`ex-…`) mitgeführt haben — für Folge-Updates irrelevant
      void created
    }
  }
}

/** Alle Workouts eines Users, neueste zuerst (nach `startTime`). */
export async function findWorkoutsByUser(userId: string): Promise<WorkoutWithRelations[]> {
  return prisma.workout.findMany({
    where: { userId },
    include: WORKOUT_WITH_RELATIONS_INCLUDE,
    orderBy: { startTime: "desc" },
  })
}

/** Ein Workout inkl. Relations, nur wenn es dem User gehört. */
export async function findWorkoutById(
  userId: string,
  workoutId: string,
): Promise<WorkoutWithRelations | null> {
  return prisma.workout.findFirst({
    where: { id: workoutId, userId },
    include: WORKOUT_WITH_RELATIONS_INCLUDE,
  })
}

/** Aktives Workout des Users (höchstens eines mit `isActive: true`). */
export async function findActiveWorkoutByUser(userId: string): Promise<WorkoutWithRelations | null> {
  return prisma.workout.findFirst({
    where: { userId, isActive: true },
    include: WORKOUT_WITH_RELATIONS_INCLUDE,
    orderBy: { startTime: "desc" },
  })
}

/** Letzte abgeschlossene Workouts. */
export async function findRecentWorkoutsByUser(
  userId: string,
  limit: number,
): Promise<WorkoutWithRelations[]> {
  return prisma.workout.findMany({
    where: { userId, isActive: false },
    include: WORKOUT_WITH_RELATIONS_INCLUDE,
    orderBy: [{ endTime: "desc" }, { startTime: "desc" }],
    take: limit,
  })
}

/** Legt ein Workout an; gibt bei bestehendem aktivem Workout dieses zurück (kein Duplikat). */
export async function createWorkoutForUser(
  userId: string,
  input: Omit<WorkoutUI, "id" | "userId">,
): Promise<WorkoutUI> {
  const active = await findActiveWorkoutByUser(userId)
  if (active) {
    return prismaWorkoutToUIWorkout(active)
  }

  const created = await prisma.workout.create({
    data: workoutUIToPrismaCreateInput({ ...input, userId }),
  })

  return prismaWorkoutBaseToUIWorkout(created)
}

/**
 * Partielles Update: Kopfdaten + optional komplette `exercises`-Liste aus der UI.
 */
export async function updateWorkoutForUser(
  userId: string,
  workoutId: string,
  patch: Partial<WorkoutUI>,
): Promise<WorkoutWithRelations> {
  await assertWorkoutOwned(userId, workoutId)

  const { exercises, ...headPatch } = patch

  if (Object.keys(headPatch).length > 0) {
    await prisma.workout.update({
      where: { id: workoutId },
      data: workoutUIToPrismaPatch(headPatch),
    })
  }

  if (exercises !== undefined) {
    await syncWorkoutExercises(userId, workoutId, exercises)
  }

  const updated = await findWorkoutById(userId, workoutId)
  if (!updated) {
    throw workoutNotFoundError()
  }
  return updated
}

/** Löscht ein Workout inkl. Cascade auf Übungen/Sätze. */
export async function deleteWorkoutForUser(userId: string, workoutId: string): Promise<void> {
  await assertWorkoutOwned(userId, workoutId)
  await prisma.workout.delete({ where: { id: workoutId } })
}
