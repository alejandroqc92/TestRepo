import { type MuscleGroup } from '@/types'
import { MUSCLE_GROUP_COLORS } from '@/constants/muscleGroups'

export function MuscleGroupBadge({ group }: { group: MuscleGroup }) {
  const colors = MUSCLE_GROUP_COLORS[group]
  return (
    <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
      {group}
    </span>
  )
}
