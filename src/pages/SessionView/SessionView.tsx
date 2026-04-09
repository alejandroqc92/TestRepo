import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/hooks/useAppStore'
import { PageHeader } from '@/components/layout/PageHeader'
import { SessionTimer } from '@/components/session/SessionTimer'
import { ExerciseRow } from '@/components/session/ExerciseRow'
import { AddExerciseModal } from '@/components/session/AddExerciseModal'
import { CopyRoutineModal } from '@/components/session/CopyRoutineModal'
import { Button, EmptyState } from '@/components/ui'
import { formatDate } from '@/lib/dateUtils'

export function SessionView() {
  const { id } = useParams<{ id: string }>()
  const { state, dispatch } = useAppStore()
  const navigate = useNavigate()
  const [showAdd, setShowAdd] = useState(false)
  const [showCopy, setShowCopy] = useState(false)

  const session = state.sessions.find(s => s.id === id)
  if (!session) {
    return (
      <div className="page-container pt-6">
        <p className="text-notion-text-secondary text-sm">Session not found.</p>
        <Button variant="ghost" onClick={() => navigate('/')} className="mt-3">← Back</Button>
      </div>
    )
  }

  const completedCount = session.exercises.filter(e => e.isCompleted).length
  const isFinished = Boolean(session.completedAt)

  const finish = () => {
    dispatch({ type: 'COMPLETE_SESSION', payload: { sessionId: session.id } })
    navigate('/')
  }

  const deleteSession = () => {
    if (confirm('Delete this session?')) {
      dispatch({ type: 'DELETE_SESSION', payload: { sessionId: session.id } })
      navigate('/')
    }
  }

  const alreadyAdded = session.exercises.map(e => e.exerciseId)

  return (
    <div>
      <PageHeader
        title={formatDate(session.date)}
        subtitle={isFinished ? 'Completed' : 'In progress'}
        backTo="/"
        right={
          <div className="flex items-center gap-2">
            <SessionTimer session={session} />
            <Button
              size="sm"
              variant="ghost"
              onClick={deleteSession}
              className="text-notion-text-tertiary hover:text-notion-red px-2"
            >
              Del
            </Button>
          </div>
        }
      />

      <div className="page-container pt-4 flex flex-col gap-3">
        {/* Progress bar */}
        {session.exercises.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-notion-border rounded-full overflow-hidden">
              <div
                className="h-full bg-notion-green transition-all duration-500 rounded-full"
                style={{ width: `${(completedCount / session.exercises.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-notion-text-secondary tabular-nums">
              {completedCount}/{session.exercises.length}
            </span>
          </div>
        )}

        {/* Exercises */}
        <div className="card overflow-hidden">
          {session.exercises.length === 0 ? (
            <EmptyState
              icon="🏋️"
              title="No exercises yet"
              description="Add exercises to this session to start tracking your workout."
              action={
                <div className="flex flex-col items-center gap-2">
                  <Button onClick={() => setShowAdd(true)} variant="primary">
                    Add Exercise
                  </Button>
                  <Button onClick={() => setShowCopy(true)} variant="ghost" size="sm" className="text-notion-text-secondary">
                    Copy from past session
                  </Button>
                </div>
              }
            />
          ) : (
            <>
              {[...session.exercises]
                .sort((a, b) => a.order - b.order)
                .map(ex => (
                  <ExerciseRow key={ex.id} sessionId={session.id} sessionExercise={ex} />
                ))}
              <div className="px-4 py-3 flex gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdd(true)}
                  className="text-notion-text-secondary justify-start gap-1"
                >
                  <span className="text-base leading-none">+</span> Add Exercise
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCopy(true)}
                  className="text-notion-text-secondary justify-start gap-1"
                >
                  Copy routine
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Finish button */}
        {session.exercises.length > 0 && !isFinished && (
          <Button
            variant="primary"
            size="lg"
            onClick={finish}
            className="w-full"
          >
            Finish Workout
          </Button>
        )}

        {isFinished && (
          <div className="text-center py-2">
            <p className="text-sm text-notion-green font-medium">✓ Workout completed</p>
          </div>
        )}
      </div>

      <AddExerciseModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        sessionId={session.id}
        alreadyAdded={alreadyAdded}
      />
      <CopyRoutineModal
        open={showCopy}
        onClose={() => setShowCopy(false)}
        sessionId={session.id}
      />
    </div>
  )
}
