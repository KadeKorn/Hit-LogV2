import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import type {
  CompletedSessionSummary,
  ExerciseHistoryLookupItem,
  ExerciseHistoryPerformance,
  ExerciseHistorySet,
} from '@/db/repositories/v2-history-repository';
import { useColorScheme } from '@/hooks/use-color-scheme';

type V2HistoryScreenContentProps = {
  completedSessions: CompletedSessionSummary[];
  error: Error | null;
  exerciseHistoryLookup: ExerciseHistoryLookupItem[];
  exerciseHistoryPerformances: ExerciseHistoryPerformance[];
  isLoading: boolean;
  onOpenSession: (sessionId: string) => void;
  onSelectExercise: (exerciseHistoryKey: string) => void;
  selectedExerciseHistoryKey: string | null;
};

type HistoryPalette = {
  accent: string;
  border: string;
  muted: string;
  primaryButtonText: string;
  surface: string;
  surfaceMuted: string;
};

function getPalette(colorScheme: 'light' | 'dark'): HistoryPalette {
  if (colorScheme === 'light') {
    return {
      accent: '#0A7EA4',
      border: '#D5DDE5',
      muted: '#5E6A75',
      primaryButtonText: '#FFFFFF',
      surface: '#F3F5F7',
      surfaceMuted: '#E8EDF1',
    };
  }

  return {
    accent: '#D7F75B',
    border: '#2A3138',
    muted: '#93A0AB',
    primaryButtonText: '#11151A',
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

function formatSessionSubtitle(session: CompletedSessionSummary): string {
  return [session.templateName, session.templateDayName].filter(Boolean).join(' - ') || 'V2 workout';
}

function formatVolume(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatSet(set: ExerciseHistorySet): string {
  if (set.weight == null) {
    return `${set.reps} reps`;
  }

  return `${set.weight} x ${set.reps}`;
}

function formatSets(sets: ExerciseHistorySet[]): string {
  return sets.map(formatSet).join(', ');
}

export function V2HistoryScreenContent({
  completedSessions,
  error,
  exerciseHistoryLookup,
  exerciseHistoryPerformances,
  isLoading,
  onOpenSession,
  onSelectExercise,
  selectedExerciseHistoryKey,
}: V2HistoryScreenContentProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const palette = getPalette(colorScheme);
  const theme = Colors[colorScheme];

  if (isLoading) {
    return (
      <ThemedView style={styles.centeredState}>
        <ActivityIndicator color={palette.accent} />
        <ThemedText style={[styles.stateText, { color: palette.muted }]}>
          Loading history
        </ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centeredState}>
        <ThemedText type="subtitle">History</ThemedText>
        <ThemedText style={[styles.stateText, { color: palette.muted }]}>
          Unable to load workout history.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText style={[styles.caption, { color: palette.muted }]}>History</ThemedText>
          <ThemedText type="title" style={styles.title}>
            Workout History
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionLabel, { color: palette.accent }]}>
            Completed Sessions
          </ThemedText>
          {completedSessions.length === 0 ? (
            <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
              <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
                Completed workouts will appear here after you finish a V2 workout.
              </ThemedText>
            </View>
          ) : (
            <View style={styles.list}>
              {completedSessions.map((session) => (
                <Pressable
                  accessibilityLabel={`Open workout completed ${formatDate(session.completedAt)}`}
                  accessibilityRole="button"
                  key={session.id}
                  onPress={() => onOpenSession(session.id)}
                  style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardTitleBlock}>
                      <ThemedText style={[styles.dateText, { color: palette.accent }]}>
                        {formatDate(session.completedAt)}
                      </ThemedText>
                      <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                        {formatSessionSubtitle(session)}
                      </ThemedText>
                    </View>
                    {session.hasNotes ? (
                      <View style={[styles.notePill, { borderColor: palette.border }]}>
                        <ThemedText style={[styles.notePillText, { color: palette.muted }]}>
                          Notes
                        </ThemedText>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.metaGrid}>
                    <ThemedText style={[styles.metaText, { color: palette.muted }]}>
                      {session.completedExerciseCount} exercises
                    </ThemedText>
                    <ThemedText style={[styles.metaText, { color: palette.muted }]}>
                      {session.workingSetCount} working sets
                    </ThemedText>
                    <ThemedText style={[styles.metaText, { color: palette.muted }]}>
                      {formatVolume(session.totalVolume)} volume
                    </ThemedText>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionLabel, { color: palette.accent }]}>
            Exercise History
          </ThemedText>
          {exerciseHistoryLookup.length === 0 ? (
            <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
              <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
                Exercise history will appear after you complete working sets.
              </ThemedText>
            </View>
          ) : (
            <View style={styles.exerciseHistoryLayout}>
              <ScrollView
                contentContainerStyle={styles.exerciseChipRow}
                horizontal
                showsHorizontalScrollIndicator={false}>
                {exerciseHistoryLookup.map((exercise) => {
                  const isSelected = exercise.exerciseHistoryKey === selectedExerciseHistoryKey;

                  return (
                    <Pressable
                      accessibilityLabel={`Show ${exercise.exerciseName} history`}
                      accessibilityRole="button"
                      key={exercise.exerciseHistoryKey}
                      onPress={() => onSelectExercise(exercise.exerciseHistoryKey)}
                      style={[
                        styles.exerciseChip,
                        {
                          backgroundColor: isSelected ? palette.accent : 'transparent',
                          borderColor: isSelected ? palette.accent : palette.border,
                        },
                      ]}>
                      <ThemedText
                        style={[
                          styles.exerciseChipText,
                          { color: isSelected ? palette.primaryButtonText : theme.text },
                        ]}>
                        {exercise.exerciseName}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <View style={styles.list}>
                {exerciseHistoryPerformances.map((performance) => (
                  <View
                    key={`${performance.sessionId}-${performance.completedAt}`}
                    style={[
                      styles.card,
                      { backgroundColor: palette.surface, borderColor: palette.border },
                    ]}>
                    <ThemedText style={[styles.dateText, { color: palette.accent }]}>
                      {formatDate(performance.completedAt)}
                    </ThemedText>
                    <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                      {[performance.templateName, performance.templateDayName]
                        .filter(Boolean)
                        .join(' - ') || 'V2 workout'}
                    </ThemedText>
                    <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
                      Best set: {performance.bestSet ? formatSet(performance.bestSet) : 'No working set'}
                    </ThemedText>
                    <ThemedText style={[styles.setLine, { color: theme.text }]}>
                      {formatSets(performance.workingSets)}
                    </ThemedText>
                    {performance.exerciseNotes ? (
                      <View
                        style={[
                          styles.noteBlock,
                          { backgroundColor: palette.surfaceMuted, borderColor: palette.border },
                        ]}>
                        <ThemedText style={[styles.noteLabel, { color: palette.muted }]}>
                          Notes
                        </ThemedText>
                        <ThemedText style={styles.noteText}>{performance.exerciseNotes}</ThemedText>
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
    padding: 15,
  },
  cardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  cardTitle: {
    flexShrink: 1,
    fontSize: 19,
    lineHeight: 25,
  },
  cardTitleBlock: {
    flex: 1,
    gap: 4,
    minWidth: 0,
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
  dateText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  exerciseChip: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: 13,
  },
  exerciseChipRow: {
    gap: 8,
    paddingRight: 20,
  },
  exerciseChipText: {
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  exerciseHistoryLayout: {
    gap: 12,
  },
  header: {
    gap: 4,
  },
  list: {
    gap: 12,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    lineHeight: 18,
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
  notePill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  notePillText: {
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
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.1,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  setLine: {
    fontSize: 15,
    lineHeight: 21,
  },
  stateText: {
    textAlign: 'center',
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
