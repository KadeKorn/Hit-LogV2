import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, ScrollView, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AtlasCard, AtlasText, RouteLine, TopoBackground } from '@/components/atlas';
import { AtlasSpacing } from '@/constants/atlas-theme';
import type { WorkoutTemplateListItem } from '@/db/repositories/template-repository';
import { useAtlasTheme } from '@/hooks/use-atlas-theme';
import type { ActiveRoutine } from '@/types/domain';

type LibraryScreenContentProps = {
  activeRoutine: ActiveRoutine | null;
  customTemplates: WorkoutTemplateListItem[];
  error: Error | null;
  isLoading: boolean;
  pausedTemplateIds: string[];
  onTemplatePress: (templateId: string) => void;
  prebuiltTemplates: WorkoutTemplateListItem[];
};

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

function getDaySummary(template: WorkoutTemplateListItem): string {
  if (template.dayCount === 1) {
    return '1 session';
  }

  if (template.dayCount > 1) {
    return `${template.dayCount} sessions`;
  }

  return 'Session structure pending';
}

function RouteCard({
  activeTemplateId,
  pausedTemplateIds,
  cardInner,
  onPress,
  template,
}: {
  activeTemplateId: string | null;
  pausedTemplateIds: string[];
  cardInner: number;
  onPress: (templateId: string) => void;
  template: WorkoutTemplateListItem;
}) {
  const { c } = useAtlasTheme();
  const isActive = activeTemplateId === template.id;
  const isPaused = pausedTemplateIds.includes(template.id);
  const splitLabel = formatToken(template.splitType);
  const goalLabel = formatToken(template.goal);
  const meta = [getDaySummary(template), splitLabel ?? goalLabel].filter(Boolean).join(' · ');

  return (
    <AtlasCard
      active={isActive}
      onPress={() => onPress(template.id)}
      accessibilityLabel={`Open ${template.name} route details`}
      style={{ gap: 12 }}>
      {isActive ? (
        <AtlasText variant="micro" tone="gold">
          Active Route
        </AtlasText>
      ) : isPaused ? (
        <AtlasText variant="micro" tone="gold">
          Saved Route · Ready to Resume
        </AtlasText>
      ) : null}

      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <AtlasText variant="cardTitle" tone="strong">
            {template.name}
          </AtlasText>
          {meta ? (
            <AtlasText variant="label" tone="muted" style={{ marginTop: 2 }}>
              {meta}
            </AtlasText>
          ) : null}
        </View>
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isActive ? c.goldTint : c.steelTint,
            borderWidth: 1,
            borderColor: isActive ? c.goldBorder : c.cardBorder,
          }}>
          <MaterialCommunityIcons name="map-marker" size={18} color={isActive ? c.gold : c.steel} />
        </View>
      </View>

      <RouteLine
        width={cardInner}
        height={58}
        seed={template.id}
        lineColor={isActive ? c.gold : c.steel}
        fill
        showSummit={false}
      />

      {template.description ? (
        <AtlasText variant="label" tone="muted" numberOfLines={2}>
          {template.description}
        </AtlasText>
      ) : null}
    </AtlasCard>
  );
}

function RouteSection({
  activeTemplateId,
  pausedTemplateIds,
  cardInner,
  emptyText,
  onTemplatePress,
  templates,
  title,
}: {
  activeTemplateId: string | null;
  pausedTemplateIds: string[];
  cardInner: number;
  emptyText: string;
  onTemplatePress: (templateId: string) => void;
  templates: WorkoutTemplateListItem[];
  title: string;
}) {
  return (
    <View style={{ gap: 12 }}>
      <View
        style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <AtlasText variant="title" tone="strong">
          {title}
        </AtlasText>
        <AtlasText variant="label" tone="muted">
          {templates.length} {templates.length === 1 ? 'route' : 'routes'}
        </AtlasText>
      </View>

      {templates.length > 0 ? (
        <View style={{ gap: 12 }}>
          {templates.map((template) => (
            <RouteCard
              key={template.id}
              activeTemplateId={activeTemplateId}
              pausedTemplateIds={pausedTemplateIds}
              cardInner={cardInner}
              onPress={onTemplatePress}
              template={template}
            />
          ))}
        </View>
      ) : (
        <AtlasCard variant="field">
          <AtlasText variant="body" tone="muted">
            {emptyText}
          </AtlasText>
        </AtlasCard>
      )}
    </View>
  );
}

export function LibraryScreenContent({
  activeRoutine,
  customTemplates,
  error,
  isLoading,
  pausedTemplateIds,
  onTemplatePress,
  prebuiltTemplates,
}: LibraryScreenContentProps) {
  const { c, spacing } = useAtlasTheme();
  const { width } = useWindowDimensions();
  const cardInner = Math.round(width - AtlasSpacing.screenX * 2 - AtlasSpacing.cardPad * 2);
  const activeTemplateId = activeRoutine?.templateId ?? null;

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        <ActivityIndicator color={c.gold} />
        <AtlasText variant="label" tone="muted">
          Loading the Atlas…
        </AtlasText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 10 }}>
        <AtlasText variant="title" tone="strong">
          Atlas unavailable
        </AtlasText>
        <AtlasText variant="body" tone="muted" style={{ textAlign: 'center' }}>
          Unable to load your routes right now.
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
              Library
            </AtlasText>
            <AtlasText variant="h1" tone="strong">
              Atlas
            </AtlasText>
            <AtlasText variant="body" tone="muted" style={{ marginTop: 2 }}>
              Choose a route to train, or duplicate a prebuilt plan into your own routes.
            </AtlasText>
          </View>

          <RouteSection
            activeTemplateId={activeTemplateId}
            cardInner={cardInner}
            emptyText="Prebuilt routes will appear here once the local route seeds are available."
            onTemplatePress={onTemplatePress}
            pausedTemplateIds={pausedTemplateIds}
            templates={prebuiltTemplates}
            title="Training Routes"
          />

          <RouteSection
            activeTemplateId={activeTemplateId}
            cardInner={cardInner}
            emptyText="Duplicate a prebuilt route to start one of your own."
            onTemplatePress={onTemplatePress}
            pausedTemplateIds={pausedTemplateIds}
            templates={customTemplates}
            title="Your Routes"
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
