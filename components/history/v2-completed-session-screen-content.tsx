import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import type {
  CompletedSessionDetail,
  CompletedSessionExercise,
} from '@/db/repositories/v2-history-repository';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { SetLog } from '@/types/domain';

type V2CompletedSessionScreenContentProps = {
  error: Error | null;
  isLoading: boolean;
  onBack: () => void;
  session: CompletedSessionDetail | null;
};

type SessionPalette = {
  accent: string;
  border: string;
  muted: string;
  surface: string;
  surfaceMuted: string;
};

function getPalette(colorScheme: 'light' | 'dark'): SessionPalette {
  if (colorScheme === 'light') {
    return {
      accent: '#0A7EA4',
      border: '#D5DDE5',
      muted: '#5E6A75',
      surface: '#F3F5F7',
      surfaceMuted: '#E8EDF1',
    };
  }

  return {
    accent: '#D7F75B',
    border: '#2A3138',
    muted: '#93A0AB',
    surface: '#171B20',
    surfaceMuted: '#11151A',
  };
}

function formatDate(value: string): string {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);
}

function formatEffort(exercise: CompletedSessionExercise): string | null {
  if (!exercise.effortRating && exercise.estimatedRir == null) {
    return null;
  }

  const effort = exercise.effortRating
    ? exercise.effortRating.charAt(0).toUpperCase() + exercise.effortRating.slice(1)
    : 'Effort';
  const rir = exercise.estimatedRir == null ? '' : ` - ${exercise.estimatedRir} RIR`;

  return `${effort}${rir}`;
}

function formatSet(set: SetLog): string {
  if (set.weight == null) {
    return `${set.reps} reps`;
  }

  return `${set.weight} x ${set.reps}`;
}

function SetGroup({
  label,
  palette,
  sets,
  textColor,
}: {
  label: string;
  palette: SessionPalette;
  sets: SetLog[];
  textColor: string;
}) {
  if (sets.length === 0) {
    return null;
  }

  return (
    <View style={styles.setGroup}>
      <ThemedText style={[styles.setGroupLabel, { color: palette.muted }]}>{label}</ThemedText>
      {sets.map((set) => (
        <View
          key={set.id}
          style={[
            styles.setRow,
            { backgroundColor: palette.surfaceMuted, borderColor: palette.border },
          ]}>
          <ThemedText style={[styles.setNumber, { color: palette.muted }]}>
            Set {set.setNumber}
          </ThemedText>
          <ThemedText style={[styles.setValue, { color: textColor }]}>{formatSet(set)}</ThemedText>
          {set.notes ? (
            <ThemedText style={[styles.setNote, { color: palette.muted }]}>{set.notes}</ThemedText>
          ) : null}
        </View>
      ))}
    </View>
  );
}

export function V2CompletedSessionScreenContent({
  error,
  isLoading,
  onBack,
  session,
}: V2CompletedSessionScreenContentProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const palette = getPalette(colorScheme);
  const theme = Colors[colorScheme];

  if (isLoading) {
    return (
      <ThemedView style={styles.centeredState}>
        <ActivityIndicator color={palette.accent} />
        <ThemedText style={[styles.stateText, { color: palette.muted }]}>
          Loading completed workout
        </ThemedText>
      </ThemedView>
    );
  }

  if (error || !session) {
    return (
      <ThemedView style={styles.centeredState}>
        <ThemedText type="subtitle">Completed Workout</ThemedText>
        <ThemedText style={[styles.stateText, { color: palette.muted }]}>
          Unable to load this completed workout.
        </ThemedText>
        <Pressable
          accessibilityLabel="Return to History"
          accessibilityRole="button"
          onPress={onBack}
          style={[styles.backButtonPanel, { borderColor: palette.border }]}>
          <ThemedText style={[styles.backButtonText, { color: palette.accent }]}>
            Back to History
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
          accessibilityLabel="Return to History"
          accessibilityRole="button"
          onPress={onBack}
          style={styles.backButton}>
          <ThemedText style={[styles.backButtonText, { color: palette.accent }]}>
            Back to History
          </ThemedText>
        </Pressable>

        <View style={styles.header}>
          <ThemedText style={[styles.caption, { color: palette.muted }]}>Completed Workout</ThemedText>
          <ThemedText type="title" style={styles.title}>
            {session.templateDayName ?? 'Workout'}
          </ThemedText>
          <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
            {session.templateName ?? 'V2 workout'} - {formatDate(session.completedAt)}
          </ThemedText>
        </View>

        {session.notes ? (
          <View
            style={[styles.noteBlock, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <ThemedText style={[styles.noteLabel, { color: palette.muted }]}>Session Notes</ThemedText>
            <ThemedText style={styles.noteText}>{session.notes}</ThemedText>
          </View>
        ) : null}

        <View style={styles.exerciseList}>
          {session.exercises.map((exercise) => {
            const warmupSets = exercise.setLogs.filter((set) => set.isWarmup);
            const workingSets = exercise.setLogs.filter((set) => !set.isWarmup);
            const effort = formatEffort(exercise);

            return (
              <View
                key={exercise.id}
                style={[
                  styles.exerciseCard,
                  { backgroundColor: palette.surface, borderColor: palette.border },
                ]}>
                <View style={styles.exerciseHeader}>
                  <ThemedText type="defaultSemiBold" style={styles.exerciseName}>
                    {exercise.exerciseName}
                  </ThemedText>
                  {exercise.isSubstitution ? (
                    <View style={[styles.substitutionPill, { borderColor: palette.accent }]}>
                      <ThemedText style={[styles.substitutionPillText, { color: palette.accent }]}>
                        Substitution
                      </ThemedText>
                    </View>
                  ) : null}
                </View>
                {effort ? (
                  <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
                    {effort}
                  </ThemedText>
                ) : null}

                <SetGroup
                  label="Warmup Sets"
                  palette={palette}
                  sets={warmupSets}
                  textColor={theme.text}
                />
                <SetGroup
                  label="Working Sets"
                  palette={palette}
                  sets={workingSets}
                  textColor={theme.text}
                />

                {warmupSets.length === 0 && workingSets.length === 0 ? (
                  <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
                    No completed sets were logged.
                  </ThemedText>
                ) : null}

                {exercise.notes ? (
                  <View
                    style={[
                      styles.noteBlock,
                      { backgroundColor: palette.surfaceMuted, borderColor: palette.border },
                    ]}>
                    <ThemedText style={[styles.noteLabel, { color: palette.muted }]}>
                      Exercise Notes
                    </ThemedText>
                    <ThemedText style={styles.noteText}>{exercise.notes}</ThemedText>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  backButtonPanel: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
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
  centeredState: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    gap: 18,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  exerciseCard: {
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    padding: 15,
  },
  exerciseHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  exerciseList: {
    gap: 12,
  },
  exerciseName: {
    flex: 1,
    fontSize: 20,
    lineHeight: 26,
  },
  header: {
    gap: 5,
  },
  noteBlock: {
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
    padding: 12,
  },
  noteLabel: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
  },
  screen: {
    flex: 1,
  },
  setGroup: {
    gap: 8,
  },
  setGroupLabel: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  setNote: {
    flexBasis: '100%',
    fontSize: 13,
    lineHeight: 18,
  },
  setNumber: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  setRow: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  setValue: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  stateText: {
    textAlign: 'center',
  },
  substitutionPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  substitutionPillText: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  supportingText: {
    fontSize: 14,
    lineHeight: 20,
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
  },
});
