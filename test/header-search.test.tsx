import * as React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { HeaderSearch } from "@/components/chrome/header-search"
import { checkA11y } from "./a11y"

vi.mock("next/navigation", () => ({
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
    expect(dialog).toHaveAttribute("data-slot", "header-search")

    const input = screen.getByRole("combobox", { name: "Search furniture and articles" })
    await waitFor(() => expect(input).toHaveFocus())
    expect(input).toHaveAttribute("aria-expanded", "true")

    // Initial empty state shows suggested categories and popular searches chips
    expect(screen.getByText("Suggested Categories")).toBeInTheDocument()
    expect(screen.getByText("Popular Searches")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Dining" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Living" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Bedroom" })).toBeInTheDocument()

    // Axe check inside open dialog
    expect(await checkA11y(container)).toEqual([])

    // Press Escape to dismiss
    await user.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })

  it("populates search query when clicking a category or popular search suggestion", async () => {
    const user = userEvent.setup()
    render(<HeaderSearch />)

    await user.click(screen.getByRole("button", { name: "Search Compfi" }))
    await screen.findByRole("dialog")

    const diningChip = screen.getByRole("button", { name: "Dining" })
    await user.click(diningChip)

    const input = screen.getByRole("combobox")
    expect(input).toHaveValue("Dining")

    // Shows products matching Dining
    await waitFor(() => {
      expect(screen.getByText(/Products \(/i)).toBeInTheDocument()
    })
  })

  it("renders live search results with term highlighting for products and articles", async () => {
    const user = userEvent.setup()
    render(<HeaderSearch />)

    await user.click(screen.getByRole("button", { name: "Search Compfi" }))
    await screen.findByRole("dialog")

    const input = screen.getByRole("combobox")
    await user.type(input, "chair")

    await waitFor(() => {
      expect(screen.getByText(/Products \(/i)).toBeInTheDocument()
    })

    // Confirm product card elements and term highlighting
    const productOption = screen.getByRole("option", { name: /Alder Dining Chair/i })
    expect(productOption).toHaveAttribute("href", "/shop/alder-dining-chair")

    // Term highlighting in title
    const mark = productOption.querySelector("mark")
    expect(mark).toBeInTheDocument()
    expect(mark?.textContent?.toLowerCase()).toBe("chair")
  })

  it("renders accessible empty state when query returns zero results", async () => {
    const user = userEvent.setup()
    render(<HeaderSearch />)

    await user.click(screen.getByRole("button", { name: "Search Compfi" }))
    await screen.findByRole("dialog")

    const input = screen.getByRole("combobox")
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

    const input = screen.getByRole("combobox")
    await user.type(input, "table")
    expect(input).toHaveValue("table")

    const clearButton = screen.getByRole("button", { name: "Clear search input" })
    await user.click(clearButton)
    expect(input).toHaveValue("")
    expect(screen.getByText("Popular Searches")).toBeInTheDocument()
  })

  it("supports keyboard navigation and enter submission", async () => {
    const user = userEvent.setup()
    render(<HeaderSearch />)

    await user.click(screen.getByRole("button", { name: "Search Compfi" }))
    await screen.findByRole("dialog")

    const input = screen.getByRole("combobox")
    await user.type(input, "Atlas")

    await waitFor(() => {
      expect(screen.getByRole("option", { name: /Atlas Bed/i })).toBeInTheDocument()
    })

    // Press ArrowDown to highlight first result and set aria-activedescendant
    await user.keyboard("{ArrowDown}")
    expect(input).toHaveAttribute("aria-activedescendant", "atlas-bed")

    // Press Enter to select
    await user.keyboard("{Enter}")
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  })

  it("supports instant Enter submission on query without prior arrow navigation", async () => {
    const user = userEvent.setup()
    render(<HeaderSearch />)

    await user.click(screen.getByRole("button", { name: "Search Compfi" }))
    await screen.findByRole("dialog")

    const input = screen.getByRole("combobox")
    await user.type(input, "Atlas")

    await waitFor(() => {
      expect(screen.getByRole("option", { name: /Atlas Bed/i })).toBeInTheDocument()
    })

    // Press Enter directly
    await user.keyboard("{Enter}")
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
  })
})
