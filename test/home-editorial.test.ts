import { existsSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

import { editorialImages, editorialPlacements, inspirationSlides } from "@/lib/home-editorial"

describe("Home editorial fixtures", () => {
  it("keeps stable, unique, immutable records", () => {
    expect(inspirationSlides).toHaveLength(4)
    expect(editorialImages).toHaveLength(9)
    expect(Object.isFrozen(inspirationSlides)).toBe(true)
    expect(Object.isFrozen(editorialImages)).toBe(true)
    expect([...new Set([...inspirationSlides, ...editorialImages].map(({ id }) => id))]).toHaveLength(13)
    for (const slide of inspirationSlides) {
      expect(Object.isFrozen(slide)).toBe(true)
      expect(Object.isFrozen(slide.image)).toBe(true)
    }
    for (const image of editorialImages) expect(Object.isFrozen(image)).toBe(true)
  })

  it("uses distinct local WebPs with safe metadata and useful alt text", () => {
    const media = [...inspirationSlides.map(({ image }) => image), ...editorialImages]
    expect(new Set(media.map(({ src }) => src))).toHaveLength(13)
    expect(new Set(media.map(({ alt }) => alt))).toHaveLength(13)
    for (const image of media) {
      expect(image.src).toMatch(/^\/images\/home\/editorial\/[a-z0-9-]+\.webp$/)
      expect(image.alt.length).toBeGreaterThan(24)
      expect(Number.isSafeInteger(image.width)).toBe(true)
      expect(Number.isSafeInteger(image.height)).toBe(true)
      expect(image.width).toBeGreaterThan(900)
      expect(image.height).toBeGreaterThan(1000)
      expect(existsSync(join(process.cwd(), "public", image.src))).toBe(true)
    }
  })

  it("allowlists destinations and closed gallery placements", () => {
    const destinations = new Set(["/shop?category=bedroom", "/shop?category=dining", "/shop?category=living"])
    for (const slide of inspirationSlides) expect(destinations.has(slide.href)).toBe(true)
    expect(editorialImages.map(({ placement }) => placement)).toEqual(editorialPlacements)
  })
})
