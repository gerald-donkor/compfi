import "server-only"

import type { OrderWithItems } from "@/db/orders"
import { formatMoney } from "@/lib/money"

export type EmailMessage = { subject: string; text: string; html: string }

export function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    }
    return entities[character]
  })
}

export function orderReceiptMessage(order: OrderWithItems): EmailMessage {
  const itemText = order.items
    .map((item) => `${item.quantity} × ${item.productTitle} — ${formatMoney(item.totalPriceCents)}`)
    .join("\n")
  const itemHtml = order.items
    .map(
      (item) =>
        `<li>${item.quantity} × ${escapeHtml(item.productTitle)} — ${escapeHtml(formatMoney(item.totalPriceCents))}</li>`
    )
    .join("")
  const total = formatMoney(order.totalCents)
  return {
    subject: `Compfi payment receipt — ${order.id}`,
    text: `Hi ${order.customerName},\n\nWe received your payment for order ${order.id}.\n\n${itemText}\n\nTotal: ${total}\n\nThank you for shopping with Compfi.`,
    html: `<p>Hi ${escapeHtml(order.customerName)},</p><p>We received your payment for order <strong>${escapeHtml(order.id)}</strong>.</p><ul>${itemHtml}</ul><p><strong>Total: ${escapeHtml(total)}</strong></p><p>Thank you for shopping with Compfi.</p>`,
  }
}

export function contactMerchantMessage(input: {
  inquiryId: string
  name: string
  email: string
  message: string
}): EmailMessage {
  return {
    subject: `Compfi contact inquiry — ${input.inquiryId}`,
    text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
    html: `<p><strong>From:</strong> ${escapeHtml(input.name)} &lt;${escapeHtml(input.email)}&gt;</p><p>${escapeHtml(input.message).replaceAll("\n", "<br>")}</p>`,
  }
}

export function contactAcknowledgmentMessage(name: string): EmailMessage {
  return {
    subject: "Compfi received your message",
    text: `Hi ${name},\n\nWe received your message. A member of the Compfi team will review it and follow up.`,
    html: `<p>Hi ${escapeHtml(name)},</p><p>We received your message. A member of the Compfi team will review it and follow up.</p>`,
  }
}
