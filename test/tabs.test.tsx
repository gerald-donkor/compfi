import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { checkA11y } from "./a11y"

function TabsExample() {
  return (
    <Tabs defaultValue="description" aria-label="Catalog information" data-slot="caller-root">
      <TabsList aria-label="Product information" data-slot="caller-list">
        <TabsTrigger value="description" data-slot="caller-trigger">
          Description
        </TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="disabled" disabled>Unavailable</TabsTrigger>
      </TabsList>
      <TabsContent value="description" data-slot="caller-content">
        Description content
      </TabsContent>
      <TabsContent value="details">Details content</TabsContent>
      <TabsContent value="disabled">Unavailable content</TabsContent>
    </Tabs>
  )
}

describe("Tabs", () => {
  it("protects slots, forwards native props, and exposes accessible state", async () => {
    const { container } = render(<TabsExample />)

    expect(container.querySelector("[data-slot='tabs']")).toHaveAttribute(
      "aria-label",
      "Catalog information"
    )
    expect(screen.getByRole("tablist", { name: "Product information" })).toHaveAttribute(
      "data-slot",
      "tabs-list"
    )
    expect(screen.getByRole("tab", { name: "Description" })).toHaveAttribute(
      "data-slot",
      "tabs-trigger"
    )
    expect(screen.getByRole("tabpanel", { name: "Description" })).toHaveAttribute(
      "data-slot",
      "tabs-content"
    )
    expect(screen.getByRole("tab", { name: "Unavailable" })).toHaveAttribute(
      "aria-disabled",
      "true"
    )
    expect(await checkA11y(container)).toEqual([])
  })

  it("supports click, arrow, Home, and End keyboard behavior", async () => {
    const user = userEvent.setup()
    render(<TabsExample />)
    const description = screen.getByRole("tab", { name: "Description" })
    const details = screen.getByRole("tab", { name: "Details" })
    const unavailable = screen.getByRole("tab", { name: "Unavailable" })

    await user.click(description)
    await user.keyboard("{ArrowRight}")
    expect(details).toHaveFocus()
    expect(description).toHaveAttribute("aria-selected", "true")

    await user.keyboard("{Enter}")
    expect(details).toHaveAttribute("aria-selected", "true")
    expect(screen.getByRole("tabpanel", { name: "Details" })).toHaveTextContent(
      "Details content"
    )

    await user.keyboard("{Home}")
    expect(description).toHaveFocus()
    await user.keyboard("{End}")
    expect(unavailable).toHaveFocus()
    await user.keyboard("{Enter}")
    expect(details).toHaveAttribute("aria-selected", "true")
    await user.keyboard("{ArrowLeft}")
    expect(details).toHaveFocus()
    await user.keyboard("{ArrowLeft}")
    expect(description).toHaveFocus()
  })

  it("passes vertical orientation to Base UI keyboard behavior", async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="one" orientation="vertical">
        <TabsList aria-label="Vertical tabs">
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">One panel</TabsContent>
        <TabsContent value="two">Two panel</TabsContent>
      </Tabs>
    )

    const one = screen.getByRole("tab", { name: "One" })
    await user.click(one)
    await user.keyboard("{ArrowDown}")
    expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus()
  })
})
