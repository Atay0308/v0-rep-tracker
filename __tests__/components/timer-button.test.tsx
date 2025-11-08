/**
 * Tests for TimerButton component
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { TimerButton } from "@/components/timer-button"


describe("TimerButton", () => {
  it("should render with initial time", () => {
    render(<TimerButton initialTime={0} />)
    expect(screen.getByText("00:00")).toBeInTheDocument()
  })

  it("should start timer when clicked", async () => {
    render(<TimerButton initialTime={0} />)
    const button = screen.getByRole("button")

    fireEvent.click(button)

    await waitFor(
      () => {
        const timeText = screen.getByText(/00:0[1-9]/)
        expect(timeText).toBeInTheDocument()
      },
      { timeout: 2000 },
    )
  })

  it("should format time correctly", () => {
    render(<TimerButton initialTime={125} />)
    expect(screen.getByText("02:05")).toBeInTheDocument()
  })
})
