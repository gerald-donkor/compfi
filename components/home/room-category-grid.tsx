import Image from "next/image"

import { Link } from "@/components/ui/link"
import type { ProductCategory } from "@/types/commerce"

type RoomCategory = {
  category: ProductCategory
  label: string
  image: {
    path: `/images/${string}`
    alt: string
    width: number
    height: number
  }
}

const roomCategories: readonly RoomCategory[] = [
  {
    category: "dining",
    label: "Dining",
    image: {
      path: "/images/home/dining.webp",
      alt: "Sunlit dining nook with an oak pedestal table and upholstered chairs",
      width: 1254,
      height: 1254,
    },
  },
  {
    category: "living",
    label: "Living",
    image: {
      path: "/images/home/living.webp",
      alt: "Relaxed linen sofa and timber coffee table in a warm living room",
      width: 1254,
      height: 1254,
    },
  },
  {
    category: "bedroom",
    label: "Bedroom",
    image: {
      path: "/images/home/bedroom.webp",
      alt: "Quiet bedroom with an upholstered bed and pale oak bedside table",
      width: 1254,
      height: 1254,
    },
  },
]

export function RoomCategoryGrid() {
  return (
    <ul className="room-category-grid" data-slot="room-category-grid">
      {roomCategories.map((room) => (
        <li key={room.category} data-slot="room-category-item">
          <Link
            href={`/shop?category=${encodeURIComponent(room.category)}`}
            className="room-category-grid__link"
          >
            <Image
              src={room.image.path}
              alt={room.image.alt}
              width={room.image.width}
              height={room.image.height}
              sizes="(min-width: 1024px) calc((min(100vw - (2 * clamp(32px, calc(16.35vw - 135.36px), 100px)), 1180px) - 36px) / 3), (min-width: 640px) calc((100vw - 96px) / 2), calc(100vw - 40px)"
              className="room-category-grid__image"
            />
            <span className="type-heading-md room-category-grid__label">{room.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
