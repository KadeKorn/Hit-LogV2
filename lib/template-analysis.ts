import type { WorkoutTemplateDetail } from '@/db/repositories/template-repository';

export type GoalFitLabel =
  | 'Strong fit'
  | 'Good fit'
  | 'Needs review'
  | 'Low signal / insufficient metadata';

export type MuscleSetSummary = {
  label: string;
  muscleGroup: string;
  sets: number;
};

export type TemplateAnalysisResult = {
  analysisScopeLabel: string;
  goalFitLabel: GoalFitLabel;
  goalFitSummary: string;
  muscleBias: MuscleSetSummary[];
  muscleSetBreakdown: MuscleSetSummary[];
  overloaded: MuscleSetSummary[];
  targetProfileName: string;
  totalWorkingSets: number;
  undertrained: MuscleSetSummary[];
  notes: string[];
};

type TargetRange = {
  max: number;
  min: number;
};

type TargetProfile = {
  key: 'aesthetic_hypertrophy' | 'strength_foundation' | 'hit_bodybuilding' | 'general';
  name: string;
  requiredMuscles: string[];
  ranges: Record<string, TargetRange>;
};

export const AESTHETIC_HYPERTROPHY_TARGET_RANGES: Record<string, TargetRange> = {
  side_delts: { min: 12, max: 20 },
  lats: { min: 10, max: 18 },
  chest: { min: 10, max: 16 },
  upper_back: { min: 8, max: 16 },
  quads: { min: 8, max: 14 },
  glutes: { min: 6, max: 12 },
  hamstrings: { min: 6, max: 12 },
  biceps: { min: 6, max: 12 },
  triceps: { min: 6, max: 12 },
  abs: { min: 6, max: 12 },
};

const STRENGTH_FOUNDATION_TARGET_RANGES: Record<string, TargetRange> = {
  quads: { min: 6, max: 16 },
  chest: { min: 3, max: 12 },
  glutes: { min: 4, max: 12 },
  hamstrings: { min: 2, max: 10 },
  upper_back: { min: 5, max: 14 },
  lats: { min: 3, max: 12 },
};

const HIT_BODYBUILDING_TARGET_RANGES: Record<string, TargetRange> = {
  chest: { min: 3, max: 8 },
  quads: { min: 3, max: 8 },
  glutes: { min: 2, max: 8 },
  lats: { min: 2, max: 7 },
  upper_back: { min: 2, max: 7 },
  side_delts: { min: 2, max: 6 },
  biceps: { min: 2, max: 6 },
  triceps: { min: 2, max: 6 },
  abs: { min: 2, max: 6 },
};

const GENERAL_TARGET_RANGES: Record<string, TargetRange> = {
  chest: { min: 4, max: 16 },
  quads: { min: 4, max: 16 },
  glutes: { min: 2, max: 14 },
  hamstrings: { min: 2, max: 14 },
  lats: { min: 4, max: 16 },
  upper_back: { min: 4, max: 16 },
};

const TARGET_PROFILES: Record<TargetProfile['key'], TargetProfile> = {
  aesthetic_hypertrophy: {
    key: 'aesthetic_hypertrophy',
    name: 'Aesthetic hypertrophy',
    ranges: AESTHETIC_HYPERTROPHY_TARGET_RANGES,
    requiredMuscles: [
      'side_delts',
      'lats',
      'chest',
      'upper_back',
      'quads',
      'glutes',
      'biceps',
      'triceps',
      'abs',
    ],
  },
  strength_foundation: {
    key: 'strength_foundation',
    name: 'Strength foundation',
    ranges: STRENGTH_FOUNDATION_TARGET_RANGES,
    requiredMuscles: ['quads', 'chest', 'glutes', 'upper_back', 'lats'],
  },
  hit_bodybuilding: {
    key: 'hit_bodybuilding',
    name: 'Low-volume HIT bodybuilding',
    ranges: HIT_BODYBUILDING_TARGET_RANGES,
    requiredMuscles: ['chest', 'quads', 'glutes', 'lats', 'upper_back', 'side_delts'],
  },
  general: {
    key: 'general',
    name: 'General structure',
    ranges: GENERAL_TARGET_RANGES,
    requiredMuscles: ['chest', 'quads', 'lats', 'upper_back'],
  },
};

const MUSCLE_GROUP_LABELS: Record<string, string> = {
  abs: 'Abs',
  biceps: 'Biceps',
  calves: 'Calves',
  chest: 'Chest',
  front_delts: 'Front delts',
  glutes: 'Glutes',
  hamstrings: 'Hamstrings',
  lats: 'Lats',
  quads: 'Quads',
  rear_delts: 'Rear delts',
  side_delts: 'Side delts',
  traps: 'Traps',
  triceps: 'Triceps',
  upper_back: 'Upper back',
};

function normalizeMuscleGroup(value: string | null | undefined): string | null {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  if (normalized === 'side delts' || normalized === 'lateral_delts') {
    return 'side_delts';
  }

  if (normalized === 'upper back') {
    return 'upper_back';
  }

  return normalized.replaceAll(' ', '_');
}

export function formatMuscleGroupLabel(muscleGroup: string): string {
  return (
    MUSCLE_GROUP_LABELS[muscleGroup] ??
    muscleGroup
      .split('_')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  );
}

function resolveTargetProfile(template: WorkoutTemplateDetail): TargetProfile {
  const searchable = [template.code, template.name, template.goal, template.splitType]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (searchable.includes('dorian') || searchable.includes('hit_rotating')) {
    return TARGET_PROFILES.hit_bodybuilding;
  }

  if (searchable.includes('strength')) {
    return TARGET_PROFILES.strength_foundation;
  }

  if (searchable.includes('aesthetic') || searchable.includes('hypertrophy')) {
    return TARGET_PROFILES.aesthetic_hypertrophy;
  }

  return TARGET_PROFILES.general;
}

function createSummary(muscleGroup: string, sets: number): MuscleSetSummary {
  return {
    muscleGroup,
    sets,
    label: formatMuscleGroupLabel(muscleGroup),
  };
}

function getAnalysisScopeLabel(template: WorkoutTemplateDetail, profile: TargetProfile): string {
  if (profile.key === 'hit_bodybuilding' || template.splitType === 'hit_rotating') {
    return `${template.days.length}-day rotation analysis`;
  }

  if (template.days.length === 3) {
    return 'Weekly plan analysis';
  }

  return `${template.days.length}-day plan analysis`;
}

function getGoalFitLabel(
  profile: TargetProfile,
  undertrained: MuscleSetSummary[],
  overloaded: MuscleSetSummary[],
  missingRequiredCount: number,
  totalWorkingSets: number
): GoalFitLabel {
  const severelyUndertrainedCount = undertrained.filter((item) => {
    const targetMin = profile.ranges[item.muscleGroup]?.min ?? 0;
    return item.sets === 0 || item.sets < targetMin * 0.5;
  }).length;
  const severelyOverloadedCount = overloaded.filter((item) => {
    const targetMax = profile.ranges[item.muscleGroup]?.max ?? Number.POSITIVE_INFINITY;
    return item.sets > targetMax * 1.25;
  }).length;
  const hasVeryLowSignal = totalWorkingSets < profile.requiredMuscles.length * 2;

  if (
    hasVeryLowSignal ||
    missingRequiredCount >= 2 ||
    severelyUndertrainedCount >= 3 ||
    severelyOverloadedCount > 0
  ) {
    return 'Needs review';
  }

  if (undertrained.length === 0 && overloaded.length === 0 && missingRequiredCount === 0) {
    return profile.key === 'aesthetic_hypertrophy' ? 'Strong fit' : 'Good fit';
  }

  return 'Good fit';
}

function getGoalFitSummary(
  label: GoalFitLabel,
  profile: TargetProfile,
  undertrained: MuscleSetSummary[],
  overloaded: MuscleSetSummary[]
): string {
  if (label === 'Low signal / insufficient metadata') {
    return 'Analysis needs prescription sets and muscle-group metadata before it can judge the plan.';
  }

  if (profile.key === 'strength_foundation') {
    return 'Judged as a strength-first routine with supportive hypertrophy exposure, not as a bodybuilding specialization split.';
  }

  if (profile.key === 'hit_bodybuilding') {
    return 'Judged as a low-volume, high-effort bodybuilding rotation, so lower set counts are expected.';
  }

  if (undertrained.length === 0 && overloaded.length === 0) {
    return 'Planned working sets line up with the aesthetic hypertrophy guardrails available in the current metadata.';
  }

  return 'The structure mostly matches the target, with a few muscle-group guardrails worth reviewing.';
}

export function analyzeTemplate(template: WorkoutTemplateDetail): TemplateAnalysisResult {
  const setTotals = new Map<string, number>();

  for (const day of template.days) {
    for (const prescription of day.prescriptions) {
      const muscleGroup = normalizeMuscleGroup(prescription.muscleGroup);

      if (!muscleGroup || prescription.sets <= 0) {
        continue;
      }

      setTotals.set(muscleGroup, (setTotals.get(muscleGroup) ?? 0) + prescription.sets);
    }
  }

  const muscleSetBreakdown = Array.from(setTotals.entries())
    .map(([muscleGroup, sets]) => createSummary(muscleGroup, sets))
    .sort((a, b) => b.sets - a.sets || a.label.localeCompare(b.label));

  const totalWorkingSets = muscleSetBreakdown.reduce((total, item) => total + item.sets, 0);
  const profile = resolveTargetProfile(template);
  const analysisScopeLabel = getAnalysisScopeLabel(template, profile);

  if (totalWorkingSets === 0 || muscleSetBreakdown.length === 0) {
    return {
      analysisScopeLabel,
      goalFitLabel: 'Low signal / insufficient metadata',
      goalFitSummary: getGoalFitSummary(
        'Low signal / insufficient metadata',
        profile,
        [],
        []
      ),
      muscleBias: [],
      muscleSetBreakdown: [],
      overloaded: [],
      targetProfileName: profile.name,
      totalWorkingSets: 0,
      undertrained: [],
      notes: ['Only prescribed working sets are analyzed; warmups and completed history are excluded.'],
    };
  }

  const undertrained = Object.entries(profile.ranges)
    .filter(([muscleGroup, range]) => (setTotals.get(muscleGroup) ?? 0) < range.min)
    .map(([muscleGroup]) => createSummary(muscleGroup, setTotals.get(muscleGroup) ?? 0));
  const overloaded = Object.entries(profile.ranges)
    .filter(([muscleGroup, range]) => (setTotals.get(muscleGroup) ?? 0) > range.max)
    .map(([muscleGroup]) => createSummary(muscleGroup, setTotals.get(muscleGroup) ?? 0));
  const missingRequiredCount = profile.requiredMuscles.filter(
    (muscleGroup) => (setTotals.get(muscleGroup) ?? 0) === 0
  ).length;
  const goalFitLabel = getGoalFitLabel(
    profile,
    undertrained,
    overloaded,
    missingRequiredCount,
    totalWorkingSets
  );
  const notes = ['Only prescribed working sets are analyzed; warmups and completed history are excluded.'];

  if (profile.key === 'aesthetic_hypertrophy') {
    notes.push(
      'Current metadata counts each prescription toward its available muscle group; secondary muscles are not fractionally counted.'
    );
  }

  return {
    analysisScopeLabel,
    goalFitLabel,
    goalFitSummary: getGoalFitSummary(goalFitLabel, profile, undertrained, overloaded),
    muscleBias: muscleSetBreakdown.slice(0, 5),
    muscleSetBreakdown,
    overloaded,
    targetProfileName: profile.name,
    totalWorkingSets,
    undertrained,
    notes,
  };
}
