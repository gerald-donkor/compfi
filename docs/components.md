# Compfi Component Inventory & Specifications

Status: Phase 10 (100% free stack, local SQLite persistence via Drizzle ORM and @libsql/client, Server Actions, Order Confirmation receipt, and Customer Order History) fully implemented, audited, and certified.

This document owns the public component contracts, APIs, states, and accessibility requirements for Compfi primitives and foundation components.

## Phase 10 Services, Persistence & Order Management Components

- **`OrderHistory`** (`components/account/order-history.tsx`, `data-slot="order-history"`):
  Renders customer order history inside the protected `/account` route. If `orders.length === 0`, renders accessible `Empty` composition (`EmptyMedia`, `EmptyTitle`, `EmptyDescription`, and button link to browse `/shop`). When populated, renders an accessible list of order cards with `ORD-...` order number, formatted placement date (`Intl.DateTimeFormat("en-US")`), status badge (`Confirmed`), itemized product list with responsive thumbnails, size/finish metadata, catalog unit prices, and grand total via `Money`. Fully axe-tested and compliant with zero violations.
- **`OrderConfirmation`** (`components/checkout/checkout-content.tsx`, `data-slot="order-confirmation"`):
  Accessible receipt view rendered upon successful order placement via `placeOrderAction`. Contains `role="status"` live region, `h2` heading ("Order confirmed"), order reference ID, itemized order summary, shipping address, and actions to continue shopping (`/shop`) or view orders in account (`/account`). Clears the client cart on mount.
- **`CartProvider`** (`components/cart/cart-provider.tsx`):
  Updated with `compfi_cart_v1` `localStorage` persistence so cart state seamlessly survives full page reloads, tab switches, and checkout transitions. Exposes `clear` / `clearCart` methods and live message announcements for screen readers.

## Phase 8 Foundations & Accessibility Enhancements

- **`NotFound`** (`app/not-found.tsx`): Branded error recovery route rendering `PageHero` with breadcrumbs, accessible recovery text, and dual actions (`Link` with `buttonVariants({ variant: "default" })` to browse `/shop` and `buttonVariants({ variant: "outline" })` to return home). Tested and axe-certified with 0 violations.
- **`SiteHeader`** (`components/chrome/site-header.tsx`): Responsive grid container updated from `grid-cols-[minmax(12rem,1fr)_auto_minmax(12rem,1fr)]` to `grid-cols-[1fr_auto_1fr]` on large viewports, maintaining centered navigation while accommodating 200% root text reflow without horizontal viewport overflow.
- **`InspirationCarousel`** (`components/home/inspiration-carousel.tsx`): Simplified `.home-inspiration__dots` wrapper to a clean structural container without redundant `aria-label`, eliminating `aria-prohibited-attr` while preserving slide `group` semantics and individual dot button accessible names.
- **`ProductDetail`** (`components/product/product-detail.tsx` / `app/globals.css`): Gallery column capped to `min(var(--product-detail-gallery-max-share), calc(...))` (`--product-detail-gallery-max-share: 52%`) ensuring proper proportioning and reflow on high-zoom viewports without crowding out the summary column.
- **`ComparisonPicker`** (`components/comparison/product-comparison.tsx` / `app/globals.css`): Select element constrained with `min-width: min(var(--comparison-picker-width), 100%)` (`--comparison-picker-width: 15.125rem`) and `max-width: 100%`, preventing form controls from causing horizontal container overflow during 200% text reflow.

## Phase 6 Blog blocks

- **`BlogFeed`**: Server-safe section (`components/blog/blog-feed.tsx`,
  `data-slot="blog-feed"`) receiving the resolved `BlogViewModel`. It owns a
  screen-reader `Blog articles` heading, a `role="status"` filter announcement
  with a `Clear filter` link when search/category state is active, the article
  list, and pagination through the certified `Pagination`, `PaginationContent`,
  `PaginationItem`, `PaginationLink`, `PaginationNext`, and
  `PaginationPrevious` primitives. Page links preserve the active `q` and
  `category` via `blogHref`; the active page carries `aria-current="page"`.
  Zero results render the certified `Empty` composition with a `View all
  articles` recovery link and no pagination. Real usage: `/blog`.
- **`BlogCard`**: Server-safe article (`components/blog/blog-card.tsx`,
  `data-slot="blog-card"`) for one `BlogPost`. It renders a `next/image` lead
  (817×500 display ratio, `object-cover`, descriptive alt, first-card
  priority, otherwise lazy), an `Article metadata` list with decorative User,
  Calendar, and Tag icons plus author, ISO-backed `<time>`, and category, an
  `h2` title link, a muted excerpt, and a `Read more about {title}` action.
  Title and action links point at `/blog#{slug}`; no article reader route
  exists in this unit. Real usage: `BlogFeed`.
- **`BlogSidebar`**: Server-safe `aside` (`components/blog/blog-sidebar.tsx`,
  `data-slot="blog-sidebar"`, `aria-label="Blog sidebar"`) composing
  `BlogCategories` and `BlogRecentPosts`. `BlogSearch` is deliberately a
  page-level grid sibling rather than nested here, so DOM order (search,
  feed, widgets) matches the single-column visual order and keyboard focus
  never jumps past content. Real usage: `/blog`.
- **`BlogSearch`**: Stateless server-safe form leaf
  (`components/blog/blog-search.tsx`, `data-slot="blog-search"`) owning no
  state. It renders one uncontrolled
  native GET form to `/blog` with `type="search"`, `name="q"`,
  `autocomplete="off"`, `enterKeyHint="search"`, an accessible label, the
  active category as a hidden field, a 44px icon submit action, and a `Clear`
  link preserving the category when a query is active. Real usage:
  `BlogSidebar`.
- **`BlogCategories`**: Server-safe section
  (`components/blog/blog-categories.tsx`, `data-slot="blog-categories"`)
  with an `h3` heading and one link per category carrying its exact fixture
  count. The active category uses `aria-current="page"`; activating it again
  toggles back to all articles and resets the page. Real usage: `BlogSidebar`.
- **`BlogRecentPosts`**: Server-safe section
  (`components/blog/blog-recent-posts.tsx`, `data-slot="blog-recent-posts"`)
  with an `h3` heading and the five most recent posts. Thumbnails are
  decorative duplicate links (`tabindex="-1"`, `aria-hidden`) with empty alt;
  titles are `h4` links and dates are ISO-backed muted `<time>`. Real usage:
  `BlogSidebar`.

  All six blocks take explicit domain props (`view`, `post`, `categories`,
  `posts`, `defaultValue`) rather than spreading native element props: the
  certified shop blocks (`ShopResults`, `ShopControls`) establish that
  convention, and forwarding arbitrary props would let callers overwrite the
  owned `data-slot` and heading relationships the product-detail review
  certified as protected. Search needs no `"use client"` boundary because the
  browser owns its value through a native GET submit. No previously
  uncertified primitive
  required source changes; `Pagination`, `Empty`, `Link`, `PageHero`,
  `BenefitsStrip`, and `Container` were reused as certified.

## Phase 6 Contact blocks

- **`ContactContent`**: Server-safe block composing the static business-details
  section and the focused client `ContactForm` inside the shared container. It
  owns no state, provider, or side effect. The details portion carries one `h2`
  with concise Compfi inquiry guidance stated honestly as a local preview; it
  contains no address, phone, map, hours, social, policy, warranty, shipping,
  or support claim. Real usage: `/contact`.
- **`ContactForm`**: Focused client leaf (`components/contact/contact-form.tsx`)
  owning only error/status state. It renders one native uncontrolled
  `<form noValidate>` with `FieldSet`, `FieldLegend`, `FieldGroup`, certified
  `Field`, `FieldLabel`, `Input`, `Textarea`, `FieldDescription`, and
  `FieldError`, plus a `Check message` submit action and one polite atomic
  status. Fields are name, email, and message with persistent labels, correct
  `name`/`type`/`required`/`maxLength`/`inputMode`/autocomplete tokens, and the
  `data-invalid`/`aria-invalid`/`aria-describedby` contract. A pure
  `reviewContactDetails` utility (`lib/contact.ts`, React-free) validates
  trimmed required values, a practical email shape, and explicit limits (name
  80, email 254, message 2000) behind one exported immutable length map;
  submission is local-only, prevents navigation, focuses a linked error
  summary, clears edited field errors and stale success, leaves entered values
  untouched, and announces `Message checked. It was not sent and no email was
  delivered.` At 1440px the block uses the measured-pattern 454px/527px
  columns; 1024px uses flexible columns, and 768px through 320px follows one
  normal-flow column. No subject taxonomy, form action, Server Action, request,
  persistence, email, ticket, or delivery state exists. Real usage: `/contact`.

  No previously uncertified primitive required source changes for this unit;
  Field/Input/Textarea/Button/Empty/Separator compositions were reused as
  certified.

## Product comparison

`ProductComparison` is a server-safe block that receives a resolved comparison
model, renders summaries, a native GET picker, empty/full guidance, and the
table. `ComparisonProductSummary` uses linked local `next/image` media, price,
and a named removal link. `ComparisonTable` uses semantic headers and labelled
row groups, with a keyboard-focusable overflow region. `ProductOptions` now
accepts an allowlisted `comparisonHref`; its cart action is enabled only when
the caller supplies a canonical catalog product inside `CartProvider`.

`ProductComparisonProps`, `ComparisonProductSummaryProps`, and
`ComparisonTableProps` extend their native section/article props and expose the
stable `product-comparison`, `comparison-product-summary`, and
`comparison-table` slots. The picker is a labelled native GET form with only
server-derived hidden selections and unselected choices; it is required while
space remains. Empty state provides Shop navigation; full state supplies named
removal links. The responsive block moves from three columns to two and one,
while the fixed comparison table remains in its named, focusable horizontal
scroll region. Real usage: `/comparison`.

The comparison block intentionally uses direct semantic table markup rather
than `components/ui/table.tsx`: that generic wrapper is a client component and
does not expose props for the labelled focusable overflow region required here.
Creating a second generic table primitive would duplicate it; the domain block
therefore owns this one fully documented table composition.

---

## 1. Scope & Audit Status

### Phase 3 Shared Chrome Blocks

- **`SiteHeader` / `HeaderControls`**: The server-safe header owns brand and
  desktop structure. The focused client controls leaf owns current-route
  semantics, mobile menu state, Escape/focus-return behavior, and composes the
  cart drawer. Desktop navigation is hidden rather than duplicated on mobile.
- **`PageHero`**: Server-safe title/breadcrumb block with the explicit
  `BreadcrumbItemData` record (`label`, optional internal `href`) and a
  discriminated variant: `banner` requires its own `h1`; `compact-breadcrumb`
  forbids a title so a product summary can own the page heading. The final item
  is non-interactive and has `aria-current="page"`. Native section props and
  caller classes are forwarded.
- **`BenefitsStrip`**: Server-safe four-item content block. Icons are
  decorative; content records use an icon component, title, and description.
- **`SiteFooter`**: Server-safe navigation block with non-claiming Compfi copy
  and 44px minimum link targets, presenting the 4-column reference layout matching
  `design/1-Home.png` and integrating the `NewsletterForm` client leaf component.
- **`CartDrawer`**: Focused client leaf with controlled open state and a narrow
  cart-context subscription. It
  composes Base UI's modal Sheet; title and descriptive empty state are always
  present. The audited Sheet adaptation uses a 20% scrim, flat 550px maximum
  side sheet, viewport-safe width, overscroll containment, reduced-motion-safe
  transition, focus trapping, Escape/backdrop dismissal, and focus return.
- **`Breadcrumb`, `Empty`, `Sheet`**: The Phase 3 compositions of these
  primitives are audited and verified. They are no longer treated as
  unexamined generated components in this inventory. `SheetContentProps`
  exposes its `side` and `showCloseButton` API.

### Phase 4 Shop Blocks

- **`ShopControls`**: Client leaf for the normalized `CatalogViewOptions` and
  `totalCount`; it owns only URL navigation and pending feedback, never catalog
  records. Its stable slots are `shop-controls` and `shop-filter`. Native
  `details` supplies room disclosure and local links with smooth chevron
  transitions; view toggle items enforce 44px minimum touch targets
  (`min-width: var(--control-min)`); the selected Base UI view
  toggle carries `data-composite-item-active`, making it the roving Tab entry
  point while arrow keys move within the group. Native page-size and sort
  controls are labelled, disabled during a transition, and rebuild canonical
  local URLs. Feedback is consolidated into a single polite atomic live region
  (`<p role="status" aria-live="polite" class="sr-only">`), eliminating duplicate
  or competing announcements between pending and settled states. Real usage: `/shop`.
- **`ShopResults`**: Server block accepting one resolved `CatalogViewModel`.
  It owns the `shop-results` slot and `data-view` presentation boundary,
  truthful result range, `ProductGrid` delegation, a recoverable empty state,
  and real-link pagination with the active page exposed through
  `aria-current="page"`. Pagination uses the measured 60px wash geometry
  (`--blog-pagination-size: 3.75rem`, `--blog-pagination-radius: 0.625rem`) matching
  `design/2-Shop.png`, explicit `text="Prev"` and `text="Next"` navigation buttons,
  and preserves the standard accessible name `"pagination"`. Grid/list styling
  is responsive; it has no client state or catalog mutation. Real usage: `/shop`.
- **`Pagination`**: Server-safe navigation composition. `PaginationLink`,
  `PaginationPrevious`, and `PaginationNext` render native anchors styled with
  the shared button variants; they never override link semantics. The active
  page alone receives `aria-current="page"`. Real usage: Shop and Blog result pages.

### Phase 4 Product Detail Blocks

- **`ProductDetail`**: Server block for the two-column summary. It composes the
  gallery, one product `h1`, shared USD `Money`, product copy, options, and
  factual ID/category metadata without inventing availability or policies.
- **`ProductGallery`**: Focused client leaf accepting readonly media. It shows
  one responsive lead image and native thumbnail buttons with `aria-pressed`;
  a user selection updates the lead and one polite status. Thumbnails carry
  the standard 3px focus ring (`outline: var(--focus-ring-width) solid var(--color-brand-focus)`
  with `outline-offset: var(--focus-ring-offset)`); single-image collections
  gracefully omit redundant thumbnails while keeping keyboard focus on the lead.
  Empty input renders a useful `Empty` state. A changed lead-media identity
  resets selection and clears announcements, including when returning to an
  earlier product. Native section props and accessible naming remain
  customizable in every state.
- **`ProductOptions`**: Focused client leaf composing the certified size,
  finish, and quantity controls. Optional groups render only when data exists.
  Quantity is bounded 1–10. Add-to-cart features an `aria-busy` guard with
  double-click protection (timer cleanup on unmount) while keeping the button
  enabled so keyboard focus is never ejected to `document.body`. It submits
  the valid configured catalog selection to the cart provider, announced via
  the provider's live region. A dedicated persistent variant selection live
  region (`<p role="status" aria-live="polite" aria-atomic="true">`) announces
  size, finish, and quantity changes politely without unmounting. An optional
  allowlisted `comparisonHref` renders the real Compare link.
- **`ProductInformation`**: Server block composing certified Base UI Tabs.
  Description is selected initially; Details reports only product ID,
  category, and configured options. Two generated detail images reuse catalog
  metadata in a responsive landscape grid.
- **`RelatedProducts`**: Server block delegates selection to the catalog helper
  and rendering to `ProductGrid`, followed by a real `/shop` link.
- **Tabs primitive**: `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent` are
  certified for this route against the installed Base UI/shadcn contract.
  Each exports its named `Props` contract and protects its stable slot while
  forwarding native/Base UI props. Orientation is passed to Base UI, whose
  roving focus and manual Enter/Space activation are primitive-owned; its
  disabled tabs remain focusable with `aria-disabled` but cannot activate.
  Inactive labels use the accessible muted token and transitions are color-only.

### Certified Phase 2 Components
The following components have been fully audited, styled to Compfi's measured design tokens, verified for accessibility (WCAG 2.2 AA floor), and tested in automated JSDOM suites and real-browser rendering:

- **Actions & Display**: `Button`, `IconButton`, `Link`, `Badge`, `Separator`
- **Forms**: `FieldSet`, `FieldLegend`, `FieldGroup`, `Field`, `FieldContent`, `FieldLabel`, `FieldTitle`, `FieldDescription`, `FieldSeparator`, `FieldError`, `Label`, `Input`, `Textarea`, `Select`
- **Layout**: `Section`, `Stack`, `Cluster`, `Container`
- **Product Foundations**: `Money`, `QuantityInput`, `ColorSelector` / `ColorSwatch`, `SizeSelector`

### Phase 5 Cart blocks

- **`CartProvider` / `useCart`**: Narrow client state boundary mounted inside
  the root layout. It holds only the current tab's cart lines and exposes
  `add`, `setQuantity`, and `remove`; catalog product details and integer-cent
  totals are derived from immutable fixtures. Its polite live region
  (`<p className="sr-only" role="status" aria-live="polite" aria-atomic="true">`)
  is persistently mounted before children to act as the primary provider status.
  Reloading deliberately starts a new empty cart.
- **`CartDrawer`**: Client leaf built on the existing named Base UI Sheet.
  Empty and populated states retain the primitive's modal focus mechanics
  (dialog labelled `Your cart` with a screen-reader description, focus trap,
  Escape/backdrop dismissal, background scroll lock, focus return to the
  trigger; verified in a real browser, including Tab cycling inside the dialog
  and focus restoration after the close transition). A populated drawer renders
  local product media, configured selection labels, product links, removal
  controls, an integer-cent subtotal, and real Cart and Checkout links. Both
  links close the sheet while preserving primitive-owned focus return. Removal
  is announced through the provider's single polite live region (no duplicate
  drawer live region); removing the last line moves focus to the empty-state
  `Browse furniture` recovery link so focus never lands on `body`. The
  empty-state solid action keeps white (`text-primary-foreground`) label text
  inside its span so the gold fill keeps AA contrast (the shared `Link`
  ink-text class otherwise wins the cascade). The sheet keeps its certified
  550px maximum at desktop and renders nearly full-width (`100dvw` minus the
  16px insets) at 390px with close, focus, and Escape intact.
- **`CartContent`**: Client route content that uses a semantic desktop table
  and labelled mobile line-item groups below `768px`. Both use the certified
  controlled `QuantityInput`; removal returns focus to its cart-items heading.
  Its populated subtotal surface links to `/checkout`; empty state omits that
  action.
- **`CheckoutContent`**: Focused client block consuming `useCart` directly
  inside the server-rendered `/checkout` shell. Empty state composes the
  certified `Empty` and a real Shop recovery link. Populated state uses one
  native uncontrolled form with `FieldSet`, `FieldLegend`, `FieldGroup`,
  `Field`, `FieldLabel`, `Input`, `Textarea`, `FieldDescription`, and
  `FieldError`; it derives product labels and integer-cent subtotals from the
  canonical cart/catalog interface. A pure `reviewCheckoutDetails` utility
  validates required fields, US ZIP/email/phone shapes, and explicit limits;
  one exported immutable length contract supplies both validator and controls.
  Submission is local-only: it prevents navigation, retains no personal values
  in React state, focuses a linked error summary, clears edited field errors,
  and announces the exact non-transactional success result. Payment controls,
  order state, persistence, and network work are absent. At 1440px the block
  uses measured 454px/527px columns; 1024px uses flexible columns, and 768px
  through 320px follows one normal-flow column. Real usage: `/checkout`.

### Phase 4 Home Editorial Blocks

- **`InspirationSection`**: Server block owning the cream band, concise Compfi
  copy, and real `/shop` action. It passes only four serializable slide records
  into the interactive leaf. Stable slot: `inspiration-section`.
- **`InspirationCarousel`**: Client leaf accepting `readonly
  InspirationSlide[]`. It composes the certified carousel primitive, tracks
  `select` and `reInit`, exposes previous/next and four labelled dots, and
  announces one polite atomic status. Dots carry `aria-current`; controls stay
  mounted at disabled boundaries; nested links retain arrow keys. Interactive
  controls use discrete motion tokens (`--duration-fast`, `--ease-standard`).
  Reduced motion uses Embla's immediate jump path and global CSS animation
  duration zeroing. An empty collection renders no carousel.
  At desktop each slide is capped at 404px and the locally clipped viewport
  shows the next slide; tablet/mobile use an 84% basis for a meaningful peek.
  Captions are HTML overlays inside each figure and all controls retain 44px hits.
- **`EditorialGallery`**: Server block rendering a semantic nine-image list
  and visible `#CompfiAtHome` heading. Closed `data-placement` values drive the
  full-bleed CSS mosaic; no JavaScript or social integration is present.
  Its 20-column desktop placement becomes four tracks at tablet, two varied
  columns at 390px, and one readable column at 320px.
- **Carousel primitive**: `Carousel`, `CarouselContent`, `CarouselItem`,
  `CarouselPrevious`, and `CarouselNext` export native-compatible prop types
  and stable kebab-case slots. The shadcn/Embla composition unsubscribes both
  `select` and `reInit`; controls support immediate `jump` navigation. The
  region and slides expose carousel/slide roledescriptions. Real usage: Home.

### Existing Uncertified Components
Generated components outside this certified inventory (including accordion, alert-dialog, avatar, calendar, card, chart, checkbox, collapsible, combobox, command, context-menu, dialog, drawer, dropdown-menu, hover-card, input-group, input-otp, item, kbd, marker, menubar, message-scroller, message, native-select, navigation-menu, pagination, popover, progress, questionnaire, radio-group, resizable, scroll-area, sidebar, skeleton, slider, switch, table, tabs, tooltip) remain committed in the repository as pre-existing base files. They are **not yet certified** and will be audited and adapted as future owning phases require them.

---

## 2. Actions and Display

### Button (`components/ui/button.tsx`)
- **Purpose**: Primary interactive trigger for actions and user intent.
- **Server/Client**: Client component (backed by `@base-ui/react/button`).
- **Exported Props**: `ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>`
- **Variants**:
  - `variant`: `default` (Compfi action gold `#8A681A`), `outline`, `secondary`, `ghost`, `destructive`, `link`
  - `size`: `default` (min 44px), `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`
- **Geometry**: Square action radius (`rounded-none`, `var(--radius-button)` = 0). Minimum 44 × 44 px target floor across all sizes.
- **Slots & State**: `data-slot="button"`, `:focus-visible` with 3px focus ring and 3px offset, `active:translate-y-[var(--active-offset)]`.
- **Loading Pattern**: Composed with `Spinner` + `disabled` + pending copy (e.g. "Adding…"). No boolean `isLoading` prop.
- **Polymorphism**: Supports Base UI `render` prop with `nativeButton={false}` for link rendering without nested interactive elements.
- **Real Usage**: Main CTA buttons on Home campaign hero, Shop add-to-cart, and checkout.

### IconButton (`components/ui/icon-button.tsx`)
- **Purpose**: Compact icon-only button composition.
- **Server/Client**: Client component.
- **Exported Props**: `IconButtonProps extends Omit<ButtonProps, "size" | "children">`
- **Requirements**: Requires explicit `label: string` prop which sets `aria-label={label}`. Decorative icon has `aria-hidden="true"`.
- **Sizes**: `icon` (default 44px), `icon-xs`, `icon-sm`, `icon-lg`.
- **Slot**: `data-slot="icon-button"`.
- **Real Usage**: Favorite toggle, social share, cart line removal.

### Link (`components/ui/link.tsx`)
- **Purpose**: Internal textual navigation styled with Compfi tokens.
- **Server/Client**: Server-safe component wrapping `next/link`.
- **Exported Props**: `LinkProps = NextLinkProps & React.ComponentProps<"a"> & VariantProps<typeof linkVariants>`
- **Variants**: `default`, `muted`, `primary`, `underline`.
- **Accessibility**: Visible `:focus-visible` ring with offset; preserves internal prefetching and route transition props. External links remain standard HTML anchors.
- **Slot**: `data-slot="link"`.
- **Real Usage**: Room category navigation, breadcrumbs, editorial links.

### Badge (`components/ui/badge.tsx`)
- **Purpose**: Descriptive non-interactive chip or status tag.
- **Server/Client**: Server-safe component using Base UI `useRender`.
- **Exported Props**: `BadgeProps = useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>`
- **Variants**:
  - `default`: Primary brand token
  - `secondary`: Wash background
  - `outline`: Border-thin outline
  - `destructive`: Destructive red badge
  - `discount`: Measured discount badge (`#8D3333` with white text, 7.91:1 ratio)
  - `new`: Measured new product badge (`#2EC1AC` with dark ink, 6.90:1 ratio)
- **A11y**: Descriptive by default; does not communicate meaning through color alone (visible text like "-30%" or "New" is always present).
- **Slot**: `data-slot="badge"`.
- **Real Usage**: Product discount tags and new arrival indicators on catalog cards.

### Separator (`components/ui/separator.tsx`)
- **Purpose**: Structural or decorative divider between content sections.
- **Server/Client**: Client component wrapping `@base-ui/react/separator`.
- **Exported Props**: `SeparatorProps extends SeparatorPrimitive.Props { decorative?: boolean }`
- **Orientation**: `horizontal` (default) or `vertical`.
- **A11y**: When `decorative={true}` (default), rendered with `role="none"` and `aria-hidden="true"`. When `decorative={false}`, rendered with `role="separator"` and `aria-orientation`.
- **Slot**: `data-slot="separator"`.
- **Real Usage**: Breadcrumb dividers, sidebar dividers, comparison table columns.

---

## 3. Forms and Inputs

### Field Composition (`components/ui/field.tsx`)
- **Components**: `FieldSet`, `FieldLegend`, `FieldGroup`, `Field`, `FieldContent`, `FieldLabel`, `FieldTitle`, `FieldDescription`, `FieldSeparator`, `FieldError`.
- **Exported Props**: `<Name>Props` exported for every public subcomponent.
- **Structure**:
  - `FieldGroup` provides vertical rhythm for form sections.
  - `Field` groups label, input, description, and validation errors. Supports `orientation: "vertical" | "horizontal" | "responsive"`.
  - `FieldError` deduplicates identical errors, renders a bulleted list for multiple errors, sets `role="alert"`, and returns `null` when errors array is empty or undefined.
- **Slots**: `data-slot="field"`, `data-slot="field-label"`, `data-slot="field-description"`, `data-slot="field-error"`, etc.
- **Real Usage**: Contact form, checkout billing details, account settings.

### Label (`components/ui/label.tsx`)
- **Purpose**: Accessible label wrapper for native inputs.
- **Server/Client**: Client component.
- **Exported Props**: `LabelProps = React.ComponentProps<"label">`.
- **Slot**: `data-slot="label"`.

### Input (`components/ui/input.tsx`)
- **Purpose**: Single-line text input for forms.
- **Server/Client**: Client component wrapping `@base-ui/react/input`.
- **Exported Props**: `InputProps = React.ComponentProps<"input"> & InputPrimitive.Props`.
- **Geometry**: 44px minimum height (`min-h-11`), 10px corner radius (`rounded-control`).
- **A11y**: Visual focus via `:focus-visible`, invalid state styling via `aria-invalid="true"`.
- **Slot**: `data-slot="input"`.
- **Real Usage**: Email input, search input, coupon codes, shipping address fields.

### Textarea (`components/ui/textarea.tsx`)
- **Purpose**: Multi-line text input for longer messages.
- **Server/Client**: Server-safe component wrapping native `<textarea>`.
- **Exported Props**: `TextareaProps = React.ComponentProps<"textarea">`.
- **Geometry**: Min height 96px (`min-h-24`), 10px corner radius (`rounded-control`), user-resizable vertically (`resize-y`).
- **Slot**: `data-slot="textarea"`.
- **Real Usage**: Contact message textarea, delivery order notes.

### Select (`components/ui/select.tsx`)
- **Components**: `Select`, `SelectGroup`, `SelectValue`, `SelectTrigger`, `SelectContent`, `SelectLabel`, `SelectItem`, `SelectSeparator`, `SelectScrollUpButton`, `SelectScrollDownButton`.
- **Exported Props**: Exported prop types for all 10 subcomponents (`SelectProps`, `SelectTriggerProps`, etc.).
- **Trigger**: 44px minimum touch target, 10px radius (`rounded-control`), visible focus outline.
- **Keyboard Map**: Enter/Space to open, Arrow Down/Up to navigate items, Enter/Space to select, Escape to close.
- **A11y**: Standard combobox and listbox ARIA semantics managed by Base UI.
- **Slot**: `data-slot="select-trigger"`, `data-slot="select-content"`, `data-slot="select-item"`, etc.
- **Real Usage**: Catalog sorting ("Price: Low to High"), room category filter, address state picker.

---

## 4. Layout Primitives

### Section (`components/layout/section.tsx`)
- **Purpose**: Major semantic page section wrapper.
- **Server/Client**: Server component.
- **Exported Props**: `SectionProps = React.ComponentProps<"section"> & VariantProps<typeof sectionVariants>`
- **Variants**: `spacing`: `compact` (32/48px), `default` (48/64px), `spacious` (64/96px).
- **Slot**: `data-slot="section"`, `data-spacing={spacing}`.

### Stack (`components/layout/stack.tsx`)
- **Purpose**: Vertical flex layout with disciplined spacing.
- **Server/Client**: Server component.
- **Exported Props**: `StackProps = React.ComponentProps<"div"> & VariantProps<typeof stackVariants>`
- **Gaps**: `none`, `compact` (8px), `default` (16px), `loose` (24px), `spacious` (32px).
- **Slot**: `data-slot="stack"`, `data-gap={gap}`.

### Cluster (`components/layout/cluster.tsx`)
- **Purpose**: Wrapping horizontal flex layout for tags, button groups, and toolbar items.
- **Server/Client**: Server component.
- **Exported Props**: `ClusterProps = React.ComponentProps<"div"> & VariantProps<typeof clusterVariants>`
- **Variants**: `gap` (`none`, `compact`, `default`, `loose`, `spacious`), `align` (`start`, `center`, `end`, `baseline`, `stretch`).
- **Slot**: `data-slot="cluster"`, `data-gap={gap}`, `data-align={align}`.

### Container (`components/layout/container.tsx`)
- **Purpose**: Centered max-width responsive container (1240px desktop container with fluid gutters).
- **Server/Client**: Server component.
- **Exported Props**: `ContainerProps = ComponentProps<"div">`.
- **Slot**: `data-slot="container"`.

---

## 5. Product-Facing Commerce Components

### Money (`components/commerce/money.tsx`)
- **Purpose**: Formats integer amounts in cents into standard US Dollar (`USD`) representation via `lib/money.ts`.
- **Server/Client**: Server component.
- **Exported Props**: `MoneyProps extends ComponentProps<"span"> { amountCents: number }`.
- **Integrity**: Pure formatter throws `TypeError` for non-integer, non-safe, or floating-point values.
- **Typography**: Uses `tabular-nums` for precise alignment in tables and price cards.
- **Slot**: `data-slot="money"`.
- **Real Usage**: Product price tags, discount comparisons, cart line totals, checkout summary.

### ProductCard (`components/commerce/product-card.tsx`)
- **Purpose**: Product-specific, flat semantic `article` for a single `CatalogProduct`; it deliberately does not reuse the uncertified generic `Card`.
- **Server/Client**: Server component.
- **Exported Props**: `ProductCardProps extends ComponentProps<"article"> { product: CatalogProduct }`.
- **Slots**: `data-slot="product-card"`; its media, image link, badge, overlay, content, title, description, prices, and compare-at elements have stable component classes.
- **Behavior**: Forwards valid article attributes, merges caller `className` through `cn`, links image and name to `/shop/[slug]`, uses fixture image metadata, formats cents through `Money`, and derives a rounded truthful discount percentage only from a valid higher compare-at amount. `new` renders visible text, while non-badged products reserve no badge node.
- **Accessibility**: Image link has the fixture product name; media retains the fixture alt; title is an `h3`; previous price has a screen-reader label. The overlay is a redundant enhancement at every width, never the sole path: image and title links carry the product name to the same `/shop/[slug]`, and the overlay action carries the visible label plus the product name (`View product: {name}` via a screen-reader suffix, so the accessible name contains the visible label per WCAG 2.5.3). The overlay reveals on hover **and** `:focus-within` via opacity/visibility (no `display:none` gate, no hover-only functionality), stays operable on touch through the image/title targets, and keeps a 44px overlay target; the title link is `inline-flex` with a 44px minimum height. Verified keyboard flow: focusing the image link reveals the overlay and Enter navigates to the detail route. Independent review (base `620a96b...HEAD`, Spec `prompts/20-polish-card-overlay-drawer-motion.md`): Standards 2 / Spec 7 findings; only the Label-in-Name correction was accepted as code, plus a docs ownership pointer; seven Spec findings were rejected with evidence.
- **Responsive/performance**: Reserves the measured 285:301 media field before image load, has responsive `sizes`, and remains lazy by default.
- **Real Usage**: All eight Home featured products.

### ProductGrid (`components/commerce/product-grid.tsx`)
- **Purpose**: Reusable semantic product list that owns only layout and delegates each item to `ProductCard`.
- **Server/Client**: Server component.
- **Exported Props**: `ProductGridProps extends ComponentProps<"ul"> { products: readonly CatalogProduct[] }`.
- **Slots**: `data-slot="product-grid"` and `data-slot="product-grid-item"`.
- **Behavior**: Forwards valid list attributes, merges caller `className`, preserves the received immutable order, and renders each product identity as the list key.
- **Responsive**: One column below 640px, two through 799px, three through 1199px, and four at 1200px and wider.
- **Real Usage**: Home featured furniture; designed for later Shop reuse without adding mode flags or a provider.

### QuantityInput (`components/commerce/quantity-input.tsx`)
- **Purpose**: Accessible stepper for line item and product quantity selection.
- **Server/Client**: Client component.
- **Exported Props**: `QuantityInputProps` supporting `value`, `defaultValue`, `onValueChange`, `min`, `max`, `step`, `name`, `disabled`, `readOnly`, `ref`.
- **Behavior**:
  - Composes native `<input type="number">` with custom decrement and increment buttons meeting 44px minimum targets.
  - Full WAI-ARIA spinbutton keyboard support: `ArrowUp` increments, `ArrowDown` decrements, `Enter` commits draft text.
  - Buttons clamp within `[min, max]` boundaries and disable at respective boundaries.
  - Interactive elements use standardized 3px focus ring offsets (`focus-visible:ring-offset-3`) and discrete motion tokens (`transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]`).
  - Sets `data-disabled` and `data-readonly` attributes on root container.
  - Free of cascading renders: uses derived state rather than synchronization effects.
- **Slot**: `data-slot="quantity-input"`.
- **Real Usage**: Single product detail page add-to-cart, cart drawer quantity adjuster, checkout item count.

### ColorSelector & ColorSwatch (`components/commerce/color-swatch.tsx`)
- **Purpose**: Variant color option selector for furniture upholstery and finishes.
- **Server/Client**: Client component backed by `@base-ui/react/toggle-group`.
- **Exported Props**: `ColorSelectorProps`, `ColorSwatchProps`, `ColorOption` (shared via `types/commerce.ts`).
- **Features**:
  - Hides array-valued Base UI quirk behind string-valued selection.
  - Non-color selection cue: visible checkmark icon + ring when selected.
  - Minimum 44 × 44 px touch targets (`size-11`).
  - Discrete transitions: removed `transition-all`; uses `transition-colors` on button and `transition-[transform,box-shadow]` on inner swatch with `--duration-fast` and `--ease-standard`.
  - Focus ring offset standardized to 3px (`focus-visible:ring-offset-3`).
  - Detects and throws on duplicate option values in development.
  - Gracefully handles empty and non-existent controlled values.
  - Forwards `ref` and native DOM attributes on both selector and individual swatches.
- **Slot**: `data-slot="color-selector"`, `data-slot="color-swatch"`.
- **Real Usage**: Sofa and chair fabric color selection on product detail page.

### SizeSelector (`components/commerce/size-selector.tsx`)
- **Purpose**: Variant size option selector for dimensions and configurations.
- **Server/Client**: Client component backed by `@base-ui/react/toggle-group`.
- **Exported Props**: `SizeSelectorProps`, `SizeOption` (shared via `types/commerce.ts`).
- **Features**:
  - Visible text labels with 44px minimum target floor (`min-h-11 min-w-11`).
  - Single string selection.
  - Discrete motion tokens (`transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]`) and standardized 3px focus ring offset (`focus-visible:ring-offset-3`).
  - Detects and throws on duplicate option values in development.
  - Gracefully handles empty and non-existent controlled values.
  - Forwards `ref` and native DOM attributes.
- **Slot**: `data-slot="size-selector"`, `data-slot="size-option"`.
- **Real Usage**: Bed, dining table, and sofa sizing on product detail page.

### HeaderControls Auth Integration (`components/chrome/header-controls.tsx`)
- **Purpose**: Interactive header utility cluster and mobile drawer incorporating Clerk authentication controls.
- **Server/Client**: Client component (`"use client"`).
- **Features**:
  - Declarative conditional rendering via `@clerk/nextjs` `<Show>`.
  - **Signed-out state**: Accessible modal `<SignInButton>` wrapping `IconButton` with `UserIcon`, label `"Sign in to account"`, minimum 44 × 44 px touch target.
  - **Signed-in state**: `<UserButton>` with `userProfileMode="navigation"` pointing to `/account` and custom Compfi avatar styling.
  - **Mobile navigation**: Drawer mirrors authentication state with a styled button or navigation link (`#mobile-primary-navigation`).
  - Strict WCAG 2.2 AA accessibility: visible focus indicators (`focus-visible:ring-3`), clean accessible names, and 0 axe violations.
- **Real Usage**: Global navigation chrome across all storefront surfaces.

### OrderHistory (`components/account/order-history.tsx`)
- **Purpose**: Customer order history display for authenticated members on `/account`.
- **Server/Client**: Server component.
- **Exported Props**: `OrderHistoryProps`, extending `React.HTMLAttributes<HTMLElement>` with `orders: readonly OrderWithItems[]`.
- **Features**:
  - Empty state using `Empty` compound component with direct link to `/shop`.
  - Populated state rendering order cards with reference ID, formatted date, status badge, shipping address, and authoritative totals.
  - Interactive `<details open>` / `<summary>` disclosure wrapping itemized line items with responsive thumbnails, size/finish options, quantities, and line totals.
  - Slot attribute: `data-slot="order-history"`.
- **Real Usage**: Dedicated customer account surface (`/account`).

### NewsletterForm (`components/chrome/newsletter-form.tsx`)
- **Purpose**: Interactive customer newsletter subscription form integrated into the global footer.
- **Server/Client**: Client component (`"use client"`).
- **Exported Props**: `NewsletterFormProps`, extending `React.ComponentProps<"form">`.
- **Features**:
  - Accessible `<form aria-label="Subscribe to newsletter">` with `aria-busy` during submission, ref forwarding, and stable `data-slot="newsletter-form"`.
  - Visually hidden label `<label htmlFor="newsletter-email" className="sr-only">Email address</label>`.
  - Transparent email input with bottom border matching reference, `type="email"`, `autoComplete="email"`, and placeholder `"Enter Your Email Address"` in accessible `text-muted-foreground`.
  - Uppercase `"SUBSCRIBE"` button with bottom border and minimum 44 × 44 px touch target.
  - Submits to `subscribeNewsletterAction` with shared client and server validation via `lib/newsletter.ts`.
  - Polite live region (`role="status"`, `aria-live="polite"`, `aria-atomic="true"`) for feedback without focus disruption.
  - Handles idempotent duplicate subscriptions gracefully.
  - Input reset on successful subscription; retained on validation error for easy editing.
- **Slot**: `data-slot="newsletter-form"`.
- **Real Usage**: Global footer (`components/chrome/site-footer.tsx`).

