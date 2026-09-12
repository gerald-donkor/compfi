"use server"

import { eq } from "drizzle-orm"

import { db, ensureDbSchema } from "@/db"
import { contactInquiries } from "@/db/schema"
import { contactAcknowledgmentMessage, contactMerchantMessage } from "@/lib/email/messages"
import { sendTransactionalEmail } from "@/lib/email/resend"
import { reviewContactDetails, type ContactDetails, type ContactErrors } from "@/lib/contact"

export type SubmitContactResult =
  | {
      success: true
      inquiryId: string
    }
  | {
      success: false
      errors?: ContactErrors
      message?: string
    }

export async function submitContactInquiryAction(
  details: ContactDetails
): Promise<SubmitContactResult> {
  const errors = reviewContactDetails(details)
  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      message: "Please correct the errors in the form.",
    }
  }

  await ensureDbSchema()

  const inquiryId = `inq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const inquiry = {
    id: inquiryId,
    name: details.name.trim(),
    email: details.email.trim(),
    message: details.message.trim(),
    createdAt: Date.now(),
  }
  await db.insert(contactInquiries).values(inquiry)

  const merchantEmail = process.env.CONTACT_NOTIFICATION_EMAIL?.trim()
  const [customerStatus, merchantStatus] = await Promise.all([
    sendTransactionalEmail({
      to: inquiry.email,
      message: contactAcknowledgmentMessage(inquiry.name),
      idempotencyKey: `contact-ack/${inquiryId}`,
    }),
    merchantEmail
      ? sendTransactionalEmail({
          to: merchantEmail,
          message: contactMerchantMessage({ inquiryId, ...inquiry }),
          idempotencyKey: `contact-merchant/${inquiryId}`,
          replyTo: inquiry.email,
        })
      : Promise.resolve("failed" as const),
  ])

  await db
    .update(contactInquiries)
    .set({
      customerNotificationStatus: customerStatus,
      customerNotifiedAt: customerStatus === "sent" ? Date.now() : null,
      merchantNotificationStatus: merchantStatus,
      merchantNotifiedAt: merchantStatus === "sent" ? Date.now() : null,
    })
    .where(eq(contactInquiries.id, inquiryId))

  return {
    success: true,
    inquiryId,
  }
}
