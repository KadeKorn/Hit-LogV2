import type { SQLiteDatabase } from 'expo-sqlite';

import type { ProgressCompletedWorkout, ProgressRawData, ProgressTrainingSet } from '@/lib/progress-analysis';

type CompletedWorkoutRow = {
  completed_at: string;
  id: string;
};

type ProgressTrainingSetRow = {
  completed_at: string;
  exercise_history_key: string;
  exercise_name: string;
  muscle_group: string | null;
  reps: number;
  session_id: string;
  set_number: number;
  weight: number | null;
};

export class ProgressRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  async getProgressRawData(): Promise<ProgressRawData> {
    const [completedWorkoutRows, setRows] = await Promise.all([
      this.database.getAllAsync<CompletedWorkoutRow>(
        `SELECT
           id,
           completed_at
         FROM workout_sessions
         WHERE status = 'completed'
           AND completed_at IS NOT NULL
         ORDER BY completed_at ASC, id ASC;`
      ),
      this.database.getAllAsync<ProgressTrainingSetRow>(
        `SELECT
           ws.id AS session_id,
           ws.completed_at,
           COALESCE(ce.exercise_definition_id, 'name:' || ce.exercise_name) AS exercise_history_key,
           ce.exercise_name,
           COALESCE(ce.muscle_group, ed.primary_muscle_group) AS muscle_group,
           sl.set_number,
           sl.weight,
           sl.reps
         FROM workout_sessions ws
         INNER JOIN completed_exercises ce ON ce.workout_session_id = ws.id
         LEFT JOIN exercise_definitions ed ON ed.id = ce.exercise_definition_id
         INNER JOIN set_logs sl ON sl.completed_exercise_id = ce.id
         WHERE ws.status = 'completed'
           AND ws.completed_at IS NOT NULL
           AND sl.is_warmup = 0
           AND sl.reps IS NOT NULL
           AND sl.reps > 0
         ORDER BY ws.completed_at ASC, ws.id ASC, ce.order_index ASC, ce.id ASC, sl.set_number ASC;`
      ),
    ]);

    const completedWorkouts: ProgressCompletedWorkout[] = completedWorkoutRows.map((row) => ({
      completedAt: row.completed_at,
      id: row.id,
    }));
    const workingSets: ProgressTrainingSet[] = setRows.map((row) => ({
      completedAt: row.completed_at,
      exerciseHistoryKey: row.exercise_history_key,
      exerciseName: row.exercise_name,
      muscleGroup: row.muscle_group,
      reps: row.reps,
      sessionId: row.session_id,
      setNumber: row.set_number,
      weight: row.weight,
    }));

    return {
      completedWorkouts,
      workingSets,
    };
  }
}
