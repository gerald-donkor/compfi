# Integrate the architecture-audit workflow

## Goal

Amend `AGENTS.md` so Compfi uses the installed
`improve-codebase-architecture` skill as an evidence-gated architecture
discovery and decision checkpoint. The audit must supplement the existing
prompt, commit, and mandatory two-axis review lifecycle; it must not become a
generic review pass, an automatic phase gate, or permission to refactor before
the user chooses a candidate.

This is the next dependency-safe unit because it changes only the repository's
workflow contract. It introduces no runtime dependency and does not depend on
the design-system implementation. The companion skills are now present locally,
so the policy can name a faithful end-to-end process.

## Starting repository state

- Branch: `main`.
- Current committed baseline: `a9f1307` (`first commit`).
- `AGENTS.md` is already modified in the worktree with the broader Compfi
  project contract supplied by the user. This approved task treats that current
  worktree version as the authoritative input and will preserve it while adding
  the architecture workflow.
- `skills-lock.json`, installed Clerk skills, `code-review`, `codebase-design`,
  `domain-modeling`, `grilling`, `.claude/skills/*`, `design/`, and `ref/` contain
  pre-existing user changes or untracked files. Do not alter, stage, or commit
  them.
- `improve-codebase-architecture` is already tracked. Its three required
  companion skill directories are installed but currently untracked; this task
  may read them but must not stage or commit them.
- `CONTEXT.md`, `docs/adr/`, and `docs/agents/issue-tracker.md` do not exist.
- No `prompts/` directory existed before this prompt.

Because the current `AGENTS.md` content is wholly uncommitted relative to
`HEAD`, Git cannot commit only the new architecture paragraphs as an independent
snapshot. Approval of this prompt explicitly includes the current `AGENTS.md`
worktree content in the documentation commit, while every other pre-existing
path remains excluded.

## Sources inspected

- `AGENTS.md`, especially sections 2–5, 8, and 12–13.
- `.agents/skills/improve-codebase-architecture/SKILL.md`.
- `.agents/skills/improve-codebase-architecture/HTML-REPORT.md`.
- `.agents/skills/codebase-design/SKILL.md`.
- `.agents/skills/codebase-design/DEEPENING.md`.
- `.agents/skills/codebase-design/DESIGN-IT-TWICE.md`.
- `.agents/skills/grilling/SKILL.md`.
- `.agents/skills/domain-modeling/SKILL.md`.
- `.agents/skills/domain-modeling/CONTEXT-FORMAT.md`.
- `.agents/skills/domain-modeling/ADR-FORMAT.md`.
- `.agents/skills/code-review/SKILL.md`.
- `.agents/skills/caveman-commit/SKILL.md`.
- `git status --short`, current branch, recent log, tracked skill files, and the
  existence checks for domain and issue-tracker documentation.

No installed Next.js guide applies because this task changes repository process
documentation only and uses no framework API. No design reference, crop, or
measurement applies because no customer-facing UI is changed.

## Scope

Update only `AGENTS.md` (plus retain this approved prompt as the task's Spec) to
make the following workflow explicit:

1. Add `CONTEXT.md` to the documentation index as a planned, lazily created
   domain glossary. Do not claim it exists. State that `docs/adr/` is created
   only when the first qualifying ADR is accepted rather than indexing a
   nonexistent file.
2. Add a dedicated architecture-discovery subsection near the mandatory review
   and skill-discovery rules. Preserve clear numbering and update every affected
   cross-reference, including guarded push references.
3. Define the audit triggers:
   - an explicit user request; or
   - an evidence-backed hotspot after meaningful implementation exists, such as
     repeated Git churn, scattered commerce rules, difficult interface-level
     tests, or a real multi-adapter/provider seam.
4. Define the recommended timing as a checkpoint after phases 4–5, when catalog,
   product, comparison, cart, pricing, and checkout behavior can provide real
   evidence, and before phase 10 when an approved integration creates a genuine
   seam. Do not add a compulsory numbered build phase.
5. Define exclusions: do not run during the initial design-system phase, after
   every implementation, for visual/accessibility review, as a replacement for
   `code-review`, or to justify speculative abstractions. One adapter remains a
   hypothetical seam; two adapters justify a real seam.
6. Define the discovery flow:
   - scope the scan using the user's direction or Git hot spots;
   - read `CONTEXT.md` and relevant ADRs when present;
   - if no glossary exists, use `domain-modeling` to establish only the domain
     terms needed for the scan rather than pre-populating a speculative model;
   - load `codebase-design` and use its exact architecture vocabulary;
   - spawn the exploration subagent required by the skill;
   - apply YAGNI and the deletion test;
   - classify dependencies as in-process, local-substitutable, remote-owned
     ports and adapters, or true external/mock;
   - generate one timestamped, self-contained HTML report under the resolved OS
     temp directory, open it for the user, report the absolute path, and keep it
     outside the repository;
   - include candidate files, problem, solution, benefits in locality/leverage
     terms, before/after visuals, recommendation strength, ADR conflicts, and a
     top recommendation;
   - propose no interfaces in this scan and stop by asking exactly, “Which of
     these would you like to explore?”
7. Define the decision flow after selection:
   - use `grilling` as a multi-round design tree until shared understanding is
     confirmed;
   - use `domain-modeling` inline for terms that genuinely crystallize;
   - offer an ADR only for a load-bearing rejection or decision satisfying the
     domain-modeling skill's hard-to-reverse, surprising, and real-trade-off
     tests;
   - when alternative interfaces are requested, use `codebase-design`'s
     Design-It-Twice process with at least three parallel, isolated designs;
   - do not turn rejected or deferred candidates into backlog items
     automatically.
8. Require the selected and sufficiently resolved candidate to enter the normal
   Compfi implementation lifecycle: exactly one detailed prompt, approval,
   implementation, local commit, mandatory Standards/Spec `code-review`, valid
   fixes, and any required re-review. Architecture discovery never authorizes
   the refactor itself.
9. Clarify that the architecture vocabulary applies to architecture analysis
   and does not rename the established React UI taxonomy of primitive,
   component, block, and page.
10. Add `improve-codebase-architecture`, `codebase-design`, `grilling`, and
    `domain-modeling` to the skills table with precise, non-overlapping roles.
11. Add a short note beneath the ordered build sequence describing the
    recommended evidence checkpoint without changing phase dependencies.

## Expected files

- `AGENTS.md` — update the documentation index, workflow, skills table, build
  sequence note, and affected section references.
- `prompts/01-integrate-architecture-audit-workflow.md` — retain as the approved
  specification and approval record.

Do not create `CONTEXT.md` or an ADR in this task. Their content requires real
domain decisions, not boilerplate.

## Runtime, UI, and data impact

- Routes: none.
- React component, block, primitive, and server/client ownership: not
  applicable.
- Data shapes and commerce behavior: unchanged.
- Responsive widths (1440, 1024, 768, 390, 320), visual states, browser flows,
  screenshots, and design-reference deltas: not applicable to this
  documentation-only change.
- Accessibility and security runtime behavior: unchanged. The workflow must keep
  temporary audit reports outside the repository and must not treat CDN-backed
  report HTML as production application code.

## Edge cases and reconciliation rules

- If an audit is requested before meaningful architecture exists, explain that
  the evidence threshold is unmet and do not fabricate candidates.
- If `CONTEXT.md` or `docs/adr/` is absent, absence is not permission to invent a
  complete domain model or decisions. Create/update them lazily only when terms
  or qualifying decisions crystallize.
- If an ADR conflicts with a candidate, surface the candidate only when observed
  friction justifies reopening the ADR and label the conflict clearly.
- The audit's temporary HTML report is disposable discovery evidence, not an
  owning project document, build artifact, implementation prompt, or backlog.
- `improve-codebase-architecture` supplements but never replaces the mandatory
  two-axis code review, which still runs only after a self-verified local
  implementation commit.
- The architecture skill's required subagents and Design-It-Twice subagents are
  explicitly authorized only within their documented audit/design roles.
- Preserve the source skill's exact question and do not silently continue from
  candidate presentation into interface design or implementation.
- Preserve existing UI terminology where “component” has its React/design-system
  meaning; use `module`, `interface`, `implementation`, `depth`, `seam`,
  `adapter`, `leverage`, and `locality` for architecture suggestions.

## Non-goals

- Running an architecture scan now.
- Generating or opening an HTML architecture report.
- Creating a Compfi domain glossary or ADR without a resolved term or decision.
- Refactoring application code.
- Installing, staging, or committing skills.
- Altering the ordered phase dependencies.
- Changing the mandatory review, commit, approval, or push guarantees except for
  cross-reference renumbering needed by the new subsection.
- Adding a generic recurring architecture review after every task.

## Acceptance criteria

- A reader can tell exactly when an architecture audit is justified, when it is
  prohibited, and why it is separate from `code-review`.
- The documented scan and selection flow matches
  `improve-codebase-architecture/SKILL.md`, including temp-only HTML output, the
  exploration subagent, no premature interfaces, and the exact stopping
  question.
- The selected-candidate flow faithfully incorporates `grilling`, inline
  `domain-modeling`, sparse ADRs, and Design-It-Twice.
- The recommended checkpoint after phases 4–5 and before relevant phase-10
  integrations is clear but optional and evidence-gated.
- The documentation index truthfully marks `CONTEXT.md` as planned/lazy and does
  not claim an ADR directory exists.
- The skill table gives all four architecture/domain skills distinct roles.
- Existing implementation approval, local-commit, mandatory two-axis review,
  and guarded-push behavior remains intact.
- All headings, section references, Markdown lists, and tables remain coherent.
- No unrelated pre-existing path is modified, staged, or committed.

## Verification

1. Re-read the complete resulting `AGENTS.md` and this prompt.
2. Run `git diff --check`.
3. Use `rg` to verify every reference to sections 3.5–3.7 and guarded push points
   to the intended heading.
4. Use `rg` to verify the five skill-table entries and the exact candidate
   selection question.
5. Inspect `git diff -- AGENTS.md` and the staged diff before committing.
6. Confirm `git status --short` still shows all unrelated pre-existing paths as
   uncommitted/untracked and excludes them from the staged set.
7. No lint, TypeScript, build, browser, screenshot, accessibility, or visual
   check is warranted because no executable or customer-facing file changes.
8. Create the local documentation commit on `main` using `caveman-commit`; do not
   push.
9. Run the mandatory dual-axis `code-review` from the immutable pre-change
   `BASE_SHA`, with this prompt as the Spec and `AGENTS.md` plus relevant skill
   instructions as Standards. The missing
   `docs/agents/issue-tracker.md` must be reported as the skill's setup gap; do
   not invent issue content. Evaluate findings against the actual documentation
   and create a separate fix commit only for verified findings.

## Documentation

`AGENTS.md` remains the owner of this durable workflow. Do not create a second
architecture-process document. `CONTEXT.md` will own domain vocabulary once real
terms are resolved, and `docs/adr/` will contain only accepted, qualifying
decisions.

## SKILLS USED

- `improve-codebase-architecture` — source of the evidence-gated scan, temporary
  visual report, candidate presentation, and selection handoff.
- `codebase-design` — exact deep-module vocabulary, deletion test, dependency
  classification, seam discipline, and Design-It-Twice process.
- `grilling` — selected-candidate design-tree discussion and confirmation gate.
- `domain-modeling` — lazy glossary updates and strict ADR qualification.
- `code-review` — mandatory independent Standards and Spec review after the
  documentation commit.
- `caveman-commit` — concise Conventional Commit message for the implementation
  and any review-fix commit.
