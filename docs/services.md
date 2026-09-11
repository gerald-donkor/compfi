# Services & Local Persistence Architecture

Compfi uses a 100% free, self-contained local stack for persistence and backend services. There are zero external cloud database dependencies, zero third-party billing/credit card providers, and zero ongoing cloud service costs.

---

## 1. Stack & Persistence Decisions

| Concern | Solution | Rationale |
| --- | --- | --- |
| Database Engine | SQLite (embedded) via `@libsql/client` | Local, file-based (`file:data/compfi.db`), zero-config, portable, and instant in all development & automated environments. |
| Object-Relational Mapper | Drizzle ORM (`drizzle-orm`, `drizzle-kit`) | Type-safe SQL builder with minimal runtime overhead, full TypeScript inference, and zero binary dependencies. |
| Server Actions | Next.js Server Actions (`"use server"`) | Server-authoritative logic without maintaining separate REST/GraphQL endpoints. Direct database interaction. |
| Catalog Integrity | Authoritative catalog resolution | Client cart amounts and prices are treated as untrusted hints. Unit prices, product names, and variant checks are authoritatively looked up in `lib/catalog.ts`. |
| Authentication Binding | Clerk Server Auth (`@clerk/nextjs/server`) | Checks `await auth()` in Server Actions and Server Components. If signed in, orders link to `userId`. Guest checkouts are fully supported (`userId: null`). |
| Data Directory Isolation | `.gitignore` rule: `data/`, `*.db*` | Local development and test databases are untracked to prevent repo pollution. |

---

## 2. Database Schema

Schema is defined in `db/schema.ts` using Drizzle SQLite definitions:

### 2.1 Orders (`orders`)
- `id` (`text`, Primary Key, UUID)
- `orderNumber` (`text`, Unique, e.g. `ORD-20260911-XXXX`)
- `userId` (`text`, Nullable) — Clerk customer ID if authenticated
- `customerEmail` (`text`, Not Null)
- `customerPhone` (`text`, Not Null)
- `shippingAddressJson` (`text`, Not Null) — JSON-stringified shipping address object
- `subtotalCents` (`integer`, Not Null) — server-calculated product subtotal in cents
- `shippingCents` (`integer`, Not Null) — flat shipping fee ($0.00 / free threshold)
- `taxCents` (`integer`, Not Null) — server-calculated tax in cents (8.5%)
- `totalCents` (`integer`, Not Null) — grand total in cents
- `paymentMethod` (`text`, Not Null) — `bank_transfer`, `direct_bank`, or `cod`
- `status` (`text`, Not Null, Default `'confirmed'`)
- `createdAt` (`text`, Not Null, ISO 8601 timestamp)
- `updatedAt` (`text`, Not Null, ISO 8601 timestamp)

### 2.2 Order Items (`order_items`)
- `id` (`text`, Primary Key, UUID)
- `orderId` (`text`, Foreign Key -> `orders.id`, CASCADE delete)
- `productSlug` (`text`, Not Null)
- `title` (`text`, Not Null)
- `size` (`text`, Nullable)
- `finish` (`text`, Nullable)
- `unitPriceCents` (`integer`, Not Null) — catalog unit price at time of purchase
- `quantity` (`integer`, Not Null)
- `lineTotalCents` (`integer`, Not Null)
- `createdAt` (`text`, Not Null, ISO 8601 timestamp)

### 2.3 Contact Inquiries (`contact_inquiries`)
- `id` (`text`, Primary Key, UUID)
- `name` (`text`, Not Null)
- `email` (`text`, Not Null)
- `subject` (`text`, Nullable)
- `message` (`text`, Not Null)
- `status` (`text`, Not Null, Default `'new'`)
- `createdAt` (`text`, Not Null, ISO 8601 timestamp)

---

## 3. Automated Schema Initialization

To guarantee zero setup friction and ensure the application boots cleanly on fresh checkouts, `db/index.ts` exports `ensureDbSchema()`.
This runs `CREATE TABLE IF NOT EXISTS` statements for `orders`, `order_items`, and `contact_inquiries` before queries execute or on initial module import. The SQLite database file resides at `data/compfi.db`.

---

## 4. Server Actions

### 4.1 Order Placement (`app/actions/checkout.ts`)
- **Signature**: `placeOrderAction(rawDetails: unknown, rawCartLines: unknown)`
- **Validation**: Zod schema parses customer contact, shipping address, and payment method.
- **Authoritative Pricing**:
  - Re-evaluates each line item against `lib/catalog.ts`.
  - Rejects unknown products or quantities $< 1$.
  - Recomputes `subtotalCents`, `shippingCents` ($0 for orders $\ge \$500$, otherwise $\$49$), and `taxCents` ($8.5\%$).
  - Never trusts client-submitted monetary amounts.
- **Authentication**: Inspects `await auth()`. If `userId` exists, the order is tagged with that account ID.
- **Atomicity**: Inserts order header and all order line items into SQLite.
- **Return**: `{ success: true, orderNumber, orderId, totalCents }` or `{ success: false, error, validationErrors? }`.

### 4.2 Contact Submission (`app/actions/contact.ts`)
- **Signature**: `submitContactInquiryAction(rawDetails: unknown)`
- **Validation**: Zod schema parses `name`, `email`, optional `subject`, and `message`.
- **Persistence**: Writes row to `contact_inquiries`.
- **Return**: `{ success: true, message }` or `{ success: false, error, validationErrors? }`.

---

## 5. UI Surfaces & User Flows

### 5.1 Checkout Flow (`/checkout`)
- User completes address and payment details.
- Submitting sets `aria-busy="true"` on the form and disables the submit button.
- Upon successful order creation:
  - The client cart is cleared via `useCart().clear()`.
  - The form transitions to an accessible `OrderConfirmation` receipt view (`role="status"`, order number, itemized totals, delivery address, and link to continue shopping or view account).

### 5.2 Customer Order History (`/account`)
- The protected `/account` Server Component calls `getOrdersByUserId(userId)`.
- If no orders exist: renders an accessible empty state with a call to browse the catalog.
- If orders exist: renders order cards with order number, formatted placement date, status badge, itemized product list with thumbnails, finish/size details, unit prices, and grand total.

### 5.3 Contact Inquiries (`/contact`)
- Contact form submits via `submitContactInquiryAction`.
- Displays real-time submitting state.
- On success: displays an accessible green confirmation banner and resets the form.

---

## 6. Verification & Automated Testing

1. **Database Layer Tests** (`test/db.test.ts`):
   - Automated DDL initialization.
   - Inserting orders and line items.
   - Querying customer orders by user ID and single order by order ID.
2. **Server Action Tests** (`test/actions.test.ts`):
   - Checkout validation failure on missing fields.
   - Server-authoritative price calculation (ignoring tampered client prices).
   - Clerk user ID association.
   - Contact inquiry validation and storage.
3. **Component & Accessibility Tests** (`test/phase10-services.test.tsx`):
   - Order history empty state rendering and accessibility (0 axe violations).
   - Order history populated state rendering and accessibility (0 axe violations).
   - Order confirmation receipt rendering and accessibility (0 axe violations).
4. **End-to-End Browser Automation**:
   - `/contact` inquiry submission verified with live form submission and database row verification.
   - `/checkout` order placement verified with product addition, form submission, receipt confirmation rendering, and SQLite persistence.
