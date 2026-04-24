"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface StatisticsChartProps {
  data: Array<{ date: string; value: number }>
  title: string
  yAxisLabel?: string
}

export function StatisticsChart({ data, title, yAxisLabel = "Wert" }: StatisticsChartProps) {
  const chartData = data.map((point) => {
    const dateObj = new Date(point.date)
    return {
      date: `${dateObj.getDate().toString().padStart(2, "0")}.${(dateObj.getMonth() + 1).toString().padStart(2, "0")}`,
      value: point.value,
      fullDate: point.date,
    }
  })

  if (!data || data.length === 0) {
    return (
      <div className="stat-card mt-lg">
        <h3 className="font-medium mb-md">{title}</h3>
        <div className="loading text-muted">Keine Daten verfügbar</div>
      </div>
    )
  }

  return (
    <div className="stat-card mt-lg">
      <h3 className="font-medium mb-md">{title}</h3>
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" />
            <XAxis
              dataKey="date"
              stroke="var(--color-muted)"
              tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
            />
            <YAxis
              stroke="var(--color-muted)"
              tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
              label={{ value: yAxisLabel, angle: -90, position: "insideLeft", fill: 'var(--color-muted)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-secondary)',
                border: '1px solid var(--color-border-light)',
                borderRadius: 'var(--radius-md)',
                color: 'white',
              }}
              labelStyle={{ color: 'var(--color-muted)' }}
              itemStyle={{ color: 'var(--color-primary)' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-primary)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-primary)', r: 5, strokeWidth: 2, stroke: 'var(--color-secondary)' }}
              activeDot={{ r: 7, strokeWidth: 2, stroke: 'var(--color-secondary)' }}
              name={yAxisLabel}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
