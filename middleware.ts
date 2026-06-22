/**
 * @file middleware.ts
 * @description Schützt Workout-Routen — nur eingeloggte User.
 *
 * **Wichtig:** Importiert nur `auth.config.ts`, **nicht** `auth.ts` / Prisma.
 * Edge-Middleware kann keinen PrismaClient laden (`node:path` Fehler).
 */

import NextAuth from "next-auth"
import { authConfig } from "@/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl

  const isProtected =
    pathname.startsWith("/workout") || pathname === "/history" || pathname === "/statistics"

  if (isProtected && !req.auth) {
    const home = new URL("/", req.nextUrl.origin)
    home.searchParams.set("authRequired", "1")
    return NextResponse.redirect(home)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/workout/:path*", "/history", "/statistics"],
}
