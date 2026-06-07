import type { SQLiteDatabase } from 'expo-sqlite';

import type { EffortRating, SetLog } from '@/types/domain';

export type CompletedSessionSummary = {
  completedAt: string;
  completedExerciseCount: number;
  hasNotes: boolean;
  id: string;
  templateDayName: string | null;
  templateName: string | null;
  totalVolume: number;
  workingSetCount: number;
};

export type CompletedSessionExercise = {
  effortRating: EffortRating | null;
  estimatedRir: 0 | 1 | 2 | 3 | null;
  exerciseName: string;
  id: string;
  isSubstitution: boolean;
  notes: string | null;
  orderIndex: number;
  setLogs: SetLog[];
};

export type CompletedSessionDetail = {
  completedAt: string;
  exercises: CompletedSessionExercise[];
  id: string;
  notes: string | null;
  templateDayName: string | null;
  templateName: string | null;
};

export type ExerciseHistoryLookupItem = {
  exerciseHistoryKey: string;
  exerciseName: string;
  sessionCount: number;
};

export type ExerciseHistorySet = {
  id: string;
  reps: number;
  setNumber: number;
  weight: number | null;
};

export type ExerciseHistoryPerformance = {
  bestSet: ExerciseHistorySet | null;
  completedAt: string;
  exerciseNotes: string | null;
  sessionId: string;
  templateDayName: string | null;
  templateName: string | null;
  workingSets: ExerciseHistorySet[];
};

type CompletedSessionSummaryRow = {
  completed_at: string;
  completed_exercise_count: number;
  has_notes: number;
  id: string;
  template_day_name: string | null;
  template_name: string | null;
  total_volume: number | null;
  working_set_count: number;
};

type CompletedSessionRow = {
  completed_at: string;
  id: string;
  notes: string | null;
  template_day_name: string | null;
  template_name: string | null;
};

type CompletedSessionExerciseRow = {
  effort_rating: EffortRating | null;
  estimated_rir: 0 | 1 | 2 | 3 | null;
  exercise_name: string;
  id: string;
  is_substitution: number;
  notes: string | null;
  order_index: number;
};

type SetLogRow = {
  completed_exercise_id: string;
  created_at: string;
  id: string;
  is_warmup: number;
  notes: string | null;
  reps: number | null;
  set_number: number;
  updated_at: string;
  weight: number | null;
};

type ExerciseHistoryLookupRow = {
  exercise_history_key: string;
  exercise_name: string;
  session_count: number;
};

type ExerciseHistoryPerformanceRow = {
  completed_at: string;
  exercise_notes: string | null;
  session_id: string;
  set_id: string;
  set_number: number;
  reps: number;
  template_day_name: string | null;
  template_name: string | null;
  weight: number | null;
};

type ExerciseHistoryAccumulator = {
  completedAt: string;
  exerciseNotes: string | null;
  sessionId: string;
  templateDayName: string | null;
  templateName: string | null;
  workingSets: ExerciseHistorySet[];
};

function mapSetLogRow(row: SetLogRow): SetLog {
  return {
    completedExerciseId: row.completed_exercise_id,
    createdAt: row.created_at,
    id: row.id,
    isWarmup: row.is_warmup === 1,
    notes: row.notes,
    reps: row.reps,
    setNumber: row.set_number,
    updatedAt: row.updated_at,
    weight: row.weight,
  };
}

function compareBestSet(left: ExerciseHistorySet, right: ExerciseHistorySet): number {
  const weightComparison = (right.weight ?? -Infinity) - (left.weight ?? -Infinity);

  if (weightComparison !== 0) {
    return weightComparison;
  }

  return right.reps - left.reps;
}

export class V2HistoryRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  async getCompletedSessions(): Promise<CompletedSessionSummary[]> {
    const rows = await this.database.getAllAsync<CompletedSessionSummaryRow>(
      `SELECT
         ws.id,
         ws.completed_at,
         wt.name AS template_name,
         td.name AS template_day_name,
         COUNT(DISTINCT CASE
           WHEN EXISTS (
             SELECT 1
             FROM set_logs exercise_sets
             WHERE exercise_sets.completed_exercise_id = ce.id
               AND exercise_sets.reps IS NOT NULL
           )
           THEN ce.id
         END) AS completed_exercise_count,
         COUNT(CASE
           WHEN sl.is_warmup = 0
             AND sl.reps IS NOT NULL
           THEN 1
         END) AS working_set_count,
         COALESCE(SUM(CASE
           WHEN sl.is_warmup = 0
             AND sl.weight IS NOT NULL
             AND sl.reps IS NOT NULL
           THEN sl.weight * sl.reps
           ELSE 0
         END), 0) AS total_volume,
         CASE
           WHEN ws.notes IS NOT NULL AND TRIM(ws.notes) <> '' THEN 1
           WHEN EXISTS (
             SELECT 1
             FROM completed_exercises note_exercises
             WHERE note_exercises.workout_session_id = ws.id
               AND note_exercises.notes IS NOT NULL
               AND TRIM(note_exercises.notes) <> ''
           ) THEN 1
           WHEN EXISTS (
             SELECT 1
             FROM completed_exercises note_exercises
             INNER JOIN set_logs note_sets ON note_sets.completed_exercise_id = note_exercises.id
             WHERE note_exercises.workout_session_id = ws.id
               AND note_sets.notes IS NOT NULL
               AND TRIM(note_sets.notes) <> ''
           ) THEN 1
           ELSE 0
         END AS has_notes
       FROM workout_sessions ws
       LEFT JOIN workout_templates wt ON wt.id = ws.template_id
       LEFT JOIN template_days td ON td.id = ws.template_day_id
       LEFT JOIN completed_exercises ce ON ce.workout_session_id = ws.id
       LEFT JOIN set_logs sl ON sl.completed_exercise_id = ce.id
       WHERE ws.status = 'completed'
         AND ws.completed_at IS NOT NULL
       GROUP BY ws.id
       ORDER BY ws.completed_at DESC, ws.id DESC;`
    );

    return rows.map((row) => ({
      completedAt: row.completed_at,
      completedExerciseCount: row.completed_exercise_count,
      hasNotes: row.has_notes === 1,
      id: row.id,
      templateDayName: row.template_day_name,
      templateName: row.template_name,
      totalVolume: row.total_volume ?? 0,
      workingSetCount: row.working_set_count,
    }));
  }

  async getCompletedSessionDetail(sessionId: string): Promise<CompletedSessionDetail | null> {
    const sessionRow = await this.database.getFirstAsync<CompletedSessionRow>(
      `SELECT
         ws.id,
         ws.completed_at,
         ws.notes,
         wt.name AS template_name,
         td.name AS template_day_name
       FROM workout_sessions ws
       LEFT JOIN workout_templates wt ON wt.id = ws.template_id
       LEFT JOIN template_days td ON td.id = ws.template_day_id
       WHERE ws.id = ?
         AND ws.status = 'completed'
         AND ws.completed_at IS NOT NULL
       LIMIT 1;`,
      sessionId
    );

    if (!sessionRow) {
      return null;
    }

    const exerciseRows = await this.database.getAllAsync<CompletedSessionExerciseRow>(
      `SELECT
         id,
         exercise_name,
         is_substitution,
         order_index,
         notes,
         effort_rating,
         estimated_rir
       FROM completed_exercises
       WHERE workout_session_id = ?
       ORDER BY order_index ASC, id ASC;`,
      sessionId
    );

    const exerciseIds = exerciseRows.map((exercise) => exercise.id);
    const setRows =
      exerciseIds.length > 0
        ? await this.database.getAllAsync<SetLogRow>(
            `SELECT
               id,
               completed_exercise_id,
               set_number,
               weight,
               reps,
               is_warmup,
               notes,
               created_at,
               updated_at
             FROM set_logs
             WHERE completed_exercise_id IN (${exerciseIds.map(() => '?').join(', ')})
               AND reps IS NOT NULL
             ORDER BY completed_exercise_id ASC, is_warmup DESC, set_number ASC, id ASC;`,
            ...exerciseIds
          )
        : [];
    const setLogsByExerciseId = new Map<string, SetLog[]>();

    for (const row of setRows) {
      const setLogs = setLogsByExerciseId.get(row.completed_exercise_id) ?? [];
      setLogs.push(mapSetLogRow(row));
      setLogsByExerciseId.set(row.completed_exercise_id, setLogs);
    }

    return {
      completedAt: sessionRow.completed_at,
      exercises: exerciseRows.map((row) => ({
        effortRating: row.effort_rating,
        estimatedRir: row.estimated_rir,
        exerciseName: row.exercise_name,
        id: row.id,
        isSubstitution: row.is_substitution === 1,
        notes: row.notes,
        orderIndex: row.order_index,
        setLogs: setLogsByExerciseId.get(row.id) ?? [],
      })),
      id: sessionRow.id,
      notes: sessionRow.notes,
      templateDayName: sessionRow.template_day_name,
      templateName: sessionRow.template_name,
    };
  }

  async getExerciseHistoryLookup(): Promise<ExerciseHistoryLookupItem[]> {
    const rows = await this.database.getAllAsync<ExerciseHistoryLookupRow>(
      `SELECT
         COALESCE(ce.exercise_definition_id, 'name:' || ce.exercise_name) AS exercise_history_key,
         ce.exercise_name,
         COUNT(DISTINCT ws.id) AS session_count,
         MAX(ws.completed_at) AS latest_completed_at
       FROM completed_exercises ce
       INNER JOIN workout_sessions ws ON ws.id = ce.workout_session_id
       INNER JOIN set_logs sl ON sl.completed_exercise_id = ce.id
       WHERE ws.status = 'completed'
         AND ws.completed_at IS NOT NULL
         AND sl.is_warmup = 0
         AND sl.reps IS NOT NULL
       GROUP BY exercise_history_key
       ORDER BY latest_completed_at DESC, ce.exercise_name ASC;`
    );

    return rows.map((row) => ({
      exerciseHistoryKey: row.exercise_history_key,
      exerciseName: row.exercise_name,
      sessionCount: row.session_count,
    }));
  }

  async getExerciseHistoryPerformances(
    exerciseHistoryKey: string
  ): Promise<ExerciseHistoryPerformance[]> {
    const rows = await this.database.getAllAsync<ExerciseHistoryPerformanceRow>(
      `SELECT
         ws.id AS session_id,
         ws.completed_at,
         wt.name AS template_name,
         td.name AS template_day_name,
         ce.notes AS exercise_notes,
         sl.id AS set_id,
         sl.set_number,
         sl.weight,
         sl.reps
       FROM completed_exercises ce
       INNER JOIN workout_sessions ws ON ws.id = ce.workout_session_id
       LEFT JOIN workout_templates wt ON wt.id = ws.template_id
       LEFT JOIN template_days td ON td.id = ws.template_day_id
       INNER JOIN set_logs sl ON sl.completed_exercise_id = ce.id
       WHERE ws.status = 'completed'
         AND ws.completed_at IS NOT NULL
         AND sl.is_warmup = 0
         AND sl.reps IS NOT NULL
         AND COALESCE(ce.exercise_definition_id, 'name:' || ce.exercise_name) = ?
       ORDER BY ws.completed_at DESC, ws.id DESC, ce.order_index ASC, ce.id ASC, sl.set_number ASC;`,
      exerciseHistoryKey
    );
    const performancesBySessionId = new Map<string, ExerciseHistoryAccumulator>();

    for (const row of rows) {
      const performance = performancesBySessionId.get(row.session_id) ?? {
        completedAt: row.completed_at,
        exerciseNotes: row.exercise_notes,
        sessionId: row.session_id,
        templateDayName: row.template_day_name,
        templateName: row.template_name,
        workingSets: [],
      };

      performance.workingSets.push({
        id: row.set_id,
        reps: row.reps,
        setNumber: row.set_number,
        weight: row.weight,
      });
      performancesBySessionId.set(row.session_id, performance);
    }

    return [...performancesBySessionId.values()].map((performance) => ({
      ...performance,
      bestSet: [...performance.workingSets].sort(compareBestSet)[0] ?? null,
    }));
  }
}
