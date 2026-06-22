/**
 * @file use-workout-session.ts
 * @description Custom hook to manage workout session state, including authentication status and 
 * SWR cache key generation based on session state.
*/
"use client"

import { useSession } from "next-auth/react"

export function useWorkoutSession() {
  const { data: session, status } = useSession()

  return {
    session,
    /** Session wird noch geladen: UI zeigt Loader. */
    isSessionLoading: status === "loading",
    /** Client: eingeloggt laut NextAuth (Name in Sidebar). */
    isAuthenticated: status === "authenticated",
    /** Server Actions brauchen `session.user.id`: gleiche Session, nach jwt/session-Callback. */
    hasUserId: !!session?.user?.id,
    isUnauthenticated: status === "unauthenticated",
  }
}

/**
 * Gibt den SWR-Cache-Key zurück oder `null`, wenn kein Fetch laufen soll.
 */
export function useWorkoutSwrKey(key: string | null): string | null {
  const { isSessionLoading, isAuthenticated, hasUserId } = useWorkoutSession()
  if (isSessionLoading || !isAuthenticated || !hasUserId) return null
  return key
}
