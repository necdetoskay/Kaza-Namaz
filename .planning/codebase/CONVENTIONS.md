# Code Conventions

## Project Overview
- React 19 + TypeScript project with Vite build system
- Turkish-language codebase (naming and comments)
- Tailwind CSS v4 for styling

## Naming Conventions

### Files
- PascalCase for components: `AdminDashboard.tsx`, `StoreContext.tsx`
- PascalCase for views: `DashboardView.tsx`, `HistoryView.tsx`
- camelCase for utilities/hooks: `useStore.ts`, `utils.ts`
- camelCase for services: `DataService.ts`
- PascalCase for types: `types.ts`

### Components
- Function-based components with PascalCase names
- Exported as named exports where appropriate
- Direct component function declaration (not const arrow functions)

### Variables and Functions
- camelCase for variables and functions: `reducePrayer`, `activeView`
- PascalCase for types and interfaces: `PrayerType`, `UserProfile`
- UPPER_SNAKE_CASE for constants: `STORAGE_KEY`

## Code Style

### TypeScript
- Strict typing with explicit interfaces for all complex types
- Union types for string literals (e.g., `'sabah' | 'ogle' | 'ikindi' | 'aksam' | 'yatsi' | 'vitir'`)
- Nullable types use `| null` explicitly
- Type exports in `types.ts`

### React Patterns
- Context-based state management with `createContext`
- Custom hooks for context access (`useStore`)
- Functional state updates with `useState`
- `ReactNode` type for children prop

### Import Organization
1. React imports first
2. Third-party library imports (lucide-react, clsx, etc.)
3. Project imports (relative paths: `../types`, `./hooks/useStore`)
4. Type imports on same line as implementation imports

Example:
```typescript
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AppData, PrayerType, UserProfile, PrayerCounts } from '../types';
import { DataService } from '../services/DataService';
```

## Formatting

### Project Configuration
- `tsconfig.json` configured with:
  - ES2022 target
  - `react-jsx` for JSX transform
  - `bundler` module resolution
  - Path alias: `@/*` maps to project root

### Vite Configuration (`vite.config.ts`)
- Uses `@tailwindcss/vite` and `@vitejs/plugin-react`
- Path alias configured: `@` resolves to project root
- Environment variable loading via `loadEnv`

### No ESLint/Prettier Configuration
- Project does not have ESLint or Prettier config files
- Linting done via `tsc --noEmit` (TypeScript checking only)
- No enforced code formatting rules in the repo

## Directory Structure

```
src/
├── components/
│   └── admin/
│       ├── layout/
│       │   ├── Header.tsx
│       │   ├── Layout.tsx
│       │   └── BottomNav.tsx
│       └── views/
│           ├── DashboardView.tsx
│           ├── HistoryView.tsx
│           ├── StatsView.tsx
│           ├── LibraryView.tsx
│           └── SettingsView.tsx
├── contexts/
│   └── StoreContext.tsx
├── hooks/
│   └── useStore.ts
├── pages/
│   ├── AdminDashboard.tsx
│   └── OnboardingPage.tsx
├── services/
│   └── DataService.ts
├── lib/
│   └── utils.ts
├── types.ts
├── constants.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Key Patterns

### Service Pattern (DataService)
```typescript
export const DataService = {
  getOrInit: (): AppData => { ... },
  save: (data: AppData): void => { ... },
  reset: (): AppData => { ... }
};
```

### Custom Hook Pattern
```typescript
export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
```

### Tailwind CSS Patterns
- Design tokens via CSS variables: `bg-[#fbfbe2]`, `text-primary`
- Component-based class organization
- Utility function `cn()` for class merging (clsx + tailwind-merge)