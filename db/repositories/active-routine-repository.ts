import type { SQLiteDatabase } from 'expo-sqlite';

import type { ActiveRoutine } from '@/types/domain';

type ActiveRoutineRow = {
  created_at: string;
  current_day_index: number;
  current_template_day_id: string | null;
  id: string;
  last_workout_session_id: string | null;
  started_at: string;
  status: ActiveRoutine['status'];
  template_id: string;
  updated_at: string;
};

function createEntityId(prefix: string): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function mapActiveRoutineRow(row: ActiveRoutineRow): ActiveRoutine {
  return {
    id: row.id,
    templateId: row.template_id,
    currentTemplateDayId: row.current_template_day_id,
    currentDayIndex: row.current_day_index,
    status: row.status,
    startedAt: row.started_at,
    lastWorkoutSessionId: row.last_workout_session_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class ActiveRoutineRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  getClient(): SQLiteDatabase {
    return this.database;
  }

  async getActiveRoutine(): Promise<ActiveRoutine | null> {
    const row = await this.database.getFirstAsync<ActiveRoutineRow>(
      `SELECT
         id,
         template_id,
         current_template_day_id,
         current_day_index,
         status,
         started_at,
         last_workout_session_id,
         created_at,
         updated_at
       FROM active_routines
       WHERE status = 'active'
       LIMIT 1;`
    );

    return row ? mapActiveRoutineRow(row) : null;
  }

  async setActiveRoutine(templateId: string): Promise<ActiveRoutine> {
    const now = new Date().toISOString();
    let activeRoutineId = '';

    await this.database.withTransactionAsync(async () => {
      await this.database.runAsync(
        `UPDATE active_routines
         SET status = 'archived',
             updated_at = ?
         WHERE status = 'active';`,
        now
      );

      const firstTemplateDay = await this.database.getFirstAsync<{
        id: string;
      }>(
        `SELECT id
         FROM template_days
         WHERE template_id = ?
         ORDER BY day_order ASC, id ASC
         LIMIT 1;`,
        templateId
      );

      activeRoutineId = createEntityId('active-routine');

      await this.database.runAsync(
        `INSERT INTO active_routines (
           id,
           template_id,
           current_template_day_id,
           current_day_index,
           status,
           started_at,
           last_workout_session_id,
           created_at,
           updated_at
         )
         VALUES (?, ?, ?, 0, 'active', ?, NULL, ?, ?);`,
        activeRoutineId,
        templateId,
        firstTemplateDay?.id ?? null,
        now,
        now,
        now
      );
    });

    const activeRoutine = await this.getActiveRoutine();

    if (!activeRoutine || activeRoutine.id !== activeRoutineId) {
      throw new Error('Failed to set active routine.');
    }

    return activeRoutine;
  }

  async archiveActiveRoutine(): Promise<void> {
    await this.database.runAsync(
      `UPDATE active_routines
       SET status = 'archived',
           updated_at = ?
       WHERE status = 'active';`,
      new Date().toISOString()
    );
  }
}
