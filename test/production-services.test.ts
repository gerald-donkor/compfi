import { createHmac } from "node:crypto"
import { afterEach, describe, expect, it, vi } from "vitest"

import { resolveDatabaseConfig } from "@/db/config"
import { contactMerchantMessage, escapeHtml } from "@/lib/email/messages"
import { sendTransactionalEmail } from "@/lib/email/resend"
import {
  initializeFlutterwavePayment,
  isFlutterwaveCheckoutUrl,
  usdCentsToDecimal,
  verifyFlutterwaveSignature,
  verifyFlutterwaveTransaction,
} from "@/lib/payments/flutterwave"

describe("production service contracts", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it("selects local SQLite by default and requires complete Turso configuration", () => {
    expect(resolveDatabaseConfig({}, "/workspace")).toEqual({
      url: "file:/workspace/data/compfi.db",
      isRemote: false,
    })
    expect(() => resolveDatabaseConfig({ TURSO_DATABASE_URL: "libsql://example" })).toThrow(
      "both TURSO_DATABASE_URL and TURSO_AUTH_TOKEN"
    )
    expect(
      resolveDatabaseConfig({
        TURSO_DATABASE_URL: "libsql://compfi.turso.io",
        TURSO_AUTH_TOKEN: "token",
      })
    ).toEqual({
      url: "libsql://compfi.turso.io",
      authToken: "token",
      isRemote: true,
    })
    expect(() => resolveDatabaseConfig({ NODE_ENV: "production" })).toThrow(
      "Production requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN"
    )
    expect(
      resolveDatabaseConfig(
        { NODE_ENV: "production", NEXT_PHASE: "phase-production-build" },
        "/workspace"
      ).isRemote
    ).toBe(false)
  })

  it("formats exact USD cents and accepts only Flutterwave's HTTPS checkout host", () => {
    expect(usdCentsToDecimal(35400)).toBe("354.00")
    expect(usdCentsToDecimal(1)).toBe("0.01")
    expect(isFlutterwaveCheckoutUrl("https://checkout.flutterwave.com/v3/hosted/pay/abc")).toBe(
      true
    )
    expect(isFlutterwaveCheckoutUrl("https://checkout.flutterwave.com.evil.test/pay")).toBe(false)
    expect(isFlutterwaveCheckoutUrl("http://checkout.flutterwave.com/pay")).toBe(false)
  })

  it("initializes a card-only USD hosted checkout without exposing its secret", async () => {
    vi.stubEnv("FLUTTERWAVE_SECRET_KEY", "server-secret")
    vi.stubEnv("FLUTTERWAVE_SECRET_HASH", "webhook-secret")
    const fetcher = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: "success",
          data: { link: "https://checkout.flutterwave.com/v3/hosted/pay/abc" },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    )

    const result = await initializeFlutterwavePayment(
      {
        orderId: "ORD-123",
        amountCents: 35400,
        customer: {
          email: "buyer@example.com",
          name: "Buyer",
          phone: "555-0100",
        },
        callbackUrl: "https://compfi.com/checkout/complete",
      },
      fetcher
    )

    expect(result.paymentReference).toBe("ORD-123")
    const request = fetcher.mock.calls[0]
    const body = JSON.parse(request[1].body)
    expect(body).toMatchObject({
      tx_ref: "ORD-123",
      amount: "354.00",
      currency: "USD",
      payment_options: "card",
      customer: { phonenumber: "555-0100" },
    })
    expect(JSON.stringify(body)).not.toContain("server-secret")
  })

  it("rejects partial Flutterwave configuration before creating a hosted payment", async () => {
    vi.stubEnv("FLUTTERWAVE_SECRET_KEY", "server-secret")
    vi.stubEnv("FLUTTERWAVE_SECRET_HASH", "")
    const fetcher = vi.fn()
    await expect(
      initializeFlutterwavePayment(
        {
          orderId: "ORD-123",
          amountCents: 100,
          customer: { email: "buyer@example.com", name: "Buyer", phone: "555-0100" },
          callbackUrl: "https://compfi.com/checkout/complete",
        },
        fetcher
      )
    ).rejects.toThrow("not configured")
    expect(fetcher).not.toHaveBeenCalled()
  })

  it("requires verified transaction status, reference, currency, and exact amount", async () => {
    vi.stubEnv("FLUTTERWAVE_SECRET_KEY", "server-secret")
    const validPayload = {
      status: "success",
      data: {
        id: 42,
        status: "successful",
        tx_ref: "ORD-123",
        currency: "USD",
        amount: 354,
      },
    }
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(validPayload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    )
    await expect(
      verifyFlutterwaveTransaction(
        {
          transactionId: "42",
          paymentReference: "ORD-123",
          amountCents: 35400,
        },
        fetcher
      )
    ).resolves.toEqual({ transactionId: "42", paymentReference: "ORD-123" })

    fetcher.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          ...validPayload,
          data: { ...validPayload.data, currency: "GHS" },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    )
    await expect(
      verifyFlutterwaveTransaction(
        {
          transactionId: "42",
          paymentReference: "ORD-123",
          amountCents: 35400,
        },
        fetcher
      )
    ).rejects.toThrow("could not be verified")
  })

  it("validates the webhook MAC over the untouched body", () => {
    vi.stubEnv("FLUTTERWAVE_SECRET_HASH", "webhook-secret")
    const body = '{"type":"charge.completed"}'
    const signature = createHmac("sha256", "webhook-secret").update(body).digest("base64")
    expect(verifyFlutterwaveSignature(body, signature)).toBe(true)
    expect(verifyFlutterwaveSignature(`${body} `, signature)).toBe(false)
    expect(verifyFlutterwaveSignature(body, null, "webhook-secret")).toBe(true)
    expect(verifyFlutterwaveSignature(body, null, "wrong-secret")).toBe(false)
  })

  it("escapes inquiry content and treats missing email configuration as a non-throwing failure", async () => {
    expect(escapeHtml(`<script>alert("x")</script>`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;"
    )
    const message = contactMerchantMessage({
      inquiryId: "inq-1",
      name: "<A>",
      email: "a@example.com",
      message: "Hello & welcome",
    })
    expect(message.html).toContain("&lt;A&gt;")
    expect(message.html).toContain("Hello &amp; welcome")
    await expect(
      sendTransactionalEmail({
        to: "a@example.com",
        message,
        idempotencyKey: "contact-merchant/inq-1",
      })
    ).resolves.toBe("failed")
  })
})
