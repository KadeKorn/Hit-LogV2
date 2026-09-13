import {
  MVP_EXERCISE_DEFINITION_IDS as E,
  MVP_PROGRESSION_POLICY_IDS,
  type SeedExercisePrescriptionRecord,
  type SeedPrebuiltTemplateRecord,
  type SeedTemplateDayRecord,
} from '@/db/seeds/prebuilt-templates';

const timestamp = '2026-09-13T00:00:00.000Z';

export const CURRENT_PREBUILT_TEMPLATE_IDS = {
  aesthetic: 'prebuilt-template-aesthetic-full-body-4x',
  athletic: 'prebuilt-template-strength-athletic-4x',
  travel: 'prebuilt-template-travel-calisthenics',
} as const;

const T = CURRENT_PREBUILT_TEMPLATE_IDS;
const D = {
  aestheticA: 'prebuilt-day-aesthetic-4x-a',
  aestheticB: 'prebuilt-day-aesthetic-4x-b',
  aestheticC: 'prebuilt-day-aesthetic-4x-c',
  aestheticD: 'prebuilt-day-aesthetic-4x-d',
  athleticA: 'prebuilt-day-athletic-4x-a',
  athleticB: 'prebuilt-day-athletic-4x-b',
  athleticC: 'prebuilt-day-athletic-4x-c',
  athleticD: 'prebuilt-day-athletic-4x-d',
  travelA: 'prebuilt-day-travel-a',
  travelB: 'prebuilt-day-travel-b',
  travelC: 'prebuilt-day-travel-c',
} as const;

export const prebuiltTemplateSeeds: readonly SeedPrebuiltTemplateRecord[] = [
  {
    id: T.aesthetic, code: 'prebuilt-aesthetic-full-body-4x', name: 'Aesthetic Full-Body Hypertrophy',
    description: 'Four-day physique routine emphasizing side delts, chest, lats, arms, legs, and abs. Keep most sets 1–3 reps from your limit; a suggested last set may be pushed harder with clean form.',
    goal: 'hypertrophy', splitType: 'full_body', sourceType: 'prebuilt', isEditable: false,
    orderIndex: 100, isActive: false, createdAt: timestamp, updatedAt: timestamp,
  },
  {
    id: T.athletic, code: 'prebuilt-strength-athletic-4x', name: 'Strength & Athletic Performance',
    description: 'Four-day strength and power plan with jumps, throws, a short sprint, kettlebell swings, and carries. Perform explosive work while fresh and stop when speed or technique falls off.',
    goal: 'athletic_performance', splitType: 'full_body_athletic', sourceType: 'prebuilt', isEditable: false,
    orderIndex: 101, isActive: false, createdAt: timestamp, updatedAt: timestamp,
  },
  {
    id: T.travel, code: 'prebuilt-travel-calisthenics', name: 'Travel Calisthenics',
    description: 'Three-workout bodyweight rotation using a pull-up bar. Log completed reps, then progress through cleaner reps and harder movement variations.',
    goal: 'bodyweight_training', splitType: 'full_body_rotation', sourceType: 'prebuilt', isEditable: false,
    orderIndex: 102, isActive: false, createdAt: timestamp, updatedAt: timestamp,
  },
];

const day = (id: string, templateId: string, name: string, dayOrder: number, focus: string): SeedTemplateDayRecord => ({
  id, templateId, name, dayOrder, focus, createdAt: timestamp, updatedAt: timestamp,
});

export const prebuiltTemplateDaySeeds: readonly SeedTemplateDayRecord[] = [
  day(D.aestheticA, T.aesthetic, 'Day A — Upper Chest / Lats / Quads', 1, 'upper_chest_lats_quads'),
  day(D.aestheticB, T.aesthetic, 'Day B — Posterior Chain / Delts / Arms', 2, 'posterior_delts_arms'),
  day(D.aestheticC, T.aesthetic, 'Day C — Back / Chest / Quads', 3, 'back_chest_quads'),
  day(D.aestheticD, T.aesthetic, 'Day D — Shoulder / V-Taper / Arms', 4, 'shoulder_v_taper_arms'),
  day(D.athleticA, T.athletic, 'Day A — Lower Strength / Jump', 1, 'lower_strength_jump'),
  day(D.athleticB, T.athletic, 'Day B — Upper Strength / Carry', 2, 'upper_strength_carry'),
  day(D.athleticC, T.athletic, 'Day C — Speed / Posterior Chain', 3, 'speed_posterior_chain'),
  day(D.athleticD, T.athletic, 'Day D — Athletic Full Body', 4, 'athletic_full_body'),
  day(D.travelA, T.travel, 'Day A — Push / Pull / Legs', 1, 'push_pull_legs'),
  day(D.travelB, T.travel, 'Day B — Vertical Push / Chin-Up / Legs', 2, 'vertical_push_chin_up_legs'),
  day(D.travelC, T.travel, 'Day C — Full-Body Calisthenics', 3, 'full_body_calisthenics'),
];

type Method = 'double_progression' | 'top_set_progression' | 'rep_progression' | 'manual' | 'none';
type PrescriptionSpec = readonly [
  dayId: string, exerciseId: string, sets: number, min: number, max: number,
  muscle: string, method: Method, increment: number | null, rest: number | null, notes?: string,
];

const finalSetCue = 'Suggested final working set: as many clean reps as possible. Mark No reps left only if true.';
const noLimitCue = 'Keep speed and technique crisp. Do not train this movement to your rep limit.';
const specs: readonly PrescriptionSpec[] = [
  // Aesthetic: the suggested hard set is already included in the listed set count.
  [D.aestheticA, E.inclineDumbbellPress, 3, 6, 10, 'chest', 'double_progression', 5, 180],
  [D.aestheticA, E.latPulldown, 3, 8, 12, 'lats', 'double_progression', 5, 120, finalSetCue],
  [D.aestheticA, E.hackSquat, 3, 8, 12, 'quads', 'double_progression', 10, 180, 'Stop before technique breaks down.'],
  [D.aestheticA, E.cableLateralRaise, 3, 12, 20, 'side_delts', 'rep_progression', 2.5, 90],
  [D.aestheticA, E.chestSupportedRow, 2, 8, 12, 'upper_back', 'double_progression', 5, 120],
  [D.aestheticA, E.ezBarCurl, 2, 8, 12, 'biceps', 'double_progression', 5, 90],
  [D.aestheticA, E.cableCrunch, 2, 10, 15, 'abs', 'rep_progression', 5, 60],

  [D.aestheticB, E.romanianDeadlift, 3, 6, 10, 'glutes', 'double_progression', 10, 180, 'Stop before technique breaks down.'],
  [D.aestheticB, E.machineChestPress, 3, 8, 12, 'chest', 'double_progression', 5, 120],
  [D.aestheticB, E.singleArmCableLatPulldown, 3, 10, 15, 'lats', 'rep_progression', 2.5, 90],
  [D.aestheticB, E.seatedLegCurl, 3, 10, 15, 'hamstrings', 'rep_progression', 5, 90],
  [D.aestheticB, E.machineLateralRaise, 3, 12, 20, 'side_delts', 'rep_progression', 5, 90, finalSetCue],
  [D.aestheticB, E.overheadCableTricepsExtension, 2, 10, 15, 'triceps', 'rep_progression', 2.5, 90],
  [D.aestheticB, E.inclineDumbbellCurl, 2, 10, 15, 'biceps', 'rep_progression', 5, 90],

  [D.aestheticC, E.legPress, 3, 10, 15, 'quads', 'double_progression', 10, 180],
  [D.aestheticC, E.chestSupportedTBarRow, 3, 6, 10, 'upper_back', 'double_progression', 5, 150],
  [D.aestheticC, E.pecDeckFly, 2, 10, 15, 'chest', 'rep_progression', 5, 90, finalSetCue],
  [D.aestheticC, E.neutralGripPulldown, 2, 8, 12, 'lats', 'double_progression', 5, 120],
  [D.aestheticC, E.legExtension, 2, 12, 15, 'quads', 'rep_progression', 5, 90],
  [D.aestheticC, E.cableLateralRaise, 3, 12, 20, 'side_delts', 'rep_progression', 2.5, 90],
  [D.aestheticC, E.ropePressdown, 2, 10, 15, 'triceps', 'rep_progression', 5, 90],
  [D.aestheticC, E.hammerCurl, 2, 10, 15, 'biceps', 'rep_progression', 5, 90],

  [D.aestheticD, E.machineShoulderPress, 3, 6, 10, 'front_delts', 'double_progression', 5, 150],
  [D.aestheticD, E.bulgarianSplitSquat, 2, 8, 12, 'glutes', 'double_progression', 5, 120, 'Reps are per leg. Stop before technique breaks down.'],
  [D.aestheticD, E.chestSupportedHighRow, 2, 8, 12, 'upper_back', 'double_progression', 5, 120],
  [D.aestheticD, E.inclineMachinePress, 2, 8, 12, 'chest', 'double_progression', 5, 120],
  [D.aestheticD, E.straightArmPulldown, 2, 10, 15, 'lats', 'rep_progression', 2.5, 90],
  [D.aestheticD, E.cableLateralRaise, 3, 12, 20, 'side_delts', 'rep_progression', 2.5, 90, finalSetCue],
  [D.aestheticD, E.overheadCableTricepsExtension, 2, 10, 15, 'triceps', 'rep_progression', 2.5, 90],
  [D.aestheticD, E.cableCurl, 2, 10, 15, 'biceps', 'rep_progression', 2.5, 90],

  // Athletic: repetitions record jumps, throws, runs, or trips; power quality drives manual progression.
  [D.athleticA, E.broadJump, 3, 3, 3, 'quads', 'manual', null, 150, noLimitCue],
  [D.athleticA, E.frontSquat, 4, 4, 6, 'quads', 'double_progression', 5, 180],
  [D.athleticA, E.benchPress, 3, 5, 8, 'chest', 'double_progression', 5, 180],
  [D.athleticA, E.pullUp, 3, 6, 10, 'lats', 'rep_progression', null, 150],
  [D.athleticA, E.kettlebellSwing, 4, 8, 12, 'glutes', 'manual', null, 120, noLimitCue],
  [D.athleticA, E.farmerCarry, 3, 1, 1, 'traps', 'manual', null, 120, 'Each rep is one 20 m trip. Log carried weight when useful.'],
  [D.athleticA, E.cableCrunch, 2, 10, 15, 'abs', 'rep_progression', 5, 60],

  [D.athleticB, E.medicineBallChestThrow, 3, 4, 6, 'chest', 'manual', null, 120, noLimitCue],
  [D.athleticB, E.overheadPress, 4, 4, 6, 'front_delts', 'double_progression', 5, 180],
  [D.athleticB, E.barbellRow, 3, 6, 8, 'upper_back', 'double_progression', 5, 150],
  [D.athleticB, E.bulgarianSplitSquat, 3, 6, 10, 'glutes', 'double_progression', 5, 120, 'Reps are per leg.'],
  [D.athleticB, E.kettlebellSwing, 3, 10, 10, 'glutes', 'manual', null, 120, noLimitCue],
  [D.athleticB, E.suitcaseCarry, 3, 2, 2, 'traps', 'manual', null, 120, 'Each set: one 20 m trip per side. Log 2 completed trips.'],
  [D.athleticB, E.hangingLegRaise, 2, 8, 15, 'abs', 'rep_progression', null, 75],

  [D.athleticC, E.shortSprint20m, 5, 1, 1, 'quads', 'manual', null, 150, noLimitCue],
  [D.athleticC, E.romanianDeadlift, 3, 5, 8, 'glutes', 'double_progression', 10, 180],
  [D.athleticC, E.inclineDumbbellPress, 3, 6, 10, 'chest', 'double_progression', 5, 150],
  [D.athleticC, E.pullUp, 3, 6, 10, 'lats', 'rep_progression', null, 150],
  [D.athleticC, E.reverseLunge, 3, 8, 8, 'glutes', 'rep_progression', 5, 120, 'Reps are per leg.'],
  [D.athleticC, E.farmerCarry, 3, 1, 1, 'traps', 'manual', null, 120, 'Each rep is one 20 m trip.'],
  [D.athleticC, E.reverseCrunch, 2, 10, 15, 'abs', 'rep_progression', null, 60],

  [D.athleticD, E.boxJump, 3, 3, 3, 'quads', 'manual', null, 150, noLimitCue],
  [D.athleticD, E.backSquat, 3, 5, 8, 'quads', 'double_progression', 10, 180],
  [D.athleticD, E.pushPress, 3, 5, 8, 'front_delts', 'manual', null, 180, noLimitCue],
  [D.athleticD, E.chestSupportedRow, 3, 6, 10, 'upper_back', 'double_progression', 5, 150],
  [D.athleticD, E.kettlebellSwing, 4, 10, 10, 'glutes', 'manual', null, 120, noLimitCue],
  [D.athleticD, E.farmerCarry, 3, 1, 1, 'traps', 'manual', null, 120, 'Each rep is one 20 m trip.'],
  [D.athleticD, E.pallofPress, 2, 10, 15, 'abs', 'rep_progression', 2.5, 75, 'Reps are per side.'],

  // Travel: all prescriptions use completed reps; no timers, holds, or fixed per-workout increases.
  [D.travelA, E.pullUp, 4, 5, 12, 'lats', 'rep_progression', null, 150],
  [D.travelA, E.feetElevatedPushUp, 4, 8, 20, 'chest', 'rep_progression', null, 90, 'Use only a stable surface; otherwise substitute Push-Up.'],
  [D.travelA, E.bulgarianSplitSquat, 3, 8, 15, 'glutes', 'rep_progression', null, 120, 'Reps are per leg. Use only a stable surface.'],
  [D.travelA, E.pikePushUp, 3, 6, 15, 'front_delts', 'rep_progression', null, 120],
  [D.travelA, E.singleLegGluteBridge, 3, 10, 20, 'glutes', 'rep_progression', null, 90, 'Reps are per leg.'],
  [D.travelA, E.hangingKneeRaise, 3, 8, 15, 'abs', 'rep_progression', null, 75],

  [D.travelB, E.chinUp, 4, 5, 12, 'lats', 'rep_progression', null, 150],
  [D.travelB, E.pikePushUp, 4, 5, 12, 'front_delts', 'rep_progression', null, 120],
  [D.travelB, E.reverseLunge, 3, 10, 20, 'glutes', 'rep_progression', null, 120, 'Reps are per leg.'],
  [D.travelB, E.closeGripPushUp, 3, 8, 20, 'triceps', 'rep_progression', null, 90],
  [D.travelB, E.hamstringWalkout, 3, 8, 15, 'hamstrings', 'rep_progression', null, 90],
  [D.travelB, E.reverseCrunch, 3, 10, 20, 'abs', 'rep_progression', null, 60],
  [D.travelB, E.deadBug, 2, 8, 12, 'abs', 'rep_progression', null, 60, 'Reps are per side.'],

  [D.travelC, E.pullUp, 4, 5, 12, 'lats', 'rep_progression', null, 150],
  [D.travelC, E.pushUp, 4, 8, 20, 'chest', 'rep_progression', null, 90, 'Use a full, controlled range of motion.'],
  [D.travelC, E.assistedPistolSquat, 3, 6, 12, 'quads', 'rep_progression', null, 120, 'Reps are per leg.'],
  [D.travelC, E.feetElevatedPikePushUp, 3, 6, 12, 'front_delts', 'rep_progression', null, 120, 'Use only a stable support; otherwise substitute Pike Push-Up.'],
  [D.travelC, E.diamondPushUp, 3, 8, 20, 'triceps', 'rep_progression', null, 90],
  [D.travelC, E.hangingLegRaise, 3, 8, 15, 'abs', 'rep_progression', null, 75],
];

const policyIds: Record<Method, string> = {
  double_progression: MVP_PROGRESSION_POLICY_IDS.doubleProgression,
  top_set_progression: MVP_PROGRESSION_POLICY_IDS.topSetProgression,
  rep_progression: MVP_PROGRESSION_POLICY_IDS.repProgression,
  manual: MVP_PROGRESSION_POLICY_IDS.manual,
  none: MVP_PROGRESSION_POLICY_IDS.none,
};

const orders = new Map<string, number>();
export const mvpExercisePrescriptionSeeds: readonly SeedExercisePrescriptionRecord[] = specs.map((spec) => {
  const [templateDayId, exerciseDefinitionId, sets, repRangeMin, repRangeMax, muscleGroup, method, loadIncrement, restSeconds, notes] = spec;
  const exerciseOrder = (orders.get(templateDayId) ?? 0) + 1;
  orders.set(templateDayId, exerciseOrder);
  return {
    id: `current-prescription-${templateDayId}-${exerciseOrder}`,
    templateDayId, exerciseDefinitionId, exerciseOrder, sets, repRangeMin, repRangeMax,
    muscleGroup, progressionPolicyId: policyIds[method], loadIncrement, restSeconds,
    notes: notes ?? null, createdAt: timestamp, updatedAt: timestamp,
  };
});
