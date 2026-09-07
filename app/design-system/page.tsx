import type { Metadata } from "next"
import NextLink from "next/link"

import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Stack } from "@/components/layout/stack"
import { Cluster } from "@/components/layout/cluster"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Link } from "@/components/ui/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Money } from "@/components/commerce/money"
import { InteractiveSpecimens } from "./component-specimens"
import { HeartIcon, Share2Icon } from "lucide-react"

import styles from "./design-system.module.css"

export const metadata: Metadata = {
  title: "Design system & component specimen",
  robots: {
    index: false,
    follow: false,
  },
}

export default function DesignSystemPage() {
  return (
    <main id="main-content" className={styles.page}>
      <Container>
        <header className={styles.masthead}>
          <NextLink className={styles.brand} href="/" translate="no">
            Compfi
          </NextLink>
          <span className="type-label text-muted">Component & foundation specimen</span>
        </header>

        <div className={styles.intro}>
          <h1 className="type-display">Considered foundations for modern living.</h1>
          <p className="type-body-lg text-muted">
            These measured tokens, primitives, and accessible interactive components
            form the production UI layer for Compfi.
          </p>
        </div>

        {/* Phase 2: Actions and Display */}
        <section className={styles.section} aria-labelledby="actions-title">
          <div className={styles.sectionHeader}>
            <h2 id="actions-title" className="type-heading-lg">Actions and display</h2>
            <p className="text-muted">
              Square action geometry, 44px minimum touch targets, visible focus rings,
              and semantic text links.
            </p>
          </div>

          <Stack gap="spacious" className="mt-8">
            <Stack gap="compact">
              <h3 className="type-heading-sm">Button variants</h3>
              <Cluster gap="compact">
                <Button variant="default">Primary action</Button>
                <Button variant="outline">Outline action</Button>
                <Button variant="secondary">Secondary action</Button>
                <Button variant="ghost">Ghost action</Button>
                <Button variant="destructive">Destructive action</Button>
                <Button variant="link">Text button link</Button>
              </Cluster>
            </Stack>

            <Stack gap="compact">
              <h3 className="type-heading-sm">Action states</h3>
              <Cluster gap="compact">
                <Button variant="default">Default</Button>
                <Button variant="default" disabled>Disabled</Button>
                <Button variant="outline" disabled>Disabled outline</Button>
                <Button
                  render={<NextLink href="/catalog" />}
                  nativeButton={false}
                >
                  Link as button
                </Button>
                <IconButton label="Favorite item" icon={HeartIcon} variant="outline" />
                <IconButton label="Share item" icon={Share2Icon} variant="ghost" />
              </Cluster>
            </Stack>

            <Stack gap="compact">
              <h3 className="type-heading-sm">Text links</h3>
              <Cluster gap="loose">
                <Link href="/shop">Default link</Link>
                <Link href="/shop" variant="muted">Muted link</Link>
                <Link href="/shop" variant="primary">Brand primary link</Link>
                <Link href="/shop" variant="underline">Underline link</Link>
              </Cluster>
            </Stack>

            <Stack gap="compact">
              <h3 className="type-heading-sm">Badges</h3>
              <Cluster gap="compact">
                <Badge variant="default">Featured</Badge>
                <Badge variant="secondary">In stock</Badge>
                <Badge variant="outline">Handcrafted</Badge>
                <Badge variant="destructive">-30%</Badge>
                <Badge variant="new">New</Badge>
              </Cluster>
            </Stack>

            <Stack gap="compact">
              <h3 className="type-heading-sm">Separators</h3>
              <div className="flex flex-col gap-4 max-w-lg">
                <span className="text-sm text-muted-foreground">Horizontal divider:</span>
                <Separator />
                <div className="flex h-8 items-center gap-4 text-sm text-muted-foreground">
                  <span>Section A</span>
                  <Separator orientation="vertical" />
                  <span>Section B</span>
                  <Separator orientation="vertical" />
                  <span>Section C</span>
                </div>
              </div>
            </Stack>
          </Stack>
        </section>

        {/* Phase 2: Form Controls */}
        <section className={styles.section} aria-labelledby="forms-title">
          <div className={styles.sectionHeader}>
            <h2 id="forms-title" className="type-heading-lg">Forms and fields</h2>
            <p className="text-muted">
              Persistent labels, 10px control radius, 44px min targets, and clear validation states.
            </p>
          </div>

          <div className="mt-8 max-w-2xl">
            <FieldSet>
              <FieldLegend>Customer contact details</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="specimen-name">Full name</FieldLabel>
                  <Input id="specimen-name" placeholder="E.g. Eleanor Vance" autoComplete="name" />
                  <FieldDescription>Required for order delivery confirmation.</FieldDescription>
                </Field>

                <Field data-invalid="true">
                  <FieldLabel htmlFor="specimen-email">Email address</FieldLabel>
                  <Input
                    id="specimen-email"
                    type="email"
                    defaultValue="invalid-email-address"
                    aria-invalid="true"
                    aria-describedby="specimen-email-error"
                  />
                  <FieldError id="specimen-email-error">
                    Please provide a valid email address with an @ domain.
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="specimen-disabled">Account reference</FieldLabel>
                  <Input id="specimen-disabled" disabled defaultValue="COMPFI-84920" />
                  <FieldDescription>Assigned account ID (read only).</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="specimen-notes">Special instructions</FieldLabel>
                  <Textarea id="specimen-notes" placeholder="Delivery gate codes or special notes…" />
                </Field>
              </FieldGroup>
            </FieldSet>
          </div>
        </section>

        {/* Phase 2: Product foundations & Interactive specimens */}
        <section className={styles.section} aria-labelledby="commerce-title">
          <div className={styles.sectionHeader}>
            <h2 id="commerce-title" className="type-heading-lg">Product foundations & specimens</h2>
            <p className="text-muted">
              USD money formatting, quantity inputs, color swatches, and size selectors.
            </p>
          </div>

          <Stack gap="spacious" className="mt-8">
            <Stack gap="compact">
              <h3 className="type-heading-sm">Money component (en-US USD)</h3>
              <Cluster gap="loose">
                <div>
                  <span className="block text-xs text-muted-foreground">Zero:</span>
                  <Money amountCents={0} className="text-lg" />
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground">Standard:</span>
                  <Money amountCents={4900} className="text-lg" />
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground">Thousands:</span>
                  <Money amountCents={245000} className="text-lg" />
                </div>
              </Cluster>
            </Stack>

            <div className="pt-4 border-t border-border">
              <InteractiveSpecimens />
            </div>
          </Stack>
        </section>

        {/* Phase 1 Foundations preserved */}
        <section className={styles.section} aria-labelledby="color-title">
          <div className={styles.sectionHeader}>
            <h2 id="color-title" className="type-heading-lg">Color foundations</h2>
            <p className="text-muted">
              Warm grouping surfaces and a restrained gold accent keep furniture
              imagery in the foreground.
            </p>
          </div>
          <div className={styles.swatches}>
            <Swatch colorClass={styles.brandColor} name="Brand accent" token="--color-brand" />
            <Swatch colorClass={styles.heroColor} name="Hero surface" token="--color-hero" />
            <Swatch colorClass={styles.washColor} name="Control wash" token="--color-wash" />
            <Swatch colorClass={styles.benefitColor} name="Benefit surface" token="--color-benefit" />
            <Swatch colorClass={styles.productColor} name="Product surface" token="--color-product" />
            <Swatch colorClass={styles.inkColor} name="Primary ink" token="--color-ink" />
            <Swatch colorClass={styles.mutedColor} name="Accessible muted" token="--color-muted" />
            <Swatch colorClass={styles.newColor} name="New accent" token="--color-new" />
            <Swatch colorClass={styles.scrimColor} name="Modal scrim" token="--color-scrim" />
          </div>
        </section>

        <section className={styles.section} aria-labelledby="type-title">
          <div className={styles.sectionHeader}>
            <h2 id="type-title" className="type-heading-lg">Typography</h2>
            <p className="text-muted">
              Poppins is self-hosted in four practical weights; fluid display
              sizes retain the reference hierarchy without clipping on small screens.
            </p>
          </div>
          <div className={styles.typeStack}>
            <TypeSample name="Display" className="type-display">Discover considered comfort.</TypeSample>
            <TypeSample name="Heading XL" className="type-heading-xl">Furniture for everyday rituals.</TypeSample>
            <TypeSample name="Heading LG" className="type-heading-lg">Browse by room</TypeSample>
            <TypeSample name="Heading MD" className="type-heading-md">Materials and dimensions</TypeSample>
            <TypeSample name="Heading SM" className="type-heading-sm">Aster lounge chair</TypeSample>
            <TypeSample name="Body large" className="type-body-lg">A generous reading size for introductions and supporting statements.</TypeSample>
            <TypeSample name="Body" className="type-body">Clear product and editorial copy with a comfortable measure.</TypeSample>
            <TypeSample name="Body small" className="type-body-sm">Secondary details remain legible without competing for attention.</TypeSample>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="space-title">
          <div className={styles.sectionHeader}>
            <h2 id="space-title" className="type-heading-lg">Spacing scale</h2>
            <p className="text-muted">
              A four-pixel base supports compact controls and the references&apos;
              larger section intervals.
            </p>
          </div>
          <div className={styles.spacingGrid}>
            <SpaceSample className={styles.space4} label="4 · 1rem" />
            <SpaceSample className={styles.space8} label="8 · 2rem" />
            <SpaceSample className={styles.space16} label="16 · 4rem" />
            <SpaceSample className={styles.space24} label="24 · 6rem" />
            <SpaceSample className={styles.space30} label="30 · 7.5rem" />
          </div>
        </section>

        <section className={styles.section} aria-labelledby="surface-title">
          <div className={styles.sectionHeader}>
            <h2 id="surface-title" className="type-heading-lg">Surfaces</h2>
            <p className="text-muted">
              Corners and elevation stay restrained. Surfaces group content before
              borders or shadow are introduced.
            </p>
          </div>
          <div className={styles.surfaceGrid}>
            <div className={`${styles.surfaceSample} surface-hero`}>
              <strong>Hero</strong><span className="type-body-sm">Campaign emphasis</span>
            </div>
            <div className={`${styles.surfaceSample} surface-wash`}>
              <strong>Wash</strong><span className="type-body-sm">Controls and totals</span>
            </div>
            <div className={`${styles.surfaceSample} surface-product`}>
              <strong>Product</strong><span className="type-body-sm">Catalog information</span>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="geometry-title">
          <div className={styles.sectionHeader}>
            <h2 id="geometry-title" className="type-heading-lg">Borders, radii, and grid</h2>
            <p className="text-muted">
              Measured geometry stays quiet while the demonstration grid reduces
              columns at tablet, mobile, and narrow-mobile widths.
            </p>
          </div>
          <div className={styles.geometryGrid} aria-label="Border and radius samples">
            <GeometrySample className={styles.squareGeometry} label="Square action · 0" />
            <GeometrySample className={styles.controlGeometry} label="Control · 10px" />
            <GeometrySample className={styles.imageGeometry} label="Image · 10px" />
            <GeometrySample className={styles.roundGeometry} label="Round badge · circular" />
          </div>
          <h3 className={`${styles.gridTitle} type-heading-sm`}>Responsive grid</h3>
          <div className={styles.responsiveGrid} aria-label="Responsive four-item grid">
            <div className={styles.gridCell}>Item 1</div>
            <div className={styles.gridCell}>Item 2</div>
            <div className={styles.gridCell}>Item 3</div>
            <div className={styles.gridCell}>Item 4</div>
          </div>
        </section>
      </Container>

      <Section spacing="default" className={styles.containerDemo} aria-labelledby="layout-title">
        <Container>
          <div className={styles.containerInner}>
            <h2 id="layout-title" className="type-heading-lg">Measured container & Section</h2>
            <p className="text-muted mt-3">
              77.5rem maximum width with fluid tablet and mobile gutters.
            </p>
          </div>
        </Container>
      </Section>
    </main>
  )
}

function Swatch({ colorClass, name, token }: { colorClass: string; name: string; token: string }) {
  return (
    <div className={styles.swatch}>
      <div className={`${styles.swatchColor} ${colorClass}`} aria-hidden="true" />
      <div className={styles.swatchLabel}>
        <strong>{name}</strong>
        <p className="type-body-sm text-muted">{token}</p>
      </div>
    </div>
  )
}

function TypeSample({ children, className, name }: { children: React.ReactNode; className: string; name: string }) {
  return (
    <div className={styles.sample}>
      <p className={styles.sampleName}>{name}</p>
      <p className={className}>{children}</p>
    </div>
  )
}

function SpaceSample({ className, label }: { className: string; label: string }) {
  return (
    <div className={styles.tokenCard}>
      <p className="type-label">{label}</p>
      <div className={`${styles.spaceBar} ${className}`} aria-hidden="true" />
    </div>
  )
}

function GeometrySample({ className, label }: { className: string; label: string }) {
  return <div className={`${styles.geometrySample} ${className}`}>{label}</div>
}
