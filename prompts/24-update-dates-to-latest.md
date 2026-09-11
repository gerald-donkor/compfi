# Update storefront and editorial dates to latest (2026)

## Status and authorization boundary

Prepared on 2026-09-11 in direct response to the user's durable rule instruction:
"Always make sure the dates used across all the pages are the latest."

This is a planning artifact only. It authorizes no implementation, dependency
installation, staging, commit, or push until the user explicitly approves it.

Planning-time repository state is `main` with only the dated ALWAYS ledger entry
added in `AGENTS.md`. Reconfirm `git status --short`, `git branch --show-current`,
and `git rev-parse HEAD` before execution. Stop if the branch is not `main`.
Preserve every unrelated path that appears after this prompt is prepared.

## Goal and why this is the next dependency-safe unit

Enforce the durable requirement that all customer-facing dates and timestamps
across all Compfi storefront pages reflect the latest calendar date (current date
`2026-09-11` and active year `2026`), replacing legacy 2022 template dates
carried over from the original Figma mockup reference (`design/9-Blog.png`).

Why this is the next dependency-safe unit:
- Phases 1–8 of the Compfi storefront are complete, verified, and review-closed
  across 139 passing unit/integration tests and browser QA.
- The user established an explicit durable ALWAYS rule on 2026-09-11 requiring
  dates across all pages to be the latest.
- The primary storefront surfaces where dates are displayed or emitted are:
  1. `/blog` (editorial article feed and "Recent Posts" sidebar widget in
     `lib/blog.ts`): currently displays stale 2022 dates ("14 Oct 2022",
     "03 Aug 2022", etc.) copied directly from the visual comp.
  2. `app/sitemap.ts` (search engine sitemap): `lastModified` timestamp
     currently stabilized at `2026-09-11T00:00:00.000Z`.
  3. `components/chrome/site-footer.tsx`: dynamic `new Date().getFullYear()`
     evaluating to `2026`.
- Updating the editorial fixture dates to the latest 2026 chronology maintains
  realistic publication cadence (descending from current date `11 Sep 2026`),
  aligns display copy with metadata, and satisfies both visual and programmatic
  expectations without introducing hydration discrepancies.

## Relevant source files and design references

- `design/9-Blog.png`: original visual reference showing editorial feed with
  author, calendar icon, and date text ("14 Oct 2022", etc.).
- `lib/blog.ts`: 24 static editorial post fixtures with `date` and `dateTime`
  properties.
- `app/sitemap.ts`: sitemap generation with `lastModified` date.
- `components/chrome/site-footer.tsx`: copyright year rendering.
- `test/blog.test.tsx`: integration test suite asserting on article `<time>`
  elements and attributes.
- `docs/pages.md`: route-by-route build record and reference deltas.
- `AGENTS.md`: project contract and ALWAYS ledger.

## Existing code and package behavior inspected

- `lib/blog.ts` declares:
  ```ts
  export interface BlogPost {
    readonly id: string
    readonly slug: string
    readonly title: string
    readonly category: BlogCategory
    readonly author: string
    readonly date: string       // formatted display e.g. "11 Sep 2026"
    readonly dateTime: string   // ISO date e.g. "2026-09-11"
    readonly excerpt: string
    readonly image: string
    readonly thumbnail?: string
    readonly imageAlt: string
  }
  ```
- The 24 posts currently range from `14 Oct 2022` down to `01 Mar 2022`.
- Updating these fixtures to 2026 with the top articles dated `11 Sep 2026`
  brings them directly up to the current date while preserving descending order
  and category distribution.
- `components/blog/blog-card.tsx` renders `<time dateTime={post.dateTime}>{post.date}</time>`.
- `components/blog/blog-recent-posts.tsx` renders `<time dateTime={post.dateTime}>{post.date}</time>`.
- `app/sitemap.ts` uses `const lastModified = new Date("2026-09-11T00:00:00.000Z")`.
- `components/chrome/site-footer.tsx` uses `new Date().getFullYear()`.

## Exact scope, expected files, and route impact

- Route impact: `/blog` visual presentation; search engine metadata.
- Files to modify:
  - `lib/blog.ts`: update all 24 blog post dates to 2026, leading up to
    `11 Sep 2026` (`2026-09-11`).
  - `test/blog.test.tsx`: expand tests to assert that article and sidebar dates
    reflect the latest 2026 calendar and valid ISO datetime strings.
  - `docs/pages.md`: record the date modernization reference delta under the
    Blog route section.
  - `AGENTS.md`: retain the durable ALWAYS ledger row.

## Chronological mapping for 24 blog posts (2026 latest)

1. `going-all-in-with-millennial-design`: `11 Sep 2026` / `2026-09-11`
2. `exploring-new-ways-of-decorating`: `11 Sep 2026` / `2026-09-11`
3. `handmade-pieces-that-took-time-to-make`: `11 Sep 2026` / `2026-09-11`
4. `modern-home-in-milan`: `03 Sep 2026` / `2026-09-03`
5. `colorful-office-redesign`: `03 Sep 2026` / `2026-09-03`
6. `ceramic-vessels-and-form`: `28 Aug 2026` / `2026-08-28`
7. `weaving-natural-fibers-at-home`: `15 Aug 2026` / `2026-08-15`
8. `scandinavian-simplicity-in-the-bedroom`: `10 Aug 2026` / `2026-08-10`
9. `architectural-lighting-for-dining-spaces`: `02 Aug 2026` / `2026-08-02`
10. `curating-a-quiet-workspace`: `24 Jul 2026` / `2026-07-24`
11. `the-art-of-the-lounge-chair`: `18 Jul 2026` / `2026-07-18`
12. `kitchen-shelving-and-daily-rituals`: `09 Jul 2026` / `2026-07-09`
13. `spatial-flow-in-compact-homes`: `28 Jun 2026` / `2026-06-28`
14. `textile-layering-with-raw-linen`: `20 Jun 2026` / `2026-06-20`
15. `traditional-joinery-techniques`: `12 Jun 2026` / `2026-06-12`
16. `the-character-of-white-oak`: `04 Jun 2026` / `2026-06-04`
17. `living-with-natural-patina`: `26 May 2026` / `2026-05-26`
18. `hand-stitched-leather-details`: `18 May 2026` / `2026-05-18`
19. `hand-carved-serving-boards`: `11 May 2026` / `2026-05-11`
20. `hand-woven-wool-rugs`: `03 May 2026` / `2026-05-03`
21. `restoring-vintage-furniture-finds`: `25 Apr 2026` / `2026-04-25`
22. `clay-and-pigment-wall-finishes`: `17 Apr 2026` / `2026-04-17`
23. `harmonious-proportions-for-open-living`: `08 Apr 2026` / `2026-04-08`
24. `solid-wood-care-through-the-seasons`: `01 Apr 2026` / `2026-04-01`

## Component boundaries and server/client ownership

- `app/blog/page.tsx`: Server Component, resolves `resolveBlogView(blogPosts, await searchParams)`
  and renders `BlogFeed` and `BlogSidebar`.
- `components/blog/blog-card.tsx`: Server Component rendering semantic `<article>`
  with `<time dateTime={post.dateTime}>{post.date}</time>`.
- `components/blog/blog-recent-posts.tsx`: Server Component rendering sidebar list
  with `<time dateTime={post.dateTime}>{post.date}</time>`.
- No client-side hydration differences; dates are statically deterministic.

## Responsive behavior

- Desktop (1440px): 2-column layout; article cards display metadata inline with
  author, calendar icon + date, category tag.
- Tablet (768px): single column with sidebar below; metadata wraps gracefully.
- Mobile (375px/320px): compact metadata line; no horizontal overflow.

## Accessibility and security requirements

- All date elements use valid HTML5 `<time>` with standardized ISO-8601
  `dateTime` attribute (`YYYY-MM-DD`).
- Display strings formatted consistently in US English ("DD MMM YYYY").
- Zero hydration mismatch between server-rendered HTML and client hydration.
- No user input or unvalidated strings interpolated into date fields.

## Reference deltas and why each is necessary

- **Delta**: Replace original 2022 template dates from `design/9-Blog.png` with
  current 2026 publication dates.
- **Rationale**: The user explicitly instructed: "Always make sure the dates used
  across all the pages are the latest." The reference mockups reflect their
  2022 creation date; Compfi is an active storefront operating in 2026. Stale
  editorial dates undermine production quality and customer trust.

## Non-goals

- Do not alter blog post categories, slugs, titles, excerpts, or images.
- Do not introduce dynamic runtime clocks (`Date.now()`) into the static
  fixtures, which would cause non-deterministic builds and hydration mismatches.
- Do not modify checkout, cart, or comparison business logic.

## Acceptance criteria

1. All 24 blog fixtures in `lib/blog.ts` have `date` and `dateTime` properties
   dated in 2026, with the lead articles dated `11 Sep 2026` / `2026-09-11`.
2. Every `dateTime` attribute strictly matches `YYYY-MM-DD` ISO-8601 format.
3. Every `date` display text matches `DD MMM 2026` format.
4. `test/blog.test.tsx` passes with assertions verifying that current 2026
   dates render in both the article feed and recent posts sidebar.
5. All 27 test files pass without regression.
6. TypeScript compilation, ESLint, and Turbopack build succeed cleanly.
7. Verification with `agent-browser` confirms `/blog` renders the updated dates
   faithfully without layout shift or text clipping.
8. `docs/pages.md` documents the date modernization reference delta.
9. Local commit created with `caveman-commit` and reviewed with `code-review`.

## Commands and verification

- Unit tests: `npm test`
- Typecheck: `npm run build`
- Browser check: `agent-browser open http://localhost:3000/blog`
- Code review: local dual-axis review via `.agents/skills/code-review/SKILL.md`

## SKILLS USED

- `react-testing`: expand Vitest assertions for date rendering and ISO format.
- `agent-browser`: verify visual presentation of dates on `/blog` at desktop and
  mobile viewports.
- `web-design-guidelines`: verify semantic `<time>` elements and typographic
  presentation.
- `caveman-commit`: format the local implementation commit message.
- `code-review`: run independent Standards and Spec reviews against `BASE_SHA...HEAD`.
