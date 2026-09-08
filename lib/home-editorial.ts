export const editorialPlacements = Object.freeze([
  "shelf",
  "workspace",
  "nook",
  "bedroom",
  "dining",
  "chair",
  "tables",
  "art",
  "kitchen",
] as const)

export type EditorialPlacement = (typeof editorialPlacements)[number]

export type EditorialImage = Readonly<{
  id: string
  src: `/images/home/editorial/${string}.webp`
  alt: string
  width: number
  height: number
  placement: EditorialPlacement
}>

export type InspirationSlide = Readonly<{
  id: string
  eyebrow: string
  title: string
  actionLabel: string
  href: "/shop?category=bedroom" | "/shop?category=dining" | "/shop?category=living"
  image: Readonly<{
    src: `/images/home/editorial/${string}.webp`
    alt: string
    width: number
    height: number
  }>
}>

function freezeRecord<const T extends Record<string, unknown>>(record: T): Readonly<T> {
  return Object.freeze(record)
}

export const inspirationSlides: readonly InspirationSlide[] = Object.freeze([
  freezeRecord({ id: "quiet-layers", eyebrow: "Bedroom", title: "Quiet layers", actionLabel: "Browse bedroom", href: "/shop?category=bedroom", image: freezeRecord({ src: "/images/home/editorial/quiet-layers.webp", alt: "Ivory bed layered with linen beside a pale oak nightstand", width: 1045, height: 1506 }) }),
  freezeRecord({ id: "room-to-gather", eyebrow: "Dining", title: "Room to gather", actionLabel: "Browse dining", href: "/shop?category=dining", image: freezeRecord({ src: "/images/home/editorial/room-to-gather.webp", alt: "Round oak dining table surrounded by four upholstered chairs", width: 1045, height: 1506 }) }),
  freezeRecord({ id: "softly-grounded", eyebrow: "Living", title: "Softly grounded", actionLabel: "Browse living", href: "/shop?category=living", image: freezeRecord({ src: "/images/home/editorial/softly-grounded.webp", alt: "Low linen sofa and curved chair on a deeply textured rug", width: 1045, height: 1506 }) }),
  freezeRecord({ id: "place-to-pause", eyebrow: "Reading corner", title: "A place to pause", actionLabel: "Browse living", href: "/shop?category=living", image: freezeRecord({ src: "/images/home/editorial/place-to-pause.webp", alt: "Enveloping lounge chair beside a floor lamp and quiet shelving", width: 1045, height: 1506 }) }),
])

export const editorialImages: readonly EditorialImage[] = Object.freeze([
  freezeRecord({ id: "open-shelving", src: "/images/home/editorial/open-shelving.webp", alt: "Open oak shelving arranged with ceramics and trailing greenery", width: 1024, height: 1536, placement: "shelf" }),
  freezeRecord({ id: "quiet-workspace", src: "/images/home/editorial/quiet-workspace.webp", alt: "Pale oak desk set against a calm, light-filled living space", width: 1536, height: 1024, placement: "workspace" }),
  freezeRecord({ id: "dining-nook", src: "/images/home/editorial/dining-nook.webp", alt: "Compact round dining nook beneath a sculptural pendant", width: 1024, height: 1536, placement: "nook" }),
  freezeRecord({ id: "upholstered-bedroom", src: "/images/home/editorial/upholstered-bedroom.webp", alt: "Upholstered bed dressed in layered sand and ivory textiles", width: 1536, height: 1024, placement: "bedroom" }),
  freezeRecord({ id: "sunlit-dining-corner", src: "/images/home/editorial/sunlit-dining-corner.webp", alt: "Sunlit oak dining corner against softly textured brick", width: 1024, height: 1536, placement: "dining" }),
  freezeRecord({ id: "vintage-lounge-chair", src: "/images/home/editorial/vintage-lounge-chair.webp", alt: "Vintage-inspired lounge chair against a warm plaster wall", width: 1024, height: 1536, placement: "chair" }),
  freezeRecord({ id: "oak-tables", src: "/images/home/editorial/oak-tables.webp", alt: "Pair of low oak tables styled with ceramics and leafy branches", width: 1536, height: 1024, placement: "tables" }),
  freezeRecord({ id: "art-vase", src: "/images/home/editorial/art-vase.webp", alt: "Abstract framed artwork above a sculptural ceramic vase", width: 941, height: 1672, placement: "art" }),
  freezeRecord({ id: "kitchen-shelf", src: "/images/home/editorial/kitchen-shelf.webp", alt: "Kitchen shelf with handmade ceramics and hanging utensils", width: 1536, height: 1024, placement: "kitchen" }),
])
