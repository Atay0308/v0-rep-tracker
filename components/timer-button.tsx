"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Timer, Pause } from "lucide-react"

interface TimerButtonProps {
  initialTime?: number
  onComplete?: () => void
  onTimeChange?: (time: number) => void
}

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

  return (
    <button
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        borderRadius: 'var(--radius-full)',
        backgroundColor: isRunning ? 'var(--color-primary)' : 'var(--color-secondary)',
        color: isRunning ? 'white' : 'var(--color-muted-light)',
        border: 'none',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
      }}
    >
      {isRunning ? (
        <Pause style={{ width: '1rem', height: '1rem' }} />
      ) : (
        <Timer style={{ width: '1rem', height: '1rem' }} />
      )}
      <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
        {formatTime(time)}
      </span>
    </button>
  )
}
