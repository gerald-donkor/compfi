# Newsletter Subscription Service and Footer Form Integration (Phase 10)

## Status and authorization boundary

Prepared by the single-letter `i` workflow on 2026-09-11 following the project's
ordered build sequence and the 100% free, local SQLite persistence architecture.

This is a planning artifact only. It authorizes no implementation, dependency
installation, staging, commit, or push until the user explicitly approves it
through the single-letter `y` workflow.

Planning-time repository state is a clean `main` at `e1dbd5b` (`git status --short`
empty at prompt-preparation time, 31 test files and 166 tests passing, 0 lint
warnings, Next.js build clean with 22 static routes prerendered). Reconfirm
`git status --short`, `git branch --show-current`, recent history, and `HEAD`
before execution. Stop if the branch is not `main`. Preserve every unrelated
path that appears after this prompt is prepared.

## Goal and why this is the next dependency-safe unit

Deliver the remaining customer-facing service integration from the design
references under Phase 10 (**Real services: catalog data, CMS, checkout/payment,
order persistence, email, analytics, or other integrations only after each
provider and contract is explicitly selected | approved product requirements**;
AGENTS.md §8 phase 10).

- In `design/1-Home.png` and `design/8-Contact.png`, the global footer features
  a dedicated fourth column: **"Newsletter"** with the instruction
  `"Enter Your Email Address"` and a prominent `"SUBSCRIBE"` action.
- During Phase 3 (Shared Chrome, Prompt 06), this column was deliberately
  deferred because no email or subscriber persistence service had been approved:
  *"reserve no inactive form control that appears to submit a newsletter until
  such a service is approved"* (`prompts/06-build-shared-chrome.md` line 81).
- In Prompt 26, the user mandated a **completely free, self-contained local stack**
  automated without cloud dependencies or paid APIs. We established embedded
  SQLite (`file:data/compfi.db`) with Drizzle ORM and Next.js Server Actions.
- With the persistence infrastructure in place, implementing the Newsletter
  Subscription service completes the visual fidelity of the reference footer,
  provides an authoritative Server Action for subscriber management, records
  subscribers transactionally in SQLite, and gives customers clear, accessible
  feedback.

## Relevant source files, design references, and measurements

- Design references:
  - `design/1-Home.png` (bottom 600px, y=8700 to 9300): 4-column footer layout.
  - Desktop raster scale: 2:1 raster-to-CSS pixel ratio, 1240 CSS px max container.
- Measured reference values from `/tmp/compfi-newsletter-crop.png` (800×300 native crop):
  - Column heading: `"Newsletter"`, font size 16 CSS px (`type-label`), color `#9F9F9F` (`--color-compfi-muted`).
  - Form layout: horizontal inline group with email input and submit button.
  - Input field: transparent background, 1px bottom border `#000000`/`#242424` (`--color-compfi-ink`), placeholder `"Enter Your Email Address"` in `#9F9F9F`. Width flexible up to ~220 CSS px.
  - Action button: `"SUBSCRIBE"`, uppercase, bold font (`font-semibold`, 14 CSS px), 1px bottom border `#000000`, min 44×44 CSS px touch target.
  - Gap between input and button: ~12 CSS px (`gap-3`).
- Key source files:
  - `components/chrome/site-footer.tsx`: current 3-column footer component.
  - `db/schema.ts`: Drizzle SQLite table definitions.
  - `db/init.ts`: automatic DDL schema initialization (`ensureDbSchema`).
  - `db/index.ts`: database client instance.
  - `docs/services.md`: local persistence and services contract.
  - `docs/components.md`: component inventory and specifications.
  - `docs/pages.md`: route and chrome build records.

## Existing code and package behavior inspected

- Next.js: `16.3.4` (App Router, Server Actions supported).
- React: `19.2.8`.
- Database: `@libsql/client` `0.15.15` + `drizzle-orm` `0.45.1`.
- DDL initialization: `ensureDbSchema()` executes `CREATE TABLE IF NOT EXISTS`
  on startup, guaranteeing zero manual migrations.

## Exact scope, expected files, and route impact

### 1. Database Layer (`db/`)
- In `db/schema.ts`: Define `newsletterSubscribers` SQLite table:
  - `id`: `text("id").primaryKey()` (prefixed e.g. `sub_...`)
  - `email`: `text("email").notNull().unique()`
  - `createdAt`: `integer("created_at").notNull()` (epoch ms timestamp)
  - `status`: `text("status").notNull().default("active")` (`'active' | 'unsubscribed'`)
- In `db/init.ts`: Add `CREATE TABLE IF NOT EXISTS newsletter_subscribers` DDL
  statement with index on `email`.
- Create `db/newsletter.ts`:
  - `subscribeEmail(email: string): Promise<{ isNew: boolean; id: string }>`
  - `getSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>`

### 2. Server Action (`app/actions/newsletter.ts`)
- Export `subscribeNewsletterAction(input: { email: string } | FormData): Promise<NewsletterActionResult>`:
  - Validates email presence, string type, trimmed lowercase normalization.
  - Enforces RFC 5322 regex validation (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) and max length 255 chars.
  - Performs idempotent insert: if email already exists, returns `{ success: true, message: "You are already subscribed to Compfi updates." }`.
  - On new subscription, inserts row and returns `{ success: true, message: "Thank you for subscribing to Compfi updates." }`.
  - On invalid input, returns `{ success: false, error: "Please enter a valid email address." }`.

### 3. UI Component (`components/chrome/newsletter-form.tsx`)
- Create client component `NewsletterForm`:
  - Visually hidden label `<label htmlFor="newsletter-email" className="sr-only">Email address</label>`.
  - Accessible input `<input id="newsletter-email" type="email" name="email" autoComplete="email" placeholder="Enter Your Email Address" required ... />` styled with border-bottom matching design.
  - Submit button `<button type="submit">SUBSCRIBE</button>` with border-bottom, uppercase bold typography, and min 44×44 px touch target.
  - Visual loading state: `aria-busy="true"` on form while submitting, disabled submit button.
  - Accessible live status region: `<div role="status" aria-live="polite">` displaying success banner or field error.
  - Resets input on successful submission.

### 4. Chrome Integration (`components/chrome/site-footer.tsx`)
- Update `SiteFooter` grid from 3 columns to 4 columns matching `design/1-Home.png`:
  - Desktop: `lg:grid-cols-[minmax(0,1.2fr)_repeat(2,minmax(7rem,0.5fr))_minmax(0,1.4fr)]`
  - Tablet: wraps cleanly into a 2x2 grid `md:grid-cols-2`
  - Mobile: stacks vertically `grid-cols-1`
  - Integrates `NewsletterForm` under a `"Newsletter"` column heading with `type-label text-muted`.

### 5. Automated Tests (`test/`)
- `test/newsletter.test.ts` (or integration in `test/actions.test.ts` and `test/db.test.ts`):
  - Database subscription and duplicate handling.
  - Server Action validation (empty, invalid format, too long, valid).
- `test/newsletter-form.test.tsx`:
  - Form rendering, field attributes, accessibility labels.
  - Submission state, pending disable, live region announcement.
  - `axe-core` accessibility audit (0 violations).

## Component boundaries and server/client ownership

- `SiteFooter` (`components/chrome/site-footer.tsx`): Server Component. Renders
  brand, navigation link columns, legal line, and composes `NewsletterForm`.
- `NewsletterForm` (`components/chrome/newsletter-form.tsx`): Client Component
  (`"use client"`). Small interactive leaf managing local submission state,
  calling Server Action, and updating the polite live region.
- `subscribeNewsletterAction` (`app/actions/newsletter.ts`): Server Action
  (`"use server"`). Authoritative validation and database persistence.
- `db/newsletter.ts`: Server-only database queries.

## Responsive behavior at explicit widths

- **1440 CSS px (Desktop)**: 4-column layout (`[Brand] [Explore] [Connect] [Newsletter]`).
  Newsletter form sits in the fourth column with inline input and button.
- **1024 CSS px (Desktop / Large Tablet)**: 4-column layout with flexible column widths.
- **768 CSS px (Tablet)**: 2×2 grid (`[Brand] [Explore] / [Connect] [Newsletter]`).
- **390 CSS px (Mobile)**: Single-column stacked layout (`gap-10`). Newsletter form
  remains inline or gracefully wraps if screen width is constrained; input and
  button touch targets $\ge 44 \times 44$ px.
- **320 CSS px (Narrow Mobile)**: Full-width stacked elements with zero horizontal overflow
  (`scrollWidth <= clientWidth`).

## States

- **Default**: Clean transparent input with bottom border, placeholder text,
  and `"SUBSCRIBE"` button.
- **Hover**: Button text subtly emphasizes (`hover:text-compfi-ink/80` or
  `hover:border-compfi-ink/80`).
- **Focus-Visible**: Visible focus ring on both input and button (`focus-visible:ring-2 focus-visible:ring-compfi-brand`).
- **Loading / Busy**: `aria-busy="true"` on form, submit button disabled with
  `"Subscribing..."` text or spinner, input disabled.
- **Success**: Form input cleared, polite green announcement banner rendered in
  `role="status"`.
- **Error**: Inline error message in `role="status"` with accessible red styling,
  input retains value for correction.

## Accessibility and security requirements

- Form landmarks and accessible names: `<form aria-label="Subscribe to newsletter">`.
- Input has an explicitly associated `<label>` (visually hidden via `sr-only`).
- `autoComplete="email"` and `type="email"` for browser autofill and mobile email keyboard.
- Live region (`role="status"`, `aria-live="polite"`) for feedback without disrupting focus.
- Touch target sizes at least 44×44 CSS px for all interactive elements.
- Input validation on both client and server boundaries.
- Database queries parameterized via Drizzle ORM to prevent SQL injection.
- Email addresses normalized to lowercase and trimmed before storage.

## Data shapes and edge cases

- Subscriber table schema:
  ```ts
  export interface NewsletterSubscriberRecord {
    id: string
    email: string
    createdAt: number
    status: "active" | "unsubscribed"
  }
  ```
- Edge cases handled:
  - Empty or whitespace-only email rejected.
  - Invalid email format (missing `@`, missing domain, invalid characters) rejected.
  - Duplicate subscription: gracefully returns positive status ("You are already subscribed to Compfi updates.") without throwing unique constraint error.
  - Database schema initializes automatically if table does not exist.

## Non-goals

- No third-party email delivery services (SendGrid, Mailchimp, Resend) requiring API keys.
- No automated marketing campaigns or unsubscription email links.
- No admin subscriber management UI.

## Acceptance criteria

1. Footer renders 4 columns on desktop matching `design/1-Home.png`, including
   the `"Newsletter"` heading, `"Enter Your Email Address"` input, and `"SUBSCRIBE"` action.
2. Submitting a valid email invokes `subscribeNewsletterAction`, inserts a record
   into `newsletter_subscribers` in SQLite, clears the input, and displays an
   accessible success message.
3. Submitting an already registered email returns an idempotent confirmation
   without database errors.
4. Submitting an invalid email displays an accessible error message and preserves
   the input value.
5. 0 axe accessibility violations across `SiteFooter` and `NewsletterForm`.
6. Responsive layout verified across 1440, 1024, 768, 390, and 320 px viewports
   with 0 horizontal overflow.
7. All automated tests pass (unit, integration, lint, TypeScript, Next.js build).

## Automated checks and verification

- `npm run test`: unit and integration tests for schema, server action, and UI.
- `npm run lint`: ESLint check.
- `npx tsc --noEmit`: TypeScript check.
- `npm run build`: Turbopack production build.
- `agent-browser` verification (named session `compfi-newsletter`):
  - Subscribe with valid email on `/` -> verify success message and SQLite row.
  - Subscribe with duplicate email -> verify idempotent message.
  - Subscribe with invalid email -> verify error message.
  - Responsive audit across 1440, 1024, 768, 390, and 320 px viewports.

## Documentation to create or update

- Update `docs/services.md`: document `newsletter_subscribers` schema, Server Action
  contract, and verification evidence.
- Update `docs/components.md`: document `NewsletterForm` and updated `SiteFooter`
  geometry and accessibility contract.
- Update `docs/pages.md`: record Phase 10 newsletter service completion.

## SKILLS USED

- `code-review`: mandatory dual-axis (Standards and Spec) subagents review.
- `caveman-commit`: Conventional Commits for implementation and fix commits.
- `building-components`: accessible form controls and responsive layout.
- `vercel-react-best-practices`: Server Action data flow and bundle optimization.
- `react-testing`: Vitest unit and integration tests with axe-core.
- `agent-browser`: customer flow and responsive verification.
