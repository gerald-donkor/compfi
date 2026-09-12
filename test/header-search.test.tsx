import * as React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { HeaderSearch } from "@/components/chrome/header-search"
import { checkA11y } from "./a11y"

const mockPush = vi.fn()
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/",
}))

describe("HeaderSearch", () => {
  it("renders an accessible search trigger button", async () => {
    const { container } = render(<HeaderSearch />)
    const trigger = screen.getByRole("button", { name: "Search Compfi" })
    expect(trigger).toBeInTheDocument()
    expect(await checkA11y(container)).toEqual([])
  })

  it("opens dialog on trigger click, focuses input, and closes on Escape", async () => {
    const user = userEvent.setup()
    const { container } = render(<HeaderSearch />)

    const trigger = screen.getByRole("button", { name: "Search Compfi" })
    await user.click(trigger)

    const dialog = await screen.findByRole("dialog")
    expect(dialog).toBeInTheDocument()

    const input = screen.getByRole("searchbox", { name: "Search furniture and articles" })
    await waitFor(() => expect(input).toHaveFocus())

    // Initial empty state shows suggestions and room browsing
    expect(screen.getByText("Popular Searches")).toBeInTheDocument()
    expect(screen.getByText("Browse Rooms")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Dining Room/i })).toHaveAttribute("href", "/shop?category=dining")

    // Axe check inside open dialog
    expect(await checkA11y(container)).toEqual([])

    // Press Escape to dismiss
    await user.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })

  it("populates search query when clicking a popular search suggestion", async () => {
    const user = userEvent.setup()
    render(<HeaderSearch />)

    await user.click(screen.getByRole("button", { name: "Search Compfi" }))
    await screen.findByRole("dialog")

    const sofaChip = screen.getByRole("button", { name: "Sofa" })
    await user.click(sofaChip)

    const input = screen.getByRole("searchbox")
    expect(input).toHaveValue("Sofa")

    // Shows products matching Sofa
    await waitFor(() => {
      expect(screen.getByText(/Products/i)).toBeInTheDocument()
    })
  })

  it("renders live search results for products and articles", async () => {
    const user = userEvent.setup()
    render(<HeaderSearch />)

    await user.click(screen.getByRole("button", { name: "Search Compfi" }))
    await screen.findByRole("dialog")

    const input = screen.getByRole("searchbox")
    await user.type(input, "chair")

    await waitFor(() => {
      expect(screen.getByText(/Products \(/i)).toBeInTheDocument()
    })

    // Confirm product card elements
    expect(screen.getByText("Alder Dining Chair")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /Alder Dining Chair/i })).toHaveAttribute("href", "/shop/alder-dining-chair")
  })

  it("renders accessible empty state when query returns zero results", async () => {
    const user = userEvent.setup()
    render(<HeaderSearch />)

    await user.click(screen.getByRole("button", { name: "Search Compfi" }))
    await screen.findByRole("dialog")

    const input = screen.getByRole("searchbox")
    await user.type(input, "nonexistentitemxyz")

    await waitFor(() => {
      expect(screen.getByText(/No results found for/i)).toBeInTheDocument()
    })

    const browseLink = screen.getByRole("link", { name: "Browse all furniture" })
    expect(browseLink).toHaveAttribute("href", "/shop")
  })

  it("clears search input when clicking clear button", async () => {
    const user = userEvent.setup()
    render(<HeaderSearch />)

    await user.click(screen.getByRole("button", { name: "Search Compfi" }))
    await screen.findByRole("dialog")

    const input = screen.getByRole("searchbox")
    await user.type(input, "table")
    expect(input).toHaveValue("table")

    const clearButton = screen.getByRole("button", { name: "Clear search input" })
    await user.click(clearButton)
    expect(input).toHaveValue("")
    expect(screen.getByText("Popular Searches")).toBeInTheDocument()
  })

  it("supports keyboard navigation with arrows and enter to select", async () => {
    const user = userEvent.setup()
    render(<HeaderSearch />)

    await user.click(screen.getByRole("button", { name: "Search Compfi" }))
    await screen.findByRole("dialog")

    const input = screen.getByRole("searchbox")
    await user.type(input, "Atlas")

    await waitFor(() => {
      expect(screen.getByText(/Atlas Bed/i)).toBeInTheDocument()
    })

    // Press ArrowDown to highlight first result
    await user.keyboard("{ArrowDown}")
    // Press Enter to select
    await user.keyboard("{Enter}")

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  })
})
