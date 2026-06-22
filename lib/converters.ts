/**
 * @file converters.ts
 * @description Übersetzung zwischen Prisma-Datenbankmodell und UI-Typen (`WorkoutUI`).
 *
 * ## Architektur-Grenze
 *
 * ```
 * PostgreSQL  →  Prisma (WorkoutWithRelations)  →  [dieses Modul]  →  WorkoutUI  →  React
 * ```
 *
 * - **Prisma-Seite:** `DateTime`, relationale `WorkoutExercise` ohne eingebettete Namen.
 * - **UI-Seite:** `startDate` + `startTime` als Strings, `exerciseName` / `muscleGroup` denormalisiert.
 *
 * ## Warum getrennte Felder in der UI?
 *
 * Historisch kamen Workouts aus JSON Server mit `date` + `startTime`. In der DB gibt es nur
 * `startTime: DateTime`. Die UI splittet das für Formulare (`<input type="time">`, Datumsanzeige).
 *
 * ## Server-only
 *
 * Dieses Modul importiert **keinen** Prisma-Client — nur Typen aus `@/generated/prisma/client`.
 * Es darf von Server Actions und Repository importiert werden, nicht von `"use client"`-Komponenten
 * (dort nur `WorkoutUI` aus `@/types/workout` verwenden).
 *
 * `import "server-only"` verhindert versehentlichen Client-Bundle-Import.
 *
 * @see types/workout.ts — UI-Verträge
 * @see lib/db/workout-include.ts — gemeinsames `include` für Queries
 */

import "server-only"

import type { Prisma, Workout } from "@/generated/prisma/client"
import type {
  WorkoutUI,
  WorkoutExerciseUI,
  ExerciseSetUI,
} from "@/types/workout"
import type {
  WorkoutWithRelations,
  WorkoutExerciseWithRelations,
  ExerciseSetFromWorkout,
} from "@/lib/db/workout-include"

// ---------------------------------------------------------------------------
// Datum / Uhrzeit-Hilfen
// ---------------------------------------------------------------------------

/**
 * Formatiert ein `Date` als lokales Kalenderdatum `YYYY-MM-DD`.
 * Verwendet die lokale Zeitzone des Servers — passend zur bisherigen UI (deutsche Nutzer).
 */
export function formatLocalDateISO(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/**
 * Formatiert ein `Date` als lokale Uhrzeit `HH:mm` (24h).
 */
export function formatLocalTimeHHmm(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

/**
 * Baut aus UI-Strings ein `Date` (lokale Interpretation wie `new Date("2025-01-15T14:30:00")`).
 */
export function parseLocalDateAndTime(date: string, time: string): Date {
  return new Date(`${date}T${time}:00`)
}

// ---------------------------------------------------------------------------
// Prisma → UI
// ---------------------------------------------------------------------------

/**
 * Mappt einen einzelnen Satz aus der DB auf {@link ExerciseSetUI}.
 */
export function prismaExerciseSetToUI(set: ExerciseSetFromWorkout): ExerciseSetUI {
  return {
    id: set.id,
    setNumber: set.setNumber,
    weight: set.weight,
    reps: set.reps,
    breakTime: set.breakTime,
    notes: set.notes ?? undefined,
  }
}

/**
 * Mappt eine WorkoutExercise-Zeile inkl. Relationen auf {@link WorkoutExerciseUI}.
 *
 * `exerciseName` und `muscleGroup` kommen aus der verknüpften `Exercise`-Tabelle.
 * Falls `exerciseId` fehlt oder die Relation nicht geladen wurde, Fallback-Strings —
 * die UI bleibt renderbar, Phase 2 kann dann strikter validieren.
 */
export function prismaWorkoutExerciseToUI(
  row: WorkoutExerciseWithRelations,
): WorkoutExerciseUI {
  return {
    id: row.id,
    workoutId: row.workoutId,
    exerciseName: row.exercise?.name ?? "Unbekannte Übung",
    muscleGroup: row.exercise?.muscle?.name ?? "",
    order: row.order,
    sets: row.sets.map(prismaExerciseSetToUI),
  }
}

/**
 * Mappt ein vollständig geladenes Prisma-Workout auf {@link WorkoutUI}.
 * workout.exercises.map(prismaWorkoutExerciseToUI) ist shorthand für workout.exercises.map((exercise) => prismaWorkoutExerciseToUI(exercise))
 * @param workout — Ergebnis von `prisma.workout.find*({ include: WORKOUT_WITH_RELATIONS_INCLUDE })`
 */
export function prismaWorkoutToUIWorkout(workout: WorkoutWithRelations): WorkoutUI {
  return {
    id: workout.id,
    userId: workout.userId,
    name: workout.name ?? undefined,
    startDate: formatLocalDateISO(workout.startTime),
    startTime: formatLocalTimeHHmm(workout.startTime),
    endDate: workout.endTime ? formatLocalDateISO(workout.endTime) : undefined,
    endTime: workout.endTime ? formatLocalTimeHHmm(workout.endTime) : undefined,
    notes: workout.notes ?? undefined,
    isActive: workout.isActive,
    exercises: workout.exercises.map(prismaWorkoutExerciseToUI),
  }
}

/**
 * Mappt ein Workout **ohne** geladene `exercises` (z. B. direkt nach `create`).
 * Übungen sind dann leer — nach erneutem Laden mit `WORKOUT_WITH_RELATIONS_INCLUDE` vollständig.
 */
export function prismaWorkoutBaseToUIWorkout(workout: Workout): WorkoutUI {
  return {
    id: workout.id,
    userId: workout.userId,
    name: workout.name ?? undefined,
    startDate: formatLocalDateISO(workout.startTime),
    startTime: formatLocalTimeHHmm(workout.startTime),
    endDate: workout.endTime ? formatLocalDateISO(workout.endTime) : undefined,
    endTime: workout.endTime ? formatLocalTimeHHmm(workout.endTime) : undefined,
    notes: workout.notes ?? undefined,
    isActive: workout.isActive,
    exercises: [],
  }
}

// ---------------------------------------------------------------------------
// UI → Prisma (Workout-Kopfdaten)
// ---------------------------------------------------------------------------

/**
 * Daten für `prisma.workout.create({ data: { ... } })`.
 * `userId` kommt in Phase 2 aus der Session, nicht vom Client.
 */
export function workoutUIToPrismaCreateInput(
  workout: Pick<
    WorkoutUI,
    "userId" | "name" | "startDate" | "startTime" | "endDate" | "endTime" | "notes" | "isActive"
  >,
): Prisma.WorkoutCreateInput {
  return {
    user: { connect: { id: workout.userId } },
    name: workout.name ?? null,
    startTime: parseLocalDateAndTime(workout.startDate, workout.startTime),
    endTime:
      workout.endDate && workout.endTime
        ? parseLocalDateAndTime(workout.endDate, workout.endTime)
        : null,
    notes: workout.notes ?? null,
    isActive: workout.isActive,
  }
}

/**
 * Vollständiges UI-Workout → flaches Prisma-Objekt (Legacy-Helfer für bestehende Aufrufe).
 * Bevorzugt {@link workoutUIToPrismaCreateInput} für Creates und {@link workoutUIToPrismaPatch} für Updates.
 */
export function workoutUIToPrismaWorkout(
  workout: Pick<
    WorkoutUI,
    "userId" | "name" | "startDate" | "startTime" | "endDate" | "endTime" | "notes" | "isActive"
  >,
) {
  return {
    userId: workout.userId,
    name: workout.name ?? null,
    startTime: parseLocalDateAndTime(workout.startDate, workout.startTime),
    endTime:
      workout.endDate && workout.endTime
        ? parseLocalDateAndTime(workout.endDate, workout.endTime)
        : null,
    notes: workout.notes ?? null,
    isActive: workout.isActive,
  }
}

/**
 * Partielles Update für `prisma.workout.update({ data })`.
 * Nur gesetzte Felder in `patch` werden übernommen — typisch beim Speichern aus dem Formular.
 */
export function workoutUIToPrismaPatch(patch: Partial<WorkoutUI>): Prisma.WorkoutUpdateInput {
  const data: Prisma.WorkoutUpdateInput = {}

  if (patch.name !== undefined) {
    data.name = patch.name
  }
  if (patch.notes !== undefined) {
    data.notes = patch.notes
  }
  if (patch.isActive !== undefined) {
    data.isActive = patch.isActive
  }
  if (patch.startDate !== undefined && patch.startTime !== undefined) {
    data.startTime = parseLocalDateAndTime(patch.startDate, patch.startTime)
  }
  if (patch.endDate !== undefined && patch.endTime !== undefined) {
    data.endTime = parseLocalDateAndTime(patch.endDate, patch.endTime)
  }

  return data
}

/**
 * @deprecated Nutze {@link workoutUIToPrismaPatch} — Name bleibt für schrittweise Migration.
 */
export function workoutUIToUpdateData(patch: Partial<WorkoutUI>): Prisma.WorkoutUpdateInput {
  return workoutUIToPrismaPatch(patch)
}

// ---------------------------------------------------------------------------
// UI → Prisma (Übungen & Sätze)
// ---------------------------------------------------------------------------

/**
 * Mappt UI-Satz → Prisma-Felder für `exerciseSet.create` / `update`.
 * Wird in `workout-repository.ts` beim Sync der Sätze verwendet.
 */
export function exerciseSetUIToPrismaFields(
  set: ExerciseSetUI,
): Pick<Prisma.ExerciseSetCreateInput, "setNumber" | "weight" | "reps" | "breakTime" | "notes"> {
  return {
    setNumber: set.setNumber,
    weight: set.weight,
    reps: set.reps,
    breakTime: set.breakTime,
    notes: set.notes ?? null,
  }
}

