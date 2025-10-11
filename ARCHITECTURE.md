# Workout Tracker Architecture

## Overview

The Workout Tracker is a full-stack Next.js application built with the App Router, TypeScript, and Tailwind CSS. It uses a JSON server for data persistence and SWR for client-side data fetching and caching.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Data Fetching**: SWR
- **Charts**: Recharts
- **Testing**: Jest + React Testing Library
- **Backend**: JSON Server (mock REST API)

## Architecture Patterns

### 1. Component Architecture

The application follows a modular component architecture:

- **Pages** (\`app/\`): Route-based pages using Next.js App Router
- **Components** (\`components/\`): Reusable UI components
- **Hooks** (\`hooks/\`): Custom React hooks for shared logic
- **Lib** (\`lib/\`): Utility functions and API clients

### 2. Data Flow

\`\`\`
User Action → Component → API Call → JSON Server
                ↓
            SWR Cache ← API Response
                ↓
            Component Re-render
\`\`\`

### 3. State Management

- **Server State**: Managed by SWR (workouts, exercises)
- **Local State**: React useState for UI state
- **URL State**: Next.js router for navigation state

## Core Features

### 1. Workout Management

**Flow**: Home → New Workout → Select Muscle → Select Exercise → Active Workout

- Create new workouts with auto-filled date/time
- Add exercises from categorized library
- Track sets with weight, reps, and rest timer
- Edit and delete sets/exercises
- Finish workout to mark as complete

**Key Files**:
- \`app/workout/[id]/page.tsx\` - Active workout interface
- \`app/workout/[id]/select-muscle/page.tsx\` - Muscle group selection
- \`app/workout/[id]/select-exercise/page.tsx\` - Exercise selection
- \`components/exercise-card.tsx\` - Exercise display with sets
- \`components/set-row.tsx\` - Individual set tracking

### 2. Workout History

**Flow**: History Page → Workout Detail → Edit

- View all past workouts chronologically
- Click to view/edit workout details
- Same interface as active workout

**Key Files**:
- \`app/history/page.tsx\` - Past workouts list
- \`components/history-workout-card.tsx\` - Workout summary card

### 3. Statistics & Analytics

**Flow**: Statistics Page → Select Tab → Choose Metric → View Chart

Three analysis modes:
- **General**: Total workouts, training time
- **Muscles**: Volume per muscle group over time
- **Exercises**: Max weight progression per exercise

**Key Files**:
- \`app/statistics/page.tsx\` - Statistics interface
- \`components/statistics-chart.tsx\` - Chart component
- \`lib/statistics-utils.ts\` - Data calculation functions

### 4. Training Plans

**Flow**: Plans Page → Select Plan → (Future: Start Workout)

- Browse predefined training plans
- Organized by muscle groups
- Future: Create custom plans

**Key Files**:
- \`app/plans/page.tsx\` - Training plans list

## Data Models

### Workout

\`\`\`typescript
interface Workout {
  id: string
  name: string
  date: string // ISO date
  startTime: string // HH:mm
  endTime?: string // HH:mm
  notes?: string
  isActive: boolean
  exercises: WorkoutExercise[]
}
\`\`\`

### WorkoutExercise

\`\`\`typescript
interface WorkoutExercise {
  id: string
  workoutId: string
  exerciseName: string
  muscleGroup: string
  order: number
  sets: WorkoutSet[]
}
\`\`\`

### WorkoutSet

\`\`\`typescript
interface WorkoutSet {
  id: string
  setNumber: number
  weight: number
  reps: number
  breakTime: number // seconds
  notes?: string
}
\`\`\`

## API Layer

### REST Endpoints (JSON Server)

- \`GET /workouts\` - Fetch all workouts
- \`GET /workouts/:id\` - Fetch single workout
- \`POST /workouts\` - Create workout
- \`PATCH /workouts/:id\` - Update workout
- \`DELETE /workouts/:id\` - Delete workout

### API Client (\`lib/workout-api.ts\`)

Provides typed functions for all API operations:
- \`getWorkouts()\`
- \`getWorkout(id)\`
- \`createWorkout(workout)\`
- \`updateWorkout(id, updates)\`
- \`deleteWorkout(id)\`
- \`getActiveWorkout()\`
- \`getRecentWorkouts(limit)\`

## Performance Optimizations

1. **SWR Caching**: Automatic request deduplication and caching
2. **Optimistic Updates**: Immediate UI updates before server confirmation
3. **Code Splitting**: Automatic route-based code splitting
4. **Lazy Loading**: Components loaded on demand

## Responsive Design

- **Mobile-first**: Designed for mobile, enhanced for desktop
- **Breakpoints**: Uses Tailwind's responsive prefixes
- **Touch-friendly**: Large tap targets, swipe gestures
- **Safe areas**: Respects device safe areas (notches, etc.)

## Testing Strategy

### Unit Tests
- Utility functions (\`lib/\`)
- Data calculations
- Date formatting

### Component Tests
- Component rendering
- User interactions
- Props handling

### Integration Tests
- Page flows
- API interactions
- State management

## Future Enhancements

1. **Authentication**: User accounts and data sync
2. **Cloud Storage**: Replace JSON server with real database
3. **Social Features**: Share workouts, follow friends
4. **Advanced Analytics**: ML-based insights and recommendations
5. **Offline Support**: PWA with offline capabilities
6. **Exercise Videos**: Instructional content
7. **Custom Plans**: User-created training programs

## Development Guidelines

1. **Type Safety**: Use TypeScript strictly, avoid \`any\`
2. **Component Modularity**: Keep components small and focused
3. **Documentation**: JSDoc comments for all public APIs
4. **Testing**: Write tests for new features
5. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
6. **Performance**: Monitor bundle size, optimize images
7. **Code Style**: Follow existing patterns, use Prettier

## Deployment

The application can be deployed to Vercel with zero configuration:

1. Connect GitHub repository
2. Vercel auto-detects Next.js
3. Environment variables (if needed)
4. Deploy

For JSON server in production, consider:
- Replace with real database (PostgreSQL, MongoDB)
- Use Vercel Serverless Functions for API
- Or deploy separate backend service
