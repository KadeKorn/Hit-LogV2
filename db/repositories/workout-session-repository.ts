import type { SQLiteDatabase } from 'expo-sqlite';

import { ActiveRoutineRepository } from '@/db/repositories/active-routine-repository';
import type {
  CompletedExercise,
  EffortRating,
  SetLog,
  WorkoutSession,
} from '@/types/domain';

type WorkoutSessionRow = {
  active_routine_id: string | null;
  completed_at: string | null;
  created_at: string;
  id: string;
  notes: string | null;
  started_at: string;
  status: WorkoutSession['status'];
  template_day_id: string | null;
  template_id: string | null;
  updated_at: string;
};

type CompletedExerciseRow = {
  created_at: string;
  effort_rating: EffortRating | null;
  estimated_rir: 0 | 1 | 2 | 3 | null;
  exercise_definition_id: string | null;
  exercise_name: string;
  id: string;
  is_substitution: number;
  muscle_group: string | null;
  notes: string | null;
  order_index: number;
  planned_exercise_prescription_id: string | null;
  planned_rep_max: number | null;
  planned_rep_min: number | null;
  planned_sets: number | null;
  substituted_for_exercise_definition_id: string | null;
  updated_at: string;
  workout_session_id: string;
};

type CompletedExerciseDetailRow = CompletedExerciseRow & {
  progression_method: string | null;
  rest_seconds: number | null;
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

type ExercisePrescriptionSessionRow = {
  exercise_definition_id: string;
  exercise_name: string;
  exercise_order: number;
  id: string;
  muscle_group: string;
  rep_range_max: number;
  rep_range_min: number;
  sets: number;
};

export type WorkoutSessionExerciseDetail = CompletedExercise & {
  progressionMethod: string | null;
  restSeconds: number | null;
  setLogs: SetLog[];
};

export type WorkoutSessionDetail = WorkoutSession & {
  activeRoutineName: string | null;
  exercises: WorkoutSessionExerciseDetail[];
  templateDayName: string | null;
  templateName: string | null;
};

export type ReplaceSetLogInput = {
  isWarmup: boolean;
  reps: number | null;
  setNumber: number;
  weight: number | null;
};

export type CompleteWorkoutSessionInput = {
  exercises: {
    effortRating: EffortRating | null;
    estimatedRir: 0 | 1 | 2 | 3 | null;
    id: string;
    isSubstitution: boolean;
    notes: string | null;
    performedExerciseName: string | null;
    setLogs: ReplaceSetLogInput[];
  }[];
};

function createEntityId(prefix: string): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function toSqliteBoolean(value: boolean): number {
  return value ? 1 : 0;
}

function mapWorkoutSessionRow(row: WorkoutSessionRow): WorkoutSession {
  return {
    id: row.id,
    activeRoutineId: row.active_routine_id,
    templateId: row.template_id,
    templateDayId: row.template_day_id,
    status: row.status,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapCompletedExerciseRow(row: CompletedExerciseRow): CompletedExercise {
  return {
    id: row.id,
    workoutSessionId: row.workout_session_id,
    plannedExercisePrescriptionId: row.planned_exercise_prescription_id,
    exerciseDefinitionId: row.exercise_definition_id,
    exerciseName: row.exercise_name,
    muscleGroup: row.muscle_group,
    plannedSets: row.planned_sets,
    plannedRepMin: row.planned_rep_min,
    plannedRepMax: row.planned_rep_max,
    isSubstitution: row.is_substitution === 1,
    substitutedForExerciseDefinitionId: row.substituted_for_exercise_definition_id,
    orderIndex: row.order_index,
    notes: row.notes,
    effortRating: row.effort_rating,
    estimatedRir: row.estimated_rir,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapSetLogRow(row: SetLogRow): SetLog {
  return {
    id: row.id,
    completedExerciseId: row.completed_exercise_id,
    setNumber: row.set_number,
    weight: row.weight,
    reps: row.reps,
    isWarmup: row.is_warmup === 1,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class WorkoutSessionRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  async getActiveWorkoutSession(activeRoutineId?: string): Promise<WorkoutSession | null> {
    const params = activeRoutineId ? [activeRoutineId] : [];
    const row = await this.database.getFirstAsync<WorkoutSessionRow>(
      `SELECT
         id,
         active_routine_id,
         template_id,
         template_day_id,
         status,
         started_at,
         completed_at,
         notes,
         created_at,
         updated_at
       FROM workout_sessions
       WHERE status = 'active'
         ${activeRoutineId ? 'AND active_routine_id = ?' : ''}
       ORDER BY started_at DESC, id DESC
       LIMIT 1;`,
      ...params
    );

    return row ? mapWorkoutSessionRow(row) : null;
  }

  async createWorkoutSessionFromActiveRoutine(): Promise<WorkoutSession> {
    const activeRoutineRepository = new ActiveRoutineRepository(this.database);
    const activeRoutine = await activeRoutineRepository.getActiveRoutine();

    if (!activeRoutine) {
      throw new Error('Select an active routine before starting a workout.');
    }

    const existingSession = await this.getActiveWorkoutSession(activeRoutine.id);

    if (existingSession) {
      return existingSession;
    }

    const templateDays = await this.database.getAllAsync<{ id: string }>(
      `SELECT id
       FROM template_days
       WHERE template_id = ?
       ORDER BY day_order ASC, id ASC;`,
      activeRoutine.templateId
    );
    const templateDayId =
      templateDays.find((day) => day.id === activeRoutine.currentTemplateDayId)?.id ??
      templateDays[0]?.id ??
      null;

    if (!templateDayId) {
      throw new Error('The active routine does not have a template day to start.');
    }

    const now = new Date().toISOString();
    const workoutSessionId = createEntityId('workout-session');

    await this.database.withTransactionAsync(async () => {
      await this.database.runAsync(
        `INSERT INTO workout_sessions (
           id,
           active_routine_id,
           template_id,
           template_day_id,
           status,
           started_at,
           completed_at,
           notes,
           created_at,
           updated_at
         )
         VALUES (?, ?, ?, ?, 'active', ?, NULL, NULL, ?, ?);`,
        workoutSessionId,
        activeRoutine.id,
        activeRoutine.templateId,
        templateDayId,
        now,
        now,
        now
      );

      const prescriptions = await this.database.getAllAsync<ExercisePrescriptionSessionRow>(
        `SELECT
           ep.id,
           ep.exercise_definition_id,
           ep.exercise_order,
           ep.sets,
           ep.rep_range_min,
           ep.rep_range_max,
           ep.muscle_group,
           ed.name AS exercise_name
         FROM exercise_prescriptions ep
         INNER JOIN exercise_definitions ed ON ed.id = ep.exercise_definition_id
         WHERE ep.template_day_id = ?
         ORDER BY ep.exercise_order ASC, ep.id ASC;`,
        templateDayId
      );

      for (const prescription of prescriptions) {
        await this.database.runAsync(
          `INSERT INTO completed_exercises (
             id,
             workout_session_id,
             planned_exercise_prescription_id,
             exercise_definition_id,
             exercise_name,
             muscle_group,
             planned_sets,
             planned_rep_min,
             planned_rep_max,
             is_substitution,
             substituted_for_exercise_definition_id,
             order_index,
             notes,
             effort_rating,
             estimated_rir,
             created_at,
             updated_at
           )
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NULL, ?, NULL, NULL, NULL, ?, ?);`,
          createEntityId('completed-exercise'),
          workoutSessionId,
          prescription.id,
          prescription.exercise_definition_id,
          prescription.exercise_name,
          prescription.muscle_group,
          prescription.sets,
          prescription.rep_range_min,
          prescription.rep_range_max,
          prescription.exercise_order,
          now,
          now
        );
      }
    });

    const session = await this.getWorkoutSessionById(workoutSessionId);

    if (!session) {
      throw new Error('Failed to create workout session.');
    }

    return session;
  }

  async getWorkoutSessionById(sessionId: string): Promise<WorkoutSessionDetail | null> {
    const sessionRow = await this.database.getFirstAsync<
      WorkoutSessionRow & {
        template_day_name: string | null;
        template_name: string | null;
      }
    >(
      `SELECT
         ws.id,
         ws.active_routine_id,
         ws.template_id,
         ws.template_day_id,
         ws.status,
         ws.started_at,
         ws.completed_at,
         ws.notes,
         ws.created_at,
         ws.updated_at,
         wt.name AS template_name,
         td.name AS template_day_name
       FROM workout_sessions ws
       LEFT JOIN workout_templates wt ON wt.id = ws.template_id
       LEFT JOIN template_days td ON td.id = ws.template_day_id
       WHERE ws.id = ?
       LIMIT 1;`,
      sessionId
    );

    if (!sessionRow) {
      return null;
    }

    const exerciseRows = await this.database.getAllAsync<CompletedExerciseDetailRow>(
      `SELECT
         ce.id,
         ce.workout_session_id,
         ce.planned_exercise_prescription_id,
         ce.exercise_definition_id,
         ce.exercise_name,
         ce.muscle_group,
         ce.planned_sets,
         ce.planned_rep_min,
         ce.planned_rep_max,
         ce.is_substitution,
         ce.substituted_for_exercise_definition_id,
         ce.order_index,
         ce.notes,
         ce.effort_rating,
         ce.estimated_rir,
         ce.created_at,
         ce.updated_at,
         ep.rest_seconds,
         pp.method AS progression_method
       FROM completed_exercises ce
       LEFT JOIN exercise_prescriptions ep ON ep.id = ce.planned_exercise_prescription_id
       LEFT JOIN progression_policies pp ON pp.id = ep.progression_policy_id
       WHERE ce.workout_session_id = ?
       ORDER BY ce.order_index ASC, ce.id ASC;`,
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
             ORDER BY completed_exercise_id ASC, set_number ASC, id ASC;`,
            ...exerciseIds
          )
        : [];
    const setLogsByExerciseId = new Map<string, SetLog[]>();

    for (const setRow of setRows) {
      const setLogs = setLogsByExerciseId.get(setRow.completed_exercise_id) ?? [];
      setLogs.push(mapSetLogRow(setRow));
      setLogsByExerciseId.set(setRow.completed_exercise_id, setLogs);
    }

    return {
      ...mapWorkoutSessionRow(sessionRow),
      activeRoutineName: sessionRow.template_name,
      templateName: sessionRow.template_name,
      templateDayName: sessionRow.template_day_name,
      exercises: exerciseRows.map((row) => ({
        ...mapCompletedExerciseRow(row),
        progressionMethod: row.progression_method,
        restSeconds: row.rest_seconds,
        setLogs: setLogsByExerciseId.get(row.id) ?? [],
      })),
    };
  }

  async updateCompletedExerciseNotes(completedExerciseId: string, notes: string | null): Promise<void> {
    await this.database.runAsync(
      `UPDATE completed_exercises
       SET notes = ?,
           updated_at = ?
       WHERE id = ?;`,
      notes,
      new Date().toISOString(),
      completedExerciseId
    );
  }

  async updateCompletedExerciseEffort(
    completedExerciseId: string,
    effortRating: EffortRating | null,
    estimatedRir: 0 | 1 | 2 | 3 | null
  ): Promise<void> {
    await this.database.runAsync(
      `UPDATE completed_exercises
       SET effort_rating = ?,
           estimated_rir = ?,
           updated_at = ?
       WHERE id = ?;`,
      effortRating,
      estimatedRir,
      new Date().toISOString(),
      completedExerciseId
    );
  }

  async replaceSetLogs(
    completedExerciseId: string,
    setLogs: ReplaceSetLogInput[]
  ): Promise<void> {
    const now = new Date().toISOString();

    await this.database.withTransactionAsync(async () => {
      await this.database.runAsync(
        `DELETE FROM set_logs
         WHERE completed_exercise_id = ?;`,
        completedExerciseId
      );

      for (const setLog of setLogs) {
        await this.database.runAsync(
          `INSERT INTO set_logs (
             id,
             completed_exercise_id,
             set_number,
             weight,
             reps,
             is_warmup,
             notes,
             created_at,
             updated_at
           )
           VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?);`,
          createEntityId('set-log'),
          completedExerciseId,
          setLog.setNumber,
          setLog.weight,
          setLog.reps,
          toSqliteBoolean(setLog.isWarmup),
          now,
          now
        );
      }
    });
  }

  async completeWorkoutSession(
    sessionId: string,
    input: CompleteWorkoutSessionInput
  ): Promise<WorkoutSessionDetail> {
    const now = new Date().toISOString();
    let activeRoutineId: string | null = null;

    await this.database.withTransactionAsync(async () => {
      const session = await this.database.getFirstAsync<WorkoutSessionRow>(
        `SELECT
           id,
           active_routine_id,
           template_id,
           template_day_id,
           status,
           started_at,
           completed_at,
           notes,
           created_at,
           updated_at
         FROM workout_sessions
         WHERE id = ?
         LIMIT 1;`,
        sessionId
      );

      if (!session) {
        throw new Error('Workout session not found.');
      }

      activeRoutineId = session.active_routine_id;

      for (const exercise of input.exercises) {
        await this.database.runAsync(
          `UPDATE completed_exercises
           SET notes = ?,
               exercise_name = ?,
               exercise_definition_id = CASE WHEN ? = 1 THEN NULL ELSE exercise_definition_id END,
               is_substitution = ?,
               substituted_for_exercise_definition_id =
                 CASE WHEN ? = 1 THEN exercise_definition_id ELSE NULL END,
               effort_rating = ?,
               estimated_rir = ?,
               updated_at = ?
           WHERE id = ?
             AND workout_session_id = ?;`,
          exercise.notes,
          exercise.performedExerciseName,
          toSqliteBoolean(exercise.isSubstitution),
          toSqliteBoolean(exercise.isSubstitution),
          toSqliteBoolean(exercise.isSubstitution),
          exercise.effortRating,
          exercise.estimatedRir,
          now,
          exercise.id,
          sessionId
        );

        await this.database.runAsync(
          `DELETE FROM set_logs
           WHERE completed_exercise_id = ?;`,
          exercise.id
        );

        for (const setLog of exercise.setLogs) {
          await this.database.runAsync(
            `INSERT INTO set_logs (
               id,
               completed_exercise_id,
               set_number,
               weight,
               reps,
               is_warmup,
               notes,
               created_at,
               updated_at
             )
             VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?);`,
            createEntityId('set-log'),
            exercise.id,
            setLog.setNumber,
            setLog.weight,
            setLog.reps,
            toSqliteBoolean(setLog.isWarmup),
            now,
            now
          );
        }
      }

      await this.database.runAsync(
        `UPDATE workout_sessions
         SET status = 'completed',
             completed_at = ?,
             updated_at = ?
         WHERE id = ?;`,
        now,
        now,
        sessionId
      );

      if (session.active_routine_id) {
        await this.database.runAsync(
          `UPDATE active_routines
           SET last_workout_session_id = ?,
               updated_at = ?
           WHERE id = ?
             AND status = 'active';`,
          sessionId,
          now,
          session.active_routine_id
        );
      }
    });

    if (activeRoutineId) {
      await new ActiveRoutineRepository(this.database).advanceActiveRoutineToNextTemplateDay(
        activeRoutineId
      );
    }

    const completedSession = await this.getWorkoutSessionById(sessionId);

    if (!completedSession) {
      throw new Error('Failed to complete workout session.');
    }

    return completedSession;
  }
}
