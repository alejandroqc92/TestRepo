import { useState, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { type Exercise, MuscleGroup } from '@/types'
import { useAppStore } from '@/hooks/useAppStore'
import { Modal, Input } from '@/components/ui'
import { MuscleGroupBadge } from '@/components/weekly/MuscleGroupBadge'
import { ALL_MUSCLE_GROUPS } from '@/constants/muscleGroups'

interface Props {
  open: boolean
  onClose: () => void
  sessionId: string
  alreadyAdded: string[] // exerciseIds already in session
}

export function AddExerciseModal({ open, onClose, sessionId, alreadyAdded }: Props) {
  const { state, dispatch } = useAppStore()
  const [search, setSearch] = useState('')
  const [filterGroup, setFilterGroup] = useState<MuscleGroup | null>(null)

  const filtered = useMemo(() => {
    return state.exercises.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase())
      const matchesGroup = filterGroup ? ex.muscleGroup === filterGroup : true
      return matchesSearch && matchesGroup
    })
  }, [state.exercises, search, filterGroup])

  const add = (exercise: Exercise) => {
    const order = state.sessions.find(s => s.id === sessionId)?.exercises.length ?? 0
    dispatch({
      type: 'ADD_EXERCISE_TO_SESSION',
      payload: {
        sessionId,
        sessionExercise: {
          id: uuidv4(),
          exerciseId: exercise.id,
          sets: [],
          isCompleted: false,
          order,
        },
      },
    })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Exercise">
      <div className="flex flex-col gap-3">
        <Input
          placeholder="Search exercises..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoFocus
        />

        {/* Group filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
          <button
            onClick={() => setFilterGroup(null)}
            className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              !filterGroup ? 'bg-notion-text text-white' : 'bg-notion-bg-hover text-notion-text-secondary hover:text-notion-text'
            }`}
          >
            All
          </button>
          {ALL_MUSCLE_GROUPS.map(g => (
            <button
              key={g}
              onClick={() => setFilterGroup(filterGroup === g ? null : g)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                filterGroup === g ? 'bg-notion-text text-white' : 'bg-notion-bg-hover text-notion-text-secondary hover:text-notion-text'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Exercise list */}
        <div className="flex flex-col divide-y divide-notion-border -mx-5 overflow-y-auto max-h-72">
          {filtered.length === 0 && (
            <p className="px-5 py-6 text-sm text-notion-text-secondary text-center">No exercises found</p>
          )}
          {filtered.map(ex => {
            const added = alreadyAdded.includes(ex.id)
            return (
              <button
                key={ex.id}
                onClick={() => !added && add(ex)}
                disabled={added}
                className={`flex items-center justify-between px-5 py-3 text-left transition-colors ${
                  added ? 'opacity-40 cursor-not-allowed' : 'hover:bg-notion-bg-hover active:bg-notion-border'
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-notion-text">{ex.name}</p>
                  <div className="mt-0.5">
                    <MuscleGroupBadge group={ex.muscleGroup} />
                  </div>
                </div>
                {added ? (
                  <span className="text-xs text-notion-text-tertiary">Added</span>
                ) : (
                  <span className="text-notion-text-tertiary text-sm">+</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
