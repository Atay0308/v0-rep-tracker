/**
 * @file workout-page-state.tsx
 * @description Displays loading, error and auth states for workout related pages.rr
 */

"use client"

import Link from "next/link"
import SignIn from "@/components/sign-in"

/** Spinner + Text — während SWR/Session lädt. */
export function WorkoutLoadingScreen({ message = "Laden…" }: { message?: string }) {
  return (
    <div
      className="min-h-screen bg-background text-foreground flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  )
}

/** Fehler mit optionalem Retry (z. B. SWR `mutate`). */
export function WorkoutErrorPanel({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <p className="text-red-400 mb-4">{message}</p>
        <div className="flex flex-col gap-3 items-center">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white"
            >
              Erneut versuchen
            </button>
          )}
          <Link href="/" className="text-blue-500 hover:text-blue-400 text-sm">
            Zur Startseite
          </Link>
        </div>
      </div>
    </div>
  )
}

/** Training-ID unbekannt oder gelöscht. */
export function WorkoutNotFoundPanel() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="text-xl font-semibold mb-2">Training nicht gefunden</h1>
        <p className="text-gray-400 mb-6">
          Dieses Training existiert nicht oder du hast keinen Zugriff darauf.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  )
}

/**
 * Hinweis wenn Workout-Daten Session brauchen (Home, geschützte Bereiche).
 * Zeigt Google-Login aus {@link SignIn}.
 */
export function WorkoutAuthPrompt({
  title = "Anmeldung erforderlich",
  description = "Melde dich an, um Trainings zu starten und deinen Verlauf zu sehen.",
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 text-center">
      <h2 className="text-lg font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <div className="flex justify-center">
        <SignIn />
      </div>
    </div>
  )
}

/** Kompakter Hinweis-Banner (z. B. nach Middleware-Redirect). */
export function WorkoutAuthBanner() {
  return (
    <div
      className="mx-6 mb-4 rounded-xl bg-amber-900/40 border border-amber-700/50 px-4 py-3 text-amber-100 text-sm text-center"
      role="alert"
    >
      Bitte melde dich an, um diese Seite zu nutzen.
    </div>
  )
}
