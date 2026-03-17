import { type AppState, WeightUnit } from '@/types'
import { DEFAULT_EXERCISES } from '@/constants/defaultExercises'
import { DEFAULT_REQUIRED_GROUPS } from '@/constants/muscleGroups'

const STORAGE_KEY = 'workout_tracker_v1'
const SCHEMA_VERSION = 1

export function getInitialState(): AppState {
  return {
    exercises: DEFAULT_EXERCISES,
    sessions: [],
    prs: {},
    settings: {
      weightUnit: WeightUnit.LBS,
      requiredMuscleGroups: DEFAULT_REQUIRED_GROUPS,
      weekStartsOn: 1,
    },
    schemaVersion: SCHEMA_VERSION,
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getInitialState()
    const parsed = JSON.parse(raw) as Partial<AppState>
    // Merge with initial to handle missing fields after schema changes
    const initial = getInitialState()
    return {
      ...initial,
      ...parsed,
      settings: { ...initial.settings, ...parsed.settings },
      exercises: parsed.exercises?.length ? parsed.exercises : initial.exercises,
    }
  } catch {
    return getInitialState()
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage quota exceeded or unavailable — silently ignore
  }
}
