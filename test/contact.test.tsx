import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { ContactContent } from "@/components/contact/contact-content"
import {
  CONTACT_MAX_LENGTHS,
  reviewContactDetails,
  type ContactDetails,
  type ContactFieldName,
} from "@/lib/contact"
import { checkA11y } from "./a11y"

const validDetails: ContactDetails = {
  name: "Avery Stone",
  email: "avery@example.com",
  message: "Do you have dining tables that seat six?",
}

describe("contact detail review", () => {
  it("accepts valid input and returns an immutable empty record", () => {
    const errors = reviewContactDetails(validDetails)
    expect(errors).toEqual({})
    expect(Object.isFrozen(errors)).toBe(true)
  })

  it("rejects trimmed blanks and an invalid email shape", () => {
    const blankErrors = reviewContactDetails({
      ...validDetails,
      name: "   ",
      email: "   ",
      message: "\t",
    })
    expect(blankErrors.name).toBe("Enter your name.")
    expect(blankErrors.email).toBe("Enter your email address.")
    expect(blankErrors.message).toBe("Enter your message.")

    const emailErrors = reviewContactDetails({ ...validDetails, email: "avery@example" })
    expect(emailErrors.email).toBe("Enter a valid email address.")
  })

  it("handles missing or undefined field values defensively", () => {
    const partialErrors = reviewContactDetails({
      name: "Avery",
    } as unknown as ContactDetails)
    expect(partialErrors.name).toBeUndefined()
    expect(partialErrors.email).toBe("Enter your email address.")
    expect(partialErrors.message).toBe("Enter your message.")
  })

  it("enforces explicit upper bounds", () => {
    const boundedFields = Object.keys(CONTACT_MAX_LENGTHS) as ContactFieldName[]

    for (const fieldName of boundedFields) {
      const errors = reviewContactDetails({
        ...validDetails,
        [fieldName]: "a".repeat(CONTACT_MAX_LENGTHS[fieldName] + 1),
      })
      expect(errors[fieldName], fieldName).toBeDefined()
    }
  })
})

describe("contact presentation", () => {
  it("renders guidance and a blank form with no delivery claim", async () => {
    const { container } = render(<ContactContent />)
    expect(
      screen.getByRole("heading", { name: "Questions about furniture or your space?" }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText("Name")).toBeInTheDocument()
    expect(screen.getByLabelText("Email address")).toBeInTheDocument()
    expect(screen.getByLabelText("Message")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Send message" })).toBeInTheDocument()
    expect(screen.queryByText(/was sent/i)).not.toBeInTheDocument()
    expect(await checkA11y(container)).toEqual([])
  })

  it("validates fields and submits message with confirmation", async () => {
    const user = userEvent.setup()
    const { container } = render(<ContactContent />)

    await user.click(screen.getByRole("button", { name: "Send message" }))
    const summary = screen.getByText("Check the highlighted fields").closest("[role='alert']")
    expect(summary).not.toBeNull()
    await waitFor(() => expect(summary).toHaveFocus())
    expect(screen.getByLabelText("Name")).toHaveAttribute("aria-invalid", "true")

    await user.type(screen.getByLabelText("Name"), validDetails.name)
    expect(screen.queryByText("Enter your name.")).not.toBeInTheDocument()
    await user.type(screen.getByLabelText("Email address"), validDetails.email)
    await user.type(screen.getByLabelText("Message"), validDetails.message)

    await user.click(screen.getByRole("button", { name: "Send message" }))
    await waitFor(() => {
      expect(
        screen.getByText("Thank you! Your message has been sent. We'll be in touch soon."),
      ).toBeInTheDocument()
    })
    expect(window.location.pathname).toBe("/")
    expect(await checkA11y(container)).toEqual([])
  })
})
