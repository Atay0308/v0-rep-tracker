"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface StatisticsChartProps {
  /** Array of data points with date and value */
  data: Array<{ date: string; value: number }>
  /** Title displayed above the chart */
  title: string
  /** Label for the Y-axis (e.g., "Gewicht (kg)", "Sätze") */
  yAxisLabel?: string
}

/**
 * StatisticsChart Component
 *
 * Displays a line chart for workout statistics using Recharts library.
 * Shows progression over time for muscle groups or exercises with customizable metrics.
 *
 * @param data - Array of data points containing date and value
 * @param title - Chart title displayed above the visualization
 * @param yAxisLabel - Optional label for the Y-axis
 *
 * @example
 * ```tsx
 * <StatisticsChart
 *   data={[{ date: "2025-01-01", value: 50 }]}
 *   title="Bench Press - Max Weight"
 *   yAxisLabel="Weight (kg)"
 * />
 * ```
 */
export function StatisticsChart({ data, title, yAxisLabel = "Wert" }: StatisticsChartProps) {
  // Transform data to display format with short date labels
  const chartData = data.map((point) => {
    const dateObj = new Date(point.date)
    return {
      date: `${dateObj.getDate().toString().padStart(2, "0")}.${(dateObj.getMonth() + 1).toString().padStart(2, "0")}`,
      value: point.value,
      fullDate: point.date,
    }
  })

  console.log("[v0] Chart data:", chartData)
  console.log("[v0] Chart rendering with", chartData.length, "data points")

  // Show empty state if no data available
  if (!data || data.length === 0) {
    console.log("-------No Data-------------------");
    return (
      <div className="bg-gray-900 rounded-2xl p-4 mt-6" role="region" aria-label="Statistik ohne Daten">
        <h3 className="text-white font-medium mb-4">{title}</h3>
        <div className="h-[300px] flex items-center justify-center text-gray-400">Keine Daten verfügbar</div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-4 mt-6" role="region" aria-label={`Statistik: ${title}`}>
      <h3 className="text-white font-medium mb-4">{title}</h3>
      <div className="w-full" style={{ height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            aria-label={`Liniendiagramm für ${title}`}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              label={{ value: "Datum", position: "insideBottom", offset: -5, fill: "#9ca3af" }}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              label={{ value: yAxisLabel, angle: -90, position: "insideLeft", fill: "#9ca3af" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#fff",
              }}
              labelStyle={{ color: "#9ca3af" }}
              itemStyle={{ color: "#3b82f6" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", r: 5, strokeWidth: 2, stroke: "#1f2937" }}
              activeDot={{ r: 7, strokeWidth: 2, stroke: "#1f2937" }}
              name={yAxisLabel}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
