/**
 * API functions for workout data management using JSON server with localStorage fallback
 */

import type { Workout } from "@/types/workout"

const API_BASE_URL = "http://localhost:3001"
const STORAGE_KEY = "workout-tracker-data"
const INIT_KEY = "workout-tracker-initialized"

const MOCK_WORKOUTS: Workout[] = [
  {
    id: "1",
    name: "Oberkörper",
    date: "2025-01-08",
    startTime: "10:00",
    endTime: "11:30",
    notes: "Gutes Training heute",
    isActive: false,
    exercises: [
      {
        id: "e1",
        workoutId: "1",
        exerciseName: "Bankdrücken",
        muscleGroup: "Brust",
        sets: [
          { id: "s1", setNumber: 1, weight: 80, reps: 10, breakTime: 90 },
          { id: "s2", setNumber: 2, weight: 85, reps: 8, breakTime: 90 },
          { id: "s3", setNumber: 3, weight: 90, reps: 6, breakTime: 90 },
        ],
      },
      {
        id: "e2",
        workoutId: "1",
        exerciseName: "Schulterdrücken",
        muscleGroup: "Schultern",
        sets: [
          { id: "s4", setNumber: 1, weight: 30, reps: 12, breakTime: 60 },
          { id: "s5", setNumber: 2, weight: 32.5, reps: 10, breakTime: 60 },
          { id: "s6", setNumber: 3, weight: 35, reps: 8, breakTime: 60 },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Unterkörper",
    date: "2025-01-06",
    startTime: "14:00",
    endTime: "15:45",
    notes: "",
    isActive: false,
    exercises: [
      {
        id: "e3",
        workoutId: "2",
        exerciseName: "Kniebeuge",
        muscleGroup: "Beine",
        sets: [
          { id: "s7", setNumber: 1, weight: 100, reps: 10, breakTime: 120 },
          { id: "s8", setNumber: 2, weight: 110, reps: 8, breakTime: 120 },
          { id: "s9", setNumber: 3, weight: 120, reps: 6, breakTime: 120 },
        ],
      },
      {
        id: "e4",
        workoutId: "2",
        exerciseName: "Beinpresse",
        muscleGroup: "Beine",
        sets: [
          { id: "s10", setNumber: 1, weight: 150, reps: 12, breakTime: 90 },
          { id: "s11", setNumber: 2, weight: 170, reps: 10, breakTime: 90 },
          { id: "s12", setNumber: 3, weight: 190, reps: 8, breakTime: 90 },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Rücken & Bizeps",
    date: "2025-01-04",
    startTime: "09:00",
    endTime: "10:30",
    notes: "Fokus auf Form",
    isActive: false,
    exercises: [
      {
        id: "e5",
        workoutId: "3",
        exerciseName: "Klimmzüge",
        muscleGroup: "Rücken",
        sets: [
          { id: "s13", setNumber: 1, weight: 0, reps: 12, breakTime: 90 },
          { id: "s14", setNumber: 2, weight: 0, reps: 10, breakTime: 90 },
          { id: "s15", setNumber: 3, weight: 0, reps: 8, breakTime: 90 },
        ],
      },
      {
        id: "e6",
        workoutId: "3",
        exerciseName: "Bizeps Curls",
        muscleGroup: "Bizeps",
        sets: [
          { id: "s16", setNumber: 1, weight: 15, reps: 12, breakTime: 60 },
          { id: "s17", setNumber: 2, weight: 17.5, reps: 10, breakTime: 60 },
          { id: "s18", setNumber: 3, weight: 20, reps: 8, breakTime: 60 },
        ],
      },
    ],
  },
]

function initializeLocalStorage(): void {
  if (typeof window === "undefined") return

  const isInitialized = localStorage.getItem(INIT_KEY)
  if (!isInitialized) {
    console.log("[v0] Initializing localStorage with mock data")
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_WORKOUTS))
    localStorage.setItem(INIT_KEY, "true")
  }
}

function getLocalWorkouts(): Workout[] {
  if (typeof window === "undefined") return []
  initializeLocalStorage()
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

function saveLocalWorkouts(workouts: Workout[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts))
}

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

/**
 * Fetch all workouts
 */
export async function getWorkouts(): Promise<Workout[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts?_sort=date&_order=desc`)
    if (!response.ok) throw new Error("Failed to fetch workouts")
    return response.json()
  } catch (error) {
    console.log("[v0] Using localStorage fallback for getWorkouts")
    return getLocalWorkouts()
  }
}

/**
 * Fetch a single workout by ID
 */
export async function getWorkout(id: string): Promise<Workout> {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts/${id}`)
    if (!response.ok) throw new Error("Failed to fetch workout")
    return response.json()
  } catch (error) {
    console.log("[v0] Using localStorage fallback for getWorkout")
    const workouts = getLocalWorkouts()
    const workout = workouts.find((w) => w.id === id)
    if (!workout) throw new Error("Workout not found")
    return workout
  }
}

/**
 * Create a new workout
 */
export async function createWorkout(workout: Omit<Workout, "id">): Promise<Workout> {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workout),
    })
    if (!response.ok) throw new Error("Failed to create workout")
    return response.json()
  } catch (error) {
    console.log("[v0] Using localStorage fallback for createWorkout")
    const workouts = getLocalWorkouts()
    const newWorkout = { ...workout, id: generateId() }
    workouts.push(newWorkout)
    saveLocalWorkouts(workouts)
    return newWorkout
  }
}

/**
 * Update an existing workout
 */
export async function updateWorkout(id: string, workout: Partial<Workout>): Promise<Workout> {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workout),
    })
    if (!response.ok) throw new Error("Failed to update workout")
    return response.json()
  } catch (error) {
    console.log("[v0] Using localStorage fallback for updateWorkout")
    const workouts = getLocalWorkouts()
    const index = workouts.findIndex((w) => w.id === id)
    if (index === -1) throw new Error("Workout not found")
    workouts[index] = { ...workouts[index], ...workout }
    saveLocalWorkouts(workouts)
    return workouts[index]
  }
}

/**
 * Delete a workout
 */
export async function deleteWorkout(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete workout")
  } catch (error) {
    console.log("[v0] Using localStorage fallback for deleteWorkout")
    const workouts = getLocalWorkouts()
    const filtered = workouts.filter((w) => w.id !== id)
    saveLocalWorkouts(filtered)
  }
}

/**
 * Get the active workout (if any)
 */
export async function getActiveWorkout(): Promise<Workout | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts?isActive=true`)
    if (!response.ok) throw new Error("Failed to fetch active workout")
    const workouts = await response.json()
    return workouts.length > 0 ? workouts[0] : null
  } catch (error) {
    console.log("[v0] Using localStorage fallback for getActiveWorkout")
    const workouts = getLocalWorkouts()
    return workouts.find((w) => w.isActive) || null
  }
}

/**
 * Get recent workouts (last N workouts)
 */
export async function getRecentWorkouts(limit = 3): Promise<Workout[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts?_sort=date&_order=desc&_limit=${limit}&isActive=false`)
    if (!response.ok) throw new Error("Failed to fetch recent workouts")
    return response.json()
  } catch (error) {
    console.log("[v0] Using localStorage fallback for getRecentWorkouts")
    const workouts = getLocalWorkouts()
    return workouts
      .filter((w) => !w.isActive)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
  }
}
