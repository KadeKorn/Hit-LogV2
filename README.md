# HIT Log V2

HIT Log V2 is a template-library-first, guided-progressive-overload training system.

The app starts as a simple training library: browse best-practice training information, choose from prebuilt evidence-based templates, create custom templates, duplicate prebuilt templates, and set one routine as active. Once an active routine exists, the product shifts from library browsing to guided training: the Train tab should show the next workout, last-time comparison, best-ever context, recent history, prior notes, and deterministic progression recommendations.

## Product Direction

HIT Log V2 is personal-first and hypertrophy / mass-gain focused. It prioritizes:

- physique-building volume
- progressive overload
- repeatable training routines
- fast workout execution
- simple logging
- history comparison
- next-workout guidance

The app should stay structured cleanly enough to support other lifters later, but V2 decisions should serve the founder's personal training workflow first.

## Core V2 Scope

- Reusable workout templates
- Prebuilt evidence-based templates
- Custom template creation
- One active routine at a time
- Deterministic progression recommendations
- Better history comparison
- Cleaner mobile UX
- Safer local-first data and export structure
- Gated progress dashboard and training charts after enough completed V2 data exists

## Initial Prebuilt Templates

- Aesthetic Hypertrophy 3x/week
- Strength Foundation 3x/week
- Dorian Yates-Inspired HIT Routine

Prebuilt templates are read-only. They can be duplicated into editable custom templates. Custom templates should be fast to create, simple to edit, and require only the minimum fields needed for progression.

## Navigation Model

Bottom navigation for V2:

- Train
- Library
- History
- Progress
- Settings

Before an active routine exists, Library is central. After an active routine exists, Train becomes central.

## Training Flow

The core V2 product flow is:

```txt
Template Library -> Active Routine -> Workout Session -> History Comparison -> Progression Recommendation
```

Progression should be deterministic, explainable, and testable. V2 does not use AI for progression.

Supported progression methods:

- `double_progression`
- `top_set_progression`
- `rep_progression`
- `manual`
- `none`

## Tech Stack

- Expo
- React Native
- TypeScript
- Expo Router
- expo-sqlite

## Repository Docs

Read these before making meaningful changes:

- `PRODUCT_SPEC.md`
- `ARCHITECTURE.md`
- `TASKLIST.md`
- `UI_RULES.md`
- `CODING_STANDARDS.md`
- `CONTRIBUTING.md`
- `docs/ROADMAP.md`

## Current Phase

Phase 9 - Exercise Library Expansion.

Phase 8 is complete. Phase 9 is implemented and ready for user manual verification.

## Current Status

HIT Log V2 has the core V2 loop in place:

```txt
Template Library -> Active Routine -> Workout Execution -> History Comparison -> Progression Recommendation -> History Review
```

The History tab is the top-level factual record for completed V2 workouts. Library includes planned training analysis. Progress now shows deterministic interpretation after enough completed V2 workout data exists, and otherwise shows a baseline collection state.

## Completed Major Milestones

- V2 docs, architecture, and navigation shell
- Template data model and Library UI
- Active routine selection and next workout flow
- V2 workout execution with warmups, substitutions, notes, effort/RIR, and routine advancement
- History comparison for last time, best ever, last five sessions, and prior notes
- Deterministic progression engine
- Refined prebuilt templates
- Training target analysis for planned templates and active routines, with Phase 5.1 UI and guardrail cleanup
- Custom template structure editing for days, exercise prescriptions, progression methods, rest guidance, notes, and deterministic analysis guardrails
- Phase 6.1 cleanup for last-day deletion safety, grouped exercise selection, and progression-method help text
- Workout experience revamp with current-exercise focus, grouped workout context, autosaved in-progress sessions, a simple rest timer, clearer warmup/working-set distinction, and a completion summary
- Gated Progress dashboard with completed-workout baseline checks, exercise strength and volume trends, weekly muscle-group working sets, consistency summary, and cautious deterministic indicators
- Expanded exercise library with richer deterministic metadata and inline custom exercise creation during custom template editing

## Upcoming Roadmap

Next planned phases include export/import improvements and the Lift Atlas brand pass.

See `docs/ROADMAP.md` for the full phase roadmap.
