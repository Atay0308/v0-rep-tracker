/**
 * @file exercise-repository.ts
 * @description Serverseitige Hilfen für die globale `Exercise`-Tabelle.
 *
 * **Warum getrennt vom Workout-Repository?**
 * - `WorkoutExercise` verknüpft nur per `exerciseId`; die UI sendet `exerciseName` + `muscleGroup`.
 * - Vor dem Anlegen einer Workout-Übung muss eine passende `Exercise`-Zeile existieren
 *   (Seed-Muskeln oder nutzerspezifische Übung).
 *
 * **Server-only** — importiert Prisma-Client.
 */

import "server-only"

import { prisma } from "@/prisma/prisma"
import { validationError } from "@/lib/errors/workout-action-error"

/**
 * Sucht eine Übung nach Name + Muskelgruppe oder legt sie an.
 *
 * @param name — Anzeigename (z. B. „Bankdrücken“)
 * @param muscleGroup — Muskelname wie in `Muscle.name` (z. B. „Brust“)
 * @param userId — Besitzer für Custom-Übungen; wird in `Exercise.userId` gespeichert
 */
export async function findOrCreateExerciseId(
  name: string,
  muscleGroup: string,
  userId: string,
): Promise<string> {
  const muscle = await prisma.muscle.findUnique({
    where: { name: muscleGroup },
  })

  if (!muscle) {
    throw validationError(`Muskelgruppe nicht gefunden: ${muscleGroup}`)
  }

  const existing = await prisma.exercise.findFirst({
    where: {
      name,
      muscleId: muscle.id,
      OR: [{ userId: null }, { userId }],
    },
  })

  if (existing) {
    return existing.id
  }

  const created = await prisma.exercise.create({
    data: {
      name,
      muscleId: muscle.id,
      userId,
    },
  })

  return created.id
}
