/**
 * @file auth.config.ts
 * @description NextAuth-Konfiguration **ohne Prisma** — für Middleware (Edge) und gemeinsame Provider/Callbacks.
 *
 * **Warum JWT (`strategy: "jwt"`)?**
 * - `middleware.ts` läuft auf der Edge **ohne** PrismaAdapter.
 * - DB-Sessions (nur Session-Token im Cookie) kann die Edge nicht in PostgreSQL nachschlagen →
 *   `JWTSessionError: Invalid Compact JWE` und `req.auth === null` → Redirect `/?authRequired=1`.
 * - JWT: signiertes Cookie, Edge + Server Actions + `/api/auth/session` lesen dieselbe Session.
 * - Prisma-Adapter in `auth.ts` bleibt für Google-Accounts (`users` / `accounts`); JWT nur für Session-Cookie.
 *
 * **Nach Auth-Änderung:** einmal abmelden und neu anmelden (alte DB-Session-Cookies sind ungültig).
 *
 * @see auth.ts — PrismaAdapter
 */

import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [Google],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        const id =
          (typeof token.id === "string" ? token.id : undefined) ??
          (typeof token.sub === "string" ? token.sub : undefined)
        if (id) {
          session.user.id = id
        }
      }
      return session
    },
  },
  pages: {},
} satisfies NextAuthConfig
