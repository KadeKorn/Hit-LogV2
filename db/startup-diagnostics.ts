import type { SQLiteDatabase } from 'expo-sqlite';

export type ForeignKeyViolationRow = {
  fkid: number;
  parent: string;
  rowid: number;
  table: string;
};

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function statementPreview(statement: string): string {
  return statement.replace(/\s+/g, ' ').trim();
}

export function logDatabaseStartupStep(message: string): void {
  console.log(`[db-startup] ${message}`);
}

export async function runDatabaseStartupStep<T>(
  label: string,
  operation: () => Promise<T>,
  statement?: string
): Promise<T> {
  logDatabaseStartupStep(`start ${label}`);

  try {
    const result = await operation();
    logDatabaseStartupStep(`finish ${label}`);
    return result;
  } catch (error) {
    console.error(`[db-startup] failed ${label}`, {
      error: formatError(error),
      statement: statement ? statementPreview(statement) : undefined,
    });
    throw error;
  }
}

export async function execDatabaseStartupStatement(
  database: SQLiteDatabase,
  label: string,
  statement: string
): Promise<void> {
  await runDatabaseStartupStep(label, () => database.execAsync(statement), statement);
}

export async function runForeignKeyCheck(
  database: SQLiteDatabase,
  label = 'foreign key check'
): Promise<ForeignKeyViolationRow[]> {
  return runDatabaseStartupStep(label, async () => {
    const violations = await database.getAllAsync<ForeignKeyViolationRow>(
      'PRAGMA foreign_key_check;'
    );

    if (violations.length > 0) {
      console.error('[db-startup] foreign key violations', violations);
    } else {
      logDatabaseStartupStep('foreign key check passed');
    }

    return violations;
  }, 'PRAGMA foreign_key_check;');
}
