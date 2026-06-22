/**
 * @file prisma.ts
 * @description Singleton PrismaClient (Server only) mit Prisma Accelerate Extension.
 *
 * **Accelerate:** Query-Caching / Connection-Pooling über `@prisma/extension-accelerate`.
 * Sinnvoll mit Prisma-Accelerate-URL; mit lokalem `postgresql://` bleibt die Extension
 * aktiv (wie von dir gewünscht) — bei Problemen nur lokal die URL prüfen.
 */

import "server-only"

import { PrismaClient } from "../generated/prisma/client"
import { withAccelerate } from "@prisma/extension-accelerate"
import { PrismaPg } from "@prisma/adapter-pg"

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL ist nicht gesetzt")
  }
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter }).$extends(withAccelerate())
}

type PrismaWithAccelerate = ReturnType<typeof createPrismaClient>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaWithAccelerate
}

export const prisma: PrismaWithAccelerate =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
