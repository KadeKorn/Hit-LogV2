import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkoutJsonExport } from '@/hooks/use-workout-json-export';

type ExplorePalette = {
  accent: string;
  border: string;
  danger: string;
  muted: string;
  surface: string;
  surfaceMuted: string;
};

function getPalette(colorScheme: 'light' | 'dark'): ExplorePalette {
  if (colorScheme === 'light') {
    return {
      surface: '#F3F5F7',
      surfaceMuted: '#E8EDF1',
      border: '#D5DDE5',
      muted: '#5E6A75',
      accent: '#0A7EA4',
      danger: '#B42318',
    };
  }

  return {
    surface: '#171B20',
    surfaceMuted: '#11151A',
    border: '#2A3138',
    muted: '#93A0AB',
    accent: '#D7F75B',
    danger: '#FF9A8A',
  };
}

type ExportBackupCardProps = {
  eyebrow?: string;
  title?: string;
};

export function ExportBackupCard({
  eyebrow = 'Explore',
  title = 'Backup',
}: ExportBackupCardProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const theme = Colors[colorScheme];
  const palette = getPalette(colorScheme);
  const {
    csvError,
    csvResult,
    csvStatus,
    exportJsonBackup,
    exportWorkoutCsv,
    isExportingCsv,
    isExportingJson,
    jsonError,
    jsonResult,
    jsonStatus,
  } = useWorkoutJsonExport();

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic">
        <View style={styles.header}>
          <ThemedText style={[styles.caption, { color: palette.muted }]}>{eyebrow}</ThemedText>
          <ThemedText type="title" style={styles.title}>
            {title}
          </ThemedText>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrap}>
              <IconSymbol name="square.and.arrow.up" size={24} color={palette.accent} />
            </View>
            <View style={styles.cardTitleBlock}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Export JSON backup
              </ThemedText>
              <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
                Templates, custom exercises, active routine state, and completed V2 history.
              </ThemedText>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Export workout data as JSON"
            disabled={isExportingJson}
            onPress={exportJsonBackup}
            style={({ pressed }) => [
              styles.exportButton,
              {
                backgroundColor: palette.accent,
                opacity: isExportingJson ? 0.7 : pressed ? 0.84 : 1,
              },
            ]}>
            {isExportingJson ? (
              <ActivityIndicator color={colorScheme === 'light' ? '#FFFFFF' : '#11151A'} />
            ) : (
              <IconSymbol
                name="square.and.arrow.up"
                size={20}
                color={colorScheme === 'light' ? '#FFFFFF' : '#11151A'}
              />
            )}
            <ThemedText
              type="defaultSemiBold"
              style={[
                styles.exportButtonText,
                { color: colorScheme === 'light' ? '#FFFFFF' : '#11151A' },
              ]}>
              {isExportingJson ? 'Exporting' : 'Export JSON Backup'}
            </ThemedText>
          </Pressable>

          {jsonStatus === 'success' && jsonResult ? (
            <View
              style={[
                styles.statusPanel,
                {
                  backgroundColor: palette.surfaceMuted,
                  borderColor: palette.border,
                },
              ]}>
              <ThemedText type="defaultSemiBold" style={styles.statusTitle}>
                Export ready
              </ThemedText>
              <ThemedText style={[styles.statusText, { color: palette.muted }]}>
                {jsonResult.fileName}
              </ThemedText>
              <View style={styles.countGrid}>
                <ThemedText style={[styles.countText, { color: theme.text }]}>
                  Export version: {jsonResult.counts.exportVersion}
                </ThemedText>
                <ThemedText style={[styles.countText, { color: theme.text }]}>
                  Schema version: {jsonResult.counts.schemaVersion}
                </ThemedText>
                <ThemedText style={[styles.countText, { color: theme.text }]}>
                  Templates: {jsonResult.counts.templateCount}
                </ThemedText>
                <ThemedText style={[styles.countText, { color: theme.text }]}>
                  Custom templates: {jsonResult.counts.customTemplateCount}
                </ThemedText>
                <ThemedText style={[styles.countText, { color: theme.text }]}>
                  Exercise definitions: {jsonResult.counts.exerciseDefinitionCount}
                </ThemedText>
                <ThemedText style={[styles.countText, { color: theme.text }]}>
                  Custom exercises: {jsonResult.counts.customExerciseCount}
                </ThemedText>
                <ThemedText style={[styles.countText, { color: theme.text }]}>
                  Completed workouts: {jsonResult.counts.completedWorkoutCount}
                </ThemedText>
                <ThemedText style={[styles.countText, { color: theme.text }]}>
                  Set logs: {jsonResult.counts.setLogCount}
                </ThemedText>
                <ThemedText style={[styles.countText, { color: theme.text }]}>
                  Active routine present: {jsonResult.counts.activeRoutinePresent ? 'yes' : 'no'}
                </ThemedText>
              </View>
            </View>
          ) : null}

          {jsonStatus === 'error' && jsonError ? (
            <View
              style={[
                styles.statusPanel,
                {
                  backgroundColor: palette.surfaceMuted,
                  borderColor: palette.border,
                },
              ]}>
              <ThemedText
                type="defaultSemiBold"
                style={[styles.statusTitle, { color: palette.danger }]}>
                Export failed
              </ThemedText>
              <ThemedText style={[styles.statusText, { color: palette.muted }]}>
                {jsonError.message}
              </ThemedText>
            </View>
          ) : null}
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrap}>
              <IconSymbol name="square.and.arrow.up" size={24} color={palette.accent} />
            </View>
            <View style={styles.cardTitleBlock}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Export workout CSV
              </ThemedText>
              <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
                Readable completed workout rows for review outside the app.
              </ThemedText>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Export completed workout history as CSV"
            disabled={isExportingCsv}
            onPress={exportWorkoutCsv}
            style={({ pressed }) => [
              styles.secondaryButton,
              {
                borderColor: palette.border,
                backgroundColor: palette.surfaceMuted,
                opacity: isExportingCsv ? 0.7 : pressed ? 0.84 : 1,
              },
            ]}>
            {isExportingCsv ? (
              <ActivityIndicator color={theme.text} />
            ) : (
              <IconSymbol name="square.and.arrow.up" size={20} color={theme.text} />
            )}
            <ThemedText type="defaultSemiBold" style={[styles.secondaryButtonText, { color: theme.text }]}>
              {isExportingCsv ? 'Exporting' : 'Export CSV'}
            </ThemedText>
          </Pressable>

          {csvStatus === 'success' && csvResult ? (
            <View
              style={[
                styles.statusPanel,
                {
                  backgroundColor: palette.surfaceMuted,
                  borderColor: palette.border,
                },
              ]}>
              <ThemedText type="defaultSemiBold" style={styles.statusTitle}>
                CSV ready
              </ThemedText>
              <ThemedText style={[styles.statusText, { color: palette.muted }]}>
                {csvResult.fileName}
              </ThemedText>
              <ThemedText style={[styles.countText, { color: theme.text }]}>
                Rows: {csvResult.rowCount}
              </ThemedText>
            </View>
          ) : null}

          {csvStatus === 'error' && csvError ? (
            <View
              style={[
                styles.statusPanel,
                {
                  backgroundColor: palette.surfaceMuted,
                  borderColor: palette.border,
                },
              ]}>
              <ThemedText
                type="defaultSemiBold"
                style={[styles.statusTitle, { color: palette.danger }]}>
                CSV export failed
              </ThemedText>
              <ThemedText style={[styles.statusText, { color: palette.muted }]}>
                {csvError.message}
              </ThemedText>
            </View>
          ) : null}
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrap}>
              <IconSymbol name="clock.arrow.circlepath" size={24} color={palette.danger} />
            </View>
            <View style={styles.cardTitleBlock}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Import JSON backup
              </ThemedText>
              <ThemedText style={[styles.supportingText, { color: palette.muted }]}>
                Restore is deferred until a transaction-safe full replacement flow is added.
              </ThemedText>
            </View>
          </View>

          <View
            style={[
              styles.statusPanel,
              {
                backgroundColor: palette.surfaceMuted,
                borderColor: palette.border,
              },
            ]}>
            <ThemedText type="defaultSemiBold" style={[styles.statusTitle, { color: palette.danger }]}>
              Import disabled for field-test safety
            </ThemedText>
            <ThemedText style={[styles.statusText, { color: palette.muted }]}>
              JSON backups can be exported and inspected now. Destructive restore is intentionally unavailable in this phase.
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  caption: {
    fontSize: 13,
    lineHeight: 18,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 22,
    lineHeight: 28,
  },
  cardTitleBlock: {
    flex: 1,
    gap: 3,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 16,
  },
  countGrid: {
    gap: 4,
  },
  countText: {
    fontSize: 14,
    lineHeight: 20,
  },
  exportButton: {
    minHeight: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
  },
  exportButtonText: {
    fontSize: 15,
    lineHeight: 20,
  },
  header: {
    gap: 4,
  },
  iconWrap: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screen: {
    flex: 1,
  },
  secondaryButton: {
    minHeight: 50,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
  },
  secondaryButtonText: {
    fontSize: 15,
    lineHeight: 20,
  },
  statusPanel: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    lineHeight: 20,
  },
  statusTitle: {
    fontSize: 16,
    lineHeight: 22,
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
