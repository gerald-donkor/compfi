import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import HomePage from "@/app/page"
import { checkA11y } from "./a11y"

describe("HomePage", () => {
  it("renders the complete Home hierarchy in one main landmark", async () => {
    const { container } = render(<HomePage />)

    const main = screen.getByRole("main")
    expect(main).toHaveAttribute("id", "main-content")
    expect(screen.getByRole("heading", { name: "Furniture for considered rooms.", level: 1 })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Browse by room", level: 2 })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Featured furniture", level: 2 })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Rooms to make your own", level: 2 })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "#CompfiAtHome", level: 2 })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Shop the collection" })).toHaveAttribute("href", "/shop")
    expect(screen.getAllByText("Dining")[0].closest("a")).toHaveAttribute(
      "href",
      "/shop?category=dining"
    )
    expect(screen.getByRole("link", { name: "View all products" })).toHaveAttribute("href", "/shop")
    expect(screen.getAllByRole("article")).toHaveLength(8)
    expect(screen.getByRole("button", { name: "Browse furniture" })).toHaveAttribute("href", "/shop")
    expect(within(main).queryByRole("complementary", { name: "Shopping with Compfi" })).not.toBeInTheDocument()
    const gallery = screen.getByRole("heading", { name: "#CompfiAtHome" }).closest("section")
    expect(gallery).not.toBeNull()
    expect(within(gallery!).getAllByRole("img")).toHaveLength(9)

    const headings = within(main).getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)
    expect(headings).toEqual(["Browse by room", "Featured furniture", "Rooms to make your own", "#CompfiAtHome"])

    expect(await checkA11y(container)).toEqual([])
  })
})
