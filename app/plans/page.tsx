"use client"

import { ArrowLeft, Plus, Search, MoreVertical } from "lucide-react"
import { useRouter } from "next/navigation"
import { NavigationBar } from "@/components/navigation-bar"

const TRAINING_PLANS = [
  { id: "1", name: "Oberkörper", category: "Split" },
  { id: "2", name: "Unterkörper", category: "Split" },
  { id: "3", name: "Ganzkörper", category: "Full Body" },
  { id: "4", name: "Push", category: "Push/Pull/Legs" },
  { id: "5", name: "Pull", category: "Push/Pull/Legs" },
  { id: "6", name: "Beine", category: "Push/Pull/Legs" },
]

export default function PlansPage() {
  const router = useRouter()

  return (
    <div className="page">
      <header className="page-header">
        <button onClick={() => router.push("/")} className="btn btn-ghost btn-icon">
          <ArrowLeft style={{ width: '1.5rem', height: '1.5rem' }} />
        </button>
        <h1 className="page-title">Trainingspläne</h1>
        <div className="flex gap-sm">
          <button className="btn btn-ghost btn-icon">
            <Plus style={{ width: '1.5rem', height: '1.5rem' }} />
          </button>
          <button className="btn btn-ghost btn-icon">
            <Search style={{ width: '1.5rem', height: '1.5rem' }} />
          </button>
        </div>
      </header>

      <div className="page-content">
        <div className="exercise-list">
          {TRAINING_PLANS.map((plan) => (
            <button key={plan.id} className="exercise-item" style={{ textAlign: 'left' }}>
              <span style={{ flex: 1 }}>{plan.name}</span>
              <MoreVertical style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-muted)' }} />
            </button>
          ))}
        </div>
      </div>

      <NavigationBar />
    </div>
  )
}
