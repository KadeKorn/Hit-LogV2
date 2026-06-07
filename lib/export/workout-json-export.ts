import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { bootstrapDatabase } from '@/db/bootstrap';
import { JsonExportRepository, type WorkoutJsonExportData } from '@/db/export';
import { SCHEMA_VERSION } from '@/db/migrations';

const APP_NAME = 'HIT Log V2';
const EXPORT_VERSION = 2;
const EXPORT_SOURCE = 'local-sqlite';

export type WorkoutJsonExportMetadata = {
  appName: string;
  exportedAt: string;
  exportVersion: number;
  schemaVersion: number;
  source: string;
};

export type WorkoutJsonExportSummary = {
  activeRoutinePresent: boolean;
  completedWorkoutCount: number;
  createdAt: string;
  customExerciseCount: number;
  customTemplateCount: number;
  exerciseDefinitionCount: number;
  exportVersion: number;
  legacyExerciseLogCount: number;
  legacyExerciseSetCount: number;
  legacyWorkoutLogCount: number;
  schemaVersion: number;
  setLogCount: number;
  templateCount: number;
};

export type WorkoutJsonExportPayload = {
  data: WorkoutJsonExportData;
  metadata: WorkoutJsonExportMetadata;
  summary: WorkoutJsonExportSummary;
};

export type WorkoutJsonExportCounts = WorkoutJsonExportSummary;

export type WorkoutJsonExportResult = {
  counts: WorkoutJsonExportCounts;
  fileName: string;
  fileUri: string;
};

export type WorkoutCsvExportResult = {
  fileName: string;
  fileUri: string;
  rowCount: number;
};

function createExportFileName(exportedAt: string): string {
  const safeTimestamp = exportedAt.replace(/[:.]/g, '-');

  return `hit-log-v2-backup-${safeTimestamp}.json`;
}

function createCsvFileName(exportedAt: string): string {
  const safeTimestamp = exportedAt.replace(/[:.]/g, '-');

  return `hit-log-v2-workout-history-${safeTimestamp}.csv`;
}

function getSummary(data: WorkoutJsonExportData, exportedAt: string): WorkoutJsonExportSummary {
  return {
    activeRoutinePresent: data.activeRoutines.some((routine) => routine.status === 'active'),
    completedWorkoutCount: data.workoutSessions.filter((session) => session.status === 'completed').length,
    createdAt: exportedAt,
    customExerciseCount: data.exerciseDefinitions.filter(
      (exerciseDefinition) => exerciseDefinition.source_type === 'custom'
    ).length,
    customTemplateCount: data.workoutTemplates.filter(
      (workoutTemplate) => workoutTemplate.source_type === 'custom'
    ).length,
    exerciseDefinitionCount: data.exerciseDefinitions.length,
    exportVersion: EXPORT_VERSION,
    legacyExerciseLogCount: data.exerciseLogs.length,
    legacyExerciseSetCount: data.exerciseSets.length,
    legacyWorkoutLogCount: data.workoutLogs.length,
    schemaVersion: SCHEMA_VERSION,
    setLogCount: data.setLogs.length,
    templateCount: data.workoutTemplates.length,
  };
}

export async function buildWorkoutJsonExportPayload(): Promise<WorkoutJsonExportPayload> {
  const database = await bootstrapDatabase();
  const exportRepository = new JsonExportRepository(database);
  const data = await exportRepository.getWorkoutJsonExportData();
  const exportedAt = new Date().toISOString();
  const summary = getSummary(data, exportedAt);

  return {
    metadata: {
      appName: APP_NAME,
      exportVersion: EXPORT_VERSION,
      exportedAt,
      schemaVersion: SCHEMA_VERSION,
      source: EXPORT_SOURCE,
    },
    summary,
    data,
  };
}

export async function exportWorkoutDataToJsonFile(): Promise<WorkoutJsonExportResult> {
  const payload = await buildWorkoutJsonExportPayload();
  const fileName = createExportFileName(payload.metadata.exportedAt);
  const file = new File(Paths.document, fileName);
  const json = JSON.stringify(payload, null, 2);

  file.create();
  file.write(json);

  const isSharingAvailable = await Sharing.isAvailableAsync();

  if (!isSharingAvailable) {
    throw new Error('The native share sheet is not available on this device.');
  }

  await Sharing.shareAsync(file.uri, {
    UTI: 'public.json',
    mimeType: 'application/json',
  });

  return {
    fileName,
    fileUri: file.uri,
    counts: payload.summary,
  };
}

function csvEscape(value: number | string | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }

  const text = String(value);

  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function buildWorkoutHistoryCsv(data: WorkoutJsonExportData): string {
  const templatesById = new Map(data.workoutTemplates.map((template) => [template.id, template]));
  const templateDaysById = new Map(data.templateDays.map((templateDay) => [templateDay.id, templateDay]));
  const completedExercisesBySessionId = new Map<string, typeof data.completedExercises>();
  const setLogsByCompletedExerciseId = new Map<string, typeof data.setLogs>();

  for (const completedExercise of data.completedExercises) {
    const completedExercises = completedExercisesBySessionId.get(completedExercise.workout_session_id) ?? [];
    completedExercises.push(completedExercise);
    completedExercisesBySessionId.set(completedExercise.workout_session_id, completedExercises);
  }

  for (const setLog of data.setLogs) {
    const setLogs = setLogsByCompletedExerciseId.get(setLog.completed_exercise_id) ?? [];
    setLogs.push(setLog);
    setLogsByCompletedExerciseId.set(setLog.completed_exercise_id, setLogs);
  }

  const headers = [
    'session_date',
    'template_name',
    'template_day_name',
    'exercise_name',
    'set_number',
    'set_type',
    'weight',
    'reps',
    'rir',
    'effort',
    'volume',
    'notes',
    'is_substitution',
  ];
  const rows = [headers.join(',')];

  const completedSessions = data.workoutSessions
    .filter((session) => session.status === 'completed')
    .sort((left, right) => left.started_at.localeCompare(right.started_at));

  for (const session of completedSessions) {
    const template = session.template_id ? templatesById.get(session.template_id) : null;
    const templateDay = session.template_day_id ? templateDaysById.get(session.template_day_id) : null;
    const completedExercises = completedExercisesBySessionId.get(session.id) ?? [];

    completedExercises.sort((left, right) => left.order_index - right.order_index || left.id.localeCompare(right.id));

    for (const completedExercise of completedExercises) {
      const setLogs = setLogsByCompletedExerciseId.get(completedExercise.id) ?? [];

      setLogs.sort((left, right) => left.set_number - right.set_number || left.id.localeCompare(right.id));

      for (const setLog of setLogs) {
        const isWarmup = setLog.is_warmup === 1;
        const volume =
          !isWarmup && setLog.weight !== null && setLog.reps !== null ? setLog.weight * setLog.reps : null;
        const notes = [setLog.notes, completedExercise.notes, session.notes].filter(Boolean).join(' | ');

        rows.push(
          [
            session.completed_at ?? session.started_at,
            template?.name ?? '',
            templateDay?.name ?? '',
            completedExercise.exercise_name,
            setLog.set_number,
            isWarmup ? 'warmup' : 'working',
            setLog.weight,
            setLog.reps,
            completedExercise.estimated_rir,
            completedExercise.effort_rating,
            volume,
            notes,
            completedExercise.is_substitution === 1 ? 'yes' : 'no',
          ]
            .map(csvEscape)
            .join(',')
        );
      }
    }
  }

  return rows.join('\n');
}

export async function exportWorkoutHistoryToCsvFile(): Promise<WorkoutCsvExportResult> {
  const payload = await buildWorkoutJsonExportPayload();
  const fileName = createCsvFileName(payload.metadata.exportedAt);
  const file = new File(Paths.document, fileName);
  const csv = buildWorkoutHistoryCsv(payload.data);

  file.create();
  file.write(csv);

  const isSharingAvailable = await Sharing.isAvailableAsync();

  if (!isSharingAvailable) {
    throw new Error('The native share sheet is not available on this device.');
  }

  await Sharing.shareAsync(file.uri, {
    UTI: 'public.comma-separated-values-text',
    mimeType: 'text/csv',
  });

  return {
    fileName,
    fileUri: file.uri,
    rowCount: Math.max(csv.split('\n').length - 1, 0),
  };
}
