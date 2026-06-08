import { deleteDatabaseAsync, openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

import { runDatabaseStartupStep } from '@/db/startup-diagnostics';

const DATABASE_NAME = 'hit-log.db';

let databasePromise: Promise<SQLiteDatabase> | null = null;

type JournalModeRow = {
  journal_mode: string;
};

export async function openDatabaseClient(): Promise<SQLiteDatabase> {
  return runDatabaseStartupStep('open database hit-log.db', () => openDatabaseAsync(DATABASE_NAME));
}

export async function configureDatabaseClient(database: SQLiteDatabase): Promise<void> {
  await runDatabaseStartupStep(
    'configure PRAGMA foreign_keys',
    () => database.execAsync('PRAGMA foreign_keys = ON;'),
    'PRAGMA foreign_keys = ON;'
  );

  try {
    await runDatabaseStartupStep(
      'configure PRAGMA journal_mode',
      () => database.getFirstAsync<JournalModeRow>('PRAGMA journal_mode = WAL;'),
      'PRAGMA journal_mode = WAL;'
    );
  } catch {
    // Some platforms may not support switching journal mode. Startup should continue.
  }
}

export async function getDatabaseClient(): Promise<SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = (async () => {
      const database = await openDatabaseClient();
      await configureDatabaseClient(database);
      return database;
    })().catch((error) => {
      databasePromise = null;
      throw error;
    });
  }

  return databasePromise;
}

export async function resetDatabaseClientForFieldTestRecovery(): Promise<void> {
  const database = databasePromise ? await databasePromise.catch(() => null) : null;

  if (database && typeof database.closeAsync === 'function') {
    await database.closeAsync().catch(() => undefined);
  }

  databasePromise = null;
  await runDatabaseStartupStep('delete local database hit-log.db', () =>
    deleteDatabaseAsync(DATABASE_NAME)
  );
}
