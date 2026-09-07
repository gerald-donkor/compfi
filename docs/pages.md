# Compfi page build record

Status: Phase 3 shared chrome implemented and self-verified; this record is
committed with the implementation.

## Shared storefront chrome

### Reference evidence and production interpretation

| surface | native reference measurement | Compfi production decision |
| --- | --- | --- |
| Header | repeated 200 raster px bar across Home, Shop, Product, and Cart Sidebar | 100 CSS px white header; 1240 CSS px container; brand, centered desktop navigation, and right utility actions |
| Page hero | Shop photo/title area is 630 raster px tall; Product breadcrumb wash is 360 raster px | reusable 315 CSS px generic title band and 180 CSS px compact breadcrumb basis, rendered as the existing wash token pending a licensed local image |
| Benefits | Contact benefit band is 550 raster px tall | 275 CSS px desktop band with four item groups; responsive 2-column then 1-column flow |
| Cart drawer | 1100 raster px sheet from x=1780; background white changed to `#CCCCCC` | 550 CSS px maximum right sheet and 20% black scrim; narrow viewports preserve a 16 CSS px inset on each side |

### Components and behavior

- `SiteHeader` is server-rendered; `HeaderControls` is the small client boundary
  for pathname semantics, the mobile disclosure, and the cart leaf.
- `PageHero` accepts `title`, a small breadcrumb record (`label`, optional
  `href`), and one semantic `size` choice: the default `banner` is 315px while
  `breadcrumb` is 180px. Its current page is a non-link `aria-current` span,
  never a fake disabled link.
- `BenefitsStrip` owns a typed four-item local record. Its Lucide icons are
  decorative and hidden from assistive technology.
- `SiteFooter` contains only approved, non-claiming Compfi copy and route
  links. It deliberately has no address, policy, payment, newsletter, or
  service affordance.
- `CartDrawer` uses the audited Base UI sheet composition. The primitive
  supplies modal focus containment, Escape and backdrop dismissal, inert
  background, scroll locking, and trigger focus return; the chrome adapts its
  width, 20% scrim, flat surface, and motion token. The empty state uses a real
  `/shop` link styled as a primary action.

### Reference deltas

- The Shop title band is a tokenized wash instead of an image because no
  licensed local image exists.
- The reference's populated cart, template footer contact data, policy claims,
  newsletter form, warranty, support hours, and shipping offer are intentionally
  absent. The cart is an accessible empty state until a cart model is built.
- Keyboard focus, 44px targets, motion reduction, responsive navigation, and
  no-overflow mobile behavior are deliberate accessibility additions not proven
  by the desktop references.

### Verification

Self-verification on 2026-09-07:

| check | result |
| --- | --- |
| `npm run test` | passed: 8 files, 42 tests; shared chrome interactions and axe checks included |
| `npm run lint` | passed |
| `npx tsc --noEmit` | passed |
| `npm run build` | environment-limited: Turbopack's PostCSS worker cannot bind an internal port in the restricted sandbox (`Operation not permitted`) |
| `npm run build -- --webpack` | passed; `/` and `/design-system` prerendered as static content |
| browser interaction | desktop cart opens as a named modal with empty-state description and closes with Escape; mobile menu exposes its state, opens primary links, and closes with Escape |
| browser reflow | no document overflow at 1024, 390, and 320 CSS px (`scrollWidth === clientWidth`) |
| screenshots | inspected temporary desktop, small-desktop, mobile, and narrow-mobile screenshots under `/tmp/compfi-phase3-*.png`; visual hierarchy and responsive stacking match the measured chrome evidence, with documented intentional deltas |
| Web Interface Guidelines | reviewed against the fresh Vercel rule set; no unresolved finding after using a real link for the browse action and adding sheet overscroll containment |

Initial independent review found and resolved two Spec issues (PageHero height
and fake current-page link) and four Standards issues (semantic scrim/motion and
named chrome geometry tokens). The review-fix commit and re-review results are
recorded after they complete.

The required independent review follows the implementation commit.
