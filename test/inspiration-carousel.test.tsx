import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { InspirationCarousel } from "@/components/home/inspiration-carousel"
import { inspirationSlides } from "@/lib/home-editorial"
import { checkA11y } from "./a11y"

describe("InspirationCarousel", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (this: HTMLElement) {
      const isSlide = this.getAttribute("data-slot") === "carousel-item"
      const index = isSlide ? Array.from(this.parentElement?.children ?? []).indexOf(this) : 0
      const left = isSlide ? index * 424 : 0
      return { x: left, y: 0, left, top: 0, right: left + (isSlide ? 400 : 824), bottom: 582, width: isSlide ? 400 : 824, height: 582, toJSON: () => ({}) }
    })
  })

  afterEach(() => vi.restoreAllMocks())

  it("exposes named navigation, positional slides, destinations, and status", async () => {
    const { container } = render(<InspirationCarousel slides={inspirationSlides} />)
    expect(screen.getByRole("region", { name: "Room inspiration" })).toBeInTheDocument()
    expect(screen.getAllByRole("group")).toHaveLength(4)
    expect(screen.getByRole("button", { name: "Previous room" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Next room" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Browse bedroom" })).toHaveAttribute("href", "/shop?category=bedroom")
    expect(screen.getByRole("button", { name: "Go to room 1: Quiet layers" })).toHaveAttribute("aria-current", "true")
    expect(screen.getByRole("status")).toHaveTextContent("Room 1 of 4: Quiet layers")
    expect(await checkA11y(container)).toEqual([])
  })

  it("moves by dots without stealing arrow keys from links", async () => {
    const user = userEvent.setup()
    render(<InspirationCarousel slides={inspirationSlides} />)
    await user.click(screen.getByRole("button", { name: "Go to room 4: A place to pause" }))
    expect(screen.getByRole("status")).toHaveTextContent("Room 4 of 4: A place to pause")
    const link = screen.getAllByRole("link", { name: "Browse living" })[1]
    link.focus()
    await user.keyboard("{ArrowLeft}")
    expect(link).toHaveFocus()
    expect(screen.getByRole("status")).toHaveTextContent("Room 4 of 4")
  })

  it("renders an empty collection as an inert boundary", () => {
    const { container } = render(<InspirationCarousel slides={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
