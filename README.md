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
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Start the JSON server (in a separate terminal):

\`\`\`bash
npm run json-server
\`\`\`

4. Start the development server:

\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Running Tests

\`\`\`bash
npm test
\`\`\`

For watch mode:

\`\`\`bash
npm run test:watch
\`\`\`

## Project Structure

- \`/app\` - Next.js app router pages
- \`/components\` - Reusable React components
- \`/lib\` - Utility functions and API clients
- \`/types\` - TypeScript type definitions
- \`/hooks\` - Custom React hooks
- \`db.json\` - JSON server database

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **SWR** - Data fetching and caching
- **Recharts** - Data visualization
- **JSON Server** - Mock REST API
- **Jest & React Testing Library** - Testing

## License

MIT
