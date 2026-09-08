import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import {
  catalogProducts,
  getCatalogProductBySlug,
  getCatalogProductsByCategory,
} from "@/lib/catalog"

function readWebpDimensions(filePath: string): { width: number; height: number } {
  const bytes = readFileSync(filePath)
  if (bytes.toString("ascii", 0, 4) !== "RIFF" || bytes.toString("ascii", 8, 12) !== "WEBP") {
    throw new Error(`Expected a WebP file at ${filePath}`)
  }

  for (let offset = 12; offset + 8 <= bytes.length; ) {
    const chunk = bytes.toString("ascii", offset, offset + 4)
    const chunkSize = bytes.readUInt32LE(offset + 4)
    const dataOffset = offset + 8

    if (chunk === "VP8 ") {
      if (bytes.readUInt8(dataOffset + 3) !== 0x9d || bytes.readUInt8(dataOffset + 4) !== 0x01 || bytes.readUInt8(dataOffset + 5) !== 0x2a) {
        throw new Error(`Expected a lossy WebP frame header at ${filePath}`)
      }
      return {
        width: bytes.readUInt16LE(dataOffset + 6) & 0x3fff,
        height: bytes.readUInt16LE(dataOffset + 8) & 0x3fff,
      }
    }

    offset = dataOffset + chunkSize + (chunkSize % 2)
  }

  throw new Error(`Unable to read WebP dimensions at ${filePath}`)
}

describe("catalog fixtures", () => {
  it("exposes eight immutable, uniquely identified products", () => {
    expect(catalogProducts).toHaveLength(8)
    expect(Object.isFrozen(catalogProducts)).toBe(true)
    expect(new Set(catalogProducts.map((product) => product.id)).size).toBe(8)
    expect(new Set(catalogProducts.map((product) => product.slug)).size).toBe(8)

    for (const product of catalogProducts) {
      expect(Object.isFrozen(product)).toBe(true)
      expect(Object.isFrozen(product.media)).toBe(true)
    }
  })

  it("looks up known slugs without throwing for absent products", () => {
    expect(getCatalogProductBySlug("sora-lounge-chair")?.name).toBe(
      "Sora Lounge Chair"
    )
    expect(getCatalogProductBySlug("missing-product")).toBeUndefined()
  })

  it("returns products within the requested supported category", () => {
    const diningProducts = getCatalogProductsByCategory("dining")
    expect(diningProducts).toHaveLength(2)
    expect(Object.isFrozen(diningProducts)).toBe(true)
    expect(diningProducts.every((product) => product.category === "dining")).toBe(true)
    expect(new Set(catalogProducts.map((product) => product.category))).toEqual(
      new Set(["dining", "living", "bedroom"])
    )
  })

  it("uses safe USD-cent values and valid compare-at ordering", () => {
    for (const product of catalogProducts) {
      expect(Number.isSafeInteger(product.priceCents)).toBe(true)
      expect(product.priceCents).toBeGreaterThanOrEqual(0)
      if (product.compareAtPriceCents !== undefined) {
        expect(Number.isSafeInteger(product.compareAtPriceCents)).toBe(true)
        expect(product.compareAtPriceCents).toBeGreaterThan(product.priceCents)
      }
    }
  })

  it("references local 4:5 product media with usable alt text", () => {
    for (const product of catalogProducts) {
      expect(product.media.path).toMatch(/^\/images\/catalog\/[a-z0-9-]+\.webp$/)
      expect(product.media.width / product.media.height).toBe(4 / 5)
      expect(product.media.alt).not.toMatch(/^image of\b/i)
      expect(product.media.alt.trim().toLocaleLowerCase("en-US")).not.toBe(
        product.name.trim().toLocaleLowerCase("en-US")
      )

      const mediaFile = resolve(process.cwd(), "public", product.media.path.slice(1))
      expect(mediaFile).satisfy(existsSync)
      expect(readWebpDimensions(mediaFile)).toEqual({
        width: product.media.width,
        height: product.media.height,
      })
    }
  })
})
