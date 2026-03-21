import { type AppState, type Exercise, type SessionExercise, type SetEntry, type UserSettings, type RunEntry, MuscleGroup } from '@/types'

export type Action =
  // Sessions
  | { type: 'CREATE_SESSION'; payload: { id: string; date: string } }
  | { type: 'DELETE_SESSION'; payload: { sessionId: string } }
  | { type: 'COMPLETE_SESSION'; payload: { sessionId: string } }
  | { type: 'UPDATE_SESSION_NOTES'; payload: { sessionId: string; notes: string } }

  // Timer
  | { type: 'START_TIMER'; payload: { sessionId: string; now: string } }
  | { type: 'PAUSE_TIMER'; payload: { sessionId: string; now: string } }
  | { type: 'RESET_TIMER'; payload: { sessionId: string } }

  // Exercises within session
  | { type: 'ADD_EXERCISE_TO_SESSION'; payload: { sessionId: string; sessionExercise: SessionExercise } }
  | { type: 'REMOVE_EXERCISE_FROM_SESSION'; payload: { sessionId: string; sessionExerciseId: string } }
  | { type: 'TOGGLE_EXERCISE_COMPLETE'; payload: { sessionId: string; sessionExerciseId: string } }
  | { type: 'REORDER_EXERCISES'; payload: { sessionId: string; orderedIds: string[] } }

  // Sets
  | { type: 'ADD_SET'; payload: { sessionId: string; sessionExerciseId: string; set: SetEntry } }
  | { type: 'UPDATE_SET'; payload: { sessionId: string; sessionExerciseId: string; setIndex: number; set: SetEntry } }
  | { type: 'DELETE_SET'; payload: { sessionId: string; sessionExerciseId: string; setIndex: number } }

  // Exercise library
  | { type: 'ADD_EXERCISE'; payload: { exercise: Exercise } }
  | { type: 'UPDATE_EXERCISE'; payload: { exercise: Exercise } }
  | { type: 'DELETE_EXERCISE'; payload: { exerciseId: string } }

  // Target sets
  | { type: 'SET_TARGET_SETS'; payload: { sessionId: string; sessionExerciseId: string; targetSets: number | undefined } }

  // Run entries
  | { type: 'ADD_RUN_ENTRY';    payload: { sessionId: string; sessionExerciseId: string; entry: RunEntry } }
  | { type: 'UPDATE_RUN_ENTRY'; payload: { sessionId: string; sessionExerciseId: string; entryId: string; entry: RunEntry } }
  | { type: 'DELETE_RUN_ENTRY'; payload: { sessionId: string; sessionExerciseId: string; entryId: string } }

  // Settings
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'TOGGLE_REQUIRED_GROUP'; payload: { group: MuscleGroup } }

  // State hydration
  | { type: 'LOAD_STATE'; payload: AppState }
