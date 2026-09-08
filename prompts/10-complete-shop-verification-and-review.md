# Complete Shop verification and mandatory review

## Status and authorization boundary

Prepared for approval. Do not modify implementation files, install packages or
skills, stage, commit, or push until this prompt is explicitly approved with
`y` or `Y`.

Planning-time repository evidence on 2026-09-08 shows a clean worktree on
`main` at `45b019a`. Reconfirm the branch, status, and `HEAD` before execution.
If another branch is active, stop and ask for direction. Preserve any newly
appearing unrelated or user-authored changes without staging or editing them.

## Goal and why this is next

Finish the already implemented `/shop` commerce-browsing unit by supplying the
missing real-browser, responsive, visual, Web Interface Guidelines, and
mandatory two-axis review evidence; fix only defects verified during that work;
update the owning documentation truthfully; and commit the completion locally.

This is the earliest dependency-safe unfinished unit. Commit `696c8e1
feat(shop): add commerce browsing` added the route, URL-state model, controls,
results, loading/error states, tests, CSS, and page record. Its parent is
`5625e3ccc8ece05c9fe64714dc3c7be7dadbc4ca`. The later commit `45b019a` added
the originating Home and Shop prompt files but did not add Shop review evidence
or fixes. `docs/pages.md` explicitly says browser and Web Interface Guidelines
verification remain unrecorded, and Git history contains no Shop review/fix
commit. Under `AGENTS.md`, an implementation commit or prompt alone does not
complete a phase. Product detail is therefore deferred until this Shop unit is
verified and reviewed.

This task is verification and defect correction, not a redesign or a new Shop
feature. Preserve the approved behavior in
`prompts/09-build-shop-commerce-browsing.md` unless evidence proves it violates
that spec, repository standards, installed APIs, accessibility requirements, or
the supplied Shop reference.

## Starting evidence and immutable comparison points

- Current planning branch and `HEAD`: `main` at `45b019a` with a clean status.
- Original Shop implementation commit: `696c8e1`.
- Original pre-Shop review base: `SHOP_BASE_SHA=5625e3ccc8ece05c9fe64714dc3c7be7dadbc4ca`.
- At execution start, capture `TASK_BASE_SHA=$(git rev-parse HEAD)` before any
  file change, as required by the normal workflow. Never move either base.
- Record `git log $SHOP_BASE_SHA..HEAD --oneline` before phase review. Confirm
  `git diff $SHOP_BASE_SHA...HEAD` is non-empty.
- `prompts/09-build-shop-commerce-browsing.md` is the originating Shop spec.
  This prompt is the completion/fix spec. `AGENTS.md`, `CONTEXT.md`,
  `docs/design-system.md`, `docs/components.md`, `docs/catalog.md`,
  `docs/pages.md`, and `docs/automation.md` are Standards sources where their
  domains apply.
- The lightweight architecture-signal check found recent presentation-review
  churn in shared chrome and Home CSS, but no repeated Shop business workflow,
  caller-visible sequencing, repeated adapter, or genuine provider seam. It
  does not cross the Section 3.5 threshold. The single-letter workflow forbids
  an audit for this unit.

Before executing, re-read `AGENTS.md`, this prompt, prompt 09, all owning docs,
the relevant installed Next.js 16.3.4 guidance, every skill in `## SKILLS
USED`, and every implementation/test file in scope. Installed Next.js docs—not
memory—govern promised `searchParams`, route rendering, loading/error files,
and image behavior.

## Existing behavior to verify

- `app/shop/page.tsx` is an async Server Component that awaits promised
  `searchParams`, resolves immutable fixture data, exports Shop metadata, and
  composes one `main#main-content` with `PageHero`, controls, results, and
  `BenefitsStrip`.
- `lib/catalog-view.ts` allowlists category, sort, view, page size, and page;
  preserves immutable fixture order; sorts stably; clamps pages; reports
  truthful ranges; and builds canonical local Shop URLs.
- `components/shop/shop-controls.tsx` is the small client leaf for navigation
  transitions, sort/page-size selects, and mutually exclusive grid/list view.
  Category filtering uses native disclosure and real links.
- `components/shop/shop-results.tsx` remains server-rendered, delegates cards
  to `ProductGrid`, owns empty and pagination states, and applies an explicit
  `data-view` presentation boundary.
- Default Shop output is eight unique fixtures once, page size 8, no false
  pagination. Page size 4 creates exactly two real pages. Filtering, sorting,
  and pagination persist only supported canonical query state.
- Loading reserves the shared hero/control/result hierarchy with `Skeleton`.
  Error recovery is the narrow required Client Component and must follow the
  installed Next.js 16.3.4 `error.tsx` API; never expose exception details.
- Product cards retain local WebP media, useful alternatives, intrinsic
  dimensions, coherent USD-cent display, truthful badges, and navigation only.
  No cart, comparison, favorite, stock, rating, review, delivery, warranty, or
  other unsupported behavior or claim may appear.

## Reference evidence and visual target

Open `design/2-Shop.png` at its native `2880 × 6948` resolution before making
any visual judgment. Use the reproducible crop/histogram/scanline process in
`docs/automation.md`, keeping raster evidence separate from the established 2×
CSS interpretation.

| surface | native reference evidence | expected Compfi interpretation |
| --- | --- | --- |
| shared header | approximately 200 raster px | existing 100 CSS px header |
| Shop hero | approximately y=200–830, 630 raster px | existing 315 CSS px hero; approved wash replaces the unlicensed photo |
| controls | begins near y=830; broad `#F9F1E7` band about 200 raster px tall | approximately 100 CSS px desktop band in the 1240 CSS px container |
| results | four 570-raster-pixel cards with 64-raster-pixel gaps | four 285 CSS px cards with 32 CSS px gaps at 1440 |
| pagination | centered after the results | only when page size 4 creates two real pages; 44 px targets |
| benefits/footer | `#FAF3EA` band then white footer | existing reviewed shared components and non-claiming Compfi copy |

Create fresh temporary crops for the hero/control transition, the entire
control band, first product row, pagination position, benefits boundary, and
footer transition. Store crops and screenshots in a fresh `/tmp` directory,
never in the repository. Re-measure any geometry that appears inconsistent
with the current record and document the native value and CSS interpretation;
do not silently preserve an approximation or infer the source typeface.

The visual direction remains the established quiet, image-led Compfi catalog:
Poppins, white canvas, flat product surfaces, restrained cream control band,
gold selected state, and spacious rhythm. Do not introduce gradients, generic
shadow cards, decorative labels, pill styling, or unsolicited animation.
Accessibility and truthful fixture counts override copied template details.

## Exact scope and permitted files

Primary required update:

- `docs/pages.md` — replace the outstanding Shop-verification statement with
  exact evidence, results, screenshot paths, finding dispositions, and commits.

Inspect and modify only when a verified defect requires it:

- `app/shop/page.tsx`
- `app/shop/loading.tsx`
- `app/shop/error.tsx`
- `components/shop/shop-controls.tsx`
- `components/shop/shop-results.tsx`
- `lib/catalog-view.ts`
- the narrow Shop rules in `app/globals.css`
- `test/shop.test.tsx`
- `test/catalog-view.test.ts`
- an existing shared primitive/component and its focused test only when the
  Shop verification proves a reusable contract defect rather than a one-page
  override
- `docs/components.md` only if a reusable component contract changes
- this prompt file, as the approval and completion record

Do not rewrite fixture content or media, add dependencies, add routes, create
new product behavior, change Home, begin product detail/comparison/cart, create
an ADR, or perform unrelated cleanup. Do not modify `AGENTS.md` unless a newly
received durable rule requires it. Do not push.

## Component, server/client, data, and security constraints

- Keep Server Components as the default. Do not move catalog records, result
  filtering, sorting, pagination, or card rendering into the client.
- Keep the client boundary limited to interactions requiring router state or
  transition feedback. Pass only normalized serializable options and counts,
  never the full catalog.
- Keep a single canonical query parser and URL builder. Accept only the closed
  query unions from prompt 09; arrays, empty strings, unsafe integers, unknown
  values, and out-of-range pages must normalize deterministically.
- Preserve integer-cent money and immutable product records. No browser value
  becomes price authority, HTML, CSS, a path, or an external URL.
- Use real links for navigation and buttons for actions. Selected filter/view/
  page states must be perceivable without color. Maintain one visible Shop
  `h1`, one main landmark, semantic result lists, labeled controls, and
  `aria-current="page"` on real current-page navigation.
- Preserve 44 × 44 px targets, visible unclipped focus, useful alt text,
  intrinsic image dimensions, accurate responsive `sizes`, and lazy product
  images. Do not preload the Shop product grid beneath hero/control chrome.
- If a shadcn component is touched, inspect `components.json`, its local source,
  run current shadcn info/docs commands when available, and verify Base UI—not
  Radix—behavior. Preview upstream differences before any update and never
  overwrite local changes without explicit approval.
- Extend native props and stable kebab-case `data-slot`/state attributes for
  reusable components. Keep variants outside render functions; do not add
  boolean-prop modes, context, providers, request-time module state, or effects
  that mirror derived URL state.

## Responsive states and browser flows

Verify all of the following in a real Chromium rendering engine:

- **1440 × 1000:** 100 px header, 315 px hero, approximately 100 px controls,
  centered 1240 px content, four-column 285 px cards with 32 px gaps, list view,
  real two-page pagination at page size 4, benefits strip, and footer.
- **1024 × 900:** controls wrap without overlap, three-column grid, labels stay
  attached to their controls, and all targets remain at least 44 px.
- **768 × 1024:** controls form two logical rows, two-column grid, native
  disclosure remains readable, and focus is not covered or clipped.
- **390 × 844:** stacked controls, concise count, one-column results, centered
  pagination, readable USD prices, and no horizontal document overflow.
- **320 × 720:** at least the documented 16 px gutter, one-column results,
  untruncated accessible control names, full focus rings, and zero overflow.
- **400% zoom/reflow:** no two-dimensional document scrolling or lost content.
- **Reduced motion:** all controls and navigation remain usable with transitions
  collapsed and no behavior depending on animation.

Exercise default state; each category; all four sort modes; grid and list;
page size 4; pages 1 and 2; invalid, array-valued, zero, unsafe, and
out-of-range query values; refresh; back/forward; keyboard-only disclosure,
select, toggle, product, and pagination navigation; hover, focus-visible,
active, pending/disabled where observable; empty input at the component/pure
model lane; loading; and error recovery. Confirm canonical URLs, unique product
links, stable sort order, accurate counts/ranges, and no duplicate or omitted
fixtures. Inspect console output for runtime, hydration, image, font, and CSS
errors.

The local `agent-browser` stub is installed but its executable was unavailable
during planning (`command not found`). At execution, retry the CLI-matched core
workflow first. If still unavailable, record the exact limitation and use the
established `/usr/bin/chromium` CDP/headless fallback without adding a package.
Screenshots from a fallback remain valid only when the tested URLs, viewport,
font readiness, interactions, overflow checks, and console results are
recorded.

## Loading, empty, error, and interaction expectations

- Loading has one busy main landmark and reserves meaningful hero, controls,
  and results geometry without pretending to know product text.
- Empty results use the existing `Empty` composition and a real local “View all
  products” link; no stock or availability statement is invented.
- Error UI uses the installed Next.js error-boundary callback name and behavior,
  exposes a useful heading/message, retry action, and return link, while keeping
  technical error details out of customer UI.
- Pending controls expose their state, prevent duplicate updates, preserve their
  accessible names, and do not announce redundant noise.
- Focus, hover, active, selected, disabled, and reduced-motion behavior use
  semantic tokens and remain distinguishable without color alone.

## Tests and verification

1. Run the focused existing Shop/model tests first. Add or adjust behavior-first
   tests only for a verified coverage gap or accepted fix. Use accessible
   queries and awaited `userEvent`; avoid DOM snapshots, private-state checks,
   React/framework mocks, and layout claims in JSDOM.
2. Ensure pure model coverage includes every allowed/invalid query form,
   immutable stable sorts including equal keys, category filtering, truthful
   ranges, page-size changes, page clamping, canonical preservation/reset, and
   empty input. Ensure component/page coverage includes labels, selected states,
   USD content, eight unique links, pagination semantics, loading, empty,
   error retry/return, and axe checks for representable interactive states.
3. Run and report exact results for:
   - `npm run test`
   - `npm run lint`
   - `npx tsc --noEmit`
   - `npm run build`
   If the known restricted-sandbox Turbopack PostCSS worker port failure recurs,
   preserve its exact failure and also run `npm run build -- --webpack`; never
   report the first build as passing.
4. Fetch the current Web Interface Guidelines from the URL required by the
   local skill during execution. Review every Shop UI file and any shared UI/CSS
   changed in this task. Verify each finding against repository standards and
   resolve valid issues before the completion commit.
5. Perform the full real-browser matrix and capture stable screenshots to a
   fresh temporary directory. Compare desktop geometry, hierarchy, type, color,
   imagery, and state against `design/2-Shop.png`; assess responsive layouts
   against the explicit production contract because no smaller references
   exist.
6. Inspect every changed file, the complete task diff, and the relevant Shop
   implementation diff. Update owning docs with only checks actually run.
7. Load `caveman-commit`, stage only this approved task’s files, inspect the
   staged diff, and create a local completion/fix commit on `main`. Do not push.

## Mandatory two-axis review and fix handling

The Shop implementation predates this completion prompt, so preserve both
comparison scopes rather than hiding the original code from review:

1. Run the mandatory `code-review` against
   `SHOP_BASE_SHA=5625e3ccc8ece05c9fe64714dc3c7be7dadbc4ca` through the new
   `HEAD`. Use prompt 09 as the Spec and the named Standards sources plus the
   skill’s complete Fowler smell baseline. Spawn isolated Standards and Spec
   reviewers in parallel and preserve separate `## Standards` and `## Spec`
   reports. The prompt is the originating spec; do not invent issue content
   merely because optional issue-tracker setup is absent.
2. Verify every finding against the full diff, installed APIs, design evidence,
   prompt 09, and repository rules. Classify documented violations separately
   from heuristic smells. State evidence and disposition; reject scope creep.
3. Fix every accepted blocking/correctness/accessibility/spec defect, then simple
   defects, then only justified refactors. Re-run focused and full affected
   checks, repeat browser evidence when presentation or interaction changed,
   update docs, and create a separate local review-fix commit with
   `caveman-commit`.
4. Re-run the complete phase review from the same `SHOP_BASE_SHA` if a fix
   materially affects a public API, shared component, data flow, security, or
   complex interaction.
5. If `git diff $TASK_BASE_SHA...HEAD` is non-empty after the completion work,
   also run the normal task-level two-axis review against `TASK_BASE_SHA...HEAD`
   with this prompt as Spec so the new verification/fix scope is independently
   checked. Apply the same evidence, fix, commit, and significant-change
   re-review rules.
6. Finish with no verified blocking finding. Preserve finding counts and the
   worst issue within each axis without merging or reranking the axes.

## Reference deltas and non-goals

- Retain Compfi, English (United States), local project-generated WebP imagery,
  and coherent USD-cent fixtures instead of the source brand, mixed-locale
  prices, repeated products, and unknown-source photography.
- Retain the documented wash hero because no approved local Shop banner exists.
- Retain truthful eight-product counts and conditional real pagination rather
  than the reference’s fictional 32 items and repeated cards.
- Retain navigation-only product cards and non-claiming benefits/footer copy.
  Do not add cart/share/compare/favorite, stock, rating, review, warranty,
  shipping, address, newsletter, or support claims.
- Tablet/mobile composition, focus behavior, loading/error handling, URL state,
  and reduced motion are production decisions because the static desktop image
  cannot establish them.
- Product detail, comparison, cart, checkout, contact, blog, Home editorial
  blocks, authentication, CMS, persistence, payment, analytics, external
  services, dependency installation, architecture audit, ADR, history rewrite,
  and push are non-goals.

## Acceptance criteria

- The Shop behavior specified in prompt 09 passes automated and real-browser
  verification across the complete state and viewport matrix, or every verified
  defect is corrected within this narrow scope.
- Desktop remains faithful to measured Shop evidence while responsive widths,
  keyboard navigation, focus, reflow, contrast, loading, empty, error, pending,
  disabled, and reduced-motion states are usable and accessible.
- Query behavior is bounded, deterministic, canonical, immutable, and truthful;
  product data stays server-rendered and money remains integer-cent USD.
- Fresh Web Interface Guidelines results and both Standards/Spec review axes are
  preserved, evaluated, and resolved with no verified blocking issue.
- `docs/pages.md` no longer claims required Shop verification is outstanding;
  it records exact commands, browser widths/flows, screenshot directory,
  guideline findings, review counts/dispositions, commits, and real environment
  limitations. `docs/components.md` changes only if a reusable contract changes.
- The approved completion and any accepted review fixes are committed locally
  on `main`; unrelated changes remain untouched; nothing is pushed.

## Documentation update

`docs/pages.md` owns the Shop completion record. Record the fresh native
measurements or confirmation of existing approximations, the tested desktop and
responsive behavior, every state exercised, screenshot paths, console and
overflow results, exact automated command outcomes, the live-guideline review,
both review scopes and axis counts, accepted/rejected finding dispositions,
commit SHAs, and tooling/environment limitations. Never convert an attempted or
fallback check into a pass.

Update `docs/components.md` only for a changed reusable public contract. No new
documentation index row, domain term, or ADR is expected.

## SKILLS USED

- `frontend-design`: judge reference fidelity, preserve Compfi’s furniture-led
  visual direction, and keep any corrective design work deliberate and quiet.
- `building-components`: verify semantic composition, native props, states,
  data attributes, accessibility, and truthful component documentation.
- `vercel-composition-patterns`: prevent boolean-prop growth and keep variant/
  state ownership at the narrow existing composition boundary.
- `vercel-react-best-practices`: verify Server Component defaults, minimal
  client serialization, URL-derived state, rendering, bundle, and image
  behavior against the installed React/Next stack.
- `react-testing`: own behavior-first Vitest/RTL coverage, accessible queries,
  awaited interactions, axe assertions, and the JSDOM/browser boundary.
- `shadcn`: verify `components.json`, local Base UI component source, current
  docs when available, semantic tokens, and composition rules for any touched
  primitive.
- `agent-browser`: retry the installed-version core workflow and own real
  navigation, keyboard checks, responsive screenshots, reflow, state, and
  console verification; use the recorded Chromium fallback if unavailable.
- `web-design-guidelines`: fetch the fresh rule set during execution and audit
  every in-scope UI file before completion.
- `code-review`: run independent parallel Standards and Spec reviews for the
  full Shop phase and the completion-task diff, preserving both axes.
- `caveman-commit`: produce the local completion and any separate review-fix
  commit messages, intent-first and without AI attribution.
