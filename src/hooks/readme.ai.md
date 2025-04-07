# Hooks Directory Overview

This directory contains custom React hooks that encapsulate reusable logic across the application. These hooks help separate concerns and make component code cleaner and more maintainable.

## Key Concepts

- **Custom Hooks**: Reusable functions that use React's built-in hooks
- **Shared Logic**: Common patterns extracted into reusable units
- **State Management**: Local state management separated from components
- **Side Effects**: Encapsulated API calls and other effects

## Best Practices

- Keep hooks focused on a single responsibility
- Use TypeScript for proper typing of inputs and outputs
- Follow the React hooks naming convention (use\*)
- Add comprehensive JSDoc comments

## Do's and Don'ts

### Do

- Create hooks for repeated logic patterns
- Use TypeScript generics for flexible, reusable hooks
- Handle errors appropriately within hooks
- Test hooks independently of components

### Don't

- Create hooks that mix unrelated concerns
- Put UI rendering logic in hooks
- Create hooks with side effects that can't be cleaned up
- Duplicate functionality that exists in standard React hooks

## For AI Assistants

When working with this directory:

- Understand that hooks encapsulate reusable logic, not UI
- Note that hooks should follow React's rules of hooks
- Remember that hooks should have proper TypeScript types
- Follow the established patterns for error handling
- Consider that hooks may use Zustand stores for global state
