import type { SQLiteDatabase } from 'expo-sqlite';

export type ExportWorkoutTemplateRow = {
  code: string;
  created_at: string;
  description: string | null;
  goal: string | null;
  id: string;
  is_active: number;
  is_editable: number;
  name: string;
  order_index: number;
  origin_template_id: string | null;
  source_type: string;
  split_type: string | null;
  updated_at: string;
};

export type ExportWorkoutTemplateExerciseRow = {
  id: string;
  is_active: number;
  name: string;
  order_index: number;
  template_id: string;
};

export type ExportWorkoutLogRow = {
  completed_at: string | null;
  id: string;
  started_at: string | null;
  status: string;
  summary: string | null;
  template_id: string;
};

export type ExportExerciseLogRow = {
  carry_forward: number;
  carry_forward_note: string | null;
  exercise_name_snapshot: string;
  id: string;
  notes: string | null;
  order_index: number;
  template_exercise_id: string;
  workout_log_id: string;
};

export type ExportExerciseSetRow = {
  exercise_log_id: string;
  id: string;
  note: string | null;
  reps_text: string;
  set_index: number;
  set_type: string;
  side: string | null;
  weight_text: string;
};

export type ExportTemplateDayRow = {
  created_at: string;
  day_order: number;
  focus: string | null;
  id: string;
  name: string;
  template_id: string;
  updated_at: string;
};

export type ExportExerciseDefinitionRow = {
  category: string | null;
  created_at: string;
  default_load_increment: number | null;
  default_progression_method: string | null;
  default_rep_max: number | null;
  default_rep_min: number | null;
  default_rest_seconds: number | null;
  id: string;
  name: string;
  primary_muscle_group: string;
  secondary_muscle_groups: string | null;
  updated_at: string;
};

export type ExportProgressionPolicyRow = {
  allow_deload_flag: number;
  created_at: string;
  id: string;
  load_increment: number | null;
  method: string;
  notes: string | null;
  require_all_sets_at_top: number;
  target_rep_max: number | null;
  target_rep_min: number | null;
  updated_at: string;
};

export type ExportExercisePrescriptionRow = {
  created_at: string;
  exercise_definition_id: string;
  exercise_order: number;
  id: string;
  load_increment: number | null;
  muscle_group: string;
  notes: string | null;
  progression_policy_id: string | null;
  rep_range_max: number;
  rep_range_min: number;
  rest_seconds: number | null;
  sets: number;
  template_day_id: string;
  updated_at: string;
};

export type ExportActiveRoutineRow = {
  created_at: string;
  current_day_index: number;
  current_template_day_id: string | null;
  id: string;
  last_workout_session_id: string | null;
  started_at: string;
  status: string;
  template_id: string;
  updated_at: string;
};

export type WorkoutJsonExportData = {
  activeRoutines: ExportActiveRoutineRow[];
  exerciseDefinitions: ExportExerciseDefinitionRow[];
  exerciseLogs: ExportExerciseLogRow[];
  exercisePrescriptions: ExportExercisePrescriptionRow[];
  exerciseSets: ExportExerciseSetRow[];
  progressionPolicies: ExportProgressionPolicyRow[];
  templateDays: ExportTemplateDayRow[];
  workoutLogs: ExportWorkoutLogRow[];
  workoutTemplateExercises: ExportWorkoutTemplateExerciseRow[];
  workoutTemplates: ExportWorkoutTemplateRow[];
};

export class JsonExportRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  async getWorkoutJsonExportData(): Promise<WorkoutJsonExportData> {
    const [
      workoutTemplates,
      workoutTemplateExercises,
      workoutLogs,
      exerciseLogs,
      exerciseSets,
      templateDays,
      exerciseDefinitions,
      progressionPolicies,
      exercisePrescriptions,
      activeRoutines,
    ] = await Promise.all([
      this.getWorkoutTemplates(),
      this.getWorkoutTemplateExercises(),
      this.getWorkoutLogs(),
      this.getExerciseLogs(),
      this.getExerciseSets(),
      this.getTemplateDays(),
      this.getExerciseDefinitions(),
      this.getProgressionPolicies(),
      this.getExercisePrescriptions(),
      this.getActiveRoutines(),
    ]);

    return {
      activeRoutines,
      exerciseDefinitions,
      workoutTemplates,
      workoutTemplateExercises,
      workoutLogs,
      exerciseLogs,
      exercisePrescriptions,
      exerciseSets,
      progressionPolicies,
      templateDays,
    };
  }

  private async getWorkoutTemplates(): Promise<ExportWorkoutTemplateRow[]> {
    return this.database.getAllAsync<ExportWorkoutTemplateRow>(
      `SELECT
         id,
         code,
         name,
         order_index,
         is_active,
         description,
         goal,
         split_type,
         source_type,
         is_editable,
         origin_template_id,
         created_at,
         updated_at
       FROM workout_templates
       ORDER BY order_index ASC, id ASC;`
    );
  }

  private async getWorkoutTemplateExercises(): Promise<ExportWorkoutTemplateExerciseRow[]> {
    return this.database.getAllAsync<ExportWorkoutTemplateExerciseRow>(
      `SELECT
         id,
         template_id,
         name,
         order_index,
         is_active
       FROM workout_template_exercises
       ORDER BY template_id ASC, order_index ASC, id ASC;`
    );
  }

  private async getWorkoutLogs(): Promise<ExportWorkoutLogRow[]> {
    return this.database.getAllAsync<ExportWorkoutLogRow>(
      `SELECT
         id,
         template_id,
         started_at,
         completed_at,
         status,
         summary
       FROM workout_logs
       ORDER BY started_at ASC, completed_at ASC, id ASC;`
    );
  }

  private async getExerciseLogs(): Promise<ExportExerciseLogRow[]> {
    return this.database.getAllAsync<ExportExerciseLogRow>(
      `SELECT
         id,
         workout_log_id,
         template_exercise_id,
         exercise_name_snapshot,
         order_index,
         notes,
         carry_forward,
         carry_forward_note
       FROM exercise_logs
       ORDER BY workout_log_id ASC, order_index ASC, id ASC;`
    );
  }

  private async getExerciseSets(): Promise<ExportExerciseSetRow[]> {
    return this.database.getAllAsync<ExportExerciseSetRow>(
      `SELECT
         id,
         exercise_log_id,
         set_index,
         set_type,
         weight_text,
         reps_text,
         side,
         note
       FROM exercise_sets
       ORDER BY exercise_log_id ASC, set_index ASC, id ASC;`
    );
  }

  private async getTemplateDays(): Promise<ExportTemplateDayRow[]> {
    return this.database.getAllAsync<ExportTemplateDayRow>(
      `SELECT
         id,
         template_id,
         name,
         day_order,
         focus,
         created_at,
         updated_at
       FROM template_days
       ORDER BY template_id ASC, day_order ASC, id ASC;`
    );
  }

  private async getExerciseDefinitions(): Promise<ExportExerciseDefinitionRow[]> {
    return this.database.getAllAsync<ExportExerciseDefinitionRow>(
      `SELECT
         id,
         name,
         primary_muscle_group,
         secondary_muscle_groups,
         category,
         default_rep_min,
         default_rep_max,
         default_progression_method,
         default_load_increment,
         default_rest_seconds,
         created_at,
         updated_at
       FROM exercise_definitions
       ORDER BY name ASC, id ASC;`
    );
  }

  private async getProgressionPolicies(): Promise<ExportProgressionPolicyRow[]> {
    return this.database.getAllAsync<ExportProgressionPolicyRow>(
      `SELECT
         id,
         method,
         target_rep_min,
         target_rep_max,
         load_increment,
         require_all_sets_at_top,
         allow_deload_flag,
         notes,
         created_at,
         updated_at
       FROM progression_policies
       ORDER BY method ASC, id ASC;`
    );
  }

  private async getExercisePrescriptions(): Promise<ExportExercisePrescriptionRow[]> {
    return this.database.getAllAsync<ExportExercisePrescriptionRow>(
      `SELECT
         id,
         template_day_id,
         exercise_definition_id,
         progression_policy_id,
         exercise_order,
         sets,
         rep_range_min,
         rep_range_max,
         muscle_group,
         load_increment,
         rest_seconds,
         notes,
         created_at,
         updated_at
       FROM exercise_prescriptions
       ORDER BY template_day_id ASC, exercise_order ASC, id ASC;`
    );
  }

  private async getActiveRoutines(): Promise<ExportActiveRoutineRow[]> {
    return this.database.getAllAsync<ExportActiveRoutineRow>(
      `SELECT
         id,
         template_id,
         current_template_day_id,
         current_day_index,
         status,
         started_at,
         last_workout_session_id,
         created_at,
         updated_at
       FROM active_routines
       ORDER BY started_at ASC, id ASC;`
    );
  }
}
