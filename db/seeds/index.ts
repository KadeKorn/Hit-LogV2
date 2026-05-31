import type { SQLiteDatabase } from 'expo-sqlite';

import {
  prebuiltTemplateDaySeeds,
  prebuiltTemplateSeeds,
  type SeedPrebuiltTemplateRecord,
  type SeedTemplateDayRecord,
} from '@/db/seeds/prebuilt-templates';
import {
  planCTemplateExerciseSeeds,
  planCTemplateSeeds,
  type SeedTemplateExerciseRecord,
  type SeedTemplateRecord,
} from '@/db/seeds/plan-c';

function toSqliteBoolean(value: boolean): number {
  return value ? 1 : 0;
}

async function upsertSeedTemplate(
  database: SQLiteDatabase,
  template: SeedTemplateRecord
): Promise<void> {
  await database.runAsync(
    `INSERT INTO workout_templates (id, code, name, order_index, is_active)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       code = excluded.code,
       name = excluded.name,
       order_index = excluded.order_index,
       is_active = excluded.is_active;`,
    template.id,
    template.code,
    template.name,
    template.orderIndex,
    toSqliteBoolean(template.isActive)
  );
}

async function upsertSeedTemplateExercise(
  database: SQLiteDatabase,
  exercise: SeedTemplateExerciseRecord
): Promise<void> {
  await database.runAsync(
    `INSERT INTO workout_template_exercises (id, template_id, name, order_index, is_active)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       template_id = excluded.template_id,
       name = excluded.name,
       order_index = excluded.order_index,
       is_active = excluded.is_active;`,
    exercise.id,
    exercise.templateId,
    exercise.name,
    exercise.orderIndex,
    toSqliteBoolean(exercise.isActive)
  );
}

async function upsertPrebuiltTemplate(
  database: SQLiteDatabase,
  template: SeedPrebuiltTemplateRecord
): Promise<void> {
  await database.runAsync(
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
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       code = excluded.code,
       name = excluded.name,
       order_index = excluded.order_index,
       is_active = excluded.is_active,
       description = excluded.description,
       goal = excluded.goal,
       split_type = excluded.split_type,
       source_type = excluded.source_type,
       is_editable = excluded.is_editable,
       origin_template_id = excluded.origin_template_id,
       updated_at = excluded.updated_at;`,
    template.id,
    template.code,
    template.name,
    template.orderIndex,
    toSqliteBoolean(template.isActive),
    template.description,
    template.goal,
    template.splitType,
    template.sourceType,
    toSqliteBoolean(template.isEditable),
    template.createdAt,
    template.updatedAt
  );
}

async function upsertTemplateDay(
  database: SQLiteDatabase,
  templateDay: SeedTemplateDayRecord
): Promise<void> {
  await database.runAsync(
    `INSERT INTO template_days (
       id,
       template_id,
       name,
       day_order,
       focus,
       created_at,
       updated_at
     )
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       template_id = excluded.template_id,
       name = excluded.name,
       day_order = excluded.day_order,
       focus = excluded.focus,
       updated_at = excluded.updated_at;`,
    templateDay.id,
    templateDay.templateId,
    templateDay.name,
    templateDay.dayOrder,
    templateDay.focus,
    templateDay.createdAt,
    templateDay.updatedAt
  );
}

export async function runSeeds(database: SQLiteDatabase): Promise<void> {
  await database.withTransactionAsync(async () => {
    for (const template of planCTemplateSeeds) {
      await upsertSeedTemplate(database, template);
    }

    for (const exercise of planCTemplateExerciseSeeds) {
      await upsertSeedTemplateExercise(database, exercise);
    }

    for (const template of prebuiltTemplateSeeds) {
      await upsertPrebuiltTemplate(database, template);
    }

    for (const templateDay of prebuiltTemplateDaySeeds) {
      await upsertTemplateDay(database, templateDay);
    }
  });
}
