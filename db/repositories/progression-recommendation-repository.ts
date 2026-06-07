import type { SQLiteDatabase } from 'expo-sqlite';

import {
  calculateProgressionRecommendation,
  type ProgressionWorkingSet,
} from '@/lib/progression';
import type {
  ProgressionMethod,
  ProgressionRecommendation,
} from '@/types/domain';

type CurrentExerciseProgressionRow = {
  completed_exercise_id: string;
  default_load_increment: number | null;
  default_progression_method: ProgressionMethod | null;
  default_rep_max: number | null;
  default_rep_min: number | null;
  exercise_definition_id: string | null;
  planned_rep_max: number | null;
  planned_rep_min: number | null;
  planned_sets: number | null;
  policy_load_increment: number | null;
  policy_method: ProgressionMethod | null;
  policy_target_rep_max: number | null;
  policy_target_rep_min: number | null;
  prescription_id: string | null;
  prescription_load_increment: number | null;
};

type HistoryWorkingSetRow = {
  reps: number | null;
  weight: number | null;
};

function resolveProgressionMethod(row: CurrentExerciseProgressionRow): ProgressionMethod {
  return row.policy_method ?? row.default_progression_method ?? 'manual';
}

export class ProgressionRecommendationRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  async getProgressionRecommendationsForWorkoutSession({
    currentWorkoutSessionId,
  }: {
    currentWorkoutSessionId: string;
  }): Promise<Record<string, ProgressionRecommendation>> {
    const rows = await this.database.getAllAsync<CurrentExerciseProgressionRow>(
      `SELECT
         ce.id AS completed_exercise_id,
         ce.planned_exercise_prescription_id AS prescription_id,
         ce.exercise_definition_id,
         ce.planned_sets,
         ce.planned_rep_min,
         ce.planned_rep_max,
         ep.load_increment AS prescription_load_increment,
         pp.method AS policy_method,
         pp.target_rep_min AS policy_target_rep_min,
         pp.target_rep_max AS policy_target_rep_max,
         pp.load_increment AS policy_load_increment,
         ed.default_rep_min,
         ed.default_rep_max,
         ed.default_progression_method,
         ed.default_load_increment
       FROM completed_exercises ce
       LEFT JOIN exercise_prescriptions ep ON ep.id = ce.planned_exercise_prescription_id
       LEFT JOIN progression_policies pp ON pp.id = ep.progression_policy_id
       LEFT JOIN exercise_definitions ed ON ed.id = ce.exercise_definition_id
       WHERE ce.workout_session_id = ?
       ORDER BY ce.order_index ASC, ce.id ASC;`,
      currentWorkoutSessionId
    );

    const recommendations: Record<string, ProgressionRecommendation> = {};

    for (const row of rows) {
      const completedWorkingSets = row.exercise_definition_id
        ? await this.getLastCompletedWorkingSets({
            currentWorkoutSessionId,
            exerciseDefinitionId: row.exercise_definition_id,
          })
        : [];

      recommendations[row.completed_exercise_id] = calculateProgressionRecommendation({
        completedWorkingSets,
        exerciseDefinitionId: row.exercise_definition_id,
        exercisePrescriptionId: row.prescription_id,
        loadIncrement:
          row.policy_load_increment ??
          row.prescription_load_increment ??
          row.default_load_increment,
        method: resolveProgressionMethod(row),
        plannedSets: row.planned_sets,
        targetRepMax:
          row.policy_target_rep_max ?? row.planned_rep_max ?? row.default_rep_max,
        targetRepMin:
          row.policy_target_rep_min ?? row.planned_rep_min ?? row.default_rep_min,
      });
    }

    return recommendations;
  }

  private async getLastCompletedWorkingSets({
    currentWorkoutSessionId,
    exerciseDefinitionId,
  }: {
    currentWorkoutSessionId: string;
    exerciseDefinitionId: string;
  }): Promise<ProgressionWorkingSet[]> {
    const rows = await this.database.getAllAsync<HistoryWorkingSetRow>(
      `WITH latest_completed_exercise AS (
         SELECT ce.id
         FROM completed_exercises ce
         INNER JOIN workout_sessions ws ON ws.id = ce.workout_session_id
         WHERE ce.exercise_definition_id = ?
           AND ws.status = 'completed'
           AND ws.completed_at IS NOT NULL
           AND ws.id <> ?
         ORDER BY ws.completed_at DESC, ws.id DESC, ce.order_index ASC, ce.id ASC
         LIMIT 1
       )
       SELECT sl.weight, sl.reps
       FROM set_logs sl
       INNER JOIN latest_completed_exercise lce ON lce.id = sl.completed_exercise_id
       WHERE sl.is_warmup = 0
         AND sl.reps IS NOT NULL
       ORDER BY sl.set_number ASC, sl.id ASC;`,
      exerciseDefinitionId,
      currentWorkoutSessionId
    );

    return rows.map((row) => ({
      reps: row.reps,
      weight: row.weight,
    }));
  }
}
