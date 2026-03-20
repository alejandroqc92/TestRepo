import { useParams } from 'react-router-dom'
import { useAppStore } from '@/hooks/useAppStore'
import { type SetEntry, type RunEntry, MuscleGroup, WeightUnit } from '@/types'
import { PageHeader } from '@/components/layout/PageHeader'
import { SetEditor } from '@/components/exercise/SetEditor'
import { RunLogger } from '@/components/exercise/RunLogger'
import { ExerciseHistoryCard } from '@/components/exercise/ExerciseHistoryCard'
import { MuscleGroupBadge } from '@/components/weekly/MuscleGroupBadge'
import { getExerciseHistory } from '@/store/selectors'
import { toLbs } from '@/lib/prUtils'
export function ExerciseDetail() {
  const { sessionId, exerciseId: sessionExerciseId } = useParams<{
    sessionId: string
    exerciseId: string
  }>()
  const { state, dispatch } = useAppStore()

  const session = state.sessions.find(s => s.id === sessionId)
  const sessionExercise = session?.exercises.find(ex => ex.id === sessionExerciseId)
  const exercise = state.exercises.find(e => e.id === sessionExercise?.exerciseId)

  if (!session || !sessionExercise || !exercise) {
    return (
      <div className="page-container pt-6">
        <p className="text-sm text-notion-text-secondary">Exercise not found.</p>
      </div>
    )
  }

  const isCardio = exercise.muscleGroup === MuscleGroup.Cardio
  const pr = isCardio ? null : state.prs[exercise.id]
  const history = isCardio ? [] : getExerciseHistory(state, exercise.id)
  const { weightUnit } = state.settings

  // Build run history from all sessions for this exercise
  const runHistory = isCardio
    ? [...state.sessions]
        .sort((a, b) => a.date.localeCompare(b.date))
        .flatMap(s => {
          const se = s.exercises.find(ex => ex.exerciseId === exercise.id)
          if (!se || !se.runEntries?.length) return []
          return se.runEntries.map(r => ({ date: s.date, sessionId: s.id, entry: r }))
        })
        .filter(r => r.sessionId !== session.id) // exclude current session
        .slice(-8)
        .reverse()
    : []

  const prDisplay = pr
    ? weightUnit === WeightUnit.LBS
      ? `${Math.round(toLbs(pr.bestWeightKg))} lbs × ${pr.bestReps}`
      : `${Math.round(pr.bestWeightKg * 10) / 10} kg × ${pr.bestReps}`
    : null

  const addSet = (set: SetEntry) => {
    dispatch({
      type: 'ADD_SET',
      payload: { sessionId: session.id, sessionExerciseId: sessionExercise.id, set },
    })
  }

  const updateSet = (index: number, set: SetEntry) => {
    dispatch({
      type: 'UPDATE_SET',
      payload: { sessionId: session.id, sessionExerciseId: sessionExercise.id, setIndex: index, set },
    })
  }

  const deleteSet = (index: number) => {
    dispatch({
      type: 'DELETE_SET',
      payload: { sessionId: session.id, sessionExerciseId: sessionExercise.id, setIndex: index },
    })
  }

  const toggleComplete = () => {
    dispatch({
      type: 'TOGGLE_EXERCISE_COMPLETE',
      payload: { sessionId: session.id, sessionExerciseId: sessionExercise.id },
    })
  }

  const setTargetSets = (value: string) => {
    const parsed = parseInt(value)
    dispatch({
      type: 'SET_TARGET_SETS',
      payload: {
        sessionId: session.id,
        sessionExerciseId: sessionExercise.id,
        targetSets: value && parsed > 0 ? parsed : undefined,
      },
    })
  }

  const addRunEntry = (entry: RunEntry) => {
    dispatch({
      type: 'ADD_RUN_ENTRY',
      payload: { sessionId: session.id, sessionExerciseId: sessionExercise.id, entry },
    })
  }

  const updateRunEntry = (entryId: string, entry: RunEntry) => {
    dispatch({
      type: 'UPDATE_RUN_ENTRY',
      payload: { sessionId: session.id, sessionExerciseId: sessionExercise.id, entryId, entry },
    })
  }

  const deleteRunEntry = (entryId: string) => {
    dispatch({
      type: 'DELETE_RUN_ENTRY',
      payload: { sessionId: session.id, sessionExerciseId: sessionExercise.id, entryId },
    })
  }

  return (
    <div>
      <PageHeader
        title={exercise.name}
        backTo={`/session/${sessionId}`}
        right={
          <button
            onClick={toggleComplete}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              sessionExercise.isCompleted
                ? 'bg-notion-green-light text-notion-green'
                : 'bg-notion-bg-hover text-notion-text-secondary hover:bg-notion-border'
            }`}
          >
            {sessionExercise.isCompleted ? '✓ Done' : 'Mark done'}
          </button>
        }
      />

      <div className="page-container pt-4 flex flex-col gap-4">
        {/* Exercise meta */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <MuscleGroupBadge group={exercise.muscleGroup} />
          {prDisplay && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-notion-accent-light rounded text-xs font-semibold text-notion-accent">
              <span>🏆</span>
              <span>PR: {prDisplay}</span>
            </div>
          )}
        </div>

        {/* Target sets row (strength only) */}
        {!isCardio && (
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-notion-text-secondary uppercase tracking-wide">Sets</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                value={sessionExercise.targetSets ?? ''}
                onChange={e => setTargetSets(e.target.value)}
                placeholder="—"
                min="1"
                className="w-12 text-center text-[16px] border border-notion-border rounded px-1 py-0.5 bg-notion-bg text-notion-text focus:outline-none focus:border-notion-accent transition-colors"
              />
              <span className="text-xs text-notion-text-tertiary">target</span>
            </div>
          </div>
        )}

        {/* Set editor or run logger */}
        {isCardio ? (
          <RunLogger
            entries={sessionExercise.runEntries ?? []}
            onAdd={addRunEntry}
            onUpdate={updateRunEntry}
            onDelete={deleteRunEntry}
          />
        ) : (
          <SetEditor
            sets={sessionExercise.sets}
            defaultUnit={weightUnit}
            onAdd={addSet}
            onUpdate={updateSet}
            onDelete={deleteSet}
          />
        )}

        {/* History */}
        {isCardio ? (
          runHistory.length > 0 && (
            <div>
              <p className="text-xs font-medium text-notion-text-secondary uppercase tracking-wide mb-2">Previous Sessions</p>
              <ExerciseHistoryCard entries={[]} runHistory={runHistory} />
            </div>
          )
        ) : (
          history.length > 0 && (
            <div>
              <p className="text-xs font-medium text-notion-text-secondary uppercase tracking-wide mb-2">Previous Sessions</p>
              <ExerciseHistoryCard entries={history} />
            </div>
          )
        )}
      </div>
    </div>
  )
}
