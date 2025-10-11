/**
 * HomePage Component
 *
 * Main landing page of the workout tracker application.
 * Displays:
 * - Current date and week calendar
 * - Start/Continue workout button
 * - Last 3 completed workouts in horizontal scrollable layout
 *
 * Features:
 * - Detects if there's an active workout and changes button text accordingly
 * - Horizontal scrolling for workout cards on mobile
 * - Real-time data fetching with SWR
 */

"use client"

import { Plus } from "lucide-react"
import Link from "next/link"
import { WeekCalendar } from "@/components/week-calendar"
import { WorkoutCard } from "@/components/workout-card"
import { NavigationBar } from "@/components/navigation-bar"
import { useActiveWorkout, useRecentWorkouts } from "@/hooks/use-workouts"
import { formatDateLong } from "@/lib/date-utils"

export default function HomePage() {
  // Fetch active workout to determine button state
  const { activeWorkout, isLoading: activeLoading } = useActiveWorkout()
  // Fetch last 3 completed workouts
  const { recentWorkouts, isLoading: recentLoading } = useRecentWorkouts(3)

  const today = new Date()

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header with formatted date */}
      <header className="p-6">
        <div className="text-gray-400 text-sm mb-1">{formatDateLong(today).split(",")[0]}</div>
        <h1 className="text-2xl font-bold text-white">{formatDateLong(today).split(",")[1]}</h1>
      </header>

      {/* Week Calendar - shows current week with today highlighted */}
      <div className="px-6 mb-8">
        <WeekCalendar />
      </div>

      {/* Start/Continue Workout Button - changes based on active workout status */}
      <div className="px-6 mb-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">
            {activeWorkout ? "Training fortsetzen" : "Neues Training\nstarten"}
          </h2>
          <Link
            href={activeWorkout ? `/workout/${activeWorkout.id}` : "/workout/new"}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-10 h-10 text-white" />
          </Link>
        </div>
      </div>

      {/* Recent Workouts - horizontal scrollable layout */}
      <div className="px-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Letzten 3 Trainingseinheiten</h3>

        {recentLoading ? (
          <div className="text-gray-400 text-center py-8">Laden...</div>
        ) : recentWorkouts && recentWorkouts.length > 0 ? (
          <div className="flex justify-center">
            <div className="overflow-x-auto pb-4 max-w-full">
              <div className="flex gap-4 justify-center">
                {recentWorkouts.map((workout) => (
                  <div key={workout.id} className="w-80 flex-shrink-0">
                    <WorkoutCard workout={workout} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8">Noch keine Trainingseinheiten</div>
        )}
      </div>

      <NavigationBar />
    </div>
  )
}
