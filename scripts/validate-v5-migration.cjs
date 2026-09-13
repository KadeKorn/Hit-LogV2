const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const modules = new Map();

function loadTypeScript(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (modules.has(absolutePath)) return modules.get(absolutePath).exports;
  const module = { exports: {} };
  modules.set(absolutePath, module);
  const source = fs.readFileSync(absolutePath, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const localRequire = (name) => {
    if (name === '@/db/startup-diagnostics') {
      return {
        runDatabaseStartupStep: async (_label, action) => action(),
        execDatabaseStartupStatement: async (database, _label, statement) => database.execAsync(statement),
      };
    }
    if (name.startsWith('@/')) return loadTypeScript(`${name.slice(2)}.ts`);
    return require(name);
  };
  new Function('require', 'module', 'exports', compiled)(localRequire, module, module.exports);
  return module.exports;
}

const sqlite = new DatabaseSync(':memory:');
sqlite.exec('PRAGMA foreign_keys = ON;');
const database = {
  execAsync: async (sql) => sqlite.exec(sql),
  getFirstAsync: async (sql, ...params) => sqlite.prepare(sql).get(...params) ?? null,
  getAllAsync: async (sql, ...params) => sqlite.prepare(sql).all(...params),
  runAsync: async (sql, ...params) => sqlite.prepare(sql).run(...params),
  withTransactionAsync: async (action) => {
    sqlite.exec('BEGIN;');
    try {
      const result = await action();
      sqlite.exec('COMMIT;');
      return result;
    } catch (error) {
      sqlite.exec('ROLLBACK;');
      throw error;
    }
  },
};

async function main() {
  const schema = loadTypeScript('db/schema.ts');
  for (const statement of [
    ...schema.schemaStatements,
    ...schema.templateDataModelSchemaStatements,
    ...schema.workoutExecutionSchemaStatements,
    ...schema.exerciseLibraryExpansionSchemaStatements,
  ]) sqlite.exec(statement);
  sqlite.exec('PRAGMA user_version = 4;');

  const oldId = 'prebuilt-template-full-body-hypertrophy-3x';
  const customId = 'fixture-custom';
  const now = '2026-09-13T00:00:00.000Z';
  for (const [id, source] of [[oldId, 'prebuilt'], [customId, 'custom']]) {
    sqlite.prepare(`INSERT INTO workout_templates
      (id, code, name, order_index, is_active, source_type, is_editable, created_at, updated_at)
      VALUES (?, ?, ?, 1, 0, ?, 1, ?, ?);`).run(id, id, id, source, now, now);
    sqlite.prepare(`INSERT INTO template_days
      (id, template_id, name, day_order, created_at, updated_at)
      VALUES (?, ?, 'Day A', 1, ?, ?);`).run(`${id}-day`, id, now, now);
    sqlite.prepare(`INSERT INTO active_routines
      (id, template_id, current_template_day_id, status, started_at, created_at, updated_at)
      VALUES (?, ?, ?, 'archived', ?, ?, ?);`).run(`${id}-routine`, id, `${id}-day`, now, now, now);
    sqlite.prepare(`INSERT INTO workout_sessions
      (id, active_routine_id, template_id, template_day_id, status, started_at, completed_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'completed', ?, ?, ?, ?);`).run(
      `${id}-session`, `${id}-routine`, id, `${id}-day`, now, now, now, now
    );
    sqlite.prepare(`INSERT INTO completed_exercises
      (id, workout_session_id, exercise_name, order_index, created_at, updated_at)
      VALUES (?, ?, 'Push-Up', 1, ?, ?);`).run(`${id}-exercise`, `${id}-session`, now, now);
    sqlite.prepare(`INSERT INTO set_logs
      (id, completed_exercise_id, set_number, reps, is_warmup, created_at, updated_at)
      VALUES (?, ?, 1, 10, 0, ?, ?);`).run(`${id}-set`, `${id}-exercise`, now, now);
  }

  const { runMigrations, SCHEMA_VERSION } = loadTypeScript('db/migrations.ts');
  assert.equal(SCHEMA_VERSION, 5);
  await runMigrations(database);
  assert.equal(sqlite.prepare('PRAGMA user_version;').get().user_version, 5);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM workout_sessions WHERE template_id = ?;').get(oldId).count, 0);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM workout_templates WHERE id = ?;').get(oldId).count, 0);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM workout_sessions WHERE template_id = ?;').get(customId).count, 1);
  assert.equal(sqlite.prepare('SELECT no_reps_left FROM set_logs WHERE id = ?;').get(`${customId}-set`).no_reps_left, 0);

  const { runSeeds } = loadTypeScript('db/seeds/index.ts');
  await runSeeds(database);
  const current = loadTypeScript('db/seeds/current-prebuilt-templates.ts');
  assert.equal(current.prebuiltTemplateSeeds.length, 3);
  const aestheticId = current.CURRENT_PREBUILT_TEMPLATE_IDS.aesthetic;
  const dayRows = sqlite.prepare(`SELECT td.id, COUNT(ep.id) AS exercises, COALESCE(SUM(ep.sets), 0) AS sets
    FROM template_days td LEFT JOIN exercise_prescriptions ep ON ep.template_day_id = td.id
    WHERE td.template_id = ? GROUP BY td.id ORDER BY td.day_order;`).all(aestheticId);
  assert.deepEqual(dayRows.map((day) => day.sets), [18, 19, 19, 18]);
  assert.deepEqual(dayRows.map((day) => day.exercises), [7, 7, 8, 8]);
  assert.equal(sqlite.prepare(`SELECT COUNT(*) AS count FROM workout_templates WHERE source_type = 'prebuilt';`).get().count, 3);
  const dayCounts = sqlite.prepare(`SELECT wt.id, COUNT(td.id) AS days FROM workout_templates wt
    LEFT JOIN template_days td ON td.template_id = wt.id
    WHERE wt.source_type = 'prebuilt' GROUP BY wt.id;`).all();
  assert.deepEqual(Object.fromEntries(dayCounts.map((row) => [row.id, row.days])), {
    [current.CURRENT_PREBUILT_TEMPLATE_IDS.aesthetic]: 4,
    [current.CURRENT_PREBUILT_TEMPLATE_IDS.athletic]: 4,
    [current.CURRENT_PREBUILT_TEMPLATE_IDS.travel]: 3,
  });
  const automatedPower = sqlite.prepare(`SELECT COUNT(*) AS count FROM exercise_prescriptions ep
    INNER JOIN exercise_definitions ed ON ed.id = ep.exercise_definition_id
    INNER JOIN progression_policies pp ON pp.id = ep.progression_policy_id
    WHERE ed.movement_pattern IN ('jump', 'sprint', 'throw', 'carry', 'swing')
      AND pp.method <> 'manual';`).get().count;
  assert.equal(automatedPower, 0);
  const { TemplateRepository } = loadTypeScript('db/repositories/template-repository.ts');
  const templates = new TemplateRepository(database);
  const { analyzeTemplate } = loadTypeScript('lib/template-analysis.ts');
  const aesthetic = await templates.getWorkoutTemplateDetail(aestheticId);
  assert.equal(analyzeTemplate(aesthetic).totalWorkingSets, 74);
  const athletic = await templates.getWorkoutTemplateDetail(current.CURRENT_PREBUILT_TEMPLATE_IDS.athletic);
  const athleticAnalysis = analyzeTemplate(athletic);
  assert.equal(athleticAnalysis.targetProfileName, 'Strength and athletic performance');
  assert.ok(athleticAnalysis.totalWorkingSets < athletic.days.flatMap((day) => day.prescriptions).reduce((total, prescription) => total + prescription.sets, 0));
  const before = sqlite.prepare('SELECT COUNT(*) AS count FROM exercise_prescriptions;').get().count;
  await runSeeds(database);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS count FROM exercise_prescriptions;').get().count, before);

  const { ActiveRoutineRepository } = loadTypeScript('db/repositories/active-routine-repository.ts');
  const routines = new ActiveRoutineRepository(database);
  const first = await routines.setActiveRoutine(aestheticId);
  await routines.advanceActiveRoutineToNextTemplateDay(first.id);
  const travelId = current.CURRENT_PREBUILT_TEMPLATE_IDS.travel;
  await routines.setActiveRoutine(travelId);
  assert.equal((await routines.getPausedRoutine(aestheticId)).currentDayIndex, 1);
  const resumed = await routines.setActiveRoutine(aestheticId);
  assert.equal(resumed.id, first.id);
  assert.equal(resumed.currentDayIndex, 1);
  await routines.setActiveRoutine(travelId);
  const restarted = await routines.setActiveRoutine(aestheticId, { startOver: true });
  assert.notEqual(restarted.id, first.id);
  assert.equal(restarted.currentDayIndex, 0);

  sqlite.prepare(`INSERT INTO workout_sessions
    (id, active_routine_id, template_id, template_day_id, status, started_at, created_at, updated_at)
    VALUES ('fixture-in-progress', ?, ?, ?, 'active', ?, ?, ?);`).run(
    restarted.id, aestheticId, dayRows[0].id, now, now, now
  );
  await assert.rejects(() => routines.setActiveRoutine(travelId), /Finish or abandon/);
  sqlite.exec("DELETE FROM workout_sessions WHERE id = 'fixture-in-progress';");

  const { WorkoutSessionRepository } = loadTypeScript('db/repositories/workout-session-repository.ts');
  const workouts = new WorkoutSessionRepository(database);
  await workouts.replaceSetLogs(`${customId}-exercise`, [
    { setNumber: 1, weight: null, reps: 10, isWarmup: false, noRepsLeft: true },
    { setNumber: 2, weight: null, reps: 9, isWarmup: false, noRepsLeft: true },
    { setNumber: 3, weight: null, reps: 5, isWarmup: true, noRepsLeft: true },
  ]);
  const flags = sqlite.prepare(`SELECT no_reps_left FROM set_logs
    WHERE completed_exercise_id = ? ORDER BY set_number;`).all(`${customId}-exercise`);
  assert.deepEqual(flags.map((row) => row.no_reps_left), [0, 1, 0]);
  const saved = await workouts.getWorkoutSessionById(`${customId}-session`);
  assert.deepEqual(saved.exercises[0].setLogs.map((set) => set.noRepsLeft), [false, true, false]);
  const { V2HistoryRepository } = loadTypeScript('db/repositories/v2-history-repository.ts');
  const history = await new V2HistoryRepository(database).getCompletedSessionDetail(`${customId}-session`);
  assert.deepEqual(history.exercises[0].setLogs.map((set) => [set.setNumber, set.noRepsLeft]).sort((a, b) => a[0] - b[0]), [[1, false], [2, true], [3, false]]);
  assert.equal(sqlite.prepare('PRAGMA foreign_key_check;').all().length, 0);
  console.log('V5 migration, scoped deletion, new plans, repeat seeding, routine resume, and set flag passed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => sqlite.close());
