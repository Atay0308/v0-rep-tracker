import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Sidebar from "../components/SideBar/side-bar"

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
 * Viewport Configuration
 *
 * Defines the viewport settings for responsive design.
 */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
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
      <body className="bg-black text-white">
        <Sidebar />
        {children}
      </body>
    </html>
  )
}
