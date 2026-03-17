import { type PersonalRecord } from '@/types'
import { useAppStore } from '@/hooks/useAppStore'
import { WeightUnit } from '@/types'
import { toLbs } from '@/lib/prUtils'
import { formatShortDate } from '@/lib/dateUtils'

interface Props {
  pr: PersonalRecord
}

export function PRSummaryCard({ pr }: Props) {
  const { state } = useAppStore()
  const exercise = state.exercises.find(e => e.id === pr.exerciseId)
  if (!exercise) return null

  const useLbs = state.settings.weightUnit === WeightUnit.LBS
  const displayWeight = useLbs
    ? `${Math.round(toLbs(pr.bestWeightKg))} lbs`
    : `${Math.round(pr.bestWeightKg * 10) / 10} kg`

  return (
    <div className="flex items-center justify-between py-3 border-b border-notion-border last:border-0">
      <div>
        <p className="text-sm font-medium text-notion-text">{exercise.name}</p>
        <p className="text-xs text-notion-text-secondary">{formatShortDate(pr.achievedAt.slice(0, 10))}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-notion-text">{displayWeight}</p>
        <p className="text-xs text-notion-text-secondary">{pr.bestReps} reps</p>
      </div>
    </div>
  )
}
