# Automate architecture workflow

## Goal

Update `AGENTS.md` so agents continuously and intelligently detect when
`improve-codebase-architecture` is warranted, then autonomously run the safe
parts of discovery, selection, prompt execution, commit, and review without
waiting for the user to invoke the skill or approve intermediate steps.

Preserve deliberate human decision gates only where automation would require
new authority or guess at product intent: ambiguous recommendations, new
providers or dependencies, security-sensitive changes, destructive migrations,
public-interface or data-contract changes, ADR-worthy decisions, or overlap with
unrelated work.

The user explicitly requested that this workflow not wait for a “go ahead.”
That instruction pre-authorizes this documentation change and the narrowly
defined future architecture automation below; it does not authorize pushing.

## Why this is dependency-safe

This changes only the durable workflow contract. It does not run an architecture
audit, modify runtime code, introduce a dependency, or alter the ordered build
sequence. The existing architecture workflow and its companion skills are
already documented and committed.

## Sources and repository state

- `AGENTS.md`, especially sections 3.2–3.7, 4, 5, and 8.
- `prompts/01-integrate-architecture-audit-workflow.md`.
- `.agents/skills/improve-codebase-architecture/SKILL.md` and
  `HTML-REPORT.md`.
- `.agents/skills/codebase-design/SKILL.md`, `DEEPENING.md`, and
  `DESIGN-IT-TWICE.md`.
- `.agents/skills/grilling/SKILL.md`.
- `.agents/skills/domain-modeling/SKILL.md` and its glossary/ADR formats.
- `.agents/skills/code-review/SKILL.md`.
- `.agents/skills/caveman-commit/SKILL.md`.
- Branch `main`; latest commit before this task is `5194298`.
- Pre-existing dirty paths include `skills-lock.json`, installed skill
  directories and symlinks, `design/`, and `ref/`. Preserve and exclude all of
  them from staging and commits.

No Next.js guide, design reference, crop, measurement, browser check, responsive
state, or runtime API applies to this documentation-only task.

## Scope

1. Amend the normal approval workflow so only a precisely defined automatic
   architecture prompt can bypass the approval question. It must still be
   detailed, self-contained, saved in `prompts/`, re-read before execution, and
   reviewed against an immutable `BASE_SHA`.
2. Require a lightweight architecture-signal check while resolving build state
   for meaningful implementations and resumptions. A full audit runs only when
   evidence crosses the existing threshold; never audit merely because a check
   occurred.
3. Define signals: repeated churn, scattered domain rules, callers learning
   internal sequencing, tests crossing interfaces, repeated adapters, and
   approved provider seams. Require evidence from code, tests, and Git history.
4. Preserve the existing exclusions, including the early design-system phase,
   routine visual/accessibility work, shallow codebases, and speculative
   abstraction.
5. Add an autonomous path after the HTML report:
   - rank candidates using recommendation strength, deletion-test evidence,
     locality, leverage, test-surface improvement, dependency category, and
     scope/risk;
   - automatically select only one uniquely strongest `Strong` candidate;
   - do not ask the selection question in autonomous mode;
   - retain the exact question for interactive audits and ambiguous results.
6. In autonomous mode, do not misuse `grilling`, because its contract reserves
   decisions for the user. Resolve factual branches from repository evidence;
   use Design-It-Twice automatically for a nontrivial but still in-scope
   interface; select the best design by depth, locality, seam placement, and
   caller simplicity.
7. Permit autonomous `domain-modeling` updates only when terminology is already
   unambiguous from code and requirements. An ADR-worthy or fuzzy domain choice
   exits autonomous mode and requests the necessary user decision.
8. Define strict eligibility for auto-executing the resulting prompt:
   - behavior-preserving refactor within already approved scope;
   - uniquely strongest `Strong` candidate backed by concrete evidence;
   - no new product behavior, provider, dependency, migration, public interface,
     persistent data contract, security model, or external side effect;
   - no overlap with unrelated/user-authored dirty files;
   - focused tests or other proportionate verification can prove preservation.
9. When eligible, mark the prompt `AUTO-APPROVED: architecture workflow`, skip
   the approval question, re-read all sources/skills, implement, verify, update
   docs, commit locally, run dual-axis review, fix verified findings, and
   re-review when required. Never push.
10. When ineligible or ambiguous, do not silently choose, expand scope, or
    weaken safeguards. Pause only the architecture automation, preserve the
    report, and ask the smallest decision needed if the current task cannot
    continue safely; otherwise continue the already approved task and report
    the deferred candidate.
11. Update the skills table so `improve-codebase-architecture` explicitly owns
    automatic detection and safe orchestration.
12. Clarify that this standing authorization overrides the source skill's
    selection pause only for the conservative autonomous path; all other skill
    rules remain intact.

## Expected files

- `AGENTS.md`.
- `prompts/02-automate-architecture-workflow.md`.

## Non-goals

- Running an audit or refactoring application code now.
- Removing prompts, commits, code review, or verification.
- Automatically making product, provider, security, migration, public-contract,
  or ADR-worthy decisions.
- Invoking `grilling` without a user decision session.
- Turning every implementation into a full audit.
- Modifying phase dependencies, installed skills, lockfiles, designs, or refs.
- Pushing commits.

## Accessibility, security, data, and UI

No shipped UI, route, component ownership, state, responsive behavior, data
shape, or runtime security behavior changes. The automation must remain
conservative around security and persistent data and must keep temporary HTML
reports outside the repository.

## Acceptance criteria

- Agents inspect evidence automatically without requiring explicit invocation.
- Full audits run only at a documented threshold.
- A uniquely strongest, low-risk `Strong` candidate can proceed through prompt,
  implementation, commit, and review without an approval question.
- Ambiguous or authority-expanding decisions still stop safely.
- `grilling` remains reserved for actual user decision sessions.
- Nontrivial eligible interfaces receive autonomous Design-It-Twice comparison.
- Prompts, immutable review bases, verification, local commits, two-axis review,
  fix commits, and no-push rules remain mandatory.
- Interactive audits retain the exact selection question.
- Existing phase-control commands remain deterministic.
- No unrelated file is staged or committed.

## Verification

1. Re-read the complete changed sections and this prompt.
2. Run `git diff --check`.
3. Verify the approval exception, `AUTO-APPROVED` marker, automatic signal
   check, exact interactive selection question, safety gates, and no-push rule
   with `rg`.
4. Inspect the complete diff and staged diff.
5. Commit only `AGENTS.md` and this prompt using `caveman-commit`.
6. Run `code-review` from the immutable pre-change `BASE_SHA` with independent
   Standards and Spec subagents; evaluate and fix valid findings separately.
7. No lint, typecheck, build, browser, screenshot, or visual comparison is
   warranted for a Markdown-only workflow change.

## Documentation

`AGENTS.md` remains the single owner of the automation contract. Do not create a
second workflow document, `CONTEXT.md`, or an ADR for this task.

## SKILLS USED

- `improve-codebase-architecture` — audit stages and candidate evidence.
- `codebase-design` — deep-module vocabulary, ranking criteria, seam discipline,
  dependency classification, and Design-It-Twice.
- `grilling` — defines why autonomous mode must not impersonate user decisions.
- `domain-modeling` — safe glossary and ADR decision gates.
- `code-review` — mandatory independent Standards and Spec review.
- `caveman-commit` — implementation and review-fix commit messages.
