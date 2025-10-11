# Contributing to Workout Tracker

Thank you for your interest in contributing to the Workout Tracker project!

## Development Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd workout-tracker
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the JSON server**
   \`\`\`bash
   npm run json-server
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

## Project Structure

\`\`\`
workout-tracker/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page
│   ├── history/           # Past workouts
│   ├── plans/             # Training plans
│   ├── statistics/        # Statistics and charts
│   └── workout/           # Workout flow pages
├── components/            # Reusable React components
│   ├── exercise-card.tsx
│   ├── navigation-bar.tsx
│   ├── set-row.tsx
│   ├── timer-button.tsx
│   └── workout-card.tsx
├── lib/                   # Utility functions and API
│   ├── date-utils.ts
│   ├── exercises-data.ts
│   ├── statistics-utils.ts
│   └── workout-api.ts
├── types/                 # TypeScript type definitions
│   └── workout.ts
├── hooks/                 # Custom React hooks
│   └── use-workouts.ts
├── __tests__/            # Test files
└── db.json               # JSON server database
\`\`\`

## Coding Standards

### TypeScript

- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid using \`any\` type
- Use type inference where appropriate

### React Components

- Use functional components with hooks
- Document components with JSDoc comments
- Keep components focused and single-purpose
- Use proper prop types

### Styling

- Use Tailwind CSS utility classes
- Follow the existing color scheme (dark theme with blue accents)
- Ensure responsive design (mobile-first)
- Use semantic HTML elements

### Code Organization

- Keep files modular and focused
- Extract reusable logic into utility functions
- Use custom hooks for shared stateful logic
- Follow the existing file structure

## Testing

### Running Tests

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
\`\`\`

### Writing Tests

- Write tests for all utility functions
- Test component rendering and interactions
- Use React Testing Library for component tests
- Aim for good test coverage

### Test Structure

\`\`\`typescript
describe("ComponentName", () => {
  it("should do something", () => {
    // Arrange
    // Act
    // Assert
  })
})
\`\`\`

## Documentation

- Add JSDoc comments to all functions and components
- Document complex logic with inline comments
- Update README.md for significant changes
- Keep type definitions well-documented

## Git Workflow

1. Create a feature branch from \`main\`
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

2. Make your changes and commit
   \`\`\`bash
   git add .
   git commit -m "feat: add new feature"
   \`\`\`

3. Push to your branch
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`

4. Create a pull request

### Commit Message Format

Follow conventional commits:

- \`feat:\` New feature
- \`fix:\` Bug fix
- \`docs:\` Documentation changes
- \`style:\` Code style changes (formatting)
- \`refactor:\` Code refactoring
- \`test:\` Adding or updating tests
- \`chore:\` Maintenance tasks

## Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Follow the code style guidelines
4. Provide a clear description of changes
5. Link related issues

## Questions?

If you have questions or need help, please open an issue on GitHub.

Thank you for contributing!
