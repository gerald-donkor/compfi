import { describe, it, expect, vi } from "vitest"
import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ColorSelector, type ColorOption } from "@/components/commerce/color-swatch"
import { SizeSelector, type SizeOption } from "@/components/commerce/size-selector"
import { checkA11y } from "./a11y"

describe("<ColorSelector />", () => {
  const options: ColorOption[] = [
    { value: "walnut", label: "Walnut Brown", color: "#5C4033" },
    { value: "sand", label: "Sand Linen", color: "#D2B48C" },
    { value: "charcoal", label: "Charcoal Black", color: "#36454F", disabled: true },
  ]

  it("renders swatches and selects an option", async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    const { container } = render(
      <ColorSelector
        options={options}
        defaultValue="walnut"
        onValueChange={handleChange}
      />
    )

    const walnutBtn = screen.getByRole("button", { name: "Walnut Brown" })
    const sandBtn = screen.getByRole("button", { name: "Sand Linen" })
    const charcoalBtn = screen.getByRole("button", { name: "Charcoal Black" })

    expect(walnutBtn).toHaveAttribute("aria-pressed", "true")
    expect(sandBtn).toHaveAttribute("aria-pressed", "false")
    expect(charcoalBtn).toBeDisabled()

    await user.click(sandBtn)
    expect(handleChange).toHaveBeenCalledWith("sand")

    const violations = await checkA11y(container)
    expect(violations).toEqual([])
  })

  it("handles empty options gracefully", () => {
    render(<ColorSelector options={[]} />)
    expect(screen.getByText("No colors available")).toBeInTheDocument()
  })

  it("throws on duplicate option values in development", () => {
    const dupOptions: ColorOption[] = [
      { value: "oak", label: "Oak 1", color: "#000" },
      { value: "oak", label: "Oak 2", color: "#fff" },
    ]
    expect(() => render(<ColorSelector options={dupOptions} />)).toThrow(
      /Duplicate value in ColorSelector options: "oak"/
    )
  })
})

describe("<SizeSelector />", () => {
  const options: SizeOption[] = [
    { value: "sm", label: "S" },
    { value: "md", label: "M" },
    { value: "lg", label: "L", disabled: true },
  ]

  it("renders sizes and selects on user click", async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    const { container } = render(
      <SizeSelector
        options={options}
        defaultValue="sm"
        onValueChange={handleChange}
      />
    )

    const sBtn = screen.getByRole("button", { name: "S" })
    const mBtn = screen.getByRole("button", { name: "M" })
    const lBtn = screen.getByRole("button", { name: "L" })

    expect(sBtn).toHaveAttribute("aria-pressed", "true")
    expect(mBtn).toHaveAttribute("aria-pressed", "false")
    expect(lBtn).toBeDisabled()

    await user.click(mBtn)
    expect(handleChange).toHaveBeenCalledWith("md")

    const violations = await checkA11y(container)
    expect(violations).toEqual([])
  })

  it("handles empty options gracefully", () => {
    render(<SizeSelector options={[]} />)
    expect(screen.getByText("No sizes available")).toBeInTheDocument()
  })

  it("throws on duplicate option values in development", () => {
    const dupOptions: SizeOption[] = [
      { value: "xl", label: "XL" },
      { value: "xl", label: "Extra Large" },
    ]
    expect(() => render(<SizeSelector options={dupOptions} />)).toThrow(
      /Duplicate value in SizeSelector options: "xl"/
    )
  })
})
