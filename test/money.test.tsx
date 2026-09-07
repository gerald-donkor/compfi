import { describe, it, expect } from "vitest"
import { formatMoney } from "@/lib/money"
import { render, screen } from "@testing-library/react"
import { Money } from "@/components/commerce/money"

describe("formatMoney", () => {
  it("formats zero cents correctly", () => {
    expect(formatMoney(0)).toBe("$0.00")
  })

  it("formats ordinary amounts correctly", () => {
    expect(formatMoney(2500)).toBe("$25.00")
    expect(formatMoney(4999)).toBe("$49.99")
  })

  it("formats thousands with thousands separator", () => {
    expect(formatMoney(125000)).toBe("$1,250.00")
    expect(formatMoney(2500000)).toBe("$25,000.00")
  })

  it("formats negative amounts correctly", () => {
    expect(formatMoney(-1500)).toBe("-$15.00")
  })

  it("throws TypeError for non-integer numbers", () => {
    expect(() => formatMoney(25.5)).toThrow(TypeError)
    expect(() => formatMoney(NaN)).toThrow(TypeError)
    expect(() => formatMoney(Infinity)).toThrow(TypeError)
  })
})

describe("<Money />", () => {
  it("renders formatted USD and forwards span props and data-slot", () => {
    render(<Money amountCents={18900} data-testid="price-tag" />)
    const el = screen.getByTestId("price-tag")
    expect(el).toHaveTextContent("$189.00")
    expect(el).toHaveAttribute("data-slot", "money")
  })
})
