# Establish the Compfi design system

Status: approved and implemented in local commits; the sign-off review fix is
verified and awaiting final cumulative review.

## Goal and dependency

Execute phase 1 of AGENTS.md: derive a measured design system from all nine
supplied references, implement its reusable CSS and layout foundations, and
write `docs/design-system.md` so subsequent components and pages have an
authoritative contract. Include a small visual specimen for verification.
Phase 1 is the earliest unbuilt dependency; no storefront sections are built yet.

## Starting repository evidence

- Planning HEAD: `764064c4d73f7e27c43eb5e4bf6778c8db3c4a14`; branch `main`;
  starting worktree clean. Recheck before execution and preserve unrelated edits.
- `app/page.tsx` renders only Home. `app/globals.css` has starter colors,
  automatic dark mode, Geist aliases, and an Arial body override.
- `app/layout.tsx` uses Geist/Geist Mono and Create Next App metadata.
- `package.json`: Next 16.3.4, React/React DOM 19.2.8, TypeScript 5,
  Tailwind 4 and its PostCSS plugin. Scripts: dev, build, start, lint.
- `tsconfig.json` enables strict checking and maps `@/*` to the repo root;
  `postcss.config.mjs` already registers `@tailwindcss/postcss`.
- No `components.json` or owning `docs/` files exist. Prompts 01 and 02 concern
  workflow changes, not design-system implementation.
- No commerce modules, adapters, or architecture churn justify an audit;
  architecture automation is excluded from initial phase 1 by AGENTS.md.

## Sources and preliminary measurements

Read AGENTS.md fully and inspect these PNGs again before implementation:

| Reference | Native raster dimensions | Inspect for |
| --- | --- | --- |
| `design/1-Home.png` | 2880 × 9670 | campaign, type hierarchy, categories, cards, spacing |
| `design/2-Shop.png` | 2880 × 6948 | containers, grid, controls, pagination |
| `design/3-Single Product.png` | 2880 × 6214 | gallery surfaces, variants, borders, tabs |
| `design/4-Cart Sidebar.png` | 2880 × 6214 | sheet width, scrim, compact controls |
| `design/5-Product Comparison.png` | 2880 × 7996 | columns, separators, dense typography |
| `design/6-Cart.png` | 2880 × 3592 | totals surface, table, outlined actions |
| `design/7-Checkout.png` | 2880 × 6140 | fields, labels, grouping, radio states |
| `design/8-Contact.png` | 2880 × 4730 | form geometry, benefits strip |
| `design/9-Blog.png` | 2880 × 7962 | article/sidebar proportions, image radii |

All nine were opened as overview images during planning. Detailed native crops
and font specimens remain execution work. Source PNGs must remain unchanged.
ImageMagick is installed; Python Pillow is not. Use ImageMagick and Python's
standard library for repeatable measurements without adding dependencies.

Planning histogram evidence (crop geometry is width × height + x + y, native px):

| Source crop | Dominant relevant exact fill | Count |
| --- | --- | --- |
| Home `1400x1100+1400+400` | `#FFF3E3`; `#B88E2F` | 997105; 112469 |
| Shop `2880x230+0+800` | `#F9F1E7` | 501216 |
| Cart `900x850+1900+900` | `#F9F1E7` | 583487 |
| Contact `2880x550+0+3100` | `#FAF3EA`; `#242424`; `#898989` | 1462171; 35404; 11492 |

Shop scanline y=1800 has card spans [198,768), [832,1402),
[1466,2036), [2100,2670). Cards are 570 raster px and gaps 64 raster px;
under a 2× interpretation these become 285 and 32 CSS px. The visible grid
spans 2472 raster px / 1236 CSS px, with 198/210 raster px outer gutters.
Do not silently turn the slight asymmetric gutters into an exact centered
measurement. Verify other surfaces before choosing a centered container.

The proposed interpretation is 2 raster px per CSS px, but the export scale
is not metadata-proven. Validate against repeated geometry and rendered font
specimens. Record the evidence and uncertainty explicitly. Typeface identity
is unidentified; do not declare a family based on appearance alone.

## Read installed APIs before writing code

Re-read the installed Next guides inspected during planning:

- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md`
- Read `03-layouts-and-pages.md` in the same directory for the specimen route.
- Inspect the installed font component reference and local-font API before
  wiring font files. Next supports self-hosted fonts and root layout CSS.
- Verify Tailwind's installed theme definitions/compiler behavior for CSS-first
  `@theme`, inline aliases, type metrics, and breakpoint utilities. Do not add
  a Tailwind 3 configuration file or copy unverified skill sample APIs.
- Verify React native prop/ref types from installed `@types/react` if a layout
  component is introduced. Server Components remain the default.

## Scope and expected files

1. Create `docs/design-system.md` as the sole owner of measured values,
   semantic roles, typography, layout, responsive rules, motion, usage,
   reference deltas, and actual verification/review status.
2. Replace starter styling in `app/globals.css` with authoritative reference
   values, semantic CSS variables, Tailwind 4 aliases, base styles, type styles,
   layout utilities, focus treatment, and reduced-motion handling.
3. Update `app/layout.tsx` with the verified font configuration, Compfi metadata,
   and `lang="en-US"`. Remove unused starter font and dark-mode behavior.
4. Add `components/layout/container.tsx` only for the measured shared Container:
   native div props, exported ContainerProps, predictable class merging,
   children composition and stable data-slot. No dependency for class merging
   is needed for simple concatenation; document how overrides are handled.
5. Add a server-rendered `app/design-system/page.tsx` specimen with noindex
   metadata. Cover swatches, type, spacing, surfaces, borders/radii, container
   and responsive grid samples, focusable native controls, and motion samples.
   Small scoped CSS is allowed if needed, using system tokens for values.
6. Replace the bare Home placeholder in `app/page.tsx` with a minimal Compfi
   foundation landing message and link to `/design-system`. This is not phase 4.
7. Add licensed local font files under `public/fonts/` if selected, with source,
   version and license records. Prefer `next/font/local` for reproducible builds.
   Source font assets from their authoritative publisher; do not guess provenance.
8. Create `docs/automation.md` when recording the measurement and screenshot
   procedure; keep detailed commands there and link from the design-system doc.
   Small measurement scripts and compact evidence under `docs/` or `scripts/`
   are allowed only where they make verification reproducible. Avoid duplicate
   raw references or committing large temporary overviews.
9. Update the AGENTS.md index for documents actually created. Record this
   prompt's implementation status truthfully. Do not mark phase 1 complete
   until checks, review and accepted fixes are complete.

## Measurement and implementation sequence

1. Recheck branch/status and capture immutable `BASE_SHA` with `git rev-parse
   HEAD` before any implementation edits. Read approved prompt and skills.
2. Create native-resolution crops across all nine images. Record coordinates,
   repeated landmarks, broad fill histograms and alpha/compositing evidence.
3. Measure the complete palette, typography sizes/weights/line heights/tracking,
   spacing, gutters/max widths, field/control sizes, border widths, radii,
   image proportions, shadows and overlay. Distinguish measured facts from
   inferred values; absence of shadows is a valid finding, not a reason to add them.
4. Inspect metadata for fonts. If absent, compare licensed candidate specimens
   using multiple headings, body strings, numerals and weights at the proposed
   scale. Preserve comparison evidence and confidence. If a family cannot be
   verified, record a deliberate substitute as a reference delta; never report
   the source identity as proven. Do not declare the verified-font exit complete
   while font evidence is unresolved.
5. Compute foreground/background contrast for every intended text/control pair,
   including gold/white, muted text on white/cream, badges, borders and focus.
   Preserve reference fills where possible; create accessible semantic variants
   where required. Record original and chosen values, ratios and permitted uses.
6. Implement tokens once in globals.css. Semantic utilities are purpose named;
   no raw palette values in JSX. Define full type styles, spacing and layout
   scale, role-specific radii/borders/shadows, focus, overlay, duration and easing.
   Component tokens require an actual stable need; avoid speculative layers.
7. Wire typography and Container, then the small specimen and landing link.
8. Verify actual compiled CSS and font loading in the browser, update records,
   commit locally, and run the mandatory independent reviews.

## Visual direction and responsive decisions

Preserve white canvas, cream grouping surfaces, warm gold accents, dark neutral
type, image-led spacious layouts and restrained borders. No invented serif
restyling, gradients, pervasive shadows, decorative motion or dark theme.

Specimen layout: left-aligned heading and brief introduction, then clearly
labeled color/type/layout samples in document order. Wide samples use the same
measured Container; full-width background bands contain their inner content.

At 1440 CSS px validate measured desktop dimensions. Verify 1024, 768, 390
and 320 px explicitly. Choose breakpoints from content pressure; label them
implementation decisions because mobile references do not exist. Reduce sample
grid columns progressively, wrap controls and long token labels, and shrink
gutters without horizontal page overflow. Document future comparison-scroll,
cart-list and mobile-sheet guidance without building those widgets.

## States, accessibility, data and security

- Native specimen controls demonstrate default, hover, focus-visible, active
  and disabled styling. Label any static loading/error/success samples as
  examples; no fake checkout, cart or form submission behavior.
- Document loading, empty, error and success treatment as foundation guidance;
  domain state machines and reusable control APIs belong to later phases.
- Semantic main/section/headings; persistent field labels and accessible names;
  minimum 44 × 44 CSS px targets; visible focus; no color-only state indicators.
- Meet WCAG 2.2 AA text contrast, essential control-boundary contrast and reflow.
  Respect browser font/zoom settings and prefers-reduced-motion. Content stays
  visible when animation is disabled. Do not hand-roll complex primitives.
- Specimen data is static presentation: label, semantic token reference,
  usage and evidence. Avoid maintaining a second palette-value authority in JS.
- All shipped copy says Compfi and uses en-US. Use integer cents and the shared
  Intl convention if a money sample is useful; label it as a specimen price.
- No secrets, environment-file reads, data collection, persistent state,
  authentication, server actions or external runtime services.

## Reference deltas to record

Brand translation to Compfi; accessible foreground/control changes; verified
font choice or explicitly documented substitution; scale and small alignment
normalization; responsive breakpoints and mobile layout; minimum target sizes;
focus/interaction/motion decisions; specimen composition absent from references.
Never present placeholder contact details, warranties or delivery claims as facts.

## Non-goals

No complete page, header/footer, product card, drawer, form library, comparison
table, catalog/cart/checkout state, payment/auth/CMS integration or shadcn
initialization. No dependency upgrades, speculative architecture audit, generated
product imagery, source-PNG modifications, remote push, or unrelated cleanup.

## Acceptance and verification

- All nine references have an auditable measurement record with raster and CSS
  values, crop coordinates, confidence and a justified scale interpretation.
- Every implemented token has a documented role and use; CSS is authoritative;
  measured reference colors and accessible production decisions are distinct.
- Font choice has source/license and metadata or multi-specimen evidence.
- Container, spacing, full type styles, radii, borders, shadows, motion and
  responsive rules render correctly; there is no automatic dark mode.
- `/design-system` and the minimal `/` render with Compfi metadata/copy,
  no console/hydration/font errors, and no unintended client JS requirement.
- Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`; record actual
  outputs. If generated Next types require preparation, run the installed
  supported command/build before repeating TypeScript checking.
- Use `agent-browser` to inspect both routes, keyboard order and focus,
  native control behavior, text zoom/reflow and reduced motion. Capture stable
  screenshots at 1440, 1024, 768, 390 and 320 after fonts settle.
- Compare specimen samples to corresponding native reference crops at the
  validated scale. Report geometry/type/color comparisons; a whole specimen
  page cannot legitimately be pixel-diffed as a finished storefront reference.
- Run `web-design-guidelines` with fresh upstream guidelines against changed UI.
- Inspect every changed file and full diff. No mirroring unit tests for static
  token declarations; use measured contrast/geometry/browser checks instead.
- Update docs before local implementation commit. Load caveman-commit, stage
  only approved files, inspect staged diff, and commit on main.
- Run code-review on immutable `BASE_SHA...HEAD`, using this prompt as Spec,
  AGENTS.md/owning docs as Standards, and the complete smell baseline. Spawn
  isolated Standards and Spec agents in parallel as required. No issue tracker
  setup is necessary for this prompt-originated task under AGENTS.md section 3.4.
- Preserve both reports, verify findings, fix accepted issues, rerun affected
  checks and document fixes before separate local commits. Repeat both reviews
  from the same base after material shared foundation/API/behavior changes.
- Report paths, specimen URL, evidence/check results, review counts per axis,
  commit hashes and unresolved limitations. Never push.

## SKILLS USED

Read each complete skill and its relevant routed references before execution:

- `.agents/skills/frontend-design/SKILL.md`: reference fidelity, typography,
  restrained visual direction and self-critique.
- `.agents/skills/building-components/SKILL.md`: tokens, accessibility,
  Container typing/composition, data attributes and documentation. Read its
  design-tokens, styling, definitions, principles, composition, types,
  data-attributes, accessibility and docs references as applicable; project
  standards override sample dark themes and hand-built complex widgets.
- `.agents/skills/vercel-react-best-practices/SKILL.md`: server-rendered
  foundations and minimal bundle; read relevant rules for actual changes.
- `.agents/skills/agent-browser/SKILL.md`: real browser verification; load the
  installed CLI's `agent-browser skills get core` before browser commands.
- `.agents/skills/web-design-guidelines/SKILL.md`: final UI/accessibility audit;
  fetch its current authoritative guidelines before review.
- `.agents/skills/code-review/SKILL.md`: mandatory parallel Standards and Spec
  reviews after self-verified local commit, evaluation and required re-review.
- `.agents/skills/caveman-commit/SKILL.md`: concise Conventional Commit messages
  for implementation and separate accepted review fixes.
