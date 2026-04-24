import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Workout Tracker - Track Your Fitness Progress",
  description:
    "A comprehensive workout tracking application to log exercises, track progress, and analyze your fitness journey.",
  keywords: ["workout", "fitness", "exercise", "tracking", "gym", "training", "progress"],
  authors: [{ name: "Workout Tracker" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#000000",
  openGraph: {
    title: "Workout Tracker - Track Your Fitness Progress",
    description: "Track your workouts, monitor progress, and achieve your fitness goals.",
    type: "website",
    locale: "de_DE",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" style={{ fontFamily: 'var(--font-sans)' }}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
