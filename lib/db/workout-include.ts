/**
 * @file workout-include.ts
 * @description Zentrale Prisma-`include`-Definition für Workout-Abfragen.
 *
 * **Warum diese Datei existiert**
 * - Repository (Phase 2) und Converter (Phase 1) brauchen dieselbe Abfrage-Form.
 * - Ein `include` an einer Stelle verhindert Drift („mal mit Sets, mal ohne“).
 * - Der Typ `WorkoutWithRelations` beschreibt exakt, was aus der DB kommt, bevor
 *   `prismaWorkoutToUIWorkout` es ins UI-Modell übersetzt.
 *
 * **Nicht hier:** Kein Prisma-Client, keine Queries — nur Shape + Typ.
 *
 * @see lib/converters.ts — Mapping DB → WorkoutUI
 * @see lib/db/workout-repository.ts
 */

import "server-only"

import type { Prisma } from "@/generated/prisma/client"

/**
 * Standard-`include` für alle Workout-Reads, die die UI braucht.
 *  statt prisma.workout.findFirst({ include: { exercises: { include: { sets: true } } }})
 *  übergeben wir beim include WORKOUT_WITH_RELATIONS_INCLUDE
 *  Dadurch haben wir zentralisierte Include-Konfiguration 
 * Lädt:
 * - `exercises` sortiert nach `order`
 * - je Übung: `sets` sortiert nach `setNumber`
 * - je Übung: verknüpfte globale `Exercise` inkl. `Muscle` (für Name + Muskelgruppe)
 */
export const WORKOUT_WITH_RELATIONS_INCLUDE = {
  exercises: {
    orderBy: { order: "asc" },
    include: {
      sets: {
        orderBy: { setNumber: "asc" },
      },
      exercise: {
        include: {
          muscle: true,
        },
      },
    },
  },
} as const satisfies Prisma.WorkoutInclude

/**
 * Prisma-Ergebnistyp nach `findFirst` / `findMany` mit {@link WORKOUT_WITH_RELATIONS_INCLUDE}.
 *
 * Enthält verschachtelte `exercises`, `sets` und optional `exercise.muscle`.
 * Wird nur serverseitig verwendet (Repository / Server Actions).
 * Typangaben für die Include Konfiguration
 */
export type WorkoutWithRelations = Prisma.WorkoutGetPayload<{
  include: typeof WORKOUT_WITH_RELATIONS_INCLUDE
}>

/** Einzelne WorkoutExercise-Zeile inkl. Relations (Subset von WorkoutWithRelations). */
export type WorkoutExerciseWithRelations = WorkoutWithRelations["exercises"][number]

/** Einzelner Satz inkl. Parent-Kontext nicht nötig — direkt aus Exercise-Include. */
export type ExerciseSetFromWorkout = WorkoutExerciseWithRelations["sets"][number]
