import type { SQLiteDatabase } from 'expo-sqlite';

export type ExerciseHistorySet = {
  reps: number | null;
  weight: number | null;
};

export type ExerciseHistoryPerformance = {
  completedAt: string;
  notes: string | null;
  sets: ExerciseHistorySet[];
  workoutSessionId: string;
};

export type ExerciseHistoryBestSet = {
  completedAt: string;
  reps: number | null;
  weight: number | null;
  workoutSessionId: string;
};

export type ExerciseHistoryRecentSession = {
  completedAt: string;
  notes: string | null;
  setSummary: string;
  workoutSessionId: string;
};

export type ExerciseHistoryPriorNote = {
  completedAt: string;
  notes: string;
  workoutSessionId: string;
};

export type ExerciseHistoryComparison = {
  bestSet: ExerciseHistoryBestSet | null;
  exerciseDefinitionId: string;
  lastFive: ExerciseHistoryRecentSession[];
  lastTime: ExerciseHistoryPerformance | null;
  priorNotes: ExerciseHistoryPriorNote[];
};

type HistorySetRow = {
  completed_at: string;
  completed_exercise_id: string;
  notes: string | null;
  reps: number | null;
  set_number: number;
  weight: number | null;
  workout_session_id: string;
};

type HistoryPerformanceAccumulator = {
  completedAt: string;
  notes: string | null;
  sets: ExerciseHistorySet[];
  workoutSessionId: string;
};

function compareNullableNumberDesc(left: number | null, right: number | null): number {
  return (right ?? -Infinity) - (left ?? -Infinity);
}

function formatSet(set: ExerciseHistorySet): string {
  const weight = set.weight == null ? '-' : String(set.weight);
  const reps = set.reps == null ? '-' : String(set.reps);

  return `${weight} x ${reps}`;
}

function formatSetSummary(sets: ExerciseHistorySet[]): string {
  if (sets.length === 0) {
    return 'No working sets';
  }

  const groupedByWeight = new Map<number | null, number[]>();

  for (const set of sets) {
    const reps = set.reps;

    if (reps == null) {
      continue;
    }

    groupedByWeight.set(set.weight, [...(groupedByWeight.get(set.weight) ?? []), reps]);
  }

  if (groupedByWeight.size === 1) {
    const [[weight, reps]] = [...groupedByWeight.entries()];
    const weightLabel = weight == null ? '-' : String(weight);

    return `${weightLabel} x ${reps.join(', ')}`;
  }

  return sets.map(formatSet).join(', ');
}

export class HistoryComparisonRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  async getExerciseHistoryComparison({
    currentWorkoutSessionId,
    exerciseDefinitionId,
    limit = 5,
  }: {
    currentWorkoutSessionId?: string | null;
    exerciseDefinitionId: string;
    limit?: number;
  }): Promise<ExerciseHistoryComparison> {
    const rows = await this.database.getAllAsync<HistorySetRow>(
      `SELECT
         ws.id AS workout_session_id,
         ws.completed_at,
         ce.id AS completed_exercise_id,
         ce.notes,
         sl.set_number,
         sl.weight,
         sl.reps
       FROM completed_exercises ce
       INNER JOIN workout_sessions ws ON ws.id = ce.workout_session_id
       INNER JOIN set_logs sl ON sl.completed_exercise_id = ce.id
       WHERE ce.exercise_definition_id = ?
         AND ws.status = 'completed'
         AND ws.completed_at IS NOT NULL
         AND sl.is_warmup = 0
         AND (? IS NULL OR ws.id <> ?)
       ORDER BY ws.completed_at DESC, ws.id DESC, ce.order_index ASC, ce.id ASC, sl.set_number ASC;`,
      exerciseDefinitionId,
      currentWorkoutSessionId ?? null,
      currentWorkoutSessionId ?? null
    );

    const performancesByExerciseId = new Map<string, HistoryPerformanceAccumulator>();

    for (const row of rows) {
      const performance = performancesByExerciseId.get(row.completed_exercise_id) ?? {
        completedAt: row.completed_at,
        notes: row.notes,
        sets: [],
        workoutSessionId: row.workout_session_id,
      };

      performance.sets.push({
        reps: row.reps,
        weight: row.weight,
      });
      performancesByExerciseId.set(row.completed_exercise_id, performance);
    }

    const performances = [...performancesByExerciseId.values()];
    const bestSet =
      rows
        .map((row) => ({
          completedAt: row.completed_at,
          reps: row.reps,
          weight: row.weight,
          workoutSessionId: row.workout_session_id,
        }))
        .sort((left, right) => {
          const weightComparison = compareNullableNumberDesc(left.weight, right.weight);

          if (weightComparison !== 0) {
            return weightComparison;
          }

          return compareNullableNumberDesc(left.reps, right.reps);
        })[0] ?? null;

    return {
      exerciseDefinitionId,
      lastTime: performances[0] ?? null,
      bestSet,
      lastFive: performances.slice(0, limit).map((performance) => ({
        completedAt: performance.completedAt,
        notes: performance.notes,
        setSummary: formatSetSummary(performance.sets),
        workoutSessionId: performance.workoutSessionId,
      })),
      priorNotes: performances
        .filter((performance) => performance.notes?.trim())
        .slice(0, limit)
        .map((performance) => ({
          completedAt: performance.completedAt,
          notes: performance.notes?.trim() ?? '',
          workoutSessionId: performance.workoutSessionId,
        })),
    };
  }

  async getExerciseHistoryComparisons({
    currentWorkoutSessionId,
    exerciseDefinitionIds,
    limit = 5,
  }: {
    currentWorkoutSessionId?: string | null;
    exerciseDefinitionIds: string[];
    limit?: number;
  }): Promise<Record<string, ExerciseHistoryComparison>> {
    const uniqueExerciseDefinitionIds = [...new Set(exerciseDefinitionIds.filter(Boolean))];
    const comparisons: Record<string, ExerciseHistoryComparison> = {};

    for (const exerciseDefinitionId of uniqueExerciseDefinitionIds) {
      comparisons[exerciseDefinitionId] = await this.getExerciseHistoryComparison({
        currentWorkoutSessionId,
        exerciseDefinitionId,
        limit,
      });
    }

    return comparisons;
  }
}
