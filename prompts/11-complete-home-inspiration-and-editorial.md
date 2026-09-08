# Complete the Compfi Home inspiration and editorial experience

## Status and authorization boundary

Approved with `y` on 2026-09-08. Implemented from immutable base
`3b8ea03b5b0e0295146048fda8d7b8cfcbbf0382`; initial review and first
re-review findings were resolved, with final re-review pending.

## Goal and why this is next

Complete the remaining lower half of `/` from `design/1-Home.png`: a
room-inspiration carousel followed by the full-bleed editorial/social room
gallery. Add original project-local imagery with a truthful provenance record,
certify and narrowly adapt the existing shadcn/Embla carousel instead of
creating another carousel, and preserve the already reviewed campaign, room,
and featured-product sections.

Phases 1–3 are committed, verified, and reviewed. Phase 4 has a reviewed Home
commerce foundation and completed Shop browsing, but `docs/pages.md` truthfully
marks the Home inspiration carousel and editorial gallery as intentionally
unbuilt. Prompt 08 explicitly deferred these blocks until an editorial-media
contract and interactive-carousel audit could be handled together. Completing
that deferred Home unit is therefore earlier than beginning product detail or
comparison and introduces no dependency on cart, checkout, authentication, a
CMS, or a provider.

## Starting repository evidence

- At preparation time the branch is `main`, `HEAD` is
  `3b8ea03b5b0e0295146048fda8d7b8cfcbbf0382`, and `git status --short` is
  empty. Reconfirm branch and status at execution start. If the branch is not
  `main`, stop and ask for direction. Preserve every unrelated or newly
  user-authored path.
- Capture `BASE_SHA=$(git rev-parse HEAD)` before changing any implementation,
  documentation, asset, test, or prompt file. Keep that value immutable for
  the complete implementation and review workflow.
- `app/page.tsx` is a static Server Component that currently renders the
  reviewed `CampaignHero`, room-category navigation, eight canonical product
  cards, and `BenefitsStrip` inside one `main#main-content`. `SiteHeader` and
  `SiteFooter` remain owned by `app/layout.tsx`.
- `docs/pages.md` records the upper Home implementation and its verified
  reference deltas. `docs/catalog.md` is the existing owner of project-local
  media provenance. `docs/components.md` marks the generated carousel as
  committed but uncertified.
- `components/ui/carousel.tsx` is the existing shadcn carousel built on
  `embla-carousel-react@8.6.0`. The current official shadcn registry diff found
  only the repository's local `react-hooks/set-state-in-effect` suppression,
  so do not overwrite it from upstream. Its local code still needs an honest
  certification pass: public prop contracts are not exported and cleanup
  removes the `select` listener but not the registered `reInit` listener.
- `components.json` and `npx shadcn info --json` confirm a Next.js 16.3.4,
  React Server Components, TypeScript, Tailwind CSS 4, `base-nova`, Base UI,
  Lucide project. The shadcn carousel itself uses Embla rather than Base UI.
  Current CLI docs resolve to the official shadcn Base carousel and Embla
  React API. Inspect those sources again before changing the component.
- Installed Next.js 16.3.4 docs confirm pages/components are server-rendered by
  default; client code should be a narrow leaf; local string image sources
  need explicit intrinsic width and height; responsive images need accurate
  `sizes`; and below-fold images should remain lazy rather than preloaded.
- The lightweight architecture-signal check found repeated presentation review
  in Home CSS but no repeated commerce rule, caller-visible sequencing,
  duplicated adapter, second provider, or test reaching through a meaningful
  module interface. It does not cross the Section 3.5 audit threshold. The
  single-letter workflow forbids an architecture audit for this unit.

Before execution, re-read `AGENTS.md`, this prompt, prompt 08, `CONTEXT.md`,
all owning docs, `design/1-Home.png`, every installed framework/library source
named here, and every skill in `## SKILLS USED` in full.

## Skill discovery and image-generation decision

The lower Home sections require original raster room imagery, while
`.agents/skills/` has no image-generation skill. The durable skill rule was
satisfied during preparation by loading `find-skills` and checking the current
ecosystem. The selected capability is OpenAI's first-party `imagegen` system
skill, already installed at
`/home/dgk/.codex/skills/.system/imagegen/SKILL.md`; its built-in
`image_gen` tool is exposed in this environment, requires no API key, adds no
production dependency, and matches the provenance workflow already used by
`docs/catalog.md`.

Do not install a duplicate project-local copy: zero additional installation is
the minimum safe choice when the first-party system skill and built-in tool are
already available. Re-read its `SKILL.md`, `references/prompting.md`, and
`references/sample-prompts.md` before generation. Use the built-in tool, not
the CLI fallback. If the built-in tool is unavailable or fails, stop image
generation and report that the documented CLI fallback requires explicit user
authorization and a locally configured API key; never switch silently.

The inspected current sources were:

- <https://github.com/openai/skills/tree/main/skills/.system/imagegen>
- <https://skills.sh/> and current ecosystem search results for image
  generation skills
- the installed first-party skill and its bundled prompting references

## Reference evidence and measured interpretation

Open `design/1-Home.png` at its native 2880 × 9670 raster size before any
implementation or asset judgment. Keep raster evidence separate from the
established two-raster-pixels-to-one-CSS-pixel interpretation. Use a fresh
temporary directory and the crop/histogram procedure in `docs/automation.md`.

The preparation pass inspected the whole reference plus a native
`2880×3250+0+5300` lower-page crop. Reproduce and refine these measurements:

| surface | native raster evidence | intended 1440 CSS interpretation |
| --- | --- | --- |
| inspiration band | exact `#FCF8F3` begins at y=5526 and changes back to white at y=6866 | 670 px full-width cream band |
| inspiration lead image | x=1128–1935, y=5614–6777 | 404 × 582 px, 44 px from band top/bottom |
| inspiration next image | x=1984–2727, y=5614–6585 | 372 × 486 px with a 24 px gap |
| following image peek | begins at x=2776 and continues beyond the viewport | 52 px visible preview beginning at x=1388 |
| editorial section | white canvas begins at y=6866; visible mosaic runs continue through about y=8560; footer transition is near y=9040 | about 1087 px from inspiration boundary to footer, with a roughly 721 px irregular mosaic field |
| editorial upper runs | y=7300 contains x=0–155, 188–1089, and 2356–2879 | edge-clipped and full-bleed image columns with 16 px gaps |
| editorial middle runs | y=7600 contains x=0–155, 188–1089, 1122–1711, 1744–2323, and 2356–2879 | five irregular columns with repeated 16 px gaps |
| editorial lower runs | y=8400 contains x=0–369, x=1744–2099, and x=2132–2647 | staggered lower row; do not flatten desktop into equal cards |

Create fresh crops for the complete inspiration band, its copy block, lead
slide/caption, controls/dots, editorial heading, upper/middle/lower mosaic, and
the transition into the footer. Use broad samples for the cream fill and
record any corrected bounds in `docs/design-system.md` and `docs/pages.md`.
Do not sample an antialiased edge as a token or infer motion from the static
image.

The reference direction is quiet, spacious, natural-light furniture editorial:
Poppins, flat cream and white bands, square gold actions, asymmetric imagery,
and no decorative shadow-card treatment. Translate the legacy brand and copy
to Compfi. Do not copy reference pixels, legacy names, lorem ipsum, mixed
currency, social metrics, or unverified claims.

## Content and visual direction

Use concise Compfi copy that describes or navigates without inventing a design
service, a social-media integration, or customer submissions:

- inspiration heading: `Rooms to make your own`;
- inspiration body: `Explore calm layouts, natural materials, and ideas for
  shaping everyday spaces.`;
- inspiration action: `Browse furniture`, linking to `/shop`;
- editorial support: `Share your space with`;
- editorial heading/hashtag: `#CompfiAtHome` as plain visible text, not a dead
  social link and not evidence that Compfi collected customer content;
- slide eyebrow values: `Bedroom`, `Dining`, `Living`, and `Reading corner`;
- slide titles: `Quiet layers`, `Room to gather`, `Softly grounded`, and
  `A place to pause`;
- each slide's single action names its backed destination, such as
  `Browse bedroom`, and links to `/shop?category=bedroom`,
  `/shop?category=dining`, or `/shop?category=living`. The reading-corner slide
  links to `/shop?category=living`.

Keep the campaign hero as the page's primary visual statement. The lower
blocks should feel editorial, not like another grid of product cards. Do not
add uppercase tracking, decorative numbering, auto-rotation, parallax,
gradients, pill controls, testimonials, likes, follower counts, upload/share
buttons, or animation for its own sake.

## Original local editorial asset contract

Generate thirteen distinct, original room photographs: four carousel images
and nine mosaic images. Do not reuse category images, catalog product images,
one generated image in multiple visible slots, reference pixels, downloaded
photography, or remote URLs. Generate one asset per built-in image-generation
call, inspect every result, iterate only on failed invariants, and keep only
selected finals.

All generation prompts use `photorealistic-natural`, identify the output as a
project-bound Compfi Home editorial asset, request quiet contemporary
residential interiors in warm ivory/sand/pale oak with natural daylight and
honest linen/wood/ceramic textures, and include: `no people, text, logo,
watermark, trademark, product label, embedded UI, brand-specific furniture,
social-media chrome, collage, or border`. Avoid uncanny geometry, duplicated
furniture, impossible windows, warped legs, and illegible pseudo-text.

Use these unique scene/composition requirements:

### Carousel assets

1. `quiet-layers`: portrait bedroom, upholstered bed below abstract unlettered
   framed art, low oak nightstand, layered ivory linen; calm eye-level framing.
2. `room-to-gather`: portrait bright dining room, pale-oak table and four
   sculptural upholstered chairs, ceramic centerpiece; open daylight framing.
3. `softly-grounded`: portrait living room, low linen sofa, textured rug, oak
   coffee table and one sculptural chair; balanced architectural framing.
4. `place-to-pause`: portrait reading corner, enveloping neutral lounge chair,
   slim floor lamp, small oak table and quiet shelving with book spines turned
   away or blank; intimate natural-light framing.

Generate at a portrait ratio suitable for the 404:582 lead crop. Preserve each
room's focal subject inside the center-safe crop and record original and final
dimensions.

### Editorial mosaic assets

1. tall open shelving vignette with ceramics and a leafy plant;
2. wide quiet home workspace with a pale-oak desk and unbranded closed laptop;
3. tall compact dining nook under a simple pendant;
4. wide upholstered bedroom with layered neutral bedding;
5. tall sunlit dining corner against textured pale brick;
6. portrait vintage-inspired lounge chair against a plain warm wall;
7. wide pair of small oak tables with ceramics and foliage;
8. narrow framed abstract-art and sculptural-vase vignette with no legible text;
9. wide kitchen shelf vignette with handmade ceramics and hanging utensils.

Vary portrait, landscape, and narrow-tall compositions to support the measured
desktop mosaic. Preserve useful focal areas for responsive cropping. Each
final must be converted non-destructively to WebP with dimensions, quality,
prompt, selection notes, alt text, and generation provenance recorded in
`docs/catalog.md`. Save finals under new descriptive paths in
`public/images/home/editorial/`. Do not overwrite existing assets. Temporary
source/variant files and contact sheets remain outside the repository.

Before accepting an asset, inspect it at useful scale and in a contact sheet.
Verify dimensions, format, no opaque unintended border, no embedded text/logo,
coherent furniture geometry, distinctness from every other final, and a crop
that works in its assigned slot at desktop and narrow widths. Generated imagery
must be described truthfully as original built-in generation output, never as
licensed photography or customer-submitted content.

## Data and module boundaries

Create one small server-safe module, expected as `lib/home-editorial.ts`, that
owns readonly records for the four inspiration slides and nine gallery images.
Use explicit types that contain only stable display/navigation fields:

- stable `id`;
- visible room label/title where applicable;
- local `src`, descriptive `alt`, intrinsic integer `width`/`height`, and an
  optional closed focal-position hint;
- one allowlisted local `href` for each carousel slide;
- gallery placement/shape as a closed semantic slot value rather than raw
  arbitrary CSS supplied by data.

Freeze the arrays and records at module initialization, following the existing
catalog fixture boundary. Do not add prices, products, stock, ratings, social
accounts, upload data, CMS identifiers, remote URLs, HTML, style strings,
mutable state, a provider, fetch layer, route handler, or generic media
repository. This is static Home editorial fixture data, not a new service seam.

Add focused pure tests, expected in `test/home-editorial.test.ts`, for stable
unique IDs, exact item counts, immutability, local paths, safe intrinsic
dimensions, useful non-duplicative alt text, allowlisted local destinations,
closed placement values, and distinct asset paths. Do not test generated image
quality in JSDOM; inspect it and verify file metadata separately.

## Exact implementation scope and expected files

Create or modify only what this unit needs:

- `app/page.tsx`: keep server-owned route orchestration and the single
  `main#main-content`; insert inspiration and editorial blocks after featured
  products. Remove `BenefitsStrip` from Home so the completed route follows
  the supplied Home reference directly into the global footer. This does not
  remove or alter the shared component or its use on Shop/other applicable
  commerce pages.
- `lib/home-editorial.ts`: immutable static editorial records described above.
- `components/home/inspiration-section.tsx`: Server Component/block owning the
  cream band, copy, real `/shop` action, and composition around the carousel
  leaf.
- `components/home/inspiration-carousel.tsx`: the smallest Client Component
  needed for Embla selection state, previous/next/dot actions, current-slide
  status, and reduced-motion-aware navigation. Receive only the four minimal,
  serializable slide records; do not import the whole fixture module into the
  client graph.
- `components/home/editorial-gallery.tsx`: Server Component/block rendering the
  Compfi heading and semantic, full-bleed nine-image mosaic.
- `components/ui/carousel.tsx`: certify and minimally correct the existing
  shadcn primitive. Preserve upstream-compatible composition, export honest
  prop types for its public components, extend/forward native props, keep
  stable kebab-case `data-slot` values, clean up every registered Embla event,
  and make only accessibility/reduced-motion/API changes required by real
  Compfi usage. Do not overwrite the file from the registry.
- `app/globals.css`: add measured reference/component tokens and responsive
  rules for these two blocks. Reuse semantic colors, spacing, typography,
  focus, target-size, duration, and easing tokens. No raw reference values in
  component JSX and no one-off utility overrides of certified component
  colors/typography.
- `public/images/home/editorial/*.webp`: exactly the thirteen selected finals.
- `test/home.test.tsx`: extend route semantics, order, copy, link, image, Home
  `BenefitsStrip` removal, and axe assertions.
- `test/home-editorial.test.ts`: pure fixture/media contract tests.
- `test/inspiration-carousel.test.tsx`: user-observable carousel labels,
  previous/next/dot navigation, selected state, disabled boundaries, status,
  keyboard behavior that JSDOM can honestly represent, event cleanup, and axe.
- `docs/catalog.md`: own generation prompts, exact dimensions/formats,
  provenance, alt text, selection/rejection notes, and asset-contract evidence.
- `docs/components.md`: certify the carousel primitive plus the two Home blocks,
  documenting props, slots, state, keyboard/pointer behavior, responsive image
  behavior, reduced motion, and real Compfi usage.
- `docs/design-system.md`: add only confirmed inspiration/editorial geometry or
  a missing semantic/reference token; do not duplicate component/page detail.
- `docs/pages.md`: replace the partial-Home status with a truthful completed
  Home record, measurements, content choices, responsive decisions, reference
  deltas, screenshots, checks, reviews, commits, and limitations.
- this prompt file: update its status/completion evidence only if required by
  the established workflow.

Do not change the reviewed campaign/room/product implementations except for a
verified integration defect. Do not change shared header/footer, Shop,
catalog products, money, product detail, comparison, cart, checkout, contact,
blog, auth, dependencies, lockfiles, Next config, or unrelated generated
shadcn files. Do not create an ADR, architecture report, service, analytics,
social integration, CMS, upload flow, account behavior, or push.

## Carousel component and interaction contract

- Compose the existing `Carousel`, `CarouselContent`, and `CarouselItem` API.
  Use a product-specific wrapper for captions, dots, and status rather than
  adding Home copy or fixture knowledge to the generic primitive.
- Give the region a visible-associated accessible name such as `Room
  inspiration`. Slides use `role="group"`, carousel roledescription, and
  positional labels like `1 of 4` without making hidden/off-screen content
  falsely unavailable to navigation.
- Do not auto-rotate. Do not add autoplay, timers, pause controls, infinite
  looping, or a plugin. The reference proves controls and pagination, not
  timing.
- Render explicit previous and next buttons with persistent accessible names,
  at least 44 × 44 CSS px targets, visible focus, disabled boundary states,
  and Lucide icons hidden from assistive technology. At the first slide,
  previous may remain visibly disabled while next is enabled; do not remove a
  focused control from the DOM.
- Render four dot buttons with accessible names (`Go to room 1: Quiet layers`),
  a non-color-only current state (`aria-current` plus visible shape/border), and
  44 px hit areas even if the visible dot is smaller.
- Announce a concise selected-slide update in one polite atomic status region.
  Do not announce every pointer movement or duplicate the slide's full copy.
- Arrow-key handling must not steal keystrokes from nested links/buttons or
  duplicate native button activation. Verify the existing capture handler
  against actual focus targets and narrow it or remove it if the dots and
  controls provide the clearer keyboard contract. Document the final behavior.
- Pointer/touch drag may remain through Embla, but every slide must be reachable
  without dragging. Avoid click suppression bugs on slide links after a drag.
- Track the selected snap from the Embla API, subscribe to `select` and
  `reInit`, and unsubscribe from both on cleanup. Derive `canScrollPrev` and
  `canScrollNext`; do not mirror props through effects or keep request-specific
  mutable module state.
- Respect `prefers-reduced-motion`: no autoplay exists, CSS transitions collapse
  under the established rule, and programmatic previous/next/dot navigation
  must use Embla's immediate/jump path when reduction is requested. Content and
  selection feedback remain complete without animation.
- Loading, error, success, and network-empty states do not exist for this
  committed static fixture. Do not fabricate them. An empty slide array should
  be rejected by the component type/contract or render a documented inert
  fallback in focused tests; choose one honest boundary and document it.

## Server/client, React, Next.js, and performance requirements

- Keep `app/page.tsx`, `InspirationSection`, `EditorialGallery`, fixture data,
  and image composition server-rendered. Only the interactive carousel wrapper
  and the existing generic primitive belong in the client graph.
- Pass the minimal readonly slide projection across the server/client boundary.
  Do not serialize gallery data, all Home data, catalog products, functions,
  class instances, or duplicated image records into the client bundle.
- Import modules directly. Keep types/constants used by Server Components out
  of a client module. Do not introduce a barrel, context/provider, state store,
  render prop, boolean-prop collection, component defined inside a component,
  or effect-derived state when an event or render derivation suffices.
- Follow the installed React 19 ref conventions and the local component
  contract rather than adding legacy `forwardRef` reflexively. Extend the
  native element props and merge `className` predictably.
- Use `next/image` for every editorial image with exact intrinsic dimensions,
  deliberate `object-fit`/focal positioning, and accurate `sizes`. All thirteen
  images are below the initial campaign/featured content and remain lazy; none
  gets `preload` or high fetch priority.
- Keep image containers dimensionally stable to prevent layout shift. Ensure
  the full page does not eagerly decode the entire below-fold mosaic before it
  approaches the viewport.
- Do not add JavaScript for the editorial mosaic. Use semantic HTML and CSS
  Grid with named placement classes/data attributes. Add `content-visibility`
  only if browser verification proves it does not break intrinsic sizing,
  focus, screenshots, or accessibility.

## Responsive layout contract

Verify at 1440, 1024, 768, 390, and 320 CSS px. The desktop reference is the
visual source of truth; smaller layouts preserve its hierarchy without
horizontal document overflow.

- **1440 × 1000:** reproduce the 670 px cream band. Place copy in the left
  container zone and begin the lead slide near x=564 at approximately
  404 × 582 px; show the approximately 372 × 486 next slide and a narrow third
  peek with 24 px gaps. Keep the carousel viewport clipped locally, never the
  document. Recreate the editorial heading followed by a full-bleed asymmetric
  mosaic with approximately 16 px gutters and edge-clipped columns.
- **1024 × 900:** retain side-by-side inspiration copy and a dominant/peek
  carousel while the content remains legible; allow controls/captions room and
  prevent the carousel from forcing page overflow. Preserve an asymmetric
  multi-column editorial composition rather than equal cards.
- **768 × 1024:** stack copy above the carousel when side-by-side pressure
  compromises either; show one primary slide plus a meaningful next-slide peek.
  Use a structured three- or four-column editorial grid with varied spans.
- **390 × 844:** stack in source order, present one readable slide with a small
  next peek, place controls/dots where they remain reachable, and use a
  two-column editorial grid with deliberate varied spans. No caption may cover
  essential room detail or leave text clipped.
- **320 × 720:** preserve the 16 px page gutter, allow one-column editorial
  stacking if two columns produce unusably small images, maintain all 44 px
  controls, readable headings, complete captions, and zero document overflow.
- **200% text and 400% reflow:** copy, carousel controls, captions, dots, and
  gallery heading reflow without overlap, loss, or two-dimensional document
  scrolling. The carousel viewport may scroll/clip only as its clearly named
  one-dimensional interaction region.

Do not force the desktop band's fixed height onto stacked tablet/mobile content.
Use tokenized min/ideal dimensions and content-driven height below the relevant
pressure point.

## Accessibility and content requirements

- Preserve one page `h1` in the campaign hero. Add one `h2` for inspiration and
  one `h2` for the editorial gallery in logical source order.
- Use a semantic section for each block and a semantic list/figure grouping for
  the nine gallery items. Keep slide captions in HTML, never embedded in image
  pixels.
- Carousel images use useful concise alternatives that describe the visible
  room without repeating the visible title. Gallery alternatives describe
  each distinct vignette when the image contributes content; use `alt=""`
  only if a documented image is genuinely decorative in context.
- The hashtag is text, not a fake link. Every actual action is a real local
  navigation link or a button that changes carousel state. Do not nest
  interactive elements or make a whole slide overlap its controls.
- All controls and links have visible accessible names, visible unclipped
  `:focus-visible` treatment, non-color-only selected/disabled state, 44 px
  targets, touch manipulation, and sensible source/focus order.
- Hover captions/actions must remain visible or reachable by keyboard and
  touch. Do not make the slide destination hover-only.
- Confirm contrast of cream/gold/gray pairs in a rendered browser. If the
  reference pair fails WCAG 2.2 AA, preserve hierarchy with an accessible
  semantic token and record the reference delta.
- No UI claims that images are customer submissions, that a designer created
  them, or that a social account/integration exists. No uploads, sharing API,
  social navigation, metrics, or consent/data collection are in scope.

## Testing and verification

Use test-driven, behavior-focused coverage. Write each focused failing test,
confirm it fails for the intended missing behavior, implement the smallest
change, and keep tests green. Use accessible queries and awaited `userEvent`;
do not snapshot DOM, assert private hooks/state, mock React, or treat CSS/layout
claims as JSDOM evidence.

1. Add pure editorial fixture tests and focused carousel/Home tests described
   above. Mock only browser APIs JSDOM lacks (`matchMedia`, `ResizeObserver`,
   `IntersectionObserver`) at the narrow boundary necessary for Embla; do not
   mock the carousel component or its public behavior.
2. Verify each carousel slide/dot/control, first/middle/last navigation,
   previous/next disabled states, arrow behavior if retained, polite status,
   reduced-motion jump selection, rerender/reInit behavior, unmount cleanup,
   real destination links, and axe for representative states.
3. Verify Home has one main landmark, existing section hierarchy/content,
   inspiration and editorial headings in order, thirteen unique editorial
   image sources, Compfi-only copy, no legacy brand/currency/social claims, and
   no Home benefits complementary landmark.
4. Use ImageMagick to verify all final paths, WebP format, intrinsic dimensions,
   assigned ratios/crops, and contact-sheet quality. Record the exact built-in
   generation prompts and selected final paths.
5. Run and report exact results for:
   - focused new/affected Vitest files;
   - `npm run test`;
   - `npm run lint`;
   - `npx tsc --noEmit`;
   - `npm run build`.
   If the known restricted-sandbox Turbopack PostCSS worker port failure
   recurs, preserve its exact output and also run
   `npm run build -- --webpack`; never report the first build as passing.
6. Fetch the latest Web Interface Guidelines from the URL required by the
   local skill during execution. Review every in-scope Home/carousel UI and CSS
   file; verify each finding against Compfi's documented standards and resolve
   valid issues before committing.
7. Start the development server and use the installed-version
   `agent-browser skills get core` workflow. Verify mouse/touch-equivalent and
   keyboard navigation, slide links, dots, previous/next, focus persistence,
   refresh, no auto-rotation, reduced motion, 200% text, 400% reflow, all five
   viewport sizes, intrinsic image space, lazy loading, console output, and
   document overflow. If `agent-browser` remains unavailable, record its exact
   failure and use the established `/usr/bin/chromium` CDP/headless fallback
   without adding a dependency; document tested URLs, scripts, font readiness,
   interactions, console, and limitations.
8. Capture stable full-page screenshots plus focused inspiration/editorial
   crops into a fresh `/tmp` directory at all five widths. Compare the 1440
   result to the native reference for geometry, section height, hierarchy,
   type, cream fill, image crop, gaps, caption, controls, dots, mosaic spans,
   whitespace, and footer transition. Evaluate smaller widths against the
   explicit responsive contract because no mobile comps exist.
9. Inspect every changed file, generated asset, full task diff, built client
   boundary, and emitted CSS. Update owning docs with only verification that
   actually ran.

## Commit, mandatory review, and fix workflow

After self-verification and documentation:

1. Load `caveman-commit`, stage only this approved task's paths, inspect the
   staged diff, and create one local implementation commit on `main`. Never
   stage unrelated files and never push.
2. Confirm `BASE_SHA` resolves, `git diff BASE_SHA...HEAD` is non-empty, and
   record `git log BASE_SHA..HEAD --oneline`.
3. Run the local `code-review` skill with two isolated parallel subagents. The
   Standards sources are `AGENTS.md`, `CONTEXT.md`, `docs/catalog.md`,
   `docs/design-system.md`, `docs/components.md`, `docs/pages.md`,
   `docs/automation.md`, and the skill's complete Fowler smell baseline. The
   Spec source is this prompt, with prompt 08 used only for the reviewed upper
   Home constraints it preserves. The prompt is a valid spec; do not invent
   issue content because optional issue-tracker setup is absent.
4. Preserve separate `## Standards` and `## Spec` reports. Verify every finding
   against the diff, prompt, native design, installed APIs, and repository
   rules. Distinguish documented violations from heuristic smells and state
   evidence/disposition rather than blindly applying findings.
5. Fix every accepted blocking/correctness/accessibility/spec issue, then simple
   defects, then only justified refactors. Reject scope creep and speculative
   generality with evidence. Rerun focused and affected full checks, repeat
   browser/image evidence when behavior or presentation changes, update docs,
   and create a separate local review-fix commit with `caveman-commit`.
6. Re-run the complete two-axis review from the original `BASE_SHA` when fixes
   materially affect the carousel public API, shared components, client/server
   data flow, accessibility interaction, or complex layout behavior. Finish
   with no verified blocking finding.
7. Report implementation and review-fix commit SHAs, checks, screenshot/contact
   sheet paths, per-axis finding counts and worst issue within each axis,
   accepted/rejected dispositions, real limitations, and anything still
   requiring a decision. Do not push.

## Reference deltas and non-goals

- Use original generated local imagery instead of unknown-provenance reference
  photography. Do not reproduce reference pixels or externally hosted assets.
- Use Compfi, English (United States), and `#CompfiAtHome`; do not reproduce the
  legacy brand, claim customer submissions, or create a social integration.
- Use backed Shop/category links instead of the reference's unsupported design
  service or vague `Explore more` behavior.
- Add explicit previous navigation, keyboard operation, accessible names,
  status, visible focus, 44 px targets, non-color state, and reduced-motion
  behavior because the static desktop reference cannot prove them.
- Remove the Home `BenefitsStrip` before the global footer because the complete
  Home reference transitions from its editorial gallery to the footer. Keep
  the shared component and its certified commerce-page usage unchanged.
- Responsive stacking/crops are production decisions derived from desktop
  hierarchy. Desktop asymmetry and image-led rhythm remain faithful.
- Product detail, comparison, cart model/drawer contents, checkout, contact,
  blog, Phase 7 broad interaction polish, Phase 8 site-wide QA, authentication,
  CMS, persistence, payments, email, analytics, provider selection, dependency
  changes, architecture audit/refactor, ADRs, and pushing are non-goals.

## Acceptance criteria

- `/` includes the reviewed upper Home plus a faithful 670 px desktop
  inspiration band and a full-bleed asymmetric editorial gallery before the
  global footer, with no Home benefits band and no legacy brand/content.
- Thirteen distinct original WebP assets exist locally, are assigned once,
  pass format/dimension/crop/content inspection, and have complete truthful
  built-in generation provenance and exact prompts in `docs/catalog.md`.
- Static data and gallery markup remain server-owned; the only new client leaf
  is the minimal carousel interaction boundary receiving four serializable
  slide records.
- The existing shadcn/Embla carousel is certified rather than duplicated or
  overwritten. Public props, slots, event cleanup, selected/disabled state,
  previous/next/dots, status, keyboard/pointer behavior, and reduced motion are
  documented and covered at the appropriate test/browser layers.
- Desktop matches the measured reference hierarchy and geometry; 1024, 768,
  390, 320, text zoom, and 400% reflow preserve content, controls, useful crops,
  focus, and zero document overflow.
- All images use `next/image`, intrinsic dimensions, accurate `sizes`, useful or
  deliberately empty alt text, stable layout, and below-fold lazy behavior.
- Focused/full tests, lint, TypeScript, production build (with truthful fallback
  handling), current Web Interface Guidelines review, real-browser flows,
  screenshots, image inspection, and the mandatory two-axis code review have
  completed with no verified blocking issue.
- `docs/pages.md` no longer describes Home as partial; all owning docs record
  exact measurements, contracts, prompts, reference deltas, verification,
  finding dispositions, commits, and limitations without overstating evidence.
- Approved work and valid review fixes are committed locally on `main`, all
  unrelated changes remain untouched, and nothing is pushed.

## Documentation ownership

- `docs/catalog.md` exclusively owns editorial asset records, exact generation
  prompts, provenance, dimensions, alt text, and selection evidence.
- `docs/components.md` exclusively owns generic carousel and Home block public
  contracts, slots, states, accessibility, keyboard, motion, and examples.
- `docs/design-system.md` owns only measured reusable tokens and native/CSS
  geometry evidence.
- `docs/pages.md` owns Home composition, customer copy, responsive behavior,
  route-level reference deltas, screenshots, checks, reviews, commits, and
  completion status.
- No new documentation-index row, domain term, or ADR is expected. Update
  `AGENTS.md` only if a newly received durable rule requires it.

## SKILLS USED

- `find-skills`: document the capability-gap search and validate selection of
  the already installed first-party image-generation capability without a
  duplicate installation.
- `imagegen`: generate, inspect, iterate, select, and place thirteen original
  project-bound raster assets through the built-in tool; preserve exact prompts
  and truthful provenance.
- `frontend-design`: maintain the reference's specific furniture-editorial
  composition, typography, asymmetry, copy restraint, and non-generic visual
  character.
- `building-components`: own carousel/block taxonomy, native prop contracts,
  composition, data attributes, state, tokens, accessibility, and component
  documentation.
- `vercel-composition-patterns`: keep the public API composable, avoid boolean
  prop growth, and place carousel state at the narrow product-specific boundary
  using current React 19 conventions.
- `vercel-react-best-practices`: preserve Server Component defaults, minimize
  serialization/client JavaScript, use direct imports, avoid effect-derived
  state, and verify image/rendering performance.
- `react-testing`: own behavior-first Vitest/RTL coverage, accessible queries,
  awaited user interaction, axe assertions, browser-API mocking boundaries,
  and the JSDOM/real-browser split.
- `shadcn`: inspect project context, official carousel docs/current diff, and
  certify the existing source without overwriting local adaptations.
- `agent-browser`: own real carousel interaction, keyboard/focus, responsive
  screenshots, zoom/reflow, reduced motion, lazy-loading, overflow, and console
  checks using the installed-version workflow or documented Chromium fallback.
- `web-design-guidelines`: fetch the current guideline source during execution
  and audit every changed Home/carousel UI file before completion.
- `code-review`: run the mandatory independent parallel Standards and Spec
  reviews from the immutable base and preserve both axes through fixes/review.
- `caveman-commit`: produce terse Conventional Commit messages for the local
  implementation and any separate review-fix commit without AI attribution.
