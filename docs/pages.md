# Compfi page build record

Status: Phase 4 Home commerce foundation implemented; the inspiration carousel
and editorial gallery remain intentionally unbuilt.

## Home commerce foundation

The Home route now renders the campaign, room navigation, all eight canonical
catalog products, and the existing benefits strip inside its single
`main#main-content` landmark. It remains a partial Phase 4 route: the reference
inspiration carousel and editorial mosaic are deferred to the next approved
Home unit rather than represented with placeholders or duplicate imagery.

### Reference evidence and production interpretation

| surface | native reference measurement | Compfi production decision |
| --- | --- | --- |
| campaign band | Home image-led region begins beneath the 200-raster-pixel header and ends near y=1620 | 710 CSS px desktop campaign block below the existing 100 CSS px header; local 3:2 hero image fills it at large widths |
| campaign panel | `1286 × 886 + 1478 + 506` raster `#FFF3E3` region | 643 × 443 CSS px cream panel, vertically centered and 58 CSS px from the 1440px viewport edge; it stacks below the image below 1024px |
| room navigation | `762 × 960` raster room crop at x=262–1023, y=2016–2975 | Three 381 × 480 CSS px portrait crops at desktop; 3/2/1 columns at 768/640/320px pressure points |
| featured cards | `570 × 892` raster card, including a `570 × 602` image field; 64-raster-pixel column gap | Flat four-column desktop list within the 1240px container, with a 285:301 media field and 32 CSS px gaps; 3/2/1 columns at 1024/768/390px |
| lower boundary | inspiration wash begins around y=5526 raster | This implementation stops after the featured list and continues directly to the shared benefits strip; no synthetic lower band is added |

### Responsive and interaction decisions

- The 1440px hierarchy uses a right-side cream campaign panel, three tall room crops, and four product columns. At 1024px, the campaign remains image-led and the product list reduces to three columns. At 768px it uses two product columns and the panel becomes normal-flow content; at 390px and 320px rooms and products each use one column.
- The campaign image is decorative because its adjacent HTML copy carries the message. Room images have contextual alt text; product images retain the fixture alt unchanged.
- The only preloaded image is the campaign hero. Room and catalog images use local paths, intrinsic dimensions, accurate responsive `sizes`, and default lazy loading.
- Product actions are navigation only: image/name links are always available; the desktop overlay is a redundant `View product` link revealed by hover or `focus-within`. No cart, comparison, favorite, stock, rating, review, or purchase control was added.

### Reference deltas

- Compfi copy, Poppins, local original WebP imagery, and coherent USD-cent fixtures replace the reference brand, template copy, unknown-source photography, and mixed-currency values.
- `Shop the collection` is navigation to `/shop`, not an unsupported immediate-purchase claim.
- The reference grid's add-to-cart/share/compare/like controls are omitted until their backed behavior exists. Sale badges use a calculated 15% discount from the fixture's integer cents; new products say `New`.
- Tablet and mobile flows are responsive decisions derived from the desktop hierarchy; normal-flow campaign copy, focus treatment, 44px actions, and no-overflow layouts take precedence over desktop overlap.

### Verification

Self-verification on 2026-09-08:

| check | result |
| --- | --- |
| focused Home/product tests | passed: 2 files, 3 tests; semantic landmarks, customer links, USD, badges, image alternatives, and axe checks covered |
| `npm run test` | passed: 11 files, 50 tests |
| `npm run lint` | passed |
| `npx tsc --noEmit` | passed |
| `npm run build -- --webpack` | passed; `/` prerendered as static content |
| browser rendering | local Chromium screenshots inspected at 1440, 1024, 768, 390, and 320 CSS px; hero, room, and product hierarchy matched the recorded responsive decisions without observed clipping or horizontal overflow |
| browser tooling delta | the requested `agent-browser` executable was not installed. Its local Chromium fallback was used to inspect temporary screenshots under `/tmp/compfi-home-*.png`; no production dependency or asset was added. |
| Web Interface Guidelines | fresh rules reviewed against all new/changed Home UI files; no unresolved finding after verifying native navigation, focus-visible styles, decorative/meaningful image alternatives, dimensions, lazy loading, and reduced-motion handling |

## Shared storefront chrome

### Reference evidence and production interpretation

| surface | native reference measurement | Compfi production decision |
| --- | --- | --- |
| Header | repeated 200 raster px bar across Home, Shop, Product, and Cart Sidebar | 100 CSS px white header; 1240 CSS px container; brand, centered desktop navigation, and right utility actions |
| Page hero | Shop photo/title area is 630 raster px tall; Product breadcrumb wash is 360 raster px | reusable 315 CSS px generic title band and 180 CSS px compact breadcrumb basis, rendered as the existing wash token pending a licensed local image |
| Benefits | Contact benefit band is 550 raster px tall | 275 CSS px desktop band with four item groups; responsive 2-column then 1-column flow |
| Cart drawer | 1100 raster px sheet from x=1780; background white changed to `#CCCCCC` | 550 CSS px maximum right sheet and 20% black scrim; narrow viewports preserve a 16 CSS px inset on each side |

The exact shared-chrome geometry is consumed through the named chrome and
wordmark tokens documented in `docs/design-system.md`.

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
named chrome geometry tokens). The subsequent Standards re-review found and
resolved the remaining geometry/wordmark token gaps and documentation-status
inconsistency; Spec re-review initially reported no remaining finding. The next
full review accepted a docs-lifecycle correction, intermediate breadcrumb
semantics, 44px text-link target fixes, drawer insets on both narrow sides, and
the certified sheet's public props export. Final cumulative re-review from the
original base reported zero Standards findings. Its final Spec pass found the
benefit heading at 20px rather than the required 24px; that one-line,
behavior-preserving typography correction is committed separately after the
same test, lint, and TypeScript checks passed.
