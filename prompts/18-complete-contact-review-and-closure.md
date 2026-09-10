# Complete Contact review and closure

## Status and authorization boundary

Prepared by the single-letter `i` workflow on 2026-09-10. This is a planning
artifact only. It authorizes no implementation, dependencies, staging,
commits, or push until the user explicitly approves it through the single-letter
`y` workflow.

Planning-time repository state is `main` at `fd48719`, with a clean worktree
(`git status --short` empty). Reconfirm `git status --short`,
`git branch --show-current`, recent history, and `HEAD` before execution. Stop
if the branch is not `main`. Preserve every unrelated path that appears after
this prompt is prepared.

## Goal and why this is the next dependency-safe unit

Finish the already implemented `/contact` content unit by running the mandatory
two-stage code review against `fd48719` from its originating base
`08a9af51581a6397812867314c5e9fdea2baf5ca`, evaluating the findings of the
parallel Standards and Spec subagents, fixing verified defects (if any),
updating the owning documentation truthfully, and committing the completion
locally.

This is the earliest dependency-safe unfinished unit. Commit `fd48719
feat(contact): add safe message review page` added the route, client-only safe
message review form, pure validation module, layout, tests, and self-verification
records. However, `docs/pages.md` explicitly records:
`Status: Phase 6 contact page implemented and self-verified; independent review pending. Phase 5 cart and checkout presentation remain verified and review-closed. Blog remains pending, so Phase 6 is not complete.`
And:
`Independent two-axis review is pending; blog (/blog) is explicitly out of scope.`

Under `AGENTS.md` section 2.4:
- "On resumption, distinguish these states explicitly: prompt only; prompt
  awaiting approval; approved work in progress; implementation committed but
  review pending; review fixes pending; complete and reviewed. Never collapse
  them into a generic 'done.'"
- "A phase is complete only when its dependency, implementation, docs, checks,
  mandatory review, accepted fixes, and required re-review evidence are all
  present."
- Under the standing ALWAYS rule: "Always run the local `code-review` skill for
  every approved implementation, using its parallel Standards and Spec
  subagents, then rigorously evaluate and resolve the findings."

Following the direct repository precedent established in Prompt 10
(`prompts/10-complete-shop-verification-and-review.md`), when an implementation
unit is committed but has review pending, completing that unit's review, defect
resolution, and documentation closure is strictly prior to starting the next
content surface. The Blog unit (`/blog`) is therefore deferred until this Contact
unit is verified, reviewed, and closed.

The required lightweight architecture-signal check found no
threshold-crossing candidate: the contact form is a single client form leaf
with pure validation in `lib/contact.ts`, reusing the established field
primitives without multi-step commerce workflows, internal data reaching, or
ad-hoc boundary adapters. Do not run an architecture audit during this approved
single-letter workflow.

## Starting evidence and immutable comparison points

- Current planning branch and `HEAD`: `main` at `fd48719` with a clean status.
- Contact implementation commit under review: `fd48719`.
- Pre-contact immutable review base: `CONTACT_BASE_SHA=08a9af51581a6397812867314c5e9fdea2baf5ca`.
- At execution start, capture `TASK_BASE_SHA=$(git rev-parse HEAD)` before any
  file edit. Never move either base.
- Confirm `git diff $CONTACT_BASE_SHA...HEAD` is non-empty and record
  `git log $CONTACT_BASE_SHA..HEAD --oneline` before invoking review.
- Originating spec: `prompts/17-build-contact-page.md`.
- Standards sources: `AGENTS.md`, `CONTEXT.md`, `docs/design-system.md`,
  `docs/components.md`, `docs/pages.md`, `docs/automation.md`, and the full
  Fowler code-smell baseline.

Before executing, re-read `AGENTS.md`, prompt 17, this prompt, all owning docs,
the relevant installed Next.js 16.3.4 guidance, every skill in `## SKILLS
USED`, and every implementation/test file in scope.

## Existing contact implementation to review

- `app/contact/page.tsx`: Server Component route owning page metadata
  (`Contact | Compfi`), `PageHero` with Home / Contact breadcrumbs,
  `main#main-content`, `ContactContent` composition, and `BenefitsStrip`.
- `components/contact/contact-content.tsx`: Server-rendered presentation
  container with two-column layout on desktop (inquiry guidance on the left,
  form on the right), responsive stacking for tablet and mobile.
- `components/contact/contact-form.tsx`: Focused client leaf using certified
  `FieldSet`, `FieldLegend`, `FieldDescription`, `Field`, `FieldLabel`,
  `Input`, `Textarea`, `FieldError`, and `Button` primitives. Uncontrolled native
  inputs, client-only synchronous submission, linked error summary with focus
  recovery, field-level `aria-invalid` and `aria-describedby`, honest
  non-transactional status announcement (`Message checked. It was not sent and
  no email was delivered.`), and stale-error/stale-success clearing on input.
- `lib/contact.ts`: Pure immutable validation module with `CONTACT_FIELD_NAMES`,
  `CONTACT_MAX_LENGTHS`, `reviewContactDetails`, and email format validation.
- `app/globals.css`: Scoped contact styling (`contact-page`, `contact-layout`,
  `contact-info`, `contact-form`, `contact-error-summary`, `contact-submit`)
  using established design system tokens.
- `test/contact.test.tsx`: 5 Vitest/RTL/axe tests covering pure validation,
  maximum field lengths, email pattern validation, presentation, review flow,
  retained inputs, stale-success clearing, and accessibility assertions.
- `docs/pages.md`: Contact build record, native reference measurements,
  responsive decisions, reference deltas, and self-verification results.

## Exact scope and permitted files

Mandatory required updates:

- `docs/pages.md` — replace the pending-review statement with exact review
  results, Standards and Spec counts, worst issue on each axis, finding
  dispositions, fix commit SHAs, and review closure confirmation.

Inspect and modify only when a verified defect or accepted review finding
requires it:

- `app/contact/page.tsx`
- `components/contact/contact-content.tsx`
- `components/contact/contact-form.tsx`
- `lib/contact.ts`
- the narrow contact rules in `app/globals.css`
- `test/contact.test.tsx`
- `docs/components.md` (only if a reusable component contract changes)
- `docs/design-system.md` (only if a design token changes)
- this prompt file, as the approval and closure record

Do not modify pre-existing checkout, cart, comparison, product-detail, shop, or
home code unless a shared primitive bug is proven. Do not start `/blog`. Do not
add backend persistence, email delivery, server actions, or external providers.
Do not push.

## Mandatory two-axis review and fix handling

1. Run the mandatory `code-review` against
   `CONTACT_BASE_SHA=08a9af51581a6397812867314c5e9fdea2baf5ca` through `HEAD`.
   Use `prompts/17-build-contact-page.md` as the Spec and the named Standards
   sources plus the skill's complete Fowler smell baseline. Spawn isolated
   Standards and Spec reviewers in parallel and preserve separate `## Standards`
   and `## Spec` reports.
2. Verify every finding against the full diff, installed APIs, design evidence,
   prompt 17, and repository rules. Classify documented violations separately
   from heuristic smells. State evidence and disposition; reject scope creep.
3. Fix every accepted blocking/correctness/accessibility/spec defect, then simple
   defects, then only justified refactors. Re-run focused and full affected
   checks, repeat browser evidence if presentation or interaction changed,
   update docs, and create a separate local review-fix commit with
   `caveman-commit`.
4. Re-run the complete phase review from the same `CONTACT_BASE_SHA` if a fix
   materially affects a public API, shared component, data flow, security, or
   complex form interaction.
5. Finish with no verified blocking finding. Preserve finding counts and the
   worst issue within each axis without merging or reranking the axes. Record
   the closure in `docs/pages.md`.

## Verification and execution sequence

1. Confirm `main`, clean status, and `TASK_BASE_SHA=$(git rev-parse HEAD)`.
2. Confirm `CONTACT_BASE_SHA=08a9af51581a6397812867314c5e9fdea2baf5ca`
   resolves and `git diff $CONTACT_BASE_SHA...HEAD` is non-empty.
3. Run the existing test suite:
   - `npx vitest run test/contact.test.tsx`
   - `npm run test`
   - `npm run lint`
   - `npx tsc --noEmit`
   - `npm run build` (and `npm run build -- --webpack` if Turbopack port binding fails)
4. Invoke `code-review` with prompt 17 as Spec and repository standards.
5. Evaluate all findings independently and record dispositions.
6. If fixes are required:
   - Apply minimal necessary edits to permitted files.
   - Add/update tests covering the fix.
   - Rerun affected tests, lint, typecheck, and build.
   - If UI changes occurred, inspect in a real browser using a named
     `agent-browser` session (`compfi-contact-review-<hash>`) and run
     `web-design-guidelines` audit.
   - Update `docs/pages.md` with fix descriptions and review findings.
   - Load `caveman-commit`, stage only the fix files and updated docs, inspect
     staged diff, and create a local fix commit on `main`.
   - If changes were material, re-run `code-review` from `CONTACT_BASE_SHA`.
7. If no code fixes are needed:
   - Update `docs/pages.md` to record the completed review, axis counts, worst
     issues, finding dispositions, and review closure.
   - Load `caveman-commit`, stage only documentation, and commit the closure
     locally on `main`.
8. Never push.

## Acceptance criteria

- Mandatory two-axis review of the Contact implementation is executed against
  its pre-implementation base `08a9af51581a6397812867314c5e9fdea2baf5ca`.
- All Standards and Spec findings are rigorously evaluated with clear evidence
  and dispositions; zero verified blocking findings remain.
- Any accepted defects are corrected, covered by tests, and verified across all
  standard checks (`npm run test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`).
- `docs/pages.md` is updated to replace the pending review statement with full
  review counts, worst findings, dispositions, and closure status.
- All commits are made locally on `main` via `caveman-commit`; no unapproved
  files are staged or committed; nothing is pushed.

## Documentation update

Update `docs/pages.md` under `## Contact (/contact)`:
- Replace "Independent two-axis review is pending" with the completed review
  record: review date, base SHA, commit SHAs, Standards count and worst issue,
  Spec count and worst issue, detailed dispositions for each finding, fix
  commits (if any), and closure confirmation.
- Update the page-level status line to reflect that the Contact page is
  implemented, verified, and review-closed, with Blog remaining the sole pending
  unit of Phase 6.

## SKILLS USED

- `code-review`: execute the mandatory two-stage review spawning parallel
  Standards and Spec subagents against `08a9af5...HEAD`.
- `caveman-commit`: produce Conventional Commit messages for review fixes and
  documentation closure without AI attribution.
- `react-testing`: run and update behavior-first Vitest/RTL/axe tests for any
  accepted review fixes.
- `shadcn`: verify Base UI and shadcn component contracts if UI fixes touch
  primitives.
- `building-components`: component composition, states, and accessibility.
- `vercel-composition-patterns`: ensure clean component boundaries and prevent
  boolean-prop proliferation.
- `vercel-react-best-practices`: verify React 19 / Next.js patterns and bundle
  discipline.
- `agent-browser`: verify browser behavior using a named session if UI changes
  are made during review fixes.
- `web-design-guidelines`: review UI compliance if interface changes are made.
