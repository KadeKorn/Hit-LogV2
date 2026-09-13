import {
  MVP_EXERCISE_DEFINITION_IDS as E,
  MVP_PROGRESSION_POLICY_IDS as P,
  type SeedExerciseDefinitionRecord,
  type SeedExercisePrescriptionRecord,
  type SeedPrebuiltTemplateRecord,
  type SeedTemplateDayRecord,
} from '@/db/seeds/prebuilt-templates';

const timestamp = '2026-09-13T00:00:00.000Z';

export const AESTHETIC_LOWER_BODY_TEMPLATE_ID = 'prebuilt-template-aesthetic-lower-body-4x';

const D = {
  shouldersTriceps: 'prebuilt-day-aesthetic-lower-body-a',
  glutesQuads: 'prebuilt-day-aesthetic-lower-body-b',
  backBiceps: 'prebuilt-day-aesthetic-lower-body-c',
  glutesHamstrings: 'prebuilt-day-aesthetic-lower-body-d',
} as const;

const X = {
  bootyBuilder: 'mvp-exercise-booty-builder-glute-drive',
  gobletSquat: 'mvp-exercise-goblet-squat',
  assistedChinUp: 'mvp-exercise-assisted-chin-up',
  cableUprightRow: 'mvp-exercise-cable-upright-row',
  alternatingDumbbellFrontRaise: 'mvp-exercise-alternating-dumbbell-front-raise',
  hipAbductorMachine: 'mvp-exercise-hip-abductor-machine',
  hipAdductorMachine: 'mvp-exercise-hip-adductor-machine',
} as const;

export const aestheticLowerBodyTemplateSeeds: readonly SeedPrebuiltTemplateRecord[] = [
  {
    id: AESTHETIC_LOWER_BODY_TEMPLATE_ID,
    code: 'prebuilt-aesthetic-lower-body-4x',
    name: 'Aesthetic Lower-Body Emphasis',
    description:
      'Four-day aesthetic split with two lower-body days emphasizing glutes, quads, and hamstrings plus dedicated shoulders/triceps and back/biceps sessions. Progress through clean reps before adding load.',
    goal: 'hypertrophy',
    splitType: 'upper_lower_emphasis',
    sourceType: 'prebuilt',
    isEditable: false,
    orderIndex: 103,
    isActive: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  },
];

const day = (
  id: string,
  name: string,
  dayOrder: number,
  focus: string
): SeedTemplateDayRecord => ({
  id,
  templateId: AESTHETIC_LOWER_BODY_TEMPLATE_ID,
  name,
  dayOrder,
  focus,
  createdAt: timestamp,
  updatedAt: timestamp,
});

export const aestheticLowerBodyTemplateDaySeeds: readonly SeedTemplateDayRecord[] = [
  day(D.shouldersTriceps, 'Day A — Shoulders / Triceps', 1, 'shoulders_triceps'),
  day(D.glutesQuads, 'Day B — Glutes / Quads', 2, 'glutes_quads'),
  day(D.backBiceps, 'Day C — Back / Biceps', 3, 'back_biceps'),
  day(D.glutesHamstrings, 'Day D — Glutes / Hamstrings', 4, 'glutes_hamstrings'),
];

const exerciseDefinition = (
  id: string,
  name: string,
  primaryMuscleGroup: string,
  category: string,
  equipment: string,
  movementPattern: string,
  defaultRepMin: number,
  defaultRepMax: number,
  defaultProgressionMethod: 'double_progression' | 'rep_progression',
  defaultLoadIncrement: number | null,
  defaultRestSeconds: number,
  secondaryMuscleGroups: string[] | null = null,
  notes = ''
): SeedExerciseDefinitionRecord => ({
  id,
  name,
  primaryMuscleGroup,
  secondaryMuscleGroups,
  category,
  equipment,
  movementPattern,
  difficulty: 'beginner',
  notes,
  sourceType: 'prebuilt',
  defaultRepMin,
  defaultRepMax,
  defaultProgressionMethod,
  defaultLoadIncrement,
  defaultRestSeconds,
  createdAt: timestamp,
  updatedAt: timestamp,
});

export const aestheticLowerBodyExerciseDefinitionSeeds: readonly SeedExerciseDefinitionRecord[] = [
  exerciseDefinition(
    X.bootyBuilder,
    'Booty Builder / Glute Drive',
    'glutes',
    'machine',
    'machine',
    'hip_extension',
    8,
    12,
    'double_progression',
    10,
    150,
    ['hamstrings'],
    'Use the machine setup that lets you drive through the hips with a controlled lockout.'
  ),
  exerciseDefinition(
    X.gobletSquat,
    'Goblet Squat',
    'quads',
    'dumbbell',
    'dumbbell',
    'squat',
    10,
    15,
    'rep_progression',
    5,
    120,
    ['glutes']
  ),
  exerciseDefinition(
    X.assistedChinUp,
    'Machine-Assisted Chin-Up',
    'lats',
    'machine',
    'machine',
    'vertical_pull',
    6,
    10,
    'rep_progression',
    null,
    120,
    ['biceps', 'upper_back'],
    'Reduce assistance only after all sets reach the top of the rep range with clean reps.'
  ),
  exerciseDefinition(
    X.cableUprightRow,
    'Cable Upright Row',
    'side_delts',
    'cable',
    'cable',
    'upright_row',
    10,
    15,
    'rep_progression',
    2.5,
    90,
    ['traps']
  ),
  exerciseDefinition(
    X.alternatingDumbbellFrontRaise,
    'Alternating Dumbbell Front Raise',
    'front_delts',
    'dumbbell',
    'dumbbell',
    'front_raise',
    10,
    15,
    'rep_progression',
    2.5,
    75,
    null,
    'Reps are per arm.'
  ),
  exerciseDefinition(
    X.hipAbductorMachine,
    'Hip Abductor Machine',
    'glutes',
    'machine',
    'machine',
    'hip_abduction',
    12,
    20,
    'rep_progression',
    5,
    75,
    ['glute_medius']
  ),
  exerciseDefinition(
    X.hipAdductorMachine,
    'Hip Adductor Machine',
    'adductors',
    'machine',
    'machine',
    'hip_adduction',
    12,
    20,
    'rep_progression',
    5,
    75
  ),
];

type PrescriptionInput = {
  id: string;
  dayId: string;
  exerciseDefinitionId: string;
  order: number;
  sets: number;
  min: number;
  max: number;
  muscle: string;
  progressionPolicyId: string;
  loadIncrement: number | null;
  restSeconds: number;
  notes?: string;
};

const rx = ({
  id,
  dayId,
  exerciseDefinitionId,
  order,
  sets,
  min,
  max,
  muscle,
  progressionPolicyId,
  loadIncrement,
  restSeconds,
  notes,
}: PrescriptionInput): SeedExercisePrescriptionRecord => ({
  id,
  templateDayId: dayId,
  exerciseDefinitionId,
  progressionPolicyId,
  exerciseOrder: order,
  sets,
  repRangeMin: min,
  repRangeMax: max,
  muscleGroup: muscle,
  loadIncrement,
  restSeconds,
  notes: notes ?? null,
  createdAt: timestamp,
  updatedAt: timestamp,
});

export const aestheticLowerBodyExercisePrescriptionSeeds: readonly SeedExercisePrescriptionRecord[] = [
  // Day A — Shoulders / Triceps
  rx({ id: 'prebuilt-rx-alb-a-machine-shoulder-press', dayId: D.shouldersTriceps, exerciseDefinitionId: E.machineShoulderPress, order: 1, sets: 3, min: 8, max: 12, muscle: 'front_delts', progressionPolicyId: P.doubleProgression, loadIncrement: 5, restSeconds: 120 }),
  rx({ id: 'prebuilt-rx-alb-a-machine-dip', dayId: D.shouldersTriceps, exerciseDefinitionId: E.machineDip, order: 2, sets: 3, min: 8, max: 12, muscle: 'triceps', progressionPolicyId: P.doubleProgression, loadIncrement: 5, restSeconds: 120 }),
  rx({ id: 'prebuilt-rx-alb-a-upright-row', dayId: D.shouldersTriceps, exerciseDefinitionId: X.cableUprightRow, order: 3, sets: 3, min: 10, max: 15, muscle: 'side_delts', progressionPolicyId: P.repProgression, loadIncrement: 2.5, restSeconds: 90 }),
  rx({ id: 'prebuilt-rx-alb-a-rope-pressdown', dayId: D.shouldersTriceps, exerciseDefinitionId: E.ropePressdown, order: 4, sets: 3, min: 10, max: 15, muscle: 'triceps', progressionPolicyId: P.repProgression, loadIncrement: 5, restSeconds: 90 }),
  rx({ id: 'prebuilt-rx-alb-a-rear-delt-fly', dayId: D.shouldersTriceps, exerciseDefinitionId: E.rearDeltFly, order: 5, sets: 3, min: 12, max: 15, muscle: 'rear_delts', progressionPolicyId: P.repProgression, loadIncrement: 5, restSeconds: 75 }),
  rx({ id: 'prebuilt-rx-alb-a-overhead-triceps', dayId: D.shouldersTriceps, exerciseDefinitionId: E.overheadCableTricepsExtension, order: 6, sets: 3, min: 10, max: 15, muscle: 'triceps', progressionPolicyId: P.repProgression, loadIncrement: 2.5, restSeconds: 90 }),
  rx({ id: 'prebuilt-rx-alb-a-front-raise', dayId: D.shouldersTriceps, exerciseDefinitionId: X.alternatingDumbbellFrontRaise, order: 7, sets: 3, min: 10, max: 15, muscle: 'front_delts', progressionPolicyId: P.repProgression, loadIncrement: 2.5, restSeconds: 75, notes: 'Reps are per arm.' }),
  rx({ id: 'prebuilt-rx-alb-a-pec-deck', dayId: D.shouldersTriceps, exerciseDefinitionId: E.pecDeckFly, order: 8, sets: 2, min: 10, max: 15, muscle: 'chest', progressionPolicyId: P.repProgression, loadIncrement: 5, restSeconds: 90 }),

  // Day B — Glutes / Quads
  rx({ id: 'prebuilt-rx-alb-b-booty-builder', dayId: D.glutesQuads, exerciseDefinitionId: X.bootyBuilder, order: 1, sets: 4, min: 8, max: 12, muscle: 'glutes', progressionPolicyId: P.doubleProgression, loadIncrement: 10, restSeconds: 150 }),
  rx({ id: 'prebuilt-rx-alb-b-leg-press', dayId: D.glutesQuads, exerciseDefinitionId: E.legPress, order: 2, sets: 3, min: 8, max: 12, muscle: 'quads', progressionPolicyId: P.doubleProgression, loadIncrement: 10, restSeconds: 150 }),
  rx({ id: 'prebuilt-rx-alb-b-goblet-squat', dayId: D.glutesQuads, exerciseDefinitionId: X.gobletSquat, order: 3, sets: 3, min: 10, max: 15, muscle: 'quads', progressionPolicyId: P.repProgression, loadIncrement: 5, restSeconds: 120 }),
  rx({ id: 'prebuilt-rx-alb-b-leg-extension', dayId: D.glutesQuads, exerciseDefinitionId: E.legExtension, order: 4, sets: 3, min: 10, max: 15, muscle: 'quads', progressionPolicyId: P.repProgression, loadIncrement: 5, restSeconds: 90 }),
  rx({ id: 'prebuilt-rx-alb-b-abductor', dayId: D.glutesQuads, exerciseDefinitionId: X.hipAbductorMachine, order: 5, sets: 3, min: 12, max: 20, muscle: 'glutes', progressionPolicyId: P.repProgression, loadIncrement: 5, restSeconds: 75 }),
  rx({ id: 'prebuilt-rx-alb-b-adductor', dayId: D.glutesQuads, exerciseDefinitionId: X.hipAdductorMachine, order: 6, sets: 3, min: 12, max: 20, muscle: 'adductors', progressionPolicyId: P.repProgression, loadIncrement: 5, restSeconds: 75 }),

  // Day C — Back / Biceps
  rx({ id: 'prebuilt-rx-alb-c-assisted-chin', dayId: D.backBiceps, exerciseDefinitionId: X.assistedChinUp, order: 1, sets: 3, min: 6, max: 10, muscle: 'lats', progressionPolicyId: P.repProgression, loadIncrement: null, restSeconds: 120, notes: 'Reduce assistance after all sets reach 10 clean reps.' }),
  rx({ id: 'prebuilt-rx-alb-c-barbell-row', dayId: D.backBiceps, exerciseDefinitionId: E.barbellRow, order: 2, sets: 3, min: 8, max: 12, muscle: 'upper_back', progressionPolicyId: P.doubleProgression, loadIncrement: 5, restSeconds: 150 }),
  rx({ id: 'prebuilt-rx-alb-c-one-arm-pulldown', dayId: D.backBiceps, exerciseDefinitionId: E.singleArmCableLatPulldown, order: 3, sets: 3, min: 10, max: 15, muscle: 'lats', progressionPolicyId: P.repProgression, loadIncrement: 2.5, restSeconds: 90, notes: 'Use a kneeling setup. Reps are per side.' }),
  rx({ id: 'prebuilt-rx-alb-c-seated-row', dayId: D.backBiceps, exerciseDefinitionId: E.seatedCableRow, order: 4, sets: 3, min: 10, max: 15, muscle: 'upper_back', progressionPolicyId: P.repProgression, loadIncrement: 5, restSeconds: 90 }),
  rx({ id: 'prebuilt-rx-alb-c-incline-curl', dayId: D.backBiceps, exerciseDefinitionId: E.inclineDumbbellCurl, order: 5, sets: 3, min: 8, max: 12, muscle: 'biceps', progressionPolicyId: P.doubleProgression, loadIncrement: 5, restSeconds: 90 }),

  // Day D — Glutes / Hamstrings
  rx({ id: 'prebuilt-rx-alb-d-rdl', dayId: D.glutesHamstrings, exerciseDefinitionId: E.romanianDeadlift, order: 1, sets: 4, min: 8, max: 12, muscle: 'glutes', progressionPolicyId: P.doubleProgression, loadIncrement: 10, restSeconds: 180, notes: 'Keep the hinge controlled and stop before technique breaks down.' }),
  rx({ id: 'prebuilt-rx-alb-d-kickback', dayId: D.glutesHamstrings, exerciseDefinitionId: E.cableKickback, order: 2, sets: 3, min: 10, max: 15, muscle: 'glutes', progressionPolicyId: P.repProgression, loadIncrement: 2.5, restSeconds: 75, notes: 'Reps are per side.' }),
  rx({ id: 'prebuilt-rx-alb-d-leg-curl', dayId: D.glutesHamstrings, exerciseDefinitionId: E.seatedLegCurl, order: 3, sets: 3, min: 10, max: 15, muscle: 'hamstrings', progressionPolicyId: P.repProgression, loadIncrement: 5, restSeconds: 90 }),
  rx({ id: 'prebuilt-rx-alb-d-calf-raise', dayId: D.glutesHamstrings, exerciseDefinitionId: E.standingCalfRaise, order: 4, sets: 4, min: 10, max: 15, muscle: 'calves', progressionPolicyId: P.repProgression, loadIncrement: 5, restSeconds: 90 }),
];
