/**
 * Erweitert NextAuth-Session um `user.id` (gesetzt in auth.ts session callback).
 * Wird von Server Actions in `requireUserId()` verwendet.
 */
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
  }
}
