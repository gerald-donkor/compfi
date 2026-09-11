# Services & Local Persistence Architecture

Compfi uses a 100% free, self-contained local stack for persistence and backend services. There are zero external cloud database dependencies, zero third-party billing/credit card providers, and zero ongoing cloud service costs.

---

## 1. Stack & Persistence Decisions

| Concern | Solution | Rationale |
| --- | --- | --- |
| Database Engine | SQLite (embedded) via `@libsql/client` | Local, file-based (`file:data/compfi.db`), zero-config, portable, and instant in all development & automated environments. |
| Object-Relational Mapper | Drizzle ORM (`drizzle-orm`, `drizzle-kit`) | Type-safe SQL builder with minimal runtime overhead, full TypeScript inference, and zero binary dependencies. |
| Server Actions | Next.js Server Actions (`"use server"`) | Server-authoritative logic without maintaining separate REST/GraphQL endpoints. Direct database interaction. |
| Catalog Integrity | Authoritative catalog resolution | Client cart amounts and prices are treated as untrusted hints. Unit prices, product names, and variant checks are authoritatively validated against `lib/catalog.ts`. |
| Authentication Binding | Clerk Server Auth (`@clerk/nextjs/server`) | Checks `await auth()` in Server Actions and Server Components. If signed in, orders link to `userId`. Guest checkouts are fully supported (`userId: null`). |
| Data Directory Isolation | `.gitignore` rule: `data/`, `*.db*` | Local development and test databases are untracked to prevent repository pollution. |

---

## 2. Database Schema

Schema is defined in `db/schema.ts` using Drizzle SQLite definitions:

### 2.1 Orders (`orders`)
- `id` (`text`, Primary Key, e.g. `ORD-XXXXXX-XXXX`)
- `user_id` (`text`, Nullable) — Clerk customer ID if authenticated
- `status` (`text`, Not Null, Default `'confirmed'`)
- `customer_name` (`text`, Not Null) — customer first and last name
- `customer_email` (`text`, Not Null)
- `customer_phone` (`text`, Not Null)
- `shipping_address` (`text`, Not Null) — JSON-stringified `ShippingAddress` object
- `order_notes` (`text`, Nullable)
- `subtotal_cents` (`integer`, Not Null) — server-calculated product subtotal in cents
- `shipping_cents` (`integer`, Not Null, Default `0`) — flat shipping fee ($0 for orders $\ge \$500$, otherwise $\$25$)
- `total_cents` (`integer`, Not Null) — grand total in cents
- `created_at` (`integer`, Not Null) — Unix timestamp in milliseconds

### 2.2 Order Items (`order_items`)
- `id` (`text`, Primary Key, e.g. `item_...`)
- `order_id` (`text`, Foreign Key -> `orders.id`, CASCADE delete)
- `product_slug` (`text`, Not Null)
- `product_title` (`text`, Not Null)
- `size` (`text`, Nullable)
- `finish` (`text`, Nullable)
- `quantity` (`integer`, Not Null)
- `unit_price_cents` (`integer`, Not Null) — catalog unit price at time of purchase
- `total_price_cents` (`integer`, Not Null) — `unit_price_cents * quantity`
- `image_src` (`text`, Not Null) — product thumbnail image URL

### 2.3 Contact Inquiries (`contact_inquiries`)
- `id` (`text`, Primary Key, e.g. `inq_...`)
- `name` (`text`, Not Null)
- `email` (`text`, Not Null)
- `message` (`text`, Not Null)
- `created_at` (`integer`, Not Null) — Unix timestamp in milliseconds

### 2.4 Newsletter Subscribers (`newsletter_subscribers`)
- `id` (`text`, Primary Key, e.g. `sub_...`)
- `email` (`text`, Not Null, Unique) — lowercase normalized email address
- `created_at` (`integer`, Not Null) — Unix timestamp in milliseconds
- `status` (`text`, Not Null, Default `'active'`) — `'active' | 'unsubscribed'`

---

## 3. Automated Schema Initialization

To guarantee zero setup friction and ensure the application boots cleanly on fresh checkouts, `db/init.ts` exports `ensureDbSchema(client)` (re-exported by `db/index.ts`).
This executes `CREATE TABLE IF NOT EXISTS` DDL statements for `orders`, `order_items`, `contact_inquiries`, and `newsletter_subscribers` before queries run. The SQLite database file resides at `data/compfi.db`.

---

## 4. Server Actions

### 4.1 Order Placement (`app/actions/checkout.ts`)
- **Signature**: `placeOrderAction(details: CheckoutDetails, cartLines: readonly CartLineSubmission[])`
- **Validation**:
  - Validates contact, street address, and payment method via `reviewCheckoutDetails` from `lib/checkout.ts`.
  - Validates that the cart is non-empty.
- **Authoritative Catalog Validation**:
  - Re-evaluates each line item against `lib/catalog.ts`.
  - Rejects unknown products or quantities $< 1$.
  - Strictly validates that variant options (`size`, `finish`) exist on the catalog product.
  - Recomputes `subtotalCents`, `shippingCents` ($0 for orders $\ge \$500$, otherwise $\$25$), and `totalCents`.
  - Never trusts client-submitted monetary amounts.
- **Authentication**: Inspects `await auth()`. If `userId` exists, the order is tagged with that account ID.
- **Atomic Persistence**: Inserts order header and all order line items inside a SQLite transaction (`db.transaction(async (tx) => { ... })`).
- **Return**: `{ success: true, orderId, subtotalCents, shippingCents, totalCents, createdAt, itemCount, customerName, customerEmail, shippingAddress, items }` or `{ success: false, errors?, message? }`.

### 4.2 Contact Submission (`app/actions/contact.ts`)
- **Signature**: `submitContactInquiryAction(details: ContactInquirySubmission)`
- **Validation**: Validates required `name`, valid `email`, and non-empty `message`.
- **Persistence**: Writes row to `contact_inquiries`.
- **Return**: `{ success: true, message }` or `{ success: false, errors?, message? }`.

### 4.3 Newsletter Subscription (`app/actions/newsletter.ts`)
- **Signature**: `subscribeNewsletterAction(input: { email: string } | FormData)`
- **Validation**: Enforces RFC 5322 regex validation, max length 255 chars, trims and normalizes to lowercase.
- **Persistence**: Idempotent insert into `newsletter_subscribers` via `db/newsletter.ts`.
- **Return**: `{ success: true, message: "Thank you for subscribing to Compfi updates.", isNew: true }` for new subscribers; `{ success: true, message: "You are already subscribed to Compfi updates.", isNew: false }` for existing subscribers; `{ success: false, error: string }` on invalid input.

---

## 5. UI Surfaces & User Flows

### 5.1 Checkout Flow (`/checkout`)
- User completes address details and payment selection.
- Submitting sets `aria-busy="true"` on the form and disables the submit button.
- Upon successful order creation:
  - The client cart is cleared via `useCart().clear()`.
  - The view transitions to an accessible `OrderConfirmation` receipt (`data-slot="order-confirmation"`, `role="status"`).
  - Displays order reference ID, placement date and time, itemized line-item list with thumbnails, formatted currency totals, shipping address, and actions to continue shopping or view in account (gated by Clerk `isSignedIn`).

### 5.2 Customer Order History (`/account`)
- The protected `/account` Server Component calls `getOrdersByUserId(userId)`.
- Line items are batched in a single query with `inArray()`, eliminating N+1 round-trips.
- If no orders exist: renders an accessible `Empty` composition (`data-slot="order-history"`) with a call to browse furniture.
- If orders exist: renders order cards with order number, formatted placement date, status badge, itemized product list with thumbnails, finish/size details, unit prices, and grand total.

### 5.3 Contact Inquiries (`/contact`)
- Contact form submits via `submitContactInquiryAction`.
- Displays submitting state.
- On success: displays an accessible green confirmation banner and resets the form.

### 5.4 Newsletter Subscription (`components/chrome/site-footer.tsx`)
- Footer renders 4 columns on desktop matching `design/1-Home.png`.
- Fourth column features `"Newsletter"` heading with `NewsletterForm`.
- Includes accessible visually hidden label, bottom-bordered email input, and bottom-bordered uppercase `"SUBSCRIBE"` button.
- Live region (`role="status"`, `aria-live="polite"`) delivers immediate feedback for success, duplicates, and errors without disrupting focus.

---

## 6. Verification & Automated Testing

1. **Database Layer Tests** (`test/db.test.ts`, `test/newsletter.test.ts`):
   - Automated DDL initialization via `ensureDbSchema`.
   - Transactional order insertion.
   - Batch query retrieval via `getOrdersByUserId` and `getOrderById`.
   - Newsletter subscriber creation, retrieval, and idempotent re-subscription.
2. **Server Action Tests** (`test/actions.test.ts`, `test/newsletter.test.ts`):
   - Checkout validation failure on missing fields.
   - Authoritative catalog price calculation (ignoring client prices).
   - Variant option verification (rejecting invalid options).
   - Clerk user ID association.
   - Contact inquiry validation and persistence.
   - Newsletter subscription validation (empty, invalid format, length limit, duplicate handling).
3. **Component & Accessibility Tests** (`test/phase10-services.test.tsx`, `test/newsletter-form.test.tsx`):
   - Order history empty state rendering and accessibility (0 axe violations).
   - Order history populated state rendering and accessibility (0 axe violations).
   - Order confirmation receipt rendering, line items, and accessibility (0 axe violations).
   - Newsletter form input, submission, live region announcements, and accessibility (0 axe violations).
   - SiteFooter 4-column layout and accessibility (0 axe violations).
4. **End-to-End Browser Automation** (named sessions `compfi-checkout`, `compfi-newsletter`):
   - `/contact` inquiry submission verified with live form submission and database row verification in SQLite.
   - `/checkout` order placement verified with product addition, form submission, receipt confirmation rendering, and SQLite persistence.
   - Footer newsletter form verified with invalid validation error, valid email subscription, duplicate idempotent confirmation, and SQLite persistence.
   - Responsive verification across 1440, 768, 390, and 320 px viewports (0 horizontal overflow).
