import { ArmchairIcon } from "lucide-react"

import { Container } from "@/components/layout/container"
import { HeaderControls } from "@/components/chrome/header-controls"
import { Link } from "@/components/ui/link"

const primaryNavigation = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
] as const

export function SiteHeader() {
  return (
    <header className="border-b border-compfi-border bg-background" data-slot="site-header">
      <Container className="grid min-h-25 grid-cols-[1fr_auto] items-center gap-4 lg:grid-cols-[minmax(12rem,1fr)_auto_minmax(12rem,1fr)]">
        <Link
          className="inline-flex min-h-11 w-fit items-center gap-2 text-xl font-bold tracking-[-0.04em] no-underline"
          href="/"
          aria-label="Compfi home"
        >
          <ArmchairIcon aria-hidden="true" className="text-compfi-brand" />
          <span translate="no">Compfi</span>
        </Link>
        <HeaderControls navigation={primaryNavigation} />
      </Container>
    </header>
  )
}
