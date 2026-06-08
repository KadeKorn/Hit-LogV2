import type { SQLiteDatabase } from 'expo-sqlite';

import {
  exerciseLibraryExpansionSchemaStatements,
  schemaStatements,
  templateDataModelSchemaStatements,
  workoutExecutionSchemaStatements,
} from '@/db/schema';
import { execDatabaseStartupStatement, runDatabaseStartupStep } from '@/db/startup-diagnostics';

export const SCHEMA_VERSION = 4;

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

      await setUserVersion(database, SCHEMA_VERSION);
    })
  );

  return migratedVersion;
}
