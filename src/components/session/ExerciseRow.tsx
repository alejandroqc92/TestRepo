import { useNavigate } from 'react-router-dom'
import { type SessionExercise } from '@/types'
import { useAppStore } from '@/hooks/useAppStore'
import { MuscleGroupBadge } from '@/components/weekly/MuscleGroupBadge'
import { Button } from '@/components/ui'

interface Props {
  sessionId: string
  sessionExercise: SessionExercise
}

export function ExerciseRow({ sessionId, sessionExercise }: Props) {
  const { state, dispatch } = useAppStore()
  const navigate = useNavigate()
  const exercise = state.exercises.find(e => e.id === sessionExercise.exerciseId)
  if (!exercise) return null

  const hasPR = sessionExercise.sets.some(s => s.isPR)
  const setCount = sessionExercise.sets.length
  const runCount = sessionExercise.runEntries?.length ?? 0

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: 'TOGGLE_EXERCISE_COMPLETE',
      payload: { sessionId, sessionExerciseId: sessionExercise.id },
    })
  }

  const remove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm(`Remove ${exercise.name} from this session?`)) {
      dispatch({
        type: 'REMOVE_EXERCISE_FROM_SESSION',
        payload: { sessionId, sessionExerciseId: sessionExercise.id },
      })
    }
  }

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 border-b border-notion-border last:border-0 hover:bg-notion-bg-hover transition-colors cursor-pointer ${
        sessionExercise.isCompleted ? 'opacity-60' : ''
      }`}
      onClick={() => navigate(`/session/${sessionId}/exercise/${sessionExercise.id}`)}
    >
      {/* Checkbox */}
      <button
        onClick={toggle}
        className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
          sessionExercise.isCompleted
            ? 'bg-notion-text border-notion-text text-white'
            : 'border-notion-border-dark hover:border-notion-text'
        }`}
        aria-label={sessionExercise.isCompleted ? 'Mark incomplete' : 'Mark complete'}
      >
        {sessionExercise.isCompleted && <span className="text-[10px] font-bold">✓</span>}
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-medium ${sessionExercise.isCompleted ? 'line-through text-notion-text-secondary' : 'text-notion-text'}`}>
            {exercise.name}
          </span>
          {hasPR && (
            <span className="text-xs font-semibold text-notion-accent bg-notion-accent-light px-1.5 py-0.5 rounded">PR</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <MuscleGroupBadge group={exercise.muscleGroup} />
          {exercise.muscleGroup === 'Cardio' ? (
            runCount > 0 && (
              <span className="text-xs text-notion-text-secondary">{runCount} run{runCount !== 1 ? 's' : ''}</span>
            )
          ) : (
            setCount > 0 && (
              <span className="text-xs text-notion-text-secondary">
                {sessionExercise.targetSets
                  ? `${setCount} / ${sessionExercise.targetSets} sets`
                  : `${setCount} set${setCount !== 1 ? 's' : ''}`}
              </span>
            )
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          size="sm"
          variant="ghost"
          onClick={remove}
          className="w-7 h-7 p-0 text-notion-text-tertiary hover:text-notion-red"
          aria-label="Remove exercise"
        >
          ×
        </Button>
        <span className="text-notion-text-tertiary text-sm">→</span>
      </div>
    </div>
  )
}
