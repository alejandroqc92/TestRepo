# Workout Tracker — Project Guide

## What this is
A mobile-first web app for tracking weekly workouts. No backend — all data lives in `localStorage` under the key `workout_tracker_v1`.

## Stack
- **React 18 + TypeScript + Vite 8** (note: `erasableSyntaxOnly` is enabled — no TypeScript `enum`, use `as const` objects instead)
- **TailwindCSS v3** with a custom Notion-inspired theme (colors under `notion.*` in `tailwind.config.js`)
- **React Router v6** — `BrowserRouter` in `App.tsx`
- **Recharts** — used in `ExerciseProgressChart`
- **uuid** — for generating IDs

## User preferences
- **Notion-style UI**: clean, minimal, neutral grays/whites, no heavy shadows, subtle borders
- **Default weight unit: lbs** (set in `getInitialState()` in `src/lib/storage.ts`)

## Key architecture

### State
- Single `AppState` object managed by `useReducer` in `src/store/AppContext.tsx`
- Hydrated from localStorage on mount, debounced 500ms save on every state change
- `src/store/reducer.ts` — all mutations live here, including PR recalculation
- `src/store/actions.ts` — discriminated union of all action types
- `src/store/selectors.ts` — derived data (week summary, exercise history)

### Data models (`src/types/index.ts`)
- `MuscleGroup` and `WeightUnit` are `as const` objects (NOT enums — Vite 8 forbids erasable-only syntax)
- `AppState`: `{ exercises, sessions, prs, settings, schemaVersion }`
- `WorkoutSession`: has `timerStartedAt` (ISO string) + `timerElapsedSeconds` for refresh-safe timer
- `PersonalRecord`: keyed by `exerciseId` in `state.prs`, stores best Epley 1RM estimate in kg

### PR detection
- Epley 1RM formula: `weight * (1 + reps / 30)`, normalized to kg
- Lives in `src/lib/prUtils.ts` (`epley1RM`, `toKg`, `toLbs`)
- `recalcPRs()` in `reducer.ts` runs after every `ADD_SET`, `UPDATE_SET`, `DELETE_SET` — recomputes the global best across all sessions for that exercise and sets `isPR: true` on exactly one set

### Timer
- `useTimer` hook in `src/hooks/useTimer.ts`
- Running state stored on the session object (survives page refresh)
- `timerStartedAt`: when the timer was last started (undefined = paused)
- `timerElapsedSeconds`: accumulated seconds from previous runs

## Routing
```
/                                          WeeklyView
/session/:id                               SessionView
/session/:sessionId/exercise/:exerciseId   ExerciseDetail  ← exerciseId here is SessionExercise.id
/dashboard                                 Dashboard
/exercises                                 ExerciseLibrary
```
Bottom nav: Week | Progress | Exercises. Settings are in a modal (gear icon on WeeklyView).

## Folder structure
```
src/
  types/index.ts                 — all shared types
  constants/
    muscleGroups.ts              — MUSCLE_GROUP_COLORS, ALL_MUSCLE_GROUPS, DEFAULT_REQUIRED_GROUPS
    defaultExercises.ts          — 50+ seeded exercises (isCustom: false)
  store/
    AppContext.tsx                — provider + useAppContext hook
    actions.ts                   — Action union type
    reducer.ts                   — reducer + recalcPRs()
    selectors.ts                 — getSessionsForWeek, getWeekSummary, getExerciseHistory
  hooks/
    useAppStore.ts               — re-exports useAppContext as useAppStore
    useTimer.ts                  — timer logic
    useWeekRange.ts              — week navigation state
  lib/
    dateUtils.ts                 — toDateString, getWeekStart, formatElapsed, etc.
    prUtils.ts                   — epley1RM, toKg, toLbs
    storage.ts                   — loadState, saveState, getInitialState
  components/
    layout/   AppShell, BottomNav, PageHeader
    weekly/   WeekDayCard, MuscleGroupBadge, MissingGroupsAlert
    session/  ExerciseRow, SessionTimer, AddExerciseModal
    exercise/ SetEditor, ExerciseHistoryCard
    dashboard/ExerciseProgressChart, PRSummaryCard
    ui/       Button, Input, Modal, Badge, EmptyState
  pages/
    WeeklyView/   WeeklyView.tsx, SettingsModal.tsx
    SessionView/  SessionView.tsx
    ExerciseDetail/ExerciseDetail.tsx
    Dashboard/    Dashboard.tsx
    ExerciseLibrary/ExerciseLibrary.tsx
```

## Tailwind theme (Notion palette)
Defined in `tailwind.config.js` under `theme.extend.colors.notion`:
- `bg`, `bg-secondary`, `bg-hover` — white / off-white backgrounds
- `border`, `border-dark` — light gray borders
- `text`, `text-secondary`, `text-tertiary` — dark to light text
- `accent`, `accent-light` — blue (#2f80ed)
- `green`, `green-light` / `red`, `red-light` / `yellow`, `yellow-light` / `purple`, `purple-light`

## Common patterns
- Page layout: `<PageHeader />` (sticky) + `<div className="page-container pt-4">` (scrollable content)
- Cards: `className="card overflow-hidden"` with `border-b border-notion-border last:border-0` on rows
- Touch targets: 44px minimum height on interactive elements
- Path alias `@/` maps to `src/`

## Dev
```
npm run dev     # starts at http://localhost:5173
npm run build   # production build
```

## Git workflow
After completing any meaningful unit of work — a feature, bug fix, config change, or anything that should not be lost — commit and push immediately:

```
git add <specific files>
git commit -m "<type>: short description of what changed and why"
git push
```

Commit message types: `feat`, `fix`, `chore`, `refactor`, `style`. Keep messages specific (e.g. `feat: add rest timer between sets` not `update files`). Never batch unrelated changes into one commit. Push after every commit — do not let work sit only in the local repo.
