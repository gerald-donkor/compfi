import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import HomePage from "@/app/page"
import { checkA11y } from "./a11y"

describe("HomePage", () => {
  it("renders the campaign, room navigation, featured catalog, and benefits in one main landmark", async () => {
    const { container } = render(<HomePage />)

    const main = screen.getByRole("main")
    expect(main).toHaveAttribute("id", "main-content")
    expect(screen.getByRole("heading", { name: "Furniture for considered rooms.", level: 1 })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Browse by room", level: 2 })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Featured furniture", level: 2 })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Shop the collection" })).toHaveAttribute("href", "/shop")
    expect(screen.getByText("Dining").closest("a")).toHaveAttribute(
      "href",
      "/shop?category=dining"
    )
    expect(screen.getByRole("link", { name: "View all products" })).toHaveAttribute("href", "/shop")
    expect(screen.getAllByRole("article")).toHaveLength(8)
    expect(within(main).getByRole("complementary", { name: "Shopping with Compfi" })).toBeInTheDocument()

    expect(await checkA11y(container)).toEqual([])
  })
})
