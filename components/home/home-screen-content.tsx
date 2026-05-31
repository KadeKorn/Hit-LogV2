import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import type { NextRecommendedWorkoutDay } from '@/db/repositories/template-repository';
import type { TemplateLatestCompletedWorkout } from '@/db/repositories/workout-log-repository';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { ActiveRoutine, TemplateDay, WorkoutSession, WorkoutTemplateWithDays } from '@/types/domain';

type HomeScreenContentProps = {
  activeRoutine: ActiveRoutine | null;
  activeRoutineTemplate: WorkoutTemplateWithDays | null;
  activeWorkoutSession: WorkoutSession | null;
  currentTemplateDay: TemplateDay | null;
  error: Error | null;
  isLoading: boolean;
  isStartingWorkout: boolean;
  latestPerTemplate: TemplateLatestCompletedWorkout[];
  nextWorkout: NextRecommendedWorkoutDay | null;
  onLibraryPress: () => void;
  onStartWorkout: () => void;
  onTemplatePress: (templateId: string) => void;
};

type HomePalette = {
  accent: string;
  border: string;
  muted: string;
  primaryButtonText: string;
  surface: string;
  surfaceMuted: string;
};

function formatCompletedDate(value: string): string {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsedDate);
}

function getPalette(colorScheme: 'light' | 'dark'): HomePalette {
  if (colorScheme === 'light') {
    return {
      surface: '#F3F5F7',
      surfaceMuted: '#E8EDF1',
      border: '#D5DDE5',
      muted: '#5E6A75',
      accent: '#0A7EA4',
      primaryButtonText: '#FFFFFF',
    };
  }

  return {
    surface: '#171B20',
    surfaceMuted: '#11151A',
    border: '#2A3138',
    muted: '#93A0AB',
    accent: '#D7F75B',
    primaryButtonText: '#11151A',
  };
}

function formatToken(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatSessionSummary(count: number | undefined): string {
  if (!count) {
    return 'Sessions pending';
  }

  if (count === 1) {
    return '1 session';
  }

  return `${count} sessions`;
}

function ActionButton({
  accessibilityLabel,
  label,
  onPress,
  palette,
  variant,
}: {
  accessibilityLabel: string;
  label: string;
  onPress: () => void;
  palette: HomePalette;
  variant: 'primary' | 'secondary';
}) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.actionButton,
        {
          backgroundColor: isPrimary ? palette.accent : 'transparent',
          borderColor: isPrimary ? palette.accent : palette.border,
        },
      ]}>
      <ThemedText
        style={[
          styles.actionButtonText,
          { color: isPrimary ? palette.primaryButtonText : palette.accent },
        ]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function MetaTile({
  label,
  palette,
  value,
}: {
  label: string;
  palette: HomePalette;
  value: string;
}) {
  return (
    <View style={[styles.metaTile, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      <ThemedText style={[styles.metaLabel, { color: palette.muted }]}>{label}</ThemedText>
      <ThemedText type="defaultSemiBold" style={styles.metaValue}>
        {value}
      </ThemedText>
    </View>
  );
}

export function HomeScreenContent({
  activeRoutine,
  activeRoutineTemplate,
  activeWorkoutSession,
  currentTemplateDay,
  error,
  isLoading,
  isStartingWorkout,
  latestPerTemplate,
  nextWorkout,
  onLibraryPress,
  onStartWorkout,
  onTemplatePress,
}: HomeScreenContentProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const theme = Colors[colorScheme];
  const palette = getPalette(colorScheme);

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator color={palette.accent} />
        <ThemedText style={[styles.loadingText, { color: palette.muted }]}>
          Loading Home
        </ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText type="subtitle">Home</ThemedText>
        <ThemedText style={[styles.errorText, { color: palette.muted }]}>
          Unable to load workout data right now.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic">
        <View style={styles.header}>
          <ThemedText style={[styles.caption, { color: palette.muted }]}>
            Train
          </ThemedText>
          <ThemedText type="title" style={styles.title}>
            Training
          </ThemedText>
        </View>

        {activeRoutine ? (
          activeRoutineTemplate ? (
            <View
              style={[
                styles.activeRoutineCard,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}>
              <View style={styles.activeRoutineHeader}>
                <View style={styles.templateTitleBlock}>
                  <ThemedText style={[styles.sectionLabel, { color: palette.accent }]}>
                    Active Routine
                  </ThemedText>
                  <ThemedText type="subtitle" style={styles.nextUpName}>
                    {activeRoutineTemplate.name}
                  </ThemedText>
                  <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
                    {formatToken(activeRoutineTemplate.sourceType) ?? 'Template'} routine
                  </ThemedText>
                </View>
                <View style={[styles.statusPill, { borderColor: palette.accent }]}>
                  <ThemedText style={[styles.statusPillText, { color: palette.accent }]}>
                    {formatToken(activeRoutine.status) ?? activeRoutine.status}
                  </ThemedText>
                </View>
              </View>

              <View
                style={[
                  styles.nextWorkoutPanel,
                  { backgroundColor: palette.surfaceMuted, borderColor: palette.border },
                ]}>
                <ThemedText style={[styles.sectionLabel, { color: palette.accent }]}>
                  Next Workout
                </ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.nextWorkoutName}>
                  {currentTemplateDay?.name ?? 'Template day pending'}
                </ThemedText>
                {currentTemplateDay?.focus ? (
                  <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
                    {formatToken(currentTemplateDay.focus)}
                  </ThemedText>
                ) : null}
              </View>

              <View style={styles.metaGrid}>
                <MetaTile
                  label="Goal"
                  palette={palette}
                  value={formatToken(activeRoutineTemplate.goal) ?? 'Unspecified'}
                />
                <MetaTile
                  label="Split"
                  palette={palette}
                  value={formatToken(activeRoutineTemplate.splitType) ?? 'Unspecified'}
                />
                <MetaTile
                  label="Sessions"
                  palette={palette}
                  value={formatSessionSummary(activeRoutineTemplate.days.length)}
                />
              </View>

              <View style={styles.actionGroup}>
                <ActionButton
                  accessibilityLabel={
                    activeWorkoutSession ? 'Resume active workout' : 'Start active routine workout'
                  }
                  label={
                    isStartingWorkout
                      ? 'Opening Workout'
                      : activeWorkoutSession
                        ? 'Resume Workout'
                        : 'Start Workout'
                  }
                  onPress={onStartWorkout}
                  palette={palette}
                  variant="primary"
                />
                <ActionButton
                  accessibilityLabel="Change active routine in Library"
                  label="Change Routine"
                  onPress={onLibraryPress}
                  palette={palette}
                  variant="secondary"
                />
              </View>
            </View>
          ) : (
            <View
              style={[
                styles.activeRoutineCard,
                { backgroundColor: palette.surface, borderColor: palette.border },
              ]}>
              <ThemedText style={[styles.sectionLabel, { color: palette.accent }]}>
                Active Routine
              </ThemedText>
              <ThemedText type="subtitle" style={styles.nextUpName}>
                Routine unavailable
              </ThemedText>
              <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
                The selected routine references a template that is no longer available.
              </ThemedText>
              <ActionButton
                accessibilityLabel="Go to Library to choose a routine"
                label="Go to Library"
                onPress={onLibraryPress}
                palette={palette}
                variant="primary"
              />
            </View>
          )
        ) : (
          <View
            style={[
              styles.activeRoutineCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <ThemedText style={[styles.sectionLabel, { color: palette.accent }]}>
              No Active Routine
            </ThemedText>
            <ThemedText type="subtitle" style={styles.nextUpName}>
              No Active Routine
            </ThemedText>
            <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
              Choose a template from the Library to start guided training.
            </ThemedText>
            <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
              Library contains prebuilt and custom templates.
            </ThemedText>
            <ActionButton
              accessibilityLabel="Go to Library to choose a routine"
              label="Go to Library"
              onPress={onLibraryPress}
              palette={palette}
              variant="primary"
            />
          </View>
        )}

        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Current Logging
          </ThemedText>
          <ThemedText style={[styles.caption, { color: palette.muted }]}>
            Yates Log
          </ThemedText>
        </View>

        {nextWorkout ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Open ${nextWorkout.recommendedTemplate.name} workout logger`}
            onPress={() => onTemplatePress(nextWorkout.recommendedTemplate.id)}
            style={[
              styles.nextUpCard,
              {
                backgroundColor: palette.surface,
                borderColor: palette.border,
              },
            ]}>
            <ThemedText style={[styles.sectionLabel, { color: palette.accent }]}>
              Legacy Logger
            </ThemedText>
            <ThemedText type="subtitle" style={styles.legacyLoggerName}>
              {nextWorkout.recommendedTemplate.name}
            </ThemedText>
            <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
              Preserved access to the existing workout logger.
            </ThemedText>
          </Pressable>
        ) : null}

        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Latest Logs
          </ThemedText>
          <ThemedText style={[styles.caption, { color: palette.muted }]}>
            Active templates
          </ThemedText>
        </View>

        <View style={styles.cardList}>
          {latestPerTemplate.length > 0 ? (
            latestPerTemplate.map((template) => {
              const latestWorkout = template.latestCompletedWorkout;

              return (
                <Pressable
                  key={template.templateId}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${template.templateName} workout logger`}
                  onPress={() => onTemplatePress(template.templateId)}
                  style={[
                    styles.templateCard,
                    {
                      backgroundColor: latestWorkout ? palette.surface : palette.surfaceMuted,
                      borderColor: palette.border,
                    },
                  ]}>
                  <View style={styles.templateHeader}>
                    <ThemedText type="defaultSemiBold" style={styles.templateName}>
                      {template.templateName}
                    </ThemedText>
                    <ThemedText style={[styles.templateCode, { color: palette.muted }]}>
                      {template.templateCode.toUpperCase()}
                    </ThemedText>
                  </View>

                  {latestWorkout ? (
                    <View style={styles.summaryBlock}>
                      <ThemedText style={[styles.summaryMeta, { color: palette.muted }]}>
                        Last completed {formatCompletedDate(latestWorkout.completedAt)}
                      </ThemedText>
                      <ThemedText style={[styles.summaryText, { color: theme.text }]}>
                        {latestWorkout.summary?.trim() || 'Completed workout summary unavailable.'}
                      </ThemedText>
                    </View>
                  ) : (
                    <View style={styles.summaryBlock}>
                      <ThemedText style={[styles.summaryMeta, { color: palette.muted }]}>
                        No completed workouts yet
                      </ThemedText>
                      <ThemedText style={[styles.summaryText, { color: theme.text }]}>
                        This template is active and ready when you log the first completed session.
                      </ThemedText>
                    </View>
                  )}
                </Pressable>
              );
            })
          ) : (
            <View
                style={[
                  styles.templateCard,
                  {
                    backgroundColor: palette.surfaceMuted,
                    borderColor: palette.border,
                  },
                ]}>
              <ThemedText style={[styles.summaryText, { color: palette.muted }]}>
                No legacy logging templates are available right now.
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 16,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
    textTransform: 'uppercase',
  },
  actionGroup: {
    gap: 10,
  },
  activeRoutineCard: {
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  activeRoutineHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardList: {
    gap: 12,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 16,
  },
  errorText: {
    textAlign: 'center',
  },
  header: {
    gap: 4,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  loadingText: {
    fontSize: 14,
    lineHeight: 20,
  },
  legacyLoggerName: {
    fontSize: 20,
    lineHeight: 26,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  metaTile: {
    borderRadius: 16,
    borderWidth: 1,
    flexBasis: '30%',
    flexGrow: 1,
    gap: 4,
    minHeight: 78,
    minWidth: 98,
    padding: 12,
  },
  metaValue: {
    fontSize: 16,
    lineHeight: 21,
  },
  nextWorkoutName: {
    fontSize: 19,
    lineHeight: 25,
  },
  nextWorkoutPanel: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 5,
    padding: 14,
  },
  nextUpCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  nextUpName: {
    fontSize: 24,
    lineHeight: 30,
  },
  screen: {
    flex: 1,
  },
  sectionHeader: {
    gap: 4,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  sectionTitle: {
    fontSize: 22,
    lineHeight: 28,
  },
  statusPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  summaryBlock: {
    gap: 6,
  },
  summaryMeta: {
    fontSize: 13,
    lineHeight: 18,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
  },
  supportingText: {
    fontSize: 14,
    lineHeight: 20,
  },
  templateCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 15,
    gap: 10,
  },
  templateCode: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  templateHeader: {
    gap: 4,
  },
  templateTitleBlock: {
    flex: 1,
    gap: 4,
  },
  templateName: {
    fontSize: 18,
    lineHeight: 24,
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
  },
});
