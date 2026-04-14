# Codebase Concerns
**Analysis Date:** 2026-04-13

## Tech Debt

**State Management**: Issue: `StoreContext.tsx` lacks error boundaries; if context operations fail, the entire app crashes without recovery. Files: `src/contexts/StoreContext.tsx`, Impact: Unhandled errors in prayer operations can crash the app, Fix: Wrap context operations in try-catch or add error boundary component

**Data Persistence**: Issue: `DataService.ts` has minimal error handling - JSON parse errors and storage quota errors are logged but not surfaced to users. Files: `src/services/DataService.ts`, Impact: Silent data loss may occur without user awareness, Fix: Add user-facing error notifications for storage failures

**Hardcoded Content**: Issue: `LibraryView.tsx` (391 lines) contains all article content hardcoded in the component, making maintenance and translation difficult. Files: `src/components/admin/views/LibraryView.tsx`, Impact: Adding new articles requires code changes, Fix: Externalize content to JSON/separate data files

**Large Components**: Issue: Multiple components exceed 100 lines without clear separation of concerns. Files: `src/components/admin/views/LibraryView.tsx` (391 lines), `src/components/admin/views/DashboardView.tsx` (308 lines), `src/pages/OnboardingPage.tsx` (200 lines), Impact: Hard to maintain and test, Fix: Extract sub-components and utilities

**Type Safety**: Issue: `types.ts` defines interfaces but runtime validation is absent. Files: `src/types.ts`, Impact: Invalid data in localStorage can cause runtime crashes, Fix: Add runtime validation with zod or similar

## Known Issues

- No known bugs reported, but no bug tracking system in place
- `completeOnboarding` in `StoreContext.tsx` does not preserve existing `prayers` data structure fully when merging with new profile data - may overwrite existing prayer counts

## Security Considerations

**XSS Risk**: Issue: `LibraryView.tsx` accepts `React.ReactNode` content type which could potentially render unsafe HTML if article content is ever loaded from external sources. Currently safe since content is hardcoded. Files: `src/components/admin/views/LibraryView.tsx:6,30`, Impact: If article content is later loaded from API/user input, XSS vulnerability, Fix: Sanitize content before rendering if externalized

**No Authentication**: Issue: This is a local-only app using localStorage, but there is no authentication mechanism. Files: N/A (localStorage-based), Impact: Anyone with device access can view/modify prayer data, Fix: N/A for current design - this is by design for simplicity

**Sensitive Data in Storage**: Issue: Prayer history and user profile stored in plain localStorage. Files: `src/services/DataService.ts`, Impact: Data visible in browser devtools, Fix: If sensitive, consider encrypting localStorage data

## Performance

**Large Bundle Potential**: Issue: `LibraryView.tsx` imports many icons from `lucide-react` (11 imports on lines 2-3) even if not all used. Files: `src/components/admin/views/LibraryView.tsx:2`, Impact: Larger bundle size, Fix: Tree-shake unused icons or dynamically import

**Context Re-renders**: Issue: `StoreContext` uses single state object; any change triggers re-render of all consumers. Files: `src/contexts/StoreContext.tsx`, Impact: Performance degradation as app grows, Fix: Split into multiple contexts or use useMemo for selectors

**No Memoization**: Issue: Components like `LibraryView` don't use `useMemo` for expensive article/category computations. Files: `src/components/admin/views/LibraryView.tsx:8-21,23-26`, Impact: Unnecessary re-computations on re-renders, Fix: Memoize static data objects

## Test Coverage Gaps

**No Test Files**: Issue: Zero test files exist in the codebase. Files: Entire project, Impact: No automated verification of functionality, regressions undetected, Fix: Add unit tests for `DataService`, `StoreContext`, and component tests for critical user flows

**No Error Path Testing**: Issue: Error handling paths (JSON parse errors, localStorage quota exceeded) are not tested. Files: `src/services/DataService.ts`, Impact: Error handling may not work when needed, Fix: Add tests for error scenarios

**No Type Testing**: Issue: Types are not validated at runtime - invalid data shapes would not be caught. Files: `src/types.ts`, Impact: Runtime type errors may occur with corrupted storage data, Fix: Add runtime validation

## Fragile Areas

**StoreContext State Logic**: Issue: The reducePrayer/undoPrayer logic has subtle edge cases (e.g., negative amounts, concurrent updates). The spread operator for state updates is not atomic. Files: `src/contexts/StoreContext.tsx:27-96`, Impact: State inconsistencies under rapid user interaction, Fix: Add transactional updates or use useReducer

**History Array Growth**: Issue: `history` array in `AppData` grows unbounded - no pagination or cleanup. Files: `src/contexts/StoreContext.tsx:56,90`, `src/services/DataService.ts`, Impact: Storage quota may be reached over time, Fix: Implement history limit/archival

**Date/Time Handling**: Issue: Uses `Date.now().toString()` for IDs and `new Date().toISOString()` for timestamps without timezone consideration. Files: `src/contexts/StoreContext.tsx:40-41,74-75`, Impact: Potential issues across timezones, Fix: Use ISO strings consistently and store timezone

**Onboarding Flow**: Issue: `completeOnboarding` resets stats but may not properly validate input. Files: `src/contexts/StoreContext.tsx:113-128`, Impact: Invalid profile data can be saved, Fix: Add input validation before save
