```markdown
# internal-room-booking-system-frontend Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the core development patterns and conventions used in the `internal-room-booking-system-frontend` TypeScript codebase. You'll learn how to structure files, write imports and exports, follow commit message conventions, and understand the project's approach to testing. This guide also provides suggested commands for common workflows.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `roomBookingForm.ts`, `userProfilePage.ts`

### Import Style
- Use **relative imports** for modules within the project.
  - Example:
    ```typescript
    import { RoomList } from './roomList';
    import { formatDate } from '../utils/dateUtils';
    ```

### Export Style
- Use **named exports** rather than default exports.
  - Example:
    ```typescript
    // roomList.ts
    export function RoomList() { /* ... */ }

    // utils/dateUtils.ts
    export function formatDate(date: Date): string { /* ... */ }
    ```

### Commit Message Convention
- Use **Conventional Commits** with prefixes such as `chore` and `feat`.
  - Example:
    ```
    feat: add booking validation to form
    chore: update dependencies
    ```

## Workflows

### Creating a New Feature
**Trigger:** When adding new functionality to the system  
**Command:** `/new-feature`

1. Create a new file using camelCase naming.
2. Write your feature using TypeScript, following relative import and named export conventions.
3. Add or update relevant test files (`*.test.ts`).
4. Commit your changes with a `feat:` prefix and a clear, concise message.
   - Example: `feat: implement room availability checker`
5. Open a pull request for review.

### Making a Chore Update
**Trigger:** When performing maintenance tasks (e.g., dependency updates, refactoring)  
**Command:** `/chore-update`

1. Make your maintenance changes.
2. Commit with a `chore:` prefix and a brief description.
   - Example: `chore: refactor booking form layout`
3. Push your changes and open a pull request.

### Writing and Running Tests
**Trigger:** When adding or updating tests  
**Command:** `/run-tests`

1. Create or update test files using the `*.test.ts` pattern.
2. Use the project's preferred (unknown) testing framework.
3. Run tests locally to ensure correctness.
4. Commit test changes with an appropriate message.
   - Example: `feat: add tests for booking validation`

## Testing Patterns

- **Test File Naming:** Use the `*.test.ts` pattern.
  - Example: `roomBookingForm.test.ts`
- **Framework:** Not specified; follow existing patterns in the repository.
- **Placement:** Place test files alongside the modules they test or in a dedicated `tests` directory if present.

## Commands
| Command         | Purpose                                         |
|-----------------|-------------------------------------------------|
| /new-feature    | Start the workflow for adding a new feature     |
| /chore-update   | Begin a maintenance or refactoring update       |
| /run-tests      | Run or update tests in the codebase             |
```
