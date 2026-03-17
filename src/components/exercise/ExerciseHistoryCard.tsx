import { type ExerciseHistoryEntry } from '@/store/selectors'
import { type RunEntry } from '@/types'
import { formatShortDate } from '@/lib/dateUtils'

interface RunHistoryItem {
  date: string
  sessionId: string
  entry: RunEntry
}

function formatPace(durationMinutes: number, distanceMiles: number): string {
  const pace = durationMinutes / distanceMiles
  const mins = Math.floor(pace)
  const secs = Math.round((pace - mins) * 60)
  return `${mins}:${secs.toString().padStart(2, '0')} / mi`
}

interface Props {
  entries: ExerciseHistoryEntry[]
  runHistory?: RunHistoryItem[]
}

export function ExerciseHistoryCard({ entries, runHistory }: Props) {
  if (runHistory && runHistory.length > 0) {
    return (
      <div className="card overflow-hidden">
        <div className="grid grid-cols-[5rem_1fr_1fr_1fr] gap-2 px-3 py-2 bg-notion-bg-secondary border-b border-notion-border">
          <span className="text-xs text-notion-text-tertiary font-medium uppercase">Date</span>
          <span className="text-xs text-notion-text-tertiary font-medium uppercase">Type</span>
          <span className="text-xs text-notion-text-tertiary font-medium uppercase">Duration</span>
          <span className="text-xs text-notion-text-tertiary font-medium uppercase">Pace / Speed</span>
        </div>
        {runHistory.map((item, idx) => {
          const { entry } = item
          const paceOrSpeed =
            entry.environment === 'outdoor' && entry.distanceMiles
              ? formatPace(entry.durationMinutes, entry.distanceMiles)
              : entry.environment === 'treadmill' && entry.speedMph
              ? `${entry.speedMph} mph`
              : '—'
          return (
            <div
              key={`${item.sessionId}-${idx}`}
              className="grid grid-cols-[5rem_1fr_1fr_1fr] gap-2 items-center px-3 py-2.5 border-b border-notion-border last:border-0"
            >
              <span className="text-xs text-notion-text-secondary">{formatShortDate(item.date)}</span>
              <span className="text-xs text-notion-text-secondary capitalize">{entry.environment}</span>
              <span className="text-sm text-notion-text">{entry.durationMinutes} min</span>
              <span className="text-sm text-notion-text">{paceOrSpeed}</span>
            </div>
          )
        })}
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <p className="text-sm text-notion-text-secondary text-center py-4">No previous sessions</p>
    )
  }

  const recent = [...entries].reverse().slice(0, 8)

  return (
    <div className="card overflow-hidden">
      <div className="px-3 py-2 border-b border-notion-border bg-notion-bg-secondary">
        <span className="text-xs font-medium text-notion-text-secondary uppercase tracking-wide">History</span>
      </div>
      {recent.map(entry => (
        <div key={entry.sessionId} className="flex items-center justify-between px-3 py-2.5 border-b border-notion-border last:border-0">
          <span className="text-xs text-notion-text-secondary">{formatShortDate(entry.date)}</span>
          {entry.topSet ? (
            <span className="text-sm font-medium text-notion-text">
              {entry.topSet.weight} {entry.topSet.unit} × {entry.topSet.reps}
            </span>
          ) : (
            <span className="text-xs text-notion-text-tertiary">—</span>
          )}
        </div>
      ))}
    </div>
  )
}
