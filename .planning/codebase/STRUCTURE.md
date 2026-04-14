# Kaza Takibi - Project Structure

## Directory Tree

```
kaza-namaz/
├── index.html                    # Mount point (div#root)
├── package.json                  # Dependencies and scripts
├── vite.config.ts                # Vite + Tailwind plugin config
├── tsconfig.json                 # TypeScript config
│
├── src/
│   ├── main.tsx                  # Entry: createRoot(), StrictMode
│   ├── App.tsx                   # Root: StoreProvider > AppRouter
│   ├── index.css                # Tailwind imports + CSS custom properties
│   │
│   ├── types.ts                  # TypeScript interfaces (PrayerType, AppData, etc.)
│   ├── constants.ts             # INITIAL_DATA, PRAYER_NAMES
│   │
│   ├── contexts/
│   │   └── StoreContext.tsx     # Global state context + Provider
│   │
│   ├── hooks/
│   │   └── useStore.ts          # useStore() hook wrapper for StoreContext
│   │
│   ├── services/
│   │   └── DataService.ts       # localStorage read/write/reset
│   │
│   ├── lib/
│   │   └── utils.ts             # cn() - Tailwind class merger
│   │
│   ├── pages/
│   │   ├── AdminDashboard.tsx   # Main container: view router
│   │   └── OnboardingPage.tsx   # First-run setup wizard
│   │
│   └── components/
│       └── admin/
│           ├── layout/
│           │   ├── Layout.tsx   # Frame: Header + content + BottomNav
│           │   ├── Header.tsx   # App title + profile button
│           │   └── BottomNav.tsx # 5-tab navigation
│           │
│           └── views/
│               ├── DashboardView.tsx  # Prayer grid + progress rings
│               ├── HistoryView.tsx     # Timeline of logged prayers
│               ├── StatsView.tsx       # Streak, total, weekly chart
│               ├── LibraryView.tsx     # Fiqh articles + categories
│               └── SettingsView.tsx   # Daily target + reset
│
├── .planning/codebase/
│   ├── ARCHITECTURE.md          # This file - architecture patterns
│   └── STRUCTURE.md             # This file - directory layout
```

## File Purposes

| File | Purpose |
|------|---------|
| `main.tsx` | Creates React root, mounts App inside StrictMode |
| `App.tsx` | Conditionally shows OnboardingPage or AdminDashboard |
| `OnboardingPage.tsx` | Collects gender + dates, calculates initial prayer debt |
| `AdminDashboard.tsx` | View switcher - holds `activeView` state |
| `StoreContext.tsx` | Provides global state + mutations (reducePrayer, undoPrayer, etc.) |
| `useStore.ts` | Consumes StoreContext, throws if used outside provider |
| `DataService.ts` | Wraps localStorage with getOrInit/save/reset |
| `types.ts` | All TypeScript interfaces |
| `constants.ts` | Default prayer counts, prayer name labels |
| `DashboardView.tsx` | Main screen - prayer cards with +1/-1 buttons, progress ring |
| `HistoryView.tsx` | Chronological log grouped by day |
| `StatsView.tsx` | Streak counter, total completed, bar chart, badges |
| `LibraryView.tsx` | Static Islamic knowledge articles with modal viewer |
| `SettingsView.tsx` | Edit dailyTarget, reset all data |
| `Layout.tsx` | Wrapper with Header + BottomNav |
| `Header.tsx` | Logo + user icon |
| `BottomNav.tsx` | 5-tab mobile navigation bar |

## Naming Conventions

| Convention | Example |
|------------|---------|
| Components: PascalCase | `DashboardView.tsx` |
| Functions/Variables: camelCase | `reducePrayer`, `activeView` |
| Types/Interfaces: PascalCase | `PrayerType`, `AppData` |
| Constants: PascalCase | `INITIAL_DATA`, `PRAYER_NAMES` |
| CSS classes: kebab-case (Tailwind) | `bg-primary`, `text-on-surface` |
| Files: PascalCase for components, camelCase for utils/hooks | `useStore.ts`, `utils.ts` |

## Where to Add New Code

### Adding a new view (e.g., Profile screen):
1. Create `src/components/admin/views/ProfileView.tsx`
2. Add to `AdminDashboard.tsx`:
   ```tsx
   case 'profile': return <ProfileView />;
   ```
3. Add nav item in `BottomNav.tsx`:
   ```tsx
   { id: 'profile', label: 'Profil', icon: User }
   ```

### Adding new state:
1. Add type in `src/types.ts`
2. Initialize in `src/constants.ts` (`INITIAL_DATA`)
3. Add reducer/mutation in `src/contexts/StoreContext.tsx`
4. Expose via `StoreContextType` interface

### Adding a new prayer type:
1. Add to `PrayerType` union in `src/types.ts`
2. Add to `PrayerCounts` interface
3. Add to `INITIAL_DATA` in `src/constants.ts`
4. Add icon mapping in `DashboardView.tsx`
5. Add name in `PRAYER_NAMES` constant

### Adding utility functions:
- Put in `src/lib/utils.ts` if used across components
- Export utility classes/services to `src/services/` if they need state access

## Component Hierarchy

```
App
└── StoreProvider
    └── AppRouter
        ├── <OnboardingPage /> (if !data.user.gender)
        └── <AdminDashboard /> (if gender exists)
            └── <Layout>
                ├── <Header />
                ├── (activeView)
                │   ├── DashboardView
                │   ├── HistoryView
                │   ├── StatsView
                │   ├── LibraryView
                │   └── SettingsView
                └── <BottomNav />
```

## Styling Pattern

Uses Tailwind CSS 4 with CSS custom properties (defined in `index.css`):
- Colors: `primary`, `secondary`, `tertiary`, `background`, `surface-*`, `on-*`, `error`
- Typography: `font-headline`, `font-bold`, etc.
- Spacing: Tailwind default scale

## State Access Pattern

Components access state via:
```tsx
const { data, reducePrayer } = useStore();
```

Never import state directly - always use the hook.

## Persistence Strategy

`DataService` wraps localStorage:
- Key: `kaza_takibi_data`
- Loaded lazily on first render
- Auto-saved after every state mutation in StoreContext
- No backend / API calls