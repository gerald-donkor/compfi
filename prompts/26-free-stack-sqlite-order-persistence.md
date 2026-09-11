# Completely free local SQLite persistence, authoritative order placement, and customer order history (Phase 10)

## Status and authorization boundary

Prepared by the single-letter `i` workflow on 2026-09-11 following the user's
explicit requirements ("I want a completely free tech stack", "choose something
that you can automate yourself").

This is a planning artifact only. It authorizes no implementation, dependency
installation, staging, commit, or push until the user explicitly approves it
through the single-letter `y` workflow.

Planning-time repository state is a clean `main` at `6431108`
(`git status --short` empty at prompt-preparation time, 28 test files and 152
tests passing, 0 lint warnings, Next.js build clean). Reconfirm
`git status --short`, `git branch --show-current`, recent history, and `HEAD`
before execution. Stop if the branch is not `main`. Preserve every unrelated
path that appears after this prompt is prepared.

## Goal and why this is the next dependency-safe unit

Deliver Phase 10 of the storefront build sequence (**Real services: catalog
data, CMS, checkout/payment, order persistence, email, analytics, or other
integrations only after each provider and contract is explicitly selected |
approved product requirements**; AGENTS.md §8 phase 10).

- Phases 1–9 of the Compfi storefront are complete, certified, and committed:
  design system, primitives, shared chrome, commerce browsing, cart & checkout
  presentation, content surfaces, interaction & motion polish, full accessibility
  and performance QA, editorial modernization, and Clerk authentication with a
  protected `/account` route.
- The user specified the stack constraint: a **completely free tech stack** that
  can be **automated locally by the agent without external accounts, credit
  cards, API keys, or cloud infrastructure costs**.
- Local embedded SQLite with Drizzle ORM provides a 100% free, self-contained,
  zero-latency persistence engine that runs entirely within the project:
  1. **Authoritative order calculation & placement**: Meets AGENTS.md §10
     ("Treat product price, discount, stock, shipping eligibility, tax, and
     order total from the browser as untrusted display state. A future server
     integration recalculates authoritative totals"). A Next.js Server Action
     validates submitted items against static catalog data (`lib/catalog.ts`),
     calculates subtotal and shipping, associates the order with the customer's
     Clerk `userId` (when authenticated via `await auth()`), records the order
     and line items transactionally in SQLite, and returns an authoritative order
     confirmation.
  2. **Customer Order History in `/account`**: The protected `/account` route
     currently renders only Clerk's `<UserProfile />`. With order persistence,
     authenticated customers can view their real order history (order reference,
     date, fulfillment status, item summary with thumbnails, and authoritative
     total) and empty state with a direct CTA to `/shop`.
  3. **Contact Inquiry Persistence**: Replaces the browser-only message preview
     in `components/contact/` with a Server Action that validates input and stores
     inquiries in the SQLite database, confirming receipt with accessible status.

## Relevant source files, design references, and measurements

- Design references:
  - `design/7-Checkout.png`: Billing details form, order summary column, payment
    method placeholder, and order submission action.
  - `design/6-Cart.png` & `design/4-Cart Sidebar.png`: Cart line items, pricing,
    subtotal display, and clear-cart transitions.
  - `design/8-Contact.png`: Contact details and form layout.
  - Desktop raster scale: 2:1 raster-to-CSS pixel ratio, 1240 CSS px container.
- Contract & documentation references:
  - `AGENTS.md`: §§1.1, 1.2, 2.3, 3.1–3.4, 6.1–6.4, 7, 8, 9, 10, 11, 12, 13.
  - `docs/pages.md`: Checkout, cart, contact, and account build records.
  - `docs/components.md`: Field, Input, Button, Empty, Card components.
  - `docs/auth.md`: Clerk server authentication contract (`await auth()`).
- Key source files:
  - `lib/checkout.ts`: Field names, max lengths, regex patterns, and validation.
  - `lib/contact.ts`: Contact field validation and constraints.
  - `lib/catalog.ts`: Authoritative product catalog definitions and prices.
  - `lib/cart.ts`: CartLine types, line keys, and selection labels.
  - `app/checkout/page.tsx` & `components/checkout/checkout-content.tsx`: Checkout
    form and review presentation.
  - `app/account/page.tsx`: Protected account page currently hosting `UserProfile`.
  - `components/contact/contact-content.tsx` & `contact-form.tsx`: Contact view.
  - `components/cart/cart-provider.tsx`: Cart context providing `clearCart()`.

## Existing code and package behavior inspected

- Next.js: `16.3.4` (App Router, Turbopack, Server Actions supported).
- React: `19.2.8`.
- Authentication: `@clerk/nextjs` `7.9.2` (`await auth()` in Server Components
  and Server Actions).
- Persistence engine selection:
  - `drizzle-orm` + `@libsql/client` (or native SQLite via `better-sqlite3`).
  - `@libsql/client` is pure TypeScript/WebAssembly capable and avoids native
    `node-gyp` compilation errors across different Linux/container environments.
  - Database file location: `data/compfi.db` (gitignored, created on demand).
  - Dev dependencies: `drizzle-kit` for automated migrations and schema sync.

## Exact scope, expected files, and route impact

### 1. Database Schema & Connection (`db/`)
- Install `drizzle-orm` and `@libsql/client`; install `drizzle-kit` as devDependency.
- Create `db/index.ts`: initializes LibSQL client pointing to `file:data/compfi.db`
  (with directory auto-creation if absent) and exports typed `db` instance.
- Create `db/schema.ts`:
  - `orders`:
    - `id`: text primary key (e.g. `ord_1726070400_abc123`)
    - `userId`: text nullable (Clerk user ID when authenticated)
    - `status`: text not null default `'confirmed'`
    - `customerName`: text not null
    - `customerEmail`: text not null
    - `customerPhone`: text not null
    - `shippingAddress`: text not null (JSON string of street, city, state, zip)
    - `orderNotes`: text nullable
    - `subtotalCents`: integer not null
    - `shippingCents`: integer not null default 0
    - `totalCents`: integer not null
    - `createdAt`: integer not null (Unix timestamp ms)
  - `orderItems`:
    - `id`: text primary key
    - `orderId`: text not null references `orders.id`
    - `productSlug`: text not null
    - `productTitle`: text not null
    - `size`: text nullable
    - `finish`: text nullable
    - `quantity`: integer not null
    - `unitPriceCents`: integer not null
    - `totalPriceCents`: integer not null
    - `imageSrc`: text not null
  - `contactInquiries`:
    - `id`: text primary key
    - `name`: text not null
    - `email`: text not null
    - `message`: text not null
    - `createdAt`: integer not null (Unix timestamp ms)
- Add `data/` to `.gitignore` to keep local SQLite database files out of git.
- Create automatic initialization helper `db/init.ts` that creates tables with
  `IF NOT EXISTS` so tests and dev servers run with zero manual migration commands.

### 2. Server Actions for Checkout & Orders (`app/actions/checkout.ts`)
- `placeOrderAction`:
  - Validates customer billing details using `reviewCheckoutDetails(details)`.
  - Receives serialized cart lines from client.
  - Cross-references each line's `slug` against `CATALOG_PRODUCTS` in `lib/catalog.ts`:
    - Validates product exists.
    - Validates size/finish options exist on that product.
    - Takes authoritative unit price in cents directly from `product.priceCents`.
    - Computes authoritative line total: `unitPriceCents * quantity`.
  - Calculates authoritative subtotal, free shipping over $500 ($0 vs $25 standard),
    and grand total.
  - Calls `await auth()` to link Clerk `userId` if user is signed in.
  - Inserts order and line items into SQLite database.
  - Returns `{ success: true, orderId: "..." }` or `{ success: false, errors: {...} }`.

### 3. Checkout UI & Confirmation Flow (`components/checkout/`)
- Update `components/checkout/checkout-content.tsx`:
  - Wire submit handler to `placeOrderAction` with `aria-busy` and loading state.
  - On success:
    - Calls `clearCart()` from `useCart()`.
    - Renders an accessible Order Confirmation screen with:
      - Order ID reference (`ORD-...`).
      - Confirmed status badge.
      - Placed date and time.
      - Complete itemized breakdown (items, quantities, authoritative totals).
      - Shipping address summary.
      - Action to "Continue Shopping" (`/shop`) and (if signed in) "View in Account" (`/account`).
- Retains full keyboard accessibility, visible focus rings, and error summaries.

### 4. Customer Order History on `/account` (`app/account/`)
- Update `app/account/page.tsx`:
  - Calls `await auth()` to get authenticated `userId`.
  - Queries SQLite `db` for orders where `userId = currentUserId`, ordered by `createdAt DESC`.
  - Alongside Clerk's `<UserProfile />`, renders an "Order History" section:
    - Order list card showing order ID, formatted date, status, item thumbnails/names/variants,
      and total in USD.
    - Empty state when no orders have been placed: renders `Empty` with clear message
      and primary button to `/shop`.
    - Accessible semantic headings and landmark structure.

### 5. Contact Inquiries Server Action (`app/actions/contact.ts`)
- Server Action `submitContactInquiryAction`:
  - Validates contact details via `reviewContactDetails(details)`.
  - Inserts inquiry record into `contactInquiries` table.
  - Returns `{ success: true }` or validation errors.
- Update `components/contact/contact-form.tsx`:
  - Submits to Server Action with pending indicator.
  - Displays positive confirmation banner upon successful submission.

### 6. Documentation (`docs/services.md` & `AGENTS.md`)
- Create `docs/services.md`: documents local SQLite persistence architecture,
  Drizzle schema, authoritative pricing boundaries, Server Action contracts,
  and Clerk identity linking.
- Update `AGENTS.md` documentation index: add `docs/services.md` as `current`.
- Update `docs/pages.md` with the Phase 10 certification record.

## Component boundaries and server/client ownership

- `db/schema.ts`, `db/index.ts`: Server-only modules; never imported by client.
- `app/actions/checkout.ts`, `app/actions/contact.ts`: Next.js Server Actions
  (`"use server"`).
- `app/account/page.tsx`: Server Component; fetches user orders from SQLite and
  passes to presentational OrderHistory component.
- `components/account/order-history.tsx`: Server or Client presentational component
  rendering order cards and empty states.
- `components/checkout/checkout-content.tsx`: Client Component; manages form state,
  dispatches Server Action, clears client cart on success, and presents confirmation.
- `components/contact/contact-form.tsx`: Client Component; submits to contact Server Action.

## Responsive behavior

- Desktop (1440px): Order history displays responsive card grid/table; confirmation
  screen aligns with the 1240px container.
- Tablet (1024px, 768px): Order cards stack gracefully with 32px gutters; line items
  wrap cleanly without horizontal overflow.
- Mobile (390px, 320px): Order summary collapses into vertical order cards; item
  thumbnails scale down; zero horizontal overflow (`scrollWidth <= clientWidth`).

## States

- Checkout form: default, filling, submitting (`aria-busy="true"`, disabled submit button),
  validation error (error summary with anchor links), order placed (confirmation view).
- Account order history: loading, empty state ("No orders yet"), populated list of orders,
  order details expansion.
- Contact form: default, submitting, validation error, success confirmation banner.

## Accessibility and security requirements

- Server-side validation: Client price and totals are ignored; authoritative prices
  are resolved on the server from `lib/catalog.ts`.
- Input sanitation: All text inputs sanitized and bounded by max lengths.
- WCAG 2.2 AA floor:
  - Accessible names on all buttons and form controls.
  - Status updates polite/assertive live regions (`role="status"`).
  - Visible focus rings with 3px width and proper contrast.
  - Zero axe-core accessibility violations.
- Clerk user isolation: In `/account`, orders are strictly queried by the verified
  `userId` from `await auth()`.

## Data shapes and edge cases

- Order record:
  ```typescript
  export type OrderRecord = {
    id: string
    userId: string | null
    status: "confirmed" | "processing" | "completed"
    customerName: string
    customerEmail: string
    customerPhone: string
    shippingAddress: {
      addressLine1: string
      addressLine2?: string
      city: string
      state: string
      zipCode: string
      country: string
    }
    orderNotes?: string
    subtotalCents: number
    shippingCents: number
    totalCents: number
    createdAt: number
    items: OrderItemRecord[]
  }
  ```
- Edge cases handled:
  - Empty cart submission rejected on server.
  - Manipulated client prices ignored; server recalculates authoritative prices.
  - Guest checkout supported (persisted with `userId: null`).
  - Authenticated checkout automatically links Clerk `userId`.
  - Database directory created automatically if missing.

## Non-goals

- No paid third-party cloud subscriptions or remote databases.
- No live credit-card payment gateways (Stripe, PayPal) requiring API keys.
- No external email SMTP or SaaS email services requiring credentials.
- No admin dashboard or inventory depletion system.

## Acceptance criteria

1. Placing an order on `/checkout` calls the Server Action, computes authoritative
   totals server-side from catalog definitions, writes the order and items into
   SQLite, clears the cart, and displays an order confirmation view.
2. Navigating to `/account` while authenticated displays all orders placed by the
   current Clerk user, or an accessible empty state with a link to `/shop`.
3. Submitting the contact form on `/contact` validates input and stores the inquiry
   in SQLite, displaying a confirmation message.
4. All existing tests (152 tests across 28 files) continue to pass.
5. New automated tests cover order creation, server calculation, database operations,
   and `/account` order rendering.
6. 0 lint warnings, 0 TypeScript errors, clean Next.js Turbopack build.
7. 0 axe accessibility violations across touched routes.

## Automated checks and verification

- `npm run test`: unit and integration tests for schema, server actions, and UI.
- `npm run lint`: ESLint check.
- `npx tsc --noEmit`: TypeScript check.
- `npm run build`: Turbopack production build.
- `agent-browser` verification (named session):
  - Add item to cart -> Proceed to checkout -> Complete checkout -> Verify order confirmation.
  - Navigate to `/account` -> Verify order history displays the placed order.
  - Submit `/contact` form -> Verify success message.
  - Responsive audit across 1440, 1024, 768, 390, and 320 px viewports.

## Documentation to create or update

- Create `docs/services.md`: architecture, schema, server action contracts, and verification.
- Update `AGENTS.md` documentation index: add `docs/services.md` as `current`.
- Update `docs/pages.md` with Phase 10 certification record.

## SKILLS USED

- `code-review`: mandatory dual-axis (Standards and Spec) subagents review.
- `caveman-commit`: Conventional Commits for implementation and fix commits.
- `clerk` & `clerk-nextjs-patterns`: auth session verification in Server Actions.
- `building-components`: accessible order history and confirmation UI.
- `vercel-react-best-practices`: Server Action data flow and bundle optimization.
- `react-testing`: Vitest integration tests for database and actions.
- `agent-browser`: customer flow and responsive verification.
