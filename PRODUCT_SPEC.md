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

### Later, after template/progression flow works

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

The Progress tab should remain lightweight until charts are implemented. Charts come after templates, active routine, workout execution, history comparison, and progression recommendations are working.

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
- Custom template creation should be fast, low-friction, simple, and elegant.
- Custom templates should require only the minimum fields needed for progression.
- The app may auto-fill sensible defaults such as muscle group, progression method, increment, and rest time.
- Templates should be flexible but controlled during workout execution.
- Workout substitutions are allowed.
- Substitutions should not silently mutate the original template.
- After a workout, the user may optionally save changes back to a custom template.

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

Initial chart focus later:

- exercise strength trend
- volume trend
- muscle-group weekly sets
- consistency

Do not include bodyweight charts in the initial V2 chart scope.

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
