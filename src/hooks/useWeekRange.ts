import { useState, useCallback } from 'react'
import { getWeekStart, addDays } from '@/lib/dateUtils'
import { useAppStore } from './useAppStore'

export function useWeekRange() {
  const { state } = useAppStore()
  const { weekStartsOn } = state.settings

  const [weekStart, setWeekStart] = useState<Date>(() =>
    getWeekStart(new Date(), weekStartsOn),
  )

  const goToPrev = useCallback(() => {
    setWeekStart(prev => addDays(prev, -7))
  }, [])

  const goToNext = useCallback(() => {
    setWeekStart(prev => addDays(prev, 7))
  }, [])

  const goToToday = useCallback(() => {
    setWeekStart(getWeekStart(new Date(), weekStartsOn))
  }, [weekStartsOn])

  const isCurrentWeek =
    weekStart.getTime() === getWeekStart(new Date(), weekStartsOn).getTime()

  return { weekStart, goToPrev, goToNext, goToToday, isCurrentWeek }
}
