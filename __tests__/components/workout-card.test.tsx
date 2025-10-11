/**
 * Tests for WorkoutCard component
 */

import { render, screen } from "@testing-library/react"
import { WorkoutCard } from "@/components/workout-card"
import type { Workout } from "@/types/workout"

const mockWorkout: Workout = {
  id: "1",
  name: "Test Workout",
  date: "2025-09-23",
  startTime: "18:00",
  endTime: "19:30",
  isActive: false,
  exercises: [
    {
      id: "ex-1",
      workoutId: "1",
      exerciseName: "Bankdrücken",
      muscleGroup: "Brust",
      order: 1,
      sets: [
        { id: "s1", setNumber: 1, weight: 80, reps: 10, breakTime: 90 },
        { id: "s2", setNumber: 2, weight: 80, reps: 10, breakTime: 90 },
      ],
    },
    {
      id: "ex-2",
      workoutId: "1",
      exerciseName: "Kniebeuge",
      muscleGroup: "Beine",
      order: 2,
      sets: [{ id: "s3", setNumber: 1, weight: 100, reps: 8, breakTime: 120 }],
    },
  ],
}

describe("WorkoutCard", () => {
  it("should render workout name", () => {
    render(<WorkoutCard workout={mockWorkout} />)
    expect(screen.getByText("Test Workout")).toBeInTheDocument()
  })

  it("should display workout duration", () => {
    render(<WorkoutCard workout={mockWorkout} />)
    expect(screen.getByText(/90 Min/)).toBeInTheDocument()
  })

  it("should display exercise summaries", () => {
    render(<WorkoutCard workout={mockWorkout} />)
    expect(screen.getByText(/2x Bankdrücken/)).toBeInTheDocument()
    expect(screen.getByText(/1x Kniebeuge/)).toBeInTheDocument()
  })

  it("should have link to workout detail", () => {
    render(<WorkoutCard workout={mockWorkout} />)
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/workout/1")
  })
})
