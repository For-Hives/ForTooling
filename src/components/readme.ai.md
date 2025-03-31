# Components Directory Overview

This directory contains all the React components used throughout the application. It's organized to promote reusability, maintainability, and a consistent user interface.

## Directory Structure

- `app/` - Application-specific components
- `magicui/` - Advanced UI components with animations and effects
- `ui/` - Basic UI components built on shadcn/ui

## Key Concepts

- **Component Hierarchy**: Organized from basic UI elements to complex compositions
- **Reusability**: Components designed for reuse across the application
- **Client vs Server Components**: Separation based on interactivity needs
- **UI Consistency**: Common design language across components

## Best Practices

- Keep components focused on a single responsibility
- Use TypeScript props interfaces for all components
- Separate client and server components appropriately
- Follow the established design patterns and aesthetic

## Do's and Don'ts

### Do

- Use existing UI components whenever possible
- Add proper TypeScript types for component props
- Write JSDoc comments for complex components
- Keep client components lightweight

### Don't

- Create duplicate components with similar functionality
- Mix client and server code inappropriately
- Add business logic to UI components
- Create overly complex components that could be composed

## For AI Assistants

When working with this directory:

- Understand the distinction between ui, magicui, and app components
- Note that 'use client' directive marks client components
- Be aware of the shadcn/ui patterns and conventions
- Remember to use Tailwind CSS for styling
- Follow the established naming conventions
- Recognize that components should be composable and reusable
