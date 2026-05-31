export const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS workout_templates (
    id TEXT PRIMARY KEY NOT NULL,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1
  );`,
  `CREATE TABLE IF NOT EXISTS workout_template_exercises (
    id TEXT PRIMARY KEY NOT NULL,
    template_id TEXT NOT NULL,
    name TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (template_id) REFERENCES workout_templates(id) ON DELETE RESTRICT
  );`,
  `CREATE TABLE IF NOT EXISTS workout_logs (
    id TEXT PRIMARY KEY NOT NULL,
    template_id TEXT NOT NULL,
    started_at TEXT,
    completed_at TEXT,
    status TEXT NOT NULL,
    summary TEXT,
    FOREIGN KEY (template_id) REFERENCES workout_templates(id) ON DELETE RESTRICT
  );`,
  `CREATE TABLE IF NOT EXISTS exercise_logs (
    id TEXT PRIMARY KEY NOT NULL,
    workout_log_id TEXT NOT NULL,
    template_exercise_id TEXT NOT NULL,
    exercise_name_snapshot TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    notes TEXT,
    carry_forward INTEGER NOT NULL DEFAULT 0,
    carry_forward_note TEXT,
    FOREIGN KEY (workout_log_id) REFERENCES workout_logs(id) ON DELETE CASCADE,
    FOREIGN KEY (template_exercise_id) REFERENCES workout_template_exercises(id) ON DELETE RESTRICT
  );`,
  `CREATE TABLE IF NOT EXISTS exercise_sets (
    id TEXT PRIMARY KEY NOT NULL,
    exercise_log_id TEXT NOT NULL,
    set_index INTEGER NOT NULL,
    set_type TEXT NOT NULL DEFAULT 'working',
    weight_text TEXT NOT NULL,
    reps_text TEXT NOT NULL,
    side TEXT,
    note TEXT,
    FOREIGN KEY (exercise_log_id) REFERENCES exercise_logs(id) ON DELETE CASCADE
  );`,
  `CREATE INDEX IF NOT EXISTS idx_workout_templates_order_index
    ON workout_templates(order_index);`,
  `CREATE INDEX IF NOT EXISTS idx_workout_template_exercises_template_order_index
    ON workout_template_exercises(template_id, order_index);`,
  `CREATE INDEX IF NOT EXISTS idx_workout_logs_template_completed_at
    ON workout_logs(template_id, completed_at DESC);`,
  `CREATE INDEX IF NOT EXISTS idx_exercise_logs_workout_log
    ON exercise_logs(workout_log_id);`,
  `CREATE INDEX IF NOT EXISTS idx_exercise_logs_template_exercise
    ON exercise_logs(template_exercise_id);`,
  `CREATE INDEX IF NOT EXISTS idx_exercise_logs_workout_order_index
    ON exercise_logs(workout_log_id, order_index);`,
  `CREATE INDEX IF NOT EXISTS idx_exercise_sets_exercise_log_set_index
    ON exercise_sets(exercise_log_id, set_index);`,
] as const;

export const templateDataModelSchemaStatements = [
  `ALTER TABLE workout_templates
    ADD COLUMN description TEXT;`,
  `ALTER TABLE workout_templates
    ADD COLUMN goal TEXT;`,
  `ALTER TABLE workout_templates
    ADD COLUMN split_type TEXT;`,
  `ALTER TABLE workout_templates
    ADD COLUMN source_type TEXT NOT NULL DEFAULT 'custom'
      CHECK (source_type IN ('prebuilt', 'custom'));`,
  `ALTER TABLE workout_templates
    ADD COLUMN is_editable INTEGER NOT NULL DEFAULT 1;`,
  `ALTER TABLE workout_templates
    ADD COLUMN origin_template_id TEXT;`,
  `ALTER TABLE workout_templates
    ADD COLUMN created_at TEXT NOT NULL DEFAULT '1970-01-01T00:00:00.000Z';`,
  `ALTER TABLE workout_templates
    ADD COLUMN updated_at TEXT NOT NULL DEFAULT '1970-01-01T00:00:00.000Z';`,
  `CREATE TABLE IF NOT EXISTS template_days (
    id TEXT PRIMARY KEY NOT NULL,
    template_id TEXT NOT NULL,
    name TEXT NOT NULL,
    day_order INTEGER NOT NULL,
    focus TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (template_id) REFERENCES workout_templates(id) ON DELETE CASCADE
  );`,
  `CREATE TABLE IF NOT EXISTS exercise_definitions (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    primary_muscle_group TEXT NOT NULL,
    secondary_muscle_groups TEXT,
    category TEXT,
    default_rep_min INTEGER,
    default_rep_max INTEGER,
    default_progression_method TEXT
      CHECK (default_progression_method IN (
        'double_progression',
        'top_set_progression',
        'rep_progression',
        'manual',
        'none'
      )),
    default_load_increment REAL,
    default_rest_seconds INTEGER,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS progression_policies (
    id TEXT PRIMARY KEY NOT NULL,
    method TEXT NOT NULL CHECK (method IN (
      'double_progression',
      'top_set_progression',
      'rep_progression',
      'manual',
      'none'
    )),
    target_rep_min INTEGER,
    target_rep_max INTEGER,
    load_increment REAL,
    require_all_sets_at_top INTEGER NOT NULL DEFAULT 1,
    allow_deload_flag INTEGER NOT NULL DEFAULT 1,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS exercise_prescriptions (
    id TEXT PRIMARY KEY NOT NULL,
    template_day_id TEXT NOT NULL,
    exercise_definition_id TEXT NOT NULL,
    progression_policy_id TEXT,
    exercise_order INTEGER NOT NULL,
    sets INTEGER NOT NULL,
    rep_range_min INTEGER NOT NULL,
    rep_range_max INTEGER NOT NULL,
    muscle_group TEXT NOT NULL,
    load_increment REAL,
    rest_seconds INTEGER,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (template_day_id) REFERENCES template_days(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_definition_id) REFERENCES exercise_definitions(id),
    FOREIGN KEY (progression_policy_id) REFERENCES progression_policies(id)
  );`,
  `CREATE TABLE IF NOT EXISTS active_routines (
    id TEXT PRIMARY KEY NOT NULL,
    template_id TEXT NOT NULL,
    current_template_day_id TEXT,
    current_day_index INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'completed', 'archived')),
    started_at TEXT NOT NULL,
    last_workout_session_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (template_id) REFERENCES workout_templates(id),
    FOREIGN KEY (current_template_day_id) REFERENCES template_days(id)
  );`,
  `CREATE INDEX IF NOT EXISTS idx_template_days_template_id
    ON template_days(template_id);`,
  `CREATE INDEX IF NOT EXISTS idx_template_days_template_day_order
    ON template_days(template_id, day_order);`,
  `CREATE INDEX IF NOT EXISTS idx_exercise_definitions_name
    ON exercise_definitions(name);`,
  `CREATE INDEX IF NOT EXISTS idx_exercise_definitions_primary_muscle_group
    ON exercise_definitions(primary_muscle_group);`,
  `CREATE INDEX IF NOT EXISTS idx_progression_policies_method
    ON progression_policies(method);`,
  `CREATE INDEX IF NOT EXISTS idx_exercise_prescriptions_template_day_id
    ON exercise_prescriptions(template_day_id);`,
  `CREATE INDEX IF NOT EXISTS idx_exercise_prescriptions_exercise_definition_id
    ON exercise_prescriptions(exercise_definition_id);`,
  `CREATE INDEX IF NOT EXISTS idx_exercise_prescriptions_progression_policy_id
    ON exercise_prescriptions(progression_policy_id);`,
  `CREATE INDEX IF NOT EXISTS idx_exercise_prescriptions_template_day_order
    ON exercise_prescriptions(template_day_id, exercise_order);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_active_routines_one_active
    ON active_routines(status)
    WHERE status = 'active';`,
] as const;

export const workoutExecutionSchemaStatements = [
  `CREATE TABLE IF NOT EXISTS workout_sessions (
    id TEXT PRIMARY KEY NOT NULL,
    active_routine_id TEXT,
    template_id TEXT,
    template_day_id TEXT,
    status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'abandoned')),
    started_at TEXT NOT NULL,
    completed_at TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (active_routine_id) REFERENCES active_routines(id),
    FOREIGN KEY (template_id) REFERENCES workout_templates(id),
    FOREIGN KEY (template_day_id) REFERENCES template_days(id)
  );`,
  `CREATE TABLE IF NOT EXISTS completed_exercises (
    id TEXT PRIMARY KEY NOT NULL,
    workout_session_id TEXT NOT NULL,
    planned_exercise_prescription_id TEXT,
    exercise_definition_id TEXT,
    exercise_name TEXT NOT NULL,
    muscle_group TEXT,
    planned_sets INTEGER,
    planned_rep_min INTEGER,
    planned_rep_max INTEGER,
    is_substitution INTEGER NOT NULL DEFAULT 0,
    substituted_for_exercise_definition_id TEXT,
    order_index INTEGER NOT NULL,
    notes TEXT,
    effort_rating TEXT CHECK (effort_rating IN ('easy', 'moderate', 'hard', 'failure')),
    estimated_rir INTEGER CHECK (estimated_rir IN (0, 1, 2, 3)),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (workout_session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (planned_exercise_prescription_id) REFERENCES exercise_prescriptions(id),
    FOREIGN KEY (exercise_definition_id) REFERENCES exercise_definitions(id)
  );`,
  `CREATE TABLE IF NOT EXISTS set_logs (
    id TEXT PRIMARY KEY NOT NULL,
    completed_exercise_id TEXT NOT NULL,
    set_number INTEGER NOT NULL,
    weight REAL,
    reps INTEGER,
    is_warmup INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (completed_exercise_id) REFERENCES completed_exercises(id) ON DELETE CASCADE
  );`,
  `CREATE INDEX IF NOT EXISTS idx_workout_sessions_status
    ON workout_sessions(status);`,
  `CREATE INDEX IF NOT EXISTS idx_workout_sessions_active_routine_id
    ON workout_sessions(active_routine_id);`,
  `CREATE INDEX IF NOT EXISTS idx_workout_sessions_template_day_id
    ON workout_sessions(template_day_id);`,
  `CREATE INDEX IF NOT EXISTS idx_completed_exercises_workout_session_id
    ON completed_exercises(workout_session_id);`,
  `CREATE INDEX IF NOT EXISTS idx_completed_exercises_exercise_definition_id
    ON completed_exercises(exercise_definition_id);`,
  `CREATE INDEX IF NOT EXISTS idx_set_logs_completed_exercise_id
    ON set_logs(completed_exercise_id);`,
] as const;
