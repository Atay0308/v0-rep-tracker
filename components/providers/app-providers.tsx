/**
 * @file app-providers.tsx
 * @description Client-Provider for the whole app (Session for SWR + UserMenu).
*/
"use client"

import type { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"

export function AppProviders({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
