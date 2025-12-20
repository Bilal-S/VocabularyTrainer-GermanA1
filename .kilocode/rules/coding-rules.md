# Coding Rules

## OS
- **Operating System**: You are on Windows 11 or later. Assume you use PowerShell.

## Tech Stack
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3.3.6
- **Language**: JavaScript (ES Modules)

## Formatting & Style
- **Indentation**: 2 spaces
- **Semi-colons**: **NONE** (Avoid usage, follow StandardJS style)
- **Quotes**: Single quotes `'` preferred
- **Trailing Commas**: No specific enforcement observed, generally avoided in function calls
- **Line Length**: No strict limit observed, but reasonable wrapping

## Naming Conventions
- **Directories**: lowercase/kebab-case (e.g., `src/services`)
- **Files**:
  - Components: PascalCase (e.g., `ChatInterface.jsx`)
  - Hooks/Services/Utils: camelCase (e.g., `useVocabularyState.js`, `messageService.js`)
- **Variables & Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE (e.g., `STORAGE_KEY`)
- **Components**: PascalCase

## React Patterns
- **Type**: Functional Components with Hooks
- **Props**: Destructuring in function signature preferred
- **State**: `useState` for local, Custom Hooks for complex logic
- **Side Effects**: `useEffect`
- **DOM Access**: `useRef`

## Styling
- **Method**: Utility-first with Tailwind CSS
- **Configuration**: Custom colors/extensions in `tailwind.config.js`

## Documentation
- **JSDoc**: Use JSDoc (`/** ... */`) for services, utilities, and complex logic functions.
- **Comments**: Inline comments for complex logic blocks.
