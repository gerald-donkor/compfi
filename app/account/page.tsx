import type { Metadata } from "next"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { UserProfile } from "@clerk/nextjs"

import { OrderHistory } from "@/components/account/order-history"
import { PageHero } from "@/components/chrome/page-hero"
import { Container } from "@/components/layout/container"
import { Separator } from "@/components/ui/separator"
import { getOrdersByUserId } from "@/db/orders"

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your Compfi account details, order history, and preferences.",
  alternates: {
    canonical: "/account",
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AccountPage() {
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated || !userId) {
    redirect("/sign-in?redirect_url=/account")
  }

  const orders = await getOrdersByUserId(userId)

  return (
    <main id="main-content">
      <PageHero
        title="My Account"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Account" },
        ]}
      />
      <Container className="py-12 space-y-12 max-w-4xl">
        <OrderHistory orders={orders} />
        <Separator />
        <section aria-labelledby="profile-settings-heading">
          <h2 id="profile-settings-heading" className="type-heading-md mb-6">
            Profile Settings
          </h2>
          <div className="flex justify-center">
            <UserProfile routing="hash" />
          </div>
        </section>
      </Container>
    </main>
  )
}
