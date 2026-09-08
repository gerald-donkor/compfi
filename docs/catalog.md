# Compfi catalog fixtures and local media

Status: Phase 4 catalog foundation implemented; static fixture data and local
media only.

## Contract

`lib/catalog.ts` is the sole typed source of Compfi catalog display data. It
contains exactly eight immutable `CatalogProduct` records and no inventory,
availability, product-specification, rating, review, warranty, origin, delivery,
or commercial-policy claim. Prices are demonstrative display data, stored as
non-negative, safe integer USD cents. A compare-at amount, when present, is
strictly higher than the current amount. `lib/money.ts` remains the one shared
formatter for customer-facing USD output.

Each product has one local primary `ProductMedia` record. Its alt text describes
the visible furniture rather than repeating the product name, and never begins
with “image of.” Future image components must use the recorded intrinsic
dimensions and the supplied alt text; `focalPosition`, when later needed, is a
presentation hint rather than a product fact.

Lookup boundaries intentionally remain narrow: missing slugs return `undefined`;
category lookup accepts the closed `dining`, `living`, and `bedroom` union.
Records are frozen when the module is initialized so future callers cannot
mutate the shared static source.

## Fixture media

All assets below are original project-local output from the built-in image
generation workflow on 2026-09-07. No design reference pixels, external hosted
asset, or downloaded photography was reused. Generated imagery is not claimed
to be licensed photography. The selected finals were inspected in a contact
sheet, cropped only by one pixel on each product edge to establish an exact 4:5
ratio, and converted from generated PNG source to WebP at quality 82.

| role | path | final dimensions | format | selection result |
| --- | --- | --- | --- | --- |
| campaign hero | `/images/home/campaign-hero.webp` | 1536 × 1024 | WebP | left-side chair and oak table; broad uncluttered right copy space |
| dining category | `/images/home/dining.webp` | 1254 × 1254 | WebP | dining grouping with oak pedestal table and upholstered chairs |
| living category | `/images/home/living.webp` | 1254 × 1254 | WebP | low linen sofa and oak coffee table in warm daylight |
| bedroom category | `/images/home/bedroom.webp` | 1254 × 1254 | WebP | upholstered bed and oak bedside table in a quiet bedroom |
| Alder Dining Chair | `/images/catalog/alder-dining-chair.webp` | 1120 × 1400 | WebP | complete oak chair silhouette |
| Morrow Dining Table | `/images/catalog/morrow-dining-table.webp` | 1120 × 1400 | WebP | complete pedestal table silhouette |
| Sora Lounge Chair | `/images/catalog/sora-lounge-chair.webp` | 1120 × 1400 | WebP | complete rounded lounge chair silhouette |
| Haven Sectional | `/images/catalog/haven-sectional.webp` | 1120 × 1400 | WebP | complete linen sectional silhouette |
| Atlas Bed | `/images/catalog/atlas-bed.webp` | 1120 × 1400 | WebP | complete upholstered bed silhouette |
| Rowan Nightstand | `/images/catalog/rowan-nightstand.webp` | 1120 × 1400 | WebP | complete oak nightstand silhouette |
| Fenn Storage Bench | `/images/catalog/fenn-storage-bench.webp` | 1120 × 1400 | WebP | complete upholstered bench silhouette |
| Cove Media Console | `/images/catalog/cove-media-console.webp` | 1120 × 1400 | WebP | complete oak media console silhouette |

## Generation prompts

All prompts included the following constraints: no people, text, logo,
watermark, trademark, product labels, or embedded UI.

| asset | final generation prompt summary |
| --- | --- |
| campaign hero | `photorealistic-natural`: wide bright contemporary living room, upholstered lounge chair, pale oak side table, neutral rug, leafy plant, with furniture left and ample low-detail copy space right; soft natural daylight. |
| dining | `photorealistic-natural`: square warm-neutral dining interior with a pale oak round table and sculptural upholstered chairs; complete focal grouping and quiet daylight. |
| living | `photorealistic-natural`: square warm-neutral living interior with low linen sofa, timber coffee table, textured rug; complete focal grouping and quiet daylight. |
| bedroom | `photorealistic-natural`: square serene bedroom with upholstered bed, pale oak bedside table, natural bedding; complete focal grouping and quiet daylight. |
| Alder Dining Chair | `product-mockup`: individual curved pale-oak dining chair with woven natural-fiber seat, warm off-white studio, portrait 4:5, complete centered silhouette. |
| Morrow Dining Table | `product-mockup`: individual compact round pale-oak pedestal dining table, warm off-white studio, portrait 4:5, complete centered silhouette. |
| Sora Lounge Chair | `product-mockup`: individual low oatmeal-linen lounge chair with rounded pale-oak base, warm off-white studio, portrait 4:5, complete centered silhouette. |
| Haven Sectional | `product-mockup`: individual warm-sand linen three-seat sectional with left chaise and low oak feet, warm off-white studio, portrait 4:5, complete centered silhouette. |
| Atlas Bed | `product-mockup`: individual warm-ivory upholstered queen bed with broad rounded headboard and pale-oak legs, warm off-white studio, portrait 4:5, complete centered silhouette. |
| Rowan Nightstand | `product-mockup`: individual pale-oak nightstand with one drawer, lower shelf, and rounded edges, warm off-white studio, portrait 4:5, complete centered silhouette. |
| Fenn Storage Bench | `product-mockup`: individual oatmeal upholstered bedroom bench with pale-oak base and subtle storage seam, warm off-white studio, portrait 4:5, complete centered silhouette. |
| Cove Media Console | `product-mockup`: individual low pale-oak media console with rounded corners, slatted sliding doors, and slender legs, warm off-white studio, portrait 4:5, complete centered silhouette. |

## Reference delta

The references establish a quiet natural-light furniture direction and image-led
hierarchy, but their image provenance is unknown. Compfi uses newly generated,
local WebP imagery and coherent USD-cent fixtures instead of copying template
photos, names, mixed-currency values, ratings, reviews, warranty, origin, or
delivery claims. One lead image per product deliberately precedes any future
gallery contract.

## Verification

ImageMagick inspection confirmed all final paths exist, the hero is 3:2, room
images are square, every catalog image is 1120 × 1400 (4:5), all finals are
WebP, and the selected contact sheets showed complete silhouettes with no
opaque unexpected borders. Focused tests cover identity, immutability, lookup,
category, pricing, local-path, ratio, and alt-text boundaries. The task-level
command results were:

| check | result |
| --- | --- |
| `npm run test` | passed: 9 files, 47 tests |
| `npm run lint` | passed |
| `npx tsc --noEmit` | passed |
| `npm run build` | environment-limited: Turbopack could not bind its PostCSS worker port (`Operation not permitted`) |
| `npm run build -- --webpack` | passed; `/` and `/design-system` prerendered as static content |
