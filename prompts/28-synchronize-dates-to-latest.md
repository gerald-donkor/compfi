# Synchronize storefront and editorial dates to latest (2026-09-12)

## Status and authorization boundary

Prepared by the single-letter `i` workflow on 2026-09-12 in direct response to the
user's durable rule instruction: "Always make sure the dates used across all the
pages are the latest."

This is a planning artifact only. It authorizes no implementation, dependency
installation, staging, commit, or push until the user explicitly approves it
through the single-letter `y` workflow.

Planning-time repository state is a clean `main` at `47dd46d` (`git status --short`
empty at prompt-preparation time, 33 test files and 178 tests passing, 0 lint
warnings, Next.js Turbopack build clean). Reconfirm `git status --short`,
`git branch --show-current`, recent history, and `HEAD` before execution. Stop if
the branch is not `main`. Preserve every unrelated path that appears after this
prompt is prepared.

## Goal and why this is the next dependency-safe unit

Enforce the durable requirement from the ALWAYS ledger ("Always make sure the
dates used across all the pages are the latest.") that all customer-facing dates,
editorial timestamps, and sitemap metadata across all Compfi storefront surfaces
reflect the latest calendar date (`2026-09-12` and active year `2026`).

Why this is the next dependency-safe unit:
- Phases 1–10 of the storefront build sequence are complete, verified, and review-closed:
  design system, primitives, shared chrome, commerce browsing, cart & checkout,
  content surfaces, interaction and motion polish, site-wide accessibility & QA,
  Clerk authentication, and 100% free local SQLite persistence with authoritative
  Server Actions for orders, contact inquiries, and newsletter subscribers.
- The user established an explicit durable ALWAYS rule on 2026-09-11 requiring
  all dates across all pages to be the latest.
- Following the calendar rollover to `2026-09-12`, the primary storefront surfaces
  emitting static publication dates are:
  1. `/blog` (editorial article feed and "Recent Posts" sidebar in `lib/blog.ts`):
     lead articles currently carry `11 Sep 2026` / `2026-09-11`.
  2. `app/sitemap.ts` (search engine sitemap): `lastModified` timestamp
     currently stabilized at `2026-09-11T00:00:00.000Z`.
- Synchronizing these dates to `2026-09-12` ensures editorial fresh publication
  cadence, accurate sitemap metadata, and zero hydration discrepancy across SSR
  and static prerendering.

## Relevant source files, design references, and measurements

- Design references:
  - `design/9-Blog.png`: original visual comp showing editorial article card with
    calendar icon, author, and date string.
  - Desktop raster scale: 2:1 raster-to-CSS pixel ratio, 1240 CSS px container.
- Key source files:
  - `lib/blog.ts`: 24 static editorial post fixtures with `date` and `dateTime` properties.
  - `app/sitemap.ts`: Next.js sitemap generator emitting `lastModified` date.
  - `components/blog/blog-card.tsx`: semantic `<time>` rendering on article cards.
  - `components/blog/blog-recent-posts.tsx`: semantic `<time>` rendering in sidebar.
  - `test/blog.test.tsx`: test suite asserting blog post date formats and lead dates.
  - `test/phase8-audit.test.tsx`: test suite asserting sitemap `lastModified` timestamps.
  - `docs/pages.md`: route build records and reference deltas.

## Existing code and package behavior inspected

- `lib/blog.ts`:
  ```ts
  export interface BlogPost {
    readonly id: string
    readonly slug: string
    readonly title: string
    readonly category: BlogCategory
    readonly author: BlogAuthor
    readonly date: string       // formatted display e.g. "12 Sep 2026"
    readonly dateTime: string   // ISO date e.g. "2026-09-12"
    readonly excerpt: string
    readonly image: string
    readonly thumbnail: string
    readonly imageAlt: string
  }
  ```
- `app/sitemap.ts`:
  ```ts
  const lastModified = new Date("2026-09-11T00:00:00.000Z")
  ```
- `components/chrome/site-footer.tsx`: dynamically renders `new Date().getFullYear()`
  evaluating to `2026`.
- `components/account/order-history.tsx` & `components/checkout/order-confirmation.tsx`:
  format runtime epoch timestamps from SQLite via `Intl.DateTimeFormat`.

## Exact scope, expected files, and route impact

### 1. Editorial Fixtures (`lib/blog.ts`)
- Update the lead blog posts from `11 Sep 2026` / `2026-09-11` to `12 Sep 2026` /
  `2026-09-12`:
  - `going-all-in-with-millennial-design`: `12 Sep 2026` / `2026-09-12`
  - `exploring-new-ways-of-decorating`: `12 Sep 2026` / `2026-09-12`
  - `handmade-pieces-that-took-time-to-make`: `12 Sep 2026` / `2026-09-12`
- Preserve existing descending chronological sequence for remaining articles:
  `03 Sep 2026`, `28 Aug 2026`, down to `01 Apr 2026`.

### 2. Sitemap Metadata (`app/sitemap.ts`)
- Update `lastModified` to `new Date("2026-09-12T00:00:00.000Z")`.

### 3. Test Assertions (`test/`)
- In `test/blog.test.tsx`:
  - Update assertion `expect(blogPosts[0].date).toBe("12 Sep 2026")`.
  - Update assertion `expect(blogPosts[0].dateTime).toBe("2026-09-12")`.
- In `test/phase8-audit.test.tsx`:
  - Update assertion `expect((entry.lastModified as Date).toISOString()).toBe("2026-09-12T00:00:00.000Z")`.

### 4. Documentation (`docs/pages.md`)
- Update Blog and Site-wide QA documentation records with the date synchronization
  to `2026-09-12`.

## Component boundaries and server/client ownership

- `app/blog/page.tsx`: Server Component rendering `BlogFeed` and `BlogSidebar`.
- `components/blog/blog-card.tsx` & `components/blog/blog-recent-posts.tsx`:
  Server Components rendering semantic `<time>` elements.
- Statically deterministic values guarantee zero hydration mismatch between
  server render and client hydration.

## Responsive behavior

- Desktop (1440px), tablet (768px), and mobile (390px/320px) viewports maintain
  proper typography without text clipping or wrapping overflow.

## States

- Default: clean rendering of date text with calendar icon.
- Focus-visible: navigation links around article titles and "Read more" retain
  standard focus rings.

## Accessibility and security requirements

- Semantic HTML5 `<time>` element used with valid `dateTime="YYYY-MM-DD"`.
- Display strings formatted in US English ("DD MMM YYYY").
- Zero hydration mismatch.
- Static immutable fixtures: zero unvalidated user input interpolated into dates.

## Data shapes and edge cases

- Date format: `DD MMM YYYY` (e.g. `12 Sep 2026`).
- ISO datetime format: `YYYY-MM-DD` (e.g. `2026-09-12`).
- Sitemap timestamp: ISO 8601 UTC string (`2026-09-12T00:00:00.000Z`).

## Reference deltas and why each is necessary

- **Delta**: Maintain editorial publication dates synchronized to the latest
  calendar date (`12 Sep 2026` / `2026-09-12`) rather than static older dates.
- **Rationale**: Mandated by the durable ALWAYS ledger rule ("Always make sure the
  dates used across all the pages are the latest.").

## Non-goals

- Do not alter blog slugs, categories, excerpts, titles, or imagery.
- Do not introduce non-deterministic dynamic runtime clocks into prerendered
  static fixtures.
- Do not modify checkout, cart, or order persistence schema.

## Acceptance criteria

1. Lead blog posts in `lib/blog.ts` have `date: "12 Sep 2026"` and `dateTime: "2026-09-12"`.
2. All 24 blog fixtures maintain valid `YYYY-MM-DD` datetime and `DD MMM 2026` display format.
3. `app/sitemap.ts` emits `lastModified` set to `2026-09-12T00:00:00.000Z`.
4. `npm run test` passes across all 33 test files with updated date assertions.
5. `npm run lint` passes with 0 warnings and 0 errors.
6. `npx tsc --noEmit` passes with 0 errors.
7. `npm run build` succeeds cleanly with Turbopack.
8. Real browser verification via `agent-browser` confirms `/blog` and `/sitemap.xml`
   render `12 Sep 2026` / `2026-09-12` without errors or layout shifts.
9. `docs/pages.md` is updated to record the date modernization.
10. Local implementation commit created using `caveman-commit`.
11. Dual-axis `code-review` run with all findings evaluated and resolved.

## Commands and verification

- Unit and integration tests: `npm run test`
- Lint: `npm run lint`
- Typecheck: `npx tsc --noEmit`
- Build check: `npm run build`
- Browser verification: `agent-browser` navigation to `/blog` and `/sitemap.xml`
- Code review: `.agents/skills/code-review/SKILL.md` against `BASE_SHA...HEAD`

## SKILLS USED

- `react-testing`: verify updated date assertions across Vitest test files.
- `agent-browser`: verify visual presentation and metadata in a named browser session.
- `web-design-guidelines`: verify semantic `<time>` elements and typographic layout.
- `caveman-commit`: format the local implementation commit message.
- `code-review`: perform independent Standards and Spec reviews.
