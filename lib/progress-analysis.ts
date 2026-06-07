export type ProgressTrainingSet = {
  completedAt: string;
  exerciseHistoryKey: string;
  exerciseName: string;
  muscleGroup: string | null;
  reps: number;
  sessionId: string;
  setNumber: number;
  weight: number | null;
};

export type ProgressCompletedWorkout = {
  completedAt: string;
  id: string;
};

export type ProgressRawData = {
  completedWorkouts: ProgressCompletedWorkout[];
  workingSets: ProgressTrainingSet[];
};

export type ProgressGate = {
  completedWorkouts: number;
  hasUnlockedDashboard: boolean;
  repeatedExerciseCount: number;
  trainingWeeks: number;
};

export type ProgressMetric = {
  label: string;
  value: string;
};

export type ProgressExerciseOption = {
  exerciseHistoryKey: string;
  exerciseName: string;
  exposureCount: number;
};

export type ProgressBestSet = {
  reps: number;
  weight: number | null;
};

export type ProgressExerciseTrendPoint = {
  bestSet: ProgressBestSet | null;
  completedAt: string;
  repsOnlySummary: string;
  sessionId: string;
  totalReps: number;
  volume: number | null;
  workingSetCount: number;
};

export type ProgressMuscleGroupWeek = {
  muscleGroup: string;
  sets: number;
  weekKey: string;
};

export type ProgressConsistencyWeek = {
  completedWorkouts: number;
  weekKey: string;
};

export type ProgressInsight = {
  detail: string;
  title: string;
};

export type ProgressDashboard = {
  consistencyWeeks: ProgressConsistencyWeek[];
  exerciseOptions: ProgressExerciseOption[];
  gate: ProgressGate;
  metrics: ProgressMetric[];
  muscleGroupWeeks: ProgressMuscleGroupWeek[];
  needsAttention: ProgressInsight[];
  topProgress: ProgressInsight[];
  trendsByExercise: Record<string, ProgressExerciseTrendPoint[]>;
};

const MIN_COMPLETED_WORKOUTS = 4;
const MIN_TRAINING_WEEKS = 2;
const MIN_EXERCISE_EXPOSURES = 2;

function getWeekKey(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }

  const normalized = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = normalized.getUTCDay() || 7;
  normalized.setUTCDate(normalized.getUTCDate() + 1 - day);

  return normalized.toISOString().slice(0, 10);
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function compareBestSet(left: ProgressBestSet, right: ProgressBestSet): number {
  const weightComparison = (right.weight ?? -Infinity) - (left.weight ?? -Infinity);

  if (weightComparison !== 0) {
    return weightComparison;
  }

  return right.reps - left.reps;
}

function isBetterSet(current: ProgressBestSet | null, previous: ProgressBestSet | null): boolean {
  if (!current || !previous) {
    return false;
  }

  if (current.weight != null && previous.weight != null && current.weight > previous.weight) {
    return true;
  }

  if (current.weight === previous.weight && current.reps > previous.reps) {
    return true;
  }

  if (current.weight != null && previous.weight == null) {
    return true;
  }

  return current.weight == null && previous.weight == null && current.reps > previous.reps;
}

function formatBestSet(bestSet: ProgressBestSet | null): string {
  if (!bestSet) {
    return 'No best set';
  }

  if (bestSet.weight == null) {
    return `${bestSet.reps} reps`;
  }

  return `${formatNumber(bestSet.weight)} x ${bestSet.reps}`;
}

function buildTrendPoint(
  sessionId: string,
  completedAt: string,
  sets: ProgressTrainingSet[]
): ProgressExerciseTrendPoint {
  const weightedSets = sets.filter((set) => set.weight != null);
  const volume =
    weightedSets.length > 0
      ? weightedSets.reduce((total, set) => total + (set.weight ?? 0) * set.reps, 0)
      : null;
  const bestSet =
    sets
      .map((set) => ({ reps: set.reps, weight: set.weight }))
      .sort(compareBestSet)[0] ?? null;

  return {
    bestSet,
    completedAt,
    repsOnlySummary: sets.map((set) => `${set.reps}`).join(', '),
    sessionId,
    totalReps: sets.reduce((total, set) => total + set.reps, 0),
    volume,
    workingSetCount: sets.length,
  };
}

export function analyzeProgress(rawData: ProgressRawData): ProgressDashboard {
  const trainingWeekKeys = new Set(rawData.completedWorkouts.map((workout) => getWeekKey(workout.completedAt)));
  const setsByExercise = new Map<string, ProgressTrainingSet[]>();

  for (const set of rawData.workingSets) {
    setsByExercise.set(set.exerciseHistoryKey, [...(setsByExercise.get(set.exerciseHistoryKey) ?? []), set]);
  }

  const trendsByExercise: Record<string, ProgressExerciseTrendPoint[]> = {};
  const exerciseOptions: ProgressExerciseOption[] = [];

  for (const [exerciseHistoryKey, sets] of setsByExercise.entries()) {
    const setsBySession = new Map<string, ProgressTrainingSet[]>();

    for (const set of sets) {
      setsBySession.set(set.sessionId, [...(setsBySession.get(set.sessionId) ?? []), set]);
    }

    const trendPoints = [...setsBySession.entries()]
      .map(([sessionId, sessionSets]) =>
        buildTrendPoint(sessionId, sessionSets[0]?.completedAt ?? '', sessionSets)
      )
      .sort((left, right) => left.completedAt.localeCompare(right.completedAt));

    if (trendPoints.length >= MIN_EXERCISE_EXPOSURES) {
      const exerciseName = sets[0]?.exerciseName ?? 'Exercise';
      trendsByExercise[exerciseHistoryKey] = trendPoints;
      exerciseOptions.push({
        exerciseHistoryKey,
        exerciseName,
        exposureCount: trendPoints.length,
      });
    }
  }

  exerciseOptions.sort((left, right) => left.exerciseName.localeCompare(right.exerciseName));

  const gate: ProgressGate = {
    completedWorkouts: rawData.completedWorkouts.length,
    hasUnlockedDashboard:
      rawData.completedWorkouts.length >= MIN_COMPLETED_WORKOUTS &&
      trainingWeekKeys.size >= MIN_TRAINING_WEEKS &&
      exerciseOptions.length > 0,
    repeatedExerciseCount: exerciseOptions.length,
    trainingWeeks: trainingWeekKeys.size,
  };

  const totalWorkingSets = rawData.workingSets.length;
  const totalVolume = rawData.workingSets.reduce(
    (total, set) => (set.weight == null ? total : total + set.weight * set.reps),
    0
  );
  const consistencyWeeks = [...rawData.completedWorkouts.reduce((weeks, workout) => {
    const weekKey = getWeekKey(workout.completedAt);
    weeks.set(weekKey, (weeks.get(weekKey) ?? 0) + 1);
    return weeks;
  }, new Map<string, number>()).entries()]
    .map(([weekKey, completedWorkouts]) => ({ completedWorkouts, weekKey }))
    .sort((left, right) => left.weekKey.localeCompare(right.weekKey));

  const muscleGroupWeeks = [...rawData.workingSets.reduce((weeks, set) => {
    const muscleGroup = set.muscleGroup?.trim() || 'Unassigned';
    const weekKey = getWeekKey(set.completedAt);
    const key = `${weekKey}:${muscleGroup}`;
    const current = weeks.get(key) ?? { muscleGroup, sets: 0, weekKey };
    weeks.set(key, { ...current, sets: current.sets + 1 });
    return weeks;
  }, new Map<string, ProgressMuscleGroupWeek>()).values()].sort((left, right) => {
    const weekComparison = left.weekKey.localeCompare(right.weekKey);

    if (weekComparison !== 0) {
      return weekComparison;
    }

    return right.sets - left.sets;
  });

  const metrics: ProgressMetric[] = [
    { label: 'Completed workouts', value: String(rawData.completedWorkouts.length) },
    { label: 'Training weeks', value: String(trainingWeekKeys.size) },
    { label: 'Working sets', value: String(totalWorkingSets) },
    { label: 'Weighted volume', value: formatNumber(totalVolume) },
  ];

  const topProgress: ProgressInsight[] = [];

  for (const exercise of exerciseOptions) {
    const trend = trendsByExercise[exercise.exerciseHistoryKey] ?? [];
    const latest = trend.at(-1);
    const previous = trend.at(-2);

    if (!latest || !previous) {
      continue;
    }

    if (isBetterSet(latest.bestSet, previous.bestSet)) {
      topProgress.push({
        title: `${exercise.exerciseName} best set improved`,
        detail: `${formatBestSet(previous.bestSet)} to ${formatBestSet(latest.bestSet)}.`,
      });
    } else if (latest.volume != null && previous.volume != null && latest.volume > previous.volume) {
      topProgress.push({
        title: `${exercise.exerciseName} volume improved`,
        detail: `${formatNumber(previous.volume)} to ${formatNumber(latest.volume)} session volume.`,
      });
    }
  }

  const lastTwoWeeks = consistencyWeeks.slice(-2);

  if (
    lastTwoWeeks.length === 2 &&
    lastTwoWeeks[1].completedWorkouts > lastTwoWeeks[0].completedWorkouts
  ) {
    topProgress.push({
      title: 'Workout frequency increased',
      detail: `${lastTwoWeeks[0].completedWorkouts} to ${lastTwoWeeks[1].completedWorkouts} completed workouts by week.`,
    });
  }

  const needsAttention: ProgressInsight[] = [];

  if (exerciseOptions.length === 0) {
    needsAttention.push({
      title: 'No repeated exercise exposure yet',
      detail: 'Repeat a movement across completed workouts before exercise trends unlock.',
    });
  }

  for (const exercise of exerciseOptions) {
    const trend = trendsByExercise[exercise.exerciseHistoryKey] ?? [];

    if (trend.length < 3) {
      continue;
    }

    const latest = trend.at(-1);
    const previous = trend.at(-2);
    const beforePrevious = trend.at(-3);

    if (
      latest &&
      previous &&
      beforePrevious &&
      !isBetterSet(latest.bestSet, previous.bestSet) &&
      !isBetterSet(previous.bestSet, beforePrevious.bestSet)
    ) {
      needsAttention.push({
        title: `${exercise.exerciseName} is holding steady`,
        detail: 'Recent best sets have not moved up yet; keep comparing like with like.',
      });
    }
  }

  const latestMuscleGroups = muscleGroupWeeks
    .filter((item) => item.weekKey === consistencyWeeks.at(-1)?.weekKey)
    .sort((left, right) => right.sets - left.sets);

  if (latestMuscleGroups.length > 0) {
    const lowestGroup = latestMuscleGroups.at(-1);

    if (lowestGroup && lowestGroup.sets <= 1) {
      needsAttention.push({
        title: `${lowestGroup.muscleGroup} has low recent set exposure`,
        detail: `${lowestGroup.sets} working set${lowestGroup.sets === 1 ? '' : 's'} in the latest logged week.`,
      });
    }
  }

  return {
    consistencyWeeks,
    exerciseOptions,
    gate,
    metrics,
    muscleGroupWeeks,
    needsAttention: needsAttention.slice(0, 4),
    topProgress: topProgress.slice(0, 4),
    trendsByExercise,
  };
}

