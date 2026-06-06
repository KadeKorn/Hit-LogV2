import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import type { WorkoutTemplateListItem } from '@/db/repositories/template-repository';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { ActiveRoutine } from '@/types/domain';

type LibraryScreenContentProps = {
  activeRoutine: ActiveRoutine | null;
  customTemplates: WorkoutTemplateListItem[];
  error: Error | null;
  isLoading: boolean;
  onTemplatePress: (templateId: string) => void;
  prebuiltTemplates: WorkoutTemplateListItem[];
};

type LibraryPalette = {
  accent: string;
  border: string;
  muted: string;
  surface: string;
  surfaceMuted: string;
};

function getPalette(colorScheme: 'light' | 'dark'): LibraryPalette {
  if (colorScheme === 'light') {
    return {
      surface: '#F3F5F7',
      surfaceMuted: '#E8EDF1',
      border: '#D5DDE5',
      muted: '#5E6A75',
      accent: '#0A7EA4',
    };
  }

  return {
    surface: '#171B20',
    surfaceMuted: '#11151A',
    border: '#2A3138',
    muted: '#93A0AB',
    accent: '#D7F75B',
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

function getDaySummary(template: WorkoutTemplateListItem): string {
  if (template.dayCount === 1) {
    return '1 session';
  }

  if (template.dayCount > 1) {
    return `${template.dayCount} sessions`;
  }

  return 'Session structure pending';
}

function TemplateCard({
  activeTemplateId,
  onPress,
  palette,
  template,
}: {
  activeTemplateId: string | null;
  onPress: (templateId: string) => void;
  palette: LibraryPalette;
  template: WorkoutTemplateListItem;
}) {
  const splitLabel = formatToken(template.splitType);
  const goalLabel = formatToken(template.goal);
  const isActiveRoutine = activeTemplateId === template.id;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${template.name} template details`}
      onPress={() => onPress(template.id)}
      style={[
        styles.templateCard,
        {
          backgroundColor: palette.surface,
          borderColor: isActiveRoutine ? palette.accent : palette.border,
        },
      ]}>
      <View style={styles.templateHeader}>
        <View style={styles.templateTitleBlock}>
          <ThemedText type="defaultSemiBold" style={styles.templateName}>
            {template.name}
          </ThemedText>
          <ThemedText style={[styles.templateMeta, { color: palette.muted }]}>
            {[getDaySummary(template), splitLabel ?? goalLabel].filter(Boolean).join(' - ')}
          </ThemedText>
        </View>
        {isActiveRoutine ? (
          <View style={[styles.activePill, { borderColor: palette.accent }]}>
            <ThemedText style={[styles.activePillText, { color: palette.accent }]}>
              Active
            </ThemedText>
          </View>
        ) : null}
      </View>

      {template.description ? (
        <ThemedText style={[styles.description, { color: palette.muted }]}>
          {template.description}
        </ThemedText>
      ) : null}
    </Pressable>
  );
}

function TemplateSection({
  activeTemplateId,
  emptyText,
  onTemplatePress,
  palette,
  templates,
  title,
}: {
  activeTemplateId: string | null;
  emptyText: string;
  onTemplatePress: (templateId: string) => void;
  palette: LibraryPalette;
  templates: WorkoutTemplateListItem[];
  title: string;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {title}
        </ThemedText>
        <ThemedText style={[styles.caption, { color: palette.muted }]}>
          {templates.length} {templates.length === 1 ? 'template' : 'templates'}
        </ThemedText>
      </View>

      {templates.length > 0 ? (
        <View style={styles.cardList}>
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              activeTemplateId={activeTemplateId}
              onPress={onTemplatePress}
              palette={palette}
              template={template}
            />
          ))}
        </View>
      ) : (
        <View
          style={[
            styles.emptyCard,
            { backgroundColor: palette.surfaceMuted, borderColor: palette.border },
          ]}>
          <ThemedText style={[styles.description, { color: palette.muted }]}>
            {emptyText}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

export function LibraryScreenContent({
  activeRoutine,
  customTemplates,
  error,
  isLoading,
  onTemplatePress,
  prebuiltTemplates,
}: LibraryScreenContentProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const palette = getPalette(colorScheme);
  const theme = Colors[colorScheme];
  const activeTemplateId = activeRoutine?.templateId ?? null;

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator color={palette.accent} />
        <ThemedText style={[styles.loadingText, { color: palette.muted }]}>
          Loading Library
        </ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText type="subtitle">Library</ThemedText>
        <ThemedText style={[styles.errorText, { color: palette.muted }]}>
          Unable to load template library right now.
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
          <ThemedText style={[styles.caption, { color: palette.muted }]}>Library</ThemedText>
          <ThemedText type="title" style={styles.title}>
            Templates
          </ThemedText>
          <ThemedText style={[styles.intro, { color: theme.text }]}>
            Choose a reusable routine before training, or duplicate a prebuilt plan into your
            custom library.
          </ThemedText>
        </View>

        <TemplateSection
          activeTemplateId={activeTemplateId}
          emptyText="Prebuilt routines will appear here after the local template seeds are available."
          onTemplatePress={onTemplatePress}
          palette={palette}
          templates={prebuiltTemplates}
          title="Prebuilt Templates"
        />

        <TemplateSection
          activeTemplateId={activeTemplateId}
          emptyText="Duplicate a prebuilt routine to start a custom template."
          onTemplatePress={onTemplatePress}
          palette={palette}
          templates={customTemplates}
          title="Custom Templates"
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  activePill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activePillText: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  caption: {
    fontSize: 13,
    letterSpacing: 1,
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  cardList: {
    gap: 12,
  },
  content: {
    gap: 22,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  errorText: {
    textAlign: 'center',
  },
  header: {
    gap: 6,
  },
  intro: {
    fontSize: 15,
    lineHeight: 22,
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
  screen: {
    flex: 1,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 22,
    lineHeight: 28,
  },
  templateCard: {
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
    padding: 15,
  },
  templateHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  templateMeta: {
    flexShrink: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  templateName: {
    flexShrink: 1,
    fontSize: 18,
    lineHeight: 24,
  },
  templateTitleBlock: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
  },
});
