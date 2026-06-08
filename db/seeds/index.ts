import type { SQLiteDatabase } from 'expo-sqlite';

import {
  mvpExerciseDefinitionSeeds,
  mvpExercisePrescriptionSeeds,
  mvpProgressionPolicySeeds,
  prebuiltTemplateDaySeeds,
  prebuiltTemplateSeeds,
  type SeedExerciseDefinitionRecord,
  type SeedExercisePrescriptionRecord,
  type SeedPrebuiltTemplateRecord,
  type SeedProgressionPolicyRecord,
  type SeedTemplateDayRecord,
} from '@/db/seeds/prebuilt-templates';
import {
  planCTemplateExerciseSeeds,
  planCTemplateSeeds,
  type SeedTemplateExerciseRecord,
  type SeedTemplateRecord,
} from '@/db/seeds/plan-c';
import { runDatabaseStartupStep } from '@/db/startup-diagnostics';

function toSqliteBoolean(value: boolean): number {
  return value ? 1 : 0;
}

async function runSeedStatement(
  database: SQLiteDatabase,
  label: string,
  statement: string,
  ...params: (number | string | null)[]
): Promise<void> {
  await runDatabaseStartupStep(label, () => database.runAsync(statement, ...params), statement);
}

async function upsertSeedTemplate(
  database: SQLiteDatabase,
  template: SeedTemplateRecord
): Promise<void> {
  await runSeedStatement(
    database,
    `seed workout_templates legacy ${template.id}`,
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
  await runSeedStatement(
    database,
    `seed workout_template_exercises ${exercise.id}`,
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
  await runSeedStatement(
    database,
    `seed workout_templates prebuilt ${template.id}`,
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
  await runSeedStatement(
    database,
    `seed template_days ${templateDay.id}`,
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

async function upsertExerciseDefinition(
  database: SQLiteDatabase,
  exerciseDefinition: SeedExerciseDefinitionRecord
): Promise<void> {
  await runSeedStatement(
    database,
    `seed exercise_definitions ${exerciseDefinition.id}`,
    `INSERT INTO exercise_definitions (
       id,
       name,
       primary_muscle_group,
       secondary_muscle_groups,
       category,
       equipment,
       movement_pattern,
       difficulty,
       notes,
       source_type,
       default_rep_min,
       default_rep_max,
       default_progression_method,
       default_load_increment,
       default_rest_seconds,
       created_at,
       updated_at
     )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       primary_muscle_group = excluded.primary_muscle_group,
       secondary_muscle_groups = excluded.secondary_muscle_groups,
       category = excluded.category,
       equipment = excluded.equipment,
       movement_pattern = excluded.movement_pattern,
       difficulty = excluded.difficulty,
       notes = excluded.notes,
       source_type = excluded.source_type,
       default_rep_min = excluded.default_rep_min,
       default_rep_max = excluded.default_rep_max,
       default_progression_method = excluded.default_progression_method,
       default_load_increment = excluded.default_load_increment,
       default_rest_seconds = excluded.default_rest_seconds,
       updated_at = excluded.updated_at;`,
    exerciseDefinition.id,
    exerciseDefinition.name,
    exerciseDefinition.primaryMuscleGroup,
    exerciseDefinition.secondaryMuscleGroups
      ? JSON.stringify(exerciseDefinition.secondaryMuscleGroups)
      : null,
    exerciseDefinition.category,
    exerciseDefinition.equipment,
    exerciseDefinition.movementPattern,
    exerciseDefinition.difficulty,
    exerciseDefinition.notes,
    exerciseDefinition.sourceType,
    exerciseDefinition.defaultRepMin,
    exerciseDefinition.defaultRepMax,
    exerciseDefinition.defaultProgressionMethod,
    exerciseDefinition.defaultLoadIncrement,
    exerciseDefinition.defaultRestSeconds,
    exerciseDefinition.createdAt,
    exerciseDefinition.updatedAt
  );
}

async function upsertProgressionPolicy(
  database: SQLiteDatabase,
  progressionPolicy: SeedProgressionPolicyRecord
): Promise<void> {
  await runSeedStatement(
    database,
    `seed progression_policies ${progressionPolicy.id}`,
    `INSERT INTO progression_policies (
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
     )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       method = excluded.method,
       target_rep_min = excluded.target_rep_min,
       target_rep_max = excluded.target_rep_max,
       load_increment = excluded.load_increment,
       require_all_sets_at_top = excluded.require_all_sets_at_top,
       allow_deload_flag = excluded.allow_deload_flag,
       notes = excluded.notes,
       updated_at = excluded.updated_at;`,
    progressionPolicy.id,
    progressionPolicy.method,
    progressionPolicy.targetRepMin,
    progressionPolicy.targetRepMax,
    progressionPolicy.loadIncrement,
    toSqliteBoolean(progressionPolicy.requireAllSetsAtTop),
    toSqliteBoolean(progressionPolicy.allowDeloadFlag),
    progressionPolicy.notes,
    progressionPolicy.createdAt,
    progressionPolicy.updatedAt
  );
}

async function upsertExercisePrescription(
  database: SQLiteDatabase,
  prescription: SeedExercisePrescriptionRecord
): Promise<void> {
  await runSeedStatement(
    database,
    `seed exercise_prescriptions ${prescription.id}`,
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
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       template_day_id = excluded.template_day_id,
       exercise_definition_id = excluded.exercise_definition_id,
       progression_policy_id = excluded.progression_policy_id,
       exercise_order = excluded.exercise_order,
       sets = excluded.sets,
       rep_range_min = excluded.rep_range_min,
       rep_range_max = excluded.rep_range_max,
       muscle_group = excluded.muscle_group,
       load_increment = excluded.load_increment,
       rest_seconds = excluded.rest_seconds,
       notes = excluded.notes,
       updated_at = excluded.updated_at;`,
    prescription.id,
    prescription.templateDayId,
    prescription.exerciseDefinitionId,
    prescription.progressionPolicyId,
    prescription.exerciseOrder,
    prescription.sets,
    prescription.repRangeMin,
    prescription.repRangeMax,
    prescription.muscleGroup,
    prescription.loadIncrement,
    prescription.restSeconds,
    prescription.notes,
    prescription.createdAt,
    prescription.updatedAt
  );
}

export async function runSeeds(database: SQLiteDatabase): Promise<void> {
  await runDatabaseStartupStep('seeds transaction', () =>
    database.withTransactionAsync(async () => {
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

      for (const exerciseDefinition of mvpExerciseDefinitionSeeds) {
        await upsertExerciseDefinition(database, exerciseDefinition);
      }

      for (const progressionPolicy of mvpProgressionPolicySeeds) {
        await upsertProgressionPolicy(database, progressionPolicy);
      }

      for (const prescription of mvpExercisePrescriptionSeeds) {
        await upsertExercisePrescription(database, prescription);
      }
    })
  );
}
