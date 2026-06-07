import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import type {
  ExercisePrescriptionDetail,
  TemplateDayDetail,
  WorkoutTemplateDetail,
} from '@/db/repositories/template-repository';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { analyzeTemplate, type TemplateAnalysisResult } from '@/lib/template-analysis';
import type { ActiveRoutine, ExerciseDefinition, ProgressionMethod } from '@/types/domain';

type TemplateMutationResult = Promise<WorkoutTemplateDetail>;

type PrescriptionFormInput = {
  exerciseDefinitionId: string;
  notes: string | null;
  progressionMethod: ProgressionMethod;
  repRangeMax: number;
  repRangeMin: number;
  restSeconds: number | null;
  sets: number;
};

type TemplateDetailScreenContentProps = {
  activeRoutine: ActiveRoutine | null;
  error: Error | null;
  exerciseDefinitions: ExerciseDefinition[];
  isDuplicating: boolean;
  isLoading: boolean;
  isSaving: boolean;
  isSettingActive: boolean;
  mutationError: Error | null;
  onAddExercisePrescription: (
    templateDayId: string,
    input: PrescriptionFormInput
  ) => TemplateMutationResult;
  onAddTemplateDay: (input: { focus: string | null; name: string }) => TemplateMutationResult;
  onBack: () => void;
  onDeleteExercisePrescription: (prescriptionId: string) => TemplateMutationResult;
  onDeleteTemplateDay: (templateDayId: string) => TemplateMutationResult;
  onDuplicate: () => void;
  onMoveExercisePrescription: (
    prescriptionId: string,
    direction: -1 | 1
  ) => TemplateMutationResult;
  onMoveTemplateDay: (templateDayId: string, direction: -1 | 1) => TemplateMutationResult;
  onSetActive: () => void;
  onUpdateExercisePrescription: (
    prescriptionId: string,
    input: PrescriptionFormInput
  ) => TemplateMutationResult;
  onUpdateMetadata: (input: {
    description: string | null;
    goal: string | null;
    name: string;
    splitType: string | null;
  }) => Promise<void>;
  onUpdateTemplateDay: (
    templateDayId: string,
    input: { focus: string | null; name: string }
  ) => TemplateMutationResult;
  template: WorkoutTemplateDetail | null;
};

type DetailPalette = {
  accent: string;
  border: string;
  destructive: string;
  muted: string;
  primaryButtonText: string;
  surface: string;
  surfaceMuted: string;
};

const PROGRESSION_METHODS: ProgressionMethod[] = [
  'double_progression',
  'top_set_progression',
  'rep_progression',
  'manual',
  'none',
];

const PROGRESSION_HELP_TEXT: Record<ProgressionMethod, string> = {
  double_progression:
    'Add reps within the target range first, then increase weight after all working sets hit the top of the range.',
  top_set_progression: 'Progress the main top set first, then use back-off work to support it.',
  rep_progression: 'Add reps over time before changing load. Useful for isolation lifts.',
  manual: 'No automatic recommendation. You decide the next target.',
  none: 'No progression target. Useful for warmups, technique work, or non-progressive accessories.',
};

function getPalette(colorScheme: 'light' | 'dark'): DetailPalette {
  if (colorScheme === 'light') {
    return {
      surface: '#F3F5F7',
      surfaceMuted: '#E8EDF1',
      border: '#D5DDE5',
      muted: '#5E6A75',
      accent: '#0A7EA4',
      destructive: '#B42318',
      primaryButtonText: '#FFFFFF',
    };
  }

  return {
    surface: '#171B20',
    surfaceMuted: '#11151A',
    border: '#2A3138',
    muted: '#93A0AB',
    accent: '#D7F75B',
    destructive: '#FF8A7A',
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

function groupExerciseDefinitionsByMuscleGroup(
  exerciseDefinitions: ExerciseDefinition[]
): { exercises: ExerciseDefinition[]; muscleGroup: string }[] {
  const groups = new Map<string, ExerciseDefinition[]>();

  for (const exerciseDefinition of exerciseDefinitions) {
    const exercises = groups.get(exerciseDefinition.primaryMuscleGroup) ?? [];
    exercises.push(exerciseDefinition);
    groups.set(exerciseDefinition.primaryMuscleGroup, exercises);
  }

  return Array.from(groups.entries())
    .map(([muscleGroup, exercises]) => ({
      muscleGroup,
      exercises: exercises.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => {
      const firstLabel = formatToken(a.muscleGroup) ?? a.muscleGroup;
      const secondLabel = formatToken(b.muscleGroup) ?? b.muscleGroup;
      return firstLabel.localeCompare(secondLabel);
    });
}

function formatPrescription(prescription: ExercisePrescriptionDetail): string {
  const repRange =
    prescription.repRangeMin === prescription.repRangeMax
      ? `${prescription.repRangeMin} reps`
      : `${prescription.repRangeMin}-${prescription.repRangeMax} reps`;
  const restText = prescription.restSeconds ? ` - ${prescription.restSeconds}s rest` : '';

  return `${prescription.sets} sets x ${repRange}${restText}`;
}

function parsePositiveInteger(value: string, fallback: number): number {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

function parseOptionalRestSeconds(value: string): number | null {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const parsedValue = Number.parseInt(trimmedValue, 10);
  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : null;
}

function getExerciseDefinition(
  exerciseDefinitions: ExerciseDefinition[],
  exerciseDefinitionId: string
): ExerciseDefinition | null {
  return (
    exerciseDefinitions.find((exerciseDefinition) => exerciseDefinition.id === exerciseDefinitionId) ??
    null
  );
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
  variant: 'primary' | 'secondary' | 'danger';
}) {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  const borderColor = isDanger ? palette.destructive : isPrimary ? palette.accent : palette.border;
  const textColor = isPrimary
    ? palette.primaryButtonText
    : isDanger
      ? palette.destructive
      : palette.accent;

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
          borderColor,
          opacity: disabled ? 0.6 : 1,
        },
      ]}>
      <ThemedText style={[styles.buttonText, { color: textColor }]}>{label}</ThemedText>
    </Pressable>
  );
}

function SmallButton({
  disabled,
  label,
  onPress,
  palette,
  tone = 'accent',
}: {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  palette: DetailPalette;
  tone?: 'accent' | 'danger' | 'muted';
}) {
  const color =
    tone === 'danger' ? palette.destructive : tone === 'muted' ? palette.muted : palette.accent;

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.smallButton, { borderColor: color, opacity: disabled ? 0.5 : 1 }]}>
      <ThemedText style={[styles.smallButtonText, { color }]}>{label}</ThemedText>
    </Pressable>
  );
}

function LabeledInput({
  label,
  multiline,
  onChangeText,
  palette,
  placeholder,
  value,
}: {
  label: string;
  multiline?: boolean;
  onChangeText: (value: string) => void;
  palette: DetailPalette;
  placeholder: string;
  value: string;
}) {
  const colorScheme = useColorScheme() ?? 'dark';
  const theme = Colors[colorScheme];

  return (
    <View style={styles.inputGroup}>
      <ThemedText style={[styles.inputLabel, { color: palette.muted }]}>{label}</ThemedText>
      <TextInput
        accessibilityLabel={label}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.muted}
        style={[
          multiline ? styles.textArea : styles.textInput,
          { backgroundColor: palette.surfaceMuted, borderColor: palette.border, color: theme.text },
        ]}
        value={value}
      />
    </View>
  );
}

function MethodSelector({
  method,
  onChange,
  palette,
}: {
  method: ProgressionMethod;
  onChange: (method: ProgressionMethod) => void;
  palette: DetailPalette;
}) {
  return (
    <View style={styles.inputGroup}>
      <ThemedText style={[styles.inputLabel, { color: palette.muted }]}>Progression</ThemedText>
      <View style={styles.chipGrid}>
        {PROGRESSION_METHODS.map((progressionMethod) => {
          const isSelected = progressionMethod === method;

          return (
            <Pressable
              accessibilityLabel={`Use ${formatToken(progressionMethod)} progression`}
              accessibilityRole="button"
              key={progressionMethod}
              onPress={() => onChange(progressionMethod)}
              style={[
                styles.choiceChip,
                {
                  backgroundColor: isSelected ? palette.accent : 'transparent',
                  borderColor: isSelected ? palette.accent : palette.border,
                },
              ]}>
              <ThemedText
                style={[
                  styles.choiceChipText,
                  { color: isSelected ? palette.primaryButtonText : palette.accent },
                ]}>
                {formatToken(progressionMethod)}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
      <View style={[styles.helpCard, { backgroundColor: palette.surfaceMuted, borderColor: palette.border }]}>
        <ThemedText style={[styles.helpTitle, { color: palette.accent }]}>
          {formatToken(method)}
        </ThemedText>
        <ThemedText style={[styles.helpText, { color: palette.muted }]}>
          {PROGRESSION_HELP_TEXT[method]}
        </ThemedText>
      </View>
    </View>
  );
}

function ExerciseSelector({
  exerciseDefinitions,
  onChange,
  palette,
  selectedExerciseDefinitionId,
}: {
  exerciseDefinitions: ExerciseDefinition[];
  onChange: (exerciseDefinitionId: string) => void;
  palette: DetailPalette;
  selectedExerciseDefinitionId: string;
}) {
  const exerciseGroups = useMemo(
    () => groupExerciseDefinitionsByMuscleGroup(exerciseDefinitions),
    [exerciseDefinitions]
  );

  return (
    <View style={styles.inputGroup}>
      <ThemedText style={[styles.inputLabel, { color: palette.muted }]}>Exercise</ThemedText>
      <ScrollView nestedScrollEnabled style={styles.exerciseChoiceScroller}>
        <View style={styles.exerciseChoiceList}>
          {exerciseGroups.map((group) => (
            <View key={group.muscleGroup} style={styles.exerciseGroup}>
              <ThemedText style={[styles.exerciseGroupLabel, { color: palette.muted }]}>
                {formatToken(group.muscleGroup)}
              </ThemedText>
              {group.exercises.map((exerciseDefinition) => {
                const isSelected = exerciseDefinition.id === selectedExerciseDefinitionId;

                return (
                  <Pressable
                    accessibilityLabel={`Choose ${exerciseDefinition.name}`}
                    accessibilityRole="button"
                    key={exerciseDefinition.id}
                    onPress={() => onChange(exerciseDefinition.id)}
                    style={[
                      styles.exerciseChoice,
                      {
                        backgroundColor: isSelected ? palette.surface : 'transparent',
                        borderColor: isSelected ? palette.accent : palette.border,
                      },
                    ]}>
                    <ThemedText type="defaultSemiBold" style={styles.exerciseChoiceName}>
                      {exerciseDefinition.name}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function PrescriptionEditor({
  exerciseDefinitions,
  initialPrescription,
  isSaving,
  onCancel,
  onSave,
  palette,
}: {
  exerciseDefinitions: ExerciseDefinition[];
  initialPrescription?: ExercisePrescriptionDetail;
  isSaving: boolean;
  onCancel: () => void;
  onSave: (input: PrescriptionFormInput) => Promise<void>;
  palette: DetailPalette;
}) {
  const firstExerciseDefinition = exerciseDefinitions[0] ?? null;
  const selectedInitialExercise = initialPrescription
    ? getExerciseDefinition(exerciseDefinitions, initialPrescription.exerciseDefinitionId)
    : firstExerciseDefinition;
  const [exerciseDefinitionId, setExerciseDefinitionId] = useState(
    selectedInitialExercise?.id ?? ''
  );
  const selectedExerciseDefinition = getExerciseDefinition(exerciseDefinitions, exerciseDefinitionId);
  const [notesDraft, setNotesDraft] = useState(initialPrescription?.notes ?? '');
  const [progressionMethod, setProgressionMethod] = useState<ProgressionMethod>(
    (initialPrescription?.progressionMethod as ProgressionMethod | null) ??
      selectedExerciseDefinition?.defaultProgressionMethod ??
      'double_progression'
  );
  const [repMaxDraft, setRepMaxDraft] = useState(
    String(initialPrescription?.repRangeMax ?? selectedExerciseDefinition?.defaultRepMax ?? 12)
  );
  const [repMinDraft, setRepMinDraft] = useState(
    String(initialPrescription?.repRangeMin ?? selectedExerciseDefinition?.defaultRepMin ?? 8)
  );
  const [restDraft, setRestDraft] = useState(
    String(initialPrescription?.restSeconds ?? selectedExerciseDefinition?.defaultRestSeconds ?? '')
  );
  const [setsDraft, setSetsDraft] = useState(String(initialPrescription?.sets ?? 3));

  useEffect(() => {
    const nextExerciseDefinition = getExerciseDefinition(exerciseDefinitions, exerciseDefinitionId);

    if (!initialPrescription && nextExerciseDefinition) {
      setProgressionMethod(nextExerciseDefinition.defaultProgressionMethod ?? 'double_progression');
      setRepMaxDraft(String(nextExerciseDefinition.defaultRepMax ?? 12));
      setRepMinDraft(String(nextExerciseDefinition.defaultRepMin ?? 8));
      setRestDraft(String(nextExerciseDefinition.defaultRestSeconds ?? ''));
    }
  }, [exerciseDefinitionId, exerciseDefinitions, initialPrescription]);

  if (exerciseDefinitions.length === 0) {
    return (
      <ThemedText style={[styles.emptyText, { color: palette.muted }]}>
        Exercise definitions are not available yet.
      </ThemedText>
    );
  }

  return (
    <View style={[styles.editorPanel, { backgroundColor: palette.surfaceMuted, borderColor: palette.border }]}>
      <ExerciseSelector
        exerciseDefinitions={exerciseDefinitions}
        onChange={setExerciseDefinitionId}
        palette={palette}
        selectedExerciseDefinitionId={exerciseDefinitionId}
      />
      <View style={styles.editMetaGrid}>
        <LabeledInput
          label="Sets"
          onChangeText={setSetsDraft}
          palette={palette}
          placeholder="3"
          value={setsDraft}
        />
        <LabeledInput
          label="Rep Min"
          onChangeText={setRepMinDraft}
          palette={palette}
          placeholder="8"
          value={repMinDraft}
        />
        <LabeledInput
          label="Rep Max"
          onChangeText={setRepMaxDraft}
          palette={palette}
          placeholder="12"
          value={repMaxDraft}
        />
        <LabeledInput
          label="Rest Seconds"
          onChangeText={setRestDraft}
          palette={palette}
          placeholder="90"
          value={restDraft}
        />
      </View>
      <MethodSelector method={progressionMethod} onChange={setProgressionMethod} palette={palette} />
      <LabeledInput
        label="Notes / Cues"
        multiline
        onChangeText={setNotesDraft}
        palette={palette}
        placeholder="Optional cues or rest guidance"
        value={notesDraft}
      />
      <View style={styles.inlineActions}>
        <SmallButton
          disabled={isSaving || !exerciseDefinitionId}
          label={isSaving ? 'Saving' : 'Save'}
          onPress={() => {
            const repRangeMin = parsePositiveInteger(repMinDraft, 8);
            const repRangeMax = parsePositiveInteger(repMaxDraft, repRangeMin);

            void onSave({
              exerciseDefinitionId,
              notes: notesDraft,
              progressionMethod,
              repRangeMax: Math.max(repRangeMax, repRangeMin),
              repRangeMin,
              restSeconds: parseOptionalRestSeconds(restDraft),
              sets: parsePositiveInteger(setsDraft, 1),
            }).catch(() => undefined);
          }}
          palette={palette}
        />
        <SmallButton disabled={isSaving} label="Cancel" onPress={onCancel} palette={palette} tone="muted" />
      </View>
    </View>
  );
}

function TemplateDayCard({
  canEdit,
  canDeleteDay,
  day,
  exerciseDefinitions,
  isFirstDay,
  isLastDay,
  isSaving,
  onAddExercisePrescription,
  onDeleteDay,
  onDeleteExercisePrescription,
  onMoveDay,
  onMoveExercisePrescription,
  onUpdateDay,
  onUpdateExercisePrescription,
  palette,
}: {
  canEdit: boolean;
  canDeleteDay: boolean;
  day: TemplateDayDetail;
  exerciseDefinitions: ExerciseDefinition[];
  isFirstDay: boolean;
  isLastDay: boolean;
  isSaving: boolean;
  onAddExercisePrescription: (
    templateDayId: string,
    input: PrescriptionFormInput
  ) => TemplateMutationResult;
  onDeleteDay: (templateDayId: string) => TemplateMutationResult;
  onDeleteExercisePrescription: (prescriptionId: string) => TemplateMutationResult;
  onMoveDay: (templateDayId: string, direction: -1 | 1) => TemplateMutationResult;
  onMoveExercisePrescription: (
    prescriptionId: string,
    direction: -1 | 1
  ) => TemplateMutationResult;
  onUpdateDay: (
    templateDayId: string,
    input: { focus: string | null; name: string }
  ) => TemplateMutationResult;
  onUpdateExercisePrescription: (
    prescriptionId: string,
    input: PrescriptionFormInput
  ) => TemplateMutationResult;
  palette: DetailPalette;
}) {
  const [editingDay, setEditingDay] = useState(false);
  const [editingPrescriptionId, setEditingPrescriptionId] = useState<string | null>(null);
  const [isAddingPrescription, setIsAddingPrescription] = useState(false);
  const [dayFocusDraft, setDayFocusDraft] = useState(day.focus ?? '');
  const [dayNameDraft, setDayNameDraft] = useState(day.name);

  useEffect(() => {
    setDayFocusDraft(day.focus ?? '');
    setDayNameDraft(day.name);
    setEditingDay(false);
    setEditingPrescriptionId(null);
    setIsAddingPrescription(false);
  }, [day.focus, day.id, day.name]);

  return (
    <View style={[styles.dayCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      {editingDay ? (
        <View style={styles.editorPanel}>
          <LabeledInput
            label="Day Name"
            onChangeText={setDayNameDraft}
            palette={palette}
            placeholder="Push Day"
            value={dayNameDraft}
          />
          <LabeledInput
            label="Focus"
            onChangeText={setDayFocusDraft}
            palette={palette}
            placeholder="chest_shoulders_triceps"
            value={dayFocusDraft}
          />
          <View style={styles.inlineActions}>
            <SmallButton
              disabled={isSaving || !dayNameDraft.trim()}
              label={isSaving ? 'Saving' : 'Save Day'}
              onPress={() => {
                void onUpdateDay(day.id, { focus: dayFocusDraft, name: dayNameDraft })
                  .then(() => setEditingDay(false))
                  .catch(() => undefined);
              }}
              palette={palette}
            />
            <SmallButton
              disabled={isSaving}
              label="Cancel"
              onPress={() => {
                setDayFocusDraft(day.focus ?? '');
                setDayNameDraft(day.name);
                setEditingDay(false);
              }}
              palette={palette}
              tone="muted"
            />
          </View>
        </View>
      ) : (
        <View style={styles.dayHeader}>
          <View style={styles.dayTitleBlock}>
            <ThemedText type="defaultSemiBold" style={styles.dayTitle}>
              {day.name}
            </ThemedText>
            {day.focus ? (
              <ThemedText style={[styles.dayFocus, { color: palette.muted }]}>
                {formatToken(day.focus)}
              </ThemedText>
            ) : null}
          </View>
          {canEdit ? (
            <View style={styles.dayActions}>
              <SmallButton
                disabled={isFirstDay || isSaving}
                label="Up"
                onPress={() => {
                  void onMoveDay(day.id, -1).catch(() => undefined);
                }}
                palette={palette}
                tone="muted"
              />
              <SmallButton
                disabled={isLastDay || isSaving}
                label="Down"
                onPress={() => {
                  void onMoveDay(day.id, 1).catch(() => undefined);
                }}
                palette={palette}
                tone="muted"
              />
              <SmallButton disabled={isSaving} label="Edit" onPress={() => setEditingDay(true)} palette={palette} />
              <SmallButton
                disabled={isSaving || !canDeleteDay}
                label="Delete"
                onPress={() => {
                  if (!canDeleteDay) {
                    return;
                  }

                  Alert.alert('Delete template day?', 'This removes the day from the custom template.', [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => {
                        void onDeleteDay(day.id).catch(() => undefined);
                      },
                    },
                  ]);
                }}
                palette={palette}
                tone="danger"
              />
            </View>
          ) : null}
          {canEdit && !canDeleteDay ? (
            <ThemedText style={[styles.emptyText, { color: palette.muted }]}>
              A template needs at least one day.
            </ThemedText>
          ) : null}
        </View>
      )}

      {day.prescriptions.length > 0 ? (
        <View style={styles.prescriptionList}>
          {day.prescriptions.map((prescription, index) => {
            const isEditingPrescription = editingPrescriptionId === prescription.id;

            return (
              <View key={prescription.id} style={[styles.prescriptionRow, { borderColor: palette.border }]}>
                {isEditingPrescription ? (
                  <PrescriptionEditor
                    exerciseDefinitions={exerciseDefinitions}
                    initialPrescription={prescription}
                    isSaving={isSaving}
                    onCancel={() => setEditingPrescriptionId(null)}
                    onSave={async (input) => {
                      await onUpdateExercisePrescription(prescription.id, input);
                      setEditingPrescriptionId(null);
                    }}
                    palette={palette}
                  />
                ) : (
                  <>
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
                    {canEdit ? (
                      <View style={styles.prescriptionActions}>
                        <SmallButton
                          disabled={index === 0 || isSaving}
                          label="Up"
                          onPress={() => {
                            void onMoveExercisePrescription(prescription.id, -1).catch(
                              () => undefined
                            );
                          }}
                          palette={palette}
                          tone="muted"
                        />
                        <SmallButton
                          disabled={index === day.prescriptions.length - 1 || isSaving}
                          label="Down"
                          onPress={() => {
                            void onMoveExercisePrescription(prescription.id, 1).catch(
                              () => undefined
                            );
                          }}
                          palette={palette}
                          tone="muted"
                        />
                        <SmallButton disabled={isSaving} label="Edit" onPress={() => setEditingPrescriptionId(prescription.id)} palette={palette} />
                        <SmallButton
                          disabled={isSaving}
                          label="Remove"
                          onPress={() => {
                            Alert.alert(
                              'Remove exercise?',
                              'This removes the prescription from the custom template.',
                              [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                  text: 'Remove',
                                  style: 'destructive',
                                  onPress: () => {
                                    void onDeleteExercisePrescription(prescription.id).catch(
                                      () => undefined
                                    );
                                  },
                                },
                              ]
                            );
                          }}
                          palette={palette}
                          tone="danger"
                        />
                      </View>
                    ) : null}
                  </>
                )}
              </View>
            );
          })}
        </View>
      ) : (
        <ThemedText style={[styles.emptyText, { color: palette.muted }]}>
          Planned exercises have not been filled in for this template yet.
        </ThemedText>
      )}

      {canEdit ? (
        isAddingPrescription ? (
          <PrescriptionEditor
            exerciseDefinitions={exerciseDefinitions}
            isSaving={isSaving}
            onCancel={() => setIsAddingPrescription(false)}
            onSave={async (input) => {
              await onAddExercisePrescription(day.id, input);
              setIsAddingPrescription(false);
            }}
            palette={palette}
          />
        ) : (
          <SmallButton
            disabled={isSaving}
            label="Add Exercise"
            onPress={() => setIsAddingPrescription(true)}
            palette={palette}
          />
        )
      ) : null}
    </View>
  );
}

function SetBreakdownRow({
  item,
  palette,
}: {
  item: TemplateAnalysisResult['muscleSetBreakdown'][number];
  palette: DetailPalette;
}) {
  return (
    <View style={styles.breakdownRow}>
      <ThemedText type="defaultSemiBold" style={styles.breakdownLabel}>
        {item.label}
      </ThemedText>
      <ThemedText style={[styles.breakdownValue, { color: palette.muted }]}>
        {item.sets} sets
      </ThemedText>
    </View>
  );
}

function getEditingGuardrailSummary(analysis: TemplateAnalysisResult): string {
  if (analysis.undertrained.length > 0) {
    return `${analysis.undertrained[0].label} volume is below the current target range.`;
  }

  if (analysis.overloaded.length > 0) {
    return `${analysis.overloaded[0].label} volume is above the current target range.`;
  }

  if (analysis.goalFitLabel === 'Low signal / insufficient metadata') {
    return 'Add more complete prescription metadata before judging this custom template.';
  }

  return 'This custom template still looks like a good fit.';
}

function TrainingAnalysisSection({
  analysis,
  palette,
  showEditingSummary,
}: {
  analysis: TemplateAnalysisResult;
  palette: DetailPalette;
  showEditingSummary: boolean;
}) {
  const hasBreakdown = analysis.muscleSetBreakdown.length > 0;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Training Analysis
        </ThemedText>
        <ThemedText style={[styles.caption, { color: palette.muted }]}>
          {analysis.analysisScopeLabel}
        </ThemedText>
      </View>

      <View style={[styles.analysisCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <View style={styles.analysisHeader}>
          <View style={styles.analysisTitleBlock}>
            <ThemedText style={[styles.analysisLabel, { color: palette.muted }]}>Goal Fit</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.analysisFit}>
              {analysis.goalFitLabel}
            </ThemedText>
          </View>
          <View style={[styles.analysisPill, { borderColor: palette.accent }]}>
            <ThemedText style={[styles.analysisPillText, { color: palette.accent }]}>
              {analysis.totalWorkingSets} sets
            </ThemedText>
          </View>
        </View>

        <ThemedText style={[styles.analysisSummary, { color: palette.muted }]}>
          {analysis.goalFitSummary}
        </ThemedText>

        {showEditingSummary ? (
          <View style={[styles.guardrailCallout, { backgroundColor: palette.surfaceMuted, borderColor: palette.border }]}>
            <ThemedText style={[styles.analysisLabel, { color: palette.accent }]}>
              Editing Guardrail
            </ThemedText>
            <ThemedText style={styles.analysisInlineText}>
              {getEditingGuardrailSummary(analysis)}
            </ThemedText>
          </View>
        ) : null}

        {hasBreakdown ? (
          <>
            <View style={styles.analysisSubsection}>
              <ThemedText style={[styles.analysisLabel, { color: palette.muted }]}>
                Notable Bias
              </ThemedText>
              <ThemedText style={styles.analysisInlineText}>
                {analysis.muscleBias.map((item) => `${item.label} ${item.sets}`).join(' / ')}
              </ThemedText>
            </View>

            <View style={styles.analysisSubsection}>
              <ThemedText style={[styles.analysisLabel, { color: palette.muted }]}>
                Muscle-Group Working Sets
              </ThemedText>
              <View style={styles.breakdownList}>
                {analysis.muscleSetBreakdown.map((item) => (
                  <SetBreakdownRow key={item.muscleGroup} item={item} palette={palette} />
                ))}
              </View>
            </View>

            {analysis.undertrained.length > 0 || analysis.overloaded.length > 0 ? (
              <View style={styles.analysisSubsection}>
                <ThemedText style={[styles.analysisLabel, { color: palette.muted }]}>
                  Guardrail Notes
                </ThemedText>
                {analysis.undertrained.length > 0 ? (
                  <ThemedText style={[styles.analysisSummary, { color: palette.muted }]}>
                    Under target: {analysis.undertrained.map((item) => item.label).join(', ')}
                  </ThemedText>
                ) : null}
                {analysis.overloaded.length > 0 ? (
                  <ThemedText style={[styles.analysisSummary, { color: palette.muted }]}>
                    Over target: {analysis.overloaded.map((item) => item.label).join(', ')}
                  </ThemedText>
                ) : null}
              </View>
            ) : null}
          </>
        ) : (
          <ThemedText style={[styles.emptyText, { color: palette.muted }]}>
            Add prescription sets and muscle groups before this template can be analyzed.
          </ThemedText>
        )}

        <View style={styles.analysisSubsection}>
          <ThemedText style={[styles.analysisLabel, { color: palette.muted }]}>
            Target Profile
          </ThemedText>
          <ThemedText style={[styles.analysisSummary, { color: palette.muted }]}>
            {analysis.targetProfileName}
          </ThemedText>
          {analysis.notes.map((note) => (
            <ThemedText key={note} style={[styles.analysisSummary, { color: palette.muted }]}>
              {note}
            </ThemedText>
          ))}
        </View>
      </View>
    </View>
  );
}

export function TemplateDetailScreenContent({
  activeRoutine,
  error,
  exerciseDefinitions,
  isDuplicating,
  isLoading,
  isSaving,
  isSettingActive,
  mutationError,
  onAddExercisePrescription,
  onAddTemplateDay,
  onBack,
  onDeleteExercisePrescription,
  onDeleteTemplateDay,
  onDuplicate,
  onMoveExercisePrescription,
  onMoveTemplateDay,
  onSetActive,
  onUpdateExercisePrescription,
  onUpdateMetadata,
  onUpdateTemplateDay,
  template,
}: TemplateDetailScreenContentProps) {
  const colorScheme = useColorScheme() ?? 'dark';
  const palette = getPalette(colorScheme);
  const theme = Colors[colorScheme];
  const isActiveRoutine = activeRoutine?.templateId === template?.id;
  const isPrebuilt = template?.sourceType === 'prebuilt';
  const canEdit = template?.sourceType === 'custom' && template.isEditable;
  const [isAddingDay, setIsAddingDay] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dayFocusDraft, setDayFocusDraft] = useState('');
  const [dayNameDraft, setDayNameDraft] = useState('');
  const [descriptionDraft, setDescriptionDraft] = useState('');
  const [goalDraft, setGoalDraft] = useState('');
  const [nameDraft, setNameDraft] = useState('');
  const [splitTypeDraft, setSplitTypeDraft] = useState('');

  useEffect(() => {
    setDescriptionDraft(template?.description ?? '');
    setGoalDraft(template?.goal ?? '');
    setNameDraft(template?.name ?? '');
    setSplitTypeDraft(template?.splitType ?? '');
    setIsEditing(false);
    setIsAddingDay(false);
    setDayFocusDraft('');
    setDayNameDraft('');
  }, [template?.description, template?.goal, template?.id, template?.name, template?.splitType]);

  const analysis = useMemo(() => (template ? analyzeTemplate(template) : null), [template]);

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

  if (error || !template || !analysis) {
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
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
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
            {isEditing ? (
              <View style={styles.editForm}>
                <LabeledInput
                  label="Name"
                  onChangeText={setNameDraft}
                  palette={palette}
                  placeholder="Template name"
                  value={nameDraft}
                />
                <LabeledInput
                  label="Description"
                  multiline
                  onChangeText={setDescriptionDraft}
                  palette={palette}
                  placeholder="Description"
                  value={descriptionDraft}
                />
                <View style={styles.editMetaGrid}>
                  <LabeledInput
                    label="Goal"
                    onChangeText={setGoalDraft}
                    palette={palette}
                    placeholder="hypertrophy"
                    value={goalDraft}
                  />
                  <LabeledInput
                    label="Split"
                    onChangeText={setSplitTypeDraft}
                    palette={palette}
                    placeholder="full_body"
                    value={splitTypeDraft}
                  />
                </View>
              </View>
            ) : (
              <>
                <ThemedText type="title" style={styles.title}>
                  {template.name}
                </ThemedText>
                {template.description ? (
                  <ThemedText style={[styles.description, { color: theme.text }]}>
                    {template.description}
                  </ThemedText>
                ) : null}
              </>
            )}
          </View>

          <View style={styles.metaGrid}>
            <View style={[styles.metaTile, { backgroundColor: palette.surface, borderColor: palette.border }]}>
              <ThemedText style={[styles.metaLabel, { color: palette.muted }]}>Sessions</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.metaValue}>
                {template.days.length}
              </ThemedText>
            </View>
            <View style={[styles.metaTile, { backgroundColor: palette.surface, borderColor: palette.border }]}>
              <ThemedText style={[styles.metaLabel, { color: palette.muted }]}>Split</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.metaValue}>
                {formatToken(template.splitType) ?? 'Unspecified'}
              </ThemedText>
            </View>
            <View style={[styles.metaTile, { backgroundColor: palette.surface, borderColor: palette.border }]}>
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
              label={isActiveRoutine ? 'Active Routine' : isSettingActive ? 'Setting Active' : 'Set Active'}
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
            {canEdit && !isEditing ? (
              <DetailButton
                accessibilityLabel="Edit custom template metadata"
                label="Edit Template"
                onPress={() => setIsEditing(true)}
                palette={palette}
                variant="secondary"
              />
            ) : null}
            {canEdit && isEditing ? (
              <>
                <DetailButton
                  accessibilityLabel="Save custom template changes"
                  disabled={isSaving || !nameDraft.trim()}
                  label={isSaving ? 'Saving' : 'Save Changes'}
                  onPress={() => {
                    void onUpdateMetadata({
                      name: nameDraft,
                      description: descriptionDraft,
                      goal: goalDraft,
                      splitType: splitTypeDraft,
                    })
                      .then(() => setIsEditing(false))
                      .catch(() => undefined);
                  }}
                  palette={palette}
                  variant="primary"
                />
                <DetailButton
                  accessibilityLabel="Cancel custom template editing"
                  disabled={isSaving}
                  label="Cancel"
                  onPress={() => {
                    setDescriptionDraft(template.description ?? '');
                    setGoalDraft(template.goal ?? '');
                    setNameDraft(template.name);
                    setSplitTypeDraft(template.splitType ?? '');
                    setIsEditing(false);
                  }}
                  palette={palette}
                  variant="secondary"
                />
              </>
            ) : null}
          </View>

          {mutationError ? (
            <View
              style={[
                styles.messageCard,
                { backgroundColor: palette.surfaceMuted, borderColor: palette.border },
              ]}>
              <ThemedText style={[styles.messageText, { color: palette.muted }]}>
                {mutationError.message}
              </ThemedText>
            </View>
          ) : null}

          <TrainingAnalysisSection analysis={analysis} palette={palette} showEditingSummary={Boolean(canEdit)} />

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
                {template.days.map((day, index) => (
                  <TemplateDayCard
                    canEdit={Boolean(canEdit)}
                    canDeleteDay={template.days.length > 1}
                    day={day}
                    exerciseDefinitions={exerciseDefinitions}
                    isFirstDay={index === 0}
                    isLastDay={index === template.days.length - 1}
                    isSaving={isSaving}
                    key={day.id}
                    onAddExercisePrescription={onAddExercisePrescription}
                    onDeleteDay={onDeleteTemplateDay}
                    onDeleteExercisePrescription={onDeleteExercisePrescription}
                    onMoveDay={onMoveTemplateDay}
                    onMoveExercisePrescription={onMoveExercisePrescription}
                    onUpdateDay={onUpdateTemplateDay}
                    onUpdateExercisePrescription={onUpdateExercisePrescription}
                    palette={palette}
                  />
                ))}
              </View>
            ) : (
              <View style={[styles.dayCard, { backgroundColor: palette.surfaceMuted, borderColor: palette.border }]}>
                <ThemedText style={[styles.emptyText, { color: palette.muted }]}>
                  This template does not have Phase 2C template days yet.
                </ThemedText>
              </View>
            )}

            {canEdit ? (
              isAddingDay ? (
                <View style={[styles.dayCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                  <LabeledInput
                    label="Day Name"
                    onChangeText={setDayNameDraft}
                    palette={palette}
                    placeholder="Upper Day"
                    value={dayNameDraft}
                  />
                  <LabeledInput
                    label="Focus"
                    onChangeText={setDayFocusDraft}
                    palette={palette}
                    placeholder="upper_body"
                    value={dayFocusDraft}
                  />
                  <View style={styles.inlineActions}>
                    <SmallButton
                      disabled={isSaving || !dayNameDraft.trim()}
                      label={isSaving ? 'Saving' : 'Save Day'}
                      onPress={() => {
                        void onAddTemplateDay({ focus: dayFocusDraft, name: dayNameDraft })
                          .then(() => {
                            setDayFocusDraft('');
                            setDayNameDraft('');
                            setIsAddingDay(false);
                          })
                          .catch(() => undefined);
                      }}
                      palette={palette}
                    />
                    <SmallButton
                      disabled={isSaving}
                      label="Cancel"
                      onPress={() => setIsAddingDay(false)}
                      palette={palette}
                      tone="muted"
                    />
                  </View>
                </View>
              ) : (
                <DetailButton
                  accessibilityLabel="Add custom template day"
                  disabled={isSaving}
                  label="Add Day"
                  onPress={() => setIsAddingDay(true)}
                  palette={palette}
                  variant="secondary"
                />
              )
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  actionGroup: {
    gap: 10,
  },
  analysisCard: {
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
    padding: 15,
  },
  analysisFit: {
    fontSize: 18,
    lineHeight: 24,
  },
  analysisHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  analysisInlineText: {
    fontSize: 15,
    lineHeight: 21,
  },
  analysisLabel: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  analysisPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  analysisPillText: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  analysisSubsection: {
    gap: 6,
  },
  analysisSummary: {
    fontSize: 14,
    lineHeight: 20,
  },
  analysisTitleBlock: {
    flex: 1,
    gap: 4,
    minWidth: 0,
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
  breakdownLabel: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    minWidth: 0,
  },
  breakdownList: {
    gap: 8,
  },
  breakdownRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  breakdownValue: {
    fontSize: 14,
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
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choiceChip: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  choiceChipText: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  content: {
    gap: 18,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  dayActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
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
    gap: 10,
  },
  dayList: {
    gap: 12,
  },
  dayTitle: {
    fontSize: 18,
    lineHeight: 24,
  },
  dayTitleBlock: {
    gap: 4,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  editForm: {
    gap: 12,
  },
  editMetaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  editorPanel: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    padding: 12,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  errorText: {
    textAlign: 'center',
  },
  exerciseChoice: {
    borderRadius: 14,
    borderWidth: 1,
    gap: 2,
    padding: 10,
  },
  exerciseChoiceList: {
    gap: 8,
  },
  exerciseChoiceScroller: {
    maxHeight: 280,
  },
  exerciseChoiceName: {
    fontSize: 14,
    lineHeight: 19,
  },
  exerciseGroup: {
    gap: 7,
  },
  exerciseGroupLabel: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  exerciseName: {
    fontSize: 16,
    lineHeight: 22,
  },
  guardrailCallout: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
    padding: 12,
  },
  helpCard: {
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
    padding: 10,
  },
  helpText: {
    fontSize: 13,
    lineHeight: 18,
  },
  helpTitle: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  header: {
    gap: 6,
  },
  inlineActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  inputGroup: {
    flexBasis: 140,
    flexGrow: 1,
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textTransform: 'uppercase',
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
    minWidth: 150,
    padding: 12,
  },
  metaValue: {
    flexShrink: 1,
    fontSize: 16,
    lineHeight: 21,
  },
  messageCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  prescriptionActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
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
    borderTopWidth: 1,
    gap: 10,
    paddingTop: 12,
  },
  prescriptionTextBlock: {
    flex: 1,
    gap: 3,
  },
  safeArea: {
    flex: 1,
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
  smallButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: 10,
  },
  smallButtonText: {
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  textArea: {
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 15,
    minHeight: 90,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
  textInput: {
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 15,
    minHeight: 46,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  title: {
    flexShrink: 1,
    fontSize: 34,
    lineHeight: 38,
  },
});
