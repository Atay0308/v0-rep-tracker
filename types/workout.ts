/**
 * UI-Types definition
 */
/**
 * Represents a complete workout session
 */
export interface WorkoutUI {
  id: string
  name?: string
  date: string // ISO date string (start date)
  startTime: string // HH:mm format
  endTime?: string // HH:mm format
  endDate?: string // ISO date string (end date, for multi-day workouts)
  notes?: string
  isActive: boolean // true if workout is in progress
  exercises: WorkoutExerciseUI[]
}

/**
 * Represents a single set within an exercise
 */
export interface ExerciseSetUI {
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
export interface WorkoutExerciseUI {
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
