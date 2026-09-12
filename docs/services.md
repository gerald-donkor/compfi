# Production Services and Persistence

Last verified: 2026-09-12. This document owns Compfi's payment, persistence,
and transactional-notification contracts. The code is configuration-ready;
provider accounts, DNS, deployment secrets, and live transactions remain an
external provisioning step.

## Selected stack

| Concern | Selection | Production contract |
| --- | --- | --- |
| Payments | Flutterwave Standard hosted checkout | Ghana merchant account with international/USD card collection enabled; Compfi never receives card data. |
| Database | Turso/libSQL with Drizzle ORM | Remote Turso in production; file-backed SQLite for local development and tests. |
| Transactional email | Resend HTTP API | Paid-order receipt plus contact merchant/customer notifications from a verified sending domain. |
| Identity | Clerk | Authenticated orders retain `user_id`; guest checkout remains supported. |

Stripe is excluded because merchant availability in Ghana is a user requirement.
Paystack was not selected because its official Ghana currency table supports GHS,
while Compfi's durable storefront contract is USD. Flutterwave supports Ghana
business onboarding, hosted card checkout, international collection, and USD
subject to account approval. If USD collection is not enabled, checkout fails
safely; the application does not convert prices or change storefront currency.

Current free tiers and fees are provider-controlled and must be rechecked before
launch. At selection time, Turso offered a no-card free tier and Resend offered
3,000 messages/month (100/day); Flutterwave charged transaction fees but no
signup/setup fee. “Free stack” therefore means no mandatory platform subscription,
not fee-free payment processing.

## Configuration

`.env.example` lists every required variable without values. Secrets stay
server-only.

- Production database: `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`; both are
  required together. Omitting both selects `file:data/compfi.db`.
  Production runtime fails closed when Turso variables are absent; only the
  production build step is exempt so secret-free builds stay possible.
- Payment: `FLUTTERWAVE_SECRET_KEY` and `FLUTTERWAVE_SECRET_HASH`.
- Email: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and
  `CONTACT_NOTIFICATION_EMAIL`.
- Callback origin: `NEXT_PUBLIC_SITE_URL`, intentionally public.

## Persistence and migrations

`db/schema.ts` defines `orders`, `order_items`, `contact_inquiries`,
`newsletter_subscribers`, and `processed_payment_events`. Monetary values are
integer USD cents. Order statuses are `confirmed` (legacy), `pending_payment`,
`paid`, `payment_failed`, and `payment_canceled`.

Orders persist the provider, unique payment reference, verified transaction ID,
currency, paid timestamp, receipt state, and receipt timestamp. Contact inquiries
persist customer and merchant notification state/timestamps. The processed-event
primary key makes webhook replay idempotent.

`ensureDbSchema` creates fresh tables and adds missing nullable columns to older
databases without dropping or rewriting existing rows. It also creates the unique
partial order-reference index. Schema initialization is tracked per database
client, and paid transitions retry transient `SQLITE_BUSY` contention. Local SQLite pragmas are best-effort because remote
libSQL environments may not support every local setting.

Public checkout and contact submissions carry a honeypot guard. A filled guard
is rejected before persistence or provider calls with a generic customer-safe
message.

## Payment lifecycle

1. `placeOrderAction` validates all customer/cart input, resolves products and
   variants from the server catalog, and recalculates exact integer-cent totals.
2. It atomically creates an order and items with `pending_payment`, then asks
   Flutterwave Standard for a card-only USD checkout URL.
3. The client accepts only an HTTPS URL on `checkout.flutterwave.com` and uses
   `window.location.assign`. Initialization failures mark the order
   `payment_failed`; the local cart remains intact.
4. `/api/payments/flutterwave/webhook` supports Flutterwave Standard v3's
   documented `verif-hash` and the newer `flutterwave-signature` HMAC-SHA256
   contract, using timing-safe comparison in both cases. HMAC is calculated over
   the untouched request body. `/checkout/complete` treats all query parameters
   as untrusted and never trusts provider `status` text: callback and webhook
   outcomes are determined by a server-to-server transaction inspection.
5. Both paths call the same reconciliation module. It fetches the transaction
   from Flutterwave and requires successful status plus exact reference, USD
   currency, and amount before the database can transition to `paid`.
   Provider-verified failed/canceled transactions persist the matching order
   state; verification errors distinguish invalid transactions from temporary
   unavailability.
6. The transition and event record are transactional and replay-safe. Only a
   server-verified paid completion clears the browser cart. Receipt delivery is
   recorded separately and a receipt bookkeeping failure never downgrades a
   verified paid order.

The completion route is dynamic, excluded from the sitemap, and explicitly
`noindex, nofollow`. It represents paid, pending, canceled, failed, and invalid
states with checkout/contact recovery links.

## Transactional email

Email is required operationally but is not the source of truth. After the first
paid transition, Compfi sends an itemized receipt with idempotency key
`order-paid/<order-id>`. Contact persistence triggers a merchant notification
(`reply_to` the validated submitter) and customer acknowledgment with stable
inquiry-bound keys. All messages contain escaped HTML and useful plain text.

Missing configuration or delivery failure records `failed` and never reverses a
verified payment or deletes an inquiry. Reconciliation may retry a failed receipt;
Resend's idempotency key prevents duplicate delivery within its supported window.
Newsletter storage remains local/Turso-backed and does not imply broadcast mail.

## Security boundary

- Server Actions, callback parameters, and webhook JSON are untrusted.
- Compfi stores no card number, CVV, raw webhook body, provider secret, or raw
  provider response.
- The browser receives only the order reference and validated hosted URL during
  initialization.
- Provider/network errors become customer-safe messages without leaking customer
  data, credentials, bodies, or stack traces.
- Webhook-secret comparison is timing-safe and every successful event is independently
  verified server-to-server before fulfillment.

## Verification

Automated coverage includes local/remote database configuration, production
fail-closed behavior, legacy migrations without row replacement, concurrent
idempotent paid transitions, authoritative totals, pending-order persistence,
honeypot rejection, hosted URL allowlisting, partial provider-configuration
rejection, exact USD conversion, transaction field matching, verified
failed/canceled persistence, invalid-versus-unavailable verification mapping,
receipt failure without paid downgrade, webhook MAC validation, HTML escaping,
non-throwing notification failure, checkout redirect intent, cart retention,
completion recovery states with paid-only cart clearing, human-readable order states, and axe checks. Exact final command and browser
results are recorded in `docs/pages.md` after the implementation review.

## Provisioning checklist

1. Complete Ghana Flutterwave business verification and confirm international/USD
   card collection before adding server keys.
2. Register the production webhook URL and a strong secret hash.
3. Create a Turso database/token and run the application migration before traffic.
4. Verify a Resend sending subdomain with SPF/DKIM and create a sending-only key.
5. Run separately authorized sandbox payment, webhook, callback, and email tests.

Never paste provider secrets into chat or commit them to the repository.
