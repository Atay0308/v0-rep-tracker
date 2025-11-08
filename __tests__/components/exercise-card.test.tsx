import { render, screen, fireEvent } from "@testing-library/react"
import { ExerciseCard } from "@/components/exercise-card"
import type { WorkoutExercise } from "@/types/workout"
import { jest } from "@jest/globals" // Declare the jest variable

describe("ExerciseCard", () => {
  const mockExercise: WorkoutExercise = {
    id: "e1",
    workoutId: "w1",
    exerciseName: "Bankdrücken",
    muscleGroup: "Brust",
    order: 1,
    sets: [
      { id: "s1", setNumber: 1, weight: 80, reps: 10, breakTime: 90 },
      { id: "s2", setNumber: 2, weight: 85, reps: 8, breakTime: 90 },
    ],
  }

  const mockCallbacks = {
    onUpdateSet: jest.fn(),
    onDeleteSet: jest.fn(),
    onAddSet: jest.fn(),
    onDeleteExercise: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders exercise name correctly", () => {
    render(<ExerciseCard exercise={mockExercise} {...mockCallbacks} />)
    expect(screen.getByText("Bankdrücken")).toBeInTheDocument()
  })

  it("renders all sets", () => {
    render(<ExerciseCard exercise={mockExercise} {...mockCallbacks} />)
    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
  })

  it("calls onAddSet when add button is clicked", () => {
    render(<ExerciseCard exercise={mockExercise} {...mockCallbacks} />)
    const addButton = screen.getByText("Satz hinzufügen")
    fireEvent.click(addButton)
    expect(mockCallbacks.onAddSet).toHaveBeenCalledTimes(1)
  })

  it("shows delete menu when 3-dot button is clicked", () => {
    render(<ExerciseCard exercise={mockExercise} {...mockCallbacks} />)
    const menuButtons = screen.getAllByRole("button")
    const threeDotsButton = menuButtons.find((btn) => btn.querySelector("svg"))

    if (threeDotsButton) {
      fireEvent.click(threeDotsButton)
      expect(screen.getByText("Löschen")).toBeInTheDocument()
    }
  })

  it("calls onDeleteExercise with confirmation", () => {
    global.confirm = jest.fn(() => true)
    render(<ExerciseCard exercise={mockExercise} {...mockCallbacks} />)

    const menuButtons = screen.getAllByRole("button")
    const threeDotsButton = menuButtons.find((btn) => btn.querySelector("svg"))

    if (threeDotsButton) {
      fireEvent.click(threeDotsButton)
      const deleteButton = screen.getByText("Löschen")
      fireEvent.click(deleteButton)

      expect(global.confirm).toHaveBeenCalledWith('Möchtest du "Bankdrücken" wirklich löschen?')
      expect(mockCallbacks.onDeleteExercise).toHaveBeenCalledTimes(1)
    }
  })

  it("does not delete exercise when confirmation is cancelled", () => {
    global.confirm = jest.fn(() => false)
    render(<ExerciseCard exercise={mockExercise} {...mockCallbacks} />)

    const menuButtons = screen.getAllByRole("button")
    const threeDotsButton = menuButtons.find((btn) => btn.querySelector("svg"))

    if (threeDotsButton) {
      fireEvent.click(threeDotsButton)
      const deleteButton = screen.getByText("Löschen")
      fireEvent.click(deleteButton)

      expect(mockCallbacks.onDeleteExercise).not.toHaveBeenCalled()
    }
  })
})
