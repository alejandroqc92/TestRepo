import { type AppState } from '@/types'
import { type Action } from './actions'
import { epley1RM } from '@/lib/prUtils'

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    // ─── Sessions ──────────────────────────────────────────────
    case 'CREATE_SESSION': {
      const { id, date } = action.payload
      return {
        ...state,
        sessions: [
          ...state.sessions,
          {
            id,
            date,
            exercises: [],
            timerElapsedSeconds: 0,
            isActive: true,
          },
        ],
      }
    }

    case 'DELETE_SESSION': {
      return {
        ...state,
        sessions: state.sessions.filter(s => s.id !== action.payload.sessionId),
      }
    }

    case 'COMPLETE_SESSION': {
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === action.payload.sessionId
            ? { ...s, isActive: false, completedAt: new Date().toISOString() }
            : s,
        ),
      }
    }

    case 'UPDATE_SESSION_NOTES': {
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === action.payload.sessionId ? { ...s, notes: action.payload.notes } : s,
        ),
      }
    }

    // ─── Timer ─────────────────────────────────────────────────
    case 'START_TIMER': {
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === action.payload.sessionId
            ? { ...s, timerStartedAt: action.payload.now }
            : s,
        ),
      }
    }

    case 'PAUSE_TIMER': {
      return {
        ...state,
        sessions: state.sessions.map(s => {
          if (s.id !== action.payload.sessionId) return s
          const started = s.timerStartedAt ? new Date(s.timerStartedAt).getTime() : null
          const now = new Date(action.payload.now).getTime()
          const delta = started ? Math.floor((now - started) / 1000) : 0
          return {
            ...s,
            timerStartedAt: undefined,
            timerElapsedSeconds: s.timerElapsedSeconds + delta,
          }
        }),
      }
    }

    case 'RESET_TIMER': {
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === action.payload.sessionId
            ? { ...s, timerStartedAt: undefined, timerElapsedSeconds: 0 }
            : s,
        ),
      }
    }

    // ─── Exercises in session ───────────────────────────────────
    case 'ADD_EXERCISE_TO_SESSION': {
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === action.payload.sessionId
            ? { ...s, exercises: [...s.exercises, action.payload.sessionExercise] }
            : s,
        ),
      }
    }

    case 'COPY_EXERCISES_FROM_SESSION': {
      const { targetSessionId, exercises } = action.payload
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === targetSessionId
            ? { ...s, exercises: [...s.exercises, ...exercises] }
            : s,
        ),
      }
    }

    case 'REMOVE_EXERCISE_FROM_SESSION': {
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === action.payload.sessionId
            ? {
                ...s,
                exercises: s.exercises.filter(
                  ex => ex.id !== action.payload.sessionExerciseId,
                ),
              }
            : s,
        ),
      }
    }

    case 'TOGGLE_EXERCISE_COMPLETE': {
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === action.payload.sessionId
            ? {
                ...s,
                exercises: s.exercises.map(ex =>
                  ex.id === action.payload.sessionExerciseId
                    ? { ...ex, isCompleted: !ex.isCompleted }
                    : ex,
                ),
              }
            : s,
        ),
      }
    }

    case 'REORDER_EXERCISES': {
      return {
        ...state,
        sessions: state.sessions.map(s => {
          if (s.id !== action.payload.sessionId) return s
          const reordered = action.payload.orderedIds
            .map((id, idx) => {
              const ex = s.exercises.find(e => e.id === id)
              return ex ? { ...ex, order: idx } : null
            })
            .filter(Boolean) as typeof s.exercises
          return { ...s, exercises: reordered }
        }),
      }
    }

    // ─── Sets ──────────────────────────────────────────────────
    case 'ADD_SET': {
      const { sessionId, sessionExerciseId, set } = action.payload
      let newState = {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === sessionId
            ? {
                ...s,
                exercises: s.exercises.map(ex =>
                  ex.id === sessionExerciseId
                    ? { ...ex, sets: [...ex.sets, { ...set, isPR: false }] }
                    : ex,
                ),
              }
            : s,
        ),
      }
      newState = recalcPRs(newState, sessionId, sessionExerciseId)
      return newState
    }

    case 'UPDATE_SET': {
      const { sessionId, sessionExerciseId, setIndex, set } = action.payload
      let newState = {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === sessionId
            ? {
                ...s,
                exercises: s.exercises.map(ex => {
                  if (ex.id !== sessionExerciseId) return ex
                  const newSets = [...ex.sets]
                  newSets[setIndex] = { ...set, isPR: false }
                  return { ...ex, sets: newSets }
                }),
              }
            : s,
        ),
      }
      newState = recalcPRs(newState, sessionId, sessionExerciseId)
      return newState
    }

    case 'DELETE_SET': {
      const { sessionId, sessionExerciseId, setIndex } = action.payload
      let newState = {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === sessionId
            ? {
                ...s,
                exercises: s.exercises.map(ex => {
                  if (ex.id !== sessionExerciseId) return ex
                  const newSets = ex.sets.filter((_, i) => i !== setIndex)
                  return { ...ex, sets: newSets }
                }),
              }
            : s,
        ),
      }
      newState = recalcPRs(newState, sessionId, sessionExerciseId)
      return newState
    }

    // ─── Target sets ───────────────────────────────────────────
    case 'SET_TARGET_SETS': {
      const { sessionId, sessionExerciseId, targetSets } = action.payload
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === sessionId
            ? {
                ...s,
                exercises: s.exercises.map(ex =>
                  ex.id === sessionExerciseId ? { ...ex, targetSets } : ex,
                ),
              }
            : s,
        ),
      }
    }

    // ─── Run entries ────────────────────────────────────────────
    case 'ADD_RUN_ENTRY': {
      const { sessionId, sessionExerciseId, entry } = action.payload
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === sessionId
            ? {
                ...s,
                exercises: s.exercises.map(ex =>
                  ex.id === sessionExerciseId
                    ? { ...ex, runEntries: [...(ex.runEntries ?? []), entry] }
                    : ex,
                ),
              }
            : s,
        ),
      }
    }

    case 'UPDATE_RUN_ENTRY': {
      const { sessionId, sessionExerciseId, entryId, entry } = action.payload
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === sessionId
            ? {
                ...s,
                exercises: s.exercises.map(ex =>
                  ex.id === sessionExerciseId
                    ? {
                        ...ex,
                        runEntries: (ex.runEntries ?? []).map(r =>
                          r.id === entryId ? entry : r,
                        ),
                      }
                    : ex,
                ),
              }
            : s,
        ),
      }
    }

    case 'DELETE_RUN_ENTRY': {
      const { sessionId, sessionExerciseId, entryId } = action.payload
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === sessionId
            ? {
                ...s,
                exercises: s.exercises.map(ex =>
                  ex.id === sessionExerciseId
                    ? {
                        ...ex,
                        runEntries: (ex.runEntries ?? []).filter(r => r.id !== entryId),
                      }
                    : ex,
                ),
              }
            : s,
        ),
      }
    }

    // ─── Exercise library ───────────────────────────────────────
    case 'ADD_EXERCISE': {
      return { ...state, exercises: [...state.exercises, action.payload.exercise] }
    }

    case 'UPDATE_EXERCISE': {
      return {
        ...state,
        exercises: state.exercises.map(e =>
          e.id === action.payload.exercise.id ? action.payload.exercise : e,
        ),
      }
    }

    case 'DELETE_EXERCISE': {
      return {
        ...state,
        exercises: state.exercises.filter(e => e.id !== action.payload.exerciseId),
      }
    }

    // ─── Settings ──────────────────────────────────────────────
    case 'UPDATE_SETTINGS': {
      return { ...state, settings: { ...state.settings, ...action.payload } }
    }

    case 'TOGGLE_REQUIRED_GROUP': {
      const { group } = action.payload
      const current = state.settings.requiredMuscleGroups
      const next = current.includes(group)
        ? current.filter(g => g !== group)
        : [...current, group]
      return { ...state, settings: { ...state.settings, requiredMuscleGroups: next } }
    }

    case 'LOAD_STATE':
      return action.payload

    default:
      return state
  }
}

// ─── PR recalculation ───────────────────────────────────────────
function recalcPRs(state: AppState, sessionId: string, sessionExerciseId: string): AppState {
  const session = state.sessions.find(s => s.id === sessionId)
  if (!session) return state
  const sessionEx = session.exercises.find(ex => ex.id === sessionExerciseId)
  if (!sessionEx) return state

  const { exerciseId } = sessionEx

  // Collect best 1RM across all sets (all sessions) for this exercise
  let globalBest1RM = 0
  let globalBestSessionId = ''
  let globalBestSetIdx = -1
  let globalBestExId = ''

  for (const s of state.sessions) {
    for (const ex of s.exercises) {
      if (ex.exerciseId !== exerciseId) continue
      for (let i = 0; i < ex.sets.length; i++) {
        const set = ex.sets[i]
        const est = epley1RM(set.weight, set.reps, set.unit)
        if (est > globalBest1RM) {
          globalBest1RM = est
          globalBestSessionId = s.id
          globalBestSetIdx = i
          globalBestExId = ex.id
        }
      }
    }
  }

  // Update isPR flags and prs record
  const newSessions = state.sessions.map(s => ({
    ...s,
    exercises: s.exercises.map(ex => {
      if (ex.exerciseId !== exerciseId) return ex
      return {
        ...ex,
        sets: ex.sets.map((set, i) => ({
          ...set,
          isPR: s.id === globalBestSessionId && ex.id === globalBestExId && i === globalBestSetIdx,
        })),
      }
    }),
  }))

  const newPRs = { ...state.prs }
  if (globalBest1RM > 0) {
    const prSet = state.sessions
      .find(s => s.id === globalBestSessionId)
      ?.exercises.find(ex => ex.id === globalBestExId)
      ?.sets[globalBestSetIdx]

    if (prSet) {
      newPRs[exerciseId] = {
        exerciseId,
        bestWeightKg: globalBest1RM,
        bestReps: prSet.reps,
        achievedAt: prSet.completedAt ?? new Date().toISOString(),
        sessionId: globalBestSessionId,
      }
    }
  } else {
    delete newPRs[exerciseId]
  }

  return { ...state, sessions: newSessions, prs: newPRs }
}
