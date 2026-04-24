import { render, screen, fireEvent } from "@testing-library/react"
import { SetRow } from "@/components/set-row"
import type { WorkoutSet } from "@/types/workout"
import { jest } from "@jest/globals"

describe("SetRow", () => {
  const mockSet: WorkoutSet = {
    id: "s1",
    setNumber: 1,
    weight: 80,
    reps: 10,
    breakTime: 90,
    notes: "Good form",
  }

  const mockCallbacks = {
    onUpdate: jest.fn(),
    onDelete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders set number correctly", () => {
    render(<SetRow set={mockSet} {...mockCallbacks} />)
    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("renders weight and reps values", () => {
    render(<SetRow set={mockSet} {...mockCallbacks} />)
    expect(screen.getByDisplayValue("80")).toBeInTheDocument()
    expect(screen.getByDisplayValue("10")).toBeInTheDocument()
  })

  it("renders notes", () => {
    render(<SetRow set={mockSet} {...mockCallbacks} />)
    expect(screen.getByDisplayValue("Good form")).toBeInTheDocument()
  })

  it("calls onUpdate when weight is changed", () => {
    render(<SetRow set={mockSet} {...mockCallbacks} />)
    const weightInput = screen.getByDisplayValue("80")

    fireEvent.change(weightInput, { target: { value: "85" } })

    expect(mockCallbacks.onUpdate).toHaveBeenCalledWith({
      ...mockSet,
      weight: 85,
    })
  })

  it("calls onUpdate when reps are changed", () => {
    render(<SetRow set={mockSet} {...mockCallbacks} />)
    const repsInput = screen.getByDisplayValue("10")

    fireEvent.change(repsInput, { target: { value: "12" } })

    expect(mockCallbacks.onUpdate).toHaveBeenCalledWith({
      ...mockSet,
      reps: 12,
    })
  })

  it("calls onUpdate when notes are changed", () => {
    render(<SetRow set={mockSet} {...mockCallbacks} />)
    const notesInput = screen.getByDisplayValue("Good form")

    fireEvent.change(notesInput, { target: { value: "Perfect form" } })

    expect(mockCallbacks.onUpdate).toHaveBeenCalledWith({
      ...mockSet,
      notes: "Perfect form",
    })
  })

  it("handles empty weight input", () => {
    render(<SetRow set={mockSet} {...mockCallbacks} />)
    const weightInput = screen.getByDisplayValue("80")

    fireEvent.change(weightInput, { target: { value: "" } })

    expect(mockCallbacks.onUpdate).toHaveBeenCalledWith({
      ...mockSet,
      weight: 0,
    })
  })

  it("calls onDelete with confirmation", () => {
    global.confirm = jest.fn(() => true)
    render(<SetRow set={mockSet} {...mockCallbacks} />)

    const menuButtons = screen.getAllByRole("button")
    const threeDotsButton = menuButtons.find((btn) => btn.querySelector("svg"))

    if (threeDotsButton) {
      fireEvent.click(threeDotsButton)
      const deleteButton = screen.getByText("Löschen")
      fireEvent.click(deleteButton)

      expect(mockCallbacks.onDelete).toHaveBeenCalledTimes(1)
    }
  })
})
