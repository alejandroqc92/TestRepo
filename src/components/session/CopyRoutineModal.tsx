import { v4 as uuidv4 } from 'uuid'
import { type WorkoutSession, type SessionExercise } from '@/types'
import { useAppStore } from '@/hooks/useAppStore'
import { Modal } from '@/components/ui'
import { MuscleGroupBadge } from '@/components/weekly/MuscleGroupBadge'
import { formatDate } from '@/lib/dateUtils'

interface Props {
  open: boolean
  onClose: () => void
  sessionId: string
}

export function CopyRoutineModal({ open, onClose, sessionId }: Props) {
  const { state, dispatch } = useAppStore()

  const exerciseMap = new Map(state.exercises.map(e => [e.id, e]))

  const pastSessions = state.sessions
    .filter(s => s.id !== sessionId && s.exercises.length > 0)
    .sort((a, b) => b.date.localeCompare(a.date))

  const copy = (source: WorkoutSession) => {
    const currentSession = state.sessions.find(s => s.id === sessionId)
    const startOrder = currentSession?.exercises.length ?? 0

    const newExercises: SessionExercise[] = [...source.exercises]
      .sort((a, b) => a.order - b.order)
      .map((ex, idx) => ({
        id: uuidv4(),
        exerciseId: ex.exerciseId,
        sets: [],
        isCompleted: false,
        order: startOrder + idx,
        notes: ex.notes,
        targetSets: ex.targetSets,
      }))

    dispatch({
      type: 'COPY_EXERCISES_FROM_SESSION',
      payload: { targetSessionId: sessionId, exercises: newExercises },
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Copy Routine">
      <div className="flex flex-col -mx-5">
        {pastSessions.length === 0 && (
          <p className="px-5 py-6 text-sm text-notion-text-secondary text-center">
            No past sessions to copy from.
          </p>
        )}
        {pastSessions.map(session => {
          const muscleGroups = [
            ...new Set(
              session.exercises
                .map(ex => exerciseMap.get(ex.exerciseId)?.muscleGroup)
                .filter(Boolean),
            ),
          ] as string[]

          return (
            <button
              key={session.id}
              onClick={() => copy(session)}
              className="flex flex-col gap-1.5 px-5 py-3.5 text-left border-b border-notion-border last:border-0 hover:bg-notion-bg-hover active:bg-notion-border transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-notion-text">
                  {formatDate(session.date)}
                </span>
                <span className="text-xs text-notion-text-tertiary">
                  {session.exercises.length} exercise{session.exercises.length !== 1 ? 's' : ''}
                </span>
              </div>
              {muscleGroups.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {muscleGroups.map(g => (
                    <MuscleGroupBadge key={g} group={g as any} />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </Modal>
  )
}
