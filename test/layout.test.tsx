import { describe, it, expect } from "vitest"
import * as React from "react"
import { render, screen } from "@testing-library/react"
import { Section } from "@/components/layout/section"
import { Stack } from "@/components/layout/stack"
import { Cluster } from "@/components/layout/cluster"
import { checkA11y } from "./a11y"

describe("Layout primitives", () => {
  it("renders Section with spacing variants and slot", async () => {
    const { container } = render(
      <Section spacing="spacious" aria-label="Hero showcase">
        <h1>Room ideas</h1>
      </Section>
    )

    const sec = screen.getByRole("region", { name: "Hero showcase" })
    expect(sec).toBeInTheDocument()
    expect(sec).toHaveAttribute("data-slot", "section")
    expect(sec).toHaveAttribute("data-spacing", "spacious")

    const violations = await checkA11y(container)
    expect(violations).toEqual([])
  })

  it("renders Stack with gap variants and slot", () => {
    render(
      <Stack gap="loose" data-testid="stack-test">
        <div>First</div>
        <div>Second</div>
      </Stack>
    )

    const el = screen.getByTestId("stack-test")
    expect(el).toHaveAttribute("data-slot", "stack")
    expect(el).toHaveAttribute("data-gap", "loose")
  })

  it("renders Cluster with wrapping and alignment variants", () => {
    render(
      <Cluster gap="compact" align="center" data-testid="cluster-test">
        <button type="button">Action 1</button>
        <button type="button">Action 2</button>
      </Cluster>
    )

    const el = screen.getByTestId("cluster-test")
    expect(el).toHaveAttribute("data-slot", "cluster")
    expect(el).toHaveAttribute("data-gap", "compact")
    expect(el).toHaveAttribute("data-align", "center")
  })
})
