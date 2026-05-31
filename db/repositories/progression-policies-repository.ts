import type { SQLiteDatabase } from 'expo-sqlite';

import type { ProgressionPolicy } from '@/types/domain';

type ProgressionPolicyRow = {
  allow_deload_flag: number;
  created_at: string;
  id: string;
  load_increment: number | null;
  method: ProgressionPolicy['method'];
  notes: string | null;
  require_all_sets_at_top: number;
  target_rep_max: number | null;
  target_rep_min: number | null;
  updated_at: string;
};

function mapProgressionPolicyRow(row: ProgressionPolicyRow): ProgressionPolicy {
  return {
    id: row.id,
    method: row.method,
    targetRepMin: row.target_rep_min,
    targetRepMax: row.target_rep_max,
    loadIncrement: row.load_increment,
    requireAllSetsAtTop: row.require_all_sets_at_top === 1,
    allowDeloadFlag: row.allow_deload_flag === 1,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class ProgressionPoliciesRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  getClient(): SQLiteDatabase {
    return this.database;
  }

  async listProgressionPolicies(): Promise<ProgressionPolicy[]> {
    const rows = await this.database.getAllAsync<ProgressionPolicyRow>(
      `SELECT
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
       FROM progression_policies
       ORDER BY method ASC, id ASC;`
    );

    return rows.map(mapProgressionPolicyRow);
  }

  async getProgressionPolicyById(id: string): Promise<ProgressionPolicy | null> {
    const row = await this.database.getFirstAsync<ProgressionPolicyRow>(
      `SELECT
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
       FROM progression_policies
       WHERE id = ?
       LIMIT 1;`,
      id
    );

    return row ? mapProgressionPolicyRow(row) : null;
  }
}
