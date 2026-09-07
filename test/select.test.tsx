import { describe, it, expect, vi } from "vitest"
import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select"
import { checkA11y } from "./a11y"

describe("<Select />", () => {
  it("renders trigger and displays placeholder or value", async () => {
    const handleValueChange = vi.fn()
    const { container } = render(
      <Select onValueChange={handleValueChange} defaultValue="sofa">
        <SelectTrigger aria-label="Product Category">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Living Room</SelectLabel>
            <SelectItem value="sofa">Sofas</SelectItem>
            <SelectItem value="chair">Lounge Chairs</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox", { name: "Product Category" })
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveAttribute("data-slot", "select-trigger")

    const violations = await checkA11y(container)
    expect(violations).toEqual([])
  })

  it("opens popup and selects an item on user click", async () => {
    const user = userEvent.setup()
    const handleValueChange = vi.fn()
    render(
      <Select onValueChange={handleValueChange}>
        <SelectTrigger aria-label="Sort by">
          <SelectValue placeholder="Default" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox", { name: "Sort by" })
    await user.click(trigger)

    const option = await screen.findByRole("option", { name: "Price: Low to High" })
    expect(option).toBeInTheDocument()
    await user.click(option)

    expect(handleValueChange).toHaveBeenCalledWith(
      "price-asc",
      expect.anything()
    )
  })
})
