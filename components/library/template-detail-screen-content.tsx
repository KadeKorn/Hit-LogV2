import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import type {
  ExercisePrescriptionDetail,
  TemplateDayDetail,
  WorkoutTemplateDetail,
} from '@/db/repositories/template-repository';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { ActiveRoutine } from '@/types/domain';

type TemplateDetailScreenContentProps = {
  activeRoutine: ActiveRoutine | null;
  error: Error | null;
  isDuplicating: boolean;
  isLoading: boolean;
  isSettingActive: boolean;
  onBack: () => void;
  onDuplicate: () => void;
  onSetActive: () => void;
  template: WorkoutTemplateDetail | null;
};

type DetailPalette = {
  accent: string;
  border: string;
  muted: string;
  primaryButtonText: string;
  surface: string;
  surfaceMuted: string;
};

function getPalette(colorScheme: 'light' | 'dark'): DetailPalette {
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

function formatPrescription(prescription: ExercisePrescriptionDetail): string {
  const repRange =
    prescription.repRangeMin === prescription.repRangeMax
      ? `${prescription.repRangeMin} reps`
      : `${prescription.repRangeMin}-${prescription.repRangeMax} reps`;

  return `${prescription.sets} sets x ${repRange}`;
}

function DetailButton({
  accessibilityLabel,
  disabled,
  label,
  onPress,
  palette,
  variant,
}: {
  accessibilityLabel: string;
  disabled?: boolean;
  label: string;
  onPress: () => void;
  palette: DetailPalette;
  variant: 'primary' | 'secondary';
}) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: isPrimary ? palette.accent : 'transparent',
          borderColor: isPrimary ? palette.accent : palette.border,
          opacity: disabled ? 0.6 : 1,
        },
      ]}>
      <ThemedText
        style={[
          styles.buttonText,
          { color: isPrimary ? palette.primaryButtonText : palette.accent },
        ]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function TemplateDayCard({
  day,
  palette,
}: {
  day: TemplateDayDetail;
  palette: DetailPalette;
}) {
  return (
    <View style={[styles.dayCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      <View style={styles.dayHeader}>
        <ThemedText type="defaultSemiBold" style={styles.dayTitle}>
          {day.name}
        </ThemedText>
        {day.focus ? (
          <ThemedText style={[styles.dayFocus, { color: palette.muted }]}>
            {formatToken(day.focus)}
          </ThemedText>
        ) : null}
      </View>

      {day.prescriptions.length > 0 ? (
        <View style={styles.prescriptionList}>
          {day.prescriptions.map((prescription) => (
            <View key={prescription.id} style={styles.prescriptionRow}>
              <View style={styles.prescriptionTextBlock}>
                <ThemedText type="defaultSemiBold" style={styles.exerciseName}>
                  {prescription.exerciseName}
                </ThemedText>
                <ThemedText style={[styles.prescriptionMeta, { color: palette.muted }]}>
                  {formatPrescription(prescription)}
                  {prescription.progressionMethod
                    ? ` - ${formatToken(prescription.progressionMethod)}`
                    : ''}
                </ThemedText>
                {prescription.notes ? (
                  <ThemedText style={[styles.prescriptionNotes, { color: palette.muted }]}>
                    {prescription.notes}
                  </ThemedText>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <ThemedText style={[styles.emptyText, { color: palette.muted }]}>
          Planned exercises have not been filled in for this template yet.
        </ThemedText>
      )}
    </View>
  );
}

export function TemplateDetailScreenContent({
  activeRoutine,
  error,
  isDuplicating,
  isLoading,
  isSettingActive,
  onBack,
  onDuplicate,
  onSetActive,
  template,
}: TemplateDetailScreenContentProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const palette = getPalette(colorScheme);
  const theme = Colors[colorScheme];
  const isActiveRoutine = activeRoutine?.templateId === template?.id;
  const isPrebuilt = template?.sourceType === 'prebuilt';

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator color={palette.accent} />
        <ThemedText style={[styles.loadingText, { color: palette.muted }]}>
          Loading Template
        </ThemedText>
      </ThemedView>
    );
  }

  if (error || !template) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText type="subtitle">Template</ThemedText>
        <ThemedText style={[styles.errorText, { color: palette.muted }]}>
          Unable to load this template right now.
        </ThemedText>
        <DetailButton
          accessibilityLabel="Go back to Library"
          label="Back to Library"
          onPress={onBack}
          palette={palette}
          variant="secondary"
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}>
        <Pressable
          accessibilityLabel="Go back to Library"
          accessibilityRole="button"
          onPress={onBack}
          style={styles.backButton}>
          <ThemedText style={[styles.backButtonText, { color: palette.accent }]}>
            Back to Library
          </ThemedText>
        </Pressable>

        <View style={styles.header}>
          <ThemedText style={[styles.caption, { color: palette.muted }]}>
            {isPrebuilt ? 'Prebuilt Template' : 'Custom Template'}
          </ThemedText>
          <ThemedText type="title" style={styles.title}>
            {template.name}
          </ThemedText>
          {template.description ? (
            <ThemedText style={[styles.description, { color: theme.text }]}>
              {template.description}
            </ThemedText>
          ) : null}
        </View>

        <View style={styles.metaGrid}>
          <View
            style={[
              styles.metaTile,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <ThemedText style={[styles.metaLabel, { color: palette.muted }]}>Sessions</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.metaValue}>
              {template.days.length}
            </ThemedText>
          </View>
          <View
            style={[
              styles.metaTile,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <ThemedText style={[styles.metaLabel, { color: palette.muted }]}>Split</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.metaValue}>
              {formatToken(template.splitType) ?? 'Unspecified'}
            </ThemedText>
          </View>
          <View
            style={[
              styles.metaTile,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <ThemedText style={[styles.metaLabel, { color: palette.muted }]}>Goal</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.metaValue}>
              {formatToken(template.goal) ?? 'Unspecified'}
            </ThemedText>
          </View>
        </View>

        <View style={styles.actionGroup}>
          <DetailButton
            accessibilityLabel={
              isActiveRoutine ? 'This template is already active' : 'Set template as active routine'
            }
            disabled={isActiveRoutine || isSettingActive}
            label={
              isActiveRoutine
                ? 'Active Routine'
                : isSettingActive
                  ? 'Setting Active'
                  : 'Set Active'
            }
            onPress={onSetActive}
            palette={palette}
            variant="primary"
          />
          {isPrebuilt ? (
            <DetailButton
              accessibilityLabel="Duplicate prebuilt template into custom templates"
              disabled={isDuplicating}
              label={isDuplicating ? 'Duplicating' : 'Duplicate to Custom'}
              onPress={onDuplicate}
              palette={palette}
              variant="secondary"
            />
          ) : null}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Sessions
            </ThemedText>
            <ThemedText style={[styles.caption, { color: palette.muted }]}>
              Planned structure
            </ThemedText>
          </View>

          {template.days.length > 0 ? (
            <View style={styles.dayList}>
              {template.days.map((day) => (
                <TemplateDayCard key={day.id} day={day} palette={palette} />
              ))}
            </View>
          ) : (
            <View
              style={[
                styles.dayCard,
                { backgroundColor: palette.surfaceMuted, borderColor: palette.border },
              ]}>
              <ThemedText style={[styles.emptyText, { color: palette.muted }]}>
                This template does not have Phase 2C template days yet.
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  actionGroup: {
    gap: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  button: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
    textTransform: 'uppercase',
  },
  caption: {
    fontSize: 13,
    letterSpacing: 1,
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  content: {
    gap: 18,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  dayCard: {
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    padding: 15,
  },
  dayFocus: {
    fontSize: 13,
    lineHeight: 18,
  },
  dayHeader: {
    gap: 4,
  },
  dayList: {
    gap: 12,
  },
  dayTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  errorText: {
    textAlign: 'center',
  },
  exerciseName: {
    fontSize: 16,
    lineHeight: 22,
  },
  header: {
    gap: 6,
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
  prescriptionList: {
    gap: 12,
  },
  prescriptionMeta: {
    fontSize: 13,
    lineHeight: 18,
  },
  prescriptionNotes: {
    fontSize: 13,
    lineHeight: 18,
  },
  prescriptionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  prescriptionTextBlock: {
    flex: 1,
    gap: 3,
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
  title: {
    fontSize: 34,
    lineHeight: 38,
  },
});
