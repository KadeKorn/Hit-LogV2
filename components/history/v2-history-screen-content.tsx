import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AtlasButton, AtlasCard, AtlasPill, AtlasText, TopoBackground, Waypoint } from '@/components/atlas';
import type {
  CompletedSessionSummary,
  ExerciseHistoryLookupItem,
  ExerciseHistoryPerformance,
  ExerciseHistorySet,
} from '@/db/repositories/v2-history-repository';
import { useAtlasTheme } from '@/hooks/use-atlas-theme';

type V2HistoryScreenContentProps = {
  completedSessions: CompletedSessionSummary[];
  error: Error | null;
  exerciseHistoryLookup: ExerciseHistoryLookupItem[];
  exerciseHistoryPerformances: ExerciseHistoryPerformance[];
  isLoading: boolean;
  loadedExerciseHistoryKey: string | null;
  onOpenSession: (sessionId: string) => void;
  onSelectExercise: (exerciseHistoryKey: string) => void;
  selectedExerciseHistoryKey: string | null;
};

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
  return [session.templateName, session.templateDayName].filter(Boolean).join(' · ') || 'V2 workout';
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
  loadedExerciseHistoryKey,
  onOpenSession,
  onSelectExercise,
  selectedExerciseHistoryKey,
}: V2HistoryScreenContentProps) {
  const { c, spacing } = useAtlasTheme();
  const [isShowingAllCompletedSessions, setIsShowingAllCompletedSessions] = useState(false);
  const displayedCompletedSessions = useMemo(
    () => (isShowingAllCompletedSessions ? completedSessions : completedSessions.slice(0, 5)),
    [completedSessions, isShowingAllCompletedSessions]
  );
  const canToggleCompletedSessions = completedSessions.length > 5;
  const hasLoadedSelectedExercise =
    selectedExerciseHistoryKey != null && loadedExerciseHistoryKey === selectedExerciseHistoryKey;

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        <ActivityIndicator color={c.gold} />
        <AtlasText variant="label" tone="muted">
          Loading the Trail…
        </AtlasText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 }}>
        <AtlasText variant="title" tone="strong">
          Trail unavailable
        </AtlasText>
        <AtlasText variant="body" tone="muted" style={{ textAlign: 'center' }}>
          Unable to load your training history.
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
              History
            </AtlasText>
            <AtlasText variant="h1" tone="strong">
              Trail
            </AtlasText>
            <AtlasText variant="body" tone="muted" style={{ marginTop: 2 }}>
              Every session you&apos;ve logged, mapped.
            </AtlasText>
          </View>

          {/* Logged Sessions */}
          <View style={{ gap: 12 }}>
            <AtlasText variant="micro" tone="gold">
              Logged Sessions
            </AtlasText>
            {completedSessions.length === 0 ? (
              <AtlasCard variant="field">
                <AtlasText variant="body" tone="muted">
                  Logged sessions will appear here after you finish a session.
                </AtlasText>
              </AtlasCard>
            ) : (
              <View style={{ gap: 12 }}>
                {displayedCompletedSessions.map((session) => (
                  <AtlasCard
                    key={session.id}
                    onPress={() => onOpenSession(session.id)}
                    accessibilityLabel={`Open session logged ${formatDate(session.completedAt)}`}
                    style={{ gap: 10 }}>
                    <View
                      style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Waypoint state="done" size={11} />
                          <AtlasText variant="micro" tone="gold">
                            {formatDate(session.completedAt)}
                          </AtlasText>
                        </View>
                        <AtlasText variant="cardTitle" tone="strong" style={{ marginTop: 5 }}>
                          {formatSessionSubtitle(session)}
                        </AtlasText>
                      </View>
                      {session.hasNotes ? <AtlasPill label="Notes" tone="neutral" /> : null}
                    </View>
                    <AtlasText variant="label" tone="muted">
                      {session.completedExerciseCount} exercises · {session.workingSetCount} working sets ·{' '}
                      {formatVolume(session.totalVolume)} volume
                    </AtlasText>
                  </AtlasCard>
                ))}
                {canToggleCompletedSessions ? (
                  <AtlasButton
                    variant="ghost"
                    label={isShowingAllCompletedSessions ? 'Show less' : 'View all logged sessions'}
                    onPress={() => setIsShowingAllCompletedSessions((currentValue) => !currentValue)}
                    accessibilityLabel={
                      isShowingAllCompletedSessions
                        ? 'Show fewer logged sessions'
                        : 'View all logged sessions'
                    }
                  />
                ) : null}
              </View>
            )}
          </View>

          {/* Movement History */}
          <View style={{ gap: 12 }}>
            <AtlasText variant="micro" tone="gold">
              Movement History
            </AtlasText>
            {exerciseHistoryLookup.length === 0 ? (
              <AtlasCard variant="field">
                <AtlasText variant="body" tone="muted">
                  Movement history will appear after you complete working sets.
                </AtlasText>
              </AtlasCard>
            ) : (
              <View style={{ gap: 12 }}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8, paddingRight: 8 }}>
                  {exerciseHistoryLookup.map((exercise) => (
                    <AtlasPill
                      key={exercise.exerciseHistoryKey}
                      label={exercise.exerciseName}
                      selected={exercise.exerciseHistoryKey === selectedExerciseHistoryKey}
                      onPress={() => onSelectExercise(exercise.exerciseHistoryKey)}
                    />
                  ))}
                </ScrollView>

                {hasLoadedSelectedExercise && exerciseHistoryPerformances.length === 0 ? (
                  <AtlasCard variant="field">
                    <AtlasText variant="body" tone="muted">
                      Movement history will appear after you complete working sets.
                    </AtlasText>
                  </AtlasCard>
                ) : (
                  <View style={{ gap: 12 }}>
                    {exerciseHistoryPerformances.map((performance) => (
                      <AtlasCard key={`${performance.sessionId}-${performance.completedAt}`} style={{ gap: 7 }}>
                        <AtlasText variant="micro" tone="gold">
                          {formatDate(performance.completedAt)}
                        </AtlasText>
                        <AtlasText variant="cardTitle" tone="strong">
                          {[performance.templateName, performance.templateDayName]
                            .filter(Boolean)
                            .join(' · ') || 'V2 workout'}
                        </AtlasText>
                        <AtlasText variant="label" tone="muted">
                          Best set:{' '}
                          <AtlasText variant="label" tone="strong">
                            {performance.bestSet ? formatSet(performance.bestSet) : 'No working set'}
                          </AtlasText>
                        </AtlasText>
                        <AtlasText variant="body" tone="default">
                          {formatSets(performance.workingSets)}
                        </AtlasText>
                        {performance.exerciseNotes ? (
                          <View
                            style={{
                              backgroundColor: c.field,
                              borderColor: c.cardBorder,
                              borderWidth: 1,
                              borderRadius: 14,
                              padding: 12,
                              gap: 6,
                            }}>
                            <AtlasText variant="micro" tone="faint">
                              Notes
                            </AtlasText>
                            <AtlasText variant="body" tone="default">
                              {performance.exerciseNotes}
                            </AtlasText>
                          </View>
                        ) : null}
                      </AtlasCard>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
