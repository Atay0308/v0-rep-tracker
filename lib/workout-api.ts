/**
 * API functions for workout data management using JSON server with localStorage fallback
 */

import type { Workout } from "@/types/workout"

const API_BASE_URL = "http://localhost:3001"
const STORAGE_KEY = "workout-tracker-data"
const INIT_KEY = "workout-tracker-initialized"



function initializeLocalStorage(): void {
  if (typeof window === "undefined") return

  const isInitialized = localStorage.getItem(INIT_KEY)
  if (!isInitialized) {
    console.log("[v0] Initializing localStorage with mock data")
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
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
    console.log("Fetching all workouts")
    const response = await fetch(`${API_BASE_URL}/workouts?_sort=date&_order=desc`)
    if (!response.ok) throw new Error("Failed to fetch workouts")
    console.log("Fetched all workouts", response)
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
  const existingActive = await getActiveWorkout()
  if (existingActive) {
    console.log("[v0] Active workout already exists, returning existing workout")
    return existingActive
  }
  // Zuerst bei Datenbank versuchen
  try {
    const response = await fetch(`${API_BASE_URL}/workouts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(workout),
    })
    if (!response.ok) throw new Error("Failed to create workout")
    return response.json()
  } catch (error) {
    // Fallback: localStorage
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
    
    if (!response.ok) {
      throw new Error("Failed to update workout")
    }
    
    const result = await response.json()
    return result
  } catch (error) {
    const workouts = getLocalWorkouts()
    const index = workouts.findIndex((w) => w.id === id)
    
    if (index === -1) {
      throw new Error("Workout not found")
    }
    
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
    const active = workouts.find((w) => w.isActive)
    return active || null
  }
}

/**
 * Get recent workouts (last N workouts)
 */
export async function getRecentWorkouts(limit = 3): Promise<Workout[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/workouts?isActive=false`)
    if (!response.ok) throw new Error("Failed to fetch recent workouts")
    const workouts = await response.json()
    
    // Sortiere nach Endzeitpunkt (oder Startzeitpunkt) - neueste zuerst
    const sorted = workouts.sort((a: Workout, b: Workout) => {
      // Verwende endTime wenn vorhanden, sonst startTime
      const timeA = a.endTime || a.startTime
      const timeB = b.endTime || b.startTime
      
      // Erstelle Datum+Zeit Objekte für korrekten Vergleich
      const dateTimeA = new Date(a.date + "T" + timeA + ":00")
      const dateTimeB = new Date(b.date + "T" + timeB + ":00")
      
      // Sortiere absteigend (neueste zuerst)
      const timeDiff = dateTimeB.getTime() - dateTimeA.getTime()
      
      // Wenn gleiche Zeit, sortiere nach ID (als Fallback)
      if (timeDiff === 0) {
        return b.id.localeCompare(a.id)
      }
      
      return timeDiff
    })
    
    return sorted.slice(0, limit)
  } catch (error) {
    console.log("[v0] Using localStorage fallback for getRecentWorkouts")
    const workouts = getLocalWorkouts()
    return workouts
      .filter((w) => !w.isActive)
      .sort((a, b) => {
        // Verwende endTime wenn vorhanden, sonst startTime
        const timeA = a.endTime || a.startTime
        const timeB = b.endTime || b.startTime
        
        // Erstelle Datum+Zeit Objekte für korrekten Vergleich
        const dateTimeA = new Date(a.date + "T" + timeA + ":00")
        const dateTimeB = new Date(b.date + "T" + timeB + ":00")
        
        // Sortiere absteigend (neueste zuerst)
        const timeDiff = dateTimeB.getTime() - dateTimeA.getTime()
        
        // Wenn gleiche Zeit, sortiere nach ID (als Fallback)
        if (timeDiff === 0) {
          return b.id.localeCompare(a.id)
        }
        
        return timeDiff
      })
      .slice(0, limit)
  }
}
