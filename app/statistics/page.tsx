"use client"

import { useState } from "react"
import { NavigationBar } from "@/components/navigation-bar"
import dynamic from "next/dynamic"
import { useWorkouts } from "@/hooks/use-workouts"
import { MUSCLE_GROUPS } from "@/lib/exercises-data"
import {
  filterWorkoutsByPeriod,
  calculateMuscleGroupVolume,
  calculateExerciseMaxWeight,
  getUniqueExercises,
  calculateTotalWorkouts,
  calculateTotalTrainingTime,
} from "@/lib/statistics-utils"
import type { TimePeriod, GroupBy, MuscleGroup } from "@/types/workout"

const StatisticsChart = dynamic(
  () => import("@/components/statistics-chart").then((mod) => ({ default: mod.StatisticsChart })),
  {
    loading: () => (
      <div className="stat-card mt-lg">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    ),
    ssr: false,
  },
)

type Tab = "GENERAL" | "MUSCLES" | "EXERCISES"

export default function StatisticsPage() {
  const { workouts } = useWorkouts()

  const [activeTab, setActiveTab] = useState<Tab>("MUSCLES")
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("6M")
  const [groupBy, setGroupBy] = useState<GroupBy>("Week")
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup>("Brust")
  const [selectedExercise, setSelectedExercise] = useState<string>("")

  const filteredWorkouts = workouts ? filterWorkoutsByPeriod(workouts, timePeriod) : []
  const uniqueExercises = workouts ? getUniqueExercises(workouts) : []

  if (!selectedExercise && uniqueExercises.length > 0) {
    setSelectedExercise(uniqueExercises[0])
  }

  const muscleData = calculateMuscleGroupVolume(filteredWorkouts, selectedMuscle, groupBy)
  const exerciseData = selectedExercise ? calculateExerciseMaxWeight(filteredWorkouts, selectedExercise, groupBy) : []

  const totalWorkouts = workouts ? calculateTotalWorkouts(workouts) : 0
  const totalTime = workouts ? calculateTotalTrainingTime(workouts) : 0

  const tabStyle = (isActive: boolean) => ({
    padding: 'var(--spacing-sm) 0',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: isActive ? 'var(--color-primary)' : 'var(--color-muted)',
    borderBottom: isActive ? '2px solid var(--color-primary)' : 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  })

  const periodBtnStyle = (isActive: boolean) => ({
    padding: 'var(--spacing-sm) var(--spacing-md)',
    fontSize: '0.875rem',
    fontWeight: 500,
    borderRadius: 'var(--radius-md)',
    background: isActive ? 'var(--color-border-light)' : 'var(--color-card)',
    color: isActive ? 'white' : 'var(--color-muted)',
    border: 'none',
    cursor: 'pointer',
  })

  return (
    <div className="page">
      <header className="page-header" style={{ justifyContent: 'center' }}>
        <h1 className="page-title">Statistics</h1>
      </header>

      <nav style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-xl)', padding: 'var(--spacing-lg)', borderBottom: '1px solid var(--color-border)' }}>
        <button onClick={() => setActiveTab("GENERAL")} style={tabStyle(activeTab === "GENERAL")}>GENERAL</button>
        <button onClick={() => setActiveTab("MUSCLES")} style={tabStyle(activeTab === "MUSCLES")}>MUSCLES</button>
        <button onClick={() => setActiveTab("EXERCISES")} style={tabStyle(activeTab === "EXERCISES")}>EXERCISES</button>
      </nav>

      <main className="page-content">
        {activeTab === "GENERAL" && (
          <div className="flex-col gap-md">
            <div className="stat-card">
              <div className="stat-label">Gesamte Trainingseinheiten</div>
              <div className="stat-value">{totalWorkouts}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Gesamte Trainingszeit</div>
              <div className="stat-value">{Math.round(totalTime / 60)} Stunden</div>
            </div>
          </div>
        )}

        {activeTab === "MUSCLES" && (
          <div className="flex-col gap-md">
            <div className="form-group">
              <label className="form-label">Choose Muscle</label>
              <select
                value={selectedMuscle}
                onChange={(e) => setSelectedMuscle(e.target.value as MuscleGroup)}
                className="form-input"
              >
                {MUSCLE_GROUPS.map((muscle) => (
                  <option key={muscle} value={muscle}>{muscle}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Choose Metric</label>
              <select className="form-input">
                <option>Volumen pro Muskelgruppe</option>
              </select>
            </div>

            <div className="flex gap-sm">
              {(["1M", "6M", "1Y"] as TimePeriod[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  style={periodBtnStyle(timePeriod === period)}
                >
                  {period === "1M" ? "1 MONTH" : period === "6M" ? "6 MONTHS" : "1 YEAR"}
                </button>
              ))}
            </div>

            <div className="flex-between">
              <span></span>
              <div className="form-group">
                <label className="form-label text-xs">Group By</label>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as GroupBy)}
                  className="form-input form-input-sm"
                  style={{ width: 'auto' }}
                >
                  <option value="Day">Day</option>
                  <option value="Week">Week</option>
                  <option value="Month">Month</option>
                </select>
              </div>
            </div>

            {muscleData.length > 0 ? (
              <StatisticsChart data={muscleData} title={`${selectedMuscle} - Volumen (Sätze)`} yAxisLabel="Sätze" />
            ) : (
              <div className="stat-card text-center text-muted">
                Keine Daten für diese Muskelgruppe verfügbar
              </div>
            )}
          </div>
        )}

        {activeTab === "EXERCISES" && (
          <div className="flex-col gap-md">
            <div className="form-group">
              <label className="form-label">Choose Exercise</label>
              <select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="form-input"
              >
                {uniqueExercises.length > 0 ? (
                  uniqueExercises.map((exercise) => (
                    <option key={exercise} value={exercise}>{exercise}</option>
                  ))
                ) : (
                  <option value="">Keine Übungen verfügbar</option>
                )}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Choose Metric</label>
              <select className="form-input">
                <option>Maximalgewichte-Fortschritt</option>
              </select>
            </div>

            <div className="flex gap-sm">
              {(["1M", "6M", "1Y"] as TimePeriod[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  style={periodBtnStyle(timePeriod === period)}
                >
                  {period === "1M" ? "1 MONTH" : period === "6M" ? "6 MONTHS" : "1 YEAR"}
                </button>
              ))}
            </div>

            <div className="flex-between">
              <span></span>
              <div className="form-group">
                <label className="form-label text-xs">Group By</label>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as GroupBy)}
                  className="form-input form-input-sm"
                  style={{ width: 'auto' }}
                >
                  <option value="Day">Day</option>
                  <option value="Week">Week</option>
                  <option value="Month">Month</option>
                </select>
              </div>
            </div>

            {exerciseData.length > 0 ? (
              <StatisticsChart
                data={exerciseData}
                title={`${selectedExercise} - Maximalgewicht (kg)`}
                yAxisLabel="Gewicht (kg)"
              />
            ) : (
              <div className="stat-card text-center text-muted">
                Keine Daten für diese Übung verfügbar
              </div>
            )}
          </div>
        )}
      </main>

      <NavigationBar />
    </div>
  )
}
