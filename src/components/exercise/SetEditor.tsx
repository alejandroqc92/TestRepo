import { useState } from 'react'
import { type SetEntry, WeightUnit } from '@/types'
import { Button, Input } from '@/components/ui'

interface Props {
  sets: SetEntry[]
  defaultUnit: WeightUnit
  onAdd: (set: SetEntry) => void
  onUpdate: (index: number, set: SetEntry) => void
  onDelete: (index: number) => void
}

export function SetEditor({ sets, defaultUnit, onAdd, onUpdate, onDelete }: Props) {
  const [newWeight, setNewWeight] = useState('')
  const [newReps, setNewReps] = useState('')
  const [unit, setUnit] = useState<WeightUnit>(defaultUnit)
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editWeight, setEditWeight] = useState('')
  const [editReps, setEditReps] = useState('')

  const handleAdd = () => {
    const weight = parseFloat(newWeight)
    const reps = parseInt(newReps)
    if (!weight || !reps || weight <= 0 || reps <= 0) return
    onAdd({
      setNumber: sets.length + 1,
      weight,
      reps,
      unit,
      isPR: false,
      completedAt: new Date().toISOString(),
    })
    setNewWeight('')
    setNewReps('')
  }

  const startEdit = (idx: number) => {
    setEditingIdx(idx)
    setEditWeight(String(sets[idx].weight))
    setEditReps(String(sets[idx].reps))
  }

  const saveEdit = (idx: number) => {
    const weight = parseFloat(editWeight)
    const reps = parseInt(editReps)
    if (!weight || !reps || weight <= 0 || reps <= 0) return
    onUpdate(idx, { ...sets[idx], weight, reps })
    setEditingIdx(null)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Set list */}
      {sets.length > 0 && (
        <div className="card overflow-hidden">
          <div className="grid grid-cols-[2rem_1fr_1fr_auto] gap-2 px-3 py-2 bg-notion-bg-secondary border-b border-notion-border">
            <span className="text-xs text-notion-text-tertiary font-medium">#</span>
            <span className="text-xs text-notion-text-tertiary font-medium uppercase">Weight</span>
            <span className="text-xs text-notion-text-tertiary font-medium uppercase">Reps</span>
            <span />
          </div>
          {sets.map((set, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-[2rem_1fr_1fr_auto] gap-2 items-center px-3 py-2.5 border-b border-notion-border last:border-0 ${
                set.isPR ? 'bg-notion-accent-light' : ''
              }`}
            >
              <span className="text-xs text-notion-text-secondary">{set.setNumber}</span>

              {editingIdx === idx ? (
                <>
                  <Input
                    type="number"
                    value={editWeight}
                    onChange={e => setEditWeight(e.target.value)}
                    suffix={set.unit}
                    className="py-1 text-sm"
                    autoFocus
                  />
                  <Input
                    type="number"
                    value={editReps}
                    onChange={e => setEditReps(e.target.value)}
                    className="py-1 text-sm"
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => saveEdit(idx)}
                      className="text-notion-green text-sm font-medium px-1"
                    >✓</button>
                    <button
                      onClick={() => setEditingIdx(null)}
                      className="text-notion-text-secondary text-sm px-1"
                    >✕</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-notion-text">{set.weight}</span>
                    <span className="text-xs text-notion-text-secondary">{set.unit}</span>
                    {set.isPR && (
                      <span className="text-[10px] font-bold text-notion-accent bg-notion-accent-light border border-notion-accent/20 px-1 py-0.5 rounded uppercase leading-none">PR</span>
                    )}
                  </div>
                  <span className="text-sm text-notion-text">{set.reps}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(idx)}
                      className="text-notion-text-tertiary hover:text-notion-text text-xs px-1 py-0.5 rounded hover:bg-notion-bg-hover transition-colors"
                    >Edit</button>
                    <button
                      onClick={() => onDelete(idx)}
                      className="text-notion-text-tertiary hover:text-notion-red text-xs px-1 py-0.5 rounded hover:bg-notion-red-light transition-colors"
                    >Del</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add set form */}
      <div className="card p-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-notion-text-secondary uppercase tracking-wide">Log Set</span>
          <div className="flex rounded-md overflow-hidden border border-notion-border">
            {Object.values(WeightUnit).map(u => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  unit === u
                    ? 'bg-notion-text text-white'
                    : 'bg-notion-bg text-notion-text-secondary hover:bg-notion-bg-hover'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Weight"
            value={newWeight}
            onChange={e => setNewWeight(e.target.value)}
            suffix={unit}
            className="flex-1"
            min="0"
            step="2.5"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <Input
            type="number"
            placeholder="Reps"
            value={newReps}
            onChange={e => setNewReps(e.target.value)}
            className="flex-1"
            min="1"
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <Button
            onClick={handleAdd}
            variant="primary"
            size="md"
            className="shrink-0 px-4"
            disabled={!newWeight || !newReps}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  )
}
