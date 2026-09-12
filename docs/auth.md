# Clerk Authentication Architecture & Verification (Phase 9)

Compfi integrates authentication using **Clerk**, the storefront's contracted
identity platform. Authentication powers the account affordance visible in the
desktop and mobile navigation chrome (`design/1-Home.png`), protects customer
account data, and adheres strictly to Next.js 16 conventions and WCAG 2.2 AA
accessibility standards.

---

## 1. Architecture & Security Boundaries

Authentication is enforced through defense-in-depth across server, proxy, and
client boundaries:

1. **Server Proxy Boundary (`proxy.ts`)**:
   - Implemented under the Next.js 16 `proxy.ts` convention (replacing legacy `middleware.ts`).
   - Uses `clerkMiddleware` with `createRouteMatcher(["/account(.*)"])`.
   - Includes Clerk's explicit `"/__clerk/(.*)"` matcher in addition to the
     generic non-static matcher. This ensures Clerk frontend API assets such as
     `/__clerk/npm/.../clerk.browser.js` are handled by `clerkMiddleware` even
     though their `.js` extension is excluded from general storefront traffic.
     On eligible Vercel production hosts, Clerk 7.9.2 derives the app-origin
     proxy URL as `https://compfi.vercel.app/__clerk`; Compfi does not set
     `NEXT_PUBLIC_CLERK_PROXY_URL` or use a custom route, rewrite, or DNS
     domain for this behavior.
   - Protects customer surfaces (`/account*`) while allowing all storefront catalog,
     cart, checkout, comparison, contact, blog, and static asset routes to remain
     public and statically prerenderable.

2. **Server Component Identity Assertion (`app/account/page.tsx`)**:
   - Server Component verifies authentication via `await auth()`.
   - Unauthenticated requests are immediately redirected to `/sign-in?redirect_url=/account`.
   - Authenticated sessions render the Compfi page layout and `<UserProfile routing="hash" />`.

3. **Client UI State (`components/chrome/header-controls.tsx`)**:
   - Uses Clerk's `<Show>` control component for clean declarative branch rendering.
   - **Signed-out**: Renders a modal `<SignInButton>` wrapping an accessible `IconButton` (`UserIcon`, label `"Sign in to account"`, 44×44px minimum target).
   - **Signed-in**: Renders `<UserButton userProfileMode="navigation" userProfileUrl="/account" />`.
   - **Mobile Menu Drawer**: Includes matching `"Sign in"` and `"My Account"` triggers.
   - Note: Client `<Show>` toggles are presentational conveniences; the true security boundary remains `proxy.ts` and server-side `await auth()`.

---

## 2. CLI Provisioning & Keys

Clerk is provisioned via the Clerk CLI (`npx -y clerk@latest`) in accountless
development mode:

- **App ID**: `app_3JBGzf4pbdVQCn8j11KTft39QjX` (`Compfi`)
- **Development Instance**: `ins_3JBGzga9Jzitbjbwkz1oq4IhYL0`
- **Environment Keys**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are written to `.env.local`.
- **Environment Safety**: `.env.local` is gitignored (`.gitignore:34`). Keys are never logged or committed.
- **Route Configuration**: `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up` route unauthenticated redirects to custom pages.

---

## 3. Design System & Theming

Clerk components are styled to seamlessly match Compfi's warm minimalist aesthetic:

- **Theme Package**: `@clerk/ui` with the `shadcn` prebuilt appearance theme.
- **Styles**: `@import "@clerk/ui/themes/shadcn.css";` loaded in `app/globals.css`.
- **CSS Variables**: Compfi's semantic color tokens (`--primary`, `--card`, `--foreground`, `--ring`, `--muted`) map directly into Clerk UI primitives.
- **Root Provider**: `<ClerkProvider dynamic appearance={{ theme: shadcn }}>` placed inside `<body>` in `app/layout.tsx`.

---

## 4. Surfaces & Route Inventory

| Route | Surface Type | Security Boundary | UI Component |
| --- | --- | --- | --- |
| `/account` | Protected Page | `proxy.ts` + `await auth()` | `UserProfile` (hash routing) |
| `/sign-in/[[...sign-in]]` | Public Catch-all | Public | `SignIn` (path routing) |
| `/sign-up/[[...sign-up]]` | Public Catch-all | Public | `SignUp` (path routing) |
| Header right cluster | Chrome Utility | Client `<Show>` | `<SignInButton>` / `<UserButton>` |
| Mobile drawer | Chrome Navigation | Client `<Show>` | Action button / Nav Link |

---

## 5. SEO & Indexing Directives

Customer account and authentication routes are excluded from search engine indexing:

- **`app/robots.ts`**: Contains explicit exclusion directives:
  ```typescript
  disallow: "/account"
  ```
- **Metadata**: Each auth page sets `robots: { index: false, follow: false }`.
- **`app/sitemap.ts`**: Omits `/account`, `/sign-in`, and `/sign-up`, containing only public storefront pages and catalog products.

---

## 6. Verification Evidence

1. **Clerk Doctor**: `npx -y clerk@latest doctor --json` reports "All checks passing" (CLI version, authentication, app reachability, environment variables, MCP server).
2. **Automated Test Suite**: 28 test files and 152 automated tests pass (`npm run test`), including `test/account.test.tsx` verifying signed-out/signed-in chrome, proxy route matching, server redirect, and 0 axe accessibility violations.
3. **Lint & Typecheck**: Zero ESLint warnings/errors (`npm run lint`), zero TypeScript errors (`npx tsc --noEmit`).
4. **Next.js Production Build**: `npm run build` succeeds under Next.js 16.3.4 (Turbopack), prerendering 22 static pages and recognizing `ƒ Proxy (Middleware)`.
5. **Browser Verification (`agent-browser`)**:
   - Header Account button opens Clerk sign-in modal with keyboard focus and Escape dismissal.
   - Navigating to `/account` redirects with HTTP 307 to `/sign-in?redirect_url=...`.
   - Dedicated `/sign-in` and `/sign-up` render within Compfi `PageHero` and `Container`.
   - Verified 0 horizontal overflow across 1440, 1024, 768, 390, and 320 px viewports.

### Vercel app-origin proxy repair (September 12, 2026)

- Local automated verification covers the explicit `"/__clerk/(.*)"` proxy
  matcher and preserves the existing `/account*` protection behavior.
- Production verification is intentionally pending an authorized push and Vercel
  deployment. After deployment, use an isolated named `agent-browser` session
  to confirm `/sign-in` renders Clerk controls, the Clerk JavaScript assets no
  longer return 404, and the browser has no console or runtime errors.
