import { useState } from 'react'
import { useAppStore } from '@/hooks/useAppStore'
import { PageHeader } from '@/components/layout/PageHeader'
import { ExerciseProgressChart } from '@/components/dashboard/ExerciseProgressChart'
import { PRSummaryCard } from '@/components/dashboard/PRSummaryCard'
import { getExerciseHistory } from '@/store/selectors'
import { EmptyState } from '@/components/ui'

export function Dashboard() {
  const { state } = useAppStore()
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null)

  // Only show exercises that have at least one session
  const trackedExerciseIds = [...new Set(
    state.sessions.flatMap(s => s.exercises.map(ex => ex.exerciseId))
  )]

  const exercisesWithHistory = state.exercises.filter(e => trackedExerciseIds.includes(e.id))

  const selectedHistory = selectedExerciseId
    ? getExerciseHistory(state, selectedExerciseId)
    : []

  const prList = Object.values(state.prs)
    .sort((a, b) => new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime())

  return (
    <div>
      <PageHeader title="Progress" />

      <div className="page-container pt-4 flex flex-col gap-4">
        {/* Exercise progress chart */}
        <div className="card overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-sm font-semibold text-notion-text mb-3">Weight Progress</h2>

            {exercisesWithHistory.length === 0 ? (
              <EmptyState
                icon="📈"
                title="No data yet"
                description="Log workouts to see your progress over time."
              />
            ) : (
              <>
                {/* Exercise selector */}
                <div className="mb-3">
                  <select
                    value={selectedExerciseId ?? ''}
                    onChange={e => setSelectedExerciseId(e.target.value || null)}
                    className="w-full bg-notion-bg border border-notion-border rounded-md px-3 py-2 text-sm text-notion-text focus:border-notion-text transition-colors"
                  >
                    <option value="">Select an exercise...</option>
                    {exercisesWithHistory.map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))}
                  </select>
                </div>

                {selectedExerciseId && (
                  <ExerciseProgressChart entries={selectedHistory} />
                )}
                {!selectedExerciseId && (
                  <p className="text-sm text-notion-text-secondary text-center py-8">
                    Select an exercise to view its progress chart
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* PRs */}
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-notion-border">
            <h2 className="text-sm font-semibold text-notion-text">Personal Records</h2>
          </div>
          {prList.length === 0 ? (
            <EmptyState
              icon="🏆"
              title="No PRs yet"
              description="Log sets to track your personal records."
            />
          ) : (
            <div className="px-4">
              {prList.map(pr => (
                <PRSummaryCard key={pr.exerciseId} pr={pr} />
              ))}
            </div>
          )}
        </div>

        {/* Session count */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Sessions', value: state.sessions.length },
            { label: 'Exercises Tracked', value: trackedExerciseIds.length },
            { label: 'Personal Records', value: prList.length },
          ].map(stat => (
            <div key={stat.label} className="card px-3 py-3 text-center">
              <p className="text-xl font-semibold text-notion-text">{stat.value}</p>
              <p className="text-[11px] text-notion-text-secondary mt-0.5 leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
