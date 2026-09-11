import type { Metadata } from "next"

import { ContactContent } from "@/components/contact/contact-content"
import { BenefitsStrip } from "@/components/chrome/benefits-strip"
import { PageHero } from "@/components/chrome/page-hero"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Compfi with questions about furniture and your space.",
  alternates: {
    canonical: "/contact",
  },
}

export default function ContactPage() {
  return (
    <main id="main-content">
      <PageHero
        title="Contact"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <ContactContent />
      <BenefitsStrip />
    </main>
  )
}
