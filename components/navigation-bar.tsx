"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, Dumbbell, BarChart3 } from "lucide-react"

const navItems = [
  { href: "/", label: "Start", icon: Home },
  { href: "/history", label: "Vergangene\nEinheiten", icon: Calendar },
  { href: "/plans", label: "Trainings-\npläne", icon: Dumbbell },
  { href: "/statistics", label: "Statistik", icon: BarChart3 },
]

export function NavigationBar() {
  const pathname = usePathname()

  return (
    <nav className="nav-bar">
      <div className="nav-bar-inner">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <Icon className="nav-item-icon" />
              <span className="nav-item-label">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
