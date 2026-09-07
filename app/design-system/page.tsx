import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";

import styles from "./design-system.module.css";

export const metadata: Metadata = {
  title: "Design system",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignSystemPage() {
  return (
    <main id="main-content" className={styles.page}>
      <Container>
        <header className={styles.masthead}>
          <Link className={styles.brand} href="/" translate="no">
            Compfi
          </Link>
          <span className="type-label text-muted">Foundation specimen</span>
        </header>

        <div className={styles.intro}>
          <h1 className="type-display">A quiet frame for expressive rooms.</h1>
          <p className="type-body-lg text-muted">
            These measured foundations translate the supplied desktop references
            into a responsive, accessible system for Compfi.
          </p>
        </div>

        <section className={styles.section} aria-labelledby="color-title">
          <div className={styles.sectionHeader}>
            <h2 id="color-title" className="type-heading-lg">Color</h2>
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
            <h2 id="space-title" className="type-heading-lg">Spacing</h2>
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
      </Container>

      <section className={`${styles.section} ${styles.containerDemo}`} aria-labelledby="layout-title">
        <Container>
          <div className={styles.containerInner}>
            <h2 id="layout-title" className="type-heading-lg">Measured container</h2>
            <p className="text-muted mt-3">
              77.5rem maximum width with fluid tablet and mobile gutters.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        <section className={styles.section} aria-labelledby="controls-title">
          <div className={styles.sectionHeader}>
            <h2 id="controls-title" className="type-heading-lg">Controls and states</h2>
            <p className="text-muted">
              Native elements preserve semantics, 44-pixel targets, keyboard focus,
              and familiar disabled behavior.
            </p>
          </div>
          <div className={styles.controlStack}>
            <button className="button-primary" type="button">Primary action</button>
            <button className="button-outline" type="button">Outline action</button>
            <button className="button-primary" type="button" disabled>Disabled action</button>
            <label className={styles.field}>
              Material search
              <input autoComplete="off" name="material" placeholder="Try oak or linen…" type="search" />
            </label>
          </div>
          <div className={styles.stateGrid}>
            <StateSample title="Loading example">Keep layout stable and name the pending result.</StateSample>
            <StateSample title="Empty example">Explain what is missing and offer a useful next step.</StateSample>
            <StateSample title="Error example">State the problem and how the customer can recover.</StateSample>
          </div>
          <div className={styles.motionSample}>
            <div className={styles.motionDot} aria-hidden="true" />
          </div>
          <p className={`${styles.note} type-body-sm`}>
            Motion is interaction-led and removed when reduced motion is preferred.
            Product comparison will scroll horizontally when necessary; cart rows
            will stack on small screens; modal sheets will use the available viewport.
          </p>
        </section>
      </Container>
    </main>
  );
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
  );
}

function TypeSample({ children, className, name }: { children: React.ReactNode; className: string; name: string }) {
  return (
    <div className={styles.sample}>
      <p className={styles.sampleName}>{name}</p>
      <p className={className}>{children}</p>
    </div>
  );
}

function SpaceSample({ className, label }: { className: string; label: string }) {
  return (
    <div className={styles.tokenCard}>
      <p className="type-label">{label}</p>
      <div className={`${styles.spaceBar} ${className}`} aria-hidden="true" />
    </div>
  );
}

function StateSample({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className={styles.stateCard}>
      <strong>{title}</strong>
      <p className="type-body-sm text-muted mt-2">{children}</p>
    </div>
  );
}
