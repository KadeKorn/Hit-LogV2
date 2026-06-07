const LEGACY_PREBUILT_TEMPLATE_ROW_IDS = {
  fullBodyHypertrophy3x: 'prebuilt-template-full-body-hypertrophy-3x',
  pushPullLegs: 'prebuilt-template-push-pull-legs',
  hitInspiredLowVolume: 'prebuilt-template-hit-inspired-low-volume',
} as const;

const LEGACY_PREBUILT_TEMPLATE_DAY_ROW_IDS = {
  fullBodyDayA: 'prebuilt-day-full-body-a',
  fullBodyDayB: 'prebuilt-day-full-body-b',
  fullBodyDayC: 'prebuilt-day-full-body-c',
  pushDay: 'prebuilt-day-push',
  pullDay: 'prebuilt-day-pull',
  legsDay: 'prebuilt-day-legs',
  hitDayA: 'prebuilt-day-hit-a',
  hitDayB: 'prebuilt-day-hit-b',
} as const;

export const PREBUILT_TEMPLATE_IDS = {
  aestheticHypertrophy3x: LEGACY_PREBUILT_TEMPLATE_ROW_IDS.fullBodyHypertrophy3x,
  strengthFoundation3x: LEGACY_PREBUILT_TEMPLATE_ROW_IDS.pushPullLegs,
  dorianYatesInspiredHit: LEGACY_PREBUILT_TEMPLATE_ROW_IDS.hitInspiredLowVolume,
} as const;

export const PREBUILT_TEMPLATE_DAY_IDS = {
  aestheticDayA: LEGACY_PREBUILT_TEMPLATE_DAY_ROW_IDS.fullBodyDayA,
  aestheticDayB: LEGACY_PREBUILT_TEMPLATE_DAY_ROW_IDS.fullBodyDayB,
  aestheticDayC: LEGACY_PREBUILT_TEMPLATE_DAY_ROW_IDS.fullBodyDayC,
  strengthDayA: LEGACY_PREBUILT_TEMPLATE_DAY_ROW_IDS.pushDay,
  strengthDayB: LEGACY_PREBUILT_TEMPLATE_DAY_ROW_IDS.pullDay,
  strengthDayC: LEGACY_PREBUILT_TEMPLATE_DAY_ROW_IDS.legsDay,
  dorianDayA: LEGACY_PREBUILT_TEMPLATE_DAY_ROW_IDS.hitDayA,
  dorianDayB: LEGACY_PREBUILT_TEMPLATE_DAY_ROW_IDS.hitDayB,
  dorianDayC: 'prebuilt-day-dorian-c',
  dorianDayD: 'prebuilt-day-dorian-d',
} as const;

const PREBUILT_TEMPLATE_TIMESTAMP = '2026-06-06T00:00:00.000Z';

export const MVP_EXERCISE_DEFINITION_IDS = {
  backSquat: 'mvp-exercise-back-squat',
  abWheel: 'mvp-exercise-ab-wheel',
  arnoldPress: 'mvp-exercise-arnold-press',
  barbellCurl: 'mvp-exercise-barbell-curl',
  barbellRow: 'mvp-exercise-barbell-row',
  barbellShrug: 'mvp-exercise-barbell-shrug',
  benchPress: 'mvp-exercise-bench-press',
  bulgarianSplitSquat: 'mvp-exercise-bulgarian-split-squat',
  cableCrunch: 'mvp-exercise-cable-crunch',
  cableFly: 'mvp-exercise-cable-fly',
  cableKickback: 'mvp-exercise-cable-kickback',
  cableLateralRaise: 'mvp-exercise-cable-lateral-raise',
  cableRearDeltFly: 'mvp-exercise-cable-rear-delt-fly',
  chestSupportedRow: 'mvp-exercise-chest-supported-row',
  chestSupportedTBarRow: 'mvp-exercise-chest-supported-t-bar-row',
  chinUp: 'mvp-exercise-chin-up',
  closeGripBenchPress: 'mvp-exercise-close-grip-bench-press',
  deadlift: 'mvp-exercise-deadlift',
  dumbbellCurl: 'mvp-exercise-dumbbell-curl',
  dumbbellLateralRaise: 'mvp-exercise-dumbbell-lateral-raise',
  dumbbellShoulderPress: 'mvp-exercise-dumbbell-shoulder-press',
  dumbbellShrug: 'mvp-exercise-dumbbell-shrug',
  ezBarCurl: 'mvp-exercise-ez-bar-curl',
  facePull: 'mvp-exercise-face-pull',
  farmerCarry: 'mvp-exercise-farmer-carry',
  flatDumbbellPress: 'mvp-exercise-flat-dumbbell-press',
  frontSquat: 'mvp-exercise-front-squat',
  gluteBridge: 'mvp-exercise-glute-bridge',
  goodMorning: 'mvp-exercise-good-morning',
  hackSquat: 'mvp-exercise-hack-squat',
  hammerCurl: 'mvp-exercise-hammer-curl',
  hangingLegRaise: 'mvp-exercise-hanging-leg-raise',
  hipThrust: 'mvp-exercise-hip-thrust',
  inclineDumbbellCurl: 'mvp-exercise-incline-dumbbell-curl',
  inclineDumbbellPress: 'mvp-exercise-incline-dumbbell-press',
  inclineBarbellPress: 'mvp-exercise-incline-barbell-press',
  inclineSmithPress: 'mvp-exercise-incline-smith-press',
  latPulldown: 'mvp-exercise-lat-pulldown',
  leanAwayLateralRaise: 'mvp-exercise-lean-away-lateral-raise',
  legExtension: 'mvp-exercise-leg-extension',
  legPress: 'mvp-exercise-leg-press',
  legPressCalfRaise: 'mvp-exercise-leg-press-calf-raise',
  lyingLegCurl: 'mvp-exercise-lying-leg-curl',
  machineChestPress: 'mvp-exercise-machine-chest-press',
  machineCrunch: 'mvp-exercise-machine-crunch',
  machineDip: 'mvp-exercise-machine-dip',
  machineLateralRaise: 'mvp-exercise-machine-lateral-raise',
  machineRow: 'mvp-exercise-machine-row',
  machinePullover: 'mvp-exercise-machine-pullover',
  machineShoulderPress: 'mvp-exercise-machine-shoulder-press',
  machineShrug: 'mvp-exercise-machine-shrug',
  neutralGripPulldown: 'mvp-exercise-neutral-grip-pulldown',
  nordicCurl: 'mvp-exercise-nordic-curl',
  oneArmDumbbellRow: 'mvp-exercise-one-arm-dumbbell-row',
  overheadCableTricepsExtension: 'mvp-exercise-overhead-cable-triceps-extension',
  overheadPress: 'mvp-exercise-overhead-press',
  pausedBenchPress: 'mvp-exercise-paused-bench-press',
  pausedSquat: 'mvp-exercise-paused-squat',
  pecDeckFly: 'mvp-exercise-pec-deck-fly',
  plank: 'mvp-exercise-plank',
  preacherCurl: 'mvp-exercise-preacher-curl',
  pullUp: 'mvp-exercise-pull-up',
  pushUp: 'mvp-exercise-push-up',
  rearDeltFly: 'mvp-exercise-rear-delt-fly',
  reverseCrunch: 'mvp-exercise-reverse-crunch',
  reverseLunge: 'mvp-exercise-reverse-lunge',
  reversePecDeck: 'mvp-exercise-reverse-pec-deck',
  romanianDeadlift: 'mvp-exercise-romanian-deadlift',
  ropePressdown: 'mvp-exercise-rope-pressdown',
  seatedCalfRaise: 'mvp-exercise-seated-calf-raise',
  seatedCableRow: 'mvp-exercise-seated-cable-row',
  seatedLegCurl: 'mvp-exercise-seated-leg-curl',
  singleArmCableLatPulldown: 'mvp-exercise-single-arm-cable-lat-pulldown',
  skullCrusher: 'mvp-exercise-skull-crusher',
  splitSquat: 'mvp-exercise-split-squat',
  standingCalfRaise: 'mvp-exercise-standing-calf-raise',
  stepUp: 'mvp-exercise-step-up',
  straightArmPulldown: 'mvp-exercise-straight-arm-pulldown',
  walkingLunge: 'mvp-exercise-walking-lunge',
  weightedCrunch: 'mvp-exercise-weighted-crunch',
  weightedDip: 'mvp-exercise-weighted-dip',
} as const;

export const MVP_PROGRESSION_POLICY_IDS = {
  doubleProgression: 'mvp-policy-double-progression',
  repProgression: 'mvp-policy-rep-progression',
  topSetProgression: 'mvp-policy-top-set-progression',
} as const;

type ProgressionSeedMethod = 'double_progression' | 'top_set_progression' | 'rep_progression';

export type SeedPrebuiltTemplateRecord = {
  code: string;
  createdAt: string;
  description: string;
  goal: string;
  id: string;
  isActive: boolean;
  isEditable: boolean;
  name: string;
  orderIndex: number;
  sourceType: 'prebuilt';
  splitType: string;
  updatedAt: string;
};

export type SeedTemplateDayRecord = {
  createdAt: string;
  dayOrder: number;
  focus: string;
  id: string;
  name: string;
  templateId: string;
  updatedAt: string;
};

export type SeedExerciseDefinitionRecord = {
  category: string;
  createdAt: string;
  difficulty: string;
  defaultLoadIncrement: number | null;
  defaultProgressionMethod: ProgressionSeedMethod;
  defaultRepMax: number;
  defaultRepMin: number;
  defaultRestSeconds: number | null;
  equipment: string;
  id: string;
  movementPattern: string;
  name: string;
  notes: string;
  primaryMuscleGroup: string;
  secondaryMuscleGroups: string[] | null;
  sourceType: 'prebuilt';
  updatedAt: string;
};

export type SeedProgressionPolicyRecord = {
  allowDeloadFlag: boolean;
  createdAt: string;
  id: string;
  loadIncrement: number | null;
  method: ProgressionSeedMethod;
  notes: string;
  requireAllSetsAtTop: boolean;
  targetRepMax: number | null;
  targetRepMin: number | null;
  updatedAt: string;
};

export type SeedExercisePrescriptionRecord = {
  createdAt: string;
  exerciseDefinitionId: string;
  exerciseOrder: number;
  id: string;
  loadIncrement: number | null;
  muscleGroup: string;
  notes: string | null;
  progressionPolicyId: string;
  repRangeMax: number;
  repRangeMin: number;
  restSeconds: number | null;
  sets: number;
  templateDayId: string;
  updatedAt: string;
};

export const prebuiltTemplateSeeds: readonly SeedPrebuiltTemplateRecord[] = [
  {
    id: PREBUILT_TEMPLATE_IDS.aestheticHypertrophy3x,
    code: 'prebuilt-aesthetic-hypertrophy-3x',
    name: 'Aesthetic Hypertrophy 3x/week',
    description:
      'Flagship three-day physique routine focused on delts, lats, chest, quads, glutes, arms, traps, and abs. Compounds generally stay 1-3 RIR, isolations 0-2 RIR.',
    goal: 'hypertrophy',
    splitType: 'full_body',
    sourceType: 'prebuilt',
    isEditable: false,
    orderIndex: 100,
    isActive: false,
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
  {
    id: PREBUILT_TEMPLATE_IDS.strengthFoundation3x,
    code: 'prebuilt-strength-foundation-3x',
    name: 'Strength Foundation 3x/week',
    description:
      'Three-day strength-first routine centered on squat, press, hinge, and row patterns with supportive hypertrophy work. Main lifts should generally stay 2-3 RIR.',
    goal: 'strength',
    splitType: 'full_body_strength',
    sourceType: 'prebuilt',
    isEditable: false,
    orderIndex: 101,
    isActive: false,
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
  {
    id: PREBUILT_TEMPLATE_IDS.dorianYatesInspiredHit,
    code: 'prebuilt-dorian-yates-inspired-hit',
    name: 'Dorian Yates-Inspired HIT Routine',
    description:
      'Low-volume, high-effort bodybuilding routine with selective failure, machine-friendly exercise choices, and warm-up discipline. Add rest days as needed.',
    goal: 'hypertrophy',
    splitType: 'hit_rotating',
    sourceType: 'prebuilt',
    isEditable: false,
    orderIndex: 102,
    isActive: false,
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
] as const;

export const prebuiltTemplateDaySeeds: readonly SeedTemplateDayRecord[] = [
  { id: PREBUILT_TEMPLATE_DAY_IDS.aestheticDayA, templateId: PREBUILT_TEMPLATE_IDS.aestheticHypertrophy3x, name: 'Day A', dayOrder: 1, focus: 'full_body_aesthetic', createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: PREBUILT_TEMPLATE_DAY_IDS.aestheticDayB, templateId: PREBUILT_TEMPLATE_IDS.aestheticHypertrophy3x, name: 'Day B', dayOrder: 2, focus: 'full_body_aesthetic', createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: PREBUILT_TEMPLATE_DAY_IDS.aestheticDayC, templateId: PREBUILT_TEMPLATE_IDS.aestheticHypertrophy3x, name: 'Day C', dayOrder: 3, focus: 'full_body_aesthetic', createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: PREBUILT_TEMPLATE_DAY_IDS.strengthDayA, templateId: PREBUILT_TEMPLATE_IDS.strengthFoundation3x, name: 'Day A', dayOrder: 1, focus: 'squat_bench_row', createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: PREBUILT_TEMPLATE_DAY_IDS.strengthDayB, templateId: PREBUILT_TEMPLATE_IDS.strengthFoundation3x, name: 'Day B', dayOrder: 2, focus: 'deadlift_press_front_squat', createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: PREBUILT_TEMPLATE_DAY_IDS.strengthDayC, templateId: PREBUILT_TEMPLATE_IDS.strengthFoundation3x, name: 'Day C', dayOrder: 3, focus: 'paused_bench_paused_squat', createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: PREBUILT_TEMPLATE_DAY_IDS.dorianDayA, templateId: PREBUILT_TEMPLATE_IDS.dorianYatesInspiredHit, name: 'Day A - Chest / Biceps / Abs', dayOrder: 1, focus: 'chest_biceps_abs', createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: PREBUILT_TEMPLATE_DAY_IDS.dorianDayB, templateId: PREBUILT_TEMPLATE_IDS.dorianYatesInspiredHit, name: 'Day B - Legs / Abs', dayOrder: 2, focus: 'legs_abs', createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: PREBUILT_TEMPLATE_DAY_IDS.dorianDayC, templateId: PREBUILT_TEMPLATE_IDS.dorianYatesInspiredHit, name: 'Day C - Back / Rear Delts / Traps', dayOrder: 3, focus: 'back_rear_delts_traps', createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: PREBUILT_TEMPLATE_DAY_IDS.dorianDayD, templateId: PREBUILT_TEMPLATE_IDS.dorianYatesInspiredHit, name: 'Day D - Shoulders / Triceps', dayOrder: 4, focus: 'shoulders_triceps', createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
] as const;

function exerciseDefinition(
  id: string,
  name: string,
  primaryMuscleGroup: string,
  category: string,
  defaultRepMin: number,
  defaultRepMax: number,
  defaultProgressionMethod: ProgressionSeedMethod,
  defaultLoadIncrement: number | null,
  defaultRestSeconds: number | null,
  secondaryMuscleGroups: string[] | null = null,
  metadata: {
    difficulty?: string;
    equipment?: string;
    movementPattern?: string;
    notes?: string;
  } = {}
): SeedExerciseDefinitionRecord {
  return {
    id,
    name,
    primaryMuscleGroup,
    category,
    difficulty: metadata.difficulty ?? 'intermediate',
    defaultRepMin,
    defaultRepMax,
    defaultProgressionMethod,
    defaultLoadIncrement,
    defaultRestSeconds,
    equipment: metadata.equipment ?? category,
    movementPattern: metadata.movementPattern ?? category,
    notes: metadata.notes ?? '',
    secondaryMuscleGroups,
    sourceType: 'prebuilt',
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  };
}

export const mvpExerciseDefinitionSeeds: readonly SeedExerciseDefinitionRecord[] = [
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.benchPress, 'Barbell Bench Press', 'chest', 'barbell', 4, 6, 'double_progression', 5, 240, ['triceps', 'front_delts'], { movementPattern: 'horizontal_press', notes: 'Stable main chest press for strength and hypertrophy.' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.inclineBarbellPress, 'Incline Barbell Press', 'chest', 'barbell', 6, 10, 'double_progression', 5, 180, ['front_delts', 'triceps'], { movementPattern: 'incline_press' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.inclineDumbbellPress, 'Incline Dumbbell Press', 'chest', 'dumbbell', 6, 10, 'double_progression', 5, 180, ['triceps', 'front_delts'], { movementPattern: 'incline_press' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.flatDumbbellPress, 'Flat Dumbbell Press', 'chest', 'dumbbell', 8, 12, 'double_progression', 5, 150, ['triceps', 'front_delts'], { movementPattern: 'horizontal_press' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.machineChestPress, 'Machine Chest Press', 'chest', 'machine', 8, 12, 'double_progression', 5, 120, ['triceps'], { movementPattern: 'horizontal_press' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.inclineSmithPress, 'Smith Machine Incline Press', 'chest', 'smith_machine', 6, 8, 'top_set_progression', 5, 180, ['triceps', 'front_delts'], { movementPattern: 'incline_press' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.cableFly, 'Cable Fly', 'chest', 'cable', 12, 15, 'rep_progression', 2.5, 90, null, { movementPattern: 'chest_fly' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.pecDeckFly, 'Pec Deck', 'chest', 'machine', 10, 15, 'rep_progression', 5, 90, null, { movementPattern: 'chest_fly' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.weightedDip, 'Weighted Dip', 'chest', 'bodyweight', 6, 10, 'double_progression', 5, 150, ['triceps', 'front_delts'], { movementPattern: 'dip' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.pushUp, 'Push-Up', 'chest', 'bodyweight', 8, 20, 'rep_progression', null, 90, ['triceps', 'front_delts'], { difficulty: 'beginner', movementPattern: 'horizontal_press' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.pausedBenchPress, 'Paused Bench Press', 'chest', 'barbell', 3, 5, 'double_progression', 5, 240, ['triceps', 'front_delts'], { movementPattern: 'horizontal_press' }),

  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.pullUp, 'Pull-Up', 'lats', 'bodyweight', 5, 10, 'double_progression', 5, 150, ['biceps', 'upper_back'], { movementPattern: 'vertical_pull' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.chinUp, 'Chin-Up', 'lats', 'bodyweight', 5, 10, 'double_progression', 5, 150, ['biceps', 'upper_back'], { movementPattern: 'vertical_pull' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.latPulldown, 'Lat Pulldown', 'lats', 'cable', 8, 12, 'double_progression', 5, 120, ['biceps'], { movementPattern: 'vertical_pull' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.neutralGripPulldown, 'Neutral-Grip Pulldown', 'lats', 'cable', 8, 12, 'double_progression', 5, 120, ['biceps'], { movementPattern: 'vertical_pull' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.singleArmCableLatPulldown, 'One-Arm Cable Pulldown', 'lats', 'cable', 10, 15, 'rep_progression', 2.5, 90, ['biceps'], { movementPattern: 'vertical_pull' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.machinePullover, 'Machine Pullover', 'lats', 'machine', 10, 15, 'rep_progression', 5, 90, null, { movementPattern: 'pullover' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.straightArmPulldown, 'Straight-Arm Pulldown', 'lats', 'cable', 12, 15, 'rep_progression', 2.5, 75, null, { movementPattern: 'pullover' }),

  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.barbellRow, 'Barbell Row', 'upper_back', 'barbell', 6, 10, 'double_progression', 5, 150, ['lats', 'biceps'], { movementPattern: 'horizontal_pull' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.chestSupportedRow, 'Chest-Supported Row', 'upper_back', 'machine', 8, 12, 'double_progression', 5, 120, ['biceps'], { movementPattern: 'horizontal_pull' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.seatedCableRow, 'Seated Cable Row', 'upper_back', 'cable', 6, 10, 'double_progression', 5, 120, ['biceps'], { movementPattern: 'horizontal_pull' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.machineRow, 'Machine Row', 'upper_back', 'machine', 8, 12, 'double_progression', 5, 120, ['biceps'], { movementPattern: 'horizontal_pull' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.oneArmDumbbellRow, 'One-Arm Dumbbell Row', 'upper_back', 'dumbbell', 8, 12, 'double_progression', 5, 120, ['lats', 'biceps'], { movementPattern: 'horizontal_pull' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.chestSupportedTBarRow, 'T-Bar Row', 'upper_back', 'machine', 6, 10, 'double_progression', 5, 150, ['biceps'], { movementPattern: 'horizontal_pull' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.facePull, 'Face Pull', 'upper_back', 'cable', 12, 20, 'rep_progression', 2.5, 75, ['rear_delts'], { movementPattern: 'rear_delt_pull' }),

  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.dumbbellLateralRaise, 'Dumbbell Lateral Raise', 'side_delts', 'dumbbell', 12, 20, 'rep_progression', 5, 75, null, { movementPattern: 'lateral_raise' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.cableLateralRaise, 'Cable Lateral Raise', 'side_delts', 'cable', 12, 20, 'rep_progression', 2.5, 90, null, { movementPattern: 'lateral_raise' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.machineLateralRaise, 'Machine Lateral Raise', 'side_delts', 'machine', 12, 20, 'rep_progression', 5, 90, null, { movementPattern: 'lateral_raise' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.leanAwayLateralRaise, 'Lean-Away Lateral Raise', 'side_delts', 'cable', 12, 20, 'rep_progression', 2.5, 75, null, { movementPattern: 'lateral_raise' }),

  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.rearDeltFly, 'Rear Delt Fly', 'rear_delts', 'dumbbell', 12, 20, 'rep_progression', 5, 75, ['upper_back'], { movementPattern: 'rear_delt_fly' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.reversePecDeck, 'Reverse Pec Deck', 'rear_delts', 'machine', 12, 20, 'rep_progression', 5, 90, ['upper_back'], { movementPattern: 'rear_delt_fly' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.cableRearDeltFly, 'Cable Rear Delt Fly', 'rear_delts', 'cable', 12, 20, 'rep_progression', 2.5, 75, ['upper_back'], { movementPattern: 'rear_delt_fly' }),

  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.overheadPress, 'Overhead Press', 'front_delts', 'barbell', 4, 6, 'double_progression', 5, 180, ['triceps', 'side_delts'], { movementPattern: 'vertical_press' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.dumbbellShoulderPress, 'Dumbbell Shoulder Press', 'front_delts', 'dumbbell', 6, 10, 'double_progression', 5, 150, ['triceps', 'side_delts'], { movementPattern: 'vertical_press' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.machineShoulderPress, 'Machine Shoulder Press', 'front_delts', 'machine', 6, 10, 'top_set_progression', 5, 150, ['triceps', 'side_delts'], { movementPattern: 'vertical_press' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.arnoldPress, 'Arnold Press', 'front_delts', 'dumbbell', 8, 12, 'double_progression', 5, 120, ['side_delts', 'triceps'], { movementPattern: 'vertical_press' }),

  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.backSquat, 'Back Squat', 'quads', 'barbell', 3, 5, 'double_progression', 10, 240, ['glutes'], { movementPattern: 'squat' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.frontSquat, 'Front Squat', 'quads', 'barbell', 4, 6, 'double_progression', 5, 180, ['glutes'], { movementPattern: 'squat' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.hackSquat, 'Hack Squat', 'quads', 'machine', 8, 12, 'double_progression', 10, 180, ['glutes'], { movementPattern: 'squat' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.legPress, 'Leg Press', 'quads', 'machine', 10, 15, 'double_progression', 10, 180, ['glutes'], { movementPattern: 'leg_press' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.bulgarianSplitSquat, 'Bulgarian Split Squat', 'quads', 'dumbbell', 8, 12, 'double_progression', 5, 120, ['glutes'], { movementPattern: 'single_leg_squat' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.walkingLunge, 'Walking Lunge', 'quads', 'dumbbell', 10, 16, 'rep_progression', 5, 120, ['glutes'], { movementPattern: 'lunge' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.legExtension, 'Leg Extension', 'quads', 'machine', 12, 15, 'rep_progression', 5, 90, null, { movementPattern: 'knee_extension' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.pausedSquat, 'Paused Squat', 'quads', 'barbell', 3, 5, 'double_progression', 5, 240, ['glutes'], { movementPattern: 'squat' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.splitSquat, 'Split Squat', 'quads', 'dumbbell', 8, 10, 'double_progression', 5, 120, ['glutes'], { movementPattern: 'single_leg_squat' }),

  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.romanianDeadlift, 'Romanian Deadlift', 'hamstrings', 'barbell', 6, 10, 'double_progression', 10, 180, ['glutes'], { movementPattern: 'hinge' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.seatedLegCurl, 'Seated Leg Curl', 'hamstrings', 'machine', 10, 15, 'rep_progression', 5, 90, null, { movementPattern: 'leg_curl' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.lyingLegCurl, 'Lying Leg Curl', 'hamstrings', 'machine', 10, 15, 'rep_progression', 5, 90, null, { movementPattern: 'leg_curl' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.nordicCurl, 'Nordic Curl', 'hamstrings', 'bodyweight', 4, 8, 'rep_progression', null, 120, ['glutes'], { difficulty: 'advanced', movementPattern: 'leg_curl' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.goodMorning, 'Good Morning', 'hamstrings', 'barbell', 6, 10, 'double_progression', 5, 150, ['glutes'], { difficulty: 'advanced', movementPattern: 'hinge' }),

  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.deadlift, 'Deadlift', 'glutes', 'barbell', 3, 5, 'top_set_progression', 10, 240, ['hamstrings', 'upper_back'], { movementPattern: 'hinge' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.hipThrust, 'Hip Thrust', 'glutes', 'barbell', 8, 12, 'double_progression', 10, 150, ['hamstrings'], { movementPattern: 'hip_extension' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.gluteBridge, 'Glute Bridge', 'glutes', 'barbell', 8, 12, 'double_progression', 10, 120, ['hamstrings'], { movementPattern: 'hip_extension' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.cableKickback, 'Cable Kickback', 'glutes', 'cable', 12, 15, 'rep_progression', 2.5, 75, null, { movementPattern: 'hip_extension' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.reverseLunge, 'Reverse Lunge', 'glutes', 'dumbbell', 8, 12, 'double_progression', 5, 120, ['quads'], { movementPattern: 'lunge' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.stepUp, 'Step-Up', 'glutes', 'dumbbell', 8, 12, 'double_progression', 5, 120, ['quads'], { movementPattern: 'single_leg_squat' }),

  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.barbellCurl, 'Barbell Curl', 'biceps', 'barbell', 8, 12, 'double_progression', 5, 90, null, { movementPattern: 'elbow_flexion' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.dumbbellCurl, 'Dumbbell Curl', 'biceps', 'dumbbell', 8, 12, 'double_progression', 5, 90, null, { movementPattern: 'elbow_flexion' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.inclineDumbbellCurl, 'Incline Dumbbell Curl', 'biceps', 'dumbbell', 10, 15, 'rep_progression', 5, 90, null, { movementPattern: 'elbow_flexion' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.hammerCurl, 'Hammer Curl', 'biceps', 'dumbbell', 10, 15, 'rep_progression', 5, 90, ['forearms'], { movementPattern: 'elbow_flexion' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.ezBarCurl, 'EZ-Bar Curl', 'biceps', 'barbell', 8, 12, 'double_progression', 5, 90, null, { movementPattern: 'elbow_flexion' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.preacherCurl, 'Preacher Curl', 'biceps', 'machine', 6, 10, 'top_set_progression', 5, 90, null, { movementPattern: 'elbow_flexion' }),

  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.ropePressdown, 'Cable Triceps Pressdown', 'triceps', 'cable', 10, 15, 'rep_progression', 5, 90, null, { movementPattern: 'elbow_extension' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.overheadCableTricepsExtension, 'Overhead Cable Extension', 'triceps', 'cable', 10, 15, 'rep_progression', 2.5, 90, null, { movementPattern: 'elbow_extension' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.skullCrusher, 'Skull Crusher', 'triceps', 'barbell', 8, 12, 'double_progression', 5, 90, null, { movementPattern: 'elbow_extension' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.closeGripBenchPress, 'Close-Grip Bench Press', 'triceps', 'barbell', 6, 10, 'double_progression', 5, 150, ['chest', 'front_delts'], { movementPattern: 'horizontal_press' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.machineDip, 'Machine Dip', 'triceps', 'machine', 8, 12, 'double_progression', 5, 120, ['chest'], { movementPattern: 'dip' }),

  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.cableCrunch, 'Cable Crunch', 'abs', 'cable', 10, 15, 'rep_progression', 5, 60, null, { movementPattern: 'spinal_flexion' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.hangingLegRaise, 'Hanging Leg Raise', 'abs', 'bodyweight', 8, 15, 'rep_progression', null, 75, null, { movementPattern: 'leg_raise' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.reverseCrunch, 'Reverse Crunch', 'abs', 'bodyweight', 10, 20, 'rep_progression', null, 60, null, { movementPattern: 'spinal_flexion' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.abWheel, 'Ab Wheel', 'abs', 'bodyweight', 6, 12, 'rep_progression', null, 75, null, { movementPattern: 'anti_extension' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.plank, 'Plank', 'abs', 'bodyweight', 30, 60, 'rep_progression', null, 60, null, { difficulty: 'beginner', movementPattern: 'anti_extension', notes: 'Log reps as seconds held when using progression.' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.weightedCrunch, 'Weighted Crunch', 'abs', 'plate', 10, 15, 'rep_progression', 5, 60, null, { movementPattern: 'spinal_flexion' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.machineCrunch, 'Machine Crunch', 'abs', 'machine', 10, 15, 'rep_progression', 5, 60, null, { movementPattern: 'spinal_flexion' }),

  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.standingCalfRaise, 'Standing Calf Raise', 'calves', 'machine', 8, 12, 'rep_progression', 5, 90, null, { movementPattern: 'calf_raise' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.seatedCalfRaise, 'Seated Calf Raise', 'calves', 'machine', 8, 12, 'rep_progression', 5, 90, null, { movementPattern: 'calf_raise' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.legPressCalfRaise, 'Leg Press Calf Raise', 'calves', 'machine', 10, 15, 'rep_progression', 10, 90, null, { movementPattern: 'calf_raise' }),

  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.dumbbellShrug, 'Dumbbell Shrug', 'traps', 'dumbbell', 8, 12, 'top_set_progression', 10, 90, null, { movementPattern: 'shrug' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.barbellShrug, 'Barbell Shrug', 'traps', 'barbell', 8, 12, 'top_set_progression', 10, 90, null, { movementPattern: 'shrug' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.farmerCarry, 'Farmer Carry', 'traps', 'dumbbell', 30, 60, 'rep_progression', null, 120, ['forearms'], { movementPattern: 'carry', notes: 'Log reps as seconds or distance target.' }),
] as const;

export const mvpProgressionPolicySeeds: readonly SeedProgressionPolicyRecord[] = [
  { id: MVP_PROGRESSION_POLICY_IDS.doubleProgression, method: 'double_progression', targetRepMin: null, targetRepMax: null, loadIncrement: 5, requireAllSetsAtTop: true, allowDeloadFlag: true, notes: 'Increase load after all working sets reach the top of the prescribed rep range with target effort.', createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_PROGRESSION_POLICY_IDS.repProgression, method: 'rep_progression', targetRepMin: null, targetRepMax: null, loadIncrement: null, requireAllSetsAtTop: false, allowDeloadFlag: true, notes: 'Prioritize adding reps within the range before using the prescribed small load increment.', createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_PROGRESSION_POLICY_IDS.topSetProgression, method: 'top_set_progression', targetRepMin: null, targetRepMax: null, loadIncrement: 5, requireAllSetsAtTop: false, allowDeloadFlag: true, notes: 'Progress from the top working set while keeping technique and recovery constraints explicit.', createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
] as const;

function policyId(method: ProgressionSeedMethod): string {
  if (method === 'rep_progression') {
    return MVP_PROGRESSION_POLICY_IDS.repProgression;
  }

  if (method === 'top_set_progression') {
    return MVP_PROGRESSION_POLICY_IDS.topSetProgression;
  }

  return MVP_PROGRESSION_POLICY_IDS.doubleProgression;
}

function prescription(
  id: string,
  templateDayId: string,
  exerciseDefinitionId: string,
  exerciseOrder: number,
  sets: number,
  repRangeMin: number,
  repRangeMax: number,
  muscleGroup: string,
  progressionMethod: ProgressionSeedMethod,
  loadIncrement: number,
  restSeconds: number,
  restRange: string,
  notes: string | null = null
): SeedExercisePrescriptionRecord {
  const methodLabel = progressionMethod.replaceAll('_', ' ');

  return {
    id,
    templateDayId,
    exerciseDefinitionId,
    progressionPolicyId: policyId(progressionMethod),
    exerciseOrder,
    sets,
    repRangeMin,
    repRangeMax,
    muscleGroup,
    loadIncrement,
    restSeconds,
    notes: notes
      ? `${notes} Rest ${restRange}. ${methodLabel}; ${loadIncrement} lb increment.`
      : `Rest ${restRange}. ${methodLabel}; ${loadIncrement} lb increment.`,
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  };
}

const A = PREBUILT_TEMPLATE_DAY_IDS;
const E = MVP_EXERCISE_DEFINITION_IDS;

export const mvpExercisePrescriptionSeeds: readonly SeedExercisePrescriptionRecord[] = [
  prescription('mvp-prescription-full-a-1', A.aestheticDayA, E.inclineDumbbellPress, 1, 4, 6, 10, 'chest', 'double_progression', 5, 180, '120-180 sec', 'Compound work generally 1-3 RIR.'),
  prescription('mvp-prescription-full-a-2', A.aestheticDayA, E.latPulldown, 2, 3, 8, 12, 'lats', 'double_progression', 5, 120, '90-120 sec', 'Pulldowns are preferred over pull-ups for deterministic progression.'),
  prescription('mvp-prescription-full-a-3', A.aestheticDayA, E.hackSquat, 3, 3, 8, 12, 'quads', 'double_progression', 10, 180, '150-180 sec', 'Can be substituted with leg press.'),
  prescription('mvp-prescription-full-a-4', A.aestheticDayA, E.cableLateralRaise, 4, 4, 12, 20, 'side_delts', 'rep_progression', 2.5, 90, '60-90 sec', 'Isolation work can be 0-2 RIR.'),
  prescription('mvp-prescription-full-a-5', A.aestheticDayA, E.chestSupportedRow, 5, 3, 8, 12, 'upper_back', 'double_progression', 5, 120, '90-120 sec', 'Chest support reduces lower-back fatigue.'),
  prescription('mvp-prescription-full-b-1', A.aestheticDayA, E.legExtension, 6, 2, 12, 15, 'quads', 'rep_progression', 5, 90, '60-90 sec'),
  prescription('mvp-prescription-full-b-2', A.aestheticDayA, E.ezBarCurl, 7, 2, 8, 12, 'biceps', 'double_progression', 5, 90, '60-90 sec'),
  prescription('mvp-prescription-full-b-3', A.aestheticDayA, E.cableCrunch, 8, 3, 10, 15, 'abs', 'rep_progression', 5, 60, '45-60 sec'),
  prescription('mvp-prescription-full-b-4', A.aestheticDayB, E.romanianDeadlift, 1, 3, 6, 10, 'glutes', 'double_progression', 10, 180, '150-180 sec', 'Do not chase form-breakdown failure.'),
  prescription('mvp-prescription-full-b-5', A.aestheticDayB, E.machineChestPress, 2, 3, 8, 12, 'chest', 'double_progression', 5, 120, '90-120 sec'),
  prescription('mvp-prescription-full-c-1', A.aestheticDayB, E.bulgarianSplitSquat, 3, 2, 8, 12, 'glutes', 'double_progression', 5, 120, '90-120 sec'),
  prescription('mvp-prescription-full-c-2', A.aestheticDayB, E.seatedLegCurl, 4, 3, 10, 15, 'hamstrings', 'rep_progression', 5, 90, '60-90 sec'),
  prescription('mvp-prescription-full-c-3', A.aestheticDayB, E.singleArmCableLatPulldown, 5, 3, 10, 15, 'lats', 'rep_progression', 2.5, 90, '75-90 sec'),
  prescription('mvp-prescription-full-c-4', A.aestheticDayB, E.machineLateralRaise, 6, 3, 12, 20, 'side_delts', 'rep_progression', 5, 90, '60-90 sec'),
  prescription('mvp-prescription-full-c-5', A.aestheticDayB, E.overheadCableTricepsExtension, 7, 3, 10, 15, 'triceps', 'rep_progression', 2.5, 90, '60-90 sec'),
  prescription('mvp-prescription-push-1', A.aestheticDayB, E.inclineDumbbellCurl, 8, 2, 10, 15, 'biceps', 'rep_progression', 5, 90, '60-90 sec'),
  prescription('mvp-prescription-push-2', A.aestheticDayC, E.legPress, 1, 3, 10, 15, 'quads', 'double_progression', 10, 180, '120-180 sec'),
  prescription('mvp-prescription-push-3', A.aestheticDayC, E.chestSupportedTBarRow, 2, 3, 6, 10, 'upper_back', 'double_progression', 5, 150, '120-150 sec'),
  prescription('mvp-prescription-push-4', A.aestheticDayC, E.pecDeckFly, 3, 3, 10, 15, 'chest', 'rep_progression', 5, 90, '60-90 sec'),
  prescription('mvp-prescription-push-5', A.aestheticDayC, E.cableLateralRaise, 4, 4, 12, 20, 'side_delts', 'rep_progression', 2.5, 90, '60-90 sec'),
  prescription('mvp-prescription-pull-1', A.aestheticDayC, E.neutralGripPulldown, 5, 3, 8, 12, 'lats', 'double_progression', 5, 120, '90-120 sec'),
  prescription('mvp-prescription-pull-2', A.aestheticDayC, E.ropePressdown, 6, 3, 10, 15, 'triceps', 'rep_progression', 5, 90, '60-90 sec'),
  prescription('mvp-prescription-pull-3', A.aestheticDayC, E.hammerCurl, 7, 2, 10, 15, 'biceps', 'rep_progression', 5, 90, '60-90 sec'),
  prescription('mvp-prescription-pull-4', A.aestheticDayC, E.machineCrunch, 8, 2, 10, 15, 'abs', 'rep_progression', 5, 60, '45-60 sec'),
  prescription('mvp-prescription-pull-5', A.strengthDayA, E.backSquat, 1, 3, 3, 5, 'quads', 'double_progression', 10, 240, '180-240 sec', 'Strength main lift; generally stay 2-3 RIR.'),
  prescription('mvp-prescription-legs-1', A.strengthDayA, E.benchPress, 2, 3, 4, 6, 'chest', 'double_progression', 5, 240, '150-240 sec', 'Strength main lift; generally stay 2-3 RIR.'),
  prescription('mvp-prescription-legs-2', A.strengthDayA, E.chestSupportedRow, 3, 3, 6, 8, 'upper_back', 'double_progression', 5, 150, '120-150 sec'),
  prescription('mvp-prescription-legs-3', A.strengthDayA, E.seatedLegCurl, 4, 2, 8, 12, 'hamstrings', 'double_progression', 5, 90, '75-90 sec'),
  prescription('mvp-prescription-legs-4', A.strengthDayA, E.latPulldown, 5, 2, 8, 10, 'lats', 'double_progression', 5, 120, '90-120 sec'),
  prescription('mvp-prescription-legs-5', A.strengthDayA, E.cableLateralRaise, 6, 2, 12, 20, 'side_delts', 'rep_progression', 2.5, 90, '60-90 sec'),
  prescription('mvp-prescription-legs-6', A.strengthDayA, E.cableCrunch, 7, 2, 10, 15, 'abs', 'rep_progression', 5, 60, '45-60 sec'),
  prescription('mvp-prescription-hit-a-1', A.strengthDayB, E.deadlift, 1, 2, 3, 5, 'glutes', 'top_set_progression', 10, 240, '180-240 sec', 'Do not take deadlifts to form-breakdown failure.'),
  prescription('mvp-prescription-hit-a-2', A.strengthDayB, E.overheadPress, 2, 3, 4, 6, 'front_delts', 'double_progression', 5, 180, '150-180 sec'),
  prescription('mvp-prescription-hit-a-3', A.strengthDayB, E.frontSquat, 3, 3, 4, 6, 'quads', 'double_progression', 5, 180, '150-180 sec', 'If uncomfortable, substitute leg press or safety-bar squat.'),
  prescription('mvp-prescription-hit-a-4', A.strengthDayB, E.seatedCableRow, 4, 2, 6, 10, 'upper_back', 'double_progression', 5, 120, '90-120 sec'),
  prescription('mvp-prescription-hit-a-5', A.strengthDayB, E.splitSquat, 5, 2, 8, 10, 'quads', 'double_progression', 5, 120, '90-120 sec'),
  prescription('mvp-prescription-hit-a-6', A.strengthDayB, E.ropePressdown, 6, 2, 8, 12, 'triceps', 'double_progression', 5, 90, '60-90 sec'),
  prescription('mvp-prescription-hit-b-1', A.strengthDayB, E.ezBarCurl, 7, 2, 8, 12, 'biceps', 'double_progression', 5, 90, '60-90 sec'),
  prescription('mvp-prescription-hit-b-2', A.strengthDayC, E.pausedBenchPress, 1, 3, 3, 5, 'chest', 'double_progression', 5, 240, '150-240 sec'),
  prescription('mvp-prescription-hit-b-3', A.strengthDayC, E.pausedSquat, 2, 3, 3, 5, 'quads', 'double_progression', 5, 240, '180-240 sec'),
  prescription('mvp-prescription-hit-b-4', A.strengthDayC, E.romanianDeadlift, 3, 3, 5, 8, 'glutes', 'double_progression', 10, 180, '150-180 sec'),
  prescription('mvp-prescription-hit-b-5', A.strengthDayC, E.chestSupportedRow, 4, 3, 6, 8, 'upper_back', 'double_progression', 5, 150, '120-150 sec'),
  prescription('mvp-prescription-strength-c-5', A.strengthDayC, E.latPulldown, 5, 2, 8, 10, 'lats', 'double_progression', 5, 120, '90-120 sec'),
  prescription('mvp-prescription-strength-c-6', A.strengthDayC, E.machineCrunch, 6, 2, 10, 15, 'abs', 'rep_progression', 5, 60, '45-60 sec'),
  prescription('mvp-prescription-dorian-a-1', A.dorianDayA, E.inclineSmithPress, 1, 2, 6, 8, 'chest', 'top_set_progression', 5, 180, '150-180 sec', 'Use warmups before hard working sets.'),
  prescription('mvp-prescription-dorian-a-2', A.dorianDayA, E.machineChestPress, 2, 1, 8, 12, 'chest', 'top_set_progression', 5, 120, '120 sec', 'Stable machine work can approach 0-1 RIR selectively.'),
  prescription('mvp-prescription-dorian-a-3', A.dorianDayA, E.cableFly, 3, 1, 12, 15, 'chest', 'rep_progression', 2.5, 90, '60-90 sec'),
  prescription('mvp-prescription-dorian-a-4', A.dorianDayA, E.preacherCurl, 4, 2, 6, 10, 'biceps', 'top_set_progression', 5, 90, '75-90 sec'),
  prescription('mvp-prescription-dorian-a-5', A.dorianDayA, E.inclineDumbbellCurl, 5, 1, 8, 12, 'biceps', 'rep_progression', 5, 90, '60-90 sec'),
  prescription('mvp-prescription-dorian-a-6', A.dorianDayA, E.cableCrunch, 6, 2, 10, 15, 'abs', 'rep_progression', 5, 60, '45-60 sec'),
  prescription('mvp-prescription-dorian-b-1', A.dorianDayB, E.hackSquat, 1, 2, 6, 10, 'quads', 'top_set_progression', 10, 180, '180 sec', 'High effort, but stop before form breaks.'),
  prescription('mvp-prescription-dorian-b-2', A.dorianDayB, E.romanianDeadlift, 2, 2, 6, 8, 'glutes', 'top_set_progression', 10, 180, '150-180 sec', 'Do not chase form-breakdown failure.'),
  prescription('mvp-prescription-dorian-b-3', A.dorianDayB, E.seatedLegCurl, 3, 1, 8, 12, 'hamstrings', 'top_set_progression', 5, 90, '75-90 sec'),
  prescription('mvp-prescription-dorian-b-4', A.dorianDayB, E.legExtension, 4, 1, 10, 15, 'quads', 'rep_progression', 5, 75, '60-75 sec'),
  prescription('mvp-prescription-dorian-b-5', A.dorianDayB, E.seatedCalfRaise, 5, 2, 8, 12, 'calves', 'rep_progression', 5, 90, '60-90 sec'),
  prescription('mvp-prescription-dorian-b-6', A.dorianDayB, E.machineCrunch, 6, 2, 10, 15, 'abs', 'rep_progression', 5, 60, '45-60 sec'),
  prescription('mvp-prescription-dorian-c-1', A.dorianDayC, E.chestSupportedRow, 1, 2, 6, 10, 'upper_back', 'top_set_progression', 5, 150, '150 sec'),
  prescription('mvp-prescription-dorian-c-2', A.dorianDayC, E.neutralGripPulldown, 2, 2, 8, 12, 'lats', 'top_set_progression', 5, 120, '120 sec'),
  prescription('mvp-prescription-dorian-c-3', A.dorianDayC, E.machinePullover, 3, 1, 10, 15, 'lats', 'rep_progression', 5, 90, '75-90 sec'),
  prescription('mvp-prescription-dorian-c-4', A.dorianDayC, E.reversePecDeck, 4, 2, 12, 20, 'rear_delts', 'rep_progression', 5, 90, '60-90 sec'),
  prescription('mvp-prescription-dorian-c-5', A.dorianDayC, E.machineShrug, 5, 2, 8, 12, 'traps', 'top_set_progression', 10, 90, '75-90 sec'),
  prescription('mvp-prescription-dorian-d-1', A.dorianDayD, E.machineShoulderPress, 1, 2, 6, 10, 'front_delts', 'top_set_progression', 5, 150, '120-150 sec'),
  prescription('mvp-prescription-dorian-d-2', A.dorianDayD, E.cableLateralRaise, 2, 2, 12, 20, 'side_delts', 'rep_progression', 2.5, 90, '60-90 sec'),
  prescription('mvp-prescription-dorian-d-3', A.dorianDayD, E.machineLateralRaise, 3, 1, 10, 15, 'side_delts', 'rep_progression', 5, 75, '60-75 sec'),
  prescription('mvp-prescription-dorian-d-4', A.dorianDayD, E.overheadCableTricepsExtension, 4, 2, 8, 12, 'triceps', 'top_set_progression', 5, 90, '75-90 sec'),
  prescription('mvp-prescription-dorian-d-5', A.dorianDayD, E.ropePressdown, 5, 1, 10, 15, 'triceps', 'rep_progression', 5, 75, '60-75 sec'),
] as const;
