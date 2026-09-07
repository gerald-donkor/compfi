# Compfi design system

Status: implemented; closure-review fixes verified, final review pending.

This document owns Compfi's measured visual tokens and responsive foundation.
The implementation authority is `app/globals.css`; this record explains the
evidence, semantic roles, and deliberate departures from the references.

## Reference scale and measurement confidence

All nine supplied PNGs are 2880 pixels wide and contain no embedded scale or
font metadata. Repeated geometry supports a working interpretation of two raster
pixels per CSS pixel:

- The Shop product row contains four 570-raster-pixel cards separated by
  64-raster-pixel gaps. At 2× these are practical 285 CSS-pixel cards and 32 CSS-
  pixel gaps.
- That row spans 2472 raster pixels, or 1236 CSS pixels. Its observed left and
  right gutters are 198 and 210 raster pixels. The implementation normalizes
  this four-pixel CSS asymmetry to a centered 1240 CSS-pixel container.
- The repeated 200-raster-pixel navigation height becomes the conventional
  100 CSS-pixel desktop header used throughout the references.
- Repeated 88-raster-pixel minimum actions become 44 CSS-pixel targets.

The 2× interpretation is high confidence but inferred rather than metadata-
proven. Measurements below retain both coordinate systems so future work can
revisit it without hidden conversion.

## Auditable reference record

Crop geometry uses `width × height + x + y` in native raster pixels. Exact-fill
counts come from broad, non-antialiased regions; overview quantization was used
only to locate representative areas.

| reference | native size | inspected crop | raster evidence | CSS interpretation | confidence |
| --- | --- | --- | --- | --- | --- |
| Home | 2880 × 9670 | `1400×1100+1400+400` | hero fill `#FFF3E3` 997,105 px; gold `#B88E2F` 112,469 px; strong ink `#333333` 12,880 px | 700 × 550 campaign panel area; 52 px display, 32 px section rhythm | high color; medium type |
| Shop | 2880 × 6948 | `2880×230+0+800` | wash `#F9F1E7` 501,216 px; scanline cards `[198,768)`, `[832,1402)`, `[1466,2036)`, `[2100,2670)` | 115 px control band; 285 px cards, 32 px gaps, ~1240 px container | high |
| Single product | 2880 × 6214 | `2880×360+0+200` | wash `#F9F1E7` 621,345 px; white 404,713 px | 180 px breadcrumb region; restrained 1 px borders and 10 px image/control radii | high color; medium geometry |
| Cart sidebar | 2880 × 6214 | `1100×1400+1780+0` | white 1,052,939 px; gold 2,982 px; darkened page remains outside sheet | roughly 550 px desktop sheet; 20% black scrim; compact rows and outlined actions | high surface; medium opacity |
| Comparison | 2880 × 7996 | `2600×2400+140+1100` | white 5,886,643 px; wash 141,070 px; gold 24,214 px | dense 14–16 px body text, column separators, 44 px actions | high color; medium type |
| Cart | 2880 × 3592 | `900×850+1900+900` | wash 583,487 px; white 161,280 px; gold 2,313 px | 450 × 425 totals region; square outlined checkout action | high |
| Checkout | 2880 × 6140 | `2200×3000+300+900` | white 6,454,154 px; gold 3,647 px | two-column desktop form; ~75 px fields with 10 px radii | high surface; medium geometry |
| Contact | 2880 × 4730 | `2880×550+0+3100` | benefit `#FAF3EA` 1,462,171 px; ink `#242424` 35,404 px; muted `#898989` 11,492 px | 275 px benefit strip; 24 px benefit titles and 16 px supporting copy | high |
| Blog | 2880 × 7962 | `2400×4000+240+900` | white 5,331,406 px; black 42,385 px; product gray 456 px | approximately 820/300 px content/sidebar split with 32 px gaps and 10 px image radii | high surface; medium geometry |

Representative image bounds preserve the proportions later image-led work must
use instead of inferring them from a resized overview:

| role | native raster bounds | CSS interpretation | aspect ratio |
| --- | --- | --- | --- |
| Home room category | 762 × 960 at x 262–1023, y 2016–2975 | 381 × 480 px | 0.794:1 (portrait) |
| Home product image | 570 × 602 within the 570 × 892 card run beginning at x 202, y 3380 | 285 × 301 px within a 285 × 446 card | 0.947:1 |
| Blog lead article | 1634 × 1000 at x 200–1833, y 1044–2043 | 817 × 500 px | 1.634:1 (landscape) |

The cart-drawer reference changes a known white canvas pixel to `#CCCCCC`
outside the sheet while the sheet stays `#FFFFFF`, proving a 20% black scrim.
For the product-card overlay, corresponding points on the same chair image in
Shop's hovered first row and plain second row change `#E5E2E3` to `#6A6A6A`
(1100,1450 versus 1100,2420) and `#CDCDCD` to `#636363` (900,1300 versus
900,2270). Solving the alpha blend against `#3A3A3A` gives 71–72%, supporting
the production 72% overlay token. Flat card and panel edge scanlines showed no
separate repeated shadow band; the foundation therefore records `none` rather
than inventing elevation.

Representative type measurements across the raster references support 52/65,
48/60, 32/38, 24/32, 20/28, 18/29, 16/24, and 14/21 CSS-pixel roles after
the 2× conversion. Text raster edges and export antialiasing make type size and
tracking medium-confidence observations. The production scale uses rem and
fluid clamps while preserving those endpoints.

Only auditable observations use the `--reference-*` namespace: sampled colors;
the 52/65 hero display metric confirmed by the font crop; the 32 px Shop grid
gap; 1240 px container; 44 px control target; square/10 px radii; 1 px border;
and flat elevation. The remaining type scale, the constructed 4 px spacing
scale, responsive interpolation, focus geometry, and motion constants are
production semantic decisions. They deliberately do not claim screenshot
provenance.

## Typography

The PNGs do not identify their typeface. Poppins is a deliberate, high-confidence
substitute based on multi-specimen comparison of the hero phrase, section titles,
product names, body copy, currency numerals, and weights. Its geometric lowercase,
single-storey `a`, numerals, and broad weight range align closely, but Compfi does
not claim that the reference source family is proven.

Poppins Regular 400, Medium 500, SemiBold 600, and Bold 700 are self-hosted from
the authoritative Google Fonts repository. `public/fonts/poppins/METADATA.pb`
records the family, designers, source commit, filenames, and copyright; `OFL.txt`
contains the SIL Open Font License 1.1. The downloaded files were retrieved from
`https://github.com/google/fonts/tree/main/ofl/poppins` on 2026-09-07.

The comparison used three locally available, openly licensed candidates. Each
row below pairs a native reference crop with the same text rendered at its 2×
CSS interpretation. Dimensions are trimmed ink bounds, except where the label
canvas and ink bounds are identical to the reported precision.

| specimen and reproducible source crop | reference at CSS scale | Poppins | Noto Sans | Liberation Sans |
| --- | --- | --- | --- | --- |
| Bold 52 px hero line 1/2; Home `1150×260+1520+690`, split at y 115/130 | 339 × 42.5 / 393 × 42.5 px | 339 × 43 / 393 × 43 px | 330 × 41 / 382 × 41 px | 323 × 39 / 367 × 39 px |
| Medium 18 px first body line; Home `1200×120+1520+980`, first 48 raster px | 524.5 × 19 px | 525 × 19 px | 502 × 18 px | 461 × 17 px |
| Semibold 20 px price-numeral run; Shop `230×80+285+1925` | 97.5 × 15.5 px | 99 × 15 px | 91 × 14 px | 89 × 14 px |

Poppins retained the closest combined proportions and the geometric,
single-storey lowercase forms visible across the references. Noto Sans and
Liberation Sans were credible controls but are narrower and use materially
different lowercase forms. This specimen comparison supports the production
choice; it does not prove the source design's original family.

| role | production size / line height | weight | intended use |
| --- | --- | --- | --- |
| display | fluid 40–52 px / 1.18–1.25 | 700 | campaign statements only |
| heading XL | fluid 32–48 px / 1.25 | 600 | page titles |
| heading LG | fluid 28–32 px / 1.2 | 700 | major sections |
| heading MD | 24 px / 1.35 | 600 | grouped content |
| heading SM | 20 px / 1.4 | 600 | products and cards |
| body large | 18 px / 1.6 | 400 | introductions |
| body | 16 px / 1.5 | 400 | primary reading |
| body small | 14 px / 1.5 | 400 | secondary details |
| label | 14 px / 1.4 | 500 | fields and compact controls |

Body lines should remain below roughly 75 characters. Semantic heading order is
independent of visual type class.

## Color and contrast

Reference colors remain named separately from accessible production decisions.
Ratios were calculated with WCAG relative luminance.

| role | reference | production | approved pairing and ratio |
| --- | --- | --- | --- |
| canvas | `#FFFFFF` | same | primary page surface |
| primary ink | `#242424` / `#333333` | same | `#242424` on benefit: 14.10:1 |
| product ink | `#3A3A3A` | same | on product gray: 10.43:1 |
| brand accent | `#B88E2F` | same | dark ink on gold: 5.14:1; white is only 3.02:1 and is prohibited for normal text |
| filled action | `#B88E2F` | `#8A681A` | white on action gold: 5.15:1 |
| focus | not shown | `#765A16` | white: 6.47:1; hero cream: 5.91:1; product surface: 5.93:1 |
| muted text | `#898989` | `#686868` | white 5.57:1; hero 5.09:1; wash 4.98:1; benefit 5.06:1; product 5.11:1. Reference muted is only 3.50/3.20/3.13/3.18/3.21:1 on those surfaces |
| control boundary | `#D9D9D9` | `#898989` | white: 3.50:1; structural separators retain the lighter reference border |
| discount | `#E97171` | `#8D3333` when carrying white text | white: 7.91:1; reference was 2.97:1 |
| new badge | `#2EC1AC` | same | dark ink: 6.90:1 |
| hero | `#FFF3E3` | same | campaign grouping |
| wash | `#F9F1E7` | same | controls, breadcrumbs, totals |
| benefit | `#FAF3EA` | same | benefits bands |
| product | `#F4F5F7` | same | product information |

White text must not be placed on the reference gold, coral, or teal. Gold may be
used decoratively or with dark text. The stronger muted token is required for
normal-size customer copy; the sampled muted value remains evidence only.

## Layout, spacing, and responsive rules

`Container` is the shared layout component. It renders a div, accepts native div
props, composes children, merges its base class before a caller class, and keeps
`data-slot="container"` stable. The base class owns width and centering. A caller
class is an additive styling hook; any intentional layout override must be a
later unlayered rule with adequate specificity. At desktop the container is
77.5rem (1240 px) wide with 6.25rem nominal gutters on a 1440 px viewport.

Breakpoints are implementation decisions because no tablet or mobile references
were supplied:

| viewport | container gutter | behavior |
| --- | --- | --- |
| 1024–1440 px | fluid 32–100 px | expand continuously into the reference-scale desktop composition |
| 768–1024 px | 32 px | reduce columns at content pressure; preserve reading measure |
| 390–768 px | fluid 20–32 px | stack primary groups; wrap control rows |
| 320–390 px | fluid 16–20 px | single-column samples; labels wrap without overflow |

The production spacing scale is 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96,
and 120 px. Its 32 px step maps to the measured Shop grid gap; the other steps
form the selected coherent 4 px scale rather than claiming individual crops.
Prefer 24–32 px card/grid gaps, 64–96 px section gaps, and 120 px only for the
largest desktop intervals. All controls have a 44 × 44 px minimum target.

Future comparison tables may scroll horizontally within a named region rather
than compressing unreadably. Cart tables become labeled stacked rows on mobile.
Modal cart sheets use available viewport width with focus management supplied by
an established primitive in the component phase.

## Borders, radii, elevation, and motion

- Structural separator border: 1 px `#D9D9D9`; essential control boundaries use
  `#898989` to reach 3:1 against white. The specimen's emphasized geometry rule
  is the production-selected 2 px accent border.
- Buttons in the references are predominantly square; field and image roles use
  a 10 px radius. Circular badges use the 999 px round token.
- Measured surfaces are flat, so the panel-shadow role is `none`; cards do not
  receive invented elevation. At Home y=4100, x=198–203 remains white before
  the product surface starts at x=204; at x=400 the surface ends at y=4271 and
  returns directly to white at y=4272, with no intervening shadow run.
- The product-card overlay is product ink at 72%; the cart scrim is a separate
  20% black role. The coordinate evidence and blend derivation are above.
- Focus rings are 3 px wide with a 3 px offset; the one-pixel active offset is
  reserved for pressed buttons. These are accessible implementation additions.
- Interaction transitions use the implementation-selected 140 ms for color and
  220 ms for short spatial feedback with `cubic-bezier(0.2, 0, 0, 1)`. Static
  references do not supply timing or easing evidence.
- Reduced-motion preference removes smooth scrolling, collapses transitions,
  and prevents the specimen motion transform. Content never depends on motion.

## State guidance

Loading treatments preserve geometry and name the pending result. Empty states
explain what is absent and offer a relevant next action. Errors identify the
problem and recovery step; success messages name the completed action. No state
may rely on color alone. Domain state machines and reusable control APIs remain
future component work.

## Reference deltas

- Legacy brand content is translated to Compfi.
- The inferred raster/CSS scale and slightly asymmetric Shop gutters are
  normalized into one centered container.
- Poppins is recorded as a high-confidence substitute, not a proven source face.
- Action gold, focus, muted copy, and discount colors are strengthened for AA.
- Focus-visible rings, 44 px targets, reduced motion, and interaction states are
  implementation additions absent from static screenshots.
- Tablet and mobile behavior is designed from content pressure. The references
  establish only desktop end states.
- The `/design-system` specimen has no corresponding storefront reference and
  exists only to verify the foundation.

## Verification

The repeatable measurement and browser process lives in
[`docs/automation.md`](automation.md). Record final command, browser, reflow,
font-loading, screenshot, and independent-review results here before marking
phase 1 complete.

Self-verification on 2026-09-07:

| check | result |
| --- | --- |
| `npm run lint` | passed |
| `npx tsc --noEmit` | passed |
| `npm run build -- --webpack` | passed; `/` and `/design-system` prerendered as static content |
| default `npm run build` | environment-limited: Turbopack's PostCSS worker could not bind an internal port in the restricted sandbox; installed Next 16 documentation identifies `--webpack` as the supported fallback |
| compiled CSS/fonts | four local Poppins faces emitted; reference, semantic, framework-alias and full typography token layers plus responsive and reduced-motion rules present |
| browser geometry | no horizontal overflow at 1440, 1200, 1025, 1024, 768, 600, 390, or 320 px; measured gutters progressed continuously as 100, 81, 32, 32, 32, 27, 20, and 16 px respectively |
| responsive specimen | explicit grid rendered four columns on desktop/small desktop, three at 768 px, two at 600 px, and one at 390/320 px |
| font/runtime | `document.fonts.status` was `loaded` at every width; no application console, hydration, CSS, or font errors observed |
| keyboard | skip link, 44 px home link, enabled buttons, labeled search field, and motion disclosure followed DOM order; disabled button was skipped; focus outlines were visible and unclipped |
| reflow | 320 px viewport retained `scrollWidth === clientWidth` at default sizing and after 200% root text sizing |
| controls and motion | search boundary computed to `rgb(137, 137, 137)` (3.50:1 on white); native disclosure toggled open and produced the intended 16 px transform |
| reduced motion | with the disclosure open, media query matched, root scroll behavior became `auto`, transition duration collapsed to 0.01 ms, and the transform was removed |
| screenshots | inspected desktop, small desktop, tablet, mobile, and narrow-mobile captures in `/tmp`, including closure desktop/mobile geometry captures; source references remained unchanged |
| Web Interface Guidelines | fresh 2026-09-07 rules reviewed; skip navigation, heading anchor offsets, theme color, autocomplete, ellipsis, touch treatment, hover, long-word wrapping, and reduced motion verified; no remaining finding |

The required `agent-browser` executable was not installed. Automatic npm
download/execution was refused by the environment's supply-chain safety review,
so the already-installed Chromium binary and local DevTools Protocol supplied
equivalent viewport, keyboard, focus, font, reflow, and media-query evidence
without adding a dependency.

## Initial independent review

The required parallel review against base
`764064c4d73f7e27c43eb5e4bf6778c8db3c4a14` reported four Standards findings
(worst severity High) and four Spec findings (worst severity High). The axes
overlapped across six underlying concerns:

- The search field's light boundary failed non-text contrast. Accepted: the
  control now uses the accessible `--color-control-border` role.
- Reference evidence and production roles were not layered deeply enough, and
  type values were repeated in utilities. Accepted: reference, semantic,
  framework-alias, and complete typography layers are now explicit.
- The motion sample reacted to focus without exposing an operable control.
  Accepted: a native `details`/`summary` control now drives its state.
- Container width shrank across the 1024/1025 transition, and the brand link's
  height was below the target. Accepted: gutters interpolate continuously and
  the link has a 44 px minimum height.
- Font comparison was described but its evidence was not preserved. Accepted:
  source crops, candidate strings, and raster dimensions are recorded above.

No smell-baseline violations were reported. The accepted fixes passed lint,
standalone TypeScript checking, the webpack production build, browser geometry,
keyboard, state, reflow, reduced-motion, and screenshot checks. The required
full two-axis re-review remains pending because the fixes affect shared tokens,
responsive behavior, and interaction.

## Second independent review

The full re-review from the same base reported three Standards findings (worst
severity High) and three Spec findings (worst severity High). Each finding was
checked against the cumulative diff, prompt, and repository rules:

- Standards correctly found that only colors completed the required
  reference-to-semantic token layering. Typography, spacing, geometry, shadow,
  and motion now have measured reference constants and semantic roles.
- Standards correctly found reusable button typography/spacing and specimen
  border geometry bypassing tokens. Existing semantic tokens now own those
  values, with new border, focus, radius, and active-offset roles where needed.
- Both axes correctly found that candidate-only font dimensions did not make
  the claimed match auditable. The table above now records exact source crop
  coordinates, source bounds at CSS scale, matching candidate bounds, and the
  repeatable method in `docs/automation.md`.
- Spec correctly found missing gold/white and muted-on-cream evidence. The
  contrast record now includes the prohibited 3.02:1 gold/white pair and muted
  ratios across every shipped foundation surface.
- Spec correctly noted that the approved prompt named `agent-browser`
  specifically. Its executable is absent, and an automatic npm download was
  denied by the environment's supply-chain review. Installing a global tool or
  adding an unapproved dependency would violate task scope. This remains a
  disclosed tooling exception; installed Chromium/CDP supplied the required
  behavioral evidence instead.

The code and evidence fixes again pass lint, standalone TypeScript checking,
the webpack production build, and the full browser matrix. A final two-axis
re-review is pending because token architecture changed materially.

## Third independent review

The next cumulative review reported two Standards findings (worst severity
High) and three Spec findings (worst severity Medium). The findings were
verified against the repository contract:

- Standards correctly found that responsive clamps and chosen motion/shadow
  behavior had been mislabeled as measured reference facts. Reference tokens
  now contain only observed values; responsive interpolation and interaction
  timing live in production roles, while measured flat elevation maps to
  `--shadow-panel: none`.
- Standards correctly found that `ContainerProps` excluded React 19's `ref`.
  It now inherits `ComponentProps<"div">`, and the existing prop spread passes
  the ref through without legacy `forwardRef`.
- Spec correctly found that image proportions, shadow evidence, and overlay
  derivation were absent. Native bounds for category, product, and article
  imagery plus two independent alpha samples and the flat-shadow observation
  are now recorded above.
- Spec correctly found that focus-ring and active-offset tokens lacked exact
  role documentation. Their values and permitted use are now explicit.
- The low tooling exception for unavailable `agent-browser` is unchanged and
  remains disclosed; it is not an observed UI defect.

These fixes pass lint, standalone TypeScript checking, the webpack production
build, and the full browser matrix. Another cumulative re-review remains pending
because they change a shared public prop type and the token contract.

## Closure review

The subsequent cumulative review reported one Standards finding (worst
severity High) and three Spec findings (worst severity Medium):

- Both axes correctly found that the constructed spacing/type choices still
  carried `--reference-*` names without individual measurement evidence. Only
  auditable observed values now remain in that namespace; selected production
  scales and interaction choices are explicitly semantic.
- Spec correctly found the visual specimen lacked labeled border/radius and
  responsive-grid demonstrations. The specimen now exposes four geometry roles
  and a four-to-three-to-two-to-one content-pressure grid.
- Spec correctly requested exact shadow scanlines and the product-surface focus
  ratio. Both are now recorded with coordinates and repeatable commands.
- The low `agent-browser` tooling exception remains unchanged and disclosed.

These changes pass lint, standalone TypeScript checking, the webpack production
build, the expanded eight-width browser matrix, and desktop/mobile visual
inspection. One final cumulative review remains pending.
