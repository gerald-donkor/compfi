"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input, type InputProps } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  CONTACT_FIELD_NAMES,
  CONTACT_MAX_LENGTHS,
  reviewContactDetails,
  type ContactDetails,
  type ContactErrors,
  type ContactFieldName,
} from "@/lib/contact"

const SUCCESS_MESSAGE = "Message checked. It was not sent and no email was delivered."

const FIELD_LABELS: Readonly<Record<ContactFieldName, string>> = Object.freeze({
  name: "Name",
  email: "Email address",
  message: "Message",
})

type ContactInputFieldProps = Omit<InputProps, "id" | "name"> & {
  name: ContactFieldName
  error?: string
}

function ContactInputField({ name, error, ...props }: ContactInputFieldProps) {
  const id = `contact-${name}`
  const errorId = `${id}-error`

  return (
    <Field data-invalid={error ? "true" : undefined}>
      <FieldLabel htmlFor={id}>{FIELD_LABELS[name]}</FieldLabel>
      <Input
        {...props}
        id={id}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </Field>
  )
}

function detailsFrom(form: HTMLFormElement): ContactDetails {
  const formData = new FormData(form)
  return Object.freeze(
    Object.fromEntries(
      CONTACT_FIELD_NAMES.map((fieldName) => [fieldName, String(formData.get(fieldName) ?? "")]),
    ) as Record<ContactFieldName, string>,
  )
}

function isContactFieldName(value: string): value is ContactFieldName {
  return CONTACT_FIELD_NAMES.some((fieldName) => fieldName === value)
}

export function ContactForm() {
  const [errors, setErrors] = React.useState<ContactErrors>({})
  const [status, setStatus] = React.useState("")
  const errorSummaryRef = React.useRef<HTMLDivElement>(null)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = reviewContactDetails(detailsFrom(event.currentTarget))
    setStatus("")
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => errorSummaryRef.current?.focus())
      return
    }

    setStatus(SUCCESS_MESSAGE)
  }

  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    setStatus("")
    const target = event.target
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return
    if (!isContactFieldName(target.name) || !errors[target.name]) return
    const fieldName = target.name
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors }
      delete nextErrors[fieldName]
      return Object.freeze(nextErrors)
    })
  }

  const messageError = errors.message

  return (
    <form
      aria-label="Contact message review"
      className="contact-form"
      noValidate
      onSubmit={handleSubmit}
      onChange={handleChange}
    >
      <FieldSet>
        <FieldLegend className="type-heading-lg">Send us a message</FieldLegend>
        <FieldDescription>
          Review your details below. Nothing is sent, stored, or emailed in this preview.
        </FieldDescription>
        {Object.keys(errors).length ? (
          <div ref={errorSummaryRef} tabIndex={-1} role="alert" className="contact-error-summary">
            <h2 className="font-semibold">Check the highlighted fields</h2>
            <ul className="mt-2 list-disc pl-5">
              {CONTACT_FIELD_NAMES.flatMap((fieldName) =>
                errors[fieldName]
                  ? [
                      <li key={fieldName}>
                        <a href={`#contact-${fieldName}`}>
                          {FIELD_LABELS[fieldName]}: {errors[fieldName]}
                        </a>
                      </li>,
                    ]
                  : [],
              )}
            </ul>
          </div>
        ) : null}
        <FieldGroup className="contact-field-group">
          <ContactInputField
            name="name"
            error={errors.name}
            required
            maxLength={CONTACT_MAX_LENGTHS.name}
            autoComplete="name"
            placeholder="Avery Stone"
          />
          <ContactInputField
            name="email"
            error={errors.email}
            required
            type="email"
            maxLength={CONTACT_MAX_LENGTHS.email}
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            placeholder="you@example.com"
          />
          <Field data-invalid={messageError ? "true" : undefined}>
            <FieldLabel htmlFor="contact-message">{FIELD_LABELS.message}</FieldLabel>
            <Textarea
              id="contact-message"
              name="message"
              required
              rows={6}
              maxLength={CONTACT_MAX_LENGTHS.message}
              autoComplete="off"
              placeholder="Tell us about your room and needs…"
              aria-invalid={Boolean(messageError)}
              aria-describedby={
                messageError
                  ? "contact-message-description contact-message-error"
                  : "contact-message-description"
              }
            />
            <FieldDescription id="contact-message-description">
              Messages are reviewed locally and are not sent or saved.
            </FieldDescription>
            {messageError ? <FieldError id="contact-message-error">{messageError}</FieldError> : null}
          </Field>
        </FieldGroup>
      </FieldSet>
      <Button type="submit" size="lg" className="contact-submit">
        Check message
      </Button>
      <p aria-live="polite" aria-atomic="true" className="type-body-sm font-medium">
        {status}
      </p>
    </form>
  )
}
