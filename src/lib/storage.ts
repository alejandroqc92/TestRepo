import { type AppState, WeightUnit } from '@/types'
import { DEFAULT_EXERCISES } from '@/constants/defaultExercises'
import { DEFAULT_REQUIRED_GROUPS } from '@/constants/muscleGroups'
import { supabase } from '@/lib/supabase'

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

export async function loadState(userId: string): Promise<AppState> {
  const { data, error } = await supabase
    .from('user_data')
    .select('state')
    .eq('user_id', userId)
    .maybeSingle()

  if (error || !data) return getInitialState()

  const parsed = data.state as Partial<AppState>
  const initial = getInitialState()
  return {
    ...initial,
    ...parsed,
    settings: { ...initial.settings, ...parsed.settings },
    exercises: parsed.exercises?.length ? parsed.exercises : initial.exercises,
  }
}

export async function saveState(userId: string, state: AppState): Promise<void> {
  await supabase.from('user_data').upsert(
    { user_id: userId, state, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' },
  )
}
