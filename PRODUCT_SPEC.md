# PRODUCT_SPEC

## Title

HIT Log V2

## One-sentence summary

HIT Log V2 is a mobile-first, local-first training system that begins as a template library and becomes a guided progressive-overload workout companion once the user selects an active routine.

## Product thesis

HIT Log V2 is template-library-first and guide-centered.

The app should first help the user understand good training structure, browse prebuilt templates, create custom templates, duplicate prebuilt templates, and set one routine as active. After an active routine exists, the app should guide the user into the next workout with relevant context instead of making them search history manually.

## Primary user

V2 is personal-first and hypertrophy / mass-gain focused. It should optimize for:

- physique-building volume
- progressive overload
- repeatable routines
- fast workout execution
- simple logging
- history comparison
- next-workout guidance

The data model and UI should remain clean enough to support other users later, but V2 MVP choices should serve the founder's training workflow first.

## Core V2 scope

### In scope

- Reusable workout templates
- Prebuilt evidence-based templates
- Custom template creation
- Duplicating prebuilt templates into editable custom templates
- One active routine at a time
- Workout execution from the active routine
- Controlled workout substitutions
- Deterministic progression recommendations
- Better history comparison
- Optional exercise-level effort tracking
- Optional warmup set logging
- Cleaner mobile UX
- Local-first persistence with export-friendly structure

### Progress visibility

- Exercise strength trend chart
- Volume trend chart
- Muscle-group weekly sets chart
- Consistency chart

### Out of active V2 MVP scope

- Oura integration
- Withings integration
- AI coach
- Cloud sync
- Bodyweight tracking
- Advanced periodization
- Public or social features

## Navigation

Use this bottom navigation model:

- Train
- Library
- History
- Progress
- Settings

Before an active routine exists, the Library experience is central. After an active routine exists, the Train tab becomes central.

### Train tab

The Train tab should eventually show:

- active routine
- next workout
- resume active workout
- last completed workout
- next-up recommendations

### Library tab

The Library tab should eventually show:

- prebuilt templates
- custom templates
- best-practice explanations
- create custom template
- duplicate template
- template detail screen
- set as active routine

### History tab

The History tab should focus on completed workout sessions and exercise history lookup.

### Progress tab

The Progress tab should explain training trends only after enough completed V2 workout data exists. Before that baseline is collected, it should show deterministic unlock counts instead of fake or noisy charts.

Implemented Progress behavior:

- Baseline collection state before chart unlock
- Dashboard summary for completed workouts, training weeks, working sets, and weighted volume
- Exercise strength trend for exercises with at least two completed exposures
- Exercise volume trend for weighted working sets, with reps history shown instead when no weight exists
- Weekly working-set summary by muscle group
- Completed workouts by week consistency summary
- Cautious top-progress and needs-attention indicators

Progress uses completed V2 workout data only: `workout_sessions`, `completed_exercises`, `set_logs`, and `exercise_definitions` metadata where needed. It does not use legacy Yates data, warmup sets, blank/incomplete sets, bodyweight data, wearable data, cloud data, or AI.

### Phase 5 product boundary

Use this distinction when placing features:

- History is what happened.
- Progress is what it means over time.
- Library is what the plan is.
- Train is what to do now.

Phase 5 adds deterministic structure analysis for planned templates and active routines. It does not add Progress dashboard charts.

### Settings tab

Settings should contain app preferences, local data controls, and export/import surfaces when those exist.

## Template model

Templates are reusable training plans. V2 should support prebuilt templates and custom templates.

### Initial prebuilt templates

- Aesthetic Hypertrophy 3x/week
- Strength Foundation 3x/week
- Dorian Yates-Inspired HIT Routine

### Template behavior

- Prebuilt templates are read-only.
- Prebuilt templates can be duplicated into editable custom templates.
- Custom templates are editable.
- Custom templates can be structurally edited: days can be added, renamed, reordered, and deleted while preserving at least one day.
- Custom template exercise prescriptions can be added from existing exercise definitions, removed, reordered, and edited for sets, rep range, progression method, rest guidance, and notes.
- Custom exercises can be created while editing a custom template. A custom exercise requires a name and primary muscle group, can include optional notes/cues, appears in the grouped exercise picker, and can be used in custom template prescriptions.
- Custom template creation should be fast, low-friction, simple, and elegant.
- Custom templates should require only the minimum fields needed for progression.
- The app may auto-fill sensible defaults such as muscle group, progression method, increment, and rest time.
- Templates should be flexible but controlled during workout execution.
- Workout substitutions are allowed.
- Substitutions should not silently mutate the original template.
- After a workout, the user may optionally save changes back to a custom template.

### Training targets and template analysis

The app should analyze planned template prescriptions before chart work. Analysis uses template days and exercise prescriptions, not completed workout history.

For a template or active routine, the app should calculate:

- prescribed working sets by muscle group
- total prescribed working sets
- template or rotation day count
- notable muscle-group bias
- goal fit summary
- undertrained indicators
- overloaded indicators

Warmups are excluded because this is planned-template analysis. Completed workout history is not used. Legacy Yates data is not used.

Goal fit should be goal-aware:

- Aesthetic Hypertrophy 3x/week is judged against broad aesthetic hypertrophy guardrails for side delts, lats, chest, upper back, quads, glutes, hamstrings, biceps, triceps, and abs.
- Strength Foundation 3x/week is judged as a strength-first routine emphasizing squat, press, hinge, and row/pull exposure with supportive accessory volume.
- Dorian Yates-Inspired HIT Routine is judged as a 4-day low-volume, high-effort bodybuilding rotation, not as a normal weekly hypertrophy volume template.

Initial labels:

- Strong fit
- Good fit
- Needs review
- Low signal / insufficient metadata

Current analysis counts each prescription toward its stored prescription `muscleGroup`, which is derived from the exercise definition primary muscle when prescriptions are created or updated. Phase 9 adds secondary muscle, equipment, movement pattern, difficulty, source, and notes/cues metadata to exercise definitions, but template analysis remains primary-muscle-only for now and does not invent fractional secondary-muscle counting.

Goal-fit labels should avoid over-penalizing minor near-misses caused by the current one-muscle-per-prescription metadata. `Needs review` is reserved for major structural issues such as multiple required muscles with 0 sets, severe undertraining across the template, clearly overloaded groups, or very low total analysis signal. Guardrail notes should remain visible even when the overall label is `Good fit`.

### Planned exercise fields

Each planned exercise should be able to define:

- sets
- rep range
- muscle group
- progression method
- load increment
- optional rest time
- optional notes

Progression happens at the exercise prescription level, not only at the workout or template level.

## Active routine

An active routine is the user's currently selected running plan. V2 should allow only one active routine at a time.

ActiveRoutine is needed because a reusable template is not the same thing as the user's current place in a running plan. The active routine should track the selected template, current day, status, and next workout logic without mutating the underlying template.

Once an active routine exists, the app should guide the user toward the next scheduled workout.

## Workout execution

The user should be able to:

1. Start the next workout from the active routine.
2. Log working sets quickly.
3. Log optional warmup sets.
4. Substitute an exercise without corrupting the original template.
5. Add exercise-level notes.
6. Optionally record exercise-level effort.
7. Complete the workout and save a durable history record.

Workout execution should be flexible in the moment, but template mutation should be explicit. Substituting dumbbell bench for barbell bench during a workout should not silently merge or rewrite the barbell bench progression history.

## Progression

Progression should be deterministic, explainable, and testable.

Do not use AI for progression in V2. Do not include load-only progression in V2 scope.

Supported progression methods:

- `double_progression`
- `top_set_progression`
- `rep_progression`
- `manual`
- `none`

Progression recommendations should be generated from completed working sets and the exercise's progression policy. Warmups should be excluded from progression calculations.

### Recommendation locations

Progression recommendations should appear in three places eventually:

- before the workout
- during the workout
- after workout completion

### Before workout example

```txt
Bench Press
Last time: 135 x 10, 9, 8
Today: Repeat 135 and aim for more total reps.
```

### During workout example

```txt
Last time:
135 x 10
135 x 9
135 x 8

Today's target:
135 x 10+
```

### After workout example

```txt
Next time:
Repeat 135 lb.

Reason:
You improved from 10/9/8 to 11/10/9, but did not yet hit 12/12/12.
```

## History comparison

History comparison should support progressive overload in the gym without forcing the user to manually search old workouts.

For a planned exercise or substituted exercise, the app should be able to show:

- last time
- best ever / PR
- last five sessions
- notes from prior sessions

Barbell bench and dumbbell bench should have separate progression histories. Substitutions should be tracked clearly so the user can compare like with like.

## Effort and RIR

V2 should support optional exercise-level effort tracking.

Do not require RIR per set in V2. At the completed exercise level, optionally store:

- `effortRating`: `easy | moderate | hard | failure`
- `estimatedRir`: `3 | 2 | 1 | 0`

Suggested labels:

- Easy - 3+ RIR
- Moderate - 2 RIR
- Hard - 1 RIR
- Failure - 0 RIR

## Warmups

Warmup sets may be logged, but they should not count toward:

- progression recommendations
- PRs
- working-set volume
- charts
- muscle-group weekly set totals

`SetLog` should support an `isWarmup` flag.

## Charts

Charts should come after templates, active routine, workout execution, history comparison, and progression recommendations are working.

Initial chart focus:

- exercise strength trend
- volume trend
- muscle-group weekly sets
- consistency

Do not include bodyweight charts in the initial V2 chart scope.

Charts are Phase 8 and stay gated until enough completed V2 data exists. Before unlock, the Progress tab communicates baseline collection rather than showing thin or misleading chart output.

Baseline unlock requirements:

- At least 4 completed V2 workouts
- At least 2 calendar weeks with completed V2 workouts
- At least 1 exercise with 2 or more completed exposures before exercise trends appear
- Warmup sets excluded
- Blank or incomplete sets excluded

Exercise strength trends use the best working set per completed session. Exercise volume trends use `weight x reps` for valid weighted working sets only; reps-only sessions do not create fake volume. Muscle-group weekly set totals count completed working sets using available exercise muscle-group metadata without secondary-muscle fractional counting.

## Roadmap

The full durable roadmap lives in `docs/ROADMAP.md`. Future phases should preserve the local-first, template-library-first, deterministic-progressive-overload product thesis.

### Phase 4 - History Tab Activation

Goal: make History the factual V2 training record.

High-level scope: completed sessions list, completed session detail, warmup/working set separation, exercise history lookup, and V2-only history reads.

Intended user value: the user can review what actually happened without confusing History with Progress interpretation.

### Phase 4.1 - History Stability & Roadmap Cleanup

Goal: stabilize the activated History tab and align roadmap documentation before Phase 5.

High-level scope: preserve History scroll/state where practical, avoid full-screen resets during exercise-history selection, and remove stale or duplicate roadmap entries.

Intended user value: the user gets a calmer History review experience and clearer project direction without new feature scope.

### Phase 4.2 - History Usability Finish

Goal: make the activated History tab easier to use as completed sessions grow.

High-level scope: cap the default completed-session list, provide in-place expand/collapse, and smooth exercise-history selection without visible loading flashes.

Intended user value: the user can reach Exercise History quickly and switch between exercises without visual noise.

### Phase 5 - Training Targets & Template Analysis

Goal: add deterministic training-system analysis before charts.

High-level scope: weekly working sets by muscle group, template muscle bias, goal fit analysis, undertrained/overloaded indicators, active routine target comparison, and aesthetic hypertrophy guardrails.

Intended user value: the user can understand whether their routine structure matches their hypertrophy goals before relying on chart visuals.

### Phase 6 - Custom Template Structure Editing

Goal: allow meaningful editing of custom templates while keeping prebuilt templates read-only.

High-level scope: add/remove/reorder days and exercises, edit sets, rep ranges, progression methods, rest guidance, and notes.

Intended user value: the user can adapt routines without leaving the template system or corrupting prebuilt plans.

Implemented behavior:

- Prebuilt templates remain read-only and can be duplicated into custom templates.
- Custom template days can be added, renamed, reordered, and deleted with a one-day minimum.
- Custom exercise prescriptions can be added from existing exercise definitions, removed, reordered, and edited.
- Supported progression methods remain limited to `double_progression`, `top_set_progression`, `rep_progression`, `manual`, and `none`.
- Training Analysis recalculates from the edited planned structure and shows deterministic guardrail feedback after saves.
- If an active custom routine's current day is deleted, the active routine falls back to the first remaining day instead of crashing.

Phase 6.1 cleanup:

- Last-day deletion is blocked in the UI and guarded in the repository so custom templates remain loadable.
- Template edit failures are shown inline instead of replacing the loaded template with a fatal load error.
- Exercise selection is grouped by existing primary muscle-group metadata.
- Progression method editing includes concise deterministic help text for each supported method.

### Phase 7 - Workout Experience Revamp

Goal: substantially redesign the workout experience.

High-level scope: better workout start flow, current exercise focus mode, faster set entry, previous performance visibility, rest timer, better warmup/notes/completion/substitution UX, in-progress recovery, and one-hand usability.

Intended user value: workout logging becomes faster and easier during real training.

Implemented behavior:

- Train shows clearer next-workout context including current day, exercise count, and planned working sets.
- The active workout screen centers the current exercise and keeps the rest of the workout accessible through compact exercise navigation.
- Exercise context shows target sets/reps, muscle group, progression method, rest guidance, history comparison, prior notes, and deterministic progression recommendations.
- Set logging distinguishes warmup and working sets, and explains that warmups are excluded from progression, history volume, and PR logic.
- Adding a working set carries forward the prior set's entered weight/reps for faster repeated logging.
- A simple local rest timer can start from prescription rest guidance, stop, or reset without blocking logging.
- Active workout drafts autosave locally while the session is in progress, so resume/recovery includes logged set data instead of only the session shell.
- Completion includes a simple workout summary with exercises, working sets, volume, notes, and substitution indicators.

### Phase 8 - Progress Dashboard & Charts

Goal: provide meaningful progress visibility after enough baseline data exists.

High-level scope: progress dashboard, exercise strength and volume trends, weekly muscle-group trends, consistency tracking, top progress indicators, and needs-attention indicators.

Intended user value: the user can see what training outcomes are emerging from completed V2 workouts.

Charts should stay locked behind baseline collection:

- At least 2 calendar weeks of completed V2 workouts
- At least 4 completed workouts
- At least 2 repeated exposures per exercise before that exercise trend appears
- Exclude warmup sets
- Exclude incomplete sets

Implemented behavior:

- Progress shows a baseline collection state until unlock requirements are met.
- The dashboard summarizes completed workouts, training weeks, working sets, weighted volume, weekly muscle-group working sets, and consistency.
- Exercise trends are selectable only for movements with enough repeated completed exposure.
- Volume is calculated only from weighted working sets; reps-only history is shown when weighted volume is unavailable.
- Top progress and needs-attention indicators use cautious deterministic language.

### Phase 9 - Exercise Library Expansion

Goal: strengthen exercise metadata and substitution support.

High-level scope: primary muscle, secondary muscles, equipment, movement pattern, difficulty, notes/cues, and substitutions.

Intended user value: the user gets better template structure, clearer substitutions, and more accurate analysis inputs.

Implemented behavior:

- Default exercise definitions were expanded across chest, lats, upper back, delts, legs, arms, abs, calves, and traps.
- Exercise definitions now carry deterministic metadata for primary muscle group, optional secondary muscle groups, equipment, movement pattern, difficulty, notes/cues, and source type.
- Custom template editing includes exercise search/filtering by exercise, muscle, equipment, movement pattern, and notes.
- Custom exercises can be created inline while adding or editing a custom template prescription.
- Seed updates are idempotent by stable exercise IDs and do not delete existing definitions or completed workout history.
- Substitution behavior remains explicit and history-safe. Full substitution recommendation metadata is deferred; current substitution clarity is supported by names, muscle groups, and richer exercise metadata.
- Progress and Training Analysis remain primary-muscle-only and continue to exclude warmups and incomplete sets.

### Phase 10 - Export / Backup / Import

Goal: improve local-first data durability.

High-level scope: improved JSON export, CSV export, backup import, template export, session export, and progress summary export.

Intended user value: the user can preserve, restore, and inspect training data without cloud sync.

### Phase 11 - Lift Atlas Brand Pass

Goal: transition HIT Log V2 into Lift Atlas.

High-level scope: app rename, branding, product copy, onboarding, visual identity, and a training-map product feel.

Intended user value: the product gains a clearer long-term identity once the training system is solid.

## Local-first data

V2 should remain local-first and export-friendly. Core records should use stable IDs and timestamps where appropriate. The app should preserve enough structure to export templates, sessions, completed exercises, set logs, notes, and progression context without reverse-engineering display text.

## Acceptance criteria

- The app can present a library-first experience before an active routine exists.
- The app can switch emphasis to Train once an active routine exists.
- Prebuilt templates are readable but not directly editable.
- Prebuilt templates can be duplicated into custom templates.
- Custom templates can be edited.
- One active routine is supported at a time.
- Workout sessions are saved separately from templates.
- Planned exercises and completed exercises are separated.
- Warmups are excluded from progression, PRs, working-set volume, charts, and weekly set totals.
- Progression recommendations are deterministic and include reason text.
- History comparison includes last time, best ever / PR, last five sessions, and prior notes.
