import type { Metadata } from "next"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { UserProfile } from "@clerk/nextjs"

import { PageHero } from "@/components/chrome/page-hero"
import { Container } from "@/components/layout/container"

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your Compfi account details, security settings, and preferences.",
  alternates: {
    canonical: "/account",
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AccountPage() {
  const { isAuthenticated } = await auth()

  if (!isAuthenticated) {
    redirect("/sign-in?redirect_url=/account")
  }

  return (
    <main id="main-content">
      <PageHero
        title="My Account"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Account" },
        ]}
      />
      <Container className="py-12 flex justify-center">
        <UserProfile routing="hash" />
      </Container>
    </main>
  )
}
