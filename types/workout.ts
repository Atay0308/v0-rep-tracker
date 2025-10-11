/**
 * Core type definitions for the workout tracking application
 */

/**
 * Represents a single set within an exercise
 */
export interface WorkoutSet {
  id: string
  setNumber: number
  weight: number
  reps: number
  breakTime: number // in seconds
  notes?: string
}

/**
 * Represents an exercise within a workout
 */
export interface WorkoutExercise {
  id: string
  workoutId: string
  exerciseName: string
  muscleGroup: string
  sets: WorkoutSet[]
  order: number
}

/**
 * Represents a complete workout session
 */
export interface Workout {
  id: string
  name: string
  date: string // ISO date string
  startTime: string // HH:mm format
  endTime?: string // HH:mm format
  notes?: string
  isActive: boolean // true if workout is in progress
  exercises: WorkoutExercise[]
}

/**
 * Muscle group categories
 */
export type MuscleGroup = "Bauch" | "Beine" | "Bizeps" | "Brust" | "Nacken" | "Rücken" | "Schultern" | "Trizeps"

/**
 * Exercise definition with muscle group mapping
 */
export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
}

/**
 * Training plan definition
 */
export interface TrainingPlan {
  id: string
  name: string
  muscleGroups: MuscleGroup[]
  exercises: {
    exerciseName: string
    sets: number
  }[]
}

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
