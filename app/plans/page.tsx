/**
 * Training plans page - displays predefined workout plans
 */

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
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <header className="relative flex items-center justify-between p-4 border-b border-gray-800">
        <h1 className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold">
          Trainingspläne
        </h1>

        <div className="flex gap-6 ml-auto">
          <button className="text-blue-500 hover:text-blue-400">
            <Plus className="w-6 h-6" />
          </button>
          <button className="text-blue-500 hover:text-blue-400">
            <Search className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Plans list */}
      <div className="p-4">
        {TRAINING_PLANS.map((plan) => (
          <button
            key={plan.id}
            className="w-full flex items-center justify-between p-4 mb-2 bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors text-left"
          >
            <span className="text-white">{plan.name}</span>
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        ))}
      </div>

      <NavigationBar />
    </div>
  )
}
