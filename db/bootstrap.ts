import type { SQLiteDatabase } from 'expo-sqlite';

import { getDatabaseClient, resetDatabaseClientForFieldTestRecovery } from '@/db/client';
import { runMigrations } from '@/db/migrations';
import { runSeeds } from '@/db/seeds';
import { runDatabaseStartupStep, runForeignKeyCheck } from '@/db/startup-diagnostics';

let bootstrapPromise: Promise<SQLiteDatabase> | null = null;

async function runStartupRepairStatement(
  database: SQLiteDatabase,
  label: string,
  statement: string,
  ...params: (number | string | null)[]
): Promise<void> {
  await runDatabaseStartupStep(label, () => database.runAsync(statement, ...params), statement);
}

async function repairStartupForeignKeyReferences(database: SQLiteDatabase): Promise<void> {
  const now = new Date().toISOString();

  await runDatabaseStartupStep('startup foreign key repair transaction', () =>
    database.withTransactionAsync(async () => {
      await runStartupRepairStatement(
        database,
        'repair completed_exercises planned prescription references',
        `UPDATE completed_exercises
         SET planned_exercise_prescription_id = NULL,
             updated_at = ?
         WHERE planned_exercise_prescription_id IS NOT NULL
           AND NOT EXISTS (
             SELECT 1
             FROM exercise_prescriptions ep
             WHERE ep.id = completed_exercises.planned_exercise_prescription_id
           );`,
        now
      );

      await runStartupRepairStatement(
        database,
        'repair completed_exercises exercise definition references',
        `UPDATE completed_exercises
         SET exercise_definition_id = NULL,
             updated_at = ?
         WHERE exercise_definition_id IS NOT NULL
           AND NOT EXISTS (
             SELECT 1
             FROM exercise_definitions ed
             WHERE ed.id = completed_exercises.exercise_definition_id
           );`,
        now
      );

      await runStartupRepairStatement(
        database,
        'repair completed_exercises substituted exercise references',
        `UPDATE completed_exercises
         SET substituted_for_exercise_definition_id = NULL,
             updated_at = ?
         WHERE substituted_for_exercise_definition_id IS NOT NULL
           AND NOT EXISTS (
             SELECT 1
             FROM exercise_definitions ed
             WHERE ed.id = completed_exercises.substituted_for_exercise_definition_id
           );`,
        now
      );

      await runStartupRepairStatement(
        database,
        'repair exercise_prescriptions optional progression policy references',
        `UPDATE exercise_prescriptions
         SET progression_policy_id = NULL,
             updated_at = ?
         WHERE progression_policy_id IS NOT NULL
           AND NOT EXISTS (
             SELECT 1
             FROM progression_policies pp
             WHERE pp.id = exercise_prescriptions.progression_policy_id
           );`,
        now
      );

      await runStartupRepairStatement(
        database,
        'repair workout_sessions active routine references',
        `UPDATE workout_sessions
         SET active_routine_id = NULL,
             updated_at = ?
         WHERE active_routine_id IS NOT NULL
           AND NOT EXISTS (
             SELECT 1
             FROM active_routines ar
             WHERE ar.id = workout_sessions.active_routine_id
           );`,
        now
      );

      await runStartupRepairStatement(
        database,
        'repair workout_sessions template references',
        `UPDATE workout_sessions
         SET template_id = NULL,
             updated_at = ?
         WHERE template_id IS NOT NULL
           AND NOT EXISTS (
             SELECT 1
             FROM workout_templates wt
             WHERE wt.id = workout_sessions.template_id
           );`,
        now
      );

      await runStartupRepairStatement(
        database,
        'repair workout_sessions template day references',
        `UPDATE workout_sessions
         SET template_day_id = NULL,
             updated_at = ?
         WHERE template_day_id IS NOT NULL
           AND NOT EXISTS (
             SELECT 1
             FROM template_days td
             WHERE td.id = workout_sessions.template_day_id
           );`,
        now
      );

      await runStartupRepairStatement(
        database,
        'repair active_routines current day references',
        `UPDATE active_routines
         SET current_template_day_id = (
               SELECT td.id
               FROM template_days td
               WHERE td.template_id = active_routines.template_id
               ORDER BY td.day_order ASC, td.id ASC
               LIMIT 1
             ),
             current_day_index = 0,
             updated_at = ?
         WHERE current_template_day_id IS NOT NULL
           AND NOT EXISTS (
             SELECT 1
             FROM template_days td
             WHERE td.id = active_routines.current_template_day_id
           );`,
        now
      );

      await runStartupRepairStatement(
        database,
        'repair workout_sessions invalid active routine rows',
        `UPDATE workout_sessions
         SET active_routine_id = NULL,
             updated_at = ?
         WHERE active_routine_id IN (
           SELECT ar.id
           FROM active_routines ar
           WHERE NOT EXISTS (
             SELECT 1
             FROM workout_templates wt
             WHERE wt.id = ar.template_id
           )
         );`,
        now
      );

      await runStartupRepairStatement(
        database,
        'repair active_routines invalid template rows',
        `DELETE FROM active_routines
         WHERE NOT EXISTS (
           SELECT 1
           FROM workout_templates wt
           WHERE wt.id = active_routines.template_id
         );`
      );
    })
  );
}

export async function bootstrapDatabase(): Promise<SQLiteDatabase> {
  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      const database = await getDatabaseClient();
      await runMigrations(database);
      await runSeeds(database);
      await repairStartupForeignKeyReferences(database);
      const violations = await runForeignKeyCheck(database, 'post-bootstrap foreign key check');

      if (violations.length > 0) {
        throw new Error(`Database foreign key check failed with ${violations.length} violation(s).`);
      }

      return database;
    })().catch((error) => {
      bootstrapPromise = null;
      throw error;
    });
  }

  return bootstrapPromise;
}

export async function resetDatabaseForFieldTestRecovery(): Promise<void> {
  bootstrapPromise = null;
  await resetDatabaseClientForFieldTestRecovery();
}
