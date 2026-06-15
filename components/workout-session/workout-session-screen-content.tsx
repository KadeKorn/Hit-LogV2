import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AtlasButton, AtlasCard, AtlasPill, AtlasText, TopoBackground } from '@/components/atlas';
import type { ExerciseHistoryComparison } from '@/db/repositories/history-comparison-repository';
import type {
  CompleteWorkoutSessionInput,
  WorkoutSessionDetail,
  WorkoutSessionExerciseDetail,
} from '@/db/repositories/workout-session-repository';
import { useAtlasTheme } from '@/hooks/use-atlas-theme';
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

const effortOptions: { label: string; rir: 0 | 1 | 2 | 3; value: EffortRating }[] = [
  { label: 'Easy', value: 'easy', rir: 3 },
  { label: 'Moderate', value: 'moderate', rir: 2 },
  { label: 'Hard', value: 'hard', rir: 1 },
  { label: 'Failure', value: 'failure', rir: 0 },
];

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

/** Small gold uppercase eyebrow used across the session panels. */
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <AtlasText variant="micro" tone="gold">
      {children}
    </AtlasText>
  );
}

/** A label: value line where the value reads in the primary tone. */
function MetaLine({ label, value }: { label: string; value: string }) {
  return (
    <AtlasText variant="label" tone="muted">
      {label} <AtlasText variant="label" tone="strong">{value}</AtlasText>
    </AtlasText>
  );
}

function SecondaryButton({
  label,
  onPress,
  active = false,
  flex = false,
  leftIcon,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  active?: boolean;
  flex?: boolean;
  leftIcon?: ReactNode;
  accessibilityLabel?: string;
}) {
  const { c, radius, fonts } = useAtlasTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          minHeight: 46,
          borderRadius: radius.sm,
          borderWidth: 1,
          paddingHorizontal: 16,
          backgroundColor: active ? c.gold : 'transparent',
          borderColor: active ? c.gold : c.goldBorder,
          flex: flex ? 1 : undefined,
        },
        pressed && { opacity: 0.85 },
      ]}>
      {leftIcon}
      <AtlasText style={{ fontFamily: fonts.displaySemi, fontSize: 14, color: active ? c.onGold : c.goldSoft }}>
        {label}
      </AtlasText>
    </Pressable>
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
  progressionError,
  progressionRecommendation,
  isProgressionLoading,
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
  progressionError: Error | null;
  progressionRecommendation: ProgressionRecommendation | null;
}) {
  const { c, radius, fonts } = useAtlasTheme();

  const inputStyle: TextStyle = {
    backgroundColor: c.field,
    borderColor: c.cardBorder,
    color: c.text,
    borderWidth: 1,
    borderRadius: radius.field,
    minHeight: 46,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: fonts.body,
  };

  return (
    <AtlasCard active style={{ gap: 14 }}>
      <View style={{ gap: 4 }}>
        <SectionLabel>Current Exercise</SectionLabel>
        <AtlasText variant="title" tone="strong" style={{ marginTop: 4 }}>
          {exercise.exerciseName}
        </AtlasText>
        <AtlasText variant="label" tone="muted">
          {formatTarget(exercise)} · {formatToken(exercise.muscleGroup)}
        </AtlasText>
        <AtlasText variant="label" tone="muted">
          {formatToken(exercise.progressionMethod)}
          {exercise.restSeconds ? ` · ${exercise.restSeconds}s rest` : ''}
        </AtlasText>
        {exercise.notes ? (
          <AtlasText variant="label" tone="muted">
            Cues: {exercise.notes}
          </AtlasText>
        ) : null}
      </View>

      {/* Previous performance */}
      <View
        style={{
          backgroundColor: c.field,
          borderColor: c.cardBorder,
          borderWidth: 1,
          borderRadius: radius.sm,
          padding: 13,
          gap: 8,
        }}>
        <SectionLabel>History</SectionLabel>
        {isHistoryLoading ? (
          <AtlasText variant="label" tone="muted">
            Loading history
          </AtlasText>
        ) : historyError ? (
          <AtlasText variant="label" tone="muted">
            History unavailable
          </AtlasText>
        ) : historyComparison?.lastTime ? (
          <View style={{ gap: 7 }}>
            <MetaLine label="Last time:" value={formatHistorySets(historyComparison.lastTime.sets)} />
            <MetaLine
              label="Best:"
              value={
                historyComparison.bestSet
                  ? formatHistorySet(historyComparison.bestSet.weight, historyComparison.bestSet.reps)
                  : 'No PR yet'
              }
            />
            {historyComparison.lastFive.length > 0 ? (
              <View style={{ gap: 4 }}>
                <AtlasText variant="micro" tone="faint">
                  Last 5
                </AtlasText>
                {historyComparison.lastFive.map((item) => (
                  <AtlasText
                    key={`${item.workoutSessionId}-${item.completedAt}`}
                    variant="label"
                    tone="default">
                    {formatHistoryDate(item.completedAt)} · {item.setSummary}
                  </AtlasText>
                ))}
              </View>
            ) : null}
            {historyComparison.priorNotes.length > 0 ? (
              <View style={{ gap: 4 }}>
                <AtlasText variant="micro" tone="faint">
                  Notes
                </AtlasText>
                {historyComparison.priorNotes.slice(0, 3).map((item) => (
                  <AtlasText
                    key={`${item.workoutSessionId}-${item.completedAt}`}
                    variant="label"
                    tone="default">
                    {formatHistoryDate(item.completedAt)} · {item.notes}
                  </AtlasText>
                ))}
              </View>
            ) : null}
          </View>
        ) : (
          <AtlasText variant="label" tone="muted">
            No prior working-set history yet.
          </AtlasText>
        )}
      </View>

      {/* Progression recommendation */}
      <View
        style={{
          backgroundColor: c.field,
          borderColor: c.cardBorder,
          borderWidth: 1,
          borderRadius: radius.sm,
          padding: 13,
          gap: 8,
        }}>
        <SectionLabel>Progression</SectionLabel>
        {isProgressionLoading ? (
          <AtlasText variant="label" tone="muted">
            Loading recommendation
          </AtlasText>
        ) : progressionError ? (
          <AtlasText variant="label" tone="muted">
            Recommendation unavailable
          </AtlasText>
        ) : progressionRecommendation ? (
          <View style={{ gap: 7 }}>
            <MetaLine
              label="Recommendation:"
              value={formatRecommendationAction(progressionRecommendation)}
            />
            <MetaLine label="Reason:" value={progressionRecommendation.reason} />
            {progressionRecommendation.previousPerformanceSummary ? (
              <MetaLine label="Used:" value={progressionRecommendation.previousPerformanceSummary} />
            ) : null}
          </View>
        ) : (
          <AtlasText variant="label" tone="muted">
            Complete this exercise once to unlock recommendations.
          </AtlasText>
        )}
      </View>

      {/* Sets */}
      <View style={{ gap: 8 }}>
        <View style={{ gap: 4 }}>
          <SectionLabel>Sets</SectionLabel>
          <AtlasText variant="label" tone="muted">
            Warmups are excluded from PRs, history volume, and progression.
          </AtlasText>
        </View>
        {draft.setDrafts.map((setDraft, setIndex) => (
          <View
            key={setDraft.id}
            style={{
              backgroundColor: c.field,
              borderColor: c.cardBorder,
              borderWidth: 1,
              borderRadius: radius.sm,
              padding: 11,
              gap: 9,
            }}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <AtlasText variant="bodyStrong" tone="strong">
                Set {setIndex + 1}
              </AtlasText>
              <AtlasPill
                label={setDraft.isWarmup ? 'Warmup' : 'Working'}
                selected={setDraft.isWarmup}
                onPress={() => onToggleWarmup(exercise.id, setIndex)}
              />
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                accessibilityLabel={`${exercise.exerciseName} set ${setIndex + 1} weight`}
                keyboardType="decimal-pad"
                onChangeText={(value) => onSetDraftChange(exercise.id, setIndex, 'weightText', value)}
                placeholder="Weight"
                placeholderTextColor={c.faint}
                style={[inputStyle, { flex: 1 }]}
                value={setDraft.weightText}
              />
              <TextInput
                accessibilityLabel={`${exercise.exerciseName} set ${setIndex + 1} reps`}
                keyboardType="number-pad"
                onChangeText={(value) => onSetDraftChange(exercise.id, setIndex, 'repsText', value)}
                placeholder="Reps"
                placeholderTextColor={c.faint}
                style={[inputStyle, { flex: 1 }]}
                value={setDraft.repsText}
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Start rest timer after ${exercise.exerciseName} set ${setIndex + 1}`}
                onPress={() => onStartRestTimer(exercise.restSeconds ?? 90)}
                style={({ pressed }) => [
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    paddingHorizontal: 12,
                    minHeight: 36,
                    borderRadius: radius.field,
                    borderWidth: 1,
                    borderColor: c.goldBorder,
                  },
                  pressed && { opacity: 0.85 },
                ]}>
                <Ionicons name="timer-outline" size={16} color={c.goldSoft} />
                <AtlasText variant="label" tone="gold">
                  Start Rest
                </AtlasText>
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      <SecondaryButton
        label="Add Working Set"
        onPress={() => onAddSet(exercise.id)}
        leftIcon={<Ionicons name="add" size={18} color={c.goldSoft} />}
        accessibilityLabel={`Add set for ${exercise.exerciseName}`}
      />

      <SecondaryButton
        label="Substitute"
        active={draft.isSubstitution}
        onPress={() => onToggleSubstitution(exercise.id)}
        leftIcon={
          <MaterialCommunityIcons
            name="swap-horizontal"
            size={18}
            color={draft.isSubstitution ? c.onGold : c.goldSoft}
          />
        }
        accessibilityLabel={
          draft.isSubstitution
            ? `Use planned exercise for ${exercise.exerciseName}`
            : `Log a substitution for ${exercise.exerciseName}`
        }
      />

      {draft.isSubstitution ? (
        <TextInput
          accessibilityLabel={`${exercise.exerciseName} substitution name`}
          onChangeText={(value) => onSetSubstituteName(exercise.id, value)}
          placeholder="Performed exercise"
          placeholderTextColor={c.faint}
          style={inputStyle}
          value={draft.substituteName}
        />
      ) : null}

      <TextInput
        accessibilityLabel={`${exercise.exerciseName} notes`}
        multiline
        onChangeText={(value) => onSetNotes(exercise.id, value)}
        placeholder="Exercise notes"
        placeholderTextColor={c.faint}
        style={[inputStyle, { minHeight: 74, paddingTop: 10, textAlignVertical: 'top' }]}
        value={draft.notes}
      />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {effortOptions.map((option) => (
          <AtlasPill
            key={option.value}
            label={option.label}
            selected={draft.effortRating === option.value}
            onPress={() => onSetEffort(exercise.id, option.value, option.rir)}
            style={{ flexGrow: 1, justifyContent: 'center' }}
          />
        ))}
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <SecondaryButton
          label="Previous"
          flex
          onPress={onSelectPreviousExercise}
          leftIcon={<Ionicons name="chevron-back" size={16} color={c.goldSoft} />}
          accessibilityLabel="Previous exercise"
        />
        <SecondaryButton
          label="Next"
          flex
          onPress={onSelectNextExercise}
          leftIcon={<Ionicons name="chevron-forward" size={16} color={c.goldSoft} />}
          accessibilityLabel="Next exercise"
        />
      </View>
    </AtlasCard>
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
  const { c, radius, spacing, fonts } = useAtlasTheme();
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

  function updateDraft(exerciseId: string, updater: (draft: ExerciseDraft) => ExerciseDraft): void {
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

  const summaryTileStyle: ViewStyle = {
    flexBasis: '30%',
    flexGrow: 1,
    minWidth: 100,
    gap: 4,
    backgroundColor: c.field,
    borderColor: c.cardBorder,
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: 12,
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: c.bg }]}>
        <ActivityIndicator color={c.gold} />
        <AtlasText variant="label" tone="muted">
          Loading workout…
        </AtlasText>
      </View>
    );
  }

  if (error || !session) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: c.bg }]}>
        <AtlasText variant="title" tone="strong">
          Off the trail
        </AtlasText>
        <AtlasText variant="body" tone="muted" style={{ textAlign: 'center' }}>
          Unable to load this workout session.
        </AtlasText>
        <SecondaryButton
          label="Back to Today"
          onPress={onBack}
          leftIcon={<Ionicons name="chevron-back" size={16} color={c.goldSoft} />}
          accessibilityLabel="Return to Today"
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <TopoBackground />
      <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.screenX,
            paddingTop: 8,
            paddingBottom: 40,
            gap: spacing.gap,
          }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Return to Today"
            onPress={onBack}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingVertical: 4 }}>
            <Ionicons name="chevron-back" size={18} color={c.goldSoft} />
            <AtlasText variant="label" tone="gold">
              Back to Today
            </AtlasText>
          </Pressable>

          <View style={{ gap: 4 }}>
            <SectionLabel>Workout</SectionLabel>
            <AtlasText variant="h1" tone="strong">
              {session.templateDayName ?? 'Current Workout'}
            </AtlasText>
            <AtlasText variant="label" tone="muted">
              {session.templateName ?? 'Active route'}
            </AtlasText>
          </View>

          {/* Session overview */}
          <AtlasCard active>
            <View
              style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <SectionLabel>In Progress</SectionLabel>
                <AtlasText variant="cardTitle" tone="strong" style={{ marginTop: 5 }}>
                  {currentExercise
                    ? `${currentExerciseIndex + 1} of ${session.exercises.length}: ${currentExercise.exerciseName}`
                    : 'No exercises planned'}
                </AtlasText>
              </View>
              <AtlasText variant="label" tone={saveError ? 'warning' : 'muted'}>
                {saveError ? 'Autosave needs attention' : formatSavedAt(savedAt)}
              </AtlasText>
            </View>
            {saveError ? (
              <AtlasText variant="label" tone="muted">
                {saveError.message}
              </AtlasText>
            ) : null}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              <View style={summaryTileStyle}>
                <AtlasText variant="micro" tone="faint">
                  Exercises
                </AtlasText>
                <AtlasText variant="cardTitle" tone="strong">
                  {session.exercises.length}
                </AtlasText>
              </View>
              <View style={summaryTileStyle}>
                <AtlasText variant="micro" tone="faint">
                  Working Sets
                </AtlasText>
                <AtlasText variant="cardTitle" tone="strong">
                  {loggedWorkingSets}/{totalWorkingSets}
                </AtlasText>
              </View>
              <View style={summaryTileStyle}>
                <AtlasText variant="micro" tone="faint">
                  Volume
                </AtlasText>
                <AtlasText variant="cardTitle" tone="strong">
                  {totalVolume > 0 ? `${totalVolume} lb` : 'Pending'}
                </AtlasText>
              </View>
            </View>
          </AtlasCard>

          {/* Rest timer */}
          <AtlasCard variant="field">
            <View
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <View>
                <SectionLabel>Rest Timer</SectionLabel>
                <AtlasText
                  style={{
                    fontFamily: fonts.displaySemi,
                    fontSize: 32,
                    lineHeight: 36,
                    color: isRestTimerRunning ? c.gold : c.text,
                    marginTop: 2,
                  }}>
                  {formatTimer(restTimerSeconds)}
                </AtlasText>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TimerButton
                  icon="play"
                  label="Start"
                  onPress={() => {
                    setRestTimerSeconds(currentExercise?.restSeconds ?? 90);
                    setIsRestTimerRunning(true);
                  }}
                  accessibilityLabel="Start rest timer"
                />
                <TimerButton
                  icon="pause"
                  label="Stop"
                  onPress={() => setIsRestTimerRunning(false)}
                  accessibilityLabel="Stop rest timer"
                />
                <TimerButton
                  icon="refresh"
                  label="Reset"
                  onPress={() => {
                    setIsRestTimerRunning(false);
                    setRestTimerSeconds(0);
                  }}
                  accessibilityLabel="Reset rest timer"
                />
              </View>
            </View>
          </AtlasCard>

          {/* Exercise focus */}
          {session.exercises.length > 0 ? (
            <View style={{ gap: 12 }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flexGrow: 0 }}
                contentContainerStyle={{ gap: 8, paddingRight: 2 }}>
                {session.exercises.map((exercise, index) => {
                  const draft = drafts[exercise.id];
                  const isCurrent = index === currentExerciseIndex;
                  const hasLoggedSet = draft?.setDrafts.some(
                    (setDraft) => setDraft.weightText.trim() || setDraft.repsText.trim()
                  );

                  return (
                    <AtlasPill
                      key={exercise.id}
                      label={`${index + 1}. ${exercise.exerciseName}`}
                      selected={isCurrent}
                      dot={!!hasLoggedSet && !isCurrent}
                      tone={hasLoggedSet ? 'gold' : 'neutral'}
                      onPress={() => setCurrentExerciseIndex(index)}
                    />
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
                  progressionError={progressionError}
                  progressionRecommendation={progressionRecommendations[currentExercise.id] ?? null}
                />
              ) : null}
            </View>
          ) : (
            <AtlasCard>
              <AtlasText variant="body" tone="muted">
                This route day does not have planned exercises yet.
              </AtlasText>
            </AtlasCard>
          )}

          {/* Completion summary */}
          <AtlasCard style={{ gap: 7 }}>
            <SectionLabel>Completion Summary</SectionLabel>
            <AtlasText variant="body" tone="muted">
              {session.templateName ?? 'Route'} · {session.templateDayName ?? 'Workout'}
            </AtlasText>
            <AtlasText variant="body" tone="muted">
              {session.exercises.length} exercises, {loggedWorkingSets} logged working sets
              {totalVolume > 0 ? `, ${totalVolume} lb volume` : ''}
            </AtlasText>
            <AtlasText variant="body" tone="muted">
              Notes {hasNotes ? 'saved' : 'pending'} · Substitutions{' '}
              {hasSubstitutions ? 'included' : 'none'}
            </AtlasText>
          </AtlasCard>

          <AtlasButton
            label={
              session.status === 'completed'
                ? 'Workout Complete'
                : isCompleting
                  ? 'Completing…'
                  : 'Complete Workout'
            }
            onPress={() => onComplete(completeInput)}
            disabled={isCompleting || session.status !== 'active'}
            leftIcon={<MaterialCommunityIcons name="flag-checkered" size={20} color={c.onGold} />}
            accessibilityLabel="Complete workout"
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function TimerButton({
  icon,
  label,
  onPress,
  accessibilityLabel,
}: {
  icon: 'play' | 'pause' | 'refresh';
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  const { c, radius } = useAtlasTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        {
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          minWidth: 52,
          minHeight: 44,
          borderRadius: radius.field,
          borderWidth: 1,
          borderColor: c.goldBorder,
          paddingHorizontal: 8,
        },
        pressed && { opacity: 0.85 },
      ]}>
      <Ionicons name={icon} size={18} color={c.goldSoft} />
      <AtlasText variant="micro" tone="gold">
        {label}
      </AtlasText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
