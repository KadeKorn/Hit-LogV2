import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import type { ExerciseHistoryComparison } from '@/db/repositories/history-comparison-repository';
import type {
  CompleteWorkoutSessionInput,
  WorkoutSessionDetail,
  WorkoutSessionExerciseDetail,
} from '@/db/repositories/workout-session-repository';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { EffortRating, ProgressionRecommendation } from '@/types/domain';

type SetDraft = {
  id: string;
  isWarmup: boolean;
  repsText: string;
  weightText: string;
};

type ExerciseDraft = {
  effortRating: EffortRating | null;
  estimatedRir: 0 | 1 | 2 | 3 | null;
  isSubstitution: boolean;
  notes: string;
  setDrafts: SetDraft[];
  substituteName: string;
};

type WorkoutSessionScreenContentProps = {
  error: Error | null;
  historyComparisons: Record<string, ExerciseHistoryComparison>;
  historyError: Error | null;
  isCompleting: boolean;
  isHistoryLoading: boolean;
  isLoading: boolean;
  isProgressionLoading: boolean;
  onBack: () => void;
  onComplete: (input: CompleteWorkoutSessionInput) => void;
  onSaveDraft: (input: CompleteWorkoutSessionInput) => void;
  progressionError: Error | null;
  progressionRecommendations: Record<string, ProgressionRecommendation>;
  saveError: Error | null;
  savedAt: string | null;
  session: WorkoutSessionDetail | null;
};

type WorkoutPalette = {
  accent: string;
  border: string;
  input: string;
  muted: string;
  primaryButtonText: string;
  surface: string;
  surfaceMuted: string;
};

const effortOptions: { label: string; rir: 0 | 1 | 2 | 3; value: EffortRating }[] = [
  { label: 'Easy', value: 'easy', rir: 3 },
  { label: 'Moderate', value: 'moderate', rir: 2 },
  { label: 'Hard', value: 'hard', rir: 1 },
  { label: 'Failure', value: 'failure', rir: 0 },
];

function getPalette(colorScheme: 'light' | 'dark'): WorkoutPalette {
  if (colorScheme === 'light') {
    return {
      surface: '#F3F5F7',
      surfaceMuted: '#E8EDF1',
      input: '#FFFFFF',
      border: '#D5DDE5',
      muted: '#5E6A75',
      accent: '#0A7EA4',
      primaryButtonText: '#FFFFFF',
    };
  }

  return {
    surface: '#171B20',
    surfaceMuted: '#11151A',
    input: '#0D1116',
    border: '#2A3138',
    muted: '#93A0AB',
    accent: '#D7F75B',
    primaryButtonText: '#11151A',
  };
}

function formatToken(value: string | null): string {
  if (!value) {
    return 'Unspecified';
  }

  return value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatTarget(exercise: WorkoutSessionExerciseDetail): string {
  const sets = exercise.plannedSets === 1 ? '1 set' : `${exercise.plannedSets ?? 0} sets`;
  const reps =
    exercise.plannedRepMin === exercise.plannedRepMax
      ? `${exercise.plannedRepMin ?? '-'} reps`
      : `${exercise.plannedRepMin ?? '-'}-${exercise.plannedRepMax ?? '-'} reps`;

  return `${sets} x ${reps}`;
}

function formatHistoryDate(value: string): string {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(parsedDate);
}

function formatHistorySet(weight: number | null, reps: number | null): string {
  if (reps == null) {
    return 'No reps logged';
  }

  if (weight == null) {
    return `${reps} reps`;
  }

  return `${weight} x ${reps}`;
}

function formatHistorySets(sets: { reps: number | null; weight: number | null }[]): string {
  if (sets.length === 0) {
    return 'No working sets';
  }

  return sets.map((set) => formatHistorySet(set.weight, set.reps)).join(', ');
}

function formatWeight(value: number): string {
  return `${value} lb`;
}

function formatSavedAt(value: string | null): string {
  if (!value) {
    return 'Not saved yet';
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Saved';
  }

  return `Saved ${new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(parsedDate)}`;
}

function formatTimer(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function formatRecommendationAction(recommendation: ProgressionRecommendation): string {
  switch (recommendation.recommendationType) {
    case 'increase_load':
      return recommendation.recommendedWeight == null
        ? 'Increase load.'
        : `Increase to ${formatWeight(recommendation.recommendedWeight)}.`;
    case 'repeat_load': {
      const loadText =
        recommendation.recommendedWeight == null
          ? 'Use history comparison'
          : `Repeat ${formatWeight(recommendation.recommendedWeight)}`;
      const repTarget = recommendation.recommendedRepTarget
        ? ` and ${recommendation.recommendedRepTarget}`
        : '';

      return `${loadText}${repTarget}.`;
    }
    case 'increase_reps':
      return recommendation.recommendedRepTarget
        ? `Add reps: ${recommendation.recommendedRepTarget}.`
        : 'Add reps before increasing load.';
    case 'manual':
      return 'Use history comparison to choose today\'s target.';
    case 'none':
      return 'No progression target.';
    case 'insufficient_history':
      return recommendation.recommendedRepTarget
        ? `Choose a conservative load for ${recommendation.recommendedRepTarget}.`
        : 'Complete this exercise once to unlock recommendations.';
  }
}

function createSetDraft(index: number, previousSet?: SetDraft): SetDraft {
  return {
    id: `draft-set-${Date.now()}-${index}`,
    isWarmup: false,
    repsText: previousSet?.repsText ?? '',
    weightText: previousSet?.weightText ?? '',
  };
}

function createDrafts(session: WorkoutSessionDetail | null): Record<string, ExerciseDraft> {
  if (!session) {
    return {};
  }

  return Object.fromEntries(
    session.exercises.map((exercise) => {
      const savedSets =
        exercise.setLogs.length > 0
          ? exercise.setLogs.map((setLog) => ({
              id: setLog.id,
              isWarmup: setLog.isWarmup,
              repsText: setLog.reps == null ? '' : String(setLog.reps),
              weightText: setLog.weight == null ? '' : String(setLog.weight),
            }))
          : [createSetDraft(1)];

      return [
        exercise.id,
        {
          effortRating: exercise.effortRating,
          estimatedRir: exercise.estimatedRir,
          isSubstitution: exercise.isSubstitution,
          notes: exercise.notes ?? '',
          setDrafts: savedSets,
          substituteName: exercise.isSubstitution ? exercise.exerciseName : '',
        },
      ];
    })
  );
}

function parseNumberText(value: string): number | null {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const parsedValue = Number(trimmedValue);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function getWorkingSetCount(drafts: Record<string, ExerciseDraft>): number {
  return Object.values(drafts).reduce(
    (total, draft) => total + draft.setDrafts.filter((setDraft) => !setDraft.isWarmup).length,
    0
  );
}

function getLoggedWorkingSetCount(drafts: Record<string, ExerciseDraft>): number {
  return Object.values(drafts).reduce(
    (total, draft) =>
      total +
      draft.setDrafts.filter(
        (setDraft) => !setDraft.isWarmup && (setDraft.weightText.trim() || setDraft.repsText.trim())
      ).length,
    0
  );
}

function getTotalLoggedVolume(drafts: Record<string, ExerciseDraft>): number {
  return Object.values(drafts).reduce(
    (total, draft) =>
      total +
      draft.setDrafts.reduce((exerciseTotal, setDraft) => {
        if (setDraft.isWarmup) {
          return exerciseTotal;
        }

        const weight = parseNumberText(setDraft.weightText);
        const reps = parseNumberText(setDraft.repsText);

        if (weight == null || reps == null) {
          return exerciseTotal;
        }

        return exerciseTotal + weight * reps;
      }, 0),
    0
  );
}

function ExerciseCard({
  draft,
  exercise,
  historyComparison,
  historyError,
  isHistoryLoading,
  onAddSet,
  onSelectNextExercise,
  onSelectPreviousExercise,
  onSetDraftChange,
  onSetEffort,
  onSetNotes,
  onSetSubstituteName,
  onStartRestTimer,
  onToggleWarmup,
  onToggleSubstitution,
  palette,
  progressionError,
  progressionRecommendation,
  isProgressionLoading,
  textColor,
}: {
  draft: ExerciseDraft;
  exercise: WorkoutSessionExerciseDetail;
  historyComparison: ExerciseHistoryComparison | null;
  historyError: Error | null;
  isHistoryLoading: boolean;
  isProgressionLoading: boolean;
  onAddSet: (exerciseId: string) => void;
  onSelectNextExercise: () => void;
  onSelectPreviousExercise: () => void;
  onSetDraftChange: (
    exerciseId: string,
    setIndex: number,
    field: 'repsText' | 'weightText',
    value: string
  ) => void;
  onSetEffort: (exerciseId: string, effortRating: EffortRating, estimatedRir: 0 | 1 | 2 | 3) => void;
  onSetNotes: (exerciseId: string, notes: string) => void;
  onSetSubstituteName: (exerciseId: string, substituteName: string) => void;
  onStartRestTimer: (seconds: number) => void;
  onToggleWarmup: (exerciseId: string, setIndex: number) => void;
  onToggleSubstitution: (exerciseId: string) => void;
  palette: WorkoutPalette;
  progressionError: Error | null;
  progressionRecommendation: ProgressionRecommendation | null;
  textColor: string;
}) {
  return (
    <View style={[styles.exerciseCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      <View style={styles.exerciseHeader}>
        <ThemedText style={[styles.historyTitle, { color: palette.accent }]}>
          Current Exercise
        </ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.exerciseName}>
          {exercise.exerciseName}
        </ThemedText>
        <ThemedText style={[styles.exerciseMeta, { color: palette.muted }]}>
          {formatTarget(exercise)} - {formatToken(exercise.muscleGroup)}
        </ThemedText>
        <ThemedText style={[styles.exerciseMeta, { color: palette.muted }]}>
          {formatToken(exercise.progressionMethod)}
          {exercise.restSeconds ? ` - ${exercise.restSeconds}s rest` : ''}
        </ThemedText>
        {exercise.notes ? (
          <ThemedText style={[styles.exerciseMeta, { color: palette.muted }]}>
            Cues: {exercise.notes}
          </ThemedText>
        ) : null}
      </View>

      <View
        style={[
          styles.historyPanel,
          { backgroundColor: palette.surfaceMuted, borderColor: palette.border },
        ]}>
        <ThemedText style={[styles.historyTitle, { color: palette.accent }]}>History</ThemedText>
        {isHistoryLoading ? (
          <ThemedText style={[styles.historyEmptyText, { color: palette.muted }]}>
            Loading history
          </ThemedText>
        ) : historyError ? (
          <ThemedText style={[styles.historyEmptyText, { color: palette.muted }]}>
            History unavailable
          </ThemedText>
        ) : historyComparison?.lastTime ? (
          <View style={styles.historyContent}>
            <ThemedText style={[styles.historyLine, { color: palette.muted }]}>
              Last time:{' '}
              <ThemedText style={styles.historyValue}>
                {formatHistorySets(historyComparison.lastTime.sets)}
              </ThemedText>
            </ThemedText>
            <ThemedText style={[styles.historyLine, { color: palette.muted }]}>
              Best:{' '}
              <ThemedText style={styles.historyValue}>
                {historyComparison.bestSet
                  ? formatHistorySet(
                      historyComparison.bestSet.weight,
                      historyComparison.bestSet.reps
                    )
                  : 'No PR yet'}
              </ThemedText>
            </ThemedText>
            {historyComparison.lastFive.length > 0 ? (
              <View style={styles.historySubsection}>
                <ThemedText style={[styles.historySubhead, { color: palette.muted }]}>
                  Last 5
                </ThemedText>
                {historyComparison.lastFive.map((item) => (
                  <ThemedText
                    key={`${item.workoutSessionId}-${item.completedAt}`}
                    style={styles.historyDetailLine}>
                    {formatHistoryDate(item.completedAt)} - {item.setSummary}
                  </ThemedText>
                ))}
              </View>
            ) : null}
            {historyComparison.priorNotes.length > 0 ? (
              <View style={styles.historySubsection}>
                <ThemedText style={[styles.historySubhead, { color: palette.muted }]}>
                  Notes
                </ThemedText>
                {historyComparison.priorNotes.slice(0, 3).map((item) => (
                  <ThemedText
                    key={`${item.workoutSessionId}-${item.completedAt}`}
                    style={styles.historyDetailLine}>
                    {formatHistoryDate(item.completedAt)} - {item.notes}
                  </ThemedText>
                ))}
              </View>
            ) : null}
          </View>
        ) : (
          <ThemedText style={[styles.historyEmptyText, { color: palette.muted }]}>
            No prior working-set history yet.
          </ThemedText>
        )}
      </View>

      <View
        style={[
          styles.progressionPanel,
          { backgroundColor: palette.surfaceMuted, borderColor: palette.border },
        ]}>
        <ThemedText style={[styles.historyTitle, { color: palette.accent }]}>Progression</ThemedText>
        {isProgressionLoading ? (
          <ThemedText style={[styles.historyEmptyText, { color: palette.muted }]}>
            Loading recommendation
          </ThemedText>
        ) : progressionError ? (
          <ThemedText style={[styles.historyEmptyText, { color: palette.muted }]}>
            Recommendation unavailable
          </ThemedText>
        ) : progressionRecommendation ? (
          <View style={styles.progressionContent}>
            <ThemedText style={[styles.historyLine, { color: palette.muted }]}>
              Recommendation:{' '}
              <ThemedText style={styles.historyValue}>
                {formatRecommendationAction(progressionRecommendation)}
              </ThemedText>
            </ThemedText>
            <ThemedText style={[styles.historyLine, { color: palette.muted }]}>
              Reason:{' '}
              <ThemedText style={styles.historyValue}>
                {progressionRecommendation.reason}
              </ThemedText>
            </ThemedText>
            {progressionRecommendation.previousPerformanceSummary ? (
              <ThemedText style={[styles.historyLine, { color: palette.muted }]}>
                Used:{' '}
                <ThemedText style={styles.historyValue}>
                  {progressionRecommendation.previousPerformanceSummary}
                </ThemedText>
              </ThemedText>
            ) : null}
          </View>
        ) : (
          <ThemedText style={[styles.historyEmptyText, { color: palette.muted }]}>
            Complete this exercise once to unlock recommendations.
          </ThemedText>
        )}
      </View>

      <View style={styles.setList}>
        <View style={styles.setListHeader}>
          <ThemedText style={[styles.historyTitle, { color: palette.accent }]}>
            Sets
          </ThemedText>
          <ThemedText style={[styles.historyEmptyText, { color: palette.muted }]}>
            Warmups are excluded from PRs, history volume, and progression.
          </ThemedText>
        </View>
        {draft.setDrafts.map((setDraft, setIndex) => (
          <View
            key={setDraft.id}
            style={[
              styles.setCard,
              { backgroundColor: palette.surfaceMuted, borderColor: palette.border },
            ]}>
            <View style={styles.setCardHeader}>
              <ThemedText style={[styles.setNumber, { color: palette.muted }]}>
                Set {setIndex + 1}
              </ThemedText>
              <Pressable
                accessibilityLabel={
                  setDraft.isWarmup
                    ? `Mark ${exercise.exerciseName} set ${setIndex + 1} as working`
                    : `Mark ${exercise.exerciseName} set ${setIndex + 1} as warmup`
                }
                accessibilityRole="button"
                onPress={() => onToggleWarmup(exercise.id, setIndex)}
                style={[
                  styles.warmupChip,
                  {
                    backgroundColor: setDraft.isWarmup ? palette.accent : 'transparent',
                    borderColor: setDraft.isWarmup ? palette.accent : palette.border,
                  },
                ]}>
                <ThemedText
                  style={[
                    styles.warmupChipText,
                    { color: setDraft.isWarmup ? palette.primaryButtonText : palette.muted },
                  ]}>
                  {setDraft.isWarmup ? 'Warmup' : 'Working'}
                </ThemedText>
              </Pressable>
            </View>
            <View style={styles.setInputRow}>
              <TextInput
                accessibilityLabel={`${exercise.exerciseName} set ${setIndex + 1} weight`}
                keyboardType="decimal-pad"
                onChangeText={(value) =>
                  onSetDraftChange(exercise.id, setIndex, 'weightText', value)
                }
                placeholder="Weight"
                placeholderTextColor={palette.muted}
                style={[
                  styles.input,
                  { backgroundColor: palette.input, borderColor: palette.border, color: textColor },
                ]}
                value={setDraft.weightText}
              />
              <TextInput
                accessibilityLabel={`${exercise.exerciseName} set ${setIndex + 1} reps`}
                keyboardType="number-pad"
                onChangeText={(value) => onSetDraftChange(exercise.id, setIndex, 'repsText', value)}
                placeholder="Reps"
                placeholderTextColor={palette.muted}
                style={[
                  styles.input,
                  { backgroundColor: palette.input, borderColor: palette.border, color: textColor },
                ]}
                value={setDraft.repsText}
              />
            </View>
            <View style={styles.setUtilityRow}>
              <Pressable
                accessibilityLabel={`Start rest timer after ${exercise.exerciseName} set ${setIndex + 1}`}
                accessibilityRole="button"
                onPress={() => onStartRestTimer(exercise.restSeconds ?? 90)}
                style={[styles.timerInlineButton, { borderColor: palette.border }]}>
                <ThemedText style={[styles.timerInlineButtonText, { color: palette.accent }]}>
                  Start Rest
                </ThemedText>
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      <Pressable
        accessibilityLabel={`Add set for ${exercise.exerciseName}`}
        accessibilityRole="button"
        onPress={() => onAddSet(exercise.id)}
        style={[styles.secondaryButton, { borderColor: palette.border }]}>
        <ThemedText style={[styles.secondaryButtonText, { color: palette.accent }]}>
          Add Working Set
        </ThemedText>
      </Pressable>

      <Pressable
        accessibilityLabel={
          draft.isSubstitution
            ? `Use planned exercise for ${exercise.exerciseName}`
            : `Log a substitution for ${exercise.exerciseName}`
        }
        accessibilityRole="button"
        onPress={() => onToggleSubstitution(exercise.id)}
        style={[
          styles.secondaryButton,
          {
            backgroundColor: draft.isSubstitution ? palette.accent : 'transparent',
            borderColor: draft.isSubstitution ? palette.accent : palette.border,
          },
        ]}>
        <ThemedText
          style={[
            styles.secondaryButtonText,
            { color: draft.isSubstitution ? palette.primaryButtonText : palette.accent },
          ]}>
          Substitute
        </ThemedText>
      </Pressable>

      {draft.isSubstitution ? (
        <TextInput
          accessibilityLabel={`${exercise.exerciseName} substitution name`}
          onChangeText={(value) => onSetSubstituteName(exercise.id, value)}
          placeholder="Performed exercise"
          placeholderTextColor={palette.muted}
          style={[
            styles.input,
            { backgroundColor: palette.input, borderColor: palette.border, color: textColor },
          ]}
          value={draft.substituteName}
        />
      ) : null}

      <TextInput
        accessibilityLabel={`${exercise.exerciseName} notes`}
        multiline
        onChangeText={(value) => onSetNotes(exercise.id, value)}
        placeholder="Exercise notes"
        placeholderTextColor={palette.muted}
        style={[
          styles.notesInput,
          { backgroundColor: palette.input, borderColor: palette.border, color: textColor },
        ]}
        value={draft.notes}
      />

      <View style={styles.effortGrid}>
        {effortOptions.map((option) => {
          const isSelected = draft.effortRating === option.value;

          return (
            <Pressable
              accessibilityLabel={`Set ${exercise.exerciseName} effort to ${option.label}`}
              accessibilityRole="button"
              key={option.value}
              onPress={() => onSetEffort(exercise.id, option.value, option.rir)}
              style={[
                styles.effortChip,
                {
                  backgroundColor: isSelected ? palette.accent : 'transparent',
                  borderColor: isSelected ? palette.accent : palette.border,
                },
              ]}>
              <ThemedText
                style={[
                  styles.effortChipText,
                  { color: isSelected ? palette.primaryButtonText : palette.muted },
                ]}>
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.exerciseNavRow}>
        <Pressable
          accessibilityLabel="Previous exercise"
          accessibilityRole="button"
          onPress={onSelectPreviousExercise}
          style={[styles.secondaryButton, { borderColor: palette.border, flex: 1 }]}>
          <ThemedText style={[styles.secondaryButtonText, { color: palette.accent }]}>
            Previous
          </ThemedText>
        </Pressable>
        <Pressable
          accessibilityLabel="Next exercise"
          accessibilityRole="button"
          onPress={onSelectNextExercise}
          style={[styles.secondaryButton, { borderColor: palette.border, flex: 1 }]}>
          <ThemedText style={[styles.secondaryButtonText, { color: palette.accent }]}>
            Next
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

export function WorkoutSessionScreenContent({
  error,
  historyComparisons,
  historyError,
  isCompleting,
  isHistoryLoading,
  isLoading,
  isProgressionLoading,
  onBack,
  onComplete,
  onSaveDraft,
  progressionError,
  progressionRecommendations,
  saveError,
  savedAt,
  session,
}: WorkoutSessionScreenContentProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const palette = getPalette(colorScheme);
  const theme = Colors[colorScheme];
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [drafts, setDrafts] = useState<Record<string, ExerciseDraft>>({});
  const [restTimerSeconds, setRestTimerSeconds] = useState(0);
  const [isRestTimerRunning, setIsRestTimerRunning] = useState(false);
  const hasHydratedDrafts = useRef(false);
  const onSaveDraftRef = useRef(onSaveDraft);

  useEffect(() => {
    onSaveDraftRef.current = onSaveDraft;
  }, [onSaveDraft]);

  useEffect(() => {
    hasHydratedDrafts.current = false;
    setDrafts(createDrafts(session));
    setCurrentExerciseIndex(0);
  }, [session]);

  useEffect(() => {
    if (Object.keys(drafts).length > 0) {
      hasHydratedDrafts.current = true;
    }
  }, [drafts]);

  useEffect(() => {
    if (!isRestTimerRunning || restTimerSeconds <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setRestTimerSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          setIsRestTimerRunning(false);
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRestTimerRunning, restTimerSeconds]);

  const completeInput = useMemo<CompleteWorkoutSessionInput>(() => {
    return {
      exercises:
        session?.exercises.map((exercise) => {
          const draft = drafts[exercise.id];

          return {
            id: exercise.id,
            notes: draft?.notes.trim() ? draft.notes.trim() : null,
            effortRating: draft?.effortRating ?? null,
            estimatedRir: draft?.estimatedRir ?? null,
            isSubstitution: draft?.isSubstitution ?? false,
            performedExerciseName:
              draft?.isSubstitution && draft.substituteName.trim()
                ? draft.substituteName.trim()
                : exercise.exerciseName,
            setLogs:
              draft?.setDrafts.map((setDraft, index) => ({
                setNumber: index + 1,
                weight: parseNumberText(setDraft.weightText),
                reps: parseNumberText(setDraft.repsText),
                isWarmup: setDraft.isWarmup,
              })) ?? [],
          };
        }) ?? [],
    };
  }, [drafts, session]);

  useEffect(() => {
    if (!session || session.status !== 'active' || !hasHydratedDrafts.current) {
      return;
    }

    const timeoutId = setTimeout(() => {
      onSaveDraftRef.current(completeInput);
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [completeInput, session]);

  const currentExercise = session?.exercises[currentExerciseIndex] ?? session?.exercises[0] ?? null;
  const loggedWorkingSets = getLoggedWorkingSetCount(drafts);
  const totalWorkingSets = getWorkingSetCount(drafts);
  const totalVolume = getTotalLoggedVolume(drafts);
  const hasNotes = Object.values(drafts).some((draft) => draft.notes.trim().length > 0);
  const hasSubstitutions = Object.values(drafts).some((draft) => draft.isSubstitution);

  function updateDraft(
    exerciseId: string,
    updater: (draft: ExerciseDraft) => ExerciseDraft
  ): void {
    setDrafts((currentDrafts) => {
      const currentDraft = currentDrafts[exerciseId];

      if (!currentDraft) {
        return currentDrafts;
      }

      return {
        ...currentDrafts,
        [exerciseId]: updater(currentDraft),
      };
    });
  }

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator color={palette.accent} />
        <ThemedText style={[styles.loadingText, { color: palette.muted }]}>
          Loading Workout
        </ThemedText>
      </ThemedView>
    );
  }

  if (error || !session) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText type="subtitle">Workout</ThemedText>
        <ThemedText style={[styles.centerText, { color: palette.muted }]}>
          Unable to load this workout session.
        </ThemedText>
        <Pressable
          accessibilityLabel="Return to Train"
          accessibilityRole="button"
          onPress={onBack}
          style={[styles.secondaryButton, { borderColor: palette.border }]}>
          <ThemedText style={[styles.secondaryButtonText, { color: palette.accent }]}>
            Back to Train
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}>
        <Pressable
          accessibilityLabel="Return to Train"
          accessibilityRole="button"
          onPress={onBack}
          style={styles.backButton}>
          <ThemedText style={[styles.backButtonText, { color: palette.accent }]}>
            Back to Train
          </ThemedText>
        </Pressable>

        <View style={styles.header}>
          <ThemedText style={[styles.caption, { color: palette.muted }]}>Workout</ThemedText>
          <ThemedText type="title" style={styles.title}>
            {session.templateDayName ?? 'Current Workout'}
          </ThemedText>
          <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
            {session.templateName ?? 'Active routine'}
          </ThemedText>
        </View>

        <View
          style={[
            styles.sessionOverview,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}>
          <View style={styles.sessionOverviewHeader}>
            <View style={styles.sessionOverviewTitleBlock}>
              <ThemedText style={[styles.historyTitle, { color: palette.accent }]}>
                In Progress
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.sessionOverviewTitle}>
                {currentExercise
                  ? `${currentExerciseIndex + 1} of ${session.exercises.length}: ${currentExercise.exerciseName}`
                  : 'No exercises planned'}
              </ThemedText>
            </View>
            <ThemedText style={[styles.historyEmptyText, { color: palette.muted }]}>
              {saveError ? 'Autosave needs attention' : formatSavedAt(savedAt)}
            </ThemedText>
          </View>
          {saveError ? (
            <ThemedText style={[styles.historyEmptyText, { color: palette.muted }]}>
              {saveError.message}
            </ThemedText>
          ) : null}
          <View style={styles.summaryGrid}>
            <View style={[styles.summaryTile, { borderColor: palette.border }]}>
              <ThemedText style={[styles.historyTitle, { color: palette.muted }]}>
                Exercises
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.summaryValue}>
                {session.exercises.length}
              </ThemedText>
            </View>
            <View style={[styles.summaryTile, { borderColor: palette.border }]}>
              <ThemedText style={[styles.historyTitle, { color: palette.muted }]}>
                Working Sets
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.summaryValue}>
                {loggedWorkingSets}/{totalWorkingSets}
              </ThemedText>
            </View>
            <View style={[styles.summaryTile, { borderColor: palette.border }]}>
              <ThemedText style={[styles.historyTitle, { color: palette.muted }]}>
                Volume
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.summaryValue}>
                {totalVolume > 0 ? `${totalVolume} lb` : 'Pending'}
              </ThemedText>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.restTimerPanel,
            { backgroundColor: palette.surfaceMuted, borderColor: palette.border },
          ]}>
          <View style={styles.restTimerHeader}>
            <View>
              <ThemedText style={[styles.historyTitle, { color: palette.accent }]}>
                Rest Timer
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.restTimerValue}>
                {formatTimer(restTimerSeconds)}
              </ThemedText>
            </View>
            <View style={styles.restTimerActions}>
              <Pressable
                accessibilityLabel="Start rest timer"
                accessibilityRole="button"
                onPress={() => {
                  setRestTimerSeconds(currentExercise?.restSeconds ?? 90);
                  setIsRestTimerRunning(true);
                }}
                style={[styles.timerButton, { borderColor: palette.border }]}>
                <ThemedText style={[styles.timerButtonText, { color: palette.accent }]}>
                  Start
                </ThemedText>
              </Pressable>
              <Pressable
                accessibilityLabel="Stop rest timer"
                accessibilityRole="button"
                onPress={() => setIsRestTimerRunning(false)}
                style={[styles.timerButton, { borderColor: palette.border }]}>
                <ThemedText style={[styles.timerButtonText, { color: palette.accent }]}>
                  Stop
                </ThemedText>
              </Pressable>
              <Pressable
                accessibilityLabel="Reset rest timer"
                accessibilityRole="button"
                onPress={() => {
                  setIsRestTimerRunning(false);
                  setRestTimerSeconds(0);
                }}
                style={[styles.timerButton, { borderColor: palette.border }]}>
                <ThemedText style={[styles.timerButtonText, { color: palette.accent }]}>
                  Reset
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>

        {session.exercises.length > 0 ? (
          <View style={styles.exerciseFocusStack}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.exerciseRail}
              contentContainerStyle={styles.exerciseRailContent}>
              {session.exercises.map((exercise, index) => {
                const draft = drafts[exercise.id];
                const isCurrent = index === currentExerciseIndex;
                const hasLoggedSet = draft?.setDrafts.some(
                  (setDraft) => setDraft.weightText.trim() || setDraft.repsText.trim()
                );

                return (
                  <Pressable
                    accessibilityLabel={`Open ${exercise.exerciseName}`}
                    accessibilityRole="button"
                    key={exercise.id}
                    onPress={() => setCurrentExerciseIndex(index)}
                    style={[
                      styles.exerciseRailChip,
                      {
                        backgroundColor: isCurrent ? palette.accent : 'transparent',
                        borderColor: isCurrent ? palette.accent : palette.border,
                      },
                    ]}>
                    <ThemedText
                      style={[
                        styles.exerciseRailText,
                        { color: isCurrent ? palette.primaryButtonText : palette.accent },
                      ]}>
                      {index + 1}. {exercise.exerciseName}
                      {hasLoggedSet ? ' done' : ''}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </ScrollView>

            {currentExercise && drafts[currentExercise.id] ? (
              <ExerciseCard
                draft={drafts[currentExercise.id]}
                exercise={currentExercise}
                historyComparison={
                  currentExercise.exerciseDefinitionId
                    ? historyComparisons[currentExercise.exerciseDefinitionId] ?? null
                    : null
                }
                historyError={historyError}
                isHistoryLoading={isHistoryLoading}
                isProgressionLoading={isProgressionLoading}
                key={currentExercise.id}
                onAddSet={(exerciseId) => {
                  updateDraft(exerciseId, (currentDraft) => {
                    const lastSet = currentDraft.setDrafts[currentDraft.setDrafts.length - 1];

                    return {
                      ...currentDraft,
                      setDrafts: [
                        ...currentDraft.setDrafts,
                        createSetDraft(currentDraft.setDrafts.length + 1, lastSet),
                      ],
                    };
                  });
                }}
                onSelectNextExercise={() =>
                  setCurrentExerciseIndex((currentIndex) =>
                    Math.min(currentIndex + 1, session.exercises.length - 1)
                  )
                }
                onSelectPreviousExercise={() =>
                  setCurrentExerciseIndex((currentIndex) => Math.max(currentIndex - 1, 0))
                }
                onSetDraftChange={(exerciseId, setIndex, field, value) => {
                  updateDraft(exerciseId, (currentDraft) => ({
                    ...currentDraft,
                    setDrafts: currentDraft.setDrafts.map((setDraft, currentIndex) =>
                      currentIndex === setIndex ? { ...setDraft, [field]: value } : setDraft
                    ),
                  }));
                }}
                onSetEffort={(exerciseId, effortRating, estimatedRir) => {
                  updateDraft(exerciseId, (currentDraft) => ({
                    ...currentDraft,
                    effortRating,
                    estimatedRir,
                  }));
                }}
                onSetNotes={(exerciseId, notes) => {
                  updateDraft(exerciseId, (currentDraft) => ({
                    ...currentDraft,
                    notes,
                  }));
                }}
                onSetSubstituteName={(exerciseId, substituteName) => {
                  updateDraft(exerciseId, (currentDraft) => ({
                    ...currentDraft,
                    substituteName,
                  }));
                }}
                onStartRestTimer={(seconds) => {
                  setRestTimerSeconds(seconds);
                  setIsRestTimerRunning(true);
                }}
                onToggleWarmup={(exerciseId, setIndex) => {
                  updateDraft(exerciseId, (currentDraft) => ({
                    ...currentDraft,
                    setDrafts: currentDraft.setDrafts.map((setDraft, currentIndex) =>
                      currentIndex === setIndex
                        ? { ...setDraft, isWarmup: !setDraft.isWarmup }
                        : setDraft
                    ),
                  }));
                }}
                onToggleSubstitution={(exerciseId) => {
                  updateDraft(exerciseId, (currentDraft) => ({
                    ...currentDraft,
                    isSubstitution: !currentDraft.isSubstitution,
                    substituteName: currentDraft.isSubstitution
                      ? ''
                      : currentDraft.substituteName || currentExercise.exerciseName,
                  }));
                }}
                palette={palette}
                progressionError={progressionError}
                progressionRecommendation={progressionRecommendations[currentExercise.id] ?? null}
                textColor={theme.text}
              />
            ) : null}
          </View>
        ) : (
          <View
            style={[styles.exerciseCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
              This template day does not have planned exercises yet.
            </ThemedText>
          </View>
        )}

        <View
          style={[
            styles.completionSummary,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}>
          <ThemedText style={[styles.historyTitle, { color: palette.accent }]}>
            Completion Summary
          </ThemedText>
          <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
            {session.templateName ?? 'Routine'} / {session.templateDayName ?? 'Workout'}
          </ThemedText>
          <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
            {session.exercises.length} exercises, {loggedWorkingSets} logged working sets
            {totalVolume > 0 ? `, ${totalVolume} lb volume` : ''}
          </ThemedText>
          <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
            Notes {hasNotes ? 'saved' : 'pending'} / Substitutions{' '}
            {hasSubstitutions ? 'included' : 'none'}
          </ThemedText>
        </View>

        <Pressable
          accessibilityLabel="Complete workout"
          accessibilityRole="button"
          disabled={isCompleting || session.status !== 'active'}
          onPress={() => onComplete(completeInput)}
          style={[
            styles.completeButton,
            {
              backgroundColor: palette.accent,
              borderColor: palette.accent,
              opacity: isCompleting || session.status !== 'active' ? 0.65 : 1,
            },
          ]}>
          <ThemedText style={[styles.completeButtonText, { color: palette.primaryButtonText }]}>
            {session.status === 'completed'
              ? 'Workout Complete'
              : isCompleting
                ? 'Completing'
                : 'Complete Workout'}
          </ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  caption: {
    fontSize: 13,
    letterSpacing: 1,
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  centerText: {
    textAlign: 'center',
  },
  completeButton: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: 16,
  },
  completeButtonText: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
    textTransform: 'uppercase',
  },
  completionSummary: {
    borderRadius: 18,
    borderWidth: 1,
    gap: 7,
    padding: 15,
  },
  content: {
    gap: 18,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  effortChip: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexBasis: '46%',
    flexGrow: 1,
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  effortChipText: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  effortGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exerciseCard: {
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    padding: 15,
  },
  exerciseFocusStack: {
    gap: 12,
  },
  exerciseHeader: {
    gap: 4,
  },
  exerciseList: {
    gap: 12,
  },
  exerciseMeta: {
    flexShrink: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  exerciseName: {
    flexShrink: 1,
    fontSize: 19,
    lineHeight: 25,
  },
  exerciseNavRow: {
    flexDirection: 'row',
    gap: 10,
  },
  exerciseRail: {
    flexGrow: 0,
  },
  exerciseRailChip: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: 12,
  },
  exerciseRailContent: {
    gap: 8,
    paddingRight: 2,
  },
  exerciseRailText: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  header: {
    gap: 5,
  },
  historyContent: {
    gap: 7,
  },
  historyDetailLine: {
    fontSize: 13,
    lineHeight: 18,
  },
  historyEmptyText: {
    fontSize: 13,
    lineHeight: 18,
  },
  historyLine: {
    fontSize: 13,
    lineHeight: 18,
  },
  historyPanel: {
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    padding: 12,
  },
  historySubhead: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  historySubsection: {
    gap: 4,
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  historyValue: {
    fontWeight: '700',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    fontSize: 16,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 14,
    lineHeight: 20,
  },
  notesInput: {
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 15,
    minHeight: 72,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
  progressionContent: {
    gap: 7,
  },
  progressionPanel: {
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    padding: 12,
  },
  restTimerActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
  },
  restTimerHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  restTimerPanel: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    padding: 14,
  },
  restTimerValue: {
    fontSize: 24,
    lineHeight: 30,
  },
  screen: {
    flex: 1,
  },
  secondaryButton: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
    textTransform: 'uppercase',
  },
  setList: {
    gap: 8,
  },
  setListHeader: {
    gap: 4,
  },
  setCard: {
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    padding: 10,
  },
  setCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  setInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  setNumber: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  setUtilityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  sessionOverview: {
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    padding: 15,
  },
  sessionOverviewHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  sessionOverviewTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  sessionOverviewTitleBlock: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  summaryTile: {
    borderRadius: 14,
    borderWidth: 1,
    flexBasis: '30%',
    flexGrow: 1,
    gap: 4,
    minHeight: 68,
    minWidth: 120,
    padding: 10,
  },
  summaryValue: {
    fontSize: 17,
    lineHeight: 22,
  },
  supportingText: {
    fontSize: 14,
    lineHeight: 20,
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
  },
  timerButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: 10,
  },
  timerButtonText: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  timerInlineButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 34,
    paddingHorizontal: 10,
  },
  timerInlineButtonText: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  warmupChip: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 34,
    minWidth: 86,
    paddingHorizontal: 12,
  },
  warmupChipText: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
});
