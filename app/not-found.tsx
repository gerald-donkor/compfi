import { PageHero } from "@/components/chrome/page-hero";
import { Container } from "@/components/layout/container";
import { Link } from "@/components/ui/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main-content">
      <PageHero
        title="404 — Page Not Found"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Not Found" }]}
      />
      <section className="py-16 md:py-24" aria-labelledby="not-found-heading">
        <Container className="flex flex-col items-center text-center">
          <h2 id="not-found-heading" className="sr-only">
            Page Not Found
          </h2>
          <p className="type-body-lg text-muted mb-6 max-w-md">
            We couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop"
              className={buttonVariants({ variant: "default", size: "default" })}
            >
              Browse furniture
            </Link>
            <Link
              href="/"
              className={buttonVariants({ variant: "outline", size: "default" })}
            >
              Return home
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
