import type { SQLiteDatabase } from 'expo-sqlite';

import type { ExerciseDefinition } from '@/types/domain';

type ExerciseDefinitionRow = {
  category: string | null;
  created_at: string;
  difficulty: string | null;
  default_load_increment: number | null;
  default_progression_method: ExerciseDefinition['defaultProgressionMethod'];
  default_rep_max: number | null;
  default_rep_min: number | null;
  default_rest_seconds: number | null;
  equipment: string | null;
  id: string;
  movement_pattern: string | null;
  name: string;
  notes: string | null;
  primary_muscle_group: string;
  secondary_muscle_groups: string | null;
  source_type: ExerciseDefinition['sourceType'];
  updated_at: string;
};

export type CreateCustomExerciseDefinitionInput = {
  name: string;
  notes: string | null;
  primaryMuscleGroup: string;
};

function createEntityId(prefix: string): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

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
    difficulty: row.difficulty,
    defaultRepMin: row.default_rep_min,
    defaultRepMax: row.default_rep_max,
    defaultProgressionMethod: row.default_progression_method,
    defaultLoadIncrement: row.default_load_increment,
    defaultRestSeconds: row.default_rest_seconds,
    equipment: row.equipment,
    movementPattern: row.movement_pattern,
    notes: row.notes,
    sourceType: row.source_type,
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
       FROM exercise_definitions
       WHERE id = ?
       LIMIT 1;`,
      id
    );

    return row ? mapExerciseDefinitionRow(row) : null;
  }

  async createCustomExerciseDefinition(
    input: CreateCustomExerciseDefinitionInput
  ): Promise<ExerciseDefinition> {
    const name = input.name.trim();
    const primaryMuscleGroup = input.primaryMuscleGroup.trim();

    if (!name) {
      throw new Error('Exercise name is required.');
    }

    if (!primaryMuscleGroup) {
      throw new Error('Primary muscle group is required.');
    }

    const duplicate = await this.database.getFirstAsync<{ id: string }>(
      `SELECT id
       FROM exercise_definitions
       WHERE LOWER(name) = LOWER(?)
       LIMIT 1;`,
      name
    );

    if (duplicate) {
      throw new Error('An exercise with this name already exists.');
    }

    const now = new Date().toISOString();
    const exerciseDefinitionId = createEntityId('custom-exercise');

    await this.database.runAsync(
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
       VALUES (?, ?, ?, NULL, 'custom', NULL, NULL, NULL, ?, 'custom', 8, 12, 'double_progression', 5, 90, ?, ?);`,
      exerciseDefinitionId,
      name,
      primaryMuscleGroup,
      input.notes?.trim() || null,
      now,
      now
    );

    const exerciseDefinition = await this.getExerciseDefinitionById(exerciseDefinitionId);

    if (!exerciseDefinition) {
      throw new Error('Failed to create custom exercise.');
    }

    return exerciseDefinition;
  }
}
