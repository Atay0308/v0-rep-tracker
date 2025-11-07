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

  it("should not display duration for active workouts", () => {
    const activeWorkout = { ...mockWorkout, endTime: undefined, isActive: true }
    render(<WorkoutCard workout={activeWorkout} />)
    expect(screen.queryByText(/Min/)).not.toBeInTheDocument()
  })

  it("should truncate long workout names", () => {
    const longNameWorkout = {
      ...mockWorkout,
      name: "This is a very long workout name that should be truncated",
    }
    render(<WorkoutCard workout={longNameWorkout} />)
    const heading = screen.getByRole("heading", { level: 3 })
    expect(heading).toHaveClass("truncate")
  })

  it("should show ellipsis for more than 4 exercises", () => {
    const manyExercisesWorkout = {
      ...mockWorkout,
      exercises: [
        ...mockWorkout.exercises,
        {
          id: "ex-3",
          workoutId: "1",
          exerciseName: "Schulterdrücken",
          muscleGroup: "Schultern",
          order: 3,
          sets: [{ id: "s4", setNumber: 1, weight: 30, reps: 12, breakTime: 60 }],
        },
        {
          id: "ex-4",
          workoutId: "1",
          exerciseName: "Bizeps Curls",
          muscleGroup: "Bizeps",
          order: 4,
          sets: [{ id: "s5", setNumber: 1, weight: 15, reps: 12, breakTime: 60 }],
        },
        {
          id: "ex-5",
          workoutId: "1",
          exerciseName: "Trizeps Dips",
          muscleGroup: "Trizeps",
          order: 5,
          sets: [{ id: "s6", setNumber: 1, weight: 0, reps: 15, breakTime: 60 }],
        },
      ],
    }
    render(<WorkoutCard workout={manyExercisesWorkout} />)
    expect(screen.getByText(/und 1 weitere/)).toBeInTheDocument()
  })

  it("should group multiple sets of same exercise", () => {
    render(<WorkoutCard workout={mockWorkout} />)
    // Bankdrücken has 2 sets, should show "2x Bankdrücken"
    expect(screen.getByText(/2x Bankdrücken/)).toBeInTheDocument()
  })

  it("should have hover effect class", () => {
    const { container } = render(<WorkoutCard workout={mockWorkout} />)
    const card = container.querySelector("div")
    expect(card).toHaveClass("hover:bg-blue-700")
  })
})
