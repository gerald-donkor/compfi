# Design and browser verification

Status: current for the phase 1 design-system workflow.

Run commands from the repository root. Temporary crops and screenshots belong
under a fresh OS temporary directory and are not committed.

## Reference inspection

Confirm native dimensions and color space:

```bash
identify design/*.png
```

Create a broad crop without modifying a source reference:

```bash
work_dir="$(mktemp -d /tmp/compfi-measure.XXXXXX)"
magick "design/1-Home.png" -crop 1400x1100+1400+400 +repage \
  "$work_dir/home-hero.png"
```

Count exact flat fills in that crop:

```bash
magick "$work_dir/home-hero.png" -format %c histogram:info:- | sort -nr
```

For overview-only location work, resize into the temporary directory. Do not use
the quantized overview as exact palette evidence.

```bash
magick "design/2-Shop.png" -resize 25% "$work_dir/shop-overview.png"
```

When measuring a scanline, preserve the native coordinate and record the CSS
interpretation separately. A two-raster-pixel run maps to one CSS pixel only
under the documented 2× working interpretation.

## Static checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Inspect emitted styles for the local font faces, semantic tokens, and responsive
rules after the production build. Do not treat a source declaration alone as
proof that it compiled.

## Browser checks

Start the installed Next development server, then use the local browser
automation workflow against `/` and `/design-system`.

Capture stable full-page screenshots after fonts settle at these viewport sizes:

| label | width × height |
| --- | --- |
| desktop | 1440 × 1000 |
| small desktop | 1024 × 900 |
| tablet | 768 × 1024 |
| mobile | 390 × 844 |
| narrow mobile | 320 × 720 |

At every width check for horizontal document overflow, clipped labels, overlap,
and inappropriate line lengths. At 1440 px confirm a 1240 px container. At 1024
and 768 px confirm 32 px gutters; at 390 px confirm 20 px; at 320 px confirm 16 px.

Use keyboard-only navigation to traverse the home link, specimen link, buttons,
search field, and motion sample in DOM order. Confirm the focus ring is visible
and not clipped. Native disabled controls must not receive focus.

At 200% text zoom, repeat the narrow layout check and verify reflow without loss
of content or two-dimensional page scrolling. Emulate `prefers-reduced-motion:
reduce` and verify the motion sample does not translate and smooth scrolling is
disabled. Inspect the console for hydration, font, CSS, and runtime errors.

Compare individual specimen colors, type endpoints, control heights, gutters,
and radii with the corresponding native crops. A whole specimen screenshot is
not a valid pixel diff against any finished storefront page.
