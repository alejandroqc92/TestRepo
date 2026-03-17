import { type WorkoutSession } from '@/types'
import { useTimer } from '@/hooks/useTimer'
import { formatElapsed } from '@/lib/dateUtils'
import { Button } from '@/components/ui'

export function SessionTimer({ session }: { session: WorkoutSession }) {
  const { displaySeconds, isRunning, start, pause, reset } = useTimer(session)

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-sm font-medium text-notion-text tabular-nums w-14">
        {formatElapsed(displaySeconds)}
      </span>
      <Button
        size="sm"
        variant="ghost"
        onClick={isRunning ? pause : start}
        className="px-2"
      >
        {isRunning ? '⏸' : '▶'}
      </Button>
      {displaySeconds > 0 && (
        <Button size="sm" variant="ghost" onClick={reset} className="px-2 text-notion-text-secondary">
          ↺
        </Button>
      )}
    </div>
  )
}
