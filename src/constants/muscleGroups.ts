import { MuscleGroup } from '@/types'

export const MUSCLE_GROUP_COLORS: Record<MuscleGroup, { bg: string; text: string }> = {
  [MuscleGroup.Chest]:      { bg: 'bg-blue-50',   text: 'text-blue-700' },
  [MuscleGroup.Back]:       { bg: 'bg-indigo-50',  text: 'text-indigo-700' },
  [MuscleGroup.Shoulders]:  { bg: 'bg-violet-50',  text: 'text-violet-700' },
  [MuscleGroup.Biceps]:     { bg: 'bg-purple-50',  text: 'text-purple-700' },
  [MuscleGroup.Triceps]:    { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700' },
  [MuscleGroup.Forearms]:   { bg: 'bg-pink-50',    text: 'text-pink-700' },
  [MuscleGroup.Core]:       { bg: 'bg-orange-50',  text: 'text-orange-700' },
  [MuscleGroup.Glutes]:     { bg: 'bg-rose-50',    text: 'text-rose-700' },
  [MuscleGroup.Quads]:      { bg: 'bg-green-50',   text: 'text-green-700' },
  [MuscleGroup.Hamstrings]: { bg: 'bg-teal-50',    text: 'text-teal-700' },
  [MuscleGroup.Calves]:     { bg: 'bg-cyan-50',    text: 'text-cyan-700' },
  [MuscleGroup.FullBody]:   { bg: 'bg-slate-50',   text: 'text-slate-700' },
  [MuscleGroup.Cardio]:     { bg: 'bg-red-50',     text: 'text-red-700' },
}

export const ALL_MUSCLE_GROUPS = Object.values(MuscleGroup)

export const DEFAULT_REQUIRED_GROUPS: MuscleGroup[] = [
  MuscleGroup.Chest,
  MuscleGroup.Back,
  MuscleGroup.Shoulders,
  MuscleGroup.Core,
  MuscleGroup.Quads,
  MuscleGroup.Hamstrings,
]
