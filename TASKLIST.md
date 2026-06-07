# TASKLIST

## Phase 2A - Docs Lock

- [x] Update README.md
- [x] Update PRODUCT_SPEC.md
- [x] Update ARCHITECTURE.md
- [x] Update TASKLIST.md

## Phase 2B - Navigation Shell

- [x] Add Train / Library / History / Progress / Settings
- [x] Preserve existing working app behavior
- [x] Use placeholders where needed
- [x] Do not build template engine yet

## Phase 2C - Template Data Model

- [x] Add WorkoutTemplate
- [x] Add ActiveRoutine
- [x] Add TemplateDay
- [x] Add ExerciseDefinition
- [x] Add ExercisePrescription
- [x] Add ProgressionPolicy

## Phase 2D - Library UI

- [x] Add prebuilt template list
- [x] Add custom template list
- [x] Add template detail screen
- [x] Add duplicate prebuilt template
- [x] Add set as active routine

## Phase 2E - Active Routine

- [x] Load the persisted active routine on Train
- [x] Show a no-active-routine Train empty state
- [x] Show active routine template details on Train
- [x] Resolve the current or next template day for display
- [x] Navigate from Train to Library to choose or change a routine
- [x] Preserve existing Yates Log access

## Phase 2F - Workout Execution

- [x] Start workout from active routine
- [x] Log working sets
- [x] Log optional warmup sets
- [x] Allow controlled substitutions
- [x] Add exercise-level notes
- [x] Add optional effort/RIR at exercise level
- [x] Advance routine after completed workout

## Phase 2F.5 - Template and Workout UX Cleanup

- [x] Remove/de-emphasize legacy Yates Log UI
- [x] Improve workout set warmup UX
- [x] Fix mobile text wrapping/layout issues
- [x] Fix custom templates list
- [x] Add basic custom template editing

## Phase 2G - History Comparison

- [x] Show last time
- [x] Show best ever / PR
- [x] Show last five sessions
- [x] Show prior notes

## Phase 2H - Progression Engine

- [x] Add double progression
- [x] Add top-set progression
- [x] Add rep progression
- [x] Add manual progression
- [x] Add no progression
- [x] Add recommendation reason text

## Phase 2H.1 - Progression/History Empty-State Cleanup

- [x] Clean progression empty states
- [x] Clean history empty states
- [x] Avoid fake recommendations or fake PRs when history is missing

## Phase 3 - Template Refinement

- [x] Validate prebuilt template volume
- [x] Validate rep ranges
- [x] Validate exercise selections
- [x] Validate progression defaults

## Phase 4 - History Tab Activation

- [x] Add completed V2 workout sessions list
- [x] Add completed V2 workout session detail
- [x] Add V2 exercise history lookup
- [x] Add History tab empty states

## Phase 4.1 - History Stability & Roadmap Cleanup

- [x] Stabilize History scroll/state after completed session detail navigation
- [x] Stabilize Exercise History selection without full-screen reset
- [x] Clean duplicate/stale roadmap task entries
- [x] Confirm roadmap docs agree on phase order

## Phase 4.2 - History Usability Finish

- [x] Show latest 5 completed sessions by default
- [x] Add View all completed sessions control
- [x] Add Show less control
- [x] Keep Exercise History reachable below Completed Sessions
- [x] Smooth Exercise History selection without visible loading text

## Phase 5 - Training Targets & Template Analysis

- [x] Add weekly working sets by muscle group
- [x] Add template muscle bias analysis
- [x] Add goal fit analysis
- [x] Add undertrained muscle indicators
- [x] Add overloaded muscle indicators
- [x] Add active routine target comparison
- [x] Add aesthetic hypertrophy guardrails

## Phase 5.1 - Training Analysis UI & Guardrail Cleanup

- [x] Fix Train custom-header safe-area spacing
- [x] Fix template detail custom-header safe-area spacing
- [x] Soften aesthetic guardrail label for minor metadata-limited near misses
- [x] Keep undertrained and overloaded guardrail notes visible

## Phase 6 - Custom Template Structure Editing

- [x] Add/remove template days
- [x] Reorder template days
- [x] Add/remove exercises
- [x] Reorder exercises
- [x] Edit sets
- [x] Edit rep ranges
- [x] Edit progression methods
- [x] Edit rest guidance
- [x] Edit notes
- [x] Duplicate templates
- [x] Preserve prebuilt templates as read-only

## Phase 6.1 - Custom Template Editing Safety & Usability

- [x] Disable/block deleting the last remaining custom template day
- [x] Keep mutation errors inline instead of replacing the loaded template
- [x] Group exercise selection by existing muscle group
- [x] Add progression method help text

## Phase 7 - Workout Experience Revamp

- [x] Improve workout start flow
- [x] Add current exercise focus mode
- [x] Speed up set entry
- [x] Improve previous performance visibility
- [x] Add rest timer
- [x] Improve warmup UX
- [x] Improve notes UX
- [x] Improve workout completion flow
- [x] Add in-progress workout recovery
- [x] Improve substitution flow
- [x] Improve one-hand usability

## Phase 8 - Progress Dashboard & Charts

- [x] Add exercise strength trend
- [x] Add volume trend
- [x] Add muscle-group weekly sets
- [x] Add consistency chart
- [x] Add top progress indicators
- [x] Add needs-attention indicators
- [x] Add baseline collection state before chart unlock

## Phase 9 - Exercise Library Expansion

- [x] Add primary muscle metadata
- [x] Add secondary muscle metadata
- [x] Add equipment metadata
- [x] Add movement pattern metadata
- [x] Add difficulty metadata
- [x] Add notes/cues
- [x] Expand default exercise library
- [x] Add custom exercise creation during custom template editing
- [x] Add exercise picker search/filter
- [x] Document substitution metadata limitations
- [x] Defer full substitution recommendation metadata

## Phase 10 - Export / Backup / Import

- [x] Improve JSON export
- [x] Add export summary
- [x] Add CSV export
- [x] Export templates
- [x] Export custom templates and custom exercises
- [x] Export active routine state
- [x] Export completed sessions, completed exercises, and set logs
- [x] Preserve completed exercise snapshots
- [x] Document import/restore as deferred for safety
- [x] Add Settings backup/export surfaces
- [x] Document field-test backup workflow

## Phase 11 - Lift Atlas Brand Pass

- [ ] Rename app
- [ ] Update branding
- [ ] Update product copy
- [ ] Update onboarding
- [ ] Update visual identity
- [ ] Shift product feel toward a training map
