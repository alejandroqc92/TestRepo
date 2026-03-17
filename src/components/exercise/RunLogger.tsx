import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { type RunEntry, RunEnvironment } from '@/types'
import { Button, Input } from '@/components/ui'

interface Props {
  entries: RunEntry[]
  onAdd: (entry: RunEntry) => void
  onUpdate: (entryId: string, entry: RunEntry) => void
  onDelete: (entryId: string) => void
}

function formatPace(durationMinutes: number, distanceMiles: number): string {
  const pace = durationMinutes / distanceMiles
  const mins = Math.floor(pace)
  const secs = Math.round((pace - mins) * 60)
  return `${mins}:${secs.toString().padStart(2, '0')} / mi`
}

export function RunLogger({ entries, onAdd, onUpdate, onDelete }: Props) {
  const [env, setEnv] = useState<RunEntry['environment']>(RunEnvironment.Outdoor)
  const [duration, setDuration] = useState('')
  const [distance, setDistance] = useState('')
  const [speed, setSpeed] = useState('')
  const [incline, setIncline] = useState('')
  const [notes, setNotes] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFields, setEditFields] = useState<Partial<RunEntry>>({})

  const computedPace =
    env === RunEnvironment.Outdoor &&
    duration && distance &&
    parseFloat(duration) > 0 && parseFloat(distance) > 0
      ? formatPace(parseFloat(duration), parseFloat(distance))
      : null

  const handleAdd = () => {
    const dur = parseFloat(duration)
    if (!dur || dur <= 0) return
    const dist = distance ? parseFloat(distance) || undefined : undefined
    const entry: RunEntry = {
      id: uuid(),
      environment: env,
      durationMinutes: dur,
      distanceMiles: dist,
      avgPaceMinPerMile: dist ? dur / dist : undefined,
      speedMph: env === RunEnvironment.Treadmill && speed ? parseFloat(speed) || undefined : undefined,
      inclinePercent: env === RunEnvironment.Treadmill && incline ? parseFloat(incline) || undefined : undefined,
      notes: notes.trim() || undefined,
      loggedAt: new Date().toISOString(),
    }
    onAdd(entry)
    setDuration('')
    setDistance('')
    setSpeed('')
    setIncline('')
    setNotes('')
  }

  const startEdit = (entry: RunEntry) => {
    setEditingId(entry.id)
    setEditFields({ ...entry })
  }

  const saveEdit = (id: string) => {
    const dur = editFields.durationMinutes
    if (!dur || dur <= 0) return
    const dist = editFields.distanceMiles
    const updated: RunEntry = {
      ...(editFields as RunEntry),
      avgPaceMinPerMile: dist && dur ? dur / dist : undefined,
    }
    onUpdate(id, updated)
    setEditingId(null)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Entry list */}
      {entries.length > 0 && (
        <div className="card overflow-hidden">
          <div className="grid grid-cols-[5rem_1fr_1fr_1fr_auto] gap-2 px-3 py-2 bg-notion-bg-secondary border-b border-notion-border">
            <span className="text-xs text-notion-text-tertiary font-medium uppercase">Type</span>
            <span className="text-xs text-notion-text-tertiary font-medium uppercase">Duration</span>
            <span className="text-xs text-notion-text-tertiary font-medium uppercase">Distance</span>
            <span className="text-xs text-notion-text-tertiary font-medium uppercase">Pace / Speed</span>
            <span />
          </div>
          {entries.map(entry => (
            <div
              key={entry.id}
              className="grid grid-cols-[5rem_1fr_1fr_1fr_auto] gap-2 items-center px-3 py-2.5 border-b border-notion-border last:border-0"
            >
              {editingId === entry.id ? (
                <>
                  <span className="text-xs text-notion-text-secondary capitalize">{entry.environment}</span>
                  <Input
                    type="number"
                    value={String(editFields.durationMinutes ?? '')}
                    onChange={e => setEditFields(f => ({ ...f, durationMinutes: parseFloat(e.target.value) || 0 }))}
                    suffix="min"
                    className="py-1 text-sm"
                    autoFocus
                  />
                  <Input
                    type="number"
                    value={String(editFields.distanceMiles ?? '')}
                    onChange={e => {
                      const v = parseFloat(e.target.value)
                      setEditFields(f => ({ ...f, distanceMiles: v > 0 ? v : undefined }))
                    }}
                    suffix="mi"
                    className="py-1 text-sm"
                  />
                  {entry.environment === RunEnvironment.Treadmill ? (
                    <Input
                      type="number"
                      value={String(editFields.speedMph ?? '')}
                      onChange={e => {
                        const v = parseFloat(e.target.value)
                        setEditFields(f => ({ ...f, speedMph: v > 0 ? v : undefined }))
                      }}
                      suffix="mph"
                      className="py-1 text-sm"
                    />
                  ) : (
                    <span className="text-xs text-notion-text-tertiary">—</span>
                  )}
                  <div className="flex gap-1">
                    <button
                      onClick={() => saveEdit(entry.id)}
                      className="text-notion-green text-sm font-medium px-1"
                    >✓</button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-notion-text-secondary text-sm px-1"
                    >✕</button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-xs text-notion-text-secondary capitalize">{entry.environment}</span>
                  <span className="text-sm text-notion-text">{entry.durationMinutes} min</span>
                  <span className="text-sm text-notion-text">
                    {entry.distanceMiles != null ? `${entry.distanceMiles} mi` : '—'}
                  </span>
                  <span className="text-sm text-notion-text">
                    {entry.environment === RunEnvironment.Outdoor && entry.distanceMiles
                      ? formatPace(entry.durationMinutes, entry.distanceMiles)
                      : entry.environment === RunEnvironment.Treadmill && entry.speedMph
                      ? `${entry.speedMph} mph`
                      : '—'}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(entry)}
                      className="text-notion-text-tertiary hover:text-notion-text text-xs px-1 py-0.5 rounded hover:bg-notion-bg-hover transition-colors"
                    >Edit</button>
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="text-notion-text-tertiary hover:text-notion-red text-xs px-1 py-0.5 rounded hover:bg-notion-red-light transition-colors"
                    >Del</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Log form */}
      <div className="card p-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-notion-text-secondary uppercase tracking-wide">Log Run</span>
          <div className="flex rounded-md overflow-hidden border border-notion-border">
            {Object.values(RunEnvironment).map(e => (
              <button
                key={e}
                onClick={() => setEnv(e)}
                className={`px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                  env === e
                    ? 'bg-notion-text text-white'
                    : 'bg-notion-bg text-notion-text-secondary hover:bg-notion-bg-hover'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Duration"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            suffix="min"
            className="flex-1"
            min="0"
          />
          {env === RunEnvironment.Treadmill && (
            <Input
              type="number"
              placeholder="Speed"
              value={speed}
              onChange={e => setSpeed(e.target.value)}
              suffix="mph"
              className="flex-1"
              min="0"
              step="0.1"
            />
          )}
          {env === RunEnvironment.Treadmill && (
            <Input
              type="number"
              placeholder="Incline"
              value={incline}
              onChange={e => setIncline(e.target.value)}
              suffix="%"
              className="flex-1"
              min="0"
              step="0.5"
            />
          )}
          <Input
            type="number"
            placeholder="Distance"
            value={distance}
            onChange={e => setDistance(e.target.value)}
            suffix="mi"
            className="flex-1"
            min="0"
            step="0.1"
          />
        </div>

        {computedPace && (
          <p className="text-xs text-notion-text-secondary">
            Pace: <span className="font-medium text-notion-text">{computedPace}</span>
          </p>
        )}

        <Input
          placeholder="Notes (optional)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />

        <Button
          onClick={handleAdd}
          variant="primary"
          size="md"
          disabled={!duration}
        >
          + Log Run
        </Button>
      </div>
    </div>
  )
}
