# Build Compfi shared storefront chrome

## Status and authorization boundary

Prepared for approval. This is the first dependency-safe unit of Phase 3. Do
not modify implementation files, install packages or skills, stage, commit, or
push until this prompt is explicitly approved with `y` or `Y`.

## Goal and why this is next

Phase 1's measured design system and Phase 2's certified primitives are
committed, verified, and reviewed. The next ordered deliverable is the shared
chrome that future product routes need: a responsive site header, reusable page
heading/breadcrumb band, benefits strip, footer, and a presentational cart
drawer shell. Build these as Compfi-owned blocks so Phases 4–6 can compose them
without duplicating layout, labels, focus behavior, or visual tokens.

This task intentionally does not build commerce browsing, a cart state model,
checkout, authentication, account management, search, or a newsletter service.

## Starting repository evidence

- Current branch: `main`; starting worktree is clean. Confirm both again before
  execution and capture `BASE_SHA` with `git rev-parse HEAD` before changing
  implementation files.
- Phases 1 and 2 are evidenced by commits `ba2f88b`, `d46cfba`, and
  `aa6743a`, `docs/design-system.md`, and `docs/components.md`.
- The current `/` page is the temporary foundations page. It has the only
  `main#main-content`; root `app/layout.tsx` supplies the skip link, local
  Poppins font, and global metadata. Preserve one valid main landmark per page
  and do not nest another one in the chrome.
- `components.json` establishes an RSC, Base UI, Tailwind 4, Lucide, shadcn/ui
  project. Existing candidates include `Button`, `IconButton`, `Link`,
  `Breadcrumb`, `Separator`, `Sheet`, `Drawer`, `Empty`, `Input`, `Container`,
  `Stack`, and `Cluster`. Components outside the Phase 2 certified inventory
  must be inspected and adapted before production use; do not assume their
  defaults match Compfi.
- `components/ui/sheet.tsx` presently has a 75%/24rem right sheet and a 10%
  blur scrim. It must not be silently reused as visual proof for the measured
  cart drawer: Phase 3 owns an audited Compfi composition or a minimal,
  documented adaptation that reaches the 550px/20% reference evidence.
- No approved product imagery or business contact/policy data exists in
  `public/`. Do not hotlink, fabricate an address, shipping threshold,
  warranty, return policy, payment option, account destination, or newsletter
  subscription behavior.

## Reference evidence and measurements

Open and inspect these native 2880px-wide PNGs before implementation. The
established working scale is 2 raster pixels per CSS pixel; record raster
measurements separately from CSS decisions in `docs/pages.md`.

| surface | references and evidence | implementation interpretation |
| --- | --- | --- |
| Header | `design/1-Home.png`, `2-Shop.png`, `3-Single Product.png`, and `4-Cart Sidebar.png`; repeated 200-raster-pixel header | 100px desktop white header, centered 1240px content area, brand at left, primary navigation centered, utility actions at right |
| Page heading | `design/2-Shop.png` and the breadcrumb strip in `3-Single Product.png` | Reusable title/breadcrumb block: image-backed 315px Shop banner is unavailable without a licensed local asset; use the existing wash role for the generic block and document this deliberate delta. Product breadcrumbs use the 180px wash region documented in `docs/design-system.md`. |
| Benefits | `design/8-Contact.png`, plus footer-area references | 550 raster/275 CSS px full-width benefit band using `#FAF3EA`; four desktop item groups with 24px heading and 16px supporting copy. |
| Footer | `design/1-Home.png`, `6-Cart.png`, `8-Contact.png` | quiet white footer with 1px structural separator, content inside the shared container, link groups, and a legal line; replace all legacy brand and template data with Compfi-safe copy. |
| Cart drawer | `design/4-Cart Sidebar.png`; `1100×1400+1780+0` crop; white sheet and `#CCCCCC` darkened canvas prove a 20% black scrim | right modal sheet about 550px at desktop, width constrained to available narrow viewports, white surface, close action, title, empty-cart content, and action to `/shop`. Real line items, totals, quantity, removal, comparison, and checkout belong to later phases. |

Use the semantic tokens and responsive rules already owned by
`docs/design-system.md`: 1240px max container; 32px tablet gutter; 20px at
390px; 16px at 320px; 44px action target floor; 1px structural borders; flat
elevation; 3px visible focus ring; and 140ms/220ms motion reduced under
`prefers-reduced-motion`.

## Scope and expected files

Create or modify only files required for the following production scope (exact
file names may vary if a clearer existing home is found after inspection):

- `components/chrome/site-header.tsx` and supporting local CSS/module only if
  necessary: Compfi wordmark treatment, desktop navigation, labelled utility
  controls, responsive mobile navigation trigger/panel, and cart trigger.
- `components/chrome/page-hero.tsx`: reusable semantic title and breadcrumb
  block. Use the established Breadcrumb primitives and provide a small,
  explicit data shape rather than individual boolean display props.
- `components/chrome/benefits-strip.tsx`: data-driven four-item layout with
  decorative Lucide icons and content supplied by a typed local record.
- `components/chrome/site-footer.tsx`: safe Compfi footer navigation and
  legal/copyright line; reserve no inactive form control that appears to submit
  a newsletter until such a service is approved.
- `components/chrome/cart-drawer.tsx`: client leaf that owns open/close state
  only and composes the audited sheet/drawer primitive. Its empty state is
  presentational and supplies a labelled navigation action to `/shop`.
- `components/chrome/index.ts` only if a direct import audit proves a small
  barrel will not pull client code into server consumers. Prefer direct imports
  otherwise.
- `app/layout.tsx` and `app/page.tsx`: apply the common header/footer while
  retaining a single `main#main-content`. Do not turn the root layout into a
  client component; contain client behavior in header/drawer leaves.
- `app/globals.css` and existing audited primitive files only for documented
  semantic chrome tokens or necessary, scoped adaptations. Do not scatter raw
  reference hex values or use a competing generic UI style.
- Focused tests under `test/` for chrome semantics and drawer behavior.
- `docs/components.md`, new `docs/pages.md`, and the documentation index row
  in `AGENTS.md`. Mark the pages record truthfully as current only when this
  implementation is committed and verified; retain the existing design-system
  and component documentation as their owning sources.

Do not add packages, remote sources, a provider, persistent state, routes that
pretend a service exists, external imagery, or a new font. Do not alter
unrelated generated shadcn components merely because they are present.

## Component boundaries and data

- Keep `SiteHeader`, `PageHero`, `BenefitsStrip`, and `SiteFooter` server-safe
  by default. Use a focused client leaf for the mobile-menu disclosure and cart
  drawer only; do not serialize large navigation/data structures needlessly.
- Define small explicit records for navigation, breadcrumbs, and benefit items
  in a server-safe module or colocated server component. A breadcrumb item has
  visible `label` and optional internal `href`; the final item is current page.
  A benefit item has an icon component, title, and supporting text. Do not
  encode variant behavior as proliferating booleans.
- Use `next/link`/the certified `Link` for all internal navigation. The
  navigation list may target planned routes (`/shop`, `/contact`, `/blog`) but
  does not create their pages; no user account or favorites link is enabled
  until its product requirement exists.
- Use icon-only controls through `IconButton` with clear accessible labels. The
  cart control must say `Open cart`; the mobile menu must expose its expanded
  state and controls relationship. Decorative logo/benefit icons are hidden
  from assistive technology. Use a text alternative for the Compfi wordmark.
- The cart shell must use a modal primitive with title, Escape dismissal,
  focus containment, inert background, scroll prevention, and focus return.
  It must expose a non-empty accessible description for the empty state; its
  close button must retain a visible or programmatic name. Audit and document
  the selected Base UI API against installed source/docs rather than guessing.

## Responsive and interaction requirements

At 1440px, preserve the reference hierarchy: 100px header, desktop nav and
utilities in one row, four horizontal benefit groups, and footer columns. At
1024px, retain the header row while allowing link and utility spacing to
contract. At 768px and below, replace the desktop nav with a 44px labelled menu
control; its panel must keep all primary destinations keyboard reachable and
must not create duplicate tab stops while closed. At 390px and 320px, use the
documented gutters, stack benefit/footer content at readable measures, and make
the drawer full available width minus safe insets rather than overflowing.

Required states:

- Header links: default, hover, `aria-current` active route, focus-visible,
  and touch targets at least 44px high.
- Mobile menu: closed/open, Escape close, outside/modal behavior based on the
  audited primitive, focus return, and reduced-motion transition.
- Cart trigger and drawer: closed/open, keyboard activation, focus-visible,
  Escape close, backdrop close only when the primitive supports it safely,
  empty-cart default, and an accessible empty-state navigation action.
- Page hero/breadcrumb: valid one-item and multi-item trails; long labels wrap
  rather than horizontally overflow. Never render a fake disabled link.
- Footer: keyboard focus and hover links, normal wrapping, and no fake
  newsletter success/error state because no subscription endpoint exists.

## Compfi copy and reference deltas

Use `Compfi` in every shipped brand/accessibility label. Translate legacy
reference brand and any locale-specific currency/template copy; do not repeat
it. Favor factual, non-promissory utility copy such as `Shop`, `Contact`,
`Blog`, `Cart`, `Your cart is empty`, and `Browse furniture`.

The Shop heading reference includes a photographic background with no approved
local asset; use a tokenized wash background instead and document the asset
delta. The references also show detailed footer policy, address, newsletter,
and benefits claims that have not been supplied for Compfi; render only a
minimal link structure and non-claiming support labels. The cart drawer's
populated-line presentation is represented as an accessible empty state until
Phase 5 supplies an actual cart model. Focus states, mobile navigation, 44px
targets, and reduced-motion behavior are deliberate additions absent from the
desktop screenshots.

## Implementation sequence

1. Re-read `AGENTS.md`, this approved prompt, `docs/design-system.md`,
   `docs/components.md`, `docs/automation.md`, the cited references, installed
   Next.js App Router/layout/server-client/link/image/metadata docs, and every
   skill below. Confirm main/clean status and capture immutable `BASE_SHA`.
2. Inspect `components.json` plus all existing primitives selected for use. Run
   `npx shadcn@latest info --json` and `npx shadcn@latest docs breadcrumb sheet
   empty navigation-menu` before using or adapting them; retrieve the resulting
   official URLs as required by the shadcn skill. If a CLI command needs network
   access, request only the needed permission—do not substitute guessed APIs.
3. Inspect the reference crops at native resolution, then implement server-safe
   blocks and minimal client leaves in dependency order. Make the root layout
   structural, preserve the skip-link target, and keep client state below it.
4. Add behavior-focused tests using React Testing Library, user-event, and
   axe. Cover primary landmark/nav labels, active navigation semantics,
   icon-button names, menu/drawer keyboard open-close and focus return, empty
   cart messaging/action, breadcrumb semantics, and no critical axe violations.
5. Run self-verification, inspect every changed file and full diff, document
   exact measurements, decisions, reference deltas, browser results, and tests.
   Stage only this task, generate the commit message using `caveman-commit`,
   commit locally on `main`, then run `code-review` against `BASE_SHA...HEAD`.
   Evaluate its Standards and Spec reports independently, fix verified findings
   in a separate local commit, and re-review from the original base if fixes are
   material. Do not push.

## Acceptance and verification

- Shared chrome appears around the existing home/foundation content without a
  duplicate main landmark; `/design-system` remains usable with its skip link.
- At 1440px, screenshot geometry matches the repeated header/benefit/footer
  hierarchy and the cart sheet is approximately 550px wide with a 20% scrim.
- At 1024px, 768px, 390px, and 320px, no horizontal overflow, clipped labels,
  duplicate navigation, or inaccessible control occurs.
- A keyboard-only pass verifies skip link, desktop/mobile primary navigation,
  cart open/close with Escape and focus return, and footer links. Reduced-motion
  emulation removes nonessential transitions.
- Browser console has no hydration, runtime, font, or CSS errors. Capture
  stable screenshots in a fresh OS temp directory and compare them to the
  relevant reference crops, separating intentional content/asset deltas.
- Run and report actual output for:

  ```bash
  npm run test
  npm run lint
  npx tsc --noEmit
  npm run build
  ```

- Use `agent-browser` after loading its current core workflow to execute the
  browser flows and screenshots. Run `web-design-guidelines` before declaring
  Phase 3 complete. Run the mandatory two-axis `code-review` after the initial
  local implementation commit.

## SKILLS USED

- `frontend-design`: maintain visual fidelity and restrained Compfi-specific
  typography, copy, hierarchy, and motion.
- `building-components`: classify the chrome as blocks, preserve component
  boundaries, data attributes, documented APIs, and accessibility behavior.
- `vercel-composition-patterns`: prevent boolean-prop proliferation and keep
  server/client state ownership explicit.
- `vercel-react-best-practices`: preserve Server Component defaults, direct
  imports, small client leaves, and efficient rendering.
- `shadcn`: inspect this repository's Base UI shadcn configuration and current
  primitive docs before adapting production components.
- `react-testing`: write accessible behavior-focused component tests and axe
  assertions.
- `agent-browser`: run real-browser responsive, keyboard, motion, console, and
  screenshot verification.
- `web-design-guidelines`: perform the final UI/UX/accessibility review.
- `caveman-commit`: produce concise Conventional Commit messages for the
  implementation and any review fix.
- `code-review`: run the required independent Standards and Spec review after
  the self-verified local commit.
