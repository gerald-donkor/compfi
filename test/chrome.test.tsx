import * as React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { BenefitsStrip } from "@/components/chrome/benefits-strip"
import { CartDrawer } from "@/components/chrome/cart-drawer"
import { HeaderControls } from "@/components/chrome/header-controls"
import { PageHero } from "@/components/chrome/page-hero"
import { SiteFooter } from "@/components/chrome/site-footer"
import { checkA11y } from "./a11y"

vi.mock("next/navigation", () => ({ usePathname: () => "/" }))

describe("Compfi chrome", () => {
  it("renders labelled primary navigation and identifies the current page", async () => {
    const { container } = render(
      <HeaderControls navigation={[{ href: "/", label: "Home" }, { href: "/shop", label: "Shop" }]} />
    )

    expect(screen.getAllByRole("navigation", { name: "Primary" })).toHaveLength(1)
    expect(screen.getAllByRole("link", { name: "Home" })[0]).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("button", { name: "Open cart" })).toBeInTheDocument()

    expect(await checkA11y(container)).toEqual([])
  })

  it("opens and closes the mobile menu with Escape and restores focus", async () => {
    const user = userEvent.setup()
    render(<HeaderControls navigation={[{ href: "/", label: "Home" }]} />)

    const menu = screen.getByRole("button", { name: "Open menu" })
    await user.click(menu)
    expect(menu).toHaveAttribute("aria-expanded", "true")
    expect(screen.getAllByRole("link", { name: "Home" })).toHaveLength(2)

    await user.keyboard("{Escape}")
    expect(menu).toHaveFocus()
    expect(menu).toHaveAttribute("aria-expanded", "false")
  })

  it("opens an accessible empty cart and closes it with Escape", async () => {
    const user = userEvent.setup()
    render(<CartDrawer />)

    const trigger = screen.getByRole("button", { name: "Open cart" })
    await user.click(trigger)
    expect(await screen.findByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Browse furniture" })).toHaveAttribute("href", "/shop")

    await user.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })

  it("renders semantic breadcrumbs, benefits, and footer links", async () => {
    const { container } = render(
      <>
        <PageHero title="Shop" breadcrumbs={[{ label: "Home" }, { label: "Shop" }]} />
        <BenefitsStrip />
        <SiteFooter />
      </>
    )

    expect(screen.getByRole("navigation", { name: "breadcrumb" })).toBeInTheDocument()
    expect(container.querySelector("[data-slot='breadcrumb-page']")).toHaveAttribute("aria-current", "page")
    expect(screen.queryByRole("link", { name: "Shop", current: "page" })).not.toBeInTheDocument()
    expect(container.querySelector("[data-slot='breadcrumb-item'] span")).not.toHaveAttribute("aria-current")
    expect(screen.getByRole("complementary", { name: "Shopping with Compfi" })).toBeInTheDocument()
    expect(screen.getByRole("contentinfo")).toBeInTheDocument()

    expect(await checkA11y(container)).toEqual([])
  })

  it("renders compact breadcrumbs without a duplicate heading", async () => {
    const { container } = render(
      <PageHero
        variant="compact-breadcrumb"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: "Atlas Bed" },
        ]}
        aria-label="Product path"
      />
    )

    expect(screen.queryByRole("heading")).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/")
    expect(screen.getByRole("link", { name: "Shop" })).toHaveAttribute("href", "/shop")
    expect(screen.getByText("Atlas Bed")).toHaveAttribute("aria-current", "page")
    expect(container.firstElementChild).toHaveAttribute("data-variant", "compact-breadcrumb")
    expect(container.firstElementChild).toHaveAttribute("aria-label", "Product path")
    expect(await checkA11y(container)).toEqual([])
  })
})
