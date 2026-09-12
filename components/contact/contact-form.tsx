"use client"

import * as React from "react"

import { CheckCircle2Icon } from "lucide-react"

import { submitContactInquiryAction } from "@/app/actions/contact"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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

const SUCCESS_MESSAGE = "Thank you! Your message was received. We'll be in touch soon."

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
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)
  const errorSummaryRef = React.useRef<HTMLDivElement>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const details = detailsFrom(event.currentTarget)
    const nextErrors = reviewContactDetails(details)
    setStatus("")
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => errorSummaryRef.current?.focus())
      return
    }

    setIsSubmitting(true)
    try {
      const result = await submitContactInquiryAction(details, {
        website: String(new FormData(event.currentTarget).get("website") ?? ""),
      })
      if (!result.success) {
        if (result.errors) {
          setErrors(result.errors)
          requestAnimationFrame(() => errorSummaryRef.current?.focus())
        } else if (result.message) {
          setStatus(result.message)
        }
        return
      }

      formRef.current?.reset()
      setStatus(SUCCESS_MESSAGE)
    } catch {
      setStatus("An unexpected error occurred while sending your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
      ref={formRef}
      aria-label="Send a message to Compfi"
      className="contact-form"
      noValidate
      onSubmit={handleSubmit}
      onChange={handleChange}
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[10000px] size-px overflow-hidden"
      />
      <FieldSet>
        <FieldLegend className="type-heading-lg">Send us a message</FieldLegend>
        <FieldDescription>
          Share your question and the best email address for a reply.
        </FieldDescription>
        {Object.keys(errors).length ? (
          <div ref={errorSummaryRef} tabIndex={-1} role="alert" className="contact-error-summary">
            <h3 className="font-semibold">Check the highlighted fields</h3>
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
            type="text"
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
              Share details about your space, dimensions, or design questions.
            </FieldDescription>
            {messageError ? <FieldError id="contact-message-error">{messageError}</FieldError> : null}
          </Field>
        </FieldGroup>
      </FieldSet>
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="contact-submit"
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
      {status ? (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className={cn(
            "rounded-lg p-4 text-sm font-medium border flex items-start gap-3",
            status === SUCCESS_MESSAGE
              ? "bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800"
              : "bg-destructive/10 text-destructive border-destructive/20",
          )}
        >
          {status === SUCCESS_MESSAGE ? (
            <CheckCircle2Icon
              className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5"
              aria-hidden="true"
            />
          ) : null}
          <span>{status}</span>
        </div>
      ) : null}
    </form>
  )
}
