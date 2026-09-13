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
  assistedPistolSquat: 'mvp-exercise-assisted-pistol-squat',
  boxJump: 'mvp-exercise-box-jump',
  broadJump: 'mvp-exercise-broad-jump',
  cableCurl: 'mvp-exercise-cable-curl',
  chestSupportedHighRow: 'mvp-exercise-chest-supported-high-row',
  closeGripPushUp: 'mvp-exercise-close-grip-push-up',
  deadBug: 'mvp-exercise-dead-bug',
  diamondPushUp: 'mvp-exercise-diamond-push-up',
  feetElevatedPikePushUp: 'mvp-exercise-feet-elevated-pike-push-up',
  feetElevatedPushUp: 'mvp-exercise-feet-elevated-push-up',
  hamstringWalkout: 'mvp-exercise-hamstring-walkout',
  hangingKneeRaise: 'mvp-exercise-hanging-knee-raise',
  inclineMachinePress: 'mvp-exercise-incline-machine-press',
  kettlebellSwing: 'mvp-exercise-kettlebell-swing',
  medicineBallChestThrow: 'mvp-exercise-medicine-ball-chest-throw',
  pallofPress: 'mvp-exercise-pallof-press',
  pikePushUp: 'mvp-exercise-pike-push-up',
  pushPress: 'mvp-exercise-push-press',
  shortSprint20m: 'mvp-exercise-20m-sprint',
  singleLegGluteBridge: 'mvp-exercise-single-leg-glute-bridge',
  suitcaseCarry: 'mvp-exercise-suitcase-carry',
} as const;

export const MVP_PROGRESSION_POLICY_IDS = {
  doubleProgression: 'mvp-policy-double-progression',
  repProgression: 'mvp-policy-rep-progression',
  topSetProgression: 'mvp-policy-top-set-progression',
  manual: 'mvp-policy-manual',
  none: 'mvp-policy-none',
} as const;

type ProgressionSeedMethod = 'double_progression' | 'top_set_progression' | 'rep_progression' | 'manual' | 'none';

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

  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.machineShrug, 'Machine Shrug', 'traps', 'machine', 8, 12, 'top_set_progression', 10, 90, null, { movementPattern: 'shrug' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.dumbbellShrug, 'Dumbbell Shrug', 'traps', 'dumbbell', 8, 12, 'top_set_progression', 10, 90, null, { movementPattern: 'shrug' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.barbellShrug, 'Barbell Shrug', 'traps', 'barbell', 8, 12, 'top_set_progression', 10, 90, null, { movementPattern: 'shrug' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.farmerCarry, 'Farmer Carry', 'traps', 'dumbbell', 1, 2, 'manual', null, 120, ['forearms'], { movementPattern: 'carry', notes: 'Log completed trips as reps; record the route distance in workout notes.' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.assistedPistolSquat, 'Assisted Pistol Squat', 'quads', 'bodyweight', 6, 12, 'rep_progression', null, 120, ['glutes'], { movementPattern: 'single_leg_squat', notes: 'Log completed reps per leg. Use support only as needed.' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.boxJump, 'Box Jump', 'quads', 'bodyweight', 3, 3, 'manual', null, 150, ['glutes'], { movementPattern: 'jump', notes: 'Stop when jump quality drops; never use a no-reps-left target.' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.broadJump, 'Broad Jump', 'quads', 'bodyweight', 3, 3, 'manual', null, 150, ['glutes'], { movementPattern: 'jump', notes: 'Full recovery between explosive sets.' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.cableCurl, 'Cable Curl', 'biceps', 'cable', 10, 15, 'rep_progression', 2.5, 90, null, { movementPattern: 'elbow_flexion' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.chestSupportedHighRow, 'Chest-Supported High Row', 'upper_back', 'machine', 8, 12, 'double_progression', 5, 120, ['rear_delts'], { movementPattern: 'horizontal_pull' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.closeGripPushUp, 'Close-Grip Push-Up', 'triceps', 'bodyweight', 8, 20, 'rep_progression', null, 90, ['chest'], { movementPattern: 'horizontal_press' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.deadBug, 'Dead Bug', 'abs', 'bodyweight', 8, 12, 'rep_progression', null, 60, null, { movementPattern: 'anti_extension', notes: 'Log completed reps per side.' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.diamondPushUp, 'Diamond Push-Up', 'triceps', 'bodyweight', 8, 20, 'rep_progression', null, 90, ['chest'], { movementPattern: 'horizontal_press' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.feetElevatedPikePushUp, 'Feet-Elevated Pike Push-Up', 'front_delts', 'bodyweight', 6, 12, 'rep_progression', null, 120, ['triceps'], { movementPattern: 'vertical_press', notes: 'Use only a fully stable support; otherwise substitute Pike Push-Up.' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.feetElevatedPushUp, 'Feet-Elevated Push-Up', 'chest', 'bodyweight', 8, 20, 'rep_progression', null, 90, ['triceps'], { movementPattern: 'horizontal_press', notes: 'Use only a fully stable support; otherwise substitute Push-Up.' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.hamstringWalkout, 'Hamstring Walkout', 'hamstrings', 'bodyweight', 8, 15, 'rep_progression', null, 90, ['glutes'], { movementPattern: 'leg_curl' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.hangingKneeRaise, 'Hanging Knee Raise', 'abs', 'bodyweight', 8, 15, 'rep_progression', null, 75, null, { movementPattern: 'leg_raise' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.inclineMachinePress, 'Incline Machine Press', 'chest', 'machine', 8, 12, 'double_progression', 5, 120, ['triceps'], { movementPattern: 'incline_press' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.kettlebellSwing, 'Kettlebell Swing', 'glutes', 'kettlebell', 8, 15, 'manual', 5, 120, ['hamstrings'], { movementPattern: 'swing', notes: 'Keep each rep fast and crisp; do not train to failure.' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.medicineBallChestThrow, 'Medicine-Ball Chest Throw', 'chest', 'medicine_ball', 4, 6, 'manual', null, 120, ['triceps'], { movementPattern: 'throw', notes: 'Log throw count as reps and ball weight when useful.' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.pallofPress, 'Pallof Press', 'abs', 'cable', 8, 15, 'rep_progression', 2.5, 75, null, { movementPattern: 'anti_rotation', notes: 'Log completed reps per side.' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.pikePushUp, 'Pike Push-Up', 'front_delts', 'bodyweight', 6, 15, 'rep_progression', null, 120, ['triceps'], { movementPattern: 'vertical_press' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.pushPress, 'Push Press', 'front_delts', 'barbell', 5, 8, 'manual', 5, 180, ['triceps', 'quads'], { movementPattern: 'power_press', notes: 'Drive the load quickly while technique stays controlled.' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.shortSprint20m, '20 m Sprint', 'quads', 'bodyweight', 1, 1, 'manual', null, 150, ['glutes'], { movementPattern: 'sprint', notes: 'Each set is one 20 m run. Rest fully to preserve speed.' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.singleLegGluteBridge, 'Single-Leg Glute Bridge', 'glutes', 'bodyweight', 10, 20, 'rep_progression', null, 90, ['hamstrings'], { movementPattern: 'hip_extension', notes: 'Log completed reps per leg.' }),
  exerciseDefinition(MVP_EXERCISE_DEFINITION_IDS.suitcaseCarry, 'Suitcase Carry', 'traps', 'dumbbell', 2, 2, 'manual', null, 120, ['abs', 'forearms'], { movementPattern: 'carry', notes: 'Two trips means one trip per side.' }),
] as const;

export const mvpProgressionPolicySeeds: readonly SeedProgressionPolicyRecord[] = [
  { id: MVP_PROGRESSION_POLICY_IDS.doubleProgression, method: 'double_progression', targetRepMin: null, targetRepMax: null, loadIncrement: 5, requireAllSetsAtTop: true, allowDeloadFlag: true, notes: 'Increase load after all working sets reach the top of the prescribed rep range with target effort.', createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_PROGRESSION_POLICY_IDS.repProgression, method: 'rep_progression', targetRepMin: null, targetRepMax: null, loadIncrement: null, requireAllSetsAtTop: false, allowDeloadFlag: true, notes: 'Prioritize adding reps within the range before using the prescribed small load increment.', createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_PROGRESSION_POLICY_IDS.topSetProgression, method: 'top_set_progression', targetRepMin: null, targetRepMax: null, loadIncrement: 5, requireAllSetsAtTop: false, allowDeloadFlag: true, notes: 'Progress from the top working set while keeping technique and recovery constraints explicit.', createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_PROGRESSION_POLICY_IDS.manual, method: 'manual', targetRepMin: null, targetRepMax: null, loadIncrement: null, requireAllSetsAtTop: false, allowDeloadFlag: false, notes: 'Choose the next target from quality and history rather than an automatic load or rep increase.', createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_PROGRESSION_POLICY_IDS.none, method: 'none', targetRepMin: null, targetRepMax: null, loadIncrement: null, requireAllSetsAtTop: false, allowDeloadFlag: false, notes: 'No automatic progression target.', createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
] as const;
