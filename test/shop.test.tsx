import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import ShopPage from "@/app/shop/page"
import { checkA11y } from "./a11y"

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }))

describe("ShopPage", () => {
  it("renders truthful default catalog results in one main landmark", async () => {
    const { container } = render(await ShopPage({ searchParams: Promise.resolve({}) }))
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content")
    expect(screen.getByRole("heading", { name: "Shop", level: 1 })).toBeInTheDocument()
    expect(screen.getByText("Showing 1–8 of 8 products")).toBeInTheDocument()
    expect(screen.getAllByRole("article")).toHaveLength(8)
    expect(screen.queryByRole("navigation", { name: "pagination" })).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Grid view" })).toHaveAttribute("tabindex", "0")
    expect(screen.getByRole("button", { name: "List view" })).toHaveAttribute("tabindex", "-1")
    expect(await checkA11y(container)).toEqual([])
  })

  it("renders filtered, paginated results from URL state", async () => {
    render(await ShopPage({ searchParams: Promise.resolve({ category: "living", pageSize: "4", view: "list" }) }))
    expect(screen.getByText("Showing 1–3 of 3 products")).toBeInTheDocument()
    expect(screen.getAllByRole("article")).toHaveLength(3)
  })
})
