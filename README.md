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
- Training charts later, after the template and progression flow works

## Initial Prebuilt Templates

- Full Body Hypertrophy 3x/week
- Push / Pull / Legs
- HIT-Inspired Low-Volume Routine

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

## Current Phase

Phase 2D - Library UI is complete. The Library tab now reads persisted Phase 2C template data, separates prebuilt and custom templates, shows template details, duplicates prebuilt templates into custom templates without mutating the source, and persists the selected template as the active routine. Guided Train behavior, next-workout logic, progression calculations, charts, and integrations remain deferred to later phases.
