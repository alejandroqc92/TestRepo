import { useState, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { type Exercise, MuscleGroup } from '@/types'
import { useAppStore } from '@/hooks/useAppStore'
import { PageHeader } from '@/components/layout/PageHeader'
import { Modal, Button, Input, EmptyState } from '@/components/ui'
import { ALL_MUSCLE_GROUPS } from '@/constants/muscleGroups'

export function ExerciseLibrary() {
  const { state, dispatch } = useAppStore()
  const [search, setSearch] = useState('')
  const [filterGroup, setFilterGroup] = useState<MuscleGroup | null>(null)
  const [editExercise, setEditExercise] = useState<Exercise | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const filtered = useMemo(() => {
    return state.exercises.filter(ex => {
      const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase())
      const matchGroup = filterGroup ? ex.muscleGroup === filterGroup : true
      return matchSearch && matchGroup
    })
  }, [state.exercises, search, filterGroup])

  const grouped = useMemo(() => {
    const map = new Map<MuscleGroup, Exercise[]>()
    for (const ex of filtered) {
      const arr = map.get(ex.muscleGroup) ?? []
      arr.push(ex)
      map.set(ex.muscleGroup, arr)
    }
    return map
  }, [filtered])

  return (
    <div>
      <PageHeader
        title="Exercises"
        right={
          <Button size="sm" variant="primary" onClick={() => setShowCreate(true)}>
            + New
          </Button>
        }
      />

      <div className="page-container pt-4 flex flex-col gap-3">
        <Input
          placeholder="Search exercises..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* Group filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4">
          <button
            onClick={() => setFilterGroup(null)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !filterGroup ? 'bg-notion-text text-white' : 'bg-notion-bg-hover text-notion-text-secondary'
            }`}
          >
            All
          </button>
          {ALL_MUSCLE_GROUPS.map(g => (
            <button
              key={g}
              onClick={() => setFilterGroup(filterGroup === g ? null : g)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterGroup === g ? 'bg-notion-text text-white' : 'bg-notion-bg-hover text-notion-text-secondary'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Results */}
        {grouped.size === 0 ? (
          <EmptyState
            icon="🔍"
            title="No exercises found"
            action={<Button onClick={() => setShowCreate(true)}>Create custom exercise</Button>}
          />
        ) : (
          Array.from(grouped.entries()).map(([group, exercises]) => (
            <div key={group}>
              <p className="text-xs font-medium text-notion-text-secondary uppercase tracking-wide mb-1.5">{group}</p>
              <div className="card overflow-hidden">
                {exercises.map(ex => (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between px-4 py-3 border-b border-notion-border last:border-0 hover:bg-notion-bg-hover transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-notion-text truncate">{ex.name}</p>
                        {ex.isCustom && (
                          <span className="text-[11px] text-notion-text-tertiary">Custom</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditExercise(ex)}
                        className="px-2"
                      >Edit</Button>
                      {ex.isCustom && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (confirm(`Delete "${ex.name}"?`)) {
                              dispatch({ type: 'DELETE_EXERCISE', payload: { exerciseId: ex.id } })
                            }
                          }}
                          className="px-2 text-notion-red hover:bg-notion-red-light"
                        >Del</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit modal */}
      <ExerciseFormModal
        open={showCreate || editExercise !== null}
        onClose={() => { setShowCreate(false); setEditExercise(null) }}
        initial={editExercise}
        onSave={(data) => {
          if (editExercise) {
            dispatch({ type: 'UPDATE_EXERCISE', payload: { exercise: { ...editExercise, ...data } } })
          } else {
            dispatch({
              type: 'ADD_EXERCISE',
              payload: {
                exercise: {
                  id: uuidv4(),
                  isCustom: true,
                  createdAt: new Date().toISOString(),
                  ...data,
                },
              },
            })
          }
          setShowCreate(false)
          setEditExercise(null)
        }}
      />
    </div>
  )
}

interface FormData { name: string; muscleGroup: MuscleGroup; notes?: string }

function ExerciseFormModal({
  open, onClose, initial, onSave,
}: {
  open: boolean
  onClose: () => void
  initial: Exercise | null
  onSave: (data: FormData) => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [group, setGroup] = useState<MuscleGroup>(initial?.muscleGroup ?? MuscleGroup.Chest)
  const [notes, setNotes] = useState(initial?.notes ?? '')

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit Exercise' : 'New Exercise'}
      footer={
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={!name.trim()}
          onClick={() => onSave({ name: name.trim(), muscleGroup: group, notes: notes.trim() || undefined })}
        >
          {initial ? 'Save Changes' : 'Create Exercise'}
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Exercise name"
          autoFocus
        />
        <div>
          <p className="text-xs font-medium text-notion-text-secondary uppercase tracking-wide mb-1.5">Muscle Group</p>
          <select
            value={group}
            onChange={e => setGroup(e.target.value as MuscleGroup)}
            className="w-full bg-notion-bg border border-notion-border rounded-md px-3 py-2 text-sm text-notion-text focus:border-notion-text transition-colors min-h-[40px]"
          >
            {ALL_MUSCLE_GROUPS.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <Input
          label="Notes (optional)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="e.g. use dumbbells, go slow"
        />
      </div>
    </Modal>
  )
}
