# HIT Log V2 Roadmap

This roadmap is the durable project history for HIT Log V2. It records completed work, the current phase, planned product phases, and the long-term product direction.

Source of truth hierarchy:

1. Repo docs
2. Master Chat
3. Phase Chat
4. Codex Prompt

## Completed Phases

### Phase 2A - Docs Lock

Established the initial V2 product direction, architecture guidance, and task structure.

### Phase 2B - Navigation Shell

Added the V2 bottom navigation target:

- Train
- Library
- History
- Progress
- Settings

### Phase 2C - Template Data Model

Added the core V2 data model for reusable templates, active routines, template days, exercise definitions, exercise prescriptions, and progression policies.

### Phase 2D - Library UI

Added the template library experience, including prebuilt templates, custom templates, template detail, duplication, and setting an active routine.

### Phase 2E - Active Routine

Connected Train to the active routine state, including current/next template-day resolution and navigation back to Library for routine selection.

### Phase 2F - Workout Execution

Added the V2 workout execution loop:

- Start workout from active routine
- Log working sets
- Log optional warmup sets
- Substitute exercises without mutating templates
- Add exercise-level notes
- Track optional effort/RIR
- Complete a workout into durable V2 history
- Advance the active routine after completion

### Phase 2F.5 - Template & Workout UX Cleanup

Cleaned up the template and workout experience after the initial execution pass:

- De-emphasized legacy Yates Log UI
- Improved warmup logging UX
- Fixed mobile text wrapping and layout issues
- Improved custom template list behavior
- Added basic custom template editing

### Phase 2G - History Comparison

Added workout-context history comparison:

- Last time
- Best ever / PR context
- Last five sessions
- Prior notes

Warmups are excluded from progression and comparison calculations.

### Phase 2H - Progression Engine

Added deterministic progression support for the approved V2 methods:

- `double_progression`
- `top_set_progression`
- `rep_progression`
- `manual`
- `none`

Progression recommendations include explainable reason text.

### Phase 2H.1 - Progression/History Empty-State Cleanup

Cleaned up progression and history empty states so missing history is explained clearly without fake recommendations, fake PRs, or misleading output.

### Phase 3 - Template Refinement

Refined the approved prebuilt templates:

- Aesthetic Hypertrophy 3x/week
- Strength Foundation 3x/week
- Dorian Yates-Inspired HIT Routine

The refinement pass improved exercise selection, prescription-level progression defaults, rep ranges, volume, rest guidance, and template notes.

### Phase 4 - History Tab Activation

Goal: make the History tab useful as the factual V2 training record.

Scope:

- Completed V2 workout sessions list
- Completed session detail
- Warmup sets visible but separated from working sets
- Clean weighted and reps-only set display
- Exercise history lookup
- Prior completed performances by exercise
- V2-only history reads
- Empty states for no completed sessions and no exercise history

History is what happened. Progress is what it means. Charts and Progress dashboard work remain deferred.

### Phase 4.1 - History Stability & Roadmap Cleanup

Goal: stabilize the activated History tab and align roadmap documentation before starting Phase 5.

Scope:

- Reduce History scroll/state jumps after returning from completed session detail
- Reduce History scroll/state jumps while switching Exercise History entries
- Keep the History screen mounted during localized exercise-history loading where practical
- Clean stale or duplicate roadmap/task-list entries
- Confirm root docs and `docs/ROADMAP.md` agree on phase order

This is a small cleanup phase. It does not add charts, training targets, template editing, branding changes, or new product features.

### Phase 4.2 - History Usability Finish

Goal: improve History usability after the tab activation and stability pass.

Scope:

- Show only the latest 5 completed sessions by default
- Add in-place expand/collapse for all completed sessions
- Keep Exercise History reachable as the session list grows
- Remove visible loading flashes during normal local exercise-history selection
- Keep previous exercise-history results mounted until the next selection is ready

This remains a History usability finish. It does not add charts, training targets, template analysis, or Phase 5 behavior.

### Phase 5 - Training Targets & Template Analysis

Goal: add deterministic training-system analysis before charts.

Scope:

- Weekly working sets by muscle group
- Template muscle bias
- Goal fit analysis
- Undertrained muscle indicators
- Overloaded muscle indicators
- Active routine target comparison
- Aesthetic hypertrophy guardrails

Implemented behavior:

- Library template detail includes a Training Analysis section.
- Train includes a compact active-routine analysis summary.
- Analysis uses planned exercise prescriptions only.
- Warmups, completed workout history, legacy Yates data, and charts are excluded.
- Goal labels are aware of aesthetic hypertrophy, strength foundation, and low-volume HIT routine purposes.
- Phase 5.1 fixed custom-header safe-area spacing and softened aesthetic guardrail severity for metadata-limited near misses while preserving guardrail notes.

### Phase 6 - Custom Template Structure Editing

Goal: allow meaningful editing of custom templates.

Scope:

- Add/remove template days
- Add/remove exercises
- Reorder template days
- Reorder exercises
- Edit sets
- Edit rep ranges
- Edit progression methods
- Edit rest guidance
- Edit notes
- Duplicate templates

Implemented behavior:

- Prebuilt templates remain read-only.
- Prebuilt templates can be duplicated into custom templates.
- Custom template days can be added, renamed, reordered, and deleted while preserving at least one day.
- Custom exercise prescriptions can be added from existing exercise definitions, removed, reordered, and edited.
- Template Analysis updates from the edited planned structure and shows deterministic guardrail feedback.
- Active custom routines fall back to a remaining day if their current day is deleted.

### Phase 6.1 - Custom Template Editing Safety & Usability

Goal: clean up Phase 6 before acceptance.

Scope:

- Block final-day deletion for custom templates at the UI and repository levels
- Keep edit failures inline so the template stays open and usable
- Group exercise selection by existing muscle-group metadata
- Add concise progression-method help text

### Phase 7 - Workout Experience Revamp

Goal: substantially redesign the workout experience.

Scope:

- Better workout start flow
- Current exercise focus mode
- Faster set entry
- Previous performance visibility
- Rest timer
- Better warmup UX
- Better notes UX
- Better workout completion flow
- In-progress workout recovery
- Better substitution flow
- One-hand usability improvements

Implemented behavior:

- Train shows clearer next-workout context with exercise count and planned working sets.
- Active workouts focus on the current exercise with compact navigation to the rest of the session.
- Previous performance, prior notes, and deterministic progression recommendations are placed inside the exercise flow.
- Warmup and working sets are visually distinct, with warmup exclusion rules visible during logging.
- A simple local rest timer can start from prescription rest guidance, stop, and reset without blocking logging.
- In-progress workout drafts autosave locally and can be resumed from Train.
- Completion includes a simple summary for exercises, working sets, volume, notes, and substitutions.

### Phase 8 - Progress Dashboard & Charts

Goal: provide meaningful progress visibility.

Scope:

- Progress dashboard
- Exercise strength trends
- Exercise volume trends
- Weekly muscle-group trends
- Consistency tracking
- Top progress indicators
- Needs-attention indicators

Charts should be gated.

Baseline collection requirements before chart unlock:

- At least 2 calendar weeks of completed V2 workouts
- At least 4 completed workouts
- At least 2 repeated exposures per exercise
- Exclude warmup sets
- Exclude incomplete sets

Implemented behavior:

- Progress shows a deterministic baseline collection state until enough V2 workout history exists.
- The dashboard summarizes completed workouts, training weeks, working sets, weighted volume, and consistency.
- Exercise trend selection is limited to movements with at least two completed exposures.
- Strength trends use best working sets by session.
- Volume trends use `weight x reps` for weighted working sets only, with reps history shown instead when no weighted sets exist.
- Weekly muscle-group summaries count completed working sets from available muscle-group metadata.
- Top progress and needs-attention indicators use cautious deterministic language.

Warmups, blank/incomplete sets, legacy Yates data, bodyweight data, wearable data, remote services, and AI are excluded.

## Current Phase

Phase 9 is implemented and ready for manual verification.

## Recently Completed Phase

### Phase 9 - Exercise Library Expansion

Goal: strengthen exercise metadata and substitution support.

Scope:

- Primary muscle
- Secondary muscles
- Equipment
- Movement pattern
- Difficulty
- Notes/cues
- Substitutions

Implemented behavior:

- Expanded the default exercise library to 80 definitions across chest, lats, upper back, delts, quads, hamstrings, glutes, biceps, triceps, abs, calves, and traps.
- Added exercise definition metadata for equipment, movement pattern, difficulty, notes/cues, and source type while preserving secondary muscle metadata.
- Added inline custom exercise creation while editing custom template prescriptions.
- Added picker search/filtering so the larger grouped exercise library stays scannable.
- Kept Training Analysis and Progress primary-muscle-only for this phase; secondary muscles are stored but not fractionally counted.
- Preserved explicit substitution behavior. Full substitution candidate metadata remains future work.

## Planned Phases

### Phase 10 - Export / Backup / Import

Goal: improve local-first data durability.

Scope:

- Improved JSON export
- CSV export
- Import from backup
- Export templates
- Export sessions
- Export progress summaries

### Phase 11 - Lift Atlas Brand Pass

Goal: transition HIT Log V2 into Lift Atlas.

Scope:

- Rename app
- Update branding
- Update product copy
- Update onboarding
- Update visual identity
- Make the product feel like a training map rather than a workout logger

## Long-Term Direction

HIT Log V2 should remain local-first, template-library-first, and guided-progressive-overload focused. The product should prioritize fast workout execution, factual history, deterministic recommendations, and practical hypertrophy/mass-gain decision support before broader integrations or branding expansion.

Do not add AI, Oura, Withings, cloud sync, bodyweight tracking, advanced periodization, social features, or remote persistence unless explicitly requested.
