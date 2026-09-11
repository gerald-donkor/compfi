import type { Metadata } from "next"
import { SignUp } from "@clerk/nextjs"

import { PageHero } from "@/components/chrome/page-hero"
import { Container } from "@/components/layout/container"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Compfi account.",
  alternates: {
    canonical: "/sign-up",
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function SignUpPage() {
  return (
    <main id="main-content">
      <PageHero
        title="Sign Up"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Sign Up" },
        ]}
      />
      <Container className="py-12 flex justify-center">
        <SignUp routing="path" path="/sign-up" />
      </Container>
    </main>
  )
}
