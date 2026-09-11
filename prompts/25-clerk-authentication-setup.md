# Clerk authentication setup and protected account route (Phase 9)

## Status and authorization boundary

Prepared by the single-letter `i` workflow on 2026-09-11. This is a planning
artifact only. It authorizes no implementation, dependency installation,
staging, commit, or push until the user explicitly approves it through the
single-letter `y` workflow.

Planning-time repository state is a clean `main` at `02c95ab`
(`git status --short` empty at prompt-preparation time). Reconfirm
`git status --short`, `git branch --show-current`, recent history, and `HEAD`
before execution. Stop if the branch is not `main`. Preserve every unrelated
path that appears after this prompt is prepared.

## Goal and why this is the next dependency-safe unit

Deliver Phase 9 of the build sequence (**Authentication when required: Clerk setup
and protected-account behavior following section 11**; AGENTS.md §8 phase 9,
depends on relevant product requirement and phases 1–3):

- Phases 1–8 of the Compfi storefront are complete, verified, and certified across
  all nine storefront surfaces (`/`, `/shop`, `/shop/[slug]`, cart drawer modal,
  `/comparison`, `/cart`, `/checkout`, `/contact`, `/blog`), the design-system
  specimen (`/design-system`), and the custom 404 recovery route (`app/not-found.tsx`),
  with 140 passing automated tests, zero axe accessibility violations, and clean
  Turbopack production builds.
- The visual references (`design/1-Home.png`, `design/2-Shop.png`, etc.) establish
  an account icon affordance in the desktop navigation chrome. In phases 1–8, this
  was intentionally kept unbuilt per AGENTS.md §8 and §11 ("The account icon in the
  design may remain a presentational navigation target until that phase is approved").
- Phase 9 brings authentication to life using Clerk, the project's contracted
  identity platform, providing:
  1. CLI-first accountless provisioning via `npx -y clerk@latest init` and `@clerk/nextjs`.
  2. Next.js 16 Proxy convention (`proxy.ts`) with `clerkMiddleware` protecting `/account`.
  3. `<ClerkProvider dynamic>` integration inside `<body>` in `app/layout.tsx`.
  4. Design-system theme integration via `@clerk/ui` using the shadcn theme and Compfi semantic tokens.
  5. Header authentication controls in `components/chrome/header-controls.tsx`:
     - Signed-out state: accessible Account action opening sign-in modal/page (`<SignInButton>`).
     - Signed-in state: `<UserButton />` with accessible user management menu.
     - Mobile menu mirror for mobile viewports.
  6. Protected customer account surface at `/account` that verifies identity on the server (`await auth()`).
  7. Dedicated sign-in and sign-up catch-all routes (`app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx`) centered inside Compfi layout.
  8. Creation of `docs/auth.md` and updating the `AGENTS.md` documentation index.

## Preliminary setup checklist (AGENTS.md §11 & ref/clerk-setup.md)

Upon approval of this prompt, the implementation workflow executes following the
exact preliminary checklist required by `ref/clerk-setup.md`:

```
Here's what I'll do to get you set up with Clerk.

1. Set up Clerk in this project via the Clerk CLI (accountless development mode, writing keys to .env.local).
2. Configure Next.js 16 proxy (proxy.ts), root ClerkProvider, and shadcn theme from @clerk/ui.
3. Integrate header auth controls, dedicated auth routes, and protected /account page.
4. Verify with clerk doctor and automated test suite.
5. Optionally sign in later to claim the app.
```

## Relevant source files, design references, and measurements

- Design references:
  - `design/1-Home.png`, `design/2-Shop.png`: Desktop navigation chrome (raster y=0..200, 100 CSS px height, centered 1240 CSS px container).
  - Header right utility controls show 4 actions: Account (user glyph), Search, Heart (wishlist), Cart.
  - Account icon: observed ~28×28 raster pixels (~14 CSS px glyph centered in a 44×44 CSS px minimum touch target), matching `lucide-react`'s `UserIcon`.
- Contract & documentation references:
  - `AGENTS.md`: §§1.1, 1.2, 2.3, 3.1–3.4, 6.1–6.4, 7, 8, 9, 11, 12, 13.
  - `ref/clerk-setup.md`: CLI-first setup contract, environment safety, `proxy.ts`, `ClerkProvider` placement.
  - Installed Next.js 16 documentation: `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`.
  - Installed Clerk skills: `clerk`, `clerk-setup`, `clerk-nextjs-patterns`, `clerk-custom-ui`.
- Key existing source files:
  - `app/layout.tsx`: Root layout with `<body>` wrapper, `CartProvider`, `SiteHeader`, `SiteFooter`.
  - `components/chrome/site-header.tsx`: Header landmark and container layout.
  - `components/chrome/header-controls.tsx`: Interactive navigation, cart trigger, and mobile menu.
  - `app/globals.css`: Tailwind 4 theme, semantic tokens, and base layers.
  - `app/robots.ts` & `app/sitemap.ts`: Search engine configuration (disallow/exclude protected account pages).

## Existing code and package behavior inspected

- Next.js: `16.3.4` (App Router). Crucial: Next.js 16 requires `proxy.ts` in the project root, not legacy `middleware.ts`.
- React: `19.2.8`.
- Tailwind CSS: `4`.
- shadcn/ui: `components.json` is configured in the repository root. `components/ui/` houses existing primitives.
- Fonts: self-hosted Poppins via `next/font/local`.
- Test framework: Vitest `4.1.11` + React Testing Library `16.3.3` + `axe-core` `4.13.0`.
- Clerk CLI: will run via `npx -y clerk@latest init` to detect Next.js and npm, provision accountless development keys, and avoid manual secrets handling.

## Exact scope, expected files, and route impact

### 1. Provisioning & Dependencies
- Execute `npx -y clerk@latest init` (in non-interactive agent mode).
- Install `@clerk/ui` for the shadcn theme: `npm install @clerk/ui`.
- Reconfirm `.env.local` contains `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` without printing or logging their values.
- Verify `.gitignore` ignores `.env*` files (already configured).

### 2. Next.js 16 Proxy Convention (`proxy.ts`)
- Create `proxy.ts` in the project root using `clerkMiddleware` and `createRouteMatcher` from `@clerk/nextjs/server`:
  ```typescript
  import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

  const isProtectedRoute = createRouteMatcher(["/account(.*)"])

  export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect()
  })

  export const config = {
    matcher: [
      "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
      "/(api|trpc)(.*)",
    ],
  }
  ```
- All storefront catalog and content routes (`/`, `/shop`, `/cart`, `/checkout`, `/contact`, `/blog`, `/comparison`, `/design-system`, `/robots.txt`, `/sitemap.xml`) remain public.

### 3. Root Layout Integration (`app/layout.tsx`)
- Import `ClerkProvider` from `@clerk/nextjs`.
- Import `shadcn` from `@clerk/ui/themes`.
- Place `<ClerkProvider dynamic appearance={{ theme: shadcn }}>` inside `<body>` wrapping the content hierarchy.
- In `app/globals.css`, add `@import '@clerk/ui/themes/shadcn.css';`.

### 4. Header Auth Controls (`components/chrome/header-controls.tsx`)
- Enhance desktop header controls and mobile drawer navigation:
  - Add `<Show when="signed-out">`: renders `<SignInButton mode="modal">` wrapping an `IconButton` (Lucide `UserIcon`, accessible label `"Sign in to account"`, `variant="ghost"`, 44×44px minimum target).
  - Add `<Show when="signed-in">`: renders `<UserButton />` with `userProfileMode="navigation"` or modal, pointing to `/account`, with accessible labeling.
  - Mobile navigation: include an account link or sign-in action in the mobile drawer list so mobile users have equal access.

### 5. Protected Account Route (`app/account/page.tsx`)
- Route: `/account`.
- Server Component that verifies session using `await auth()`:
  ```typescript
  import { auth } from "@clerk/nextjs/server"
  import { redirect } from "next/navigation"
  import { PageHero } from "@/components/chrome/page-hero"
  import { Container } from "@/components/layout/container"
  import { UserProfile } from "@clerk/nextjs"

  export default async function AccountPage() {
    const { isAuthenticated } = await auth()
    if (!isAuthenticated) {
      redirect("/sign-in?redirect_url=/account")
    }

    return (
      <main id="main-content">
        <PageHero title="My Account" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Account" }]} />
        <Container className="py-12 flex justify-center">
          <UserProfile routing="hash" />
        </Container>
      </main>
    )
  }
  ```
- Configure route metadata (`Account | Compfi`, `noindex: true`, `canonical: "https://compfi.com/account"`).

### 6. Dedicated Sign-In & Sign-Up Routes (`app/sign-in/[[...sign-in]]/page.tsx` & `app/sign-up/[[...sign-up]]/page.tsx`)
- Provide dedicated routes for direct navigation, OAuth callbacks, or fallback:
  - `app/sign-in/[[...sign-in]]/page.tsx`: renders `<SignIn />` centered inside Compfi container with `PageHero`.
  - `app/sign-up/[[...sign-up]]/page.tsx`: renders `<SignUp />` centered inside Compfi container with `PageHero`.
  - Both routes marked `noindex: true`.

### 7. Search Engine Directives (`app/robots.ts` & `app/sitemap.ts`)
- Update `app/robots.ts`: add `Disallow: /account` to protect customer identity surfaces from indexing.
- Ensure `app/sitemap.ts` does NOT include `/account`, `/sign-in`, or `/sign-up`.

### 8. Documentation (`docs/auth.md` & `AGENTS.md`)
- Create `docs/auth.md`: record Clerk setup procedure, accountless dev keys contract, `proxy.ts` strategy, shadcn theming, protected route boundaries, and verification instructions.
- Update `AGENTS.md` documentation index: change `docs/auth.md` status from `planned` to `current`.
- Update `docs/components.md` and `docs/pages.md` with the new auth components and route records.

## Component boundaries and server/client ownership

- `proxy.ts`: Next.js 16 server-side proxy boundary.
- `app/layout.tsx`: Server Component layout; imports `ClerkProvider` from `@clerk/nextjs`.
- `components/chrome/header-controls.tsx`: Client Component (`"use client"`) using `<Show>`, `<SignInButton>`, `<UserButton>`.
- `app/account/page.tsx`: Server Component; calls `await auth()`.
- `app/sign-in/[[...sign-in]]/page.tsx`: Client/Server boundary hosting Clerk's `<SignIn />`.
- `app/sign-up/[[...sign-up]]/page.tsx`: Client/Server boundary hosting Clerk's `<SignUp />`.

## Responsive behavior

- Desktop (1440px): Account control sits inline in `HeaderControls` between or beside `CartDrawer` with 44px touch target; UserButton dropdown menu positions within viewport.
- Tablet (1024px, 768px): Header controls maintain flexible spacing (`gap-2` to `gap-4`); no wrapping or overlap.
- Mobile (390px, 320px): Account icon visible in the header bar; mobile menu (`#mobile-primary-navigation`) mirrors account navigation. Zero horizontal page overflow (`scrollWidth === clientWidth`).

## States

- Signed-out default: User icon button with accessible name "Sign in to account".
- Signed-out hover/focus-visible: 3px brand focus ring (`--color-brand-focus`), ghost button hover background.
- Modal active: Clerk sign-in modal traps focus, closes on Escape, preserves body scroll lock.
- Signed-in default: `<UserButton />` with user avatar/initial, min 44px touch target.
- Signed-in menu open: accessible dropdown menu with profile link, manage account, sign out.
- Protected route unauthorized: immediate server redirect to sign-in with redirect URL parameter.

## Accessibility and security requirements

- Accessibility (WCAG 2.2 AA floor):
  - Visible focus indicators on all interactive triggers (`focus-visible:ring-3`).
  - Accessible name on the account button (`aria-label="Sign in to account"` or visible text).
  - Clean semantic landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`).
  - 0 axe-core violations on all augmented surfaces.
- Security:
  - `await auth()` on every Server Component checking session.
  - Never read, display, or commit `.env.local` or environment keys in chat or git.
  - Never expose `CLERK_SECRET_KEY` to client components.
  - Client-side `<Show>` is a presentation toggle, not an authorization boundary. The real boundary is `proxy.ts` and `app/account/page.tsx`.
  - Clerk Billing is strictly prohibited; no subscriptions or external payment hooks.

## Data shapes and edge cases

- Unauthenticated request to `/account`: caught by `proxy.ts` and `app/account/page.tsx`, redirected cleanly.
- Unauthenticated access to public routes: unaffected, fast static/dynamic response.
- Browser text zoom (200%): header controls reflow gracefully without horizontal overflow.
- Reduced motion: emulated `prefers-reduced-motion: reduce` respects system duration tokens.

## Reference deltas

- The static PNGs depict an inert account icon in the header; Compfi connects it to functional, secure authentication via Clerk.
- The Clerk UI is themed to match Compfi's design system using `@clerk/ui` shadcn theme and Compfi gold/cream tokens.

## Non-goals

- No Clerk Billing or subscription tiers (Compfi storefront checkout remains presentational).
- No external webhook synchronization or PostgreSQL database (Phase 10 covers real persistence).
- No multi-tenant B2B organizations or complex role matrices.

## Acceptance criteria

1. `npx -y clerk@latest doctor` passes with zero critical issues.
2. `proxy.ts` exists and protects `/account`, while all storefront browsing routes remain public.
3. Header controls display accessible sign-in and user controls across desktop and mobile viewports.
4. `/account` requires authentication, redirecting unauthenticated visitors to `/sign-in`.
5. `/sign-in` and `/sign-up` render styled Clerk components within Compfi chrome.
6. `npm run test` passes with new test coverage for auth integration and proxy route matcher.
7. `npm run lint` and `npx tsc --noEmit` pass with zero warnings and zero errors.
8. `npm run build` succeeds prerendering public routes cleanly.
9. `axe-core` site-wide audit confirms 0 accessibility violations across all updated routes.
10. `docs/auth.md` is written and indexed in `AGENTS.md`.

## Verification commands and browser flows

- Run `npx -y clerk@latest doctor --json`.
- Run `npm run test`.
- Run `npm run lint`.
- Run `npx tsc --noEmit`.
- Run `npm run build`.
- In a dedicated `agent-browser` session:
  - Verify header at 1440, 1024, 768, 390, 320 px viewports (`scrollWidth === clientWidth`).
  - Test Account button click opens sign-in modal or navigates to `/sign-in`.
  - Test direct navigation to `/account` redirects to `/sign-in?redirect_url=...`.
  - Verify axe-core audit reports 0 violations on `/`, `/sign-in`, and header chrome.

## Documentation to create or update

- Create `docs/auth.md` owning Clerk architecture, configuration, security rules, and verification.
- Update `AGENTS.md` documentation table: mark `docs/auth.md` as `current`.
- Update `docs/components.md` with `HeaderControls` auth additions.
- Update `docs/pages.md` with the Phase 9 build record.

## SKILLS USED

- `clerk`: overall Clerk architecture and CLI command routing.
- `clerk-setup`: initial CLI provisioning, package installation, and environment configuration.
- `clerk-nextjs-patterns`: `proxy.ts` route matcher, server-side `await auth()`, `<Show>`, and protected routes.
- `clerk-custom-ui`: shadcn theme integration from `@clerk/ui` and styling Clerk components to match Compfi design system.
- `building-components`: component APIs, accessible names, 44px targets, data attributes.
- `vercel-react-best-practices`: Next.js 16 Server Components, dynamic rendering, async `auth()`, avoiding waterfalls.
- `react-testing`: Vitest/RTL component and integration tests for auth boundaries and navigation.
- `web-design-guidelines`: UX and accessibility guidelines review.
- `agent-browser`: browser-based verification of auth controls, sign-in/up modal/page, account route, and responsive layout.
- `code-review`: mandatory dual-axis review (Standards and Spec subagents).
- `caveman-commit`: conventional commit messages.
