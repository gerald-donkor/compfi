"use server"

import { db, ensureDbSchema } from "@/db"
import { contactInquiries } from "@/db/schema"
import {
  reviewContactDetails,
  type ContactDetails,
  type ContactErrors,
} from "@/lib/contact"

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
  await db.insert(contactInquiries).values({
    id: inquiryId,
    name: details.name.trim(),
    email: details.email.trim(),
    message: details.message.trim(),
    createdAt: Date.now(),
  })

  return {
    success: true,
    inquiryId,
  }
}
