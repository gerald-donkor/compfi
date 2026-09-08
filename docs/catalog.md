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

| role | path | generated PNG dimensions | final dimensions / format | selection result |
| --- | --- | --- | --- | --- |
| campaign hero | `/images/home/campaign-hero.webp` | 1536 × 1024 | 1536 × 1024 WebP | left-side chair and oak table; broad uncluttered right copy space |
| dining category | `/images/home/dining.webp` | 1254 × 1254 | 1254 × 1254 WebP | dining grouping with oak pedestal table and upholstered chairs |
| living category | `/images/home/living.webp` | 1254 × 1254 | 1254 × 1254 WebP | low linen sofa and oak coffee table in warm daylight |
| bedroom category | `/images/home/bedroom.webp` | 1254 × 1254 | 1254 × 1254 WebP | upholstered bed and oak bedside table in a quiet bedroom |
| Alder Dining Chair | `/images/catalog/alder-dining-chair.webp` | 1122 × 1402 | 1120 × 1400 WebP | complete oak chair silhouette |
| Morrow Dining Table | `/images/catalog/morrow-dining-table.webp` | 1122 × 1402 | 1120 × 1400 WebP | complete pedestal table silhouette |
| Sora Lounge Chair | `/images/catalog/sora-lounge-chair.webp` | 1122 × 1402 | 1120 × 1400 WebP | complete rounded lounge chair silhouette |
| Haven Sectional | `/images/catalog/haven-sectional.webp` | 1122 × 1402 | 1120 × 1400 WebP | complete linen sectional silhouette |
| Atlas Bed | `/images/catalog/atlas-bed.webp` | 1122 × 1402 | 1120 × 1400 WebP | complete upholstered bed silhouette |
| Rowan Nightstand | `/images/catalog/rowan-nightstand.webp` | 1122 × 1402 | 1120 × 1400 WebP | complete oak nightstand silhouette |
| Fenn Storage Bench | `/images/catalog/fenn-storage-bench.webp` | 1122 × 1402 | 1120 × 1400 WebP | complete upholstered bench silhouette |
| Cove Media Console | `/images/catalog/cove-media-console.webp` | 1122 × 1402 | 1120 × 1400 WebP | complete oak media console silhouette |

## Generation prompts

All prompts included the following constraints: no people, text, logo,
watermark, trademark, product labels, or embedded UI.

| asset | final image-generation prompt |
| --- | --- |
| campaign hero | `Use case: photorealistic-natural. Asset type: Compfi home campaign hero, project-local raster asset. Primary request: wide, bright contemporary living room with a quiet upholstered lounge chair, pale oak side table, textured neutral rug, and a leafy plant. Scene/backdrop: softly sunlit, warm off-white architectural interior. Composition/framing: horizontal wide interior photograph; position furnishings on the left half and leave ample clean, low-detail negative space on the right for an HTML campaign panel. Lighting/mood: gentle natural daylight, calm and elevated. Color palette: warm ivory, sand, pale oak, muted leafy green. Materials/textures: honest linen upholstery, pale wood grain, woven rug. Constraints: no people, text, logo, watermark, trademark, product labels, embedded UI, borders, or collage. Keep the right side visibly quiet and copy-safe.` |
| dining | `Use case: photorealistic-natural. Asset type: Compfi home dining category image. Primary request: square composed interior photograph of a welcoming dining nook with a pale oak round table and sculptural upholstered dining chairs. Scene/backdrop: warm neutral contemporary home interior. Composition/framing: square, one clear furniture grouping, complete silhouettes, no close cropping. Lighting/mood: quiet natural daylight. Materials/textures: pale oak, woven upholstery, handmade ceramic. Constraints: no people, text, logo, watermark, trademark, product labels, or embedded UI.` |
| living | `Use case: photorealistic-natural. Asset type: Compfi home living category image. Primary request: square composed interior photograph of a relaxed living room with a low linen sofa, timber coffee table, and a textured rug. Scene/backdrop: warm neutral contemporary home interior. Composition/framing: square, one clear furniture grouping, complete silhouettes, no close cropping. Lighting/mood: quiet natural daylight. Materials/textures: linen, pale oak, woven wool. Constraints: no people, text, logo, watermark, trademark, product labels, or embedded UI.` |
| bedroom | `Use case: photorealistic-natural. Asset type: Compfi home bedroom category image. Primary request: square composed interior photograph of a serene bedroom with a simple upholstered bed, pale oak bedside table, and layered natural bedding. Scene/backdrop: warm neutral contemporary home interior. Composition/framing: square, one clear furniture grouping, complete silhouettes, no close cropping. Lighting/mood: quiet natural daylight. Materials/textures: linen, pale oak, woven textiles. Constraints: no people, text, logo, watermark, trademark, product labels, or embedded UI.` |
| Alder Dining Chair | `Use case: product-mockup. Asset type: Compfi catalog product image. Primary request: individual original Alder dining chair: gently curved pale-oak dining chair with a woven natural-fiber seat. Scene/backdrop: warm off-white minimal studio interior. Composition/framing: portrait 4:5, full complete furniture silhouette, centered with generous breathing room. Lighting/mood: soft controlled natural light with subtle grounding shadow. Materials/textures: pale oak grain and woven natural fiber. Constraints: no people, text, logo, watermark, trademark, product labels, embedded UI, extra furniture, cropped silhouette, or borders.` |
| Morrow Dining Table | `Use case: product-mockup. Asset type: Compfi catalog product image. Primary request: individual original Morrow dining table: compact round pale-oak pedestal dining table. Scene/backdrop: warm off-white minimal studio interior. Composition/framing: portrait 4:5, full complete furniture silhouette, centered with generous breathing room. Lighting/mood: soft controlled natural light with subtle grounding shadow. Materials/textures: pale oak grain. Constraints: no people, text, logo, watermark, trademark, product labels, embedded UI, dining chairs, cropped silhouette, or borders.` |
| Sora Lounge Chair | `Use case: product-mockup. Asset type: Compfi catalog product image. Primary request: individual original Sora lounge chair: low, enveloping warm-oatmeal linen lounge chair with a rounded pale-oak base. Scene/backdrop: warm off-white minimal studio interior. Composition/framing: portrait 4:5, full complete furniture silhouette, centered with generous breathing room. Lighting/mood: soft controlled natural light with subtle grounding shadow. Materials/textures: nubby linen and pale oak. Constraints: no people, text, logo, watermark, trademark, product labels, embedded UI, extra furniture, cropped silhouette, or borders.` |
| Haven Sectional | `Use case: product-mockup. Asset type: Compfi catalog product image. Primary request: individual original Haven sectional: compact three-seat warm-sand linen sectional sofa with a left chaise and low oak feet. Scene/backdrop: warm off-white minimal studio interior. Composition/framing: portrait 4:5, full complete furniture silhouette, centered with generous breathing room. Lighting/mood: soft controlled natural light with subtle grounding shadow. Materials/textures: tailored linen upholstery and pale oak. Constraints: no people, text, logo, watermark, trademark, product labels, embedded UI, extra furniture, cropped silhouette, or borders.` |
| Atlas Bed | `Use case: product-mockup. Asset type: Compfi catalog product image. Primary request: individual original Atlas bed: queen bed in softly textured warm-ivory upholstery with a broad rounded headboard and low pale-oak legs. Scene/backdrop: warm off-white minimal studio interior. Composition/framing: portrait 4:5, full complete furniture silhouette, centered with generous breathing room. Lighting/mood: soft controlled natural light with subtle grounding shadow. Materials/textures: woven upholstery and pale oak. Constraints: no people, text, logo, watermark, trademark, product labels, embedded UI, bedding clutter, extra furniture, cropped silhouette, or borders.` |
| Rowan Nightstand | `Use case: product-mockup. Asset type: Compfi catalog product image. Primary request: individual original Rowan nightstand: small pale-oak bedside table with one flush drawer, an open lower shelf, and softly rounded edges. Scene/backdrop: warm off-white minimal studio interior. Composition/framing: portrait 4:5, full complete furniture silhouette, centered with generous breathing room. Lighting/mood: soft controlled natural light with subtle grounding shadow. Materials/textures: pale oak grain. Constraints: no people, text, logo, watermark, trademark, product labels, embedded UI, extra furniture, cropped silhouette, or borders.` |
| Fenn Storage Bench | `Use case: product-mockup. Asset type: Compfi catalog product image. Primary request: individual original Fenn storage bench: slim warm-oatmeal upholstered bedroom bench with a pale-oak base and subtle concealed storage seam. Scene/backdrop: warm off-white minimal studio interior. Composition/framing: portrait 4:5, full complete furniture silhouette, centered with generous breathing room. Lighting/mood: soft controlled natural light with subtle grounding shadow. Materials/textures: textured linen and pale oak. Constraints: no people, text, logo, watermark, trademark, product labels, embedded UI, extra furniture, cropped silhouette, or borders.` |
| Cove Media Console | `Use case: product-mockup. Asset type: Compfi catalog product image. Primary request: individual original Cove media console: low, long pale-oak media console with soft rounded corners, sliding slatted doors, and slender legs. Scene/backdrop: warm off-white minimal studio interior. Composition/framing: portrait 4:5, full complete furniture silhouette, centered with generous breathing room. Lighting/mood: soft controlled natural light with subtle grounding shadow. Materials/textures: pale oak grain and fine slatted wood. Constraints: no people, text, logo, watermark, trademark, product labels, embedded UI, television, extra furniture, cropped silhouette, or borders.` |

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
