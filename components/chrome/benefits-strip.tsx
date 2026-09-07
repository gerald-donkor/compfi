import { HeadphonesIcon, PackageCheckIcon, ShieldCheckIcon, TrophyIcon, type LucideIcon } from "lucide-react"

import { Container } from "@/components/layout/container"

type Benefit = { icon: LucideIcon; title: string; description: string }

const benefits: readonly Benefit[] = [
  { icon: TrophyIcon, title: "Thoughtfully selected", description: "Furniture for everyday living" },
  { icon: ShieldCheckIcon, title: "Clear product details", description: "Materials and dimensions upfront" },
  { icon: PackageCheckIcon, title: "Plan your space", description: "Browse by room and style" },
  { icon: HeadphonesIcon, title: "Need a hand?", description: "Contact Compfi for guidance" },
]

export function BenefitsStrip() {
  return (
    <aside className="surface-benefit py-12 lg:py-(--chrome-benefits-block-padding)" aria-label="Shopping with Compfi" data-slot="benefits-strip">
      <Container className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {benefits.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-4">
            <Icon aria-hidden="true" className="mt-1 shrink-0 text-compfi-ink" />
            <div>
              <h2 className="type-heading-md">{title}</h2>
              <p className="type-body text-muted mt-1">{description}</p>
            </div>
          </div>
        ))}
      </Container>
    </aside>
  )
}
