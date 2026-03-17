export const MuscleGroup = {
  Chest:      'Chest',
  Back:       'Back',
  Shoulders:  'Shoulders',
  Biceps:     'Biceps',
  Triceps:    'Triceps',
  Forearms:   'Forearms',
  Core:       'Core',
  Glutes:     'Glutes',
  Quads:      'Quads',
  Hamstrings: 'Hamstrings',
  Calves:     'Calves',
  FullBody:   'Full Body',
  Cardio:     'Cardio',
} as const
export type MuscleGroup = (typeof MuscleGroup)[keyof typeof MuscleGroup]

export const WeightUnit = {
  KG:  'kg',
  LBS: 'lbs',
} as const
export type WeightUnit = (typeof WeightUnit)[keyof typeof WeightUnit]

export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  notes?: string
  isCustom: boolean
  createdAt: string
}

export interface SetEntry {
  setNumber: number
  reps: number
  weight: number
  unit: WeightUnit
  isPR: boolean
  completedAt?: string
}

export const RunEnvironment = {
  Outdoor:   'outdoor',
  Treadmill: 'treadmill',
} as const
export type RunEnvironment = (typeof RunEnvironment)[keyof typeof RunEnvironment]

export interface RunEntry {
  id: string
  environment: RunEnvironment
  durationMinutes: number
  distanceMiles?: number
  avgPaceMinPerMile?: number // auto-calculated: durationMinutes / distanceMiles
  speedMph?: number          // treadmill only
  inclinePercent?: number    // treadmill only
  notes?: string
  loggedAt: string
}

export interface SessionExercise {
  id: string
  exerciseId: string
  sets: SetEntry[]
  isCompleted: boolean
  order: number
  notes?: string
  targetSets?: number
  runEntries?: RunEntry[]
}

export interface WorkoutSession {
  id: string
  date: string // ISO date string YYYY-MM-DD
  exercises: SessionExercise[]
  timerStartedAt?: string // ISO timestamp when timer last started
  timerElapsedSeconds: number // accumulated seconds before last start
  isActive: boolean
  completedAt?: string
  notes?: string
}

export interface PersonalRecord {
  exerciseId: string
  bestWeightKg: number
  bestReps: number
  achievedAt: string
  sessionId: string
}

export interface UserSettings {
  weightUnit: WeightUnit
  requiredMuscleGroups: MuscleGroup[]
  weekStartsOn: 0 | 1 // 0 = Sunday, 1 = Monday
}

export interface AppState {
  exercises: Exercise[]
  sessions: WorkoutSession[]
  prs: Record<string, PersonalRecord> // keyed by exerciseId
  settings: UserSettings
  schemaVersion: number
}
