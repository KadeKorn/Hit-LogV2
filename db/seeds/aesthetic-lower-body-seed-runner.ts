import type { SQLiteDatabase } from 'expo-sqlite';

import {
  aestheticLowerBodyExerciseDefinitionSeeds,
  aestheticLowerBodyExercisePrescriptionSeeds,
  aestheticLowerBodyTemplateDaySeeds,
  aestheticLowerBodyTemplateSeeds,
} from '@/db/seeds/aesthetic-lower-body-template';
import { runDatabaseStartupStep } from '@/db/startup-diagnostics';

function toSqliteBoolean(value: boolean): number {
  return value ? 1 : 0;
}

export async function runAestheticLowerBodySeeds(database: SQLiteDatabase): Promise<void> {
  await runDatabaseStartupStep('seed aesthetic lower-body template transaction', () =>
    database.withTransactionAsync(async () => {
      for (const template of aestheticLowerBodyTemplateSeeds) {
        await database.runAsync(
          `INSERT INTO workout_templates (
             id, code, name, order_index, is_active, description, goal, split_type,
             source_type, is_editable, origin_template_id, created_at, updated_at
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

      for (const day of aestheticLowerBodyTemplateDaySeeds) {
        await database.runAsync(
          `INSERT INTO template_days (
             id, template_id, name, day_order, focus, created_at, updated_at
           )
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             template_id = excluded.template_id,
             name = excluded.name,
             day_order = excluded.day_order,
             focus = excluded.focus,
             updated_at = excluded.updated_at;`,
          day.id,
          day.templateId,
          day.name,
          day.dayOrder,
          day.focus,
          day.createdAt,
          day.updatedAt
        );
      }

      for (const exercise of aestheticLowerBodyExerciseDefinitionSeeds) {
        await database.runAsync(
          `INSERT INTO exercise_definitions (
             id, name, primary_muscle_group, secondary_muscle_groups, category,
             equipment, movement_pattern, difficulty, notes, source_type,
             default_rep_min, default_rep_max, default_progression_method,
             default_load_increment, default_rest_seconds, created_at, updated_at
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
          exercise.id,
          exercise.name,
          exercise.primaryMuscleGroup,
          exercise.secondaryMuscleGroups ? JSON.stringify(exercise.secondaryMuscleGroups) : null,
          exercise.category,
          exercise.equipment,
          exercise.movementPattern,
          exercise.difficulty,
          exercise.notes,
          exercise.sourceType,
          exercise.defaultRepMin,
          exercise.defaultRepMax,
          exercise.defaultProgressionMethod,
          exercise.defaultLoadIncrement,
          exercise.defaultRestSeconds,
          exercise.createdAt,
          exercise.updatedAt
        );
      }

      for (const prescription of aestheticLowerBodyExercisePrescriptionSeeds) {
        await database.runAsync(
          `INSERT INTO exercise_prescriptions (
             id, template_day_id, exercise_definition_id, progression_policy_id,
             exercise_order, sets, rep_range_min, rep_range_max, muscle_group,
             load_increment, rest_seconds, notes, created_at, updated_at
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
    })
  );
}
