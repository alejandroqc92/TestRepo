import { type MuscleGroup } from '@/types'
import { MuscleGroupBadge } from './MuscleGroupBadge'

interface Props {
  missingGroups: MuscleGroup[]
}

export function MissingGroupsAlert({ missingGroups }: Props) {
  if (missingGroups.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2.5 bg-notion-green-light rounded-lg text-sm text-notion-green">
        <span>✓</span>
        <span className="font-medium">All required muscle groups covered this week</span>
      </div>
    )
  }

  return (
    <div className="px-3 py-2.5 bg-notion-yellow-light rounded-lg">
      <p className="text-xs font-medium text-notion-yellow mb-1.5">Still needed this week</p>
      <div className="flex flex-wrap gap-1">
        {missingGroups.map(g => (
          <MuscleGroupBadge key={g} group={g} />
        ))}
      </div>
    </div>
  )
}
