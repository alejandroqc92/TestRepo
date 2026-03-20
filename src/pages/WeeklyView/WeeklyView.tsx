import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/hooks/useAppStore'
import { useWeekRange } from '@/hooks/useWeekRange'
import { getWeekDays, toDateString, formatWeekRange } from '@/lib/dateUtils'
import { getSessionsForDate, getWeekSummary } from '@/store/selectors'
import { WeekDayCard } from '@/components/weekly/WeekDayCard'
import { MissingGroupsAlert } from '@/components/weekly/MissingGroupsAlert'
import { SettingsModal } from './SettingsModal'

export function WeeklyView() {
  const { state, dispatch } = useAppStore()
  const navigate = useNavigate()
  const { weekStart, goToPrev, goToNext, goToToday, isCurrentWeek } = useWeekRange()
  const [showSettings, setShowSettings] = useState(false)

  const days = getWeekDays(weekStart)
  const summary = getWeekSummary(state, weekStart)

  const createSession = (date: string) => {
    const id = uuidv4()
    dispatch({ type: 'CREATE_SESSION', payload: { id, date } })
    navigate(`/session/${id}`)
  }

  return (
    <div>
      {/* Header */}
      <div className="pt-[env(safe-area-inset-top)] sticky top-0 z-30 bg-notion-bg/95 backdrop-blur-sm border-b border-notion-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <div className="flex-1">
            <h1 className="text-base font-semibold text-notion-text">Workout Tracker</h1>
            <p className="text-xs text-notion-text-secondary">{formatWeekRange(weekStart)}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={goToPrev}
              className="w-8 h-8 flex items-center justify-center rounded-md text-notion-text-secondary hover:bg-notion-bg-hover transition-colors"
            >←</button>
            {!isCurrentWeek && (
              <button
                onClick={goToToday}
                className="px-2 py-1 text-xs font-medium text-notion-accent hover:bg-notion-accent-light rounded-md transition-colors"
              >Today</button>
            )}
            <button
              onClick={goToNext}
              className="w-8 h-8 flex items-center justify-center rounded-md text-notion-text-secondary hover:bg-notion-bg-hover transition-colors"
            >→</button>
            <button
              onClick={() => setShowSettings(true)}
              className="w-8 h-8 flex items-center justify-center rounded-md text-notion-text-secondary hover:bg-notion-bg-hover transition-colors ml-1"
              aria-label="Settings"
            >⚙</button>
          </div>
        </div>
      </div>

      <div className="page-container pt-4 flex flex-col gap-3">
        {/* Missing groups alert */}
        {state.settings.requiredMuscleGroups.length > 0 && (
          <MissingGroupsAlert missingGroups={summary.missingGroups} />
        )}

        {/* Week days */}
        <div className="card overflow-hidden">
          {days.map(day => (
            <WeekDayCard
              key={toDateString(day)}
              date={day}
              sessions={getSessionsForDate(state.sessions, toDateString(day))}
              onNewSession={createSession}
            />
          ))}
        </div>

        {/* Week stats */}
        {summary.totalSessions > 0 && (
          <div className="flex gap-3">
            <div className="flex-1 card px-3 py-3 text-center">
              <p className="text-xl font-semibold text-notion-text">{summary.totalSessions}</p>
              <p className="text-xs text-notion-text-secondary mt-0.5">Sessions</p>
            </div>
            <div className="flex-1 card px-3 py-3 text-center">
              <p className="text-xl font-semibold text-notion-text">{summary.coveredGroups.length}</p>
              <p className="text-xs text-notion-text-secondary mt-0.5">Muscle groups</p>
            </div>
          </div>
        )}
      </div>

      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}
