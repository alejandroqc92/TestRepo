import { useState, useEffect, useRef } from 'react'
import { type WorkoutSession } from '@/types'
import { useAppStore } from './useAppStore'

export function useTimer(session: WorkoutSession) {
  const { dispatch } = useAppStore()
  const [displaySeconds, setDisplaySeconds] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isRunning = Boolean(session.timerStartedAt)

  // Recalculate display every second
  useEffect(() => {
    const calc = () => {
      let total = session.timerElapsedSeconds
      if (session.timerStartedAt) {
        const delta = Math.floor((Date.now() - new Date(session.timerStartedAt).getTime()) / 1000)
        total += Math.max(0, delta)
      }
      setDisplaySeconds(total)
    }

    calc()
    intervalRef.current = setInterval(calc, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [session.timerStartedAt, session.timerElapsedSeconds])

  const start = () => {
    dispatch({ type: 'START_TIMER', payload: { sessionId: session.id, now: new Date().toISOString() } })
  }

  const pause = () => {
    dispatch({ type: 'PAUSE_TIMER', payload: { sessionId: session.id, now: new Date().toISOString() } })
  }

  const reset = () => {
    dispatch({ type: 'RESET_TIMER', payload: { sessionId: session.id } })
  }

  return { displaySeconds, isRunning, start, pause, reset }
}
