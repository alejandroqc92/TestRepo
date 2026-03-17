import { type AppState, type WorkoutSession, MuscleGroup } from '@/types'
import { getWeekStart, getWeekDays, toDateString } from '@/lib/dateUtils'

export function getSessionsForWeek(
  sessions: AppState['sessions'],
  weekStart: Date,
): WorkoutSession[] {
  const days = getWeekDays(weekStart).map(d => toDateString(d))
  return sessions.filter(s => days.includes(s.date))
}

export function getSessionsForDate(
  sessions: AppState['sessions'],
  dateStr: string,
): WorkoutSession[] {
  return sessions.filter(s => s.date === dateStr)
}

export interface WeekSummary {
  coveredGroups: MuscleGroup[]
  missingGroups: MuscleGroup[]
  totalSessions: number
}

export function getWeekSummary(state: AppState, weekStart: Date): WeekSummary {
  const weekSessions = getSessionsForWeek(state.sessions, weekStart)

  const covered = new Set<MuscleGroup>()
  for (const session of weekSessions) {
    for (const sessionEx of session.exercises) {
      const exercise = state.exercises.find(e => e.id === sessionEx.exerciseId)
      if (exercise) covered.add(exercise.muscleGroup)
    }
  }

  const coveredGroups = Array.from(covered)
  const missingGroups = state.settings.requiredMuscleGroups.filter(g => !covered.has(g))

  return {
    coveredGroups,
    missingGroups,
    totalSessions: weekSessions.length,
  }
}

export interface ExerciseHistoryEntry {
  sessionId: string
  date: string
  maxWeightLbs: number
  maxWeightKg: number
  totalVolume: number // weight * reps summed
  topSet: { weight: number; reps: number; unit: string } | null
}

export function getExerciseHistory(
  state: AppState,
  exerciseId: string,
): ExerciseHistoryEntry[] {
  const entries: ExerciseHistoryEntry[] = []

  const sorted = [...state.sessions].sort((a, b) => a.date.localeCompare(b.date))

  for (const session of sorted) {
    const sessionEx = session.exercises.find(ex => ex.exerciseId === exerciseId)
    if (!sessionEx || sessionEx.sets.length === 0) continue

    let maxWeightKg = 0
    let totalVolume = 0
    let topSet: ExerciseHistoryEntry['topSet'] = null

    for (const set of sessionEx.sets) {
      const kg = set.unit === 'kg' ? set.weight : set.weight * 0.453592
      const lbs = set.unit === 'lbs' ? set.weight : set.weight / 0.453592
      if (kg > maxWeightKg) {
        maxWeightKg = kg
        topSet = { weight: set.weight, reps: set.reps, unit: set.unit }
      }
      totalVolume += lbs * set.reps
    }

    entries.push({
      sessionId: session.id,
      date: session.date,
      maxWeightLbs: maxWeightKg / 0.453592,
      maxWeightKg,
      totalVolume,
      topSet,
    })
  }

  return entries
}

export function getWeekStartForToday(weekStartsOn: 0 | 1): Date {
  return getWeekStart(new Date(), weekStartsOn)
}
