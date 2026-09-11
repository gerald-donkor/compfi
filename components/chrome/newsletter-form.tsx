"use client"

import * as React from "react"
import { subscribeNewsletterAction } from "@/app/actions/newsletter"

interface StatusState {
  success: boolean
  message?: string
  error?: string
}

export function NewsletterForm() {
  const [email, setEmail] = React.useState("")
  const [isPending, setIsPending] = React.useState(false)
  const [status, setStatus] = React.useState<StatusState | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus({
        success: false,
        error: "Please enter a valid email address.",
      })
      return
    }

    setIsPending(true)
    setStatus(null)

    try {
      const result = await subscribeNewsletterAction({ email: trimmed })
      if (result.success) {
        setEmail("")
        setStatus({
          success: true,
          message: result.message,
        })
      } else {
        setStatus({
          success: false,
          error: result.error,
        })
      }
    } catch {
      setStatus({
        success: false,
        error: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Subscribe to newsletter"
      aria-busy={isPending}
      className="flex flex-col gap-2"
    >
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Enter Your Email Address"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status && !status.success) {
              setStatus(null)
            }
          }}
          disabled={isPending}
          aria-describedby={status ? "newsletter-status" : undefined}
          aria-invalid={status && !status.success ? "true" : undefined}
          className="h-11 min-w-0 flex-1 border-b border-foreground/40 bg-transparent px-0 py-2 text-sm text-foreground placeholder:text-muted focus-visible:border-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 sm:max-w-56"
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 shrink-0 items-center justify-center border-b border-foreground px-2 text-sm font-semibold uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {isPending ? "Subscribing..." : "SUBSCRIBE"}
        </button>
      </div>

      <div
        id="newsletter-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="min-h-5 text-xs"
      >
        {status?.success && (
          <p className="font-medium text-emerald-700 dark:text-emerald-400">
            {status.message}
          </p>
        )}
        {status && !status.success && (
          <p className="font-medium text-destructive">
            {status.error}
          </p>
        )}
      </div>
    </form>
  )
}
