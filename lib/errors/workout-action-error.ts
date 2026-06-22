/**
 * @file workout-action-error.ts
 * @description Strukturierte Fehler für Workout-Server-Actions und Repository.
 *
 * **Warum eigene Fehlerklasse?**
 * - Client kann anhand von `code` passende UI zeigen (Login, 404, Retry).
 * - Klare Trennung von generischen `Error`-Meldungen in der DB-Schicht.
 *
 * **Server-only** beim Werfen; `formatWorkoutError` auf dem Client wertet
 * `message` / `name` aus (serialisierte Actions liefern oft nur Message-String).
 */

/** Bekannte Fehlercodes für Workout-Operationen. */
export type WorkoutErrorCode =
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "VALIDATION"
  | "FORBIDDEN"
  | "UNKNOWN"

export class WorkoutActionError extends Error {
  readonly code: WorkoutErrorCode

  constructor(code: WorkoutErrorCode, message: string) {
    super(message)
    this.name = "WorkoutActionError"
    this.code = code
  }
}

/** Nicht eingeloggt — Session fehlt oder abgelaufen. */
export function unauthorizedError(): WorkoutActionError {
  return new WorkoutActionError(
    "UNAUTHORIZED",
    "Du musst eingeloggt sein, um auf Trainings zuzugreifen.",
  )
}

/** Workout existiert nicht oder gehört einem anderen User. */
export function workoutNotFoundError(): WorkoutActionError {
  return new WorkoutActionError("NOT_FOUND", "Training nicht gefunden.")
}

/** Ungültige Eingaben (z. B. unbekannte Muskelgruppe). */
export function validationError(message: string): WorkoutActionError {
  return new WorkoutActionError("VALIDATION", message)
}
