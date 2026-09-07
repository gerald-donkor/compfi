import { describe, it, expect, vi } from "vitest"
import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Link } from "@/components/ui/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckIcon } from "lucide-react"
import { checkA11y } from "./a11y"

describe("<Button />", () => {
  it("renders with default slot, type and responds to clicks", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    const { container } = render(<Button onClick={handleClick}>Shop now</Button>)

    const btn = screen.getByRole("button", { name: "Shop now" })
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute("data-slot", "button")
    await user.click(btn)
    expect(handleClick).toHaveBeenCalledTimes(1)

    const violations = await checkA11y(container)
    expect(violations).toEqual([])
  })

  it("respects disabled state and prevents click handler", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled action</Button>)

    const btn = screen.getByRole("button", { name: "Disabled action" })
    expect(btn).toBeDisabled()
    await user.click(btn)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it("supports render composition with nativeButton=false for links", () => {
    render(
      <Button render={<a href="/catalog" />} nativeButton={false}>
        Browse catalog
      </Button>
    )
    const btn = screen.getByRole("button", { name: "Browse catalog" })
    expect(btn.tagName.toLowerCase()).toBe("a")
    expect(btn).toHaveAttribute("href", "/catalog")
    expect(btn).toHaveAttribute("data-slot", "button")
  })
})

describe("<IconButton />", () => {
  it("sets accessible name via required label and hides decorative icon", async () => {
    const { container } = render(<IconButton label="Add to favorites" icon={CheckIcon} />)
    const btn = screen.getByRole("button", { name: "Add to favorites" })
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute("data-slot", "icon-button")

    const svg = btn.querySelector("svg")
    expect(svg).toHaveAttribute("aria-hidden", "true")

    const violations = await checkA11y(container)
    expect(violations).toEqual([])
  })
})

describe("<Link />", () => {
  it("renders internal link with data-slot and variants", async () => {
    const { container } = render(
      <Link href="/rooms/living-room" variant="muted">
        Living Room
      </Link>
    )
    const el = screen.getByRole("link", { name: "Living Room" })
    expect(el).toBeInTheDocument()
    expect(el).toHaveAttribute("href", "/rooms/living-room")
    expect(el).toHaveAttribute("data-slot", "link")

    const violations = await checkA11y(container)
    expect(violations).toEqual([])
  })
})

describe("<Badge />", () => {
  it("renders descriptive badge with text and data-slot", async () => {
    const { container } = render(
      <div>
        <Badge variant="default">Featured</Badge>
        <Badge variant="discount">-30%</Badge>
        <Badge variant="new">New</Badge>
      </div>
    )
    expect(screen.getByText("Featured")).toHaveAttribute("data-slot", "badge")
    expect(screen.getByText("-30%")).toBeInTheDocument()
    expect(screen.getByText("New")).toBeInTheDocument()

    const violations = await checkA11y(container)
    expect(violations).toEqual([])
  })
})

describe("<Separator />", () => {
  it("renders horizontal decorative separator by default", () => {
    const { container } = render(<Separator />)
    const sep = container.querySelector("[data-slot='separator']")
    expect(sep).toBeInTheDocument()
    expect(sep).toHaveAttribute("data-orientation", "horizontal")
    expect(sep).toHaveAttribute("aria-hidden", "true")
  })

  it("renders vertical semantic separator when decorative is false", () => {
    render(<Separator orientation="vertical" decorative={false} />)
    const sep = screen.getByRole("separator")
    expect(sep).toBeInTheDocument()
    expect(sep).toHaveAttribute("aria-orientation", "vertical")
  })
})
