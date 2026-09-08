export interface ColorOption {
  value: string
  label: string
  color: string
  disabled?: boolean
}

export interface SizeOption {
  value: string
  label: string
  disabled?: boolean
}

export type ProductCategory = "dining" | "living" | "bedroom"

export type ProductBadge = "sale" | "new"

export interface ProductMedia {
  readonly path: `/images/${string}`
  readonly alt: string
  readonly width: number
  readonly height: number
  readonly focalPosition?: string
}

export interface CatalogProduct {
  readonly id: string
  readonly slug: string
  readonly name: string
  readonly category: ProductCategory
  readonly description: string
  readonly priceCents: number
  readonly compareAtPriceCents?: number
  readonly badge?: ProductBadge
  readonly media: ProductMedia
}
