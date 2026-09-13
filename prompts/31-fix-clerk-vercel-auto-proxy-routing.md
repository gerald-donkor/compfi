# Prompt 31 — Route Clerk’s Vercel auto-proxy assets

## Status

Prepared for approval. This is a production-authentication defect fix; it is
not yet implemented.

## Problem and evidence

The production deployment at `https://compfi.vercel.app/sign-in` serves the
Compfi shell but leaves Clerk’s sign-in mount empty. A real-browser network
inspection on September 12, 2026 found repeated 404 responses for:

```
https://compfi.vercel.app/__clerk/npm/@clerk/clerk-js@6/dist/clerk.browser.js
https://compfi.vercel.app/__clerk/npm/@clerk/ui@1/dist/ui.browser.js
```

The installed `@clerk/nextjs` version is `7.9.2`. Its installed source enables
the Vercel app-origin auto-proxy for a production publishable key when the
request host is eligible, with `/__clerk` as the default proxy path. The
current broad `proxy.ts` matcher includes the root proxy path but excludes
requests ending in `.js`; Clerk’s proxied JavaScript assets therefore never
reach `clerkMiddleware` and return 404.

The selected Clerk production app-origin proxy URL is:

```
https://compfi.vercel.app/__clerk
```

This uses no DNS record and does not require `NEXT_PUBLIC_CLERK_PROXY_URL`.

## Scope

1. In `proxy.ts`, add an explicit Clerk proxy matcher that includes all
   `/__clerk/*` requests, using the installed Clerk/Next.js-compatible matcher
   syntax. Preserve the current account protection logic and the existing
   static-asset exclusions for all non-Clerk traffic.
2. Extend the focused proxy test in `test/account.test.tsx` to assert that the
   explicit Clerk proxy matcher remains in the exported configuration. Keep
   account protection tests behavior-focused and unchanged except where needed
   to import the configuration.
3. Update `docs/auth.md` as the owner of the authentication contract. Record
   the Vercel app-origin proxy behavior, explicit matcher rationale, proxy URL,
   and actual verification evidence. Do not record a live success until the
   corrected deployment has been pushed, deployed, and browser-verified.

## Non-goals

- Do not alter Clerk keys, inspect `.env.local`, expose any secret, or change
  Vercel or Clerk dashboard settings.
- Do not add a custom DNS domain, a rewrite, a route handler, or an explicit
  `NEXT_PUBLIC_CLERK_PROXY_URL`.
- Do not change protected-route scope, sign-in/sign-up UI, Clerk appearance,
  product behavior, payments, or any other storefront surface.
- Do not push to the remote. The approved workflow only creates local commits;
  deployment follows a later standalone guarded `P` command.

## Required sources before execution

- `AGENTS.md`, especially sections 3.2, 3.4, 5, 9, and 11.
- `docs/auth.md`.
- `proxy.ts` and `test/account.test.tsx`.
- `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`.
- Installed Clerk auto-proxy source:
  `node_modules/@clerk/nextjs/dist/esm/server/clerkMiddleware.js`.
- Clerk Next.js patterns and the official Clerk deployment/proxy guidance.

## Implementation constraints

- Use `proxy.ts`, the Next.js 16 convention; do not create `middleware.ts`.
- Use only a declarative `config.matcher` entry for this repair. Clerk’s
  installed middleware already owns the auto-proxy behavior.
- Prefer Clerk’s documented `"/__clerk/(.*)"` matcher form, which explicitly
  accepts asset extensions such as `.js` and matches the project’s existing
  Clerk quickstart convention. Confirm against installed Next.js 16 matcher
  documentation before writing it.
- Keep public routes public; only `/account(.*)` invokes `auth.protect()`.
- Keep the public publishable key public but never log, render, commit, or
  otherwise expose a secret key.

## Verification

1. Run the focused account/proxy test and then `npm run test`.
2. Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
3. Inspect the complete diff and confirm it affects only `proxy.ts`, its
   focused test, and `docs/auth.md`.
4. In an isolated named `agent-browser` session, after the corrected commit is
   deployed by an authorized later push, open `/sign-in` and confirm that
   `__clerk/npm/...clerk.browser.js` and `ui.browser.js` no longer return 404,
   the sign-in controls render, and no console/runtime errors occur. This live
   step cannot be completed before the local commit is pushed and Vercel
   deploys it.
5. Run the mandatory `code-review` workflow against the immutable `BASE_SHA`.
   Evaluate Standards and Spec findings independently, apply verified fixes in
   a separate local commit, and re-review if the change is material.

## Acceptance criteria

- `/__clerk/*` has an explicit proxy matcher that is not swallowed by the
  generic static-file exclusion.
- Clerk auto-proxied JavaScript assets are eligible for `clerkMiddleware` on a
  Vercel production host.
- Existing account protection and public storefront route behavior are
  preserved.
- Authentication documentation accurately distinguishes local verification
  from post-push production verification.
- All required local checks pass, changes are committed locally on `main`, and
  mandatory Standards and Spec reviews are completed under the project
  workflow.

## SKILLS USED

- `clerk`: routes the authentication repair to Clerk-specific guidance.
- `clerk-nextjs-patterns`: owns the Next.js proxy/auth boundary.
- `vercel-react-best-practices`: verifies the Next.js change avoids unnecessary
  client work or bundle changes.
- `react-testing`: owns focused Vitest coverage and appropriate assertion
  boundaries.
- `agent-browser`: verifies the real deployed sign-in surface and Clerk network
  assets in an isolated session after an authorized deploy.
- `code-review`: runs the mandatory independent Standards and Spec reviews.
- `caveman-commit`: supplies terse Conventional Commit messages for the
  implementation and any review-fix commit.
