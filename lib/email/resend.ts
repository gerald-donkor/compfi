import "server-only"

import type { EmailMessage } from "./messages"

export type EmailDeliveryStatus = "sent" | "failed"

export async function sendTransactionalEmail(input: {
  to: string
  message: EmailMessage
  idempotencyKey: string
  replyTo?: string
}): Promise<EmailDeliveryStatus> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.RESEND_FROM_EMAIL?.trim()
  if (!apiKey || !from) return "failed"

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": input.idempotencyKey,
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.message.subject,
        text: input.message.text,
        html: input.message.html,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    })
    return response.ok ? "sent" : "failed"
  } catch {
    return "failed"
  }
}
