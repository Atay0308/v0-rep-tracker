/**
 * @file auth.ts
 * @description NextAuth-Instanz mit Prisma-Adapter (nur Node.js / Server).
 *
 * **Nicht** in Middleware importieren — dort nur {@link authConfig} aus `auth.config.ts`.
 */

import "server-only"

import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma/prisma"
import { authConfig } from "@/auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma as never),
})
