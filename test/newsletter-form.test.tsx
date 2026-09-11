import * as React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { NewsletterForm } from "@/components/chrome/newsletter-form"
import { SiteFooter } from "@/components/chrome/site-footer"
import { checkA11y } from "./a11y"

// Mock server action
vi.mock("@/app/actions/newsletter", () => ({
  subscribeNewsletterAction: vi.fn(async (input: { email: string } | FormData) => {
    const email = input instanceof FormData ? (input.get("email") as string) : input.email
    if (!email || !email.includes("@")) {
      return { success: false, error: "Please enter a valid email address." }
    }
    if (email.includes("existing")) {
      return { success: true, message: "You are already subscribed to Compfi updates.", isNew: false }
    }
    return { success: true, message: "Thank you for subscribing to Compfi updates.", isNew: true }
  }),
}))

describe("NewsletterForm component", () => {
  it("renders accessible email input and submit button", async () => {
    const { container } = render(<NewsletterForm />)

    const form = screen.getByRole("form", { name: "Subscribe to newsletter" })
    expect(form).toBeInTheDocument()

    const input = screen.getByLabelText("Email address")
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute("type", "email")
    expect(input).toHaveAttribute("placeholder", "Enter Your Email Address")
    expect(input).toHaveAttribute("autoComplete", "email")

    const submitBtn = screen.getByRole("button", { name: "SUBSCRIBE" })
    expect(submitBtn).toBeInTheDocument()

    expect(await checkA11y(container)).toEqual([])
  })

  it("forwards ref, custom className, and exposes data-slot='newsletter-form'", () => {
    const ref = React.createRef<HTMLFormElement>()
    render(<NewsletterForm ref={ref} className="custom-newsletter-form" />)

    const form = screen.getByRole("form", { name: "Subscribe to newsletter" })
    expect(form).toHaveAttribute("data-slot", "newsletter-form")
    expect(form).toHaveClass("custom-newsletter-form")
    expect(ref.current).toBe(form)
  })

  it("handles valid email submission and renders success message", async () => {
    const user = userEvent.setup()
    const { container } = render(<NewsletterForm />)

    const input = screen.getByLabelText("Email address")
    const submitBtn = screen.getByRole("button", { name: "SUBSCRIBE" })

    await user.type(input, "reader@compfi.com")
    await user.click(submitBtn)

    await waitFor(() => {
      expect(
        screen.getByText("Thank you for subscribing to Compfi updates.")
      ).toBeInTheDocument()
    })

    // Input is cleared
    expect(input).toHaveValue("")

    expect(await checkA11y(container)).toEqual([])
  })

  it("handles existing subscriber message", async () => {
    const user = userEvent.setup()
    render(<NewsletterForm />)

    const input = screen.getByLabelText("Email address")
    const submitBtn = screen.getByRole("button", { name: "SUBSCRIBE" })

    await user.type(input, "existing@compfi.com")
    await user.click(submitBtn)

    await waitFor(() => {
      expect(
        screen.getByText("You are already subscribed to Compfi updates.")
      ).toBeInTheDocument()
    })
  })

  it("displays client validation error for invalid email", async () => {
    const user = userEvent.setup()
    render(<NewsletterForm />)

    const input = screen.getByLabelText("Email address")
    const submitBtn = screen.getByRole("button", { name: "SUBSCRIBE" })

    await user.type(input, "invalid-email")
    await user.click(submitBtn)

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address.")
      ).toBeInTheDocument()
    })

    // Input retains value so user can edit
    expect(input).toHaveValue("invalid-email")
  })

  it("disables controls and sets aria-busy during in-flight submission", async () => {
    let resolvePromise: (val: { success: true; message: string }) => void
    const pendingPromise = new Promise<{ success: true; message: string }>((resolve) => {
      resolvePromise = resolve
    })

    const viMock = await import("@/app/actions/newsletter")
    vi.mocked(viMock.subscribeNewsletterAction).mockImplementationOnce(
      () => pendingPromise
    )

    const user = userEvent.setup()
    render(<NewsletterForm />)

    const form = screen.getByRole("form", { name: "Subscribe to newsletter" })
    const input = screen.getByLabelText("Email address")
    const submitBtn = screen.getByRole("button", { name: "SUBSCRIBE" })

    await user.type(input, "inflight@compfi.com")
    await user.click(submitBtn)

    expect(form).toHaveAttribute("aria-busy", "true")
    expect(input).toBeDisabled()
    expect(submitBtn).toBeDisabled()
    expect(screen.getByRole("button", { name: "Subscribing..." })).toBeInTheDocument()

    // Resolve
    resolvePromise!({
      success: true,
      message: "Thank you for subscribing to Compfi updates.",
    })

    await waitFor(() => {
      expect(form).toHaveAttribute("aria-busy", "false")
      expect(input).not.toBeDisabled()
      expect(submitBtn).not.toBeDisabled()
      expect(screen.getByRole("button", { name: "SUBSCRIBE" })).toBeInTheDocument()
    })
  })
})

describe("SiteFooter layout integration", () => {
  it("renders 4-column layout including Newsletter section", async () => {
    const { container } = render(<SiteFooter />)

    const footer = container.querySelector("[data-slot='site-footer']")
    expect(footer).toBeInTheDocument()

    // Headings for the sections
    expect(screen.getByRole("heading", { name: "Explore" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Connect" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Newsletter" })).toBeInTheDocument()

    // Form is present inside footer
    expect(screen.getByRole("form", { name: "Subscribe to newsletter" })).toBeInTheDocument()

    // Accessible
    expect(await checkA11y(container)).toEqual([])
  })
})
