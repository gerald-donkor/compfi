import { describe, it, expect, vi } from "vitest"
import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QuantityInput } from "@/components/commerce/quantity-input"
import { checkA11y } from "./a11y"

describe("<QuantityInput />", () => {
  it("renders with default value and accessible buttons", async () => {
    const { container } = render(<QuantityInput defaultValue={1} min={1} max={5} />)

    const spin = screen.getByRole("spinbutton", { name: "Quantity" })
    expect(spin).toHaveValue("1")

    const decBtn = screen.getByRole("button", { name: "Decrease quantity" })
    const incBtn = screen.getByRole("button", { name: "Increase quantity" })

    expect(decBtn).toBeDisabled() // at min 1
    expect(incBtn).not.toBeDisabled()

    const violations = await checkA11y(container)
    expect(violations).toEqual([])
  })

  it("increments and decrements on button click", async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<QuantityInput defaultValue={2} min={1} max={4} onValueChange={handleChange} />)

    const spin = screen.getByRole("spinbutton", { name: "Quantity" })
    const decBtn = screen.getByRole("button", { name: "Decrease quantity" })
    const incBtn = screen.getByRole("button", { name: "Increase quantity" })

    await user.click(incBtn)
    expect(spin).toHaveValue("3")
    expect(handleChange).toHaveBeenCalledWith(3)

    await user.click(incBtn)
    expect(spin).toHaveValue("4")
    expect(incBtn).toBeDisabled() // reached max 4

    await user.click(decBtn)
    expect(spin).toHaveValue("3")
    expect(handleChange).toHaveBeenCalledWith(3)
  })

  it("normalizes invalid or out-of-range typed text on blur", async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<QuantityInput defaultValue={1} min={1} max={10} onValueChange={handleChange} />)

    const spin = screen.getByRole("spinbutton", { name: "Quantity" })

    await user.clear(spin)
    await user.type(spin, "99")
    await user.tab()

    expect(spin).toHaveValue("10")
    expect(handleChange).toHaveBeenCalledWith(10)

    await user.clear(spin)
    await user.type(spin, "abc")
    await user.tab()

    expect(spin).toHaveValue("10") // restored to previous valid or min
  })

  it("supports controlled value and calls onValueChange", async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    const { rerender } = render(
      <QuantityInput value={2} onValueChange={handleChange} min={1} max={5} />
    )

    const spin = screen.getByRole("spinbutton", { name: "Quantity" })
    expect(spin).toHaveValue("2")

    const incBtn = screen.getByRole("button", { name: "Increase quantity" })
    await user.click(incBtn)
    expect(handleChange).toHaveBeenCalledWith(3)

    rerender(<QuantityInput value={3} onValueChange={handleChange} min={1} max={5} />)
    expect(spin).toHaveValue("3")
  })

  it("disables all interaction when disabled is true", () => {
    render(<QuantityInput disabled defaultValue={3} />)
    expect(screen.getByRole("spinbutton")).toBeDisabled()
    expect(screen.getByRole("button", { name: "Decrease quantity" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Increase quantity" })).toBeDisabled()
  })
})
