<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Locsonhg Movie App - Development Guidelines

This is a React application built with Vite, TypeScript, and Tailwind CSS.

## Project Structure

- Use the `@` alias for imports from the `src` directory
- Follow TypeScript best practices and maintain strict typing
- Use Tailwind CSS for all styling
- Prefer functional components with hooks over class components

## Code Style

- Use kebab-case for file names (e.g., `movie-card.tsx`)
- Use PascalCase for component names
- Use camelCase for variable and function names
- Keep components small and focused on a single responsibility

## Import Guidelines

- Use the `@` alias for internal imports: `import Component from '@/components/Component'`
- Group imports: external libraries first, then internal modules
- Use named imports when possible

## Tailwind CSS

- Use utility classes for styling
- Create custom components for repeated patterns
- Use responsive design principles with Tailwind's breakpoint prefixes
- Prefer Tailwind classes over custom CSS
