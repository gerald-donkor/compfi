# Correct AGENTS.md shadcn baseline and skill-installation timing

## Status

Prepared for approval. This prompt is documentation-only and must not modify
implementation files, install packages, install skills, stage files, commit,
or push anything until approved.

## Objective

Correct the stale shadcn statement in `AGENTS.md`, explicitly record that
Compfi uses shadcn/ui, and remove ambiguity about when a newly discovered skill
may be installed into the project-local `.agents/skills/` directory.

## Scope

Modify only `AGENTS.md`. Preserve all unrelated working-tree changes,
including the existing edits to `skills-lock.json`, the untracked
`.agents/skills/react-testing/` directory, and existing prompt files.

## Required changes

1. In the skills table and immediately following guidance, replace the stale
   claim that `components.json` is absent and shadcn/ui is not established.
   State that the repository has an established shadcn/ui baseline, including
   `components.json` and the existing `components/ui/` components, and that
   Compfi will use shadcn/ui for UI components. Keep the existing instruction
   to inspect project configuration and component documentation before use.
   Link the project guidance to the official docs at
   `https://ui.shadcn.com/docs`.

2. Clarify Section 3.6's timing boundary:

   - During prompt preparation, it is permitted to discover, inspect, vet, and
     record a candidate skill and its source, but not to install it into the
     repository's `.agents/skills/` directory or otherwise mutate project
     files for that installation.
   - Actual project-local skill installation occurs only after the prompt is
     approved and execution begins, unless the user explicitly instructs the
     agent to skip the approval boundary.
   - When installed during approved execution, the skill must still be read
     and used in that same task, and the source and reason must be recorded.
   - Make clear that this timing rule applies to skill installation, not to
     merely using an already-installed local skill during prompt preparation.

3. Consolidate the three repetitive 2026-09-07 skill-related ledger rows into
   one durable rule that preserves their intent: required skills are used;
   missing capabilities go through `find-skills` before selecting and
   installing the minimum suitable skill. Leave the general “always” trigger
   row intact. The detailed discovery, vetting, and installation timing
   procedure belongs in Section 3.6.

## Verification

- Confirm the stale “no `components.json`” wording is gone.
- Confirm `AGENTS.md` explicitly names shadcn/ui as the Compfi UI component
  approach and includes the official docs URL.
- Confirm Section 3.6 distinguishes prompt-time discovery/vetting from
  approved-execution installation.
- Confirm only `AGENTS.md` is changed by this task after applying the edit.
- Review the complete diff for contradictions with the prompt-approval
  boundary and the durable-rule ledger.

## Skills and sources

- Read the local `shadcn` skill before implementation because this change
  governs the established shadcn baseline.
- Use the official shadcn documentation: https://ui.shadcn.com/docs
- No new skill installation is expected for this documentation-only change.
