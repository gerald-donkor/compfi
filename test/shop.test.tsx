import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import ShopError from "@/app/shop/error"
import ShopLoading from "@/app/shop/loading"
import ShopPage from "@/app/shop/page"
import { ShopResults } from "@/components/shop/shop-results"
import { resolveCatalogView } from "@/lib/catalog-view"
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

  it("renders real pagination and an accessible loading state", async () => {
    render(await ShopPage({ searchParams: Promise.resolve({ pageSize: "4", page: "2" }) }))
    expect(screen.getByRole("navigation", { name: "pagination" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByText("Showing 5–8 of 8 products")).toBeInTheDocument()

    render(<ShopLoading />)
    expect(screen.getAllByRole("main").at(-1)).toHaveAttribute("aria-busy", "true")
  })

  it("offers empty-state recovery and error retry with real controls", async () => {
    const user = userEvent.setup()
    render(<ShopResults view={resolveCatalogView([])} />)
    expect(screen.getByRole("link", { name: "View all products" })).toHaveAttribute("href", "/shop")

    const reset = vi.fn()
    render(<ShopError error={new Error("internal")} reset={reset} />)
    await user.click(screen.getByRole("button", { name: "Try again" }))
    expect(reset).toHaveBeenCalledOnce()
    expect(screen.getByRole("link", { name: "Return to Shop" })).toHaveAttribute("href", "/shop")
  })
})
