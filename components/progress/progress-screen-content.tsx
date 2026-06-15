import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AtlasCard, AtlasPill, AtlasText, CompassMark, TopoBackground } from '@/components/atlas';
import { useAtlasTheme } from '@/hooks/use-atlas-theme';
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

function ProgressBar({ percent }: { percent: number }) {
  const { c } = useAtlasTheme();

  return (
    <View
      style={{
        flex: 1,
        minWidth: 96,
        height: 8,
        borderRadius: 999,
        backgroundColor: c.track,
        overflow: 'hidden',
      }}>
      <View
        style={{
          height: 8,
          borderRadius: 999,
          backgroundColor: c.gold,
          width: `${Math.max(6, Math.min(100, percent))}%`,
        }}
      />
    </View>
  );
}

function MetricCard({ metric }: { metric: ProgressMetric }) {
  const { c, radius } = useAtlasTheme();

  return (
    <View
      style={{
        flexBasis: '47%',
        flexGrow: 1,
        minWidth: 150,
        gap: 4,
        backgroundColor: c.field,
        borderColor: c.cardBorder,
        borderWidth: 1,
        borderRadius: radius.sm,
        padding: 13,
      }}>
      <AtlasText variant="micro" tone="faint">
        {metric.label}
      </AtlasText>
      <AtlasText variant="cardTitle" tone="strong">
        {metric.value}
      </AtlasText>
    </View>
  );
}

function InsightList({ emptyText, insights }: { emptyText: string; insights: ProgressInsight[] }) {
  if (insights.length === 0) {
    return (
      <AtlasCard variant="field">
        <AtlasText variant="body" tone="muted">
          {emptyText}
        </AtlasText>
      </AtlasCard>
    );
  }

  return (
    <View style={{ gap: 10 }}>
      {insights.map((insight) => (
        <AtlasCard key={`${insight.title}-${insight.detail}`} style={{ gap: 6 }}>
          <AtlasText variant="cardTitle" tone="strong">
            {insight.title}
          </AtlasText>
          <AtlasText variant="body" tone="muted">
            {insight.detail}
          </AtlasText>
        </AtlasCard>
      ))}
    </View>
  );
}

export function ProgressScreenContent({ dashboard, error, isLoading }: ProgressScreenContentProps) {
  const { c, spacing } = useAtlasTheme();
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
      selectedExerciseHistoryKey ? dashboard?.trendsByExercise[selectedExerciseHistoryKey] ?? [] : [],
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
      <View style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        <ActivityIndicator color={c.gold} />
        <AtlasText variant="label" tone="muted">
          Charting your trends…
        </AtlasText>
      </View>
    );
  }

  if (error || !dashboard) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 }}>
        <AtlasText variant="title" tone="strong">
          Trends unavailable
        </AtlasText>
        <AtlasText variant="body" tone="muted" style={{ textAlign: 'center' }}>
          Unable to load your route progress right now.
        </AtlasText>
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
            paddingBottom: 36,
            gap: 22,
          }}>
          <View style={{ gap: 4 }}>
            <AtlasText variant="micro" tone="gold">
              Progress
            </AtlasText>
            <AtlasText variant="h1" tone="strong">
              Training Trends
            </AtlasText>
            <AtlasText variant="body" tone="muted" style={{ marginTop: 2 }}>
              History is what happened. Progress is what it means over time.
            </AtlasText>
          </View>

          {!dashboard.gate.hasUnlockedDashboard ? (
            <AtlasCard active style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <CompassMark size={40} />
                <View style={{ flex: 1 }}>
                  <AtlasText variant="micro" tone="gold">
                    Mapping Your Route
                  </AtlasText>
                  <AtlasText variant="title" tone="strong" style={{ marginTop: 4 }}>
                    Keep logging to chart your trends.
                  </AtlasText>
                </View>
              </View>
              <View style={{ gap: 4 }}>
                <AtlasText variant="body" tone="muted">
                  Completed workouts: {dashboard.gate.completedWorkouts} / 4
                </AtlasText>
                <AtlasText variant="body" tone="muted">
                  Training weeks logged: {dashboard.gate.trainingWeeks} / 2
                </AtlasText>
                <AtlasText variant="body" tone="muted">
                  Repeated exercises found: {dashboard.gate.repeatedExerciseCount}
                </AtlasText>
              </View>
              <AtlasText variant="body" tone="muted">
                Progress uses completed V2 workouts only, excludes warmups, and ignores blank sets.
              </AtlasText>
            </AtlasCard>
          ) : (
            <>
              <View style={{ gap: 12 }}>
                <AtlasText variant="micro" tone="gold">
                  Dashboard
                </AtlasText>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {dashboard.metrics.map((metric) => (
                    <MetricCard key={metric.label} metric={metric} />
                  ))}
                </View>
              </View>

              <View style={{ gap: 12 }}>
                <AtlasText variant="micro" tone="gold">
                  Movement Trend
                </AtlasText>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8, paddingRight: 8 }}>
                  {dashboard.exerciseOptions.map((exercise) => (
                    <AtlasPill
                      key={exercise.exerciseHistoryKey}
                      label={exercise.exerciseName}
                      selected={exercise.exerciseHistoryKey === selectedExerciseHistoryKey}
                      onPress={() => setSelectedExerciseHistoryKey(exercise.exerciseHistoryKey)}
                    />
                  ))}
                </ScrollView>

                <AtlasCard style={{ gap: 10 }}>
                  <AtlasText variant="cardTitle" tone="strong">
                    {selectedExercise?.exerciseName ?? 'Exercise'}
                  </AtlasText>
                  <AtlasText variant="body" tone="muted">
                    {selectedExercise?.exposureCount ?? 0} completed exposures with working sets.
                  </AtlasText>
                  <View style={{ gap: 10 }}>
                    {selectedTrend.map((point) => (
                      <View
                        key={`${point.sessionId}-strength`}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={{ flex: 1, gap: 2, minWidth: 0 }}>
                          <AtlasText variant="bodyStrong" tone="strong">
                            {formatBestSet(point)}
                          </AtlasText>
                          <AtlasText variant="label" tone="muted">
                            {formatDate(point.completedAt)} · {point.workingSetCount} sets
                          </AtlasText>
                        </View>
                        <ProgressBar percent={(getStrengthScore(point) / strengthMax) * 100} />
                      </View>
                    ))}
                  </View>
                </AtlasCard>

                <AtlasCard style={{ gap: 10 }}>
                  <AtlasText variant="cardTitle" tone="strong">
                    {volumeTrend.length > 0 ? 'Volume Trend' : 'Reps History'}
                  </AtlasText>
                  <AtlasText variant="body" tone="muted">
                    {volumeTrend.length > 0
                      ? 'Volume is weight x reps for weighted working sets only.'
                      : 'No weighted sets found yet, so Progress shows reps instead of fake volume.'}
                  </AtlasText>
                  <View style={{ gap: 10 }}>
                    {(volumeTrend.length > 0 ? volumeTrend : selectedTrend).map((point) => {
                      const value = volumeTrend.length > 0 ? point.volume ?? 0 : point.totalReps;
                      const max = volumeTrend.length > 0 ? volumeMax : repsMax;

                      return (
                        <View
                          key={`${point.sessionId}-volume`}
                          style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                          <View style={{ flex: 1, gap: 2, minWidth: 0 }}>
                            <AtlasText variant="bodyStrong" tone="strong">
                              {volumeTrend.length > 0
                                ? `${formatNumber(value)} volume`
                                : `${point.totalReps} total reps`}
                            </AtlasText>
                            <AtlasText variant="label" tone="muted">
                              {formatDate(point.completedAt)}
                            </AtlasText>
                          </View>
                          <ProgressBar percent={(value / max) * 100} />
                        </View>
                      );
                    })}
                  </View>
                </AtlasCard>
              </View>

              <View style={{ gap: 12 }}>
                <AtlasText variant="micro" tone="gold">
                  Muscle Groups
                </AtlasText>
                <AtlasCard style={{ gap: 10 }}>
                  {dashboard.muscleGroupWeeks.slice(-12).map((item) => (
                    <View
                      key={`${item.weekKey}-${item.muscleGroup}`}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        borderBottomWidth: 1,
                        borderColor: c.hairline,
                        paddingBottom: 10,
                      }}>
                      <View style={{ flex: 1, gap: 2, minWidth: 0 }}>
                        <AtlasText variant="bodyStrong" tone="strong">
                          {item.muscleGroup}
                        </AtlasText>
                        <AtlasText variant="label" tone="muted">
                          {formatWeek(item.weekKey)}
                        </AtlasText>
                      </View>
                      <AtlasText variant="cardTitle" tone="strong">
                        {item.sets} sets
                      </AtlasText>
                    </View>
                  ))}
                </AtlasCard>
              </View>

              <View style={{ gap: 12 }}>
                <AtlasText variant="micro" tone="gold">
                  Consistency
                </AtlasText>
                <AtlasCard style={{ gap: 10 }}>
                  {dashboard.consistencyWeeks.map((week) => (
                    <View
                      key={week.weekKey}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View style={{ flex: 1, gap: 2, minWidth: 0 }}>
                        <AtlasText variant="bodyStrong" tone="strong">
                          {week.completedWorkouts} workout{week.completedWorkouts === 1 ? '' : 's'}
                        </AtlasText>
                        <AtlasText variant="label" tone="muted">
                          {formatWeek(week.weekKey)}
                        </AtlasText>
                      </View>
                      <ProgressBar
                        percent={
                          (week.completedWorkouts /
                            Math.max(
                              1,
                              ...dashboard.consistencyWeeks.map((item) => item.completedWorkouts)
                            )) *
                          100
                        }
                      />
                    </View>
                  ))}
                </AtlasCard>
              </View>

              <View style={{ gap: 12 }}>
                <AtlasText variant="micro" tone="gold">
                  Milestones
                </AtlasText>
                <InsightList
                  emptyText="No clear progress signals yet. Keep logging comparable working sets."
                  insights={dashboard.topProgress}
                />
              </View>

              <View style={{ gap: 12 }}>
                <AtlasText variant="micro" tone="gold">
                  Needs Attention
                </AtlasText>
                <InsightList
                  emptyText="No deterministic attention flags from the current baseline."
                  insights={dashboard.needsAttention}
                />
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
