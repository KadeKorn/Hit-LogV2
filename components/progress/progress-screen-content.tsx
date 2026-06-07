import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type {
  ProgressDashboard,
  ProgressExerciseTrendPoint,
  ProgressInsight,
  ProgressMetric,
} from '@/lib/progress-analysis';

type ProgressScreenContentProps = {
  dashboard: ProgressDashboard | null;
  error: Error | null;
  isLoading: boolean;
};

type ProgressPalette = {
  accent: string;
  border: string;
  muted: string;
  primaryButtonText: string;
  surface: string;
  surfaceMuted: string;
};

function getPalette(colorScheme: 'light' | 'dark'): ProgressPalette {
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
  }).format(parsedDate);
}

function formatWeek(value: string): string {
  const parsedDate = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return `Week of ${new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
  }).format(parsedDate)}`;
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatBestSet(point: ProgressExerciseTrendPoint): string {
  if (!point.bestSet) {
    return 'No best set';
  }

  if (point.bestSet.weight == null) {
    return `${point.bestSet.reps} reps`;
  }

  return `${formatNumber(point.bestSet.weight)} x ${point.bestSet.reps}`;
}

function getStrengthScore(point: ProgressExerciseTrendPoint): number {
  if (!point.bestSet) {
    return 0;
  }

  return point.bestSet.weight == null ? point.bestSet.reps : point.bestSet.weight * point.bestSet.reps;
}

function ProgressBar({
  palette,
  percent,
}: {
  palette: ProgressPalette;
  percent: number;
}) {
  return (
    <View style={[styles.barTrack, { backgroundColor: palette.surfaceMuted }]}>
      <View
        style={[
          styles.barFill,
          {
            backgroundColor: palette.accent,
            width: `${Math.max(6, Math.min(100, percent))}%`,
          },
        ]}
      />
    </View>
  );
}

function MetricCard({ metric, palette }: { metric: ProgressMetric; palette: ProgressPalette }) {
  return (
    <View style={[styles.metricCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      <ThemedText style={[styles.metaLabel, { color: palette.muted }]}>{metric.label}</ThemedText>
      <ThemedText type="defaultSemiBold" style={styles.metricValue}>
        {metric.value}
      </ThemedText>
    </View>
  );
}

function InsightList({
  emptyText,
  insights,
  palette,
}: {
  emptyText: string;
  insights: ProgressInsight[];
  palette: ProgressPalette;
}) {
  if (insights.length === 0) {
    return (
      <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <ThemedText style={[styles.supportingText, { color: palette.muted }]}>{emptyText}</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {insights.map((insight) => (
        <View
          key={`${insight.title}-${insight.detail}`}
          style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            {insight.title}
          </ThemedText>
          <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
            {insight.detail}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

export function ProgressScreenContent({
  dashboard,
  error,
  isLoading,
}: ProgressScreenContentProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const palette = getPalette(colorScheme);
  const theme = Colors[colorScheme];
  const [selectedExerciseHistoryKey, setSelectedExerciseHistoryKey] = useState<string | null>(null);

  useEffect(() => {
    const firstExerciseKey = dashboard?.exerciseOptions[0]?.exerciseHistoryKey ?? null;

    setSelectedExerciseHistoryKey((currentKey) => {
      if (
        currentKey &&
        dashboard?.exerciseOptions.some((exercise) => exercise.exerciseHistoryKey === currentKey)
      ) {
        return currentKey;
      }

      return firstExerciseKey;
    });
  }, [dashboard]);

  const selectedExercise = dashboard?.exerciseOptions.find(
    (exercise) => exercise.exerciseHistoryKey === selectedExerciseHistoryKey
  );
  const selectedTrend = useMemo(
    () =>
      selectedExerciseHistoryKey
        ? dashboard?.trendsByExercise[selectedExerciseHistoryKey] ?? []
        : [],
    [dashboard, selectedExerciseHistoryKey]
  );
  const strengthMax = useMemo(
    () => Math.max(1, ...selectedTrend.map(getStrengthScore)),
    [selectedTrend]
  );
  const volumeTrend = useMemo(
    () => selectedTrend.filter((point) => point.volume != null),
    [selectedTrend]
  );
  const volumeMax = useMemo(
    () => Math.max(1, ...volumeTrend.map((point) => point.volume ?? 0)),
    [volumeTrend]
  );
  const repsMax = useMemo(
    () => Math.max(1, ...selectedTrend.map((point) => point.totalReps)),
    [selectedTrend]
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.centeredState}>
        <ActivityIndicator color={palette.accent} />
        <ThemedText style={[styles.stateText, { color: palette.muted }]}>
          Loading progress
        </ThemedText>
      </ThemedView>
    );
  }

  if (error || !dashboard) {
    return (
      <ThemedView style={styles.centeredState}>
        <ThemedText type="subtitle">Progress</ThemedText>
        <ThemedText style={[styles.stateText, { color: palette.muted }]}>
          Unable to load progress right now.
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
          <ThemedText style={[styles.caption, { color: palette.muted }]}>Progress</ThemedText>
          <ThemedText type="title" style={styles.title}>
            Training Trends
          </ThemedText>
          <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
            History is what happened. Progress is what it means over time.
          </ThemedText>
        </View>

        {!dashboard.gate.hasUnlockedDashboard ? (
          <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <ThemedText style={[styles.sectionLabel, { color: palette.accent }]}>
              Collecting Baseline
            </ThemedText>
            <ThemedText type="subtitle" style={styles.lockTitle}>
              Complete more workouts to unlock progress trends.
            </ThemedText>
            <View style={styles.baselineList}>
              <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
                Completed workouts: {dashboard.gate.completedWorkouts} / 4
              </ThemedText>
              <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
                Training weeks logged: {dashboard.gate.trainingWeeks} / 2
              </ThemedText>
              <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
                Repeated exercises found: {dashboard.gate.repeatedExerciseCount}
              </ThemedText>
            </View>
            <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
              Progress uses completed V2 workouts only, excludes warmups, and ignores blank sets.
            </ThemedText>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <ThemedText style={[styles.sectionLabel, { color: palette.accent }]}>
                Dashboard
              </ThemedText>
              <View style={styles.metricGrid}>
                {dashboard.metrics.map((metric) => (
                  <MetricCard key={metric.label} metric={metric} palette={palette} />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText style={[styles.sectionLabel, { color: palette.accent }]}>
                Exercise Trend
              </ThemedText>
              <ScrollView
                contentContainerStyle={styles.exerciseChipRow}
                horizontal
                showsHorizontalScrollIndicator={false}>
                {dashboard.exerciseOptions.map((exercise) => {
                  const isSelected = exercise.exerciseHistoryKey === selectedExerciseHistoryKey;

                  return (
                    <Pressable
                      accessibilityLabel={`Show ${exercise.exerciseName} progress`}
                      accessibilityRole="button"
                      key={exercise.exerciseHistoryKey}
                      onPress={() => setSelectedExerciseHistoryKey(exercise.exerciseHistoryKey)}
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

              <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                  {selectedExercise?.exerciseName ?? 'Exercise'}
                </ThemedText>
                <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
                  {selectedExercise?.exposureCount ?? 0} completed exposures with working sets.
                </ThemedText>
                <View style={styles.chartList}>
                  {selectedTrend.map((point) => (
                    <View key={`${point.sessionId}-strength`} style={styles.chartRow}>
                      <View style={styles.chartLabelBlock}>
                        <ThemedText style={styles.chartValue}>{formatBestSet(point)}</ThemedText>
                        <ThemedText style={[styles.chartLabel, { color: palette.muted }]}>
                          {formatDate(point.completedAt)} / {point.workingSetCount} sets
                        </ThemedText>
                      </View>
                      <ProgressBar
                        palette={palette}
                        percent={(getStrengthScore(point) / strengthMax) * 100}
                      />
                    </View>
                  ))}
                </View>
              </View>

              <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
                  {volumeTrend.length > 0 ? 'Volume Trend' : 'Reps History'}
                </ThemedText>
                <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
                  {volumeTrend.length > 0
                    ? 'Volume is weight x reps for weighted working sets only.'
                    : 'No weighted sets found yet, so Progress shows reps instead of fake volume.'}
                </ThemedText>
                <View style={styles.chartList}>
                  {(volumeTrend.length > 0 ? volumeTrend : selectedTrend).map((point) => {
                    const value = volumeTrend.length > 0 ? point.volume ?? 0 : point.totalReps;
                    const max = volumeTrend.length > 0 ? volumeMax : repsMax;

                    return (
                      <View key={`${point.sessionId}-volume`} style={styles.chartRow}>
                        <View style={styles.chartLabelBlock}>
                          <ThemedText style={styles.chartValue}>
                            {volumeTrend.length > 0
                              ? `${formatNumber(value)} volume`
                              : `${point.totalReps} total reps`}
                          </ThemedText>
                          <ThemedText style={[styles.chartLabel, { color: palette.muted }]}>
                            {formatDate(point.completedAt)}
                          </ThemedText>
                        </View>
                        <ProgressBar palette={palette} percent={(value / max) * 100} />
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText style={[styles.sectionLabel, { color: palette.accent }]}>
                Muscle Groups
              </ThemedText>
              <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                <View style={styles.chartList}>
                  {dashboard.muscleGroupWeeks.slice(-12).map((item) => (
                    <View
                      key={`${item.weekKey}-${item.muscleGroup}`}
                      style={[styles.weekRow, { borderColor: palette.border }]}>
                      <View style={styles.cardTitleBlock}>
                        <ThemedText style={styles.chartValue}>{item.muscleGroup}</ThemedText>
                        <ThemedText style={[styles.chartLabel, { color: palette.muted }]}>
                          {formatWeek(item.weekKey)}
                        </ThemedText>
                      </View>
                      <ThemedText type="defaultSemiBold" style={styles.weekValue}>
                        {item.sets} sets
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText style={[styles.sectionLabel, { color: palette.accent }]}>
                Consistency
              </ThemedText>
              <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                <View style={styles.chartList}>
                  {dashboard.consistencyWeeks.map((week) => (
                    <View key={week.weekKey} style={styles.chartRow}>
                      <View style={styles.chartLabelBlock}>
                        <ThemedText style={styles.chartValue}>
                          {week.completedWorkouts} workout{week.completedWorkouts === 1 ? '' : 's'}
                        </ThemedText>
                        <ThemedText style={[styles.chartLabel, { color: palette.muted }]}>
                          {formatWeek(week.weekKey)}
                        </ThemedText>
                      </View>
                      <ProgressBar
                        palette={palette}
                        percent={(week.completedWorkouts / Math.max(
                          1,
                          ...dashboard.consistencyWeeks.map((item) => item.completedWorkouts)
                        )) * 100}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <ThemedText style={[styles.sectionLabel, { color: palette.accent }]}>
                Top Progress
              </ThemedText>
              <InsightList
                emptyText="No clear progress signals yet. Keep logging comparable working sets."
                insights={dashboard.topProgress}
                palette={palette}
              />
            </View>

            <View style={styles.section}>
              <ThemedText style={[styles.sectionLabel, { color: palette.accent }]}>
                Needs Attention
              </ThemedText>
              <InsightList
                emptyText="No deterministic attention flags from the current baseline."
                insights={dashboard.needsAttention}
                palette={palette}
              />
            </View>
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  baselineList: {
    gap: 4,
  },
  barFill: {
    borderRadius: 999,
    height: 8,
  },
  barTrack: {
    borderRadius: 999,
    flex: 1,
    height: 8,
    minWidth: 96,
    overflow: 'hidden',
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
    padding: 15,
  },
  cardTitle: {
    flexShrink: 1,
    fontSize: 19,
    lineHeight: 25,
  },
  cardTitleBlock: {
    flex: 1,
    gap: 3,
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
  chartLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
  chartLabelBlock: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  chartList: {
    gap: 10,
  },
  chartRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  chartValue: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  content: {
    gap: 18,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 20,
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
  header: {
    gap: 4,
  },
  list: {
    gap: 10,
  },
  lockTitle: {
    fontSize: 22,
    lineHeight: 28,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  metricCard: {
    borderRadius: 16,
    borderWidth: 1,
    flexBasis: '44%',
    flexGrow: 1,
    gap: 4,
    minHeight: 76,
    minWidth: 140,
    padding: 12,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricValue: {
    flexShrink: 1,
    fontSize: 22,
    lineHeight: 28,
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
  weekRow: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  weekValue: {
    fontSize: 16,
    lineHeight: 22,
  },
});
