import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AtlasCard, AtlasPill, AtlasText, TopoBackground } from '@/components/atlas';
import type {
  CompletedSessionDetail,
  CompletedSessionExercise,
} from '@/db/repositories/v2-history-repository';
import { useAtlasTheme } from '@/hooks/use-atlas-theme';
import type { SetLog } from '@/types/domain';

type V2CompletedSessionScreenContentProps = {
  error: Error | null;
  isLoading: boolean;
  onBack: () => void;
  session: CompletedSessionDetail | null;
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

function formatEffort(exercise: CompletedSessionExercise): string | null {
  if (!exercise.effortRating && exercise.estimatedRir == null) {
    return null;
  }

  const effort = exercise.effortRating
    ? exercise.effortRating.charAt(0).toUpperCase() + exercise.effortRating.slice(1)
    : 'Effort';
  const rir = exercise.estimatedRir == null ? '' : ` · ${exercise.estimatedRir} RIR`;

  return `${effort}${rir}`;
}

function formatSet(set: SetLog): string {
  if (set.weight == null) {
    return `${set.reps} reps`;
  }

  return `${set.weight} x ${set.reps}`;
}

function BackToTrail({ onBack }: { onBack: () => void }) {
  const { c } = useAtlasTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Return to Trail"
      onPress={onBack}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingVertical: 4 }}>
      <Ionicons name="chevron-back" size={18} color={c.goldSoft} />
      <AtlasText variant="label" tone="gold">
        Back to Trail
      </AtlasText>
    </Pressable>
  );
}

function SetGroup({ label, sets }: { label: string; sets: SetLog[] }) {
  const { c, radius } = useAtlasTheme();

  if (sets.length === 0) {
    return null;
  }

  return (
    <View style={{ gap: 8 }}>
      <AtlasText variant="micro" tone="faint">
        {label}
      </AtlasText>
      {sets.map((set) => (
        <View
          key={set.id}
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            backgroundColor: c.field,
            borderColor: c.cardBorder,
            borderWidth: 1,
            borderRadius: radius.field,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}>
          <AtlasText variant="label" tone="muted">
            Set {set.setNumber}
          </AtlasText>
          <AtlasText variant="bodyStrong" tone="strong">
            {formatSet(set)}
          </AtlasText>
          {set.notes ? (
            <AtlasText variant="label" tone="muted" style={{ flexBasis: '100%' }}>
              {set.notes}
            </AtlasText>
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
  const { c, spacing, radius } = useAtlasTheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        <ActivityIndicator color={c.gold} />
        <AtlasText variant="label" tone="muted">
          Loading logged session…
        </AtlasText>
      </View>
    );
  }

  if (error || !session) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 }}>
        <AtlasText variant="title" tone="strong">
          Session unavailable
        </AtlasText>
        <AtlasText variant="body" tone="muted" style={{ textAlign: 'center' }}>
          Unable to load this logged session.
        </AtlasText>
        <BackToTrail onBack={onBack} />
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
            gap: spacing.gap,
          }}>
          <BackToTrail onBack={onBack} />

          <View style={{ gap: 4 }}>
            <AtlasText variant="micro" tone="gold">
              Logged Session
            </AtlasText>
            <AtlasText variant="h1" tone="strong">
              {session.templateDayName ?? 'Workout'}
            </AtlasText>
            <AtlasText variant="label" tone="muted">
              {session.templateName ?? 'V2 workout'} · {formatDate(session.completedAt)}
            </AtlasText>
          </View>

          {session.notes ? (
            <AtlasCard style={{ gap: 6 }}>
              <AtlasText variant="micro" tone="gold">
                Session Notes
              </AtlasText>
              <AtlasText variant="body" tone="default">
                {session.notes}
              </AtlasText>
            </AtlasCard>
          ) : null}

          <View style={{ gap: 12 }}>
            {session.exercises.map((exercise) => {
              const warmupSets = exercise.setLogs.filter((set) => set.isWarmup);
              const workingSets = exercise.setLogs.filter((set) => !set.isWarmup);
              const effort = formatEffort(exercise);

              return (
                <AtlasCard key={exercise.id} style={{ gap: 12 }}>
                  <View
                    style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                    <AtlasText variant="cardTitle" tone="strong" style={{ flex: 1 }}>
                      {exercise.exerciseName}
                    </AtlasText>
                    {exercise.isSubstitution ? (
                      <AtlasPill label="Substitution" tone="gold" dot />
                    ) : null}
                  </View>
                  {effort ? (
                    <AtlasText variant="label" tone="muted">
                      {effort}
                    </AtlasText>
                  ) : null}

                  <SetGroup label="Warmup Sets" sets={warmupSets} />
                  <SetGroup label="Working Sets" sets={workingSets} />

                  {warmupSets.length === 0 && workingSets.length === 0 ? (
                    <AtlasText variant="body" tone="muted">
                      No completed sets were logged.
                    </AtlasText>
                  ) : null}

                  {exercise.notes ? (
                    <View
                      style={{
                        backgroundColor: c.field,
                        borderColor: c.cardBorder,
                        borderWidth: 1,
                        borderRadius: radius.sm,
                        padding: 12,
                        gap: 6,
                      }}>
                      <AtlasText variant="micro" tone="faint">
                        Exercise Notes
                      </AtlasText>
                      <AtlasText variant="body" tone="default">
                        {exercise.notes}
                      </AtlasText>
                    </View>
                  ) : null}
                </AtlasCard>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
