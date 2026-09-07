import { describe, it, expect } from "vitest"
import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { checkA11y } from "./a11y"

describe("Form and Field composition", () => {
  it("associates label, input, description and error", async () => {
    const { container } = render(
      <FieldGroup>
        <Field data-invalid="true">
          <FieldLabel htmlFor="email-input">Email address</FieldLabel>
          <Input
            id="email-input"
            name="email"
            type="email"
            aria-invalid="true"
            aria-describedby="email-desc email-err"
            defaultValue="invalid-email"
          />
          <FieldDescription id="email-desc">
            We will send order confirmation here.
          </FieldDescription>
          <FieldError id="email-err">
            Please enter a valid email address.
          </FieldError>
        </Field>
      </FieldGroup>
    )

    const input = screen.getByLabelText("Email address")
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(input).toHaveAttribute("aria-describedby", "email-desc email-err")

    const error = screen.getByRole("alert")
    expect(error).toHaveTextContent("Please enter a valid email address.")

    const violations = await checkA11y(container)
    expect(violations).toEqual([])
  })

  it("handles FieldSet and FieldLegend", async () => {
    const { container } = render(
      <FieldSet>
        <FieldLegend>Shipping details</FieldLegend>
        <Field>
          <FieldLabel htmlFor="address">Street address</FieldLabel>
          <Input id="address" required />
        </Field>
      </FieldSet>
    )

    expect(screen.getByText("Shipping details")).toBeInTheDocument()
    expect(screen.getByLabelText("Street address")).toBeRequired()

    const violations = await checkA11y(container)
    expect(violations).toEqual([])
  })

  it("deduplicates errors and renders nothing for empty errors", () => {
    const { container: emptyContainer } = render(
      <FieldError errors={[]} />
    )
    expect(emptyContainer.firstChild).toBeNull()

    const { rerender } = render(
      <FieldError
        errors={[
          { message: "Field is required" },
          { message: "Field is required" },
        ]}
      />
    )
    expect(screen.getByRole("alert")).toHaveTextContent("Field is required")
    expect(screen.queryByRole("list")).toBeNull()

    rerender(
      <FieldError
        errors={[
          { message: "Minimum 5 characters" },
          { message: "Must include a number" },
        ]}
      />
    )
    expect(screen.getByRole("list")).toBeInTheDocument()
    expect(screen.getAllByRole("listitem")).toHaveLength(2)
  })

  it("renders user-resizable textarea", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Field>
        <FieldLabel htmlFor="notes">Delivery instructions</FieldLabel>
        <Textarea id="notes" placeholder="Gate code, porch details..." />
      </Field>
    )

    const textarea = screen.getByLabelText("Delivery instructions")
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveClass("resize-y")

    await user.type(textarea, "Leave at front door")
    expect(textarea).toHaveValue("Leave at front door")

    const violations = await checkA11y(container)
    expect(violations).toEqual([])
  })
})
