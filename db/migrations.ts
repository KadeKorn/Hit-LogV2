import type { SQLiteDatabase } from 'expo-sqlite';

import {
  exerciseLibraryExpansionSchemaStatements,
  schemaStatements,
  templateDataModelSchemaStatements,
  workoutExecutionSchemaStatements,
} from '@/db/schema';
import { execDatabaseStartupStatement, runDatabaseStartupStep } from '@/db/startup-diagnostics';

export const SCHEMA_VERSION = 5;

type UserVersionRow = {
  user_version: number;
};

async function getUserVersion(database: SQLiteDatabase): Promise<number> {
  const result = await runDatabaseStartupStep(
    'read PRAGMA user_version',
    () => database.getFirstAsync<UserVersionRow>('PRAGMA user_version;'),
    'PRAGMA user_version;'
  );

  return result?.user_version ?? 0;
}

async function setUserVersion(database: SQLiteDatabase, version: number): Promise<void> {
  await execDatabaseStartupStatement(
    database,
    `set PRAGMA user_version ${version}`,
    `PRAGMA user_version = ${version};`
  );
}

async function migrateToVersion1(database: SQLiteDatabase): Promise<void> {
  for (const [index, statement] of schemaStatements.entries()) {
    await execDatabaseStartupStatement(database, `migration v1 statement ${index + 1}`, statement);
  }
}

async function migrateToVersion2(database: SQLiteDatabase): Promise<void> {
  for (const [index, statement] of templateDataModelSchemaStatements.entries()) {
    await execDatabaseStartupStatement(database, `migration v2 statement ${index + 1}`, statement);
  }
}

async function migrateToVersion3(database: SQLiteDatabase): Promise<void> {
  for (const [index, statement] of workoutExecutionSchemaStatements.entries()) {
    await execDatabaseStartupStatement(database, `migration v3 statement ${index + 1}`, statement);
  }
}

async function migrateToVersion4(database: SQLiteDatabase): Promise<void> {
  for (const [index, statement] of exerciseLibraryExpansionSchemaStatements.entries()) {
    await execDatabaseStartupStatement(database, `migration v4 statement ${index + 1}`, statement);
  }
}

async function migrateToVersion5(database: SQLiteDatabase): Promise<void> {
  await execDatabaseStartupStatement(
    database,
    'migration v5 set-level effort',
    `ALTER TABLE set_logs ADD COLUMN no_reps_left INTEGER NOT NULL DEFAULT 0 CHECK (no_reps_left IN (0, 1));`
  );

  // The original beta prebuilt plans are replaced, and their workout history is intentionally retired.
  const retiredIds = `(
    'prebuilt-template-full-body-hypertrophy-3x',
    'prebuilt-template-push-pull-legs',
    'prebuilt-template-hit-inspired-low-volume'
  )`;
  const statements = [
    `DELETE FROM workout_sessions WHERE template_id IN ${retiredIds};`,
    `DELETE FROM active_routines WHERE template_id IN ${retiredIds};`,
    `DELETE FROM workout_logs WHERE template_id IN ${retiredIds};`,
    `DELETE FROM workout_template_exercises WHERE template_id IN ${retiredIds};`,
    `UPDATE workout_templates SET origin_template_id = NULL WHERE origin_template_id IN ${retiredIds};`,
    `DELETE FROM workout_templates WHERE id IN ${retiredIds};`,
  ];

  for (const [index, statement] of statements.entries()) {
    await execDatabaseStartupStatement(database, `migration v5 retired beta plan cleanup ${index + 1}`, statement);
  }
}

export async function runMigrations(database: SQLiteDatabase): Promise<number> {
  let migratedVersion = SCHEMA_VERSION;

  await runDatabaseStartupStep('migrations transaction', () =>
    database.withTransactionAsync(async () => {
      const currentVersion = await getUserVersion(database);

      if (currentVersion >= SCHEMA_VERSION) {
        migratedVersion = currentVersion;
        return;
      }

      if (currentVersion < 1) {
        await migrateToVersion1(database);
      }

      if (currentVersion < 2) {
        await migrateToVersion2(database);
      }

      if (currentVersion < 3) {
        await migrateToVersion3(database);
      }

      if (currentVersion < 4) {
        await migrateToVersion4(database);
      }

      if (currentVersion < 5) {
        await migrateToVersion5(database);
      }

      await setUserVersion(database, SCHEMA_VERSION);
    })
  );

  return migratedVersion;
}
