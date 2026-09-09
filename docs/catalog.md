# Compfi catalog fixtures and local media

Status: Phase 4 catalog, Home editorial, and product-detail media implemented;
static fixture data and local media only.

## Contract

`lib/catalog.ts` is the sole typed source of Compfi catalog display data. It
contains exactly eight immutable `CatalogProduct` records and no inventory,
availability, product-specification, rating, review, warranty, origin, delivery,
or commercial-policy claim. Prices are demonstrative display data, stored as
non-negative, safe integer USD cents. A compare-at amount, when present, is
strictly higher than the current amount. `lib/money.ts` remains the one shared
formatter for customer-facing USD output.

Each product has one local primary `ProductMedia` record plus a frozen gallery
of exactly three unique local WebPs: that same lead, one three-quarter view, and
one material/form detail. Every record has positive safe intrinsic dimensions
and useful, unique alt text that never begins with “image of.” Product detail
copy and optional size/finish choices are demonstrative catalog presentation,
not inventory. Option values are unique and each configured default belongs to
its option set.

Lookup boundaries intentionally remain narrow: missing slugs return `undefined`;
category lookup accepts the closed `dining`, `living`, and `bedroom` union.
Records are frozen when the module is initialized so future callers cannot
mutate the shared static source. Related-product lookup excludes the current
item, prefers the same category in canonical order, fills from remaining
canonical products, clamps invalid limits to zero, and returns a frozen result.

## Product-detail gallery media

The 16 gallery additions were generated with the built-in first-party image
tool on 2026-09-09. Each 1120×1400 lead WebP was passed only as a reference for
identity, material, palette, and studio direction; no lead was edited or
overwritten. Selected outputs were inspected individually and together in
`/tmp/compfi-product-detail-contact-sheet.webp`, then converted
non-destructively to 1536×1024 WebP at quality 84. All passed inspection for a
recognizable silhouette, coherent geometry, one product, truthful established
materials, useful responsive crop, and absence of text, logos, borders, or
extra furniture.

Every generation used the following exact scaffold, with the `Primary request`
and `Composition/framing` values substituted from the table below:

```text
Use case: product-mockup
Asset type: project-bound Compfi product-detail gallery image
Input images: Image 1: reference image for the existing product's identity, materials, palette, and studio direction; do not modify or overwrite Image 1
Primary request: an original alternate product photograph of <product clause>
Scene/backdrop: warm off-white minimal studio interior consistent with Image 1
Subject: the same recognizable furniture design as Image 1, with matching silhouette, proportions, materials, and color
Style/medium: premium photorealistic product photography
Composition/framing: landscape 3:2, <view clause>, useful center-safe crop for a 605:348 frame
Lighting/mood: soft controlled natural light with a subtle grounding shadow, consistent with Image 1
Materials/textures: only the wood, upholstery, or woven materials already visible and described in the fixture
Constraints: preserve product identity; one product only; no people, text, logo, watermark, trademark, product label, embedded UI, extra furniture, collage, border, or cropped essential silhouette
Avoid: redesigned product, changed material or color, duplicated parts, warped legs, impossible joins, illegible pseudo-text
```

The exact three-quarter view clause was `front three-quarter view showing the
complete product and its depth with generous breathing room`. The exact detail
view clause was `closer side/detail view emphasizing one truthful defining form
or material transition while keeping enough of the product visible to identify
it`.

| product / 1120×1400 reference | exact product clause | generated 1536×1024 PNG source: three-quarter / detail | selected 1536×1024 finals |
| --- | --- | --- | --- |
| Alder Dining Chair (`/images/catalog/alder-dining-chair.webp`) | `Alder Dining Chair: A curved oak dining chair with a woven natural-fiber seat.` | `exec-11b4fef8-fc30-43ec-a915-ad7ea3576143.png` / `exec-39b295e5-af6e-4f87-a689-f10c823f324d.png` | `/images/catalog/detail/alder-dining-chair-three-quarter.webp`; `/images/catalog/detail/alder-dining-chair-detail.webp` |
| Morrow Dining Table (`/images/catalog/morrow-dining-table.webp`) | `Morrow Dining Table: A compact round oak pedestal table for easy gatherings.` | `exec-d62ab86b-5f66-4485-bca0-f14fe0addd75.png` / `exec-b09d0d79-56e9-463c-bc00-8392feb83d37.png` | `/images/catalog/detail/morrow-dining-table-three-quarter.webp`; `/images/catalog/detail/morrow-dining-table-detail.webp` |
| Sora Lounge Chair (`/images/catalog/sora-lounge-chair.webp`) | `Sora Lounge Chair: An enveloping linen lounge chair grounded by an oak base.` | `exec-cc3c123e-8a8c-4612-8262-8a126a1e8195.png` / `exec-545bf6ae-65c9-4011-995e-9f26433cf891.png` | `/images/catalog/detail/sora-lounge-chair-three-quarter.webp`; `/images/catalog/detail/sora-lounge-chair-detail.webp` |
| Haven Sectional (`/images/catalog/haven-sectional.webp`) | `Haven Sectional: A warm-sand linen sectional with a relaxed left chaise.` | `exec-ca1f33ba-a935-4f9b-8767-fdd267b6e550.png` / `exec-82c28c8c-59d5-475b-b176-3fe4ee1d142d.png` | `/images/catalog/detail/haven-sectional-three-quarter.webp`; `/images/catalog/detail/haven-sectional-detail.webp` |
| Atlas Bed (`/images/catalog/atlas-bed.webp`) | `Atlas Bed: A softly upholstered bed with a broad rounded headboard.` | `exec-49981ad6-0189-4f9c-8821-9e7a56dbf84b.png` / `exec-7fa64862-4179-4825-a13c-6a887f186ecb.png` | `/images/catalog/detail/atlas-bed-three-quarter.webp`; `/images/catalog/detail/atlas-bed-detail.webp` |
| Rowan Nightstand (`/images/catalog/rowan-nightstand.webp`) | `Rowan Nightstand: A pale oak bedside table with one drawer and an open shelf.` | `exec-9a3e1cdb-d71b-4865-9057-b333a11db916.png` / `exec-53ebf90d-dce1-4925-bbd6-ebd9a2e8ebc9.png` | `/images/catalog/detail/rowan-nightstand-three-quarter.webp`; `/images/catalog/detail/rowan-nightstand-detail.webp` |
| Fenn Storage Bench (`/images/catalog/fenn-storage-bench.webp`) | `Fenn Storage Bench: An upholstered bedroom bench with discreet storage.` | `exec-11697d49-df61-4825-8a78-f255b17a37c5.png` / `exec-648de572-9b2f-47b4-b9c3-7f9dd6b145d0.png` | `/images/catalog/detail/fenn-storage-bench-three-quarter.webp`; `/images/catalog/detail/fenn-storage-bench-detail.webp` |
| Cove Media Console (`/images/catalog/cove-media-console.webp`) | `Cove Media Console: A low oak console with rounded slatted doors.` | `exec-cd02ed01-fb19-430f-9302-393dacc1ea37.png` / `exec-3c665e26-de93-4ad8-81e5-88cbfe6bb5d8.png` | `/images/catalog/detail/cove-media-console-three-quarter.webp`; `/images/catalog/detail/cove-media-console-detail.webp` |

Generated originals remain outside the shipped tree under
`/home/dgk/.codex/generated_images/01a085d2-b675-7d10-bc74-a4b3a100887d/`.
The generated filenames above identify the corresponding sources in that
directory; the project contract depends only on the selected public WebPs.

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

## Home editorial media

Thirteen originals were generated with the built-in first-party image tool on
2026-09-08, inspected individually and in
`/tmp/compfi-home11.bwIsT7/mosaic-contact.png`, then converted
non-destructively to WebP quality 84. They are editorial imagery, not licensed
photography, customer submissions, or evidence of a social account.

Every exact prompt used `photorealistic-natural`, identified a project-bound
Compfi Home asset, requested warm ivory/sand/pale oak, natural daylight, and
honest linen/wood/ceramic textures, and included: `no people, text, logo,
watermark, trademark, product label, embedded UI, brand-specific furniture,
social-media chrome, collage, or border`. Each also excluded uncanny geometry,
duplicated furniture, impossible windows, warped legs, and pseudo-text. The
exact unique request/composition clauses and selected finals are:

| final path | source/final | exact unique clause | selected alt text |
| --- | --- | --- | --- |
| `/images/home/editorial/quiet-layers.webp` | 1045×1506 PNG/WebP | portrait bedroom; upholstered bed below abstract unlettered art, low oak nightstand, layered ivory linen; calm eye-level, center-safe | Ivory bed layered with linen beside a pale oak nightstand |
| `/images/home/editorial/room-to-gather.webp` | 1045×1506 PNG/WebP | portrait bright dining room; pale-oak table, exactly four sculptural upholstered chairs, ceramic centerpiece; open, center-safe | Round oak dining table surrounded by four upholstered chairs |
| `/images/home/editorial/softly-grounded.webp` | 1045×1506 PNG/WebP | portrait living room; low linen sofa, textured rug, oak table, one sculptural chair; balanced, center-safe | Low linen sofa and curved chair on a deeply textured rug |
| `/images/home/editorial/place-to-pause.webp` | 1045×1506 PNG/WebP | portrait reading corner; enveloping chair, slim floor lamp, small oak table, blank-spine shelving; intimate, center-safe | Enveloping lounge chair beside a floor lamp and quiet shelving |
| `/images/home/editorial/open-shelving.webp` | 1024×1536 PNG/WebP | narrow portrait open shelving with ceramics and one leafy plant; center-safe | Open oak shelving arranged with ceramics and trailing greenery |
| `/images/home/editorial/quiet-workspace.webp` | 1536×1024 PNG/WebP | landscape quiet workspace with pale-oak desk and unbranded closed laptop; balanced center crop | Pale oak desk set against a calm, light-filled living space |
| `/images/home/editorial/dining-nook.webp` | 1024×1536 PNG/WebP | portrait compact dining nook under one simple pendant; intimate, center-safe | Compact round dining nook beneath a sculptural pendant |
| `/images/home/editorial/upholstered-bedroom.webp` | 1536×1024 PNG/WebP | landscape upholstered bedroom with layered neutral bedding; useful center crop | Upholstered bed dressed in layered sand and ivory textiles |
| `/images/home/editorial/sunlit-dining-corner.webp` | 1024×1536 PNG/WebP | tall portrait dining corner against textured pale brick; daylight across brick | Sunlit oak dining corner against softly textured brick |
| `/images/home/editorial/vintage-lounge-chair.webp` | 1024×1536 PNG/WebP | portrait vintage-inspired neutral chair against plain warm wall; full silhouette | Vintage-inspired lounge chair against a warm plaster wall |
| `/images/home/editorial/oak-tables.webp` | 1536×1024 PNG/WebP | landscape pair of pale-oak tables with ceramics and foliage; both fully visible | Pair of low oak tables styled with ceramics and leafy branches |
| `/images/home/editorial/art-vase.webp` | 941×1672 PNG/WebP | narrow tall abstract-art and sculptural-vase vignette; no legible text | Abstract framed artwork above a sculptural ceramic vase |
| `/images/home/editorial/kitchen-shelf.webp` | 1536×1024 PNG/WebP | landscape kitchen shelf with ceramics and hanging unbranded utensils | Kitchen shelf with handmade ceramics and hanging utensils |

No output required regeneration: all selected finals were distinct,
border-free, text/logo-free at inspection scale, geometrically coherent, and
retained useful focal areas for their assigned responsive crops.

### Exact Home editorial generation prompts

The four carousel calls used these complete prompts (one call per block):

```text
Use case: photorealistic-natural
Asset type: project-bound Compfi Home inspiration carousel image
Primary request: an original quiet contemporary residential bedroom in warm ivory, sand, and pale oak
Scene/backdrop: upholstered bed below abstract unlettered framed art, low oak nightstand, layered ivory linen
Style/medium: photorealistic natural-light interior editorial photography
Composition/framing: portrait 404:582 ratio, calm eye-level framing, bed and nightstand center-safe for responsive cropping
Lighting/mood: soft natural daylight, calm and spacious
Materials/textures: honest linen, pale oak, ceramic
Constraints: no people, text, logo, watermark, trademark, product label, embedded UI, brand-specific furniture, social-media chrome, collage, or border
Avoid: uncanny geometry, duplicated furniture, impossible windows, warped legs, illegible pseudo-text
```

```text
Use case: photorealistic-natural
Asset type: project-bound Compfi Home inspiration carousel image
Primary request: an original bright contemporary dining room in warm ivory, sand, and pale oak
Scene/backdrop: pale-oak dining table and exactly four sculptural upholstered chairs with a simple ceramic centerpiece
Style/medium: photorealistic natural-light interior editorial photography
Composition/framing: portrait 404:582 ratio, open daylight framing, table and chairs center-safe for responsive cropping
Lighting/mood: clear soft natural daylight, welcoming and quiet
Materials/textures: pale oak, woven upholstery, handmade ceramic
Constraints: no people, text, logo, watermark, trademark, product label, embedded UI, brand-specific furniture, social-media chrome, collage, or border
Avoid: uncanny geometry, duplicated chairs, extra chairs, impossible windows, warped legs, illegible pseudo-text
```

```text
Use case: photorealistic-natural
Asset type: project-bound Compfi Home inspiration carousel image
Primary request: an original quiet contemporary living room in warm ivory, sand, and pale oak
Scene/backdrop: low linen sofa, textured rug, oak coffee table, and one sculptural lounge chair
Style/medium: photorealistic natural-light interior editorial photography
Composition/framing: portrait 404:582 ratio, balanced architectural framing, sofa group center-safe for responsive cropping
Lighting/mood: diffused natural daylight, softly grounded and restful
Materials/textures: honest linen, wool-like textured rug, pale oak, ceramic
Constraints: no people, text, logo, watermark, trademark, product label, embedded UI, brand-specific furniture, social-media chrome, collage, or border
Avoid: uncanny geometry, duplicated furniture, impossible windows, warped legs, illegible pseudo-text
```

```text
Use case: photorealistic-natural
Asset type: project-bound Compfi Home inspiration carousel image
Primary request: an original intimate contemporary reading corner in warm ivory, sand, and pale oak
Scene/backdrop: enveloping neutral lounge chair, slim floor lamp, small oak table, quiet shelving with book spines turned away or blank
Style/medium: photorealistic natural-light interior editorial photography
Composition/framing: portrait 404:582 ratio, intimate eye-level framing, chair and lamp center-safe for responsive cropping
Lighting/mood: gentle natural daylight, contemplative and calm
Materials/textures: woven upholstery, pale oak, matte ceramic
Constraints: no people, text, logo, watermark, trademark, product label, embedded UI, brand-specific furniture, social-media chrome, collage, or border
Avoid: uncanny geometry, duplicated furniture, impossible windows, warped legs, readable or pseudo-text
```

Each of the nine mosaic calls used this exact common prefix, followed without
other text by its exact suffix in the table below:

```text
Use case: photorealistic-natural
Asset type: project-bound Compfi Home editorial mosaic image
Style/medium: original photorealistic natural-light interior editorial photography
Color palette: warm ivory, sand, pale oak
Lighting/mood: soft natural daylight, quiet contemporary residential interior
Materials/textures: honest linen, wood, and ceramic
Constraints: no people, text, logo, watermark, trademark, product label, embedded UI, brand-specific furniture, social-media chrome, collage, or border
Avoid: uncanny geometry, duplicated furniture, impossible windows, warped legs, illegible pseudo-text
```

| asset | exact appended suffix |
| --- | --- |
| open shelving | `Primary request: tall open shelving vignette with handmade ceramics and one leafy plant`<br>`Composition/framing: narrow portrait, shelving remains useful in center crop` |
| quiet workspace | `Primary request: wide quiet home workspace with a pale-oak desk and an unbranded closed laptop`<br>`Composition/framing: landscape, desk scene balanced across the frame with useful center crop` |
| dining nook | `Primary request: tall compact dining nook under one simple pendant`<br>`Composition/framing: portrait, intimate dining arrangement center-safe` |
| upholstered bedroom | `Primary request: wide upholstered bedroom with layered neutral bedding`<br>`Composition/framing: landscape, bed and textiles across the frame with useful center crop` |
| sunlit dining corner | `Primary request: tall sunlit dining corner against textured pale brick`<br>`Composition/framing: tall portrait, table corner and chairs centered with daylight across brick` |
| vintage lounge chair | `Primary request: vintage-inspired neutral lounge chair against a plain warm wall`<br>`Composition/framing: portrait, full chair silhouette with breathing room and no cropped legs` |
| oak tables | `Primary request: pair of small pale-oak tables with handmade ceramics and foliage`<br>`Composition/framing: wide landscape still life, both tables fully visible` |
| art and vase | `Primary request: framed abstract-art and sculptural-vase vignette with no legible text`<br>`Composition/framing: narrow tall portrait, art and vase aligned vertically` |
| kitchen shelf | `Primary request: kitchen shelf vignette with handmade ceramics and hanging unbranded utensils`<br>`Composition/framing: wide landscape, shelf and utensils arranged clearly with no labels` |
