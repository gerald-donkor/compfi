import { Container } from "@/components/layout/container"
import { Link } from "@/components/ui/link"
import { Separator } from "@/components/ui/separator"
import { NewsletterForm } from "@/components/chrome/newsletter-form"

const footerGroups = [
  { title: "Explore", links: [{ href: "/", label: "Home" }, { href: "/shop", label: "Shop" }, { href: "/blog", label: "Blog" }] },
  { title: "Connect", links: [{ href: "/contact", label: "Contact" }] },
] as const

export function SiteFooter() {
  return (
    <footer className="bg-background py-16" data-slot="site-footer">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-[minmax(0,1.2fr)_repeat(2,minmax(7rem,0.5fr))_minmax(0,1.4fr)]">
          <div>
            <p className="type-wordmark type-wordmark-footer" translate="no">Compfi</p>
            <p className="type-body text-muted mt-4 max-w-xs">Furniture and home furnishings, thoughtfully presented.</p>
          </div>
          {footerGroups.map((group) => (
            <section key={group.title} aria-labelledby={`footer-${group.title.toLowerCase()}`}>
              <h2 id={`footer-${group.title.toLowerCase()}`} className="type-label text-muted">{group.title}</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} variant="default" className="min-h-11 min-w-11 no-underline">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <section aria-labelledby="footer-newsletter">
            <h2 id="footer-newsletter" className="type-label text-muted">Newsletter</h2>
            <div className="mt-5">
              <NewsletterForm />
            </div>
          </section>
        </div>
        <Separator className="my-12" />
        <p className="type-body-sm text-muted">© {new Date().getFullYear()} Compfi. All rights reserved.</p>
      </Container>
    </footer>
  )
}
