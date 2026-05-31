# AGENTS.md

Durable instructions for future Codex tasks in the HIT Log V2 repo.

## Product Thesis

HIT Log V2 is a template-library-first, guided-progressive-overload training system. Before an active routine exists, Library is central. After an active routine exists, Train becomes central.

The product is personal-first, local-first, and focused on hypertrophy / mass gain. It should prioritize repeatable routines, fast workout execution, simple logging, useful history comparison, and deterministic next-workout guidance.

## Required Reading

Before making meaningful changes, read:

- `README.md`
- `PRODUCT_SPEC.md`
- `ARCHITECTURE.md`
- `TASKLIST.md`
- `UI_RULES.md`
- `CODING_STANDARDS.md`
- `CONTRIBUTING.md`

## Phase Discipline

Work one phase at a time. Keep each change scoped to the requested phase or task. Do not pull future-phase features forward unless the user explicitly asks for them.

Preserve existing working behavior. When adding a shell, placeholder, route, model, service, or UI flow, keep current logging, history, export, and persistence behavior working unless the task explicitly changes it.

Update relevant docs or `TASKLIST.md` only when the requested scope is actually complete and the update is appropriate.

## Product Constraints

HIT Log V2 is local-first. Do not add cloud sync, external service dependencies, or remote persistence unless explicitly requested.

Do not add AI, Oura, Withings, cloud sync, bodyweight tracking, social features, or advanced periodization unless explicitly requested.

Do not introduce database schema changes unless the active task calls for schema work.

## Navigation Target

The V2 bottom navigation target is exactly:

- Train
- Library
- History
- Progress
- Settings

## Architecture Principles

- Templates are separate from active routines.
- Planned exercises are separate from completed exercises.
- Substitutions do not mutate templates.
- Warmups are excluded from progression, charts, PRs, working-set volume, and muscle-group weekly set totals.
- Progression must be deterministic, explainable, and testable.

## Progression Scope

Supported V2 progression methods:

- `double_progression`
- `top_set_progression`
- `rep_progression`
- `manual`
- `none`

No load-only progression in V2.

## Verification Expectations

Check `package.json` for available commands before verification.

When code changes, run available lint, typecheck, test, and build commands where present. If a command is unavailable, blocked, or fails because of the environment, report that clearly with the reason.

For docs-only changes, do not run app verification unless the change affects behavior or the user requests it.

## Done Means

A task is done when:

- The requested scope is implemented.
- Existing behavior is preserved.
- Relevant docs or `TASKLIST.md` are updated if needed.
- Changed files are listed.
- Verification results are reported.
