import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { InspirationCarousel } from "@/components/home/inspiration-carousel"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { inspirationSlides } from "@/lib/home-editorial"
import { checkA11y } from "./a11y"

describe("InspirationCarousel", () => {
  beforeEach(() => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) {
      return this.getAttribute("data-slot") === "carousel-item" ? 400 : 824
    })
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(582)
    vi.spyOn(HTMLElement.prototype, "offsetTop", "get").mockReturnValue(0)
    vi.spyOn(HTMLElement.prototype, "offsetLeft", "get").mockImplementation(function (this: HTMLElement) {
      if (this.getAttribute("data-slot") !== "carousel-item") return 0
      return Array.from(this.parentElement?.children ?? []).indexOf(this) * 424
    })
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
    expect(screen.getByRole("link", { name: "Browse dining" })).toHaveAttribute("href", "/shop?category=dining")
    expect(screen.getAllByRole("link", { name: "Browse living" })).toHaveLength(2)
    for (const [index, slide] of inspirationSlides.entries()) {
      expect(screen.getByRole("group", { name: `${index + 1} of 4` })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: `Go to room ${index + 1}: ${slide.title}` })).toBeInTheDocument()
    }
    expect(screen.getByRole("button", { name: "Go to room 1: Quiet layers" })).toHaveAttribute("aria-current", "true")
    expect(screen.getByRole("status")).toHaveTextContent("Room 1 of 4: Quiet layers")
    expect(await checkA11y(container)).toEqual([])
  })

  it("moves through first, middle, and last positions without stealing link arrow keys", async () => {
    const user = userEvent.setup()
    render(<InspirationCarousel slides={inspirationSlides} />)
    await waitFor(() => expect(screen.getByRole("button", { name: "Next room" })).toBeEnabled())
    await user.click(screen.getByRole("button", { name: "Next room" }))
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Room 2 of 4: Room to gather"))
    await user.click(screen.getByRole("button", { name: "Previous room" }))
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Room 1 of 4: Quiet layers"))
    await user.click(screen.getByRole("button", { name: "Go to room 4: A place to pause" }))
    expect(screen.getByRole("status")).toHaveTextContent("Room 4 of 4: A place to pause")
    await waitFor(() => expect(screen.getByRole("button", { name: "Next room" })).toBeDisabled())
    const link = screen.getAllByRole("link", { name: "Browse living" })[1]
    link.focus()
    await user.keyboard("{ArrowLeft}")
    expect(link).toHaveFocus()
    expect(screen.getByRole("status")).toHaveTextContent("Room 4 of 4")
  })

  it("honors reduced motion and releases registered Embla listeners", async () => {
    const addEventListener = vi.fn()
    const removeEventListener = vi.fn()
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: true, addEventListener, removeEventListener }))
    const requestFrame = vi.spyOn(window, "requestAnimationFrame")
    const user = userEvent.setup()
    const rendered = render(<InspirationCarousel slides={inspirationSlides} />)
    requestFrame.mockClear()
    await user.click(screen.getByRole("button", { name: "Go to room 2: Room to gather" }))
    expect(screen.getByRole("status")).toHaveTextContent("Room 2 of 4")
    expect(requestFrame).not.toHaveBeenCalled()
    rendered.rerender(<InspirationCarousel slides={[...inspirationSlides]} />)
    expect(screen.getByRole("status")).toHaveTextContent("Room 2 of 4")
    rendered.unmount()
    expect(removeEventListener).toHaveBeenCalledWith("change", expect.any(Function))

    let api: CarouselApi
    const primitive = render(
      <Carousel setApi={(value) => { api = value }}>
        <CarouselContent><CarouselItem>One</CarouselItem><CarouselItem>Two</CarouselItem></CarouselContent>
      </Carousel>
    )
    await waitFor(() => expect(api!).toBeDefined())
    const off = vi.spyOn(api!, "off")
    primitive.unmount()
    expect(off).toHaveBeenCalledWith("select", expect.any(Function))
    expect(off).toHaveBeenCalledWith("reInit", expect.any(Function))
  })

  it("renders an empty collection as an inert boundary", () => {
    const { container } = render(<InspirationCarousel slides={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
