import type {
  ProgressionMethod,
  ProgressionRecommendation,
} from '@/types/domain';

export type ProgressionWorkingSet = {
  reps: number | null;
  weight: number | null;
};

export type CalculateProgressionRecommendationInput = {
  completedWorkingSets: ProgressionWorkingSet[];
  exerciseDefinitionId: string | null;
  exercisePrescriptionId: string | null;
  loadIncrement: number | null;
  method: ProgressionMethod;
  plannedSets: number | null;
  targetRepMax: number | null;
  targetRepMin: number | null;
};

function formatRepRange(targetRepMin: number | null, targetRepMax: number | null): string | null {
  if (targetRepMin == null && targetRepMax == null) {
    return null;
  }

  if (targetRepMin != null && targetRepMax != null) {
    return targetRepMin === targetRepMax
      ? `${targetRepMin} reps`
      : `${targetRepMin}-${targetRepMax} reps`;
  }

  return targetRepMin != null ? `${targetRepMin}+ reps` : `up to ${targetRepMax} reps`;
}

function getReferenceWeight(sets: ProgressionWorkingSet[]): number | null {
  return sets.find((set) => set.weight != null)?.weight ?? null;
}

function hasUsableWeight(sets: ProgressionWorkingSet[]): boolean {
  return sets.some((set) => set.weight != null);
}

function getClearRepeatedWeight(sets: ProgressionWorkingSet[]): number | null {
  const weights = sets.map((set) => set.weight).filter((weight): weight is number => weight != null);

  if (weights.length === 0) {
    return null;
  }

  return weights.every((weight) => weight === weights[0]) ? weights[0] : null;
}

function getRecommendedIncreasedWeight(
  referenceWeight: number | null,
  loadIncrement: number | null
): number | null {
  if (referenceWeight == null || loadIncrement == null) {
    return null;
  }

  return referenceWeight + loadIncrement;
}

function hasMixedWorkingWeights(sets: ProgressionWorkingSet[]): boolean {
  const uniqueWeights = new Set(
    sets.map((set) => set.weight).filter((weight): weight is number => weight != null)
  );

  return uniqueWeights.size > 1;
}

function formatPreviousPerformanceSummary(sets: ProgressionWorkingSet[]): string | null {
  if (sets.length === 0) {
    return null;
  }

  const weights = sets.map((set) => set.weight);
  const reps = sets.map((set) => set.reps);
  const hasSingleKnownWeight =
    weights.length > 0 &&
    weights.every((weight) => weight != null && weight === weights[0]);

  if (hasSingleKnownWeight) {
    const loggedReps = reps.filter((rep): rep is number => rep != null);

    if (loggedReps.length === 0) {
      return null;
    }

    return `${weights[0]} x ${loggedReps.join(', ')}`;
  }

  const setSummaries = sets
    .map((set) => {
      if (set.reps == null) {
        return null;
      }

      return set.weight == null ? `${set.reps} reps` : `${set.weight} x ${set.reps}`;
    })
    .filter((setSummary): setSummary is string => Boolean(setSummary))
    .join(', ');

  return setSummaries || null;
}

function getTopSet(sets: ProgressionWorkingSet[]): ProgressionWorkingSet | null {
  return [...sets].sort((left, right) => {
    const weightComparison = (right.weight ?? -Infinity) - (left.weight ?? -Infinity);

    if (weightComparison !== 0) {
      return weightComparison;
    }

    return (right.reps ?? -Infinity) - (left.reps ?? -Infinity);
  })[0] ?? null;
}

function createBaseRecommendation(
  input: CalculateProgressionRecommendationInput
): Pick<
  ProgressionRecommendation,
  'exerciseDefinitionId' | 'exercisePrescriptionId' | 'method' | 'previousPerformanceSummary'
> {
  return {
    exerciseDefinitionId: input.exerciseDefinitionId,
    exercisePrescriptionId: input.exercisePrescriptionId,
    method: input.method,
    previousPerformanceSummary: formatPreviousPerformanceSummary(input.completedWorkingSets),
  };
}

function getNoHistoryRecommendation(
  input: CalculateProgressionRecommendationInput,
  reason: string
): ProgressionRecommendation {
  return {
    ...createBaseRecommendation(input),
    recommendationType: 'insufficient_history',
    recommendedRepTarget: formatRepRange(input.targetRepMin, input.targetRepMax),
    recommendedWeight: null,
    reason,
  };
}

function calculateDoubleProgression(
  input: CalculateProgressionRecommendationInput
): ProgressionRecommendation {
  const repRange = formatRepRange(input.targetRepMin, input.targetRepMax);

  if (input.completedWorkingSets.length === 0) {
    return getNoHistoryRecommendation(
      input,
      'No usable prior working-set history exists for this exercise yet.'
    );
  }

  const base = createBaseRecommendation(input);
  const referenceWeight = getReferenceWeight(input.completedWorkingSets);
  const mixedWeightReason = hasMixedWorkingWeights(input.completedWorkingSets)
    ? ' Reference weight uses the first prior working-set weight.'
    : '';

  if (!hasUsableWeight(input.completedWorkingSets)) {
    return {
      ...base,
      recommendationType: 'insufficient_history',
      recommendedRepTarget: repRange,
      recommendedWeight: null,
      reason: 'Prior sessions exist, but no usable working-set load was logged.',
    };
  }

  if (input.targetRepMin == null || input.targetRepMax == null) {
    return {
      ...base,
      recommendationType: 'repeat_load',
      recommendedRepTarget: repRange,
      recommendedWeight: referenceWeight,
      reason: `Target rep range is incomplete. Repeat the prior working weight and use history comparison.${mixedWeightReason}`,
    };
  }

  const targetRepMin = input.targetRepMin;
  const targetRepMax = input.targetRepMax;
  const allReachedTop = input.completedWorkingSets.every(
    (set) => set.reps != null && set.reps >= targetRepMax
  );

  if (allReachedTop) {
    return {
      ...base,
      recommendationType: 'increase_load',
      recommendedRepTarget: repRange,
      recommendedWeight: getRecommendedIncreasedWeight(referenceWeight, input.loadIncrement),
      reason: `You reached the top of the target rep range on all working sets.${mixedWeightReason}`,
    };
  }

  const anyBelowMinimum = input.completedWorkingSets.some(
    (set) => set.reps == null || set.reps < targetRepMin
  );

  if (anyBelowMinimum) {
    return {
      ...base,
      recommendationType: 'repeat_load',
      recommendedRepTarget: `return to ${targetRepMin}+ reps`,
      recommendedWeight: referenceWeight,
      reason: `You were below the target rep range. Repeat the load and rebuild reps before increasing.${mixedWeightReason}`,
    };
  }

  return {
    ...base,
    recommendationType: 'repeat_load',
    recommendedRepTarget: 'beat last total reps or reach the top of the range',
    recommendedWeight: referenceWeight,
    reason: `You are progressing within the rep range but have not reached the top of the range on all working sets.${mixedWeightReason}`,
  };
}

function calculateTopSetProgression(
  input: CalculateProgressionRecommendationInput
): ProgressionRecommendation {
  const topSet = getTopSet(input.completedWorkingSets);
  const repRange = formatRepRange(input.targetRepMin, input.targetRepMax);

  if (!topSet) {
    return getNoHistoryRecommendation(
      input,
      'No usable prior top set exists for this exercise yet.'
    );
  }

  const base = createBaseRecommendation(input);

  if (topSet.weight == null) {
    return {
      ...base,
      recommendationType: 'insufficient_history',
      recommendedRepTarget: repRange,
      recommendedWeight: null,
      reason: 'Prior sessions exist, but no usable top-set load was logged.',
    };
  }

  if (input.targetRepMin == null || input.targetRepMax == null || topSet.reps == null) {
    return {
      ...base,
      recommendationType: 'repeat_load',
      recommendedRepTarget: repRange,
      recommendedWeight: topSet.weight,
      reason: 'Top-set history or target reps are incomplete. Repeat the prior top-set load and use history comparison.',
    };
  }

  if (topSet.reps >= input.targetRepMax) {
    return {
      ...base,
      recommendationType: 'increase_load',
      recommendedRepTarget: repRange,
      recommendedWeight: getRecommendedIncreasedWeight(topSet.weight, input.loadIncrement),
      reason: 'You reached the top of the target rep range on the top set.',
    };
  }

  if (topSet.reps >= input.targetRepMin) {
    return {
      ...base,
      recommendationType: 'repeat_load',
      recommendedRepTarget: 'beat previous top-set reps',
      recommendedWeight: topSet.weight,
      reason: 'You are inside the target range. Repeat the load and add reps before increasing.',
    };
  }

  return {
    ...base,
    recommendationType: 'repeat_load',
    recommendedRepTarget: `return to ${input.targetRepMin}+ reps`,
    recommendedWeight: topSet.weight,
    reason: 'You were below the target rep range. Repeat the load before increasing.',
  };
}

function calculateRepProgression(
  input: CalculateProgressionRecommendationInput
): ProgressionRecommendation {
  const repRange = formatRepRange(input.targetRepMin, input.targetRepMax);

  if (input.completedWorkingSets.length === 0) {
    return getNoHistoryRecommendation(
      input,
      'No usable prior working-set history exists for this exercise yet.'
    );
  }

  const base = createBaseRecommendation(input);
  const referenceWeight = getReferenceWeight(input.completedWorkingSets);

  if (input.targetRepMax == null) {
    return {
      ...base,
      recommendationType: 'increase_reps',
      recommendedRepTarget: 'beat last total reps',
      recommendedWeight: referenceWeight,
      reason: 'Add reps before increasing load.',
    };
  }

  const targetRepMax = input.targetRepMax;
  const allReachedTop = input.completedWorkingSets.every(
    (set) => set.reps != null && set.reps >= targetRepMax
  );

  if (allReachedTop) {
    return {
      ...base,
      recommendationType: 'increase_reps',
      recommendedRepTarget: 'maintain top reps or add difficulty manually',
      recommendedWeight: referenceWeight,
      reason: 'You reached the top of the target rep range. Add difficulty only if form remains controlled.',
    };
  }

  return {
    ...base,
    recommendationType: 'increase_reps',
    recommendedRepTarget: 'beat last total reps',
    recommendedWeight: referenceWeight,
    reason: 'Add reps before increasing load.',
  };
}

function calculateManualProgression(
  input: CalculateProgressionRecommendationInput
): ProgressionRecommendation {
  return {
    ...createBaseRecommendation(input),
    recommendationType: 'manual',
    recommendedRepTarget: formatRepRange(input.targetRepMin, input.targetRepMax),
    recommendedWeight: getClearRepeatedWeight(input.completedWorkingSets),
    reason: 'This exercise uses manual progression. Use history comparison to choose today\'s target.',
  };
}

function calculateNoProgression(
  input: CalculateProgressionRecommendationInput
): ProgressionRecommendation {
  return {
    ...createBaseRecommendation(input),
    recommendationType: 'none',
    recommendedRepTarget: null,
    recommendedWeight: null,
    reason: 'No progression rule is assigned to this exercise.',
  };
}

export function calculateProgressionRecommendation(
  input: CalculateProgressionRecommendationInput
): ProgressionRecommendation {
  switch (input.method) {
    case 'double_progression':
      return calculateDoubleProgression(input);
    case 'top_set_progression':
      return calculateTopSetProgression(input);
    case 'rep_progression':
      return calculateRepProgression(input);
    case 'manual':
      return calculateManualProgression(input);
    case 'none':
      return calculateNoProgression(input);
  }
}
