import { useAppStore } from '@/hooks/useAppStore'
import { useAuth } from '@/store/AuthContext'
import { WeightUnit } from '@/types'
import { Modal, Button } from '@/components/ui'
import { ALL_MUSCLE_GROUPS } from '@/constants/muscleGroups'

interface Props {
  open: boolean
  onClose: () => void
}

export function SettingsModal({ open, onClose }: Props) {
  const { state, dispatch } = useAppStore()
  const { signOut } = useAuth()
  const { settings } = state

  return (
    <Modal open={open} onClose={onClose} title="Settings">
      <div className="flex flex-col gap-5">
        {/* Weight unit */}
        <div>
          <p className="text-xs font-medium text-notion-text-secondary uppercase tracking-wide mb-2">Default Weight Unit</p>
          <div className="flex rounded-lg overflow-hidden border border-notion-border">
            {Object.values(WeightUnit).map(u => (
              <button
                key={u}
                onClick={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { weightUnit: u } })}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  settings.weightUnit === u
                    ? 'bg-notion-text text-white'
                    : 'bg-notion-bg text-notion-text-secondary hover:bg-notion-bg-hover'
                }`}
              >
                {u.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Week starts on */}
        <div>
          <p className="text-xs font-medium text-notion-text-secondary uppercase tracking-wide mb-2">Week Starts On</p>
          <div className="flex rounded-lg overflow-hidden border border-notion-border">
            {(['Sunday', 'Monday'] as const).map((label, idx) => (
              <button
                key={label}
                onClick={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { weekStartsOn: idx as 0 | 1 } })}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  settings.weekStartsOn === idx
                    ? 'bg-notion-text text-white'
                    : 'bg-notion-bg text-notion-text-secondary hover:bg-notion-bg-hover'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Required muscle groups */}
        <div>
          <p className="text-xs font-medium text-notion-text-secondary uppercase tracking-wide mb-1">Required Weekly Muscle Groups</p>
          <p className="text-xs text-notion-text-tertiary mb-3">You'll get a warning if these aren't covered in the current week.</p>
          <div className="flex flex-wrap gap-2">
            {ALL_MUSCLE_GROUPS.map(g => {
              const active = settings.requiredMuscleGroups.includes(g)
              return (
                <button
                  key={g}
                  onClick={() => dispatch({ type: 'TOGGLE_REQUIRED_GROUP', payload: { group: g } })}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all border ${
                    active
                      ? 'border-notion-text bg-notion-text text-white'
                      : 'border-notion-border bg-notion-bg text-notion-text-secondary hover:border-notion-border-dark'
                  }`}
                >
                  {g}
                </button>
              )
            })}
          </div>
        </div>
        <div className="pt-4 mt-4 border-t border-notion-border">
          <Button variant="ghost" size="md" onClick={signOut} className="w-full text-notion-text-secondary">
            Sign out
          </Button>
        </div>
      </div>
    </Modal>
  )
}
