import type { Metadata } from "next"
import { SignIn } from "@clerk/nextjs"

import { PageHero } from "@/components/chrome/page-hero"
import { Container } from "@/components/layout/container"
import { siteUrl } from "@/lib/site"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Compfi account.",
  alternates: {
    canonical: `${siteUrl}/sign-in`,
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function SignInPage() {
  return (
    <main id="main-content">
      <PageHero
        title="Sign In"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Sign In" },
        ]}
      />
      <Container className="py-12 flex justify-center">
        <SignIn routing="path" path="/sign-in" />
      </Container>
    </main>
  )
}
