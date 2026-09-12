import { createHmac } from "node:crypto"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { reconcileFlutterwavePayment } = vi.hoisted(() => ({
  reconcileFlutterwavePayment: vi.fn(),
}))

vi.mock("@/lib/payments/fulfillment", () => ({ reconcileFlutterwavePayment }))

import { POST } from "@/app/api/payments/flutterwave/webhook/route"

function signedRequest(body: string, signature?: string) {
  const mac = signature ?? createHmac("sha256", "webhook-secret").update(body).digest("base64")
  return new Request("https://compfi.com/api/payments/flutterwave/webhook", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
      "flutterwave-signature": mac,
    },
  })
}

describe("Flutterwave webhook route", () => {
  beforeEach(() => {
    vi.stubEnv("FLUTTERWAVE_SECRET_HASH", "webhook-secret")
    reconcileFlutterwavePayment.mockResolvedValue({
      status: "paid",
      order: {},
    })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  it("rejects an invalid signature before parsing or reconciliation", async () => {
    const response = await POST(signedRequest('{"bad":', "invalid"))
    expect(response.status).toBe(401)
    expect(reconcileFlutterwavePayment).not.toHaveBeenCalled()
  })

  it("returns 400 for malformed signed JSON and acknowledges irrelevant events", async () => {
    expect((await POST(signedRequest('{"bad":'))).status).toBe(400)
    const response = await POST(
      signedRequest(JSON.stringify({ id: 1, type: "transfer.completed" }))
    )
    expect(response.status).toBe(200)
    expect(reconcileFlutterwavePayment).not.toHaveBeenCalled()
  })

  it("reconciles a complete event using only normalized identifiers", async () => {
    const body = JSON.stringify({
      id: 91,
      type: "charge.completed",
      data: { id: 42, tx_ref: "ORD-123", amount: 1 },
    })
    const response = await POST(signedRequest(body))
    expect(response.status).toBe(200)
    expect(reconcileFlutterwavePayment).toHaveBeenCalledWith({
      transactionId: "42",
      paymentReference: "ORD-123",
      eventId: "flutterwave:91",
      eventType: "charge.completed",
    })
  })

  it("accepts Flutterwave Standard v3's documented verification hash", async () => {
    const body = JSON.stringify({
      id: 93,
      type: "charge.completed",
      data: { id: 44, tx_ref: "ORD-125" },
    })
    const request = new Request("https://compfi.com/api/payments/flutterwave/webhook", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json", "verif-hash": "webhook-secret" },
    })
    expect((await POST(request)).status).toBe(200)
    expect(reconcileFlutterwavePayment).toHaveBeenCalledWith(
      expect.objectContaining({ paymentReference: "ORD-125" })
    )
  })

  it("asks Flutterwave to retry a temporarily unverified transaction", async () => {
    reconcileFlutterwavePayment.mockResolvedValueOnce({
      status: "pending",
      order: null,
    })
    const body = JSON.stringify({
      id: 92,
      type: "charge.completed",
      data: { id: 43, tx_ref: "ORD-124" },
    })
    expect((await POST(signedRequest(body))).status).toBe(503)
  })
})
