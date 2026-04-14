# Testing Conventions

## Current State

### No Test Framework Installed
This project currently has **no testing framework** configured. The `package.json` shows:
- No Jest, Vitest, or other testing libraries
- No test scripts defined
- No test files in the codebase

### Build System
- Vite 6.2.0 for development and building
- TypeScript compilation check via `npm run lint` (runs `tsc --noEmit`)

## Recommended Testing Setup

Based on the project stack (React 19 + TypeScript + Vite), the recommended testing framework is **Vitest**:

```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/dom
```

### Test File Organization

Recommended pattern following existing conventions:

```
src/
├── __tests__/
│   ├── services/
│   │   └── DataService.test.ts
│   ├── hooks/
│   │   └── useStore.test.tsx
│   └── components/
│       └── Header.test.tsx
├── components/
│   └── admin/
├── contexts/
│   └── StoreContext.tsx (test alongside hook tests)
├── hooks/
│   └── useStore.ts
├── services/
│   └── DataService.ts
└── ...
```

### Test File Naming
- `*.test.ts` or `*.test.tsx` for unit tests
- `*.spec.ts` or `*.spec.tsx` as alternative
- Test files colocated with source files or in `__tests__/` directory

## Testing Patterns

### DataService Testing
Since `DataService` uses `localStorage`, tests need mocking:
```typescript
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};
global.localStorage = localStorageMock;
```

### Context/Hook Testing
Using `@testing-library/react`:
```typescript
import { render, screen } from '@testing-library/react';
import { StoreProvider } from '../contexts/StoreContext';
import { useStore } from '../hooks/useStore';
```

### Mocking Patterns
- `vi.fn()` for function mocks (Vitest)
- `vi.mock()` for module mocking
- `localStorage` mocked via `global.localStorage`

## Recommended Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

## Notes

- No ESLint config means no `plugin:testing-library/react` rules
- Tailwind CSS testing requires `@tailwindcss/forms` or similar for form testing
- Consider adding `vitest.config.ts` for test-specific configuration