/**
 * Bottom navigation bar component
 */

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, Dumbbell, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Start", icon: Home },
  { href: "/history", label: "Vergangene\nEinheiten", icon: Calendar },
  { href: "/plans", label: "Trainings-\npläne", icon: Dumbbell },
  { href: "/statistics", label: "Statistik", icon: BarChart3 },
]
/**
 * description: A responive bottom navigation bar with icons and labels, highlighting the active page.
 */
export function NavigationBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border pb-safe">
      <div className="flex items-center justify-around h-20">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors",
                isActive ? "text-blue-500" : "text-gray-400 hover:text-gray-300",
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs text-center leading-tight whitespace-pre-line">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
