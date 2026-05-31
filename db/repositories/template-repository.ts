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

export type WorkoutTemplateListItem = WorkoutTemplate & {
  dayCount: number;
};

export type ExercisePrescriptionDetail = ExercisePrescription & {
  exerciseName: string;
  progressionMethod: string | null;
};

export type TemplateDayDetail = TemplateDay & {
  prescriptions: ExercisePrescriptionDetail[];
};

export type WorkoutTemplateDetail = WorkoutTemplate & {
  days: TemplateDayDetail[];
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

type WorkoutTemplateListItemRow = WorkoutTemplateRow & {
  day_count: number;
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

type ExercisePrescriptionDetailRow = ExercisePrescriptionRow & {
  exercise_name: string;
  progression_method: string | null;
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

function createEntityId(prefix: string): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

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

function mapExercisePrescriptionDetailRow(
  row: ExercisePrescriptionDetailRow
): ExercisePrescriptionDetail {
  return {
    ...mapExercisePrescriptionRow(row),
    exerciseName: row.exercise_name,
    progressionMethod: row.progression_method,
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

  async listWorkoutTemplateItems(): Promise<WorkoutTemplateListItem[]> {
    const rows = await this.database.getAllAsync<WorkoutTemplateListItemRow>(
      `SELECT
         wt.id,
         wt.code,
         wt.name,
         wt.order_index,
         wt.is_active,
         wt.description,
         wt.goal,
         wt.split_type,
         wt.source_type,
         wt.is_editable,
         wt.origin_template_id,
         wt.created_at,
         wt.updated_at,
         COUNT(td.id) AS day_count
       FROM workout_templates wt
       LEFT JOIN template_days td ON td.template_id = wt.id
       GROUP BY wt.id
       ORDER BY
         CASE wt.source_type WHEN 'prebuilt' THEN 0 ELSE 1 END,
         wt.order_index ASC,
         wt.name ASC,
         wt.id ASC;`
    );

    return rows.map((row) => ({
      ...mapWorkoutTemplateRow(row),
      dayCount: row.day_count,
    }));
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

  async listExercisePrescriptionDetails(templateDayId: string): Promise<ExercisePrescriptionDetail[]> {
    const rows = await this.database.getAllAsync<ExercisePrescriptionDetailRow>(
      `SELECT
         ep.id,
         ep.template_day_id,
         ep.exercise_definition_id,
         ep.progression_policy_id,
         ep.exercise_order,
         ep.sets,
         ep.rep_range_min,
         ep.rep_range_max,
         ep.muscle_group,
         ep.load_increment,
         ep.rest_seconds,
         ep.notes,
         ep.created_at,
         ep.updated_at,
         ed.name AS exercise_name,
         pp.method AS progression_method
       FROM exercise_prescriptions ep
       INNER JOIN exercise_definitions ed ON ed.id = ep.exercise_definition_id
       LEFT JOIN progression_policies pp ON pp.id = ep.progression_policy_id
       WHERE ep.template_day_id = ?
       ORDER BY ep.exercise_order ASC, ep.id ASC;`,
      templateDayId
    );

    return rows.map(mapExercisePrescriptionDetailRow);
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

  async getWorkoutTemplateDetail(templateId: string): Promise<WorkoutTemplateDetail | null> {
    const template = await this.getWorkoutTemplateById(templateId);

    if (!template) {
      return null;
    }

    const days = await this.listTemplateDays(templateId);
    const daysWithPrescriptions = await Promise.all(
      days.map(async (day) => ({
        ...day,
        prescriptions: await this.listExercisePrescriptionDetails(day.id),
      }))
    );

    return {
      ...template,
      days: daysWithPrescriptions,
    };
  }

  async duplicateTemplateToCustom(templateId: string): Promise<WorkoutTemplate> {
    const sourceTemplate = await this.getWorkoutTemplateById(templateId);

    if (!sourceTemplate) {
      throw new Error('Template not found.');
    }

    const now = new Date().toISOString();
    const duplicateTemplateId = createEntityId('custom-template');
    const duplicateCode = `${sourceTemplate.code}-copy-${Date.now()}`;
    let duplicateOrderIndex = sourceTemplate.orderIndex + 1000;

    await this.database.withTransactionAsync(async () => {
      const maxCustomOrder = await this.database.getFirstAsync<{ max_order_index: number | null }>(
        `SELECT MAX(order_index) AS max_order_index
         FROM workout_templates
         WHERE source_type = 'custom';`
      );

      duplicateOrderIndex = (maxCustomOrder?.max_order_index ?? 199) + 1;

      await this.database.runAsync(
        `INSERT INTO workout_templates (
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
         )
         VALUES (?, ?, ?, ?, 0, ?, ?, ?, 'custom', 1, ?, ?, ?);`,
        duplicateTemplateId,
        duplicateCode,
        `${sourceTemplate.name} (Copy)`,
        duplicateOrderIndex,
        sourceTemplate.description,
        sourceTemplate.goal,
        sourceTemplate.splitType,
        sourceTemplate.id,
        now,
        now
      );

      const sourceDays = await this.listTemplateDays(sourceTemplate.id);

      for (const sourceDay of sourceDays) {
        const duplicateDayId = createEntityId('custom-day');

        await this.database.runAsync(
          `INSERT INTO template_days (
             id,
             template_id,
             name,
             day_order,
             focus,
             created_at,
             updated_at
           )
           VALUES (?, ?, ?, ?, ?, ?, ?);`,
          duplicateDayId,
          duplicateTemplateId,
          sourceDay.name,
          sourceDay.dayOrder,
          sourceDay.focus,
          now,
          now
        );

        const sourcePrescriptions = await this.listExercisePrescriptions(sourceDay.id);

        for (const sourcePrescription of sourcePrescriptions) {
          await this.database.runAsync(
            `INSERT INTO exercise_prescriptions (
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
             )
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            createEntityId('custom-prescription'),
            duplicateDayId,
            sourcePrescription.exerciseDefinitionId,
            sourcePrescription.progressionPolicyId,
            sourcePrescription.exerciseOrder,
            sourcePrescription.sets,
            sourcePrescription.repRangeMin,
            sourcePrescription.repRangeMax,
            sourcePrescription.muscleGroup,
            sourcePrescription.loadIncrement,
            sourcePrescription.restSeconds,
            sourcePrescription.notes,
            now,
            now
          );
        }
      }
    });

    const duplicatedTemplate = await this.getWorkoutTemplateById(duplicateTemplateId);

    if (!duplicatedTemplate) {
      throw new Error('Failed to duplicate template.');
    }

    return duplicatedTemplate;
  }
}
