# Workout Tracker

A comprehensive workout tracking application built with Next.js that helps users log, track, and analyze their fitness progress.

## Features

- **Workout Logging**: Start new workouts, add exercises, and track sets with weight, reps, and rest times
- **Exercise Library**: Organized by muscle groups with a comprehensive exercise database
- **Workout History**: View and edit past workouts
- **Statistics & Analytics**: Visualize progress with charts for exercises and muscle groups
- **Training Plans**: Create and manage workout plans
- **Responsive Design**: Works seamlessly on mobile and desktop devices

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm, npm or yarn package manager

### Installation & Local development

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Copy environment variables:

```bash
cp .env.example .env.local
# then fill in real secrets in .env.local
```

4. Run database migrations and seed (Postgres required):

```bash
npx prisma migrate dev
pnpm run seed
```

5. Start the development server:

```bash
pnpm dev
```

6. Open http://localhost:3000 in your browser

## Production Build

To build the application for production:

```bash
pnpm build
pnpm start
```

Make sure `DATABASE_URL` and other production environment variables are set in your hosting environment.

## Running Tests

\`\`\`bash
npm test
\`\`\`

For watch mode:

\`\`\`bash
npm run test:watch
\`\`\`

## Project Structure

- `/app` - Next.js app router pages
- `/components` - Reusable React components
- `/lib` - Utility functions and API clients
- `/types` - TypeScript type definitions
- `/hooks` - Custom React hooks
- `prisma/` - Prisma schema and seed scripts

## Technologies Used

- **Next.js 16+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **SWR** - Data fetching and caching
- **Recharts** - Data visualization
- **PostgreSQL + Prisma** - Production data store
- **NextAuth** - Authentication
- **Jest & React Testing Library** - Testing

## Secrets & Git

- Store secrets in `.env.local` and never commit real secrets.
- This repo includes `.env.example` with placeholders. Do not copy real secrets into the example file.
- `.gitignore` includes `.env*` but if you accidentally committed secrets, run:

```bash
git rm --cached .env.local
git commit -m "chore: remove local env from repo"
git push
```

Rotate any secrets that were exposed.

## License

MIT
