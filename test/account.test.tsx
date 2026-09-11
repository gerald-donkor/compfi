import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { CartProvider } from "@/components/cart/cart-provider"
import { HeaderControls } from "@/components/chrome/header-controls"
import AccountPage from "@/app/account/page"
import SignInPage from "@/app/sign-in/[[...sign-in]]/page"
import SignUpPage from "@/app/sign-up/[[...sign-up]]/page"
import { checkA11y } from "./a11y"
import { resetTestClerkState, setTestClerkState } from "./setup"

const redirectMock = vi.fn()
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  redirect: (url: string) => redirectMock(url),
}))

describe("Clerk Authentication & Protected Account (Phase 9)", () => {
  beforeEach(() => {
    resetTestClerkState()
    redirectMock.mockClear()
  })

  afterEach(() => {
    resetTestClerkState()
  })

  describe("Header Controls Auth Integration", () => {
    it("renders signed-out account action and mobile sign-in button", async () => {
      const { container } = render(
        <CartProvider>
          <HeaderControls navigation={[{ href: "/", label: "Home" }, { href: "/shop", label: "Shop" }]} />
        </CartProvider>
      )

      const accountBtn = screen.getByRole("button", { name: "Sign in to account" })
      expect(accountBtn).toBeInTheDocument()
      expect(accountBtn).toHaveClass("min-h-11", "min-w-11")

      expect(await checkA11y(container)).toEqual([])
    })

    it("renders signed-in UserButton when authenticated", async () => {
      setTestClerkState({ isSignedIn: true, userId: "user_compfi_1" })

      const { container } = render(
        <CartProvider>
          <HeaderControls navigation={[{ href: "/", label: "Home" }, { href: "/shop", label: "Shop" }]} />
        </CartProvider>
      )

      expect(screen.queryByRole("button", { name: "Sign in to account" })).not.toBeInTheDocument()
      const userBtn = screen.getByRole("button", { name: "Open user account menu" })
      expect(userBtn).toBeInTheDocument()

      expect(await checkA11y(container)).toEqual([])
    })

    it("toggles mobile menu and displays auth action", async () => {
      const user = userEvent.setup()
      render(
        <CartProvider>
          <HeaderControls navigation={[{ href: "/", label: "Home" }]} />
        </CartProvider>
      )

      const menuBtn = screen.getByRole("button", { name: "Open menu" })
      await user.click(menuBtn)

      expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument()
    })

    it("displays My Account link in mobile menu when signed in", async () => {
      setTestClerkState({ isSignedIn: true, userId: "user_compfi_1" })
      const user = userEvent.setup()

      render(
        <CartProvider>
          <HeaderControls navigation={[{ href: "/", label: "Home" }]} />
        </CartProvider>
      )

      const menuBtn = screen.getByRole("button", { name: "Open menu" })
      await user.click(menuBtn)

      const accountLink = screen.getByRole("link", { name: "My Account" })
      expect(accountLink).toBeInTheDocument()
      expect(accountLink).toHaveAttribute("href", "/account")
    })
  })

  describe("Protected Account Route (app/account/page.tsx)", () => {
    it("redirects unauthenticated visitors to sign-in with redirect_url", async () => {
      setTestClerkState({ isSignedIn: false })

      await AccountPage()
      expect(redirectMock).toHaveBeenCalledWith("/sign-in?redirect_url=/account")
    })

    it("renders UserProfile for authenticated members", async () => {
      setTestClerkState({ isSignedIn: true, userId: "user_compfi_test" })

      const jsx = await AccountPage()
      const { container } = render(jsx)

      expect(screen.getByRole("heading", { name: "My Account" })).toBeInTheDocument()
      expect(screen.getByText("User Profile Component")).toBeInTheDocument()
      expect(await checkA11y(container)).toEqual([])
    })
  })

  describe("Dedicated Auth Routes", () => {
    it("renders SignInPage with PageHero and SignIn component", async () => {
      const { container } = render(<SignInPage />)

      expect(screen.getByRole("heading", { name: "Sign In" })).toBeInTheDocument()
      expect(screen.getByText("Sign In Component")).toBeInTheDocument()
      expect(await checkA11y(container)).toEqual([])
    })

    it("renders SignUpPage with PageHero and SignUp component", async () => {
      const { container } = render(<SignUpPage />)

      expect(screen.getByRole("heading", { name: "Sign Up" })).toBeInTheDocument()
      expect(screen.getByText("Sign Up Component")).toBeInTheDocument()
      expect(await checkA11y(container)).toEqual([])
    })
  })
})
