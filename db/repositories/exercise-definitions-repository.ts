import type { SQLiteDatabase } from 'expo-sqlite';

import type { ExerciseDefinition } from '@/types/domain';

type ExerciseDefinitionRow = {
  category: string | null;
  created_at: string;
  default_load_increment: number | null;
  default_progression_method: ExerciseDefinition['defaultProgressionMethod'];
  default_rep_max: number | null;
  default_rep_min: number | null;
  default_rest_seconds: number | null;
  id: string;
  name: string;
  primary_muscle_group: string;
  secondary_muscle_groups: string | null;
  updated_at: string;
};

function parseSecondaryMuscleGroups(value: string | null): string[] | null {
  if (!value) {
    return null;
  }

  try {
    const parsedValue: unknown = JSON.parse(value);
    return Array.isArray(parsedValue) && parsedValue.every((item) => typeof item === 'string')
      ? parsedValue
      : null;
  } catch {
    return null;
  }
}

function mapExerciseDefinitionRow(row: ExerciseDefinitionRow): ExerciseDefinition {
  return {
    id: row.id,
    name: row.name,
    primaryMuscleGroup: row.primary_muscle_group,
    secondaryMuscleGroups: parseSecondaryMuscleGroups(row.secondary_muscle_groups),
    category: row.category,
    defaultRepMin: row.default_rep_min,
    defaultRepMax: row.default_rep_max,
    defaultProgressionMethod: row.default_progression_method,
    defaultLoadIncrement: row.default_load_increment,
    defaultRestSeconds: row.default_rest_seconds,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class ExerciseDefinitionsRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  getClient(): SQLiteDatabase {
    return this.database;
  }

  async listExerciseDefinitions(): Promise<ExerciseDefinition[]> {
    const rows = await this.database.getAllAsync<ExerciseDefinitionRow>(
      `SELECT
         id,
         name,
         primary_muscle_group,
         secondary_muscle_groups,
         category,
         default_rep_min,
         default_rep_max,
         default_progression_method,
         default_load_increment,
         default_rest_seconds,
         created_at,
         updated_at
       FROM exercise_definitions
       ORDER BY name ASC, id ASC;`
    );

    return rows.map(mapExerciseDefinitionRow);
  }

  async getExerciseDefinitionById(id: string): Promise<ExerciseDefinition | null> {
    const row = await this.database.getFirstAsync<ExerciseDefinitionRow>(
      `SELECT
         id,
         name,
         primary_muscle_group,
         secondary_muscle_groups,
         category,
         default_rep_min,
         default_rep_max,
         default_progression_method,
         default_load_increment,
         default_rest_seconds,
         created_at,
         updated_at
       FROM exercise_definitions
       WHERE id = ?
       LIMIT 1;`,
      id
    );

    return row ? mapExerciseDefinitionRow(row) : null;
  }
}
