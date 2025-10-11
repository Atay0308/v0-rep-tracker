/**
 * Exercise database with muscle group mappings
 */

import type { Exercise, MuscleGroup } from "@/types/workout"

const loadCustomExercises = (): Record<MuscleGroup, Exercise[]> => {
  const defaultExercises: Record<MuscleGroup, Exercise[]> = {
    Beine: [
      { id: "leg-1", name: "Abduktionsmaschine", muscleGroup: "Beine" },
      { id: "leg-2", name: "Adduktionsmaschine", muscleGroup: "Beine" },
      { id: "leg-3", name: "Ausfallschritte", muscleGroup: "Beine" },
      { id: "leg-4", name: "Beinbeugemachine", muscleGroup: "Beine" },
      { id: "leg-5", name: "Beinbeugen", muscleGroup: "Beine" },
      { id: "leg-6", name: "Beinpresse", muscleGroup: "Beine" },
      { id: "leg-7", name: "Kniebeuge", muscleGroup: "Beine" },
      { id: "leg-8", name: "Beinstrecker", muscleGroup: "Beine" },
      { id: "leg-9", name: "Bulgarian Split Squats", muscleGroup: "Beine" },
      { id: "leg-10", name: "Wadenheben", muscleGroup: "Beine" },
      { id: "leg-11", name: "Kreuzheben", muscleGroup: "Beine" },
      { id: "leg-12", name: "Sumo Squats", muscleGroup: "Beine" },
      { id: "leg-13", name: "Hackenschmidt", muscleGroup: "Beine" },
      { id: "leg-14", name: "Sissy Squats", muscleGroup: "Beine" },
    ],
    Brust: [
      { id: "chest-1", name: "Bankdrücken", muscleGroup: "Brust" },
      { id: "chest-2", name: "Schrägbankdrücken", muscleGroup: "Brust" },
      { id: "chest-3", name: "Fliegende", muscleGroup: "Brust" },
      { id: "chest-4", name: "Butterfly", muscleGroup: "Brust" },
      { id: "chest-5", name: "Dips", muscleGroup: "Brust" },
      { id: "chest-6", name: "Kurzhantel Bankdrücken", muscleGroup: "Brust" },
      { id: "chest-7", name: "Cable Crossover", muscleGroup: "Brust" },
      { id: "chest-8", name: "Liegestütze", muscleGroup: "Brust" },
      { id: "chest-9", name: "Negativ Bankdrücken", muscleGroup: "Brust" },
      { id: "chest-10", name: "Brustpresse", muscleGroup: "Brust" },
    ],
    Rücken: [
      { id: "back-1", name: "Klimmzüge", muscleGroup: "Rücken" },
      { id: "back-2", name: "Latziehen", muscleGroup: "Rücken" },
      { id: "back-3", name: "Rudern", muscleGroup: "Rücken" },
      { id: "back-4", name: "Kreuzheben", muscleGroup: "Rücken" },
      { id: "back-5", name: "Hyperextensions", muscleGroup: "Rücken" },
      { id: "back-6", name: "T-Bar Rudern", muscleGroup: "Rücken" },
      { id: "back-7", name: "Kurzhantel Rudern", muscleGroup: "Rücken" },
      { id: "back-8", name: "Kabelrudern", muscleGroup: "Rücken" },
      { id: "back-9", name: "Latzug eng", muscleGroup: "Rücken" },
      { id: "back-10", name: "Face Pulls", muscleGroup: "Rücken" },
      { id: "back-11", name: "Deadlift", muscleGroup: "Rücken" },
    ],
    Schultern: [
      { id: "shoulder-1", name: "Schulterdrücken", muscleGroup: "Schultern" },
      { id: "shoulder-2", name: "Seitheben", muscleGroup: "Schultern" },
      { id: "shoulder-3", name: "Frontheben", muscleGroup: "Schultern" },
      { id: "shoulder-4", name: "Reverse Flys", muscleGroup: "Schultern" },
      { id: "shoulder-5", name: "Arnold Press", muscleGroup: "Schultern" },
      { id: "shoulder-6", name: "Aufrechtes Rudern", muscleGroup: "Schultern" },
      { id: "shoulder-7", name: "Kurzhantel Schulterdrücken", muscleGroup: "Schultern" },
      { id: "shoulder-8", name: "Cable Lateral Raises", muscleGroup: "Schultern" },
      { id: "shoulder-9", name: "Face Pulls", muscleGroup: "Schultern" },
    ],
    Bizeps: [
      { id: "bicep-1", name: "Bizeps Curls", muscleGroup: "Bizeps" },
      { id: "bicep-2", name: "Hammer Curls", muscleGroup: "Bizeps" },
      { id: "bicep-3", name: "Konzentrationscurls", muscleGroup: "Bizeps" },
      { id: "bicep-4", name: "Preacher Curls", muscleGroup: "Bizeps" },
      { id: "bicep-5", name: "Cable Curls", muscleGroup: "Bizeps" },
      { id: "bicep-6", name: "21s", muscleGroup: "Bizeps" },
      { id: "bicep-7", name: "Zottman Curls", muscleGroup: "Bizeps" },
      { id: "bicep-8", name: "Spider Curls", muscleGroup: "Bizeps" },
    ],
    Trizeps: [
      { id: "tricep-1", name: "Trizepsdrücken", muscleGroup: "Trizeps" },
      { id: "tricep-2", name: "French Press", muscleGroup: "Trizeps" },
      { id: "tricep-3", name: "Kickbacks", muscleGroup: "Trizeps" },
      { id: "tricep-4", name: "Dips", muscleGroup: "Trizeps" },
      { id: "tricep-5", name: "Overhead Extension", muscleGroup: "Trizeps" },
      { id: "tricep-6", name: "Close Grip Bench Press", muscleGroup: "Trizeps" },
      { id: "tricep-7", name: "Skull Crushers", muscleGroup: "Trizeps" },
      { id: "tricep-8", name: "Cable Pushdowns", muscleGroup: "Trizeps" },
    ],
    Bauch: [
      { id: "abs-1", name: "Crunches", muscleGroup: "Bauch" },
      { id: "abs-2", name: "Planks", muscleGroup: "Bauch" },
      { id: "abs-3", name: "Beinheben", muscleGroup: "Bauch" },
      { id: "abs-4", name: "Russian Twists", muscleGroup: "Bauch" },
      { id: "abs-5", name: "Mountain Climbers", muscleGroup: "Bauch" },
      { id: "abs-6", name: "Situps", muscleGroup: "Bauch" },
      { id: "abs-7", name: "Bicycle Crunches", muscleGroup: "Bauch" },
      { id: "abs-8", name: "Ab Wheel Rollouts", muscleGroup: "Bauch" },
      { id: "abs-9", name: "Hanging Leg Raises", muscleGroup: "Bauch" },
      { id: "abs-10", name: "Cable Crunches", muscleGroup: "Bauch" },
    ],
    Nacken: [
      { id: "neck-1", name: "Nackenheben", muscleGroup: "Nacken" },
      { id: "neck-2", name: "Shrugs", muscleGroup: "Nacken" },
      { id: "neck-3", name: "Kurzhantel Shrugs", muscleGroup: "Nacken" },
      { id: "neck-4", name: "Barbell Shrugs", muscleGroup: "Nacken" },
    ],
  }

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("customExercises")
      if (stored) {
        const custom = JSON.parse(stored) as Record<MuscleGroup, Exercise[]>
        // Merge custom exercises with default ones
        const merged = { ...defaultExercises }
        for (const [muscle, exercises] of Object.entries(custom)) {
          if (merged[muscle as MuscleGroup]) {
            merged[muscle as MuscleGroup] = [...merged[muscle as MuscleGroup], ...exercises]
          }
        }
        return merged
      }
    } catch (error) {
      console.error("[v0] Failed to load custom exercises:", error)
    }
  }

  return defaultExercises
}

const EXERCISES_BY_MUSCLE_GROUP = loadCustomExercises()

export const MUSCLE_GROUPS: MuscleGroup[] = [
  "Bauch",
  "Beine",
  "Bizeps",
  "Brust",
  "Nacken",
  "Rücken",
  "Schultern",
  "Trizeps",
]

/**
 * Get all exercises for a specific muscle group
 */
export function getExercisesByMuscleGroup(muscleGroup: MuscleGroup): Exercise[] {
  return EXERCISES_BY_MUSCLE_GROUP[muscleGroup] || []
}

/**
 * Get exercise by name
 */
export function getExerciseByName(name: string): Exercise | undefined {
  for (const exercises of Object.values(EXERCISES_BY_MUSCLE_GROUP)) {
    const exercise = exercises.find((ex) => ex.name === name)
    if (exercise) return exercise
  }
  return undefined
}

/**
 * Add a custom exercise to a muscle group (permanently saved to localStorage)
 */
export function addCustomExercise(muscleGroup: MuscleGroup, name: string): Exercise {
  const newExercise: Exercise = {
    id: `custom-${Date.now()}`,
    name,
    muscleGroup,
  }

  // Add to in-memory store
  EXERCISES_BY_MUSCLE_GROUP[muscleGroup] = [...EXERCISES_BY_MUSCLE_GROUP[muscleGroup], newExercise]

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("customExercises")
      const customExercises = stored ? JSON.parse(stored) : {}

      if (!customExercises[muscleGroup]) {
        customExercises[muscleGroup] = []
      }

      customExercises[muscleGroup].push(newExercise)
      localStorage.setItem("customExercises", JSON.stringify(customExercises))
      console.log("[v0] Custom exercise saved permanently:", newExercise)
    } catch (error) {
      console.error("[v0] Failed to save custom exercise:", error)
    }
  }

  return newExercise
}
