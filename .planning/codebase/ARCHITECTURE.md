# Kaza Takibi - Architecture Overview

## Architecture Pattern

This is a **React SPA (Single Page Application)** with a **Context-based State Management** pattern. The app follows a simplified **Flux-like** architecture where data flows in one direction: from the Store context to components.

## Layers

### 1. Presentation Layer (UI Components)
```
src/components/admin/
src/pages/
```
- Renders UI and handles user interactions
- No direct data access - receives data via hooks
- Uses Tailwind CSS for styling with Material Design 3 inspired custom properties

### 2. State Management Layer
```
src/contexts/StoreContext.tsx
src/hooks/useStore.ts
```
- `StoreContext` - React Context providing global app state
- `useStore` - Custom hook to access the context
- All state mutations happen here: `reducePrayer`, `undoPrayer`, `updateDailyTarget`, `resetData`, `completeOnboarding`

### 3. Service Layer
```
src/services/DataService.ts
```
- Handles persistence via `localStorage`
- `getOrInit()` - Lazy initialization from localStorage
- `save()` - Persists state changes
- `reset()` - Resets to initial state

### 4. Data Types Layer
```
src/types.ts
src/constants.ts
```
- `types.ts` - TypeScript interfaces: `AppData`, `UserProfile`, `PrayerCounts`, `PrayerLog`, `PrayerType`
- `constants.ts` - `INITIAL_DATA` and `PRAYER_NAMES` lookup

### 5. Utility Layer
```
src/lib/utils.ts
```
- `cn()` - Tailwind class merger using `clsx` + `tailwind-merge`

## Data Flow

```
User Action
    │
    ▼
Component (e.g. DashboardView)
    │
    ▼ calls reducePrayer(type, amount)
    │
useStore() hook
    │
    ▼
StoreContext.reducePrayer()
    │
    ▼ setData() + DataService.save()
    │
LocalStorage ◄─────────────────────┐
    │
    ▼
State Update triggers re-render
    │
    ▼
Component re-renders with new data
```

## Entry Points

| File | Purpose |
|------|---------|
| `index.html` | Mount point `<div id="root">` |
| `src/main.tsx` | React root creation, wraps App in StrictMode |
| `src/App.tsx` | Root component, conditionally renders OnboardingPage or AdminDashboard |
| `src/pages/AdminDashboard.tsx` | Main router switching between 5 views via state |
| `src/pages/OnboardingPage.tsx` | First-run wizard for gender/dates to calculate prayer debt |

## Key State Shape

```typescript
interface AppData {
  user: {
    gender: 'male' | 'female' | null;
    birthDate: string | null;
    startDate: string | null;
    dailyTarget: number;
  };
  prayers: {
    sabah: number;
    ogle: number;
    ikindi: number;
    aksam: number;
    yatsi: number;
    vitir: number;
  };
  stats: {
    streak: number;
    totalCompleted: number;
    lastActiveDate: string | null;
  };
  history: PrayerLog[];
}
```

## Navigation Structure

`AdminDashboard` holds `activeView` state and renders one of 5 views:
- `dashboard` - Main prayer tracking interface
- `history` - Timeline of completed prayers
- `stats` - Streak, totals, weekly chart, badges
- `library` - Fiqh references and quick articles
- `settings` - Daily target config, data reset

## Technology Stack

- **React 19** with TypeScript
- **Vite 6** for build tooling
- **Tailwind CSS 4** with custom theme (green/earthy palette)
- **Framer Motion** for animations
- **Lucide React** for icons
- **localStorage** for persistence (no backend)