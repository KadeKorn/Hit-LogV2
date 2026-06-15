import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AtlasButton,
  AtlasCard,
  AtlasPill,
  AtlasText,
  CompassMark,
  RouteLine,
  StatTile,
  TopoBackground,
} from '@/components/atlas';
import type { WorkoutTemplateDetail } from '@/db/repositories/template-repository';
import { useAtlasTheme } from '@/hooks/use-atlas-theme';
import { analyzeTemplate } from '@/lib/template-analysis';
import type { ActiveRoutine, TemplateDay, WorkoutSession } from '@/types/domain';

type HomeScreenContentProps = {
  activeRoutine: ActiveRoutine | null;
  activeRoutineTemplate: WorkoutTemplateDetail | null;
  activeWorkoutSession: WorkoutSession | null;
  currentTemplateDay: TemplateDay | null;
  error: Error | null;
  isLoading: boolean;
  isStartingWorkout: boolean;
  onLibraryPress: () => void;
  onStartWorkout: () => void;
};

function formatToken(value: string | null | undefined): string | null {
  if (!value) return null;
  return value
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function HomeScreenContent({
  activeRoutine,
  activeRoutineTemplate,
  activeWorkoutSession,
  currentTemplateDay,
  error,
  isLoading,
  isStartingWorkout,
  onLibraryPress,
  onStartWorkout,
}: HomeScreenContentProps) {
  const { c, spacing, fonts } = useAtlasTheme();
  const { width } = useWindowDimensions();
  const cardInner = Math.round(width - spacing.screenX * 2 - spacing.cardPad * 2);

  const dateStr = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    []
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        <ActivityIndicator color={c.gold} />
        <AtlasText variant="label" tone="muted">
          Charting your map…
        </AtlasText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 }}>
        <AtlasText variant="title" tone="strong">
          Off the map
        </AtlasText>
        <AtlasText variant="body" tone="muted" style={{ textAlign: 'center' }}>
          Unable to load your training data right now.
        </AtlasText>
      </View>
    );
  }

  const analysis = activeRoutineTemplate ? analyzeTemplate(activeRoutineTemplate) : null;
  const currentDayDetail =
    activeRoutineTemplate && currentTemplateDay
      ? activeRoutineTemplate.days.find((day) => day.id === currentTemplateDay.id) ?? null
      : null;
  const exerciseCount = currentDayDetail?.prescriptions.length ?? 0;
  const plannedSets =
    currentDayDetail?.prescriptions.reduce((total, p) => total + p.sets, 0) ?? 0;

  const cycleLen = activeRoutineTemplate?.days.length ?? 0;
  const dayIdx = activeRoutine?.currentDayIndex ?? 0;
  const cyclePos = cycleLen ? dayIdx % cycleLen : 0;
  const progress = cycleLen ? cyclePos / cycleLen : 0;
  const pct = Math.round(progress * 100);

  const beginLabel = isStartingWorkout
    ? 'Opening…'
    : activeWorkoutSession
      ? 'Resume Session'
      : 'Begin Session';

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
            gap: spacing.gap,
          }}>
          {/* Brand row */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 2,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
              <CompassMark size={30} />
              <AtlasText style={{ fontFamily: fonts.display, fontSize: 19, color: c.text, letterSpacing: 0.2 }}>
                Lift Atlas
              </AtlasText>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              hitSlop={10}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: c.surface,
                borderWidth: 1,
                borderColor: c.cardBorder,
              }}>
              <Ionicons name="notifications-outline" size={20} color={c.muted} />
            </Pressable>
          </View>

          {/* Title + date */}
          <View style={{ gap: 3, marginBottom: 2 }}>
            <AtlasText variant="h1" tone="strong">
              Today
            </AtlasText>
            <AtlasText variant="label" tone="muted">
              {dateStr}
            </AtlasText>
          </View>

          {activeRoutine && activeRoutineTemplate ? (
            <>
              {/* ACTIVE ROUTE */}
              <AtlasCard active>
                <View
                  style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <AtlasText variant="micro" tone="gold">
                      Active Route
                    </AtlasText>
                    <AtlasText variant="cardTitle" tone="strong" style={{ marginTop: 6 }}>
                      {activeRoutineTemplate.name}
                    </AtlasText>
                    <AtlasText variant="label" tone="muted" style={{ marginTop: 2 }}>
                      {formatToken(activeRoutineTemplate.sourceType) ?? 'Custom'} route
                      {activeRoutineTemplate.splitType ? ` · ${formatToken(activeRoutineTemplate.splitType)}` : ''}
                    </AtlasText>
                  </View>
                  <AtlasPill label="Active" tone="gold" dot />
                </View>

                <View style={{ marginTop: 14 }}>
                  <RouteLine
                    width={cardInner}
                    height={92}
                    progress={progress}
                    seed={activeRoutineTemplate.id}
                    climbing
                    showSummit
                  />
                </View>

                <View style={{ marginTop: 12 }}>
                  <View style={{ height: 6, borderRadius: 3, backgroundColor: c.track, overflow: 'hidden' }}>
                    <View
                      style={{
                        height: '100%',
                        width: `${Math.max(4, pct)}%`,
                        backgroundColor: c.gold,
                        borderRadius: 3,
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 8,
                    }}>
                    <AtlasText variant="label" tone="muted">
                      {cycleLen ? `Cycle day ${cyclePos + 1} of ${cycleLen}` : 'Route in progress'}
                    </AtlasText>
                    <AtlasText variant="label" tone="gold">
                      {pct}%
                    </AtlasText>
                  </View>
                </View>
              </AtlasCard>

              {/* NEXT WAYPOINT */}
              <AtlasCard onPress={onStartWorkout} accessibilityLabel="Begin next waypoint">
                <AtlasText variant="micro" tone="gold">
                  Next Waypoint
                </AtlasText>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13, marginTop: 10 }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 13,
                      backgroundColor: c.goldTint,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <MaterialCommunityIcons name="target" size={22} color={c.gold} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <AtlasText variant="cardTitle" tone="strong">
                      {currentTemplateDay?.name ?? 'Day pending'}
                      {currentTemplateDay?.focus ? ` · ${formatToken(currentTemplateDay.focus)}` : ''}
                    </AtlasText>
                    <AtlasText variant="label" tone="muted" style={{ marginTop: 2 }}>
                      {exerciseCount} movements · {plannedSets} planned sets
                    </AtlasText>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={c.faint} />
                </View>
              </AtlasCard>

              {/* FOCUS */}
              <View>
                <AtlasText variant="micro" tone="faint" style={{ marginLeft: 2, marginBottom: 10 }}>
                  Focus
                </AtlasText>
                <View style={{ flexDirection: 'row', gap: spacing.gapSm }}>
                  <StatTile
                    bordered
                    align="left"
                    label="Goal"
                    value={formatToken(activeRoutineTemplate.goal) ?? '—'}
                    icon={<MaterialCommunityIcons name="target" size={20} color={c.gold} />}
                  />
                  <StatTile
                    bordered
                    align="left"
                    label="Split"
                    value={formatToken(activeRoutineTemplate.splitType) ?? '—'}
                    icon={<MaterialCommunityIcons name="dumbbell" size={20} color={c.steel} />}
                  />
                  <StatTile
                    bordered
                    align="left"
                    label="Volume"
                    value={analysis ? `${analysis.totalWorkingSets} sets` : '—'}
                    icon={<MaterialCommunityIcons name="chart-line-variant" size={20} color={c.gold} />}
                  />
                </View>
              </View>

              {/* BEGIN */}
              <View style={{ gap: 12, marginTop: 4 }}>
                <AtlasButton
                  label={beginLabel}
                  onPress={onStartWorkout}
                  disabled={isStartingWorkout}
                  leftIcon={<Ionicons name="compass-outline" size={20} color={c.onGold} />}
                />
                <Pressable
                  accessibilityRole="button"
                  onPress={onLibraryPress}
                  style={{ alignItems: 'center', paddingVertical: 4 }}>
                  <AtlasText variant="micro" tone="faint">
                    View Plan
                  </AtlasText>
                </Pressable>
              </View>
            </>
          ) : (
            <AtlasCard style={{ alignItems: 'center', gap: 12, paddingVertical: 28 }}>
              <CompassMark size={56} />
              <AtlasText variant="title" tone="strong" style={{ textAlign: 'center' }}>
                {activeRoutine ? 'Route unavailable' : 'No active route yet'}
              </AtlasText>
              <AtlasText variant="body" tone="muted" style={{ textAlign: 'center' }}>
                {activeRoutine
                  ? 'The selected route references a template that is no longer available.'
                  : 'Choose a route in the Atlas to start guided training toward your next summit.'}
              </AtlasText>
              <AtlasButton
                label="Open Atlas"
                onPress={onLibraryPress}
                leftIcon={<MaterialCommunityIcons name="map-outline" size={20} color={c.onGold} />}
                style={{ marginTop: 4 }}
              />
            </AtlasCard>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
