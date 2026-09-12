# Production Payments, Database, and Transactional Email (Phase 10)

## Status and authorization boundary

Prepared on 2026-09-12 from the user's explicit instruction to investigate,
plan, and execute a globally reachable stack that is available to a Ghana-based
business. That instruction authorizes this defined implementation scope through
verification, local commits, mandatory dual-axis review, accepted fixes, and
required re-review. It does not authorize account creation, secret disclosure,
DNS changes, deployment, live charges, or a push.

Planning-time repository state is a clean `main` at
`e0864ebb89c10ad073c6e8a64b5f462e9323de8a`. Reconfirm the branch, status, and
HEAD before execution; capture that SHA as the immutable `BASE_SHA`; preserve
all unrelated changes.

## Goal and why this is the next dependency-safe unit

Replace Compfi's direct-confirmation checkout placeholder with a production-safe
hosted payment boundary, make the existing SQLite/Drizzle persistence deployable,
and add the transactional notifications required for paid orders and persisted
contact inquiries.

This is the next dependency-safe Phase 10 unit because phases 1-9 and the first
local-persistence units of phase 10 are committed and reviewed. The current
checkout persists an order with `status="confirmed"` before payment and tells the
customer that no card is required. That boundary is intentionally temporary and
is the remaining correctness gap before Compfi can represent real commerce.

## Researched provider decision

Research was performed against current official provider pages on 2026-09-12.

### Payment: Flutterwave Standard hosted checkout

Select Flutterwave Standard rather than Stripe or Paystack:

- Stripe is excluded by the user's Ghana availability requirement.
- Paystack has excellent Ghana pricing (1.95%, no integration or maintenance
  fee), hosted redirect checkout, international cards, and Ghana mobile money,
  but its official currency table limits Ghana businesses to `GHS`. Selecting it
  would violate Compfi's durable customer-facing `USD` contract.
- Flutterwave explicitly onboards Ghana businesses, charges no signup/setup fee,
  accepts international cards from anywhere, supports 30+ currencies, reports
  500k+ daily payments, offers a server-created hosted checkout link, and signs
  webhook bodies with HMAC-SHA256 in its current contract. Flutterwave Standard
  v3 also documents the legacy `verif-hash` header. Its Ghana international-card rate is currently
  4.8% per transaction, with no fixed fee.
- Use Flutterwave Standard in `USD`, cards only. A Ghana Flutterwave account must
  have international/USD collection enabled before live activation. If its
  approved account cannot collect USD, deployment remains blocked rather than
  silently converting prices or changing the storefront currency.

Official sources:

- `https://flutterwave.com/gh/pricing/`
- `https://www.flutterwave.com/gh/support/general/heres-all-you-need-to-know-about-operating-a-flutterwave-account-in-ghana`
- `https://developer.flutterwave.com/v3.0/docs/flutterwave-standard-1`
- `https://developer.flutterwave.com/docs/webhooks`
- `https://paystack.com/gh/pricing`
- `https://paystack.com/docs/api/`

### Database: Turso Cloud with local SQLite for development/tests

Move production orders to Turso while retaining local SQLite only for local
development and automated tests:

- Turso's current free plan is `$0/month`, no card required, with 100 databases,
  5 GB storage, 500 million rows read, and 10 million rows written monthly.
- The existing `@libsql/client` plus `drizzle-orm/libsql` implementation is the
  officially supported, production-ready Turso/Drizzle path, so this is a
  configuration and migration hardening change rather than a datastore rewrite.
- Production uses `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`; local/test uses a
  file URL. Secrets remain server-only.

Official sources:

- `https://turso.tech/pricing`
- `https://docs.turso.tech/sdk/ts/guides/nextjs`
- `https://docs.turso.tech/sdk/ts/orm/drizzle`
- `https://docs.turso.tech/sdk/ts/reference`

### Email: Resend transactional email

Order and contact notifications are required: a paid customer needs a durable
receipt, and a persisted contact inquiry needs an operational notification plus
an honest acknowledgment.

- Resend's current free transactional plan is `$0/month`, 3,000 messages/month,
  and 100/day, with immediate production access.
- It supports Next.js, plain-text and HTML messages, verified sending domains,
  and 24-hour idempotency keys.
- Use the HTTP API directly; no SDK is required for the small surface.

Official sources:

- `https://resend.com/pricing`
- `https://resend.com/docs/send-with-nextjs`
- `https://resend.com/docs/api-reference/emails/send-email`
- `https://resend.com/docs/dashboard/emails/idempotency-keys`
- `https://resend.com/docs/dashboard/domains/introduction`

## Skill discovery result

`find-skills` was used because no project-local Flutterwave or Resend integration
skill exists. No Flutterwave-specific skill with adequate adoption and security
evidence was found. The generic candidates were low-install or unrelated; the
Stripe-specific candidate is inapplicable and had a failing Snyk signal. Do not
install a mismatched skill. Use the official Flutterwave, Turso, Resend, installed
Next.js, Clerk, and package documentation named here.

## Relevant repository and framework evidence

- `design/7-Checkout.png`: native 1920x3840 reference; existing implementation
  uses the certified 2:1 raster-to-CSS interpretation and preserves its two-column
  details/summary hierarchy.
- `app/actions/checkout.ts`: validates customer/cart input, recalculates exact USD
  cents from `lib/catalog.ts`, and currently persists prematurely confirmed orders.
- `components/checkout/checkout-content.tsx`: client form and placeholder direct
  order confirmation.
- `db/index.ts`, `db/init.ts`, `db/schema.ts`, `db/orders.ts`: current local libSQL
  connection, idempotent bootstrap DDL, order schema, and reads.
- `app/actions/contact.ts`: persists validated contact inquiries.
- `components/account/order-history.tsx`: displays stored order status.
- `lib/site.ts`: canonical site URL used for provider callback URLs.
- Installed Next.js 16.3.4 docs:
  - `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
  - `node_modules/next/dist/docs/01-app/02-guides/server-actions.md`
  - `node_modules/next/dist/docs/01-app/02-guides/environment-variables.md`
  - `node_modules/next/dist/docs/01-app/02-guides/redirecting.md`
  - `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/after.md`

## Exact scope and expected files

### 1. Secret-safe configuration

- Add a secret-free `.env.example` containing:
  `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `FLUTTERWAVE_SECRET_KEY`,
  `FLUTTERWAVE_SECRET_HASH`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`,
  `CONTACT_NOTIFICATION_EMAIL`, and `NEXT_PUBLIC_SITE_URL`.
- Never read or print `.env.local`. No secret uses `NEXT_PUBLIC_` except the
  intentionally public canonical site URL.
- Add pure configuration validation so partial provider configuration fails with
  actionable server-side errors while builds and local fixture tests remain
  secret-independent.

### 2. Turso-capable persistence and migrations

- Update `db/index.ts` to select remote Turso only when both Turso variables are
  present; otherwise retain the existing local file database for development and
  tests. Do not create a local directory on the remote path.
- Expand the order contract with a typed status:
  `confirmed` (legacy), `pending_payment`, `paid`, `payment_failed`, and
  `payment_canceled`.
- Add nullable payment provider/reference/transaction fields, currency, paid and
  notification timestamps. Add an indexed, unique provider reference.
- Add a small processed-payment-event table keyed by provider event ID so webhook
  replay is idempotent.
- Evolve existing databases with idempotent bootstrap migrations; do not drop or
  rewrite existing rows. Keep legacy `confirmed` orders readable.
- Centralize create-pending, mark-paid, mark-failed/canceled, and reference lookup
  operations in `db/orders.ts` or one focused sibling module.

### 3. Flutterwave provider module

- Add `lib/payments/flutterwave.ts` as the concrete provider implementation; do
  not create a speculative multi-provider interface.
- Initialize Standard checkout from the server via native `fetch` to
  `POST /v3/payments`, using `USD`, a decimal derived exactly from integer cents,
  card payment only, Compfi branding, a unique order-bound `tx_ref`, and the
  canonical callback URL.
- Verify transactions via Flutterwave's server API before marking an order paid.
  Require exact reference, currency, and amount agreement and a successful
  provider status. Never trust callback or webhook payload amounts alone.
- Verify `flutterwave-signature` against the unmodified raw request body with
  HMAC-SHA256, and support Standard v3's documented `verif-hash`; use timing-safe
  comparison for both modes.
- Normalize provider/network failures to customer-safe errors; never expose keys,
  provider bodies, customer details, or stack traces.

### 4. Checkout lifecycle

- Refactor `placeOrderAction` to preserve all current server-side validation and
  authoritative calculations, persist a `pending_payment` order atomically, then
  initialize Flutterwave and return only the hosted authorization URL and order
  reference required by the client.
- If initialization fails, record `payment_failed` without confirming the order.
- Update `CheckoutContent` to label the method `Secure online payment`, explain
  that card details are entered on Flutterwave's hosted page, and use the stable
  action name `Continue to secure payment` / `Opening secure payment…`.
- Redirect through `window.location.assign` only to a validated
  `https://checkout.flutterwave.com/` authorization URL returned by the server.
- Preserve cart contents on initialization errors and cancellation.
- Add `app/api/payments/flutterwave/webhook/route.ts`. Verify raw-body signature,
  acknowledge irrelevant valid events, and idempotently verify and fulfill
  successful charges. Invalid signatures return 401; malformed bodies return 400.
- Add `app/checkout/complete/page.tsx` as a dynamic, noindex Server Component.
  It accepts untrusted callback parameters, verifies the provider transaction on
  the server, reconciles the matching order idempotently, and renders paid,
  pending, canceled, failed, or invalid states with useful recovery actions.
- Add the smallest client leaf needed to clear the local cart only after a
  verified paid result. Never clear it merely because a callback claims success.
- Keep the callback route out of the sitemap and explicitly noindex it.

### 5. Resend notifications

- Add focused email rendering/sending modules under `lib/email/`. Generate both
  escaped HTML and useful plain text; never interpolate unescaped user content.
- After the first successful paid transition, send an itemized customer receipt
  from the verified database order using the deterministic idempotency key
  `order-paid/<order-id>`. Record delivery success/failure without reverting a
  verified payment.
- After contact persistence, send a merchant notification with reply-to set to the
  validated submitter and a separate concise customer acknowledgment. Use stable
  inquiry-bound idempotency keys. Inquiry persistence remains successful if email
  delivery is temporarily unavailable; UI copy says the message was received,
  not that email delivery was guaranteed.
- No marketing mail, newsletter broadcast, attachments, tracking claims, or email
  provider webhooks in this unit.

### 6. Account and documentation

- Update `OrderHistory` with human-readable, non-color-only labels for the new
  statuses. Pending orders must not be described as placed/paid.
- Update `docs/services.md`, `docs/pages.md`, `docs/components.md`, and the
  documentation-status rows in `AGENTS.md` with the selected contracts,
  provisioning boundary, migration behavior, states, and real verification.

Expected changed or new paths include:

- `.env.example`
- `app/actions/checkout.ts`, `app/actions/contact.ts`
- `app/api/payments/flutterwave/webhook/route.ts`
- `app/checkout/complete/page.tsx`
- `components/checkout/checkout-content.tsx`
- `components/checkout/payment-result.tsx`
- `components/account/order-history.tsx`
- `db/index.ts`, `db/init.ts`, `db/schema.ts`, `db/orders.ts`
- `lib/payments/flutterwave.ts`
- `lib/email/resend.ts`, `lib/email/messages.ts`
- focused `test/*.test.ts(x)` files
- `docs/services.md`, `docs/pages.md`, `docs/components.md`, `AGENTS.md`

Adjust exact file boundaries when repository evidence shows a smaller, deeper
module, but do not expand product scope.

## Server/client ownership

- Provider secrets, payment initialization/verification, webhook processing,
  Turso access, and email delivery are server-only modules.
- `CheckoutContent` remains the smallest client form boundary.
- The completion page is a Server Component; only cart clearing is a client leaf.
- The browser never receives provider secrets, database credentials, raw provider
  errors, or an authority to mark an order paid.

## Responsive and visual behavior

- At 1440 CSS px, retain the measured two-column checkout hierarchy and summary
  alignment from the certified reference implementation.
- At 1024 and 768 px, keep readable column proportions and ensure the payment
  disclosure and CTA do not crowd totals.
- At 390 and 320 px, stack details before summary, keep every control at least
  44x44 CSS px, allow long provider/error text to wrap, and guarantee no horizontal
  overflow.
- The completion receipt uses existing Compfi tokens and component patterns; do
  not imitate Flutterwave branding inside Compfi beyond naming the secure provider
  in explanatory copy.
- Preserve reduced-motion behavior. An external redirect needs no decorative
  animation.

## States and edge cases

- Missing/partial configuration: actionable, non-secret checkout error; no order
  is falsely confirmed.
- Valid initialization: pending order plus hosted redirect.
- Provider initialization/network failure: payment-failed state, cart preserved.
- Customer cancellation: canceled/pending result with retry and cart preserved.
- Successful callback before webhook or webhook before callback: same idempotent
  paid order and one receipt.
- Duplicate/concurrent webhooks: one paid transition, one processed event, no
  duplicate fulfillment or receipt.
- Forged signature, malformed JSON, unknown reference, wrong currency, wrong
  amount, or non-success verification: never mark paid.
- Email unavailable: payment/inquiry remains durable; notification state records
  the failure and may retry safely.
- Legacy confirmed order: remains visible and labeled as a legacy confirmed order.
- Guest and authenticated checkout both remain supported; authenticated orders
  stay linked to the Clerk user.

## Accessibility and security

- Meet WCAG 2.2 AA, retain persistent labels, error summary focus, live submission
  feedback, visible focus, semantic headings, and useful recovery links.
- The hosted checkout explanation explicitly says card information is entered on
  Flutterwave and is never handled or stored by Compfi.
- Treat Server Actions, callback query strings, and webhook bodies as untrusted.
- Compare webhook MACs with constant-time primitives and verify every successful
  transaction server-to-server before fulfillment.
- Use exact integer cents internally; convert to the provider decimal only at the
  provider boundary. No binary floating-point arithmetic for business totals.
- Do not log or persist card data, secrets, raw webhook bodies, or full provider
  payloads. Persist only identifiers and normalized state needed for reconciliation.
- Do not claim tax, inventory, shipping SLA, refund policy, or delivery warranty.

## Reference deltas

1. The reference shows bank transfer and cash-on-delivery choices, but no provider
   behavior. Replace them with one truthful hosted online-payment method because
   the user explicitly selected a real payment-provider phase.
2. The current project contract remains `en-US`/`USD`. Ghana mobile money is not
   shown for this USD flow because provider documentation binds it to GHS.
3. The completion route has no supplied reference. Compose it from the certified
   Compfi order-confirmation surface and record that delta.

## Non-goals

- No Stripe, Paystack, PayPal, 2Checkout, payment-element iframe, stored cards,
  subscriptions, installments, BNPL, refunds UI, disputes UI, tax service, coupons,
  inventory reservation, admin dashboard, fulfillment workflow, or analytics.
- No automatic USD/GHS conversion and no change to Compfi's USD fixture prices.
- No production account creation, KYC, secret entry, DNS editing, deployment, live
  charge, or push.
- No replacement of Clerk, Drizzle, catalog fixtures, or local test databases.

## Acceptance criteria

1. A valid checkout creates a server-priced `pending_payment` order and returns a
   validated Flutterwave hosted URL; it never confirms before verified payment.
2. A signed and server-verified successful transaction transitions the exact order
   to `paid` once; reference, USD amount, and currency must match.
3. Forged, malformed, duplicated, mismatched, failed, and canceled flows cannot
   produce false fulfillment.
4. The completion page represents paid/pending/canceled/failed/invalid states and
   clears the cart only for verified paid orders.
5. Production database configuration supports Turso through the existing libSQL
   and Drizzle stack while local tests retain isolated SQLite.
6. Paid-order receipts and contact notifications use Resend with deterministic
   idempotency keys and do not compromise the durable primary operation on email
   failure.
7. Secret-free builds and tests pass without provider accounts. Provisioned live
   verification is reported as blocked until the user supplies accounts through
   provider dashboards—not through chat.
8. Checkout/account UI remains accessible and responsive at 1440, 1024, 768, 390,
   and 320 CSS px with zero axe violations and no horizontal overflow.
9. Dates introduced in UI, metadata, fixtures, tests, and docs are current as of
   2026-09-12.
10. Documentation accurately distinguishes implemented configuration-ready code
    from externally provisioned and live-verified services.

## Verification

- Focused unit tests for configuration, money conversion, provider response
  parsing, HMAC verification, transaction reconciliation, status transitions,
  idempotency, email escaping/content, and notification failure.
- React Testing Library/user-event/axe tests for checkout redirect intent,
  configuration error, retained cart, completion state, cart clearing, and order
  status labels.
- Route Handler tests use signed fixture bodies and mocked provider verification;
  no real network calls.
- Run `npm run test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
- Load current `agent-browser skills get core --full`, use one named session for
  the task, and verify checkout/error/completion/account flows at 1440, 1024, 768,
  390, and 320 px. Without secrets, verify the safe configuration-required state;
  never claim a hosted or live payment was exercised.
- Fetch and apply the current Web Interface Guidelines to every changed UI file.
- Inspect the full diff and every changed file before committing.
- Create a local implementation commit on `main` with `caveman-commit`.
- Run mandatory parallel Standards and Spec review against
  `e0864ebb89c10ad073c6e8a64b5f462e9323de8a...HEAD`, preserve both reports,
  validate findings, fix accepted issues in a separate commit, rerun affected
  checks, and re-review significant changes from the original base. Do not push.

## External provisioning handoff

After code verification, report the dashboard-only steps the user must complete:

1. Activate a Ghana Flutterwave business account for international/USD card
   collection; add the webhook URL and secret hash; set server-only keys.
2. Create a Turso database/token and set the two server-only variables; migrate
   the schema before routing production traffic.
3. Verify a Resend sending subdomain with SPF/DKIM, create a sending-only API key,
   and set sender/merchant notification addresses.
4. Run a separate authorized sandbox end-to-end payment and email verification.

Never request that secrets be pasted into chat.

## SKILLS USED

- `find-skills`: document the provider-skill search and why no low-confidence or
  mismatched integration skill is installed.
- `vercel-react-best-practices`: protect server/client boundaries, avoid request
  waterfalls, minimize client code, and keep provider modules out of the bundle.
- `clerk-nextjs-patterns`: preserve authenticated order linkage while keeping
  guest checkout and public webhook boundaries correct.
- `building-components`: maintain the checkout/result block contracts, states,
  native semantics, accessibility, and component documentation.
- `frontend-design`: adapt the certified checkout hierarchy with restrained,
  truthful hosted-payment copy and completion states.
- `react-testing`: test user-observable form, redirect, status, cart, and a11y
  behavior without implementation-detail assertions.
- `web-design-guidelines`: perform the required final UI/UX/accessibility review.
- `agent-browser`: named-session responsive and interaction verification.
- `caveman-commit`: generate the implementation and any review-fix commit messages.
- `code-review`: mandatory independent Standards and Spec review from the immutable
  base SHA.
