export const PREBUILT_TEMPLATE_IDS = {
  fullBodyHypertrophy3x: 'prebuilt-template-full-body-hypertrophy-3x',
  pushPullLegs: 'prebuilt-template-push-pull-legs',
  hitInspiredLowVolume: 'prebuilt-template-hit-inspired-low-volume',
} as const;

export const PREBUILT_TEMPLATE_DAY_IDS = {
  fullBodyDayA: 'prebuilt-day-full-body-a',
  fullBodyDayB: 'prebuilt-day-full-body-b',
  fullBodyDayC: 'prebuilt-day-full-body-c',
  pushDay: 'prebuilt-day-push',
  pullDay: 'prebuilt-day-pull',
  legsDay: 'prebuilt-day-legs',
  hitDayA: 'prebuilt-day-hit-a',
  hitDayB: 'prebuilt-day-hit-b',
} as const;

const PREBUILT_TEMPLATE_TIMESTAMP = '2026-05-31T00:00:00.000Z';

export const MVP_EXERCISE_DEFINITION_IDS = {
  abs: 'mvp-exercise-abs',
  benchPress: 'mvp-exercise-bench-press',
  calfRaise: 'mvp-exercise-calf-raise',
  curl: 'mvp-exercise-curl',
  inclineDumbbellPress: 'mvp-exercise-incline-dumbbell-press',
  inclinePress: 'mvp-exercise-incline-press',
  latPulldown: 'mvp-exercise-lat-pulldown',
  lateralRaise: 'mvp-exercise-lateral-raise',
  legCurl: 'mvp-exercise-leg-curl',
  legExtension: 'mvp-exercise-leg-extension',
  legPress: 'mvp-exercise-leg-press',
  overheadPress: 'mvp-exercise-overhead-press',
  rearDeltFly: 'mvp-exercise-rear-delt-fly',
  romanianDeadlift: 'mvp-exercise-romanian-deadlift',
  row: 'mvp-exercise-row',
  shoulderPress: 'mvp-exercise-shoulder-press',
  shrug: 'mvp-exercise-shrug',
  splitSquat: 'mvp-exercise-split-squat',
  squatOrLegPress: 'mvp-exercise-squat-or-leg-press',
  tricepsPressdown: 'mvp-exercise-triceps-pressdown',
} as const;

export const MVP_PROGRESSION_POLICY_IDS = {
  doubleProgression: 'mvp-policy-double-progression',
  repProgression: 'mvp-policy-rep-progression',
  topSetProgression: 'mvp-policy-top-set-progression',
} as const;

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
  defaultLoadIncrement: number | null;
  defaultProgressionMethod: 'double_progression' | 'top_set_progression' | 'rep_progression';
  defaultRepMax: number;
  defaultRepMin: number;
  defaultRestSeconds: number | null;
  id: string;
  name: string;
  primaryMuscleGroup: string;
  secondaryMuscleGroups: string[] | null;
  updatedAt: string;
};

export type SeedProgressionPolicyRecord = {
  allowDeloadFlag: boolean;
  createdAt: string;
  id: string;
  loadIncrement: number | null;
  method: 'double_progression' | 'top_set_progression' | 'rep_progression';
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
    id: PREBUILT_TEMPLATE_IDS.fullBodyHypertrophy3x,
    code: 'prebuilt-full-body-hypertrophy-3x',
    name: 'Full Body Hypertrophy 3x/week',
    description: 'Skeletal Phase 2C foundation for a three-day full-body hypertrophy template.',
    goal: 'hypertrophy',
    splitType: 'full_body_3x',
    sourceType: 'prebuilt',
    isEditable: false,
    orderIndex: 100,
    isActive: false,
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
  {
    id: PREBUILT_TEMPLATE_IDS.pushPullLegs,
    code: 'prebuilt-push-pull-legs',
    name: 'Push / Pull / Legs',
    description: 'Skeletal Phase 2C foundation for a push, pull, legs hypertrophy template.',
    goal: 'hypertrophy',
    splitType: 'push_pull_legs',
    sourceType: 'prebuilt',
    isEditable: false,
    orderIndex: 101,
    isActive: false,
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
  {
    id: PREBUILT_TEMPLATE_IDS.hitInspiredLowVolume,
    code: 'prebuilt-hit-inspired-low-volume',
    name: 'HIT-Inspired Low-Volume Routine',
    description: 'Skeletal Phase 2C foundation for a low-volume hypertrophy template.',
    goal: 'hypertrophy',
    splitType: 'hit_low_volume',
    sourceType: 'prebuilt',
    isEditable: false,
    orderIndex: 102,
    isActive: false,
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
] as const;

export const prebuiltTemplateDaySeeds: readonly SeedTemplateDayRecord[] = [
  {
    id: PREBUILT_TEMPLATE_DAY_IDS.fullBodyDayA,
    templateId: PREBUILT_TEMPLATE_IDS.fullBodyHypertrophy3x,
    name: 'Full Body A',
    dayOrder: 1,
    focus: 'full_body',
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
  {
    id: PREBUILT_TEMPLATE_DAY_IDS.fullBodyDayB,
    templateId: PREBUILT_TEMPLATE_IDS.fullBodyHypertrophy3x,
    name: 'Full Body B',
    dayOrder: 2,
    focus: 'full_body',
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
  {
    id: PREBUILT_TEMPLATE_DAY_IDS.fullBodyDayC,
    templateId: PREBUILT_TEMPLATE_IDS.fullBodyHypertrophy3x,
    name: 'Full Body C',
    dayOrder: 3,
    focus: 'full_body',
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
  {
    id: PREBUILT_TEMPLATE_DAY_IDS.pushDay,
    templateId: PREBUILT_TEMPLATE_IDS.pushPullLegs,
    name: 'Push',
    dayOrder: 1,
    focus: 'chest_shoulders_triceps',
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
  {
    id: PREBUILT_TEMPLATE_DAY_IDS.pullDay,
    templateId: PREBUILT_TEMPLATE_IDS.pushPullLegs,
    name: 'Pull',
    dayOrder: 2,
    focus: 'back_biceps',
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
  {
    id: PREBUILT_TEMPLATE_DAY_IDS.legsDay,
    templateId: PREBUILT_TEMPLATE_IDS.pushPullLegs,
    name: 'Legs',
    dayOrder: 3,
    focus: 'legs',
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
  {
    id: PREBUILT_TEMPLATE_DAY_IDS.hitDayA,
    templateId: PREBUILT_TEMPLATE_IDS.hitInspiredLowVolume,
    name: 'HIT A',
    dayOrder: 1,
    focus: 'full_body_low_volume',
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
  {
    id: PREBUILT_TEMPLATE_DAY_IDS.hitDayB,
    templateId: PREBUILT_TEMPLATE_IDS.hitInspiredLowVolume,
    name: 'HIT B',
    dayOrder: 2,
    focus: 'full_body_low_volume',
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  },
] as const;

export const mvpExerciseDefinitionSeeds: readonly SeedExerciseDefinitionRecord[] = [
  { id: MVP_EXERCISE_DEFINITION_IDS.abs, name: 'Abs', primaryMuscleGroup: 'abs', category: 'core', defaultRepMin: 10, defaultRepMax: 20, defaultProgressionMethod: 'rep_progression', defaultLoadIncrement: null, defaultRestSeconds: 60, secondaryMuscleGroups: null, createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_EXERCISE_DEFINITION_IDS.benchPress, name: 'Bench Press', primaryMuscleGroup: 'chest', category: 'press', defaultRepMin: 8, defaultRepMax: 12, defaultProgressionMethod: 'double_progression', defaultLoadIncrement: 5, defaultRestSeconds: 120, secondaryMuscleGroups: ['triceps', 'shoulders'], createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_EXERCISE_DEFINITION_IDS.calfRaise, name: 'Calf Raise', primaryMuscleGroup: 'calves', category: 'legs', defaultRepMin: 10, defaultRepMax: 20, defaultProgressionMethod: 'rep_progression', defaultLoadIncrement: 5, defaultRestSeconds: 60, secondaryMuscleGroups: null, createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_EXERCISE_DEFINITION_IDS.curl, name: 'Curl', primaryMuscleGroup: 'biceps', category: 'pull', defaultRepMin: 10, defaultRepMax: 15, defaultProgressionMethod: 'rep_progression', defaultLoadIncrement: 5, defaultRestSeconds: 60, secondaryMuscleGroups: null, createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_EXERCISE_DEFINITION_IDS.inclineDumbbellPress, name: 'Incline Dumbbell Press', primaryMuscleGroup: 'chest', category: 'press', defaultRepMin: 8, defaultRepMax: 12, defaultProgressionMethod: 'double_progression', defaultLoadIncrement: 5, defaultRestSeconds: 120, secondaryMuscleGroups: ['triceps', 'shoulders'], createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_EXERCISE_DEFINITION_IDS.inclinePress, name: 'Incline Press', primaryMuscleGroup: 'chest', category: 'press', defaultRepMin: 8, defaultRepMax: 12, defaultProgressionMethod: 'double_progression', defaultLoadIncrement: 5, defaultRestSeconds: 120, secondaryMuscleGroups: ['triceps', 'shoulders'], createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_EXERCISE_DEFINITION_IDS.latPulldown, name: 'Lat Pulldown', primaryMuscleGroup: 'lats', category: 'pull', defaultRepMin: 8, defaultRepMax: 12, defaultProgressionMethod: 'double_progression', defaultLoadIncrement: 5, defaultRestSeconds: 120, secondaryMuscleGroups: ['biceps'], createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_EXERCISE_DEFINITION_IDS.lateralRaise, name: 'Lateral Raise', primaryMuscleGroup: 'shoulders', category: 'shoulders', defaultRepMin: 12, defaultRepMax: 20, defaultProgressionMethod: 'rep_progression', defaultLoadIncrement: 5, defaultRestSeconds: 60, secondaryMuscleGroups: null, createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_EXERCISE_DEFINITION_IDS.legCurl, name: 'Leg Curl', primaryMuscleGroup: 'hamstrings', category: 'legs', defaultRepMin: 10, defaultRepMax: 15, defaultProgressionMethod: 'rep_progression', defaultLoadIncrement: 5, defaultRestSeconds: 90, secondaryMuscleGroups: null, createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_EXERCISE_DEFINITION_IDS.legExtension, name: 'Leg Extension', primaryMuscleGroup: 'quads', category: 'legs', defaultRepMin: 10, defaultRepMax: 15, defaultProgressionMethod: 'rep_progression', defaultLoadIncrement: 5, defaultRestSeconds: 90, secondaryMuscleGroups: null, createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_EXERCISE_DEFINITION_IDS.legPress, name: 'Leg Press', primaryMuscleGroup: 'quads', category: 'legs', defaultRepMin: 10, defaultRepMax: 15, defaultProgressionMethod: 'double_progression', defaultLoadIncrement: 10, defaultRestSeconds: 120, secondaryMuscleGroups: ['glutes'], createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_EXERCISE_DEFINITION_IDS.overheadPress, name: 'Overhead Press', primaryMuscleGroup: 'shoulders', category: 'press', defaultRepMin: 6, defaultRepMax: 10, defaultProgressionMethod: 'double_progression', defaultLoadIncrement: 5, defaultRestSeconds: 120, secondaryMuscleGroups: ['triceps'], createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_EXERCISE_DEFINITION_IDS.rearDeltFly, name: 'Rear Delt Fly', primaryMuscleGroup: 'rear_delts', category: 'shoulders', defaultRepMin: 12, defaultRepMax: 20, defaultProgressionMethod: 'rep_progression', defaultLoadIncrement: 5, defaultRestSeconds: 60, secondaryMuscleGroups: null, createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_EXERCISE_DEFINITION_IDS.romanianDeadlift, name: 'Romanian Deadlift', primaryMuscleGroup: 'hamstrings', category: 'hinge', defaultRepMin: 8, defaultRepMax: 12, defaultProgressionMethod: 'double_progression', defaultLoadIncrement: 10, defaultRestSeconds: 150, secondaryMuscleGroups: ['glutes', 'back'], createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_EXERCISE_DEFINITION_IDS.row, name: 'Row', primaryMuscleGroup: 'back', category: 'pull', defaultRepMin: 8, defaultRepMax: 12, defaultProgressionMethod: 'double_progression', defaultLoadIncrement: 5, defaultRestSeconds: 120, secondaryMuscleGroups: ['biceps'], createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_EXERCISE_DEFINITION_IDS.shoulderPress, name: 'Shoulder Press', primaryMuscleGroup: 'shoulders', category: 'press', defaultRepMin: 8, defaultRepMax: 12, defaultProgressionMethod: 'double_progression', defaultLoadIncrement: 5, defaultRestSeconds: 120, secondaryMuscleGroups: ['triceps'], createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_EXERCISE_DEFINITION_IDS.shrug, name: 'Shrug', primaryMuscleGroup: 'traps', category: 'pull', defaultRepMin: 10, defaultRepMax: 15, defaultProgressionMethod: 'double_progression', defaultLoadIncrement: 10, defaultRestSeconds: 90, secondaryMuscleGroups: null, createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_EXERCISE_DEFINITION_IDS.splitSquat, name: 'Split Squat', primaryMuscleGroup: 'legs', category: 'legs', defaultRepMin: 8, defaultRepMax: 12, defaultProgressionMethod: 'double_progression', defaultLoadIncrement: 5, defaultRestSeconds: 120, secondaryMuscleGroups: ['quads', 'glutes'], createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_EXERCISE_DEFINITION_IDS.squatOrLegPress, name: 'Squat or Leg Press', primaryMuscleGroup: 'quads', category: 'legs', defaultRepMin: 8, defaultRepMax: 12, defaultProgressionMethod: 'double_progression', defaultLoadIncrement: 10, defaultRestSeconds: 150, secondaryMuscleGroups: ['glutes'], createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_EXERCISE_DEFINITION_IDS.tricepsPressdown, name: 'Triceps Pressdown', primaryMuscleGroup: 'triceps', category: 'push', defaultRepMin: 10, defaultRepMax: 15, defaultProgressionMethod: 'rep_progression', defaultLoadIncrement: 5, defaultRestSeconds: 60, secondaryMuscleGroups: null, createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
] as const;

export const mvpProgressionPolicySeeds: readonly SeedProgressionPolicyRecord[] = [
  { id: MVP_PROGRESSION_POLICY_IDS.doubleProgression, method: 'double_progression', targetRepMin: null, targetRepMax: null, loadIncrement: 5, requireAllSetsAtTop: true, allowDeloadFlag: true, notes: 'Phase 2F MVP policy for double progression display and later refinement.', createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_PROGRESSION_POLICY_IDS.repProgression, method: 'rep_progression', targetRepMin: null, targetRepMax: null, loadIncrement: null, requireAllSetsAtTop: false, allowDeloadFlag: true, notes: 'Phase 2F MVP policy for rep progression display and later refinement.', createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
  { id: MVP_PROGRESSION_POLICY_IDS.topSetProgression, method: 'top_set_progression', targetRepMin: null, targetRepMax: null, loadIncrement: 5, requireAllSetsAtTop: false, allowDeloadFlag: true, notes: 'Phase 2F MVP policy for top set progression display and later refinement.', createdAt: PREBUILT_TEMPLATE_TIMESTAMP, updatedAt: PREBUILT_TEMPLATE_TIMESTAMP },
] as const;

function mvpPrescription(
  id: string,
  templateDayId: string,
  exerciseDefinitionId: string,
  exerciseOrder: number,
  sets: number,
  repRangeMin: number,
  repRangeMax: number,
  muscleGroup: string,
  progressionPolicyId: string
): SeedExercisePrescriptionRecord {
  return {
    id,
    templateDayId,
    exerciseDefinitionId,
    progressionPolicyId,
    exerciseOrder,
    sets,
    repRangeMin,
    repRangeMax,
    muscleGroup,
    loadIncrement: null,
    restSeconds: null,
    notes: 'Phase 2F MVP seed prescription. Full template refinement is deferred to Phase 3.',
    createdAt: PREBUILT_TEMPLATE_TIMESTAMP,
    updatedAt: PREBUILT_TEMPLATE_TIMESTAMP,
  };
}

export const mvpExercisePrescriptionSeeds: readonly SeedExercisePrescriptionRecord[] = [
  mvpPrescription('mvp-prescription-full-a-1', PREBUILT_TEMPLATE_DAY_IDS.fullBodyDayA, MVP_EXERCISE_DEFINITION_IDS.squatOrLegPress, 1, 3, 8, 12, 'quads', MVP_PROGRESSION_POLICY_IDS.doubleProgression),
  mvpPrescription('mvp-prescription-full-a-2', PREBUILT_TEMPLATE_DAY_IDS.fullBodyDayA, MVP_EXERCISE_DEFINITION_IDS.benchPress, 2, 3, 8, 12, 'chest', MVP_PROGRESSION_POLICY_IDS.doubleProgression),
  mvpPrescription('mvp-prescription-full-a-3', PREBUILT_TEMPLATE_DAY_IDS.fullBodyDayA, MVP_EXERCISE_DEFINITION_IDS.row, 3, 3, 8, 12, 'back', MVP_PROGRESSION_POLICY_IDS.doubleProgression),
  mvpPrescription('mvp-prescription-full-a-4', PREBUILT_TEMPLATE_DAY_IDS.fullBodyDayA, MVP_EXERCISE_DEFINITION_IDS.lateralRaise, 4, 2, 12, 20, 'shoulders', MVP_PROGRESSION_POLICY_IDS.repProgression),
  mvpPrescription('mvp-prescription-full-a-5', PREBUILT_TEMPLATE_DAY_IDS.fullBodyDayA, MVP_EXERCISE_DEFINITION_IDS.abs, 5, 2, 10, 20, 'abs', MVP_PROGRESSION_POLICY_IDS.repProgression),
  mvpPrescription('mvp-prescription-full-b-1', PREBUILT_TEMPLATE_DAY_IDS.fullBodyDayB, MVP_EXERCISE_DEFINITION_IDS.romanianDeadlift, 1, 3, 8, 12, 'hamstrings', MVP_PROGRESSION_POLICY_IDS.doubleProgression),
  mvpPrescription('mvp-prescription-full-b-2', PREBUILT_TEMPLATE_DAY_IDS.fullBodyDayB, MVP_EXERCISE_DEFINITION_IDS.overheadPress, 2, 3, 6, 10, 'shoulders', MVP_PROGRESSION_POLICY_IDS.doubleProgression),
  mvpPrescription('mvp-prescription-full-b-3', PREBUILT_TEMPLATE_DAY_IDS.fullBodyDayB, MVP_EXERCISE_DEFINITION_IDS.latPulldown, 3, 3, 8, 12, 'lats', MVP_PROGRESSION_POLICY_IDS.doubleProgression),
  mvpPrescription('mvp-prescription-full-b-4', PREBUILT_TEMPLATE_DAY_IDS.fullBodyDayB, MVP_EXERCISE_DEFINITION_IDS.splitSquat, 4, 2, 8, 12, 'legs', MVP_PROGRESSION_POLICY_IDS.doubleProgression),
  mvpPrescription('mvp-prescription-full-b-5', PREBUILT_TEMPLATE_DAY_IDS.fullBodyDayB, MVP_EXERCISE_DEFINITION_IDS.curl, 5, 2, 10, 15, 'biceps', MVP_PROGRESSION_POLICY_IDS.repProgression),
  mvpPrescription('mvp-prescription-full-c-1', PREBUILT_TEMPLATE_DAY_IDS.fullBodyDayC, MVP_EXERCISE_DEFINITION_IDS.legPress, 1, 3, 10, 15, 'quads', MVP_PROGRESSION_POLICY_IDS.doubleProgression),
  mvpPrescription('mvp-prescription-full-c-2', PREBUILT_TEMPLATE_DAY_IDS.fullBodyDayC, MVP_EXERCISE_DEFINITION_IDS.inclinePress, 2, 3, 8, 12, 'chest', MVP_PROGRESSION_POLICY_IDS.doubleProgression),
  mvpPrescription('mvp-prescription-full-c-3', PREBUILT_TEMPLATE_DAY_IDS.fullBodyDayC, MVP_EXERCISE_DEFINITION_IDS.row, 3, 3, 8, 12, 'back', MVP_PROGRESSION_POLICY_IDS.doubleProgression),
  mvpPrescription('mvp-prescription-full-c-4', PREBUILT_TEMPLATE_DAY_IDS.fullBodyDayC, MVP_EXERCISE_DEFINITION_IDS.rearDeltFly, 4, 2, 12, 20, 'rear_delts', MVP_PROGRESSION_POLICY_IDS.repProgression),
  mvpPrescription('mvp-prescription-full-c-5', PREBUILT_TEMPLATE_DAY_IDS.fullBodyDayC, MVP_EXERCISE_DEFINITION_IDS.tricepsPressdown, 5, 2, 10, 15, 'triceps', MVP_PROGRESSION_POLICY_IDS.repProgression),
  mvpPrescription('mvp-prescription-push-1', PREBUILT_TEMPLATE_DAY_IDS.pushDay, MVP_EXERCISE_DEFINITION_IDS.benchPress, 1, 3, 8, 12, 'chest', MVP_PROGRESSION_POLICY_IDS.doubleProgression),
  mvpPrescription('mvp-prescription-push-2', PREBUILT_TEMPLATE_DAY_IDS.pushDay, MVP_EXERCISE_DEFINITION_IDS.inclineDumbbellPress, 2, 3, 8, 12, 'chest', MVP_PROGRESSION_POLICY_IDS.doubleProgression),
  mvpPrescription('mvp-prescription-push-3', PREBUILT_TEMPLATE_DAY_IDS.pushDay, MVP_EXERCISE_DEFINITION_IDS.shoulderPress, 3, 3, 8, 12, 'shoulders', MVP_PROGRESSION_POLICY_IDS.doubleProgression),
  mvpPrescription('mvp-prescription-push-4', PREBUILT_TEMPLATE_DAY_IDS.pushDay, MVP_EXERCISE_DEFINITION_IDS.lateralRaise, 4, 3, 12, 20, 'shoulders', MVP_PROGRESSION_POLICY_IDS.repProgression),
  mvpPrescription('mvp-prescription-push-5', PREBUILT_TEMPLATE_DAY_IDS.pushDay, MVP_EXERCISE_DEFINITION_IDS.tricepsPressdown, 5, 2, 10, 15, 'triceps', MVP_PROGRESSION_POLICY_IDS.repProgression),
  mvpPrescription('mvp-prescription-pull-1', PREBUILT_TEMPLATE_DAY_IDS.pullDay, MVP_EXERCISE_DEFINITION_IDS.latPulldown, 1, 3, 8, 12, 'lats', MVP_PROGRESSION_POLICY_IDS.doubleProgression),
  mvpPrescription('mvp-prescription-pull-2', PREBUILT_TEMPLATE_DAY_IDS.pullDay, MVP_EXERCISE_DEFINITION_IDS.row, 2, 3, 8, 12, 'back', MVP_PROGRESSION_POLICY_IDS.doubleProgression),
  mvpPrescription('mvp-prescription-pull-3', PREBUILT_TEMPLATE_DAY_IDS.pullDay, MVP_EXERCISE_DEFINITION_IDS.rearDeltFly, 3, 3, 12, 20, 'rear_delts', MVP_PROGRESSION_POLICY_IDS.repProgression),
  mvpPrescription('mvp-prescription-pull-4', PREBUILT_TEMPLATE_DAY_IDS.pullDay, MVP_EXERCISE_DEFINITION_IDS.curl, 4, 3, 10, 15, 'biceps', MVP_PROGRESSION_POLICY_IDS.repProgression),
  mvpPrescription('mvp-prescription-pull-5', PREBUILT_TEMPLATE_DAY_IDS.pullDay, MVP_EXERCISE_DEFINITION_IDS.shrug, 5, 2, 10, 15, 'traps', MVP_PROGRESSION_POLICY_IDS.doubleProgression),
  mvpPrescription('mvp-prescription-legs-1', PREBUILT_TEMPLATE_DAY_IDS.legsDay, MVP_EXERCISE_DEFINITION_IDS.squatOrLegPress, 1, 3, 8, 12, 'quads', MVP_PROGRESSION_POLICY_IDS.doubleProgression),
  mvpPrescription('mvp-prescription-legs-2', PREBUILT_TEMPLATE_DAY_IDS.legsDay, MVP_EXERCISE_DEFINITION_IDS.romanianDeadlift, 2, 3, 8, 12, 'hamstrings', MVP_PROGRESSION_POLICY_IDS.doubleProgression),
  mvpPrescription('mvp-prescription-legs-3', PREBUILT_TEMPLATE_DAY_IDS.legsDay, MVP_EXERCISE_DEFINITION_IDS.legExtension, 3, 2, 10, 15, 'quads', MVP_PROGRESSION_POLICY_IDS.repProgression),
  mvpPrescription('mvp-prescription-legs-4', PREBUILT_TEMPLATE_DAY_IDS.legsDay, MVP_EXERCISE_DEFINITION_IDS.legCurl, 4, 2, 10, 15, 'hamstrings', MVP_PROGRESSION_POLICY_IDS.repProgression),
  mvpPrescription('mvp-prescription-legs-5', PREBUILT_TEMPLATE_DAY_IDS.legsDay, MVP_EXERCISE_DEFINITION_IDS.calfRaise, 5, 3, 10, 20, 'calves', MVP_PROGRESSION_POLICY_IDS.repProgression),
  mvpPrescription('mvp-prescription-legs-6', PREBUILT_TEMPLATE_DAY_IDS.legsDay, MVP_EXERCISE_DEFINITION_IDS.abs, 6, 2, 10, 20, 'abs', MVP_PROGRESSION_POLICY_IDS.repProgression),
  mvpPrescription('mvp-prescription-hit-a-1', PREBUILT_TEMPLATE_DAY_IDS.hitDayA, MVP_EXERCISE_DEFINITION_IDS.inclinePress, 1, 1, 6, 10, 'chest', MVP_PROGRESSION_POLICY_IDS.topSetProgression),
  mvpPrescription('mvp-prescription-hit-a-2', PREBUILT_TEMPLATE_DAY_IDS.hitDayA, MVP_EXERCISE_DEFINITION_IDS.latPulldown, 2, 1, 6, 10, 'lats', MVP_PROGRESSION_POLICY_IDS.topSetProgression),
  mvpPrescription('mvp-prescription-hit-a-3', PREBUILT_TEMPLATE_DAY_IDS.hitDayA, MVP_EXERCISE_DEFINITION_IDS.shoulderPress, 3, 1, 6, 10, 'shoulders', MVP_PROGRESSION_POLICY_IDS.topSetProgression),
  mvpPrescription('mvp-prescription-hit-a-4', PREBUILT_TEMPLATE_DAY_IDS.hitDayA, MVP_EXERCISE_DEFINITION_IDS.row, 4, 1, 6, 10, 'back', MVP_PROGRESSION_POLICY_IDS.topSetProgression),
  mvpPrescription('mvp-prescription-hit-a-5', PREBUILT_TEMPLATE_DAY_IDS.hitDayA, MVP_EXERCISE_DEFINITION_IDS.curl, 5, 1, 8, 12, 'biceps', MVP_PROGRESSION_POLICY_IDS.topSetProgression),
  mvpPrescription('mvp-prescription-hit-a-6', PREBUILT_TEMPLATE_DAY_IDS.hitDayA, MVP_EXERCISE_DEFINITION_IDS.tricepsPressdown, 6, 1, 8, 12, 'triceps', MVP_PROGRESSION_POLICY_IDS.topSetProgression),
  mvpPrescription('mvp-prescription-hit-b-1', PREBUILT_TEMPLATE_DAY_IDS.hitDayB, MVP_EXERCISE_DEFINITION_IDS.legPress, 1, 1, 8, 12, 'quads', MVP_PROGRESSION_POLICY_IDS.topSetProgression),
  mvpPrescription('mvp-prescription-hit-b-2', PREBUILT_TEMPLATE_DAY_IDS.hitDayB, MVP_EXERCISE_DEFINITION_IDS.romanianDeadlift, 2, 1, 6, 10, 'hamstrings', MVP_PROGRESSION_POLICY_IDS.topSetProgression),
  mvpPrescription('mvp-prescription-hit-b-3', PREBUILT_TEMPLATE_DAY_IDS.hitDayB, MVP_EXERCISE_DEFINITION_IDS.legCurl, 3, 1, 8, 12, 'hamstrings', MVP_PROGRESSION_POLICY_IDS.topSetProgression),
  mvpPrescription('mvp-prescription-hit-b-4', PREBUILT_TEMPLATE_DAY_IDS.hitDayB, MVP_EXERCISE_DEFINITION_IDS.calfRaise, 4, 1, 10, 15, 'calves', MVP_PROGRESSION_POLICY_IDS.topSetProgression),
  mvpPrescription('mvp-prescription-hit-b-5', PREBUILT_TEMPLATE_DAY_IDS.hitDayB, MVP_EXERCISE_DEFINITION_IDS.abs, 5, 1, 10, 20, 'abs', MVP_PROGRESSION_POLICY_IDS.repProgression),
] as const;
