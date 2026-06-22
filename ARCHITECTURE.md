# Workout Tracker — Architecture

## Overview

Full-stack Next.js App (App Router, TypeScript, Tailwind CSS) with **PostgreSQL + Prisma** for persistence, **NextAuth** for authentication, and **SWR** for client-side caching. Workout data crosses a strict **DB ↔ UI boundary** via converters and Server Actions.

## Technology Stack

| Layer | Technology |
|--------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL + Prisma 7 |
| Auth | NextAuth v5 (Google) + `@auth/prisma-adapter` |
| Data fetching (client) | SWR |
| Charts | Recharts |
| Testing | Jest + React Testing Library |

> **Removed:** JSON Server and `localStorage` fallbacks for workouts (replaced by Prisma + Server Actions).

---

## Data architecture (Phases 1 & 2)

### Boundary pattern

The UI never imports Prisma. All database access runs on the server.

```
PostgreSQL
    ↓
Prisma Client (prisma/prisma.ts)
    ↓
lib/db/workout-repository.ts     ← queries + nested sync (server-only)
    ↓
lib/converters.ts                ← Prisma ↔ WorkoutUI
    ↓
app/actions/workout-actions.ts   ← "use server", auth() → userId, Client-Aliase (getWorkouts, …)
    ↓
hooks/use-workouts.ts + Pages    ← WorkoutUI only
```

### UI types (`types/workout.ts`)

| Type | Purpose |
|------|---------|
| `WorkoutUI` | Full workout for lists, detail, forms |
| `WorkoutExerciseUI` | Exercise in a session (`exerciseName`, `muscleGroup` denormalized) |
| `ExerciseSetUI` | Single set (weight, reps, breakTime, …) |

**Date/time:** UI uses `startDate` + `startTime` (and optional `endDate` + `endTime`) as strings. Prisma stores `startTime` / `endTime` as `DateTime`.

**Rule:** In `"use client"` files, import only from `@/types/workout`, never from `@/generated/prisma`.

### Phase 1 — Converters & query shape

| File | Role |
|------|------|
| `lib/db/workout-include.ts` | Shared `WORKOUT_WITH_RELATIONS_INCLUDE` + `WorkoutWithRelations` type |
| `lib/converters.ts` | `prismaWorkoutToUIWorkout`, `workoutUIToPrismaPatch`, date/time helpers, set field mapping |

**Why `workout-include.ts`?** Repository and converters must load the same relations (exercises → sets → exercise → muscle) so `exerciseName` / `muscleGroup` are always available in the UI.

### Phase 2 — Repository, Server Actions, client API

| File | Role |
|------|------|
| `lib/db/exercise-repository.ts` | `findOrCreateExerciseId` — resolves UI names to `Exercise` rows |
| `lib/db/workout-repository.ts` | CRUD, ownership checks, `syncWorkoutExercises` / `syncExerciseSets` |
| `app/actions/workout-actions.ts` | Public server API; `requireUserId()` from session |
| `auth.config.ts` | NextAuth ohne Prisma — **nur** für Middleware (Edge) |
| `auth.ts` | NextAuth + PrismaAdapter — Server / API routes |

**Security:** `userId` is never taken from the client payload. Every repository call is scoped with `where: { userId }` or `assertWorkoutOwned`.

**Nested updates:** When `updateWorkout` receives `exercises`, the repository syncs creates/updates/deletes for workout exercises and sets. Temporary client IDs (e.g. `ex-173…`) are treated as new rows.

### Server Actions (public API)

| Action | Description |
|--------|-------------|
| `getWorkoutsAction` | All workouts for current user |
| `getWorkoutAction(id)` | Single workout |
| `getActiveWorkoutAction` | Active workout or `null` |
| `getRecentWorkoutsAction(limit)` | Last completed workouts |
| `createWorkoutAction(input)` | Create; returns existing active if one exists |
| `updateWorkoutAction(id, patch)` | Partial update + optional full `exercises` |
| `deleteWorkoutAction(id)` | Delete with ownership check |

Client code imports `getWorkouts`, `getWorkout`, … from `app/actions/workout-actions.ts` (aliases without `Action` suffix).

---

## Data flow (current)

```
User Action (Client Component)
    ↓
SWR mutate / await getWorkout() / updateWorkout()
    ↓  (SWR key null if not authenticated)
app/actions/workout-actions.ts
    ↓
Server Action (runs on server)
    ↓
auth() → userId  →  WorkoutActionError if missing
    ↓
workout-repository → prisma
    ↓
converters → WorkoutUI JSON
    ↓
SWR cache update → re-render
    ↓ on error: formatWorkoutError → WorkoutErrorPanel
```

---

## Prisma schema (workout-related)

- **Workout** — session header (`startTime`, `endTime`, `isActive`, `userId`)
- **WorkoutExercise** — link to global **Exercise**, `order`, nested **ExerciseSet**
- **Exercise** + **Muscle** — canonical names (seeded muscle groups)

---

## UI models (DTOs), Mapper, and IDs

### Begriffe

| Begriff | Bei uns | Datei |
|---------|---------|--------|
| **DTO / UI-Modell** | `WorkoutUI`, `WorkoutExerciseUI`, `ExerciseSetUI` | `types/workout.ts` |
| **DB-Entity** | Prisma `Workout`, `WorkoutExercise`, `ExerciseSet`, … | `prisma/schema.prisma` |
| **Mapper** | `prismaWorkoutToUIWorkout`, `workoutUIToPrismaPatch`, … | `lib/converters.ts` |

Alle UI-Typen haben ein Feld **`id: string`** — die UI arbeitet immer mit IDs, egal ob aus der DB oder temporär.

### Woher kommen IDs?

| Entität | Nach Laden / Speichern (DB) | Neu in der UI (noch nicht in DB) |
|---------|-----------------------------|----------------------------------|
| **Workout** | Prisma `@default(cuid())` → `WorkoutUI.id` | Nur nach `createWorkout`; dann echte ID |
| **WorkoutExercise** (Zeile im Training) | `WorkoutExercise.id` aus DB → Converter | Client: `ex-${Date.now()}` (`select-exercise`) |
| **ExerciseSet** | `ExerciseSet.id` aus DB → Converter | Client: `set-${Date.now()}` (`handleAddSet`) |
| **Exercise** (Übungskatalog) | Eigene DB-ID; UI sieht nur `exerciseName` + `muscleGroup` | Server: `findOrCreateExerciseId` beim Speichern |

**Regel:** Temporäre IDs (`ex-…`, `set-…`) sind nur für React (`key`, `map`, lokales State). Beim Speichern erkennt das Repository sie an: ID **nicht** in `existingIds` → **create** (neue CUID). ID **in** DB → **update**.

Nach `updateWorkout` + `workoutMutate()` kommen echte DB-IDs zurück in SWR/`localWorkout`.

### Lokales Bearbeiten (ohne sofortigen DB-Call)

Auf `workout/[id]/page.tsx`:

1. SWR liefert `WorkoutUI` → kopiert in `localWorkout`.
2. `handleUpdateSet(exerciseId, setId, updatedSet)` sucht in `localWorkout.exercises`:
   - `ex.id === exerciseId` (Übung in der Liste)
   - `s.id === setId` (Satz in dieser Übung)
3. `ExerciseCard` übergibt `exercise.id` und `set.id` aus dem **aktuellen UI-Objekt** (Closure in `.map`).

Es werden **keine** separaten „DB-IDs“ und „UI-IDs“ geführt — ein `id`-Feld, zwei mögliche Quellen.

### Wann wird was persistiert?

| Aktion | Wann DB? |
|--------|----------|
| Gewicht/Reps ändern | Erst bei „Speichern“ / „Training beenden“ (`updateWorkout` + `exercises`) |
| Satz hinzufügen | Lokal sofort; DB beim Speichern |
| Übung aus Liste wählen | Sofort `updateWorkout` (mit temporärer `ex-`/`set-` ID) |

---

## Component architecture

- **Pages** (`app/`) — routes; workout pages are client components using SWR
- **Components** (`components/`) — presentational; props use `WorkoutUI` / `ExerciseSetUI`
- **Hooks** (`hooks/`) — `use-workouts.ts` wraps SWR + Server Actions
- **Lib** (`lib/`) — converters, statistics, date utils; **db/** for server repositories

### Core flows

1. **Home** — `useActiveWorkout`, `useRecentWorkouts` → `WorkoutCard`
2. **New workout** — `createWorkout` → redirect to `/workout/[id]`
3. **Active workout** — local state + `updateWorkout` on save/finish
4. **Add exercise** — select muscle → select exercise → `updateWorkout` with extended `exercises`
5. **History / Statistics** — `useWorkouts` + `WorkoutUI` utils

---

## State management

| Kind | Tool |
|------|------|
| Server state | SWR + Server Actions |
| Form / draft state | `useState` on workout detail page |
| Auth session | NextAuth (`useSession` where needed) |
| URL | Next.js router |

---

## Performance

- SWR deduplication and cache keys (`workouts`, `active-workout`, `recent-workouts-N`)
- Server Actions avoid shipping Prisma to the client bundle
- Route-based code splitting (App Router)

---

## Testing strategy

- Unit: `lib/converters.ts`, `lib/statistics-utils.ts`, date utils
- Component: cards, set row (use `WorkoutUI` mocks)
- Integration: workout flow via Server Actions (mock `auth` / repository in Phase 4)

---

## Migration roadmap

| Phase | Status | Scope |
|-------|--------|--------|
| **1** | Done | UI types, `workout-include`, converters |
| **2** | Done | Repository, Server Actions, hooks, auth session `id` |
| **3** | Done | Auth middleware, session providers, loading/error UI, page polish |
| **4** | Planned | Tests + ARCHITECTURE-aligned mocks |

### Phase 3 — UX, Auth & resilience

| File | Role |
|------|------|
| `middleware.ts` | Redirect ohne Session von `/workout/*`, `/history`, `/statistics` → `/?authRequired=1` |
| `components/providers/app-providers.tsx` | `SessionProvider` im Root-Layout (für alle Hooks) |
| `hooks/use-workout-session.ts` | Session-Status + `useWorkoutSwrKey` (SWR nur wenn eingeloggt) |
| `lib/errors/workout-action-error.ts` | Strukturierte Fehlercodes (`UNAUTHORIZED`, `NOT_FOUND`, …) |
| `lib/format-workout-error.ts` | Deutsche UI-Meldungen aus Action-Fehlern |
| `components/workout/workout-page-state.tsx` | `WorkoutLoadingScreen`, `WorkoutErrorPanel`, `WorkoutNotFoundPanel`, `WorkoutAuthPrompt` |

**Verhalten**

- Nicht eingeloggt: Home zeigt `WorkoutAuthPrompt` statt Start-Button; SWR fetcht nicht (`key: null`).
- Geschützte URLs ohne Login: Middleware → Home mit Banner.
- Workout-Detail: getrennte Zustände Laden / Fehler / 404 / Formular.
- Statistics: kein `setState` während Render für Standard-Übung (`useEffect`).

### Future enhancements

- Server Components for read-heavy pages (home/history) where useful
- Training plans wired to Prisma
- PWA / offline
- Stricter validation (Zod) on action inputs

---

## Development guidelines

1. **Type safety** — `WorkoutUI` on client; Prisma types only under `lib/db/` and `converters.ts`
2. **No Prisma in client** — use Server Actions or Server Components
3. **Documentation** — file-level `@description` on new modules; explain *why* not only *what*
4. **Ownership** — always filter by `userId` from session in repository
5. **Accessibility** — semantic HTML, ARIA on interactive controls

---

## Deployment

1. Set `DATABASE_URL` (PostgreSQL)
2. Run `npx prisma migrate deploy` and `npm run seed` (muscles)
3. Configure Google OAuth for NextAuth
4. Deploy to Vercel (or similar); no separate JSON Server process required

---

## Secrets & Git

- Store secrets in environment files (e.g. `.env.local`) and never commit them.
- This repository includes an `.env.example` that shows required variables (do not put real secrets there).
- Ensure `.gitignore` contains `/.env*` so `.env.local` and other env files are ignored.
- If a secret file was accidentally committed, remove it from the repository with:

```bash
git rm --cached .env.local
git commit -m "chore: remove local env from repo"
git push
```

Also consider rotating any secrets that were exposed.
