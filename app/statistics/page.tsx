/**
 * Statistics Page
 *
 * Displays comprehensive workout statistics with three tabs:
 * - GENERAL: Overall workout count and training time
 * - MUSCLES: Volume tracking per muscle group
 * - EXERCISES: Max weight progression per exercise
 *
 * Features time period filtering, grouping options, and interactive charts.
 */

"use client"
import dynamic from "next/dynamic"
import { useState, useEffect } from "react"
import { NavigationBar } from "@/components/navigation-bar"
//import { StatisticsChart } from "@/components/statistics-chart"
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
import { cn } from "@/lib/utils"
import { formatWorkoutError } from "@/lib/format-workout-error"
import { WorkoutLoadingScreen } from "@/components/workout/workout-page-state"

type Tab = "GENERAL" | "MUSCLES" | "EXERCISES"


// Lazy load StatisticsChart. Recharts wird erst geladen, wenn Chart gerendert wird
const StatisticsChart = dynamic(() => import("@/components/statistics-chart").then(mod => ({ default: mod.StatisticsChart })), {
  ssr: false, // Recharts funktioniert besser ohne SSR
})

/**
 * Statistics page component with tabbed interface for different stat views
 */
export default function StatisticsPage() {
  const { workouts, isLoading, isError, error, mutate } = useWorkouts()

  const [activeTab, setActiveTab] = useState<Tab>("GENERAL")
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("6M")
  const [groupBy, setGroupBy] = useState<GroupBy>("Week")
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | "">("")
  const [selectedExercise, setSelectedExercise] = useState<string>("")

  const filteredWorkouts = workouts ? filterWorkoutsByPeriod(workouts, timePeriod) : []
  const uniqueExercises = workouts ? getUniqueExercises(workouts) : []

  // Standard-Übung setzen, sobald Daten da sind, nicht während des Renders.
  useEffect(() => {
    if (!selectedExercise && uniqueExercises.length > 0) {
      setSelectedExercise(uniqueExercises[0])
    }
  }, [selectedExercise, uniqueExercises])

  const muscleData = calculateMuscleGroupVolume(filteredWorkouts, selectedMuscle, groupBy)
  const exerciseData = selectedExercise
    ? calculateExerciseMaxWeight(filteredWorkouts, selectedExercise, groupBy)
    : []

  const totalWorkouts = workouts ? calculateTotalWorkouts(workouts) : 0
  const totalTime = workouts ? calculateTotalTrainingTime(workouts) : 0

  if (isLoading) {
    return <WorkoutLoadingScreen message="Statistiken werden geladen…" />
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4">{formatWorkoutError(error)}</p>
          <button
            type="button"
            onClick={() => mutate()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header with page title */}
      <header className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-center">Statistics</h1>
      </header>

      {/* Tab navigation for different stat views */}
      <nav
        className="flex justify-center gap-8 p-6 border-b border-gray-800"
        role="tablist"
        aria-label="Statistik-Tabs"
      >
        <button
          onClick={() => setActiveTab("GENERAL")}
          role="tab"
          aria-selected={activeTab === "GENERAL"}
          aria-controls="general-panel"
          className={cn(
            "text-sm font-medium pb-2 transition-colors",
            activeTab === "GENERAL" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400",
          )}
        >
          GENERAL
        </button>
        <button
          onClick={() => setActiveTab("MUSCLES")}
          role="tab"
          aria-selected={activeTab === "MUSCLES"}
          aria-controls="muscles-panel"
          className={cn(
            "text-sm font-medium pb-2 transition-colors",
            activeTab === "MUSCLES" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400",
          )}
        >
          MUSCLES
        </button>
        <button
          onClick={() => setActiveTab("EXERCISES")}
          role="tab"
          aria-selected={activeTab === "EXERCISES"}
          aria-controls="exercises-panel"
          className={cn(
            "text-sm font-medium pb-2 transition-colors",
            activeTab === "EXERCISES" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400",
          )}
        >
          EXERCISES
        </button>
      </nav>

      {/* Content area with tab panels */}
      <main className="p-6">
        {/* General Tab - Overall statistics */}
        {activeTab === "GENERAL" && (
          <div id="general-panel" role="tabpanel" aria-labelledby="general-tab" className="space-y-6">
            <section className="bg-gray-900 rounded-2xl p-6" aria-label="Gesamte Trainingseinheiten">
              <h3 className="text-gray-400 text-sm mb-2">Gesamte Trainingseinheiten</h3>
              <p className="text-4xl font-bold text-white">{totalWorkouts}</p>
            </section>
            <section className="bg-gray-900 rounded-2xl p-6" aria-label="Gesamte Trainingszeit">
              <h3 className="text-gray-400 text-sm mb-2">Gesamte Trainingszeit</h3>
              <p className="text-4xl font-bold text-white">{Math.round(totalTime / 60)} Stunden</p>
            </section>
          </div>
        )}

        {/* Muscles Tab - Muscle group volume tracking */}
        {activeTab === "MUSCLES" && (
          <div id="muscles-panel" role="tabpanel" aria-labelledby="muscles-tab" className="space-y-6">
            {/* Muscle group selector */}
            <div>
              <label htmlFor="muscle-select" className="text-gray-400 text-sm mb-2 block">
                Choose Muscle
              </label>
              <select
                id="muscle-select"
                value={selectedMuscle}
                onChange={(e) => setSelectedMuscle(e.target.value as MuscleGroup | "")}
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Muskelgruppe auswählen"
              >
                {MUSCLE_GROUPS.map((muscle) => (
                  <option key={muscle} value={muscle}>
                    {muscle}
                  </option>
                ))}
              </select>
            </div>

            {/* Metric selector */}
            <div>
              <label htmlFor="muscle-metric-select" className="text-gray-400 text-sm mb-2 block">
                Choose Metric
              </label>
              <select
                id="muscle-metric-select"
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Metrik auswählen"
              >
                <option>Volumen pro Muskelgruppe</option>
              </select>
            </div>

            {/* Time period filter buttons */}
            <div className="flex gap-2" role="group" aria-label="Zeitraum auswählen">
              {(["1M", "6M", "1Y"] as TimePeriod[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
                    timePeriod === period ? "bg-gray-700 text-white" : "bg-gray-900 text-gray-400",
                  )}
                  aria-pressed={timePeriod === period}
                >
                  {period === "1M" ? "1 MONTH" : period === "6M" ? "6 MONTHS" : "1 YEAR"}
                </button>
              ))}
            </div>

            {/* Group by selector */}
            <div className="flex justify-end">
              <div>
                <label htmlFor="muscle-groupby-select" className="text-gray-400 text-xs mb-1 block">
                  Group By
                </label>
                <select
                  id="muscle-groupby-select"
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as GroupBy)}
                  className="px-3 py-1 bg-gray-900 text-white rounded-lg border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Gruppierung auswählen"
                >
                  <option value="Day">Day</option>
                  <option value="Week">Week</option>
                  <option value="Month">Month</option>
                </select>
              </div>
            </div>

            {/* Chart visualization */}
            {muscleData.length > 0 ? (
              <StatisticsChart data={muscleData} title={`${selectedMuscle} - Volumen (Sätze)`} yAxisLabel="Sätze" />
            ) : (
              <div className="bg-gray-900 rounded-2xl p-6 text-center text-gray-400" role="status">
                Keine Daten für diese Muskelgruppe verfügbar
              </div>
            )}
          </div>
        )}

        {/* Exercises Tab - Exercise max weight progression */}
        {activeTab === "EXERCISES" && (
          <div id="exercises-panel" role="tabpanel" aria-labelledby="exercises-tab" className="space-y-6">
            {/* Exercise selector */}
            <div>
              <label htmlFor="exercise-select" className="text-gray-400 text-sm mb-2 block">
                Choose Exercise
              </label>
              <select
                id="exercise-select"
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Übung auswählen"
              >
                {uniqueExercises.length > 0 ? (
                  uniqueExercises.map((exercise) => (
                    <option key={exercise} value={exercise}>
                      {exercise}
                    </option>
                  ))
                ) : (
                  <option value="">Keine Übungen verfügbar</option>
                )}
              </select>
            </div>

            {/* Metric selector */}
            <div>
              <label htmlFor="exercise-metric-select" className="text-gray-400 text-sm mb-2 block">
                Choose Metric
              </label>
              <select
                id="exercise-metric-select"
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Metrik auswählen"
              >
                <option>Maximalgewichte-Fortschritt</option>
              </select>
            </div>

            {/* Time period filter buttons */}
            <div className="flex gap-2" role="group" aria-label="Zeitraum auswählen">
              {(["1M", "6M", "1Y"] as TimePeriod[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
                    timePeriod === period ? "bg-gray-700 text-white" : "bg-gray-900 text-gray-400",
                  )}
                  aria-pressed={timePeriod === period}
                >
                  {period === "1M" ? "1 MONTH" : period === "6M" ? "6 MONTHS" : "1 YEAR"}
                </button>
              ))}
            </div>

            {/* Group by selector */}
            <div className="flex justify-end">
              <div>
                <label htmlFor="exercise-groupby-select" className="text-gray-400 text-xs mb-1 block">
                  Group By
                </label>
                <select
                  id="exercise-groupby-select"
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as GroupBy)}
                  className="px-3 py-1 bg-gray-900 text-white rounded-lg border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Gruppierung auswählen"
                >
                  <option value="Day">Day</option>
                  <option value="Week">Week</option>
                  <option value="Month">Month</option>
                </select>
              </div>
            </div>

            {/* Chart visualization */}
            {exerciseData.length > 0 ? (
              <StatisticsChart
                data={exerciseData}
                title={`${selectedExercise} - Maximalgewicht (kg)`}
                yAxisLabel="Gewicht (kg)"
              />
            ) : (
              <div className="bg-gray-900 rounded-2xl p-6 text-center text-gray-400" role="status">
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
