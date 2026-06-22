"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Timer, Pause } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimerButtonProps {
  initialTime?: number
  onComplete?: () => void
  onTimeChange?: (time: number) => void
}
/**
 * description: A timer button that starts counting when clicked. 
 */
export function TimerButton({ initialTime = 0, onComplete, onTimeChange }: TimerButtonProps) {
  const [time, setTime] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const onTimeChangeRef = useRef(onTimeChange)

  useEffect(() => {
    onTimeChangeRef.current = onTimeChange
  }, [onTimeChange])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      // Save time when timer stops using ref
      if (time > 0 && onTimeChangeRef.current) {
        onTimeChangeRef.current(time)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, time])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleClick = () => {
    if (!isRunning && time === 0) {
      setIsRunning(true)
    } else if (isRunning) {
      setIsRunning(false)
    } else {
      setIsRunning(true)
    }
  }

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsRunning(false)
    setTime(0)
    if (onTimeChangeRef.current) {
      onTimeChangeRef.current(0)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-full transition-colors",
        isRunning ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-300",
      )}
    >
      {isRunning ? <Pause className="w-4 h-4" /> : <Timer className="w-4 h-4" />}
      <span className="text-sm font-mono">{formatTime(time)}</span>
    </button>
  )
}
