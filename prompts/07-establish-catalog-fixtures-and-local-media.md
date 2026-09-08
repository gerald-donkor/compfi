# Establish Compfi catalog fixtures and local media

## Status and authorization boundary

Prepared for approval. This is the first dependency-safe unit of Phase 4. Do
not modify implementation files, generate or add assets, install packages or
skills, stage, commit, or push until this prompt is explicitly approved with
`y` or `Y`.

## Goal and why this is next

Phases 1–3 are committed, verified, and reviewed on `main`; shared chrome now
links to planned catalog destinations but there is no Compfi product domain,
fixture data, or approved local imagery for the image-led Home, Shop, Product,
and Comparison references. Establish that single source of static, explicitly
non-authoritative catalog display data and a local, documented media pack
before composing browse pages. This prevents the next Home and Shop unit from
duplicating product fields, prices, labels, image dimensions, or image-source
decisions.

This task supplies local assets and data only. It deliberately does not create
the `/shop`, `/shop/[slug]`, `/comparison`, cart, checkout, contact, or blog
routes, nor does it turn fixture records into an inventory, pricing, review,
or CMS service.

## Starting repository evidence

- Current branch: `main`; current `HEAD` is
  `0900243207262accc13ee6a14f0c2e26843eec29`; the starting worktree is clean.
  Confirm both again immediately before execution and capture immutable
  `BASE_SHA` with `git rev-parse HEAD` before changing files.
- Phase 3 completion is evidenced by `b93b843` through `0900243`,
  `docs/pages.md`, and `docs/components.md`. Its cart drawer remains an empty
  shell, and its Home page is a foundations placeholder; do not silently
  extend either in this unit.
- `types/commerce.ts` currently contains only `ColorOption` and `SizeOption`.
  `lib/money.ts` and `components/commerce/money.tsx` already establish exact
  integer-cent USD formatting. Reuse that integrity rule; do not add floats or
  a second formatter.
- `components.json` proves an RSC, Tailwind 4, Base UI, Lucide, shadcn/ui
  project. `Card`, `Pagination`, and `Skeleton` exist but are explicitly
  uncertified in `docs/components.md`; this task must not adopt or restyle
  them. No new UI component is needed yet.
- `public/` has only local Poppins fonts and boilerplate SVGs. No approved
  product or lifestyle photography exists. `design/` files are evidence, not
  production media: do not crop, copy, or derive shipped assets from them.
- Installed Next 16 docs confirm that project-local public assets are served
  from `/…` and that `next/image` can later use local static imports to obtain
  intrinsic dimensions and prevent layout shift. Keep every media record’s
  dimensions explicit so a later UI can reserve the measured ratio.

## Reference evidence and media brief

Inspect at native 2880px width before execution:

| reference | observed requirement for this unit | catalog/media interpretation |
| --- | --- | --- |
| `design/1-Home.png` | a wide, calm room hero; three room-category images; eight 4-column product cards | create one wide lifestyle hero, three square room images, and eight catalog product images with warm, quiet furniture photography; Home composition is deferred |
| `design/2-Shop.png` | repeated four-column cards use a tall image field above a `#F4F5F7` information surface | each catalog product media record uses a consistent 4:5 portrait source ratio; card composition and filtering are deferred |
| `design/3-Single Product.png` | product detail needs a dominant product image plus multiple gallery views | supply one lead product image per catalog fixture now; do not invent product specifications or galleries until the detail block defines its true data needs |
| `design/5-Product Comparison.png` | comparison presents named furniture choices and images, but reference ratings, warranty, origin, and load facts are unsupported | fixtures can identify comparable products and categories; do not create ratings, warranties, stock, dimensions, origin, or other business-fact fields |

The documented working scale remains two raster pixels to one CSS pixel.
This unit records source image dimensions, not page geometry. The future Home
hero will require copy-safe negative space on the right because the reference
places the campaign panel there; no text, logo, watermark, trademark, price,
or UI may appear inside generated media.

## Exact scope and expected files

Create or modify only the files necessary for this production foundation:

- `types/commerce.ts`: add small, exported, server-safe catalog types without
  moving existing variant types into a client module. Use a `CatalogProduct`
  record, a closed `ProductCategory` union, `ProductMedia` with path, alt
  text, width, height, and optional focal position, and an optional
  presentation-only badge union. Make money values integer `priceCents` and
  optional `compareAtPriceCents`.
- `lib/catalog.ts`: one read-only, typed fixture collection of exactly eight
  distinct Compfi furniture products; derive and export narrow lookup helpers
  (`getCatalogProductBySlug`, `getCatalogProductsByCategory`) only if their
  actual callers/tests need them. Keep records immutable. Use unique stable
  lowercase kebab-case IDs/slugs, USD whole-cent prices that are coherent but
  expressly demonstrative, concise non-claiming descriptions, three room
  categories (`dining`, `living`, `bedroom`), and no status or factual sales
  claims. A discount badge requires a lower `priceCents` than its
  `compareAtPriceCents`; a new badge is presentation-only and must have a
  visible future text label.
- `public/images/catalog/`: eight final project-local product images, one per
  fixture, in a consistent 4:5 portrait ratio; use collision-free kebab-case
  names matching their product slugs. Optimize final files to a practical WebP
  or AVIF format after visual inspection, while retaining documented intrinsic
  dimensions. Do not overwrite existing assets.
- `public/images/home/`: one wide hero image and three square room-category
  images (`dining`, `living`, `bedroom`), named by role. Optimize them after
  selection. These files are input for a later Home block, not an authorization
  to edit `app/page.tsx` now.
- `docs/catalog.md`: own fixture/data contract and media provenance. State
  that the catalog is static display data, prices are integer USD cents and not
  commercial facts, image alt-text policy, source paths/intrinsic dimensions,
  each final image-generation prompt, selection/optimization results, and the
  fact that no reference image or external hosted asset was reused.
- `CONTEXT.md`: create the minimal canonical glossary now that `Catalog
  Product`, `Product Category`, `Product Media`, and `Display Price` are
  unambiguous. Keep it a glossary—not an implementation guide or ADR.
- `AGENTS.md`: add truthful `CONTEXT.md` and `docs/catalog.md` rows to the
  documentation index when, and only when, the files exist in the same change.
- focused tests such as `test/catalog.test.ts`: test public lookup boundaries,
  frozen/unique IDs and slugs, safe-integer cent values, valid discount
  ordering, known local media paths/dimensions/ratios, and no duplicate or
  unsupported categories. Do not snapshot raw records or test internal array
  layout.

Do not modify page routes, shared chrome, UI primitives, `next.config.ts`,
dependencies, generated shadcn components, reference PNGs, or unrelated
files. Do not create a provider, API route, database, cart state, search,
filter, ratings, reviews, stock, product dimensions, policies, product
specifications, or checkout contract.

## Data and asset contract

- A **Catalog Product** is a curated static display record, not an offer or an
  inventory item. It has one unique product identity, one primary category,
  one main media record, one current display price, optional compare-at display
  price, optional visual badge, and short descriptive copy.
- A **Display Price** is a non-negative safe integer number of USD cents. A
  `compareAtPriceCents` is present only when strictly greater than
  `priceCents`. Validate these invariants in development/helper construction
  rather than relying on a later card to discover corrupt data.
- A **Product Media** record points only to a checked-in `/images/...` path,
  has non-empty product-specific alt text that describes the visible furniture
  (not `image of`), and exposes positive intrinsic width and height. Its focal
  position is optional and only guides a future `object-position`; it is not
  a visual behavior prop.
- Do not place product records in a client module or serialize them into a
  global provider. Future server pages import the data directly; future
  interactive leaves receive only the records they render.

## Image-generation procedure

Use the built-in `image_gen` tool, not its CLI fallback. Generate each distinct
asset with a separate request, inspect every result, retain only the selected
final asset in this project, and report the final prompt and path in
`docs/catalog.md`. The supplied design files are visual references only; do
not pass them as edit targets or reuse them as production pixels.

Use structured prompts equivalent to the following constraints. Adapt only
the furniture subject and room category per file; do not add text or brands.

1. **Hero (`photorealistic-natural`)**: a wide, bright, lived-in contemporary
   living room with a quiet upholstered lounge chair, pale oak side table,
   textured neutral rug, and a plant; soft daylight; natural material detail;
   composition leaves ample clean, low-detail negative space on the right for
   an HTML campaign panel; no people, no text, no logo, no watermark, no
   trademark, no product labels, no embedded UI.
2. **Room categories (`photorealistic-natural`)**: one each for dining, living,
   and bedroom; square, composed interior photograph; restrained warm neutral
   palette; real wood/fabric texture; one clear focal furniture grouping; no
   people, text, logo, watermark, trademark, product labels, or embedded UI.
3. **Product images (`product-mockup`)**: individual original furniture
   product—using the fixture’s name/description only as an internal subject
   cue—on a warm off-white studio or minimally styled room backdrop; portrait
   4:5 composition; clearly legible complete silhouette, realistic wood and
   upholstery texture, soft controlled shadows, centered or subtly anchored;
   no people, text, logo, watermark, trademark, product labels, or embedded
   UI. Maintain a coherent natural-light visual language across the set.

If a generated result violates an invariant (incorrect ratio, incomplete
silhouette, visible text/mark, implausible furniture, insufficient hero copy
space, or inconsistent scene), iterate with one targeted correction. Preserve
only selected final files under `public/`; default tool outputs outside the
project are not production deliverables. Capture the original generated
dimensions, final optimized dimensions/file format, and path in the catalog
documentation. Do not assert that generated assets are licensed photography;
truthfully describe their built-in generation provenance instead.

## States, accessibility, performance, and security

There is no customer-facing interactive state in this unit. Its failure and
empty behavior is developer-facing: a missing slug lookup returns `undefined`
without throwing; a catalog invariant violation throws a clear development
error; an absent local media file fails the focused test before a future route
can ship a broken image. No loading, success, checkout, purchase, or stock
state may be implied.

Alt text is part of the fixture contract and must not duplicate the product
name alone or include `image of`. Future layout components will use these
records with `next/image`, correct `sizes`, and no layout shift; this unit
provides the dimensions they need. Do not add remote patterns, network fetches,
environment variables, analytics, image CDN configuration, personally
identifiable information, or user-controlled asset paths.

## Reference deltas

- Compfi uses original generated local imagery rather than copying the
  references’ unknown-source furniture photography. This preserves the desired
  quiet, natural, image-led hierarchy without shipping unlicensed or hotlinked
  media.
- Fixture names, descriptions, and USD-cent price values replace the reference
  template names, lorem text, mixed currencies, ratings, reviews, warranties,
  origin, and delivery claims. They are coherent presentation data, never
  claims about Compfi’s commercial offering.
- One lead image per product is intentionally narrower than the reference
  detail gallery. Gallery images are deferred until the product-detail block
  establishes real selection and thumbnail behavior.

## Implementation sequence

1. Re-read `AGENTS.md`, this approved prompt, `docs/design-system.md`,
   `docs/components.md`, `docs/pages.md`, `docs/automation.md`, all four cited
   references, the installed Next Image/public-folder docs, and every skill
   named below. Confirm clean `main`, capture `BASE_SHA`, and do not alter
   pre-existing files outside this prompt.
2. Use `domain-modeling` to write only the resolved glossary vocabulary;
   inspect existing money and commerce types. Design the minimal static
   catalog types and invariant boundary before records or images.
3. Generate, inspect, select, and optimize the 12 original local assets using
   the documented built-in image workflow. Verify each final path and intrinsic
   dimensions; document exact generation prompts and provenance.
4. Implement the static catalog module and its focused invariant/lookup tests.
   Keep the module server-safe and direct-importable; do not add a provider or
   new UI.
5. Update documentation index, `CONTEXT.md`, and `docs/catalog.md`; inspect
   every changed file and the entire diff. Run the required checks, then stage
   only this scope, create a local commit using `caveman-commit`, and run the
   required two-axis review from `BASE_SHA`.
6. Evaluate Standards and Spec findings separately against the approved prompt,
   actual diff, and installed behavior. Apply verified fixes with tests/docs in
   a separate local commit; re-run the full review from the original base when
   a fix materially changes public data APIs, validation, or media contracts.
   Never push.

## Acceptance and verification

- Exactly eight distinct, typed Compfi catalog fixtures exist; every `id` and
  `slug` is unique and every monetary field is a non-negative safe integer.
- Every optional compare-at price is strictly higher than the current price;
  no fixture carries invented rating, stock, warranty, origin, dimensions,
  delivery, or review data.
- Every media path resolves to a checked-in local optimized file, its metadata
  dimensions are positive and match the asset, product images share the
  documented 4:5 ratio, room images are square, and the hero has a documented
  wide ratio and right-side copy-safe composition.
- `CONTEXT.md` contains only concise domain vocabulary, and `docs/catalog.md`
  is the sole owner of fixture/media provenance and contract detail.
- No customer-facing route changes, remote image patterns, dependencies,
  services, or unapproved claims appear in the diff.
- Run and report actual output for:

  ```bash
  npm run test
  npm run lint
  npx tsc --noEmit
  npm run build
  ```

- If restricted-sandbox Turbopack again cannot bind its internal worker port,
  record the exact failure and run `npm run build -- --webpack` as the existing
  documented fallback; do not call the failed default build a pass.
- Use ImageMagick or equivalent read-only inspection to validate each asset’s
  format, native dimensions, ratio, and absence of opaque unexpected borders.
  Open a generated contact sheet only for asset-quality inspection; it is not
  a substitute for a browser page screenshot because no route is added here.
- Run the required `code-review` after the implementation commit with
  `BASE_SHA...HEAD`, preserving separate `## Standards` and `## Spec` reports;
  report counts and the worst issue within each axis without pushing.

## SKILLS USED

- `imagegen`: generate, inspect, iterate, select, and place project-bound
  original raster media using the built-in image tool and documented prompts.
- `domain-modeling`: establish the minimal Compfi catalog vocabulary in
  `CONTEXT.md` without turning it into an implementation specification.
- `frontend-design`: maintain the measured quiet, image-led furniture visual
  direction while avoiding copied template imagery or generic brand marks.
- `building-components`: keep the catalog data boundary explicit, semantic,
  documented, and accessible through its future media/alt-text contract.
- `vercel-react-best-practices`: retain server-safe direct imports and avoid a
  client provider, broad barrel, shared mutable state, or unnecessary
  serialization.
- `react-testing`: write focused invariant and lookup tests without brittle
  snapshots or implementation-only assertions.
- `caveman-commit`: produce terse Conventional Commit messages for the
  implementation and any review fix.
- `code-review`: run the mandatory parallel Standards and Spec review from the
  immutable base after the local implementation commit.
