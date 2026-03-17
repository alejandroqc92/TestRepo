import { type Exercise, MuscleGroup } from '@/types'

const e = (id: string, name: string, muscleGroup: MuscleGroup): Exercise => ({
  id,
  name,
  muscleGroup,
  isCustom: false,
  createdAt: '2024-01-01T00:00:00.000Z',
})

export const DEFAULT_EXERCISES: Exercise[] = [
  // Chest
  e('ex-bench-press',       'Bench Press',           MuscleGroup.Chest),
  e('ex-incline-bench',     'Incline Bench Press',   MuscleGroup.Chest),
  e('ex-decline-bench',     'Decline Bench Press',   MuscleGroup.Chest),
  e('ex-dumbbell-fly',      'Dumbbell Fly',          MuscleGroup.Chest),
  e('ex-cable-fly',         'Cable Fly',             MuscleGroup.Chest),
  e('ex-pushup',            'Push-Up',               MuscleGroup.Chest),

  // Back
  e('ex-deadlift',          'Deadlift',              MuscleGroup.Back),
  e('ex-barbell-row',       'Barbell Row',           MuscleGroup.Back),
  e('ex-pullup',            'Pull-Up',               MuscleGroup.Back),
  e('ex-lat-pulldown',      'Lat Pulldown',          MuscleGroup.Back),
  e('ex-seated-cable-row',  'Seated Cable Row',      MuscleGroup.Back),
  e('ex-tbar-row',          'T-Bar Row',             MuscleGroup.Back),

  // Shoulders
  e('ex-ohp',               'Overhead Press',        MuscleGroup.Shoulders),
  e('ex-db-shoulder-press', 'Dumbbell Shoulder Press', MuscleGroup.Shoulders),
  e('ex-lateral-raise',     'Lateral Raise',         MuscleGroup.Shoulders),
  e('ex-front-raise',       'Front Raise',           MuscleGroup.Shoulders),
  e('ex-face-pull',         'Face Pull',             MuscleGroup.Shoulders),

  // Biceps
  e('ex-barbell-curl',      'Barbell Curl',          MuscleGroup.Biceps),
  e('ex-dumbbell-curl',     'Dumbbell Curl',         MuscleGroup.Biceps),
  e('ex-hammer-curl',       'Hammer Curl',           MuscleGroup.Biceps),
  e('ex-preacher-curl',     'Preacher Curl',         MuscleGroup.Biceps),

  // Triceps
  e('ex-tricep-pushdown',   'Tricep Pushdown',       MuscleGroup.Triceps),
  e('ex-skull-crusher',     'Skull Crusher',         MuscleGroup.Triceps),
  e('ex-dip',               'Dip',                   MuscleGroup.Triceps),
  e('ex-overhead-tricep',   'Overhead Tricep Extension', MuscleGroup.Triceps),

  // Core
  e('ex-plank',             'Plank',                 MuscleGroup.Core),
  e('ex-crunch',            'Crunch',                MuscleGroup.Core),
  e('ex-leg-raise',         'Leg Raise',             MuscleGroup.Core),
  e('ex-ab-wheel',          'Ab Wheel Rollout',      MuscleGroup.Core),
  e('ex-cable-crunch',      'Cable Crunch',          MuscleGroup.Core),

  // Quads
  e('ex-squat',             'Squat',                 MuscleGroup.Quads),
  e('ex-leg-press',         'Leg Press',             MuscleGroup.Quads),
  e('ex-leg-extension',     'Leg Extension',         MuscleGroup.Quads),
  e('ex-lunges',            'Lunges',                MuscleGroup.Quads),
  e('ex-front-squat',       'Front Squat',           MuscleGroup.Quads),

  // Hamstrings
  e('ex-rdl',               'Romanian Deadlift',     MuscleGroup.Hamstrings),
  e('ex-leg-curl',          'Lying Leg Curl',        MuscleGroup.Hamstrings),
  e('ex-seated-leg-curl',   'Seated Leg Curl',       MuscleGroup.Hamstrings),
  e('ex-good-morning',      'Good Morning',          MuscleGroup.Hamstrings),

  // Glutes
  e('ex-hip-thrust',        'Hip Thrust',            MuscleGroup.Glutes),
  e('ex-glute-bridge',      'Glute Bridge',          MuscleGroup.Glutes),
  e('ex-cable-kickback',    'Cable Kickback',        MuscleGroup.Glutes),

  // Calves
  e('ex-standing-calf',     'Standing Calf Raise',   MuscleGroup.Calves),
  e('ex-seated-calf',       'Seated Calf Raise',     MuscleGroup.Calves),

  // Forearms
  e('ex-wrist-curl',        'Wrist Curl',            MuscleGroup.Forearms),
  e('ex-reverse-curl',      'Reverse Curl',          MuscleGroup.Forearms),

  // Full Body
  e('ex-clean',             'Power Clean',           MuscleGroup.FullBody),
  e('ex-thruster',          'Thruster',              MuscleGroup.FullBody),
  e('ex-burpee',            'Burpee',                MuscleGroup.FullBody),

  // Cardio
  e('ex-outdoor-run',       'Outdoor Run',           MuscleGroup.Cardio),
  e('ex-treadmill',         'Treadmill Run',         MuscleGroup.Cardio),
  e('ex-cycling',           'Cycling',               MuscleGroup.Cardio),
  e('ex-rowing',            'Rowing Machine',        MuscleGroup.Cardio),
  e('ex-jump-rope',         'Jump Rope',             MuscleGroup.Cardio),
]
