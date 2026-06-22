/**
 * @file format-workout-error.ts
 * @description User-sichtbare Fehlermeldungen für Workout-Actions (Client + Server).
 *
 * Darf von `"use client"`-Komponenten importiert werden — keine Server-Only-Imports.
 */

import type { WorkoutErrorCode } from "@/lib/errors/workout-action-error"

const CODE_MESSAGES: Record<WorkoutErrorCode, string> = {
  UNAUTHORIZED: "Bitte melde dich an, um fortzufahren.",
  NOT_FOUND: "Dieses Training wurde nicht gefunden.",
  VALIDATION: "Die Eingabe ist ungültig. Bitte prüfe deine Daten.",
  FORBIDDEN: "Du hast keinen Zugriff auf dieses Training.",
  UNKNOWN: "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.",
}

/** Erkennt bekannte Codes in Action-Fehlermeldungen (Fallback-Heuristik). */
function inferCodeFromMessage(message: string): WorkoutErrorCode | null {
  const lower = message.toLowerCase()
  if (lower.includes("unauthorized") || lower.includes("eingeloggt")) return "UNAUTHORIZED"
  if (lower.includes("nicht gefunden") || lower.includes("not found")) return "NOT_FOUND"
  if (lower.includes("muskelgruppe") || lower.includes("ungültig")) return "VALIDATION"
  if (lower.includes("kein zugriff")) return "FORBIDDEN"
  return null
}

/**
 * Wandelt einen gefangenen Fehler (SWR, Server Action, fetch) in deutschen UI-Text um.
 */
export function formatWorkoutError(error: unknown): string {
  if (error instanceof Error) {
    if (error.name === "WorkoutActionError" && "code" in error) {
      const code = (error as { code: WorkoutErrorCode }).code
      return CODE_MESSAGES[code] ?? error.message
    }
    const inferred = inferCodeFromMessage(error.message)
    if (inferred) return CODE_MESSAGES[inferred]
    if (error.message) return error.message
  }
  return CODE_MESSAGES.UNKNOWN
}

/** Ob der Fehler ein Login erfordert (z. B. für Auth-Prompt statt Retry). */
export function isWorkoutAuthError(error: unknown): boolean {
  if (error instanceof Error) {
    if (error.name === "WorkoutActionError" && "code" in error) {
      return (error as { code: WorkoutErrorCode }).code === "UNAUTHORIZED"
    }
    return inferCodeFromMessage(error.message) === "UNAUTHORIZED"
  }
  return false
}
