import { useEffect, useMemo, useState } from 'react';
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
import type {
  CompleteWorkoutSessionInput,
  WorkoutSessionDetail,
  WorkoutSessionExerciseDetail,
} from '@/db/repositories/workout-session-repository';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { EffortRating } from '@/types/domain';

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
  isCompleting: boolean;
  isLoading: boolean;
  onBack: () => void;
  onComplete: (input: CompleteWorkoutSessionInput) => void;
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

function createSetDraft(index: number): SetDraft {
  return {
    id: `draft-set-${Date.now()}-${index}`,
    isWarmup: false,
    repsText: '',
    weightText: '',
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

function ExerciseCard({
  draft,
  exercise,
  onAddSet,
  onSetDraftChange,
  onSetEffort,
  onSetNotes,
  onSetSubstituteName,
  onToggleWarmup,
  onToggleSubstitution,
  palette,
  textColor,
}: {
  draft: ExerciseDraft;
  exercise: WorkoutSessionExerciseDetail;
  onAddSet: (exerciseId: string) => void;
  onSetDraftChange: (
    exerciseId: string,
    setIndex: number,
    field: 'repsText' | 'weightText',
    value: string
  ) => void;
  onSetEffort: (exerciseId: string, effortRating: EffortRating, estimatedRir: 0 | 1 | 2 | 3) => void;
  onSetNotes: (exerciseId: string, notes: string) => void;
  onSetSubstituteName: (exerciseId: string, substituteName: string) => void;
  onToggleWarmup: (exerciseId: string, setIndex: number) => void;
  onToggleSubstitution: (exerciseId: string) => void;
  palette: WorkoutPalette;
  textColor: string;
}) {
  return (
    <View style={[styles.exerciseCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      <View style={styles.exerciseHeader}>
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
      </View>

      <View style={styles.setList}>
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
          </View>
        ))}
      </View>

      <Pressable
        accessibilityLabel={`Add set for ${exercise.exerciseName}`}
        accessibilityRole="button"
        onPress={() => onAddSet(exercise.id)}
        style={[styles.secondaryButton, { borderColor: palette.border }]}>
        <ThemedText style={[styles.secondaryButtonText, { color: palette.accent }]}>Add Set</ThemedText>
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
    </View>
  );
}

export function WorkoutSessionScreenContent({
  error,
  isCompleting,
  isLoading,
  onBack,
  onComplete,
  session,
}: WorkoutSessionScreenContentProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const palette = getPalette(colorScheme);
  const theme = Colors[colorScheme];
  const [drafts, setDrafts] = useState<Record<string, ExerciseDraft>>({});

  useEffect(() => {
    setDrafts(createDrafts(session));
  }, [session]);

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

        {session.exercises.length > 0 ? (
          <View style={styles.exerciseList}>
            {session.exercises.map((exercise) => {
              const draft = drafts[exercise.id];

              if (!draft) {
                return null;
              }

              return (
                <ExerciseCard
                  draft={draft}
                  exercise={exercise}
                  key={exercise.id}
                  onAddSet={(exerciseId) => {
                    updateDraft(exerciseId, (currentDraft) => ({
                      ...currentDraft,
                      setDrafts: [
                        ...currentDraft.setDrafts,
                        createSetDraft(currentDraft.setDrafts.length + 1),
                      ],
                    }));
                  }}
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
                        : currentDraft.substituteName || exercise.exerciseName,
                    }));
                  }}
                  palette={palette}
                  textColor={theme.text}
                />
              );
            })}
          </View>
        ) : (
          <View
            style={[styles.exerciseCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
              This template day does not have planned exercises yet.
            </ThemedText>
          </View>
        )}

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
  header: {
    gap: 5,
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
  supportingText: {
    fontSize: 14,
    lineHeight: 20,
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
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
