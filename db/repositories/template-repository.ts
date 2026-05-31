import type { SQLiteDatabase } from 'expo-sqlite';

import type {
  ExercisePrescription,
  TemplateDay,
  WorkoutTemplate,
  WorkoutTemplateWithDays,
} from '@/types/domain';

export type ActiveWorkoutTemplate = {
  code: string;
  id: string;
  name: string;
  orderIndex: number;
};

export type ActiveTemplateExercise = {
  id: string;
  name: string;
  orderIndex: number;
  templateId: string;
};

export type ActiveWorkoutTemplateDetail = ActiveWorkoutTemplate & {
  exercises: ActiveTemplateExercise[];
};

export type NextRecommendedWorkoutDay = {
  activeTemplateCount: number;
  basedOnCompletedWorkoutId: string | null;
  queueReason: 'first-active-template' | 'next-active-template';
  recommendedTemplate: ActiveWorkoutTemplate;
};

type ActiveWorkoutTemplateRow = {
  code: string;
  id: string;
  name: string;
  order_index: number;
};

type ActiveTemplateExerciseRow = {
  id: string;
  name: string;
  order_index: number;
  template_id: string;
};

type LastCompletedTemplateRow = {
  completed_at: string;
  template_id: string;
  template_order_index: number;
  workout_log_id: string;
};

type WorkoutTemplateRow = {
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
  source_type: WorkoutTemplate['sourceType'];
  split_type: string | null;
  updated_at: string;
};

type TemplateDayRow = {
  created_at: string;
  day_order: number;
  focus: string | null;
  id: string;
  name: string;
  template_id: string;
  updated_at: string;
};

type ExercisePrescriptionRow = {
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

function mapWorkoutTemplateRow(row: WorkoutTemplateRow): WorkoutTemplate {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    orderIndex: row.order_index,
    isActive: row.is_active === 1,
    description: row.description,
    goal: row.goal,
    splitType: row.split_type,
    sourceType: row.source_type,
    isEditable: row.is_editable === 1,
    originTemplateId: row.origin_template_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTemplateDayRow(row: TemplateDayRow): TemplateDay {
  return {
    id: row.id,
    templateId: row.template_id,
    name: row.name,
    dayOrder: row.day_order,
    focus: row.focus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapExercisePrescriptionRow(row: ExercisePrescriptionRow): ExercisePrescription {
  return {
    id: row.id,
    templateDayId: row.template_day_id,
    exerciseDefinitionId: row.exercise_definition_id,
    progressionPolicyId: row.progression_policy_id,
    exerciseOrder: row.exercise_order,
    sets: row.sets,
    repRangeMin: row.rep_range_min,
    repRangeMax: row.rep_range_max,
    muscleGroup: row.muscle_group,
    loadIncrement: row.load_increment,
    restSeconds: row.rest_seconds,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class TemplateRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  getClient(): SQLiteDatabase {
    return this.database;
  }

  async getActiveTemplates(): Promise<ActiveWorkoutTemplate[]> {
    const rows = await this.database.getAllAsync<ActiveWorkoutTemplateRow>(
      `SELECT id, code, name, order_index
       FROM workout_templates
       WHERE is_active = 1
       ORDER BY order_index ASC, id ASC;`
    );

    return rows.map((row) => ({
      id: row.id,
      code: row.code,
      name: row.name,
      orderIndex: row.order_index,
    }));
  }

  async getActiveTemplateById(templateId: string): Promise<ActiveWorkoutTemplateDetail | null> {
    const templateRow = await this.database.getFirstAsync<ActiveWorkoutTemplateRow>(
      `SELECT id, code, name, order_index
       FROM workout_templates
       WHERE id = ?
         AND is_active = 1
       LIMIT 1;`,
      templateId
    );

    if (!templateRow) {
      return null;
    }

    const exerciseRows = await this.database.getAllAsync<ActiveTemplateExerciseRow>(
      `SELECT id, template_id, name, order_index
       FROM workout_template_exercises
       WHERE template_id = ?
         AND is_active = 1
       ORDER BY order_index ASC, id ASC;`,
      templateId
    );

    return {
      id: templateRow.id,
      code: templateRow.code,
      name: templateRow.name,
      orderIndex: templateRow.order_index,
      exercises: exerciseRows.map((row) => ({
        id: row.id,
        templateId: row.template_id,
        name: row.name,
        orderIndex: row.order_index,
      })),
    };
  }

  async getNextRecommendedWorkoutDay(): Promise<NextRecommendedWorkoutDay | null> {
    const activeTemplates = await this.getActiveTemplates();

    if (activeTemplates.length === 0) {
      return null;
    }

    const lastCompletedTemplate = await this.database.getFirstAsync<LastCompletedTemplateRow>(
      `SELECT
         wl.id AS workout_log_id,
         wl.completed_at,
         wt.id AS template_id,
         wt.order_index AS template_order_index
       FROM workout_logs wl
       INNER JOIN workout_templates wt ON wt.id = wl.template_id
       WHERE wl.status = 'completed'
         AND wl.completed_at IS NOT NULL
       ORDER BY wl.completed_at DESC, wl.id DESC
       LIMIT 1;`
    );

    if (!lastCompletedTemplate) {
      return {
        recommendedTemplate: activeTemplates[0],
        queueReason: 'first-active-template',
        basedOnCompletedWorkoutId: null,
        activeTemplateCount: activeTemplates.length,
      };
    }

    const nextTemplate =
      activeTemplates.find(
        (template) =>
          template.orderIndex > lastCompletedTemplate.template_order_index ||
          (template.orderIndex === lastCompletedTemplate.template_order_index &&
            template.id > lastCompletedTemplate.template_id)
      ) ?? activeTemplates[0];

    return {
      recommendedTemplate: nextTemplate,
      queueReason: 'next-active-template',
      basedOnCompletedWorkoutId: lastCompletedTemplate.workout_log_id,
      activeTemplateCount: activeTemplates.length,
    };
  }

  async listWorkoutTemplates(): Promise<WorkoutTemplate[]> {
    const rows = await this.database.getAllAsync<WorkoutTemplateRow>(
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
       ORDER BY
         CASE source_type WHEN 'prebuilt' THEN 0 ELSE 1 END,
         order_index ASC,
         name ASC,
         id ASC;`
    );

    return rows.map(mapWorkoutTemplateRow);
  }

  async getWorkoutTemplateById(id: string): Promise<WorkoutTemplate | null> {
    const row = await this.database.getFirstAsync<WorkoutTemplateRow>(
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
       WHERE id = ?
       LIMIT 1;`,
      id
    );

    return row ? mapWorkoutTemplateRow(row) : null;
  }

  async listTemplateDays(templateId: string): Promise<TemplateDay[]> {
    const rows = await this.database.getAllAsync<TemplateDayRow>(
      `SELECT
         id,
         template_id,
         name,
         day_order,
         focus,
         created_at,
         updated_at
       FROM template_days
       WHERE template_id = ?
       ORDER BY day_order ASC, id ASC;`,
      templateId
    );

    return rows.map(mapTemplateDayRow);
  }

  async listExercisePrescriptions(templateDayId: string): Promise<ExercisePrescription[]> {
    const rows = await this.database.getAllAsync<ExercisePrescriptionRow>(
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
       WHERE template_day_id = ?
       ORDER BY exercise_order ASC, id ASC;`,
      templateDayId
    );

    return rows.map(mapExercisePrescriptionRow);
  }

  async getTemplateWithDays(templateId: string): Promise<WorkoutTemplateWithDays | null> {
    const template = await this.getWorkoutTemplateById(templateId);

    if (!template) {
      return null;
    }

    return {
      ...template,
      days: await this.listTemplateDays(templateId),
    };
  }
}
