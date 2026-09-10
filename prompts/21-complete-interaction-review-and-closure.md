# Complete Phase 7 interaction review and closure

## Status and authorization boundary

Prepared by the single-letter `i` workflow on 2026-09-10. This planning
artifact authorizes no implementation, dependency installation, staging,
commit, or push until the user explicitly approves it through the single-letter
`y` workflow.

Planning-time repository state is a clean `main` at
`2219c81c02b70229c4a49fa81d20790865d6fa88` (`git status --short` was empty).
Reconfirm status, branch, recent history, and `HEAD` before execution. Stop if
the branch is not `main`; preserve every unrelated path that appears after this
prompt is prepared.

## Goal and why this is the next dependency-safe unit

Close the mandatory independent review for Phase 7 unit 1 before beginning any
further interaction work. The unit is implemented and self-verified in:

- `f064ad4 feat(interaction): polish card overlay, cart drawer, and motion`
- `2219c81 fix(interaction): defer overlay visibility flip and cover rapid flows`

Its originating review base is
`INTERACTION_BASE_SHA=620a96b36420d539483087dddf4a4eaca195c9a6`, and its
specification is `prompts/20-polish-card-overlay-drawer-motion.md`. Both
`docs/pages.md` and `docs/components.md` truthfully say that the unit is
implemented and verified but **pending independent review**. Under `AGENTS.md`
§§2.4, 3.2, and 3.4, an implementation is not complete until its mandatory
parallel Standards/Spec review, accepted fixes, and required re-review are
recorded and committed. This closure therefore precedes Phase 7 unit 2
(gallery, Shop controls, variants, pagination, and responsive refinement).

The lightweight architecture-signal check found no threshold-crossing
candidate: this unit changes a server-safe card leaf, an existing drawer leaf,
and CSS transition mechanics without a new module interface, adapter, provider,
or scattered commerce rule. Do not run an architecture audit in this workflow.

## Evidence and comparison points to re-read before execution

- `AGENTS.md`: §§2.4, 3.2–3.4, 6–7, 9, and 12–13; in particular WCAG 2.2 AA,
  drawer modal behavior, hover/touch/keyboard parity, reduced motion, named
  sessions, local-only commits, and no push.
- `prompts/20-polish-card-overlay-drawer-motion.md` as the exact Spec.
- `CONTEXT.md`, `docs/design-system.md`, `docs/components.md`, `docs/pages.md`,
  `docs/automation.md`, and `docs/agent-browser.md` as the owning standards
  and verification records.
- Installed Next.js 16.3.4 accessibility guidance at
  `node_modules/next/dist/docs/03-architecture/accessibility.md`: maintain
  unique/descriptive route titles and do not treat lint as a complete
  accessibility audit.
- Native reference evidence at `design/2-Shop.png` and
  `design/4-Cart Sidebar.png`, opened at their 2880px native raster size if a
  visual or interaction fix becomes necessary.
- Read the complete current implementations and focused tests before changing
  them: `components/commerce/product-card.tsx`,
  `components/chrome/cart-drawer.tsx`, `components/ui/sheet.tsx`,
  `components/cart/cart-provider.tsx`, `app/globals.css`,
  `test/product-card-interaction.test.tsx`, and
  `test/cart-drawer-interaction.test.tsx`.

At execution start, capture `TASK_BASE_SHA=$(git rev-parse HEAD)` before any
edit. `TASK_BASE_SHA` is only the execution start point; never replace the
immutable `INTERACTION_BASE_SHA`. Confirm both `git rev-parse
$INTERACTION_BASE_SHA` and a non-empty `git diff
$INTERACTION_BASE_SHA...HEAD`; record `git log $INTERACTION_BASE_SHA..HEAD
--oneline` before review.

## Exact scope and permitted files

Mandatory:

- Run `code-review` against `620a96b...HEAD`, spawning independent Standards
  and Spec subagents in parallel. Give the Standards agent all named standards
  above plus the code-review skill's complete Fowler smell baseline. Give the
  Spec agent Prompt 20. Preserve separate `## Standards` and `## Spec` reports.
- Rigorously verify every finding against the complete diff, Prompt 20,
  installed APIs, design evidence, and project rules; explicitly record each
  disposition as accepted or rejected with technical evidence.
- Update `docs/pages.md` and `docs/components.md` to replace their pending
  Phase 7 review wording with the review base, reviewed commits, axis counts,
  worst finding within each axis, dispositions, any fix commits, re-review
  result, and truthful statement that unit 1 is review-closed while Phase 7 as
  a whole remains open.
- Commit the closure locally on `main` using a message obtained from
  `caveman-commit`. Never push.

Only modify the following when a verified accepted finding requires it:

- `components/commerce/product-card.tsx`
- `components/chrome/cart-drawer.tsx`
- `components/ui/sheet.tsx` (only for a proven primitive defect)
- `components/cart/cart-provider.tsx` (only for a proven drawer-announcement
  defect; do not change the cart data model)
- narrowly scoped card/drawer rules in `app/globals.css`
- `test/product-card-interaction.test.tsx` and
  `test/cart-drawer-interaction.test.tsx`
- `docs/design-system.md` if a token contract changes

Do not begin Phase 7 unit 2; change catalog data, prices, cart identity,
checkout, routes, metadata, comparison, blog, contact, providers, dependencies,
or authentication; or add GSAP, Embla, toasts, persistence, analytics, or
payment behavior. Do not alter the implementation merely to satisfy a
heuristic smell where the documented local contract is stronger.

## Review, disposition, and fix procedure

1. Run the full pre-review checks below, then the mandatory two-axis review.
   The range must include both interaction commits and no unrelated later work.
2. Keep Standards and Spec reports separate. For each finding, distinguish a
   documented-standard failure from a Fowler heuristic; identify the exact
   hunk/spec rule; verify it; and state the disposition. Reject scope creep,
   speculative generality, and false positives with evidence rather than
   mechanically changing code.
3. Prioritize verified blocking correctness, accessibility, security, data-loss,
   and spec failures; then simple defects; then justified refactors. Cover each
   accepted behavioral fix with focused tests.
4. When a UI/interaction fix is accepted, repeat the affected browser flow in a
   uniquely named `agent-browser` session of the form
   `compfi-interaction-review-<hash>` and review the touched UI with
   `web-design-guidelines`. Check `/shop` at 1440, 1024, 768, 390, and 320 CSS
   px, open/close the drawer, keyboard-reveal a product overlay, emulate reduced
   motion, and assert no horizontal overflow.
5. Rerun affected tests, full tests, lint, TypeScript, and production build.
   If an accepted fix materially affects a public API, shared primitive, data
   flow, security boundary, or complex interaction, rerun complete
   `code-review` from the original `INTERACTION_BASE_SHA` after the fix commit.
6. Make any review fix a separate local commit using `caveman-commit`. Then
   commit the truthful review closure separately if it was not included in the
   fix commit. Stage only task files after inspecting the staged diff.

## Required verification

Run from the repository root and report actual results:

```bash
npx vitest run test/product-card-interaction.test.tsx test/cart-drawer-interaction.test.tsx
npm run test
npm run lint
npx tsc --noEmit
npm run build
```

If the default build is blocked by the documented sandbox port limitation, run
`npm run build -- --webpack` and report both outcomes; do not conceal either.

For an accepted UI change, also use the named browser session to confirm:

- product card overlay appears on hover and `:focus-within`, its navigation is
  available through keyboard/touch without hover-only dependence, and touched
  targets preserve 44px geometry and visible focus;
- drawer has a name/description, focus enters and remains trapped, Escape and
  backdrop close it, body scroll is locked, focus returns to the trigger, and
  removing the final line produces one polite announcement and focuses the
  recovery link;
- reduced motion makes drawer/overlay transitions effectively immediate without
  stranding hidden content; and
- axe reports no violations for `/shop` and an open populated and empty drawer,
  while expected modal-inert incompletes are manually verified rather than
  misreported as violations.

## Acceptance criteria

1. Independent Standards and Spec reports review exactly
   `620a96b...HEAD` using Prompt 20 and named repository standards; neither
   axis is merged or reranked.
2. Every finding has a technical evidence-based disposition, and zero verified
   blocking finding remains.
3. Every accepted fix is minimal, tested, documented, locally committed, and
   receives a complete re-review from the original base when material.
4. Full checks pass (or any sandbox-specific build limitation and successful
   webpack fallback are reported accurately).
5. `docs/pages.md` and `docs/components.md` no longer claim review is pending;
   they preserve review counts, worst issues, dispositions, commits, and leave
   Phase 7 correctly open for its remaining units.
6. No unrelated paths are staged or committed, and nothing is pushed.

## SKILLS USED

- `code-review`: mandatory parallel Standards and Spec review plus separate
  aggregate reporting.
- `caveman-commit`: concise Conventional Commit messages for any review fixes
  and documentation closure.
- `react-testing`: behavior-first Vitest/RTL/axe verification for accepted
  card/drawer fixes.
- `building-components`: component state, slots, primitive reuse, and
  accessibility review if a shared component changes.
- `vercel-composition-patterns`: protect the established card/drawer component
  boundaries and avoid boolean-prop proliferation.
- `vercel-react-best-practices`: review React 19/Next.js client boundaries,
  rendering, and bundle discipline for accepted fixes.
- `shadcn`: inspect the established Sheet/component baseline before any
  primitive alteration.
- `agent-browser`: own named-session browser verification when UI behavior
  changes.
- `web-design-guidelines`: final interface/accessibility review after a UI fix.
