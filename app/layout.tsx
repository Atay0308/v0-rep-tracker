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

/**
 * SEO Metadata Configuration
 *
 * Optimized metadata for search engines and social media sharing.
 * Includes title, description, keywords, and viewport settings.
 */
export const metadata: Metadata = {
  title: "Workout Tracker - Track Your Fitness Progress",
  description:
    "A comprehensive workout tracking application to log exercises, track progress, and analyze your fitness journey. Monitor muscle groups, track max weights, and visualize your training statistics.",
  keywords: ["workout", "fitness", "exercise", "tracking", "gym", "training", "progress", "statistics", "bodybuilding"],
  authors: [{ name: "Workout Tracker" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#000000",
  manifest: "/manifest.json",
  openGraph: {
    title: "Workout Tracker - Track Your Fitness Progress",
    description: "Track your workouts, monitor progress, and achieve your fitness goals.",
    type: "website",
    locale: "de_DE",
  },
    generator: 'v0.app'
}

/**
 * Root Layout Component
 *
 * Provides the HTML structure and global styling for the entire application.
 * Includes font configuration and accessibility attributes.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-black text-white">{children}</body>
    </html>
  )
}
