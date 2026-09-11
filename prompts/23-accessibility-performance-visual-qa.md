# Accessibility, performance, and visual QA (Phase 8)

## Status and authorization boundary

Prepared by the single-letter `i` workflow on 2026-09-11. This is a planning
artifact only. It authorizes no implementation, dependency installation,
staging, commit, or push until the user explicitly approves it through the
single-letter `y` workflow.

Planning-time repository state is a clean `main` at `49c5608`
(`git status --short` empty at prompt-preparation time). Reconfirm
`git status --short`, `git branch --show-current`, recent history, and `HEAD`
before execution. Stop if the branch is not `main`. Preserve every unrelated
path that appears after this prompt is prepared.

## Goal and why this is the next dependency-safe unit

Deliver Phase 8 of the build sequence (**Accessibility, performance, and visual QA**:
full browser audit, screenshot comparisons, keyboard flows, responsive checks,
build analysis, metadata; AGENTS.md §8 phase 8, depends on 1–7):

- Phases 1–7 are fully implemented, verified, and review-closed across commits
  up to `49c5608` (see `docs/pages.md` Phase 7 closure and `docs/components.md`).
- All nine storefront surfaces (`/`, `/shop`, `/shop/[slug]`, cart drawer modal,
  `/comparison`, `/cart`, `/checkout`, `/contact`, `/blog`) plus the design
  system specimen (`/design-system`) exist, render cleanly, and have certified
  interaction contracts.
- Phase 8 is the required site-wide certification gate ensuring every surface
  strictly satisfies the visual, interaction, accessibility, performance, and
  metadata contracts before considering authentication (Phase 9) or real
  backend services (Phase 10), neither of which has approved product requirements.
- Phase 8 encompasses:
  1. **Accessibility audit**: Full WCAG 2.2 AA audit with `axe-core` across all
     routes, verifying zero violations, persistent accessible names, 44px
     minimum touch targets, semantic landmark hierarchy, focus visibility,
     and live region polite announcements.
  2. **Performance & build analysis**: Next.js 16 Turbopack build inspection,
     bundle chunk analysis, zero waterfall verification, static vs SSG vs
     dynamic route optimization, `next/image` sizing and priority audit,
     and Core Web Vitals checks.
  3. **Visual QA & screenshot comparison**: 1440px desktop full-page comparisons
     against all 9 native design references (`design/1-Home.png` through
     `design/9-Blog.png`), validating the 2× raster scale (1440 CSS px = 2880
     raster px), container bounds (1240px container), and responsive fidelity
     at 1024, 768, 390, and 320 CSS px.
  4. **Keyboard & assistive technology flows**: End-to-end traversal of skip
     links, header navigation, cart drawer modal trapping & escape return,
     inspiration carousel bounds, shop filter disclosure & controls, gallery
     selection, variant selection with busy guard, tab roving focus,
     comparison table scroll region, and form validations.
  5. **Edge cases**: Reflow at 200% text zoom without horizontal page scroll,
     and `prefers-reduced-motion: reduce` collapse verification.
  6. **Metadata & SEO foundations**: Standardized `Metadata` and `Viewport`
     attributes across all routes, Open Graph, Twitter cards, `app/robots.ts`,
     `app/sitemap.ts`, and a branded custom `app/not-found.tsx` recovery page.
  7. **Documentation closure**: Record full QA findings, measurements, and
     certification in `docs/pages.md`, `docs/components.md`,
     `docs/design-system.md`, and `AGENTS.md`.

The required lightweight architecture-signal check found no threshold-crossing
candidate. The codebase has clear modular boundaries across catalog, cart,
comparison, and page routes. Do not run an architecture audit during this
single-letter workflow.

## Evidence to re-read before implementation

- `AGENTS.md`, especially §§1 (Compfi product, language, currency), 2 (design
  inspection, palette, 2880px 2× scale), 6 (tokens, 44px targets, responsive
  layout), 7 (WCAG 2.2 AA floor, visible focus, hover-only ban, live regions,
  modal drawer contract, reduced motion), 9 (RSC defaults, minimal serialization),
  10 (commerce display boundaries), and 12–13 (verification rules).
- `CONTEXT.md`; `docs/design-system.md` (tokens, scale, responsive foundations);
  `docs/components.md` (component inventory & certified APIs); `docs/pages.md`
  (complete build record); `docs/automation.md`; `docs/agent-browser.md`.
- Installed Next.js documentation from `node_modules/next/dist/docs/`
  (`01-app/01-getting-started/14-metadata-and-og-images.md`,
  `01-app/01-getting-started/12-images.md`, `01-app/02-guides/building.md`).
- Installed skills:
  - `.agents/skills/agent-browser/SKILL.md`
  - `.agents/skills/web-design-guidelines/SKILL.md`
  - `.agents/skills/vercel-react-best-practices/SKILL.md`
  - `.agents/skills/react-testing/SKILL.md`
  - `.agents/skills/building-components/SKILL.md`
  - `.agents/skills/frontend-design/SKILL.md`
  - `.agents/skills/code-review/SKILL.md`
  - `.agents/skills/caveman-commit/SKILL.md`
- Design references (native 2880px desktop exports):
  - `design/1-Home.png` (hero, room categories, featured grid, inspiration carousel, social gallery)
  - `design/2-Shop.png` (hero, filter controls, product grid, pagination, benefits)
  - `design/3-Single Product.png` (gallery, options, info tabs, related products)
  - `design/4-Cart Sidebar.png` (modal drawer, backdrop, line items, totals, actions)
  - `design/5-Product Comparison.png` (header, product picker, attribute comparison table)
  - `design/6-Cart.png` (cart table, line removal, quantity inputs, totals card)
  - `design/7-Checkout.png` (billing form, order summary, payment selection, place order)
  - `design/8-Contact.png` (contact info cards, contact form, benefits)
  - `design/9-Blog.png` (article feed, search, category list, recent posts, pagination)

## Exact scope, expected files, and route impact

### 1. Metadata and SEO foundations
- Add `app/robots.ts`: standard Next.js App Router metadata route returning
  disallow/allow rules and sitemap reference.
- Add `app/sitemap.ts`: standard Next.js App Router metadata route generating
  sitemap entries for all static routes (`/`, `/shop`, `/cart`, `/checkout`,
  `/contact`, `/blog`, `/comparison`) and dynamic product routes (`/shop/[slug]`).
- Add `app/not-found.tsx`: branded 404 page with PageHero, descriptive message,
  and accessible return-to-shop navigation.
- Audit and standardize metadata in `app/layout.tsx` and all page routes:
  - Add canonical URL configuration, Open Graph defaults (`siteName: "Compfi"`,
    locale `"en_US"`), and Twitter card metadata.
  - Verify every page title follows `%s | Compfi` or explicit brand title.

### 2. Full-site accessibility audit & fixes
- Run automated `axe-core` accessibility checks against all 10 routes (`/`,
  `/shop`, `/shop/[slug]`, cart drawer open state, `/comparison`, `/cart`,
  `/checkout`, `/contact`, `/blog`, `/design-system`).
- Verify zero axe violations (critical, serious, moderate, minor).
- Verify all interactive controls maintain:
  - Visible 3px focus ring with 3px offset (`outline: var(--focus-ring-width) solid var(--color-brand-focus)`).
  - Minimum 44×44 CSS px touch targets across buttons, links, toggles, and inputs.
  - Distinct accessible names on all icon buttons (`aria-label`).
  - Persistent form labels and `aria-describedby` associations on validation errors.
  - Single polite live regions that announce updates without competing or repeating.
- Run `web-design-guidelines` audit across all UI components and resolve any
  identified findings.

### 3. Performance & build audit
- Audit Turbopack production build (`npm run build`):
  - Inspect output route classification (Static, SSG, Dynamic).
  - Verify bundle sizes and eliminate any inadvertent heavy imports or barrels.
  - Verify `next/image` attributes (`sizes`, `priority` on above-the-fold hero/lead
    images, lazy loading on below-the-fold cards).
  - Confirm zero async waterfalls and minimal client-boundary serialization.
- Run `agent-browser vitals` to inspect Core Web Vitals (LCP, CLS, FID/INP).

### 4. Site-wide visual QA & screenshot comparison
- Launch named `agent-browser` session (`compfi-phase8-qa-*`).
- Capture desktop screenshots (1440×1000) for all 9 routes + cart drawer open state.
- Validate desktop 1440 CSS px against native 2880px design references (2× scale,
  1240px container, centered rhythm).
- Capture responsive viewports across all routes:
  - 1024×900 (small desktop / landscape tablet, 32px gutters)
  - 768×1024 (portrait tablet, 32px gutters)
  - 390×844 (mobile, 20px gutters)
  - 320×720 (narrow mobile, 16px gutters)
- Verify `scrollWidth === clientWidth` on every route at all viewports (zero
  horizontal overflow).

### 5. Keyboard flows & motion verification
- Verify keyboard-only tab sequence across all key interactive flows:
  - Skip link activation jumping directly to `#main-content`.
  - SiteHeader search, account, and cart triggers.
  - CartDrawer modal focus trap, Escape key close, and focus restore to trigger.
  - ShopControls filter disclosure, sorting, and pagination Prev/Next.
  - ProductGallery thumbnail arrow/tab selection, SizeSelector, ColorSwatch,
    QuantityInput, and Add to Cart busy guard (retaining focus).
  - ProductInformation tabs roving focus and panel activation.
  - ProductComparison horizontal table scrolling with keyboard.
  - Checkout & Contact form field progression and validation announcement.
- Emulate `prefers-reduced-motion: reduce`: verify animations and transitions
  collapse (0.01ms duration), carousel jump path executes instantly.
- Test 200% text zoom: verify text reflows cleanly without clipping or two-dimensional
  page scrolling.

### 6. Automated test coverage
- Add `test/phase8-audit.test.tsx`: comprehensive integration test suite verifying:
  - Metadata and canonical exports across all routes.
  - Sitemap generation containing all storefront paths.
  - Robots configuration.
  - Branded 404 page rendering and recovery link.
  - Axe-core accessibility assertions on key block compositions and Chrome shell.

### 7. Documentation updates
- Update `docs/pages.md`: record Phase 8 audit findings, responsive metrics,
  Core Web Vitals, screenshot comparison results, and formal Phase 8 certification.
- Update `docs/components.md` and `docs/design-system.md` if any token or
  component refinements are made.
- Update `AGENTS.md`: documentation index row for Phase 8.

## Expected files to create or modify

- Create:
  - `app/robots.ts`
  - `app/sitemap.ts`
  - `app/not-found.tsx`
  - `test/phase8-audit.test.tsx`
- Modify:
  - `app/layout.tsx` (Open Graph, canonical metadata, Twitter cards)
  - `app/page.tsx`, `app/shop/page.tsx`, `app/shop/[slug]/page.tsx`, `app/comparison/page.tsx`,
    `app/cart/page.tsx`, `app/checkout/page.tsx`, `app/contact/page.tsx`, `app/blog/page.tsx`
    (standardize metadata where needed)
  - Any component or CSS file where accessibility or visual QA identifies a concrete defect
  - `docs/pages.md` (record Phase 8 certification)
  - `docs/components.md` (reflect final certified contracts)
  - `docs/design-system.md` (confirm verified tokens)
  - `AGENTS.md` (update documentation status table)

## Component boundaries and server/client ownership

- App Router Server Components remain the strict default across all pages.
- `app/robots.ts` and `app/sitemap.ts` are pure server Route Handlers/metadata exports.
- `app/not-found.tsx` is an RSC rendering the PageHero and navigation links.
- Interactive controls remain small client leaves (`components/cart/cart-drawer.tsx`,
  `components/shop/shop-controls.tsx`, `components/product/product-gallery.tsx`, etc.).
- No client-side barrel imports or bloated packages.

## Responsive behavior at explicit widths

- **1440 px (Desktop)**: 1240px container max-width, spacious multi-column layouts,
  hero banner, side-by-side comparison, 4-column product grids.
- **1024 px (Small Desktop)**: 32px gutters, 3-column product grid, responsive padding.
- **768 px (Tablet)**: 32px gutters, 2-column product grid, stacked checkout/contact layouts.
- **390 px (Mobile)**: 20px gutters, 1-column product list/grid, full-width cart drawer,
  touch-friendly scrollable comparison table, 44px minimum touch targets.
- **320 px (Narrow Mobile)**: 16px gutters, wrapped flex items, no text clipping.
- **Strict Invariant**: `document.documentElement.scrollWidth === window.innerWidth`
  at all 5 viewports across every route.

## States

- **Default**: Polished typography, colors, and imagery matching design tokens.
- **Hover**: Discrete opacity/color shifts using `--duration-fast` (140ms); no hover-only features.
- **Focus-visible**: 3px brand-focus outline with 3px offset on all focusable elements.
- **Active / Pressed**: Distinct active state on buttons, swatches, and toggles.
- **Disabled**: Non-focusable native controls with distinct muted styling.
- **Loading / Busy**: `aria-busy="true"` with retained keyboard focus and polite status.
- **Empty**: Certified `Empty` component on 0 products, 0 blog posts, and empty cart.
- **Error**: Field-level validation messages with `aria-describedby` and clear recovery actions.
- **Success**: Clear confirmation and next step on form submissions.

## Accessibility and security requirements

- Full compliance with WCAG 2.2 AA floor (0 axe-core violations).
- Persistent labels on all form controls; explicit accessible names on all buttons and links.
- All non-text content has descriptive `alt` attributes; decorative icons have `aria-hidden="true"`.
- Contrast ratio >= 4.5:1 for normal text and >= 3:1 for large text across all surfaces.
- Focus trapping and Escape restoration in `CartDrawer` modal dialog.
- Single polite live regions for async state updates.
- No client secrets; no raw payment data collected or stored.
- Secure metadata: sanitized user inputs, safe canonical URLs.

## Data shapes and edge cases

- Handles empty cart, empty filter query results, missing product variant, and invalid slug gracefully (triggering 404).
- Handles long product titles and long blog post excerpts without layout overflow.
- Reflow at 200% text zoom preserves all text without truncation or overlapping elements.

## Reference deltas

- **Robots and Sitemap**: Standard SEO metadata files added to support search discovery.
- **Custom 404 Page**: Branded Compfi error recovery route not present in source PNGs.
- **Accessible Overlays**: Product card overlay accessible via keyboard focus and mobile tap, extending the desktop hover comp in `design/1-Home.png` and `design/2-Shop.png`.
- **Cart Drawer Modal**: Accessible dialog semantics, inert background, and focus trap extending the static visual comp in `design/4-Cart Sidebar.png`.
- **44px Touch Targets**: Enforced across all buttons and icon links for WCAG 2.5.8 compliance.
- **USD Currency**: Standardized USD formatting across all surfaces.

## Non-goals

- No Clerk authentication provisioning (Phase 9).
- No real payment gateways or third-party checkouts (Phase 10).
- No live database or CMS integration (Phase 10).
- No speculative dark mode or multi-currency selector.

## Acceptance criteria

1. Automated `axe-core` accessibility audit reports **0 violations** across all
   routes (`/`, `/shop`, `/shop/[slug]`, cart drawer open state, `/comparison`,
   `/cart`, `/checkout`, `/contact`, `/blog`, `/design-system`, `/_not-found`).
2. Every interactive control has visible `:focus-visible` outline and meets
   44×44px touch target guidelines.
3. Full keyboard flows verified in browser: skip link, header, cart drawer,
   shop controls, product gallery, variant selectors, tabs, comparison table,
   and checkout/contact forms.
4. Responsive audit confirms `scrollWidth === clientWidth` at 1440, 1024, 768,
   390, and 320 px across all routes.
5. Screenshot comparisons against `design/1-Home.png` through `design/9-Blog.png`
   confirm visual fidelity, 2× raster scale alignment, and container margins.
6. `prefers-reduced-motion: reduce` emulation confirms motion collapse (0.01ms).
7. 200% text zoom reflow confirmed without layout breakage or two-dimensional scrolling.
8. `app/robots.ts` and `app/sitemap.ts` generate valid robots and sitemap output.
9. `app/not-found.tsx` renders branded Compfi 404 page with accessible recovery.
10. Turbopack production build (`npm run build`) succeeds cleanly with optimal
    route classification and zero bundle bloat.
11. All existing test suites (131 tests across 26 files) + new Phase 8 test suite
    pass with 0 failures (`npm run test`).
12. `npm run lint` reports 0 warnings and 0 errors.
13. `npx tsc --noEmit` reports 0 TypeScript errors.
14. Documentation updated (`docs/pages.md`, `docs/components.md`, `docs/design-system.md`,
    `AGENTS.md`) recording Phase 8 certification.

## Commands and verification procedure

```bash
# 1. Static and automated tests
npm run test
npm run lint
npx tsc --noEmit
npm run build

# 2. Start dev server and launch named agent-browser session
npm run dev &
export AGENT_BROWSER_SESSION="$(agent-browser session id --scope worktree --prefix compfi-phase8)"

# 3. Full browser verification across routes and viewports
agent-browser open http://localhost:3000
agent-browser set viewport 1440 1000
agent-browser screenshot /tmp/compfi-qa-home-1440.png
agent-browser a11y

agent-browser open http://localhost:3000/shop
agent-browser set viewport 1440 1000
agent-browser screenshot /tmp/compfi-qa-shop-1440.png
agent-browser a11y

agent-browser open http://localhost:3000/shop/alder-dining-chair
agent-browser set viewport 1440 1000
agent-browser screenshot /tmp/compfi-qa-product-1440.png
agent-browser a11y

agent-browser open http://localhost:3000/comparison
agent-browser set viewport 1440 1000
agent-browser screenshot /tmp/compfi-qa-comparison-1440.png
agent-browser a11y

agent-browser open http://localhost:3000/cart
agent-browser set viewport 1440 1000
agent-browser screenshot /tmp/compfi-qa-cart-1440.png
agent-browser a11y

agent-browser open http://localhost:3000/checkout
agent-browser set viewport 1440 1000
agent-browser screenshot /tmp/compfi-qa-checkout-1440.png
agent-browser a11y

agent-browser open http://localhost:3000/contact
agent-browser set viewport 1440 1000
agent-browser screenshot /tmp/compfi-qa-contact-1440.png
agent-browser a11y

agent-browser open http://localhost:3000/blog
agent-browser set viewport 1440 1000
agent-browser screenshot /tmp/compfi-qa-blog-1440.png
agent-browser a11y

# 4. Check responsive overflow across all widths (1440, 1024, 768, 390, 320)
# 5. Core Web Vitals & performance checks
agent-browser vitals

# 6. Close session
agent-browser close
```

## Documentation to update

- `docs/pages.md`: record Phase 8 site-wide audit execution, axe-core results,
  responsive metrics, Core Web Vitals, screenshot comparison analysis, and Phase 8
  exit certification.
- `docs/components.md`: record any component accessibility enhancements.
- `docs/design-system.md`: document verified token contrast ratios and scale.
- `AGENTS.md`: update documentation index status for Phase 8.

## SKILLS USED

- `agent-browser`: browser automation, full-page screenshot comparisons, responsive
  checks, keyboard flow execution, and live region testing.
- `web-design-guidelines`: UI review against Web Interface Guidelines, WCAG 2.2 AA floor,
  and UX design rules.
- `vercel-react-best-practices`: Next.js 16 and React 19 performance guidelines,
  bundle optimization, and waterfall elimination.
- `react-testing`: Vitest integration test suite for metadata, SEO, and accessibility.
- `building-components`: component token consistency, state attributes, and accessibility contracts.
- `frontend-design`: visual fidelity across all 9 design references, spacing/typography rhythm.
- `code-review`: mandatory two-stage review with parallel Standards and Spec subagents.
- `caveman-commit`: mandatory concise conventional commits for implementation and fix commits.
