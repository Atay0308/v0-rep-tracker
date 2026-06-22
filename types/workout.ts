/**
 * @file types/workout.ts
 * @description UI-Datenverträge für Client-Komponenten, Hooks und Statistik.
 *
 * Diese Typen beschreiben **nicht** das Prisma-Schema, sondern die Form, die
 * React-Seiten und SWR erwarten (Strings für Datum/Uhrzeit, denormalisierte Übungsnamen).
 *
 * Mapping Prisma ↔ UI: `lib/converters.ts`
 * DB-Abfrage-Shape: `lib/db/workout-include.ts`
 *
 * Regel: In `"use client"`-Dateien nur Typen aus dieser Datei importieren —
 * nie `@/generated/prisma` oder `prisma`.
 */

/**
 * Vollständiges Training aus Sicht der UI (Liste, Detail, Formular).
 */
export interface WorkoutUI {
  /** DB-CUID nach Laden/Erstellen; siehe ARCHITECTURE.md „IDs“. */
  id: string
  userId: string
  name?: string
  startDate: string // ISO date string (start date)
  startTime: string // HH:mm format
  endTime?: string // HH:mm format
  endDate?: string // ISO date string (end date, for multi-day workouts)
  notes?: string
  isActive: boolean // true if workout is in progress
  exercises: WorkoutExerciseUI[]
}

/** Ein Satz innerhalb einer Übung im aktiven Workout. */
export interface ExerciseSetUI {
  /** DB-CUID oder temporär `set-${Date.now()}` bis zum Speichern. */
  id: string
  setNumber: number
  weight: number
  reps: number
  breakTime: number // in seconds
  notes?: string
}

/**
 * Übung innerhalb eines Workouts.
 * `exerciseName` / `muscleGroup` sind denormalisiert (aus `Exercise` + `Muscle` in der DB).
 */
export interface WorkoutExerciseUI {
  /** DB-CUID oder temporär `ex-${Date.now()}` bis zum Speichern. */
  id: string
  workoutId: string
  exerciseName: string
  muscleGroup: string
  sets: ExerciseSetUI[]
  order: number
}


/**
 * Training plan definition
 */
export interface TrainingPlanUI {
  id: string
  name: string
  exercises: {
    exerciseName: string
    sets: number
  }[]
}

// -------------------------
/**
 * Muscle group categories
 */
export type MuscleGroup = "Bauch" | "Beine" | "Bizeps" | "Brust" | "Nacken" | "Rücken" | "Schultern" | "Trizeps"


/**
 * Statistics data point for charts
 */
export interface StatDataPoint {
  date: string
  value: number
}

/**
 * Time period filter options
 */
export type TimePeriod = "1M" | "3M" | "6M" | "1Y" | "ALL"

/**
 * Grouping options for statistics
 */
export type GroupBy = "Day" | "Week" | "Month"
