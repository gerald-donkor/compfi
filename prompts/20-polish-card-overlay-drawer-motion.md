# Polish product-card overlay, cart-drawer modal, and motion consistency (Phase 7 unit 1)

## Status and authorization boundary

Prepared by the single-letter `i` workflow on 2026-09-10. This is a planning
artifact only. It authorizes no implementation until the user explicitly
approves it through the single-letter `y` workflow.

Planning-time repository state is `main` at `620a96b`, with a clean worktree
(`git status --short` empty at prompt-preparation time). Reconfirm
`git status --short`, `git branch --show-current`, recent history, and `HEAD`
before execution. Stop if the branch is not `main`. Preserve every unrelated
path that appears after this prompt is prepared.

## Goal and why this is the next dependency-safe unit

Deliver the first dependency-safe unit of Phase 7 (Interaction and motion
polish) by closing two explicit AGENTS.md §7 gaps plus the cross-cutting
motion/focus consistency they depend on:

1. The product-card overlay in the references cannot remain hover-only
   functionality. Hover content must also be available to keyboard and touch
   users.
2. The cart drawer is a modal dialog/sheet: label it, trap focus, make the
   background inert, close on Escape, prevent background scroll, and restore
   focus to the trigger.
3. Motion, hover, focus-visible, active, and disabled states must use the
   certified token system and respect `prefers-reduced-motion`; content must
   remain visible and usable with motion removed.

Phases 1–6 are implemented, verified, and review-closed (design system,
primitives/components, shared chrome, home/shop/detail/comparison browsing,
cart/checkout presentation, contact/blog content). This unit depends only on
phases 2–3 (certified `ProductCard`, `CartDrawer`/`Sheet`, `IconButton`,
`Link`, `Money`, `Empty`, motion tokens in `app/globals.css`) and changes no
catalog pricing, cart-model, checkout, contact, or blog logic. Completing it
unblocks later Phase 7 units (gallery, filters/sorting/variants, pagination,
responsive refinement) which will reuse the same interaction contract.

The required lightweight architecture-signal check found no
threshold-crossing candidate. This unit touches two small client/server leaves
and CSS token usage only; it introduces no module seam, adapter, provider, or
shared commerce rule. Do not run an architecture audit during this
single-letter workflow.

## Evidence to re-read before implementation

- `AGENTS.md`, especially sections 6 (tokens, 44px targets, component
  taxonomy), 7 (WCAG 2.2 AA, focus-visible, hover-only ban, drawer modal
  contract, live regions, reduced motion), 9 (server/client leaves), and 12–13.
- `CONTEXT.md`; `docs/design-system.md` (motion roles, focus roles);
  `docs/components.md` (`ProductCard`, `CartDrawer`, `Sheet`, `IconButton`);
  `docs/pages.md` (Phase 6 closure); `docs/automation.md`;
  `docs/agent-browser.md`.
- Installed Next.js guide relevant to the task from
  `node_modules/next/dist/docs/` (App Router rendering, `next/image`,
  accessibility routing behavior). Heed deprecation notices.
- Existing implementation (read fully before changing):
  - `components/commerce/product-card.tsx` (server-safe article, media link,
    overlay link, title link, badge, prices).
  - `components/chrome/cart-drawer.tsx` (client leaf, `Sheet` usage, trigger
    naming, line list, removal, subtotal, View cart/Checkout links, empty
    state).
  - `components/ui/sheet.tsx` (verify focus trap, portal, Escape, scroll-lock,
    inert background handling from the established primitive; do not hand-roll
    a second dialog implementation).
  - `components/ui/icon-button.tsx`, `components/ui/link.tsx`,
    `components/ui/empty.tsx`, `components/commerce/money.tsx`.
  - `app/globals.css` motion/focus section: `--duration-fast` (140ms),
    `--duration-standard` (220ms), `--ease-standard`,
    `prefers-reduced-motion` reset, focus-visible treatment, `.product-card__*`
    rules (overlay opacity/transform behavior).
  - `components/cart/cart-provider.tsx` (transient line identity only; do not
    change the model in this unit).
- Design references (open at native 2880px raster before changing visuals):
  - `design/2-Shop.png` (card grid, overlay affordance, badge placement).
  - `design/3-Single Product.png` (not directly changed; confirms card link
    destination contract `/shop/[slug]`).
  - `design/4-Cart Sidebar.png` (drawer width, line rows, subtotal, cart /
    checkout / comparison actions).
- Relevant skills (load fully before execution; see `## SKILLS USED`).

Planning-time native observations to reproduce and verify during execution:

| evidence | observation | decision |
| --- | --- | --- |
| card overlay | reference shows a dark overlay with a centered action on hover | keep visual design; make the action reachable by keyboard focus (visible on `:focus-within`), touch (no hover required), and screen reader with one stable accessible name; no hover-only functionality ships |
| drawer geometry | reference 4 shows a right-anchored sheet with line rows and a totals footer | retain certified `Sheet` geometry; on small screens use full-width or nearly full-width dialog while retaining close, focus, and escape behavior |
| motion | `app/globals.css` already defines duration/ease tokens and a reduced-motion reset | reuse tokens; add no raw `ms`, `cubic-bezier`, or ad-hoc `transition` in components; a missing value means a missing token, not an inline style |
| focus | global `:focus-visible` treatment exists | reuse it; never remove outlines without the certified replacement |

## Exact scope, expected files, and route impact

In scope (only these behaviors):

- `ProductCard` overlay access:
  - One primary navigation path per card (image link / title link / overlay
    action must not create three conflicting tab stops to the same
    destination without a documented naming/Grouping decision).
  - Overlay action visible on hover **and** on `:focus-within`, and operable
    on touch (no hover gate on the action itself).
  - Visible `:focus-visible` treatment on every card link.
  - Badge (discount/new) remains non-color-only communication (text label
    preserved).
  - Touch targets for overlay and title actions meet 44×44 CSS px.
- `CartDrawer` modal correctness (via the certified `Sheet` primitive):
  - Accessible dialog label (`Your cart`) and description preserved.
  - Focus trap while open, background inert, Escape closes, background scroll
    prevented, focus restored to the trigger on close.
  - Close affordance retains an accessible name at all widths.
  - Line-item removal announces via an appropriate polite live region; cart
    count and subtotal updates are perceivable without relying on color.
  - Drawer becomes full-width or nearly full-width on small screens and
    retains close/focus/escape behavior.
- Motion/focus consistency for the two touched surfaces only:
  - All hover/focus-visible/active transitions on card overlay, card links,
    drawer open/close, drawer links/buttons use
    `--duration-fast`/`--duration-standard` + `--ease-standard`.
  - `prefers-reduced-motion: reduce` collapses overlay/drawer motion to the
    global reset (content remains visible and usable; no information carried
    by motion alone).
  - Disabled/loading states (drawer buttons, removal action while pending if
    applicable) keep an accessible label, announce busy state, and prevent
    duplicate submission without hiding the reason.

Expected files (do not expand without a verified bug):

- `components/commerce/product-card.tsx` (overlay access, focus treatment,
  target sizing; stays server-safe).
- `components/chrome/cart-drawer.tsx` (modal wiring, live regions, responsive
  sheet usage; stays a small client leaf).
- `app/globals.css` (only if a touched state lacks a token: add one semantic
  or component token with a reference comment; no raw values in components).
- `components/ui/sheet.tsx` (read-only unless a verified primitive defect
  blocks the drawer contract; any change there must be the narrowest fix with
  a regression test).
- `test/product-card-interaction.test.tsx` and/or
  `test/cart-drawer-interaction.test.tsx` (or colocated equivalents following
  the existing `test/` convention): overlay keyboard/touch access, drawer
  focus/escape/announcement behavior, reduced-motion CSS contract, axe
  coverage.
- Owning docs (see Documentation section).

Route impact: none added or removed. `/`, `/shop`, `/shop/[slug]` (card
consumers) and every route rendering `CartDrawer` (global header) inherit the
polish with no URL, metadata, or data-contract change.

## Component boundaries and server/client ownership

- `ProductCard` remains a server-safe component. No `"use client"`, no state,
  no effects. Interaction is CSS (`:hover`, `:focus-within`,
  `:focus-visible`) plus native link semantics.
- `CartDrawer` remains the single small client leaf around the interactive
  drawer. It owns only open state and event wiring; fixture reads stay
  server-owned and passed through composition where already so.
- Do not export shared constants or types from a client module. Keep
  serialized props across the server/client boundary minimal.
- Do not define components inside components. Keep variant definitions outside
  render functions. Reuse `Sheet`, `IconButton`, `Link`, `Empty`, `Money`;
  do not create a second card, drawer, or button version for this polish.

## Responsive behavior

- 1440px desktop: card overlay matches the reference hover/focus design;
  drawer anchors right at the certified width.
- 1024px / 768px tablet: card grid follows the certified 3/2-column rhythm;
  overlay remains keyboard/touch operable; drawer remains a right sheet with
  no page overflow.
- 390px / 320px mobile: cards stack per the certified 1-column rhythm;
  overlay action is a full 44px target with no hover dependency; drawer is
  full-width or nearly full-width with close, focus, and escape intact.
- Zero horizontal overflow (`scrollWidth === clientWidth`) at all five widths
  on `/` and `/shop` with drawer both closed and open (open-state overflow
  assertion must account for the intentional modal scroll-lock, not page
  overflow).

## States

- Card: default, hover, focus-visible (overlay revealed on both hover and
  focus-within), active, disabled/N-A (cards have no disabled state; do not
  invent one).
- Drawer: closed, open (default), focus-trapped, Escape-closing, empty (no
  lines), populated (lines + subtotal), removal feedback (polite
  announcement), loading/busy (if removal is async; keep label + `aria-busy`,
  prevent double-activation).
- Form/validation states are out of scope (no form in this unit).
- Error state: drawer must not expose exception details; card images retain
  meaningful `alt`.
- Success state: no transient success claim is added (no `Added to cart`
  toast in this unit).

## Accessibility and security requirements

- WCAG 2.2 AA floor. Semantic landmarks unchanged; heading hierarchy
  unchanged.
- Every icon-only control (drawer trigger, drawer close, line removal) has a
  visible accessible name; decorative icons are `aria-hidden`.
- Focus-visible is always visible; outlines are never removed without the
  certified replacement.
- Drawer meets the AGENTS.md modal contract (label, trap, inert background,
  Escape, scroll lock, focus return).
- Dynamic cart count, removals, and subtotal use polite live regions; no
  `assertive` unless a verified error requires it.
- Color is never the sole means for discount, selection, or removal feedback.
- Text zoom / 200% root text and 320px reflow produce no clipped controls.
- Reduced motion honored; content visible and usable with motion removed.
- Security: no form input, no server mutation, no secrets, no external URLs,
  no analytics in this unit. Treat prices as display state; change no pricing
  logic.

## Data shapes and edge cases

- No data-shape change. Line identity (`slug` + `size` + `finish`, quantity
  1–10) and `CatalogProduct` fixture contract are untouched.
- Edge cases to cover:
  - Card without badge (no badge node, no layout shift).
  - Card with `sale` but missing `compareAtPriceCents` (no discount node;
    existing `getDiscountPercent` contract preserved).
  - Keyboard-only traversal of a card grid (overlay reachable, single
    predictable tab path per card, focus never lost under the overlay).
  - Touch/no-hover environment (overlay action operable without hover).
  - Drawer with zero lines (empty state + recovery link, focus trap still
    correct).
  - Drawer removal of the last line (list → empty transition announced,
    focus moved to a sensible stable target, never to `body`).
  - Rapid open/close and rapid double removal (no duplicate announcements,
    no stuck trap, no double submission).
  - Reduced-motion enabled (drawer opens/closes instantly and usably;
    overlay appears without animation).

## Reference deltas and why each is necessary

1. **Brand**: legacy brand in PNGs is reference content; shipped UI stays
   Compfi.
2. **Overlay reveal on focus**: the static PNG proves only hover appearance.
   Revealing on `:focus-within` with identical styling is the documented
   accessibility delta required by AGENTS.md §7.
3. **Single predictable card tab path**: the PNG cannot show tab order.
   Grouping or naming the overlay/title/image links so keyboard users get one
   clear destination per card is an implementation decision, recorded here.
4. **Drawer responsive width**: no mobile comp is supplied; full/near-full
   width on small screens is derived from AGENTS.md §6.2.
5. **Motion timing**: screenshots prove no timing; 140/220ms + standard ease
   are the certified system values, collapsed under reduced motion.
6. **No new imagery**: reuse certified local media only; no hotlinked or
   generated assets in this unit.

## Non-goals

- Do not change the cart state model, pricing math, quantities, checkout,
  comparison, filters, sorting, tabs, galleries, carousels, pagination, blog,
  or contact logic.
- Do not add toasts, wishlists, ratings, reviews, inventory, CMS, analytics,
  or payment behavior.
- Do not introduce GSAP, Embla APIs, or any new dependency for this unit
  (both are installed but unnecessary for overlay + sheet polish).
- Do not create dark mode, new palette, new typefaces, or new shadows.
- Do not rework `Sheet` beyond the narrowest verified defect fix, if any.
- Do not touch `docs/auth.md`, ADRs, or provider selection (no `docs/adr/`
  in this unit).

## Acceptance criteria

1. Keyboard-only users can reach and activate every card destination without
   hover; overlay is visible on focus-within and touch with a 44px target.
2. Drawer traps focus while open, closes on Escape, prevents background
   scroll, makes the background inert, restores focus to the trigger, and
   announces removals/count/subtotal politely.
3. All touched transitions use motion tokens and collapse under
   `prefers-reduced-motion` with content still visible and usable.
4. Axe reports 0 violations on `/`, `/shop`, and the open-drawer state.
5. Zero horizontal page overflow at 1440, 1024, 768, 390, and 320px with the
   drawer closed; no page overflow attributable to the drawer when open.
6. Focus-visible is present on every touched control; no outline removal
   without replacement.
7. Full checks pass: `npm run test`, `npm run lint`, `npx tsc --noEmit`,
   `npm run build`.

## Commands, automated checks, browser flows, and screenshot comparisons

Run from the repository root and report actual results:

```bash
npm run test
npm run lint
npx tsc --noEmit
npm run build
```

Focused tests (follow existing `test/` naming; do not invent script names):

```bash
npm run test -- test/product-card-interaction.test.tsx test/cart-drawer-interaction.test.tsx
```

Browser automation with `agent-browser` in your own named session
`compfi-interaction-<uuid>` (per the ALWAYS ledger; never use the shared
default session; consult the usage docs when needed):

- Start dev server; direct-load `/shop`.
- Keyboard flow: Tab through the first card; assert overlay becomes visible
  on focus-within; activate via Enter; assert navigation to `/shop/[slug]`.
- Touch flow (no-hover emulation or real tap): assert overlay action is
  operable without hover.
- Drawer flow: activate header cart trigger; assert dialog role/label, focus
  moves inside, Tab cycles (trap), Escape closes, focus returns to trigger.
- Removal flow: with a seeded line (via certified cart actions only), remove
  the line; assert polite announcement and empty-state recovery link.
- Viewports: capture `/tmp/compfi-interaction-{1440,1024,768,390,320}.png`
  plus drawer-open captures; compare card overlay, drawer width, type, color,
  and spacing against `design/2-Shop.png` and `design/4-Cart Sidebar.png`;
  assert `scrollWidth === clientWidth` for the page at each width.
- Reduced motion: emulate `prefers-reduced-motion: reduce`; assert instant
  usable overlay/drawer with no stranded hidden content.
- Axe audit on `/`, `/shop`, and open drawer: 0 violations expected.
- Console: no page errors (dev HMR/React-DevTools noise only).

## Documentation to create or update

- `docs/components.md`: record the certified `ProductCard` overlay contract
  (hover + focus-within + touch, tab path, 44px targets) and the `CartDrawer`
  modal contract (trap, inert, Escape, scroll lock, focus return, live
  regions); note `Sheet` reuse and any narrow fix.
- `docs/design-system.md`: record any added motion/focus token (or confirm
  existing tokens sufficed) and the reduced-motion rule for overlay/drawer.
- `docs/pages.md`: open the Phase 7 record (or the owning interaction
  section) with scope, decisions, deltas, and real verification results for
  this unit; do not mark Phase 7 complete.
- `CONTEXT.md`: no new domain term expected; update only if a genuinely new
  term crystallizes.
- `AGENTS.md` index: update only if a docs row truthfully changes status in
  the same commit.

## SKILLS USED

- `building-components`: token architecture, card/drawer APIs, states, slots,
  data attributes, docs.
- `frontend-design`: overlay/drawer fidelity, focus/motion restraint, no
  generic restyling.
- `vercel-composition-patterns`: composition over boolean proliferation for
  any overlay/drawer variant.
- `vercel-react-best-practices`: server-safe card, small client drawer leaf,
  no waterfalls, minimal client boundary.
- `react-testing`: behavior-focused interaction tests, accessible queries,
  user-event, axe assertions.
- `shadcn`: established `Sheet`/button baseline; inspect `components.json`
  and current source before any primitive change; official docs for guidance.
- `web-design-guidelines`: final UI/UX and accessibility review before the
  unit is called complete.
- `agent-browser`: named-session verification, viewports, keyboard, drawer,
  reduced-motion, screenshots.
- `code-review`: mandatory dual-axis Standards + Spec review after the
  self-verified local commit.
- `caveman-commit`: implementation and review-fix commits.
