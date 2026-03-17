import { useNavigate } from 'react-router-dom'
import { type WorkoutSession } from '@/types'
import { useAppStore } from '@/hooks/useAppStore'
import { formatDayOfWeek, formatMonthDay, isToday, toDateString } from '@/lib/dateUtils'
import { MuscleGroupBadge } from './MuscleGroupBadge'

interface Props {
  date: Date
  sessions: WorkoutSession[]
  onNewSession: (date: string) => void
}

export function WeekDayCard({ date, sessions, onNewSession }: Props) {
  const { state } = useAppStore()
  const navigate = useNavigate()
  const dateStr = toDateString(date)
  const today = isToday(dateStr)

  return (
    <div className={`border-b border-notion-border last:border-0 ${today ? 'bg-notion-bg' : ''}`}>
      {/* Day header */}
      <div className="flex items-center gap-2 px-4 py-2.5">
        <div className={`flex flex-col items-center w-8 shrink-0`}>
          <span className={`text-[10px] uppercase tracking-wider font-medium ${today ? 'text-notion-accent' : 'text-notion-text-secondary'}`}>
            {formatDayOfWeek(date)}
          </span>
          <span className={`text-sm font-semibold leading-tight ${today ? 'text-notion-accent' : 'text-notion-text'}`}>
            {date.getDate()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {sessions.length === 0 ? (
            <span className="text-sm text-notion-text-tertiary">Rest day</span>
          ) : (
            <div className="flex flex-col gap-1">
              {sessions.map(session => {
                const groups = [...new Set(
                  session.exercises
                    .map(ex => state.exercises.find(e => e.id === ex.exerciseId)?.muscleGroup)
                    .filter(Boolean)
                )]
                const exerciseCount = session.exercises.length
                const completed = session.exercises.filter(ex => ex.isCompleted).length

                return (
                  <button
                    key={session.id}
                    onClick={() => navigate(`/session/${session.id}`)}
                    className="flex items-start gap-2 text-left hover:bg-notion-bg-hover rounded-md px-2 py-1.5 -mx-2 transition-colors w-full group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-0.5 ${session.completedAt ? 'bg-notion-green' : 'bg-notion-accent'}`} />
                        <span className="text-sm font-medium text-notion-text truncate">
                          {session.completedAt ? 'Completed' : 'In progress'}
                        </span>
                        {exerciseCount > 0 && (
                          <span className="text-xs text-notion-text-secondary">
                            {completed}/{exerciseCount} exercises
                          </span>
                        )}
                      </div>
                      {groups.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 ml-3">
                          {(groups as NonNullable<typeof groups[0]>[]).slice(0, 4).map(g => (
                            <MuscleGroupBadge key={g} group={g} />
                          ))}
                          {groups.length > 4 && (
                            <span className="text-xs text-notion-text-secondary">+{groups.length - 4}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-notion-text-tertiary text-xs group-hover:text-notion-text-secondary transition-colors shrink-0 mt-0.5">→</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <button
          onClick={() => onNewSession(dateStr)}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-md text-notion-text-tertiary hover:text-notion-text hover:bg-notion-bg-hover transition-colors text-base"
          aria-label={`Add session on ${formatMonthDay(date)}`}
        >
          +
        </button>
      </div>
    </div>
  )
}
