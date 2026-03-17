import { type SetEntry, WeightUnit } from '@/types'

const LBS_TO_KG = 0.453592

export function toKg(weight: number, unit: WeightUnit): number {
  return unit === WeightUnit.KG ? weight : weight * LBS_TO_KG
}

export function toLbs(weightKg: number): number {
  return weightKg / LBS_TO_KG
}

/** Epley 1RM estimate, normalized to kg */
export function epley1RM(weight: number, reps: number, unit: WeightUnit): number {
  const kg = toKg(weight, unit)
  if (reps <= 0) return 0
  if (reps === 1) return kg
  return kg * (1 + reps / 30)
}

/** Returns true if newSet beats existing PR (or there is no existing PR) */
export function isBetterThan(
  newSet: SetEntry,
  currentBestKg: number | undefined,
): boolean {
  if (!currentBestKg || currentBestKg <= 0) return newSet.weight > 0 && newSet.reps > 0
  const newEstimate = epley1RM(newSet.weight, newSet.reps, newSet.unit)
  return newEstimate > currentBestKg
}
