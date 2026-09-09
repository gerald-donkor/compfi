# Compfi Component Inventory & Specifications

Status: Phase 4 product-detail components certified; implemented, tested, and verified.

This document owns the public component contracts, APIs, states, and accessibility requirements for Compfi primitives and foundation components.

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
  and 44px minimum link targets. It does not model newsletter submission.
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
  `details` supplies room disclosure and local links; the selected Base UI view
  toggle carries `data-composite-item-active`, making it the roving Tab entry
  point while arrow keys move within the group. Native page-size and sort
  controls are labelled, disabled during a transition, and rebuild canonical
  local URLs. Real usage: `/shop`.
- **`ShopResults`**: Server block accepting one resolved `CatalogViewModel`.
  It owns the `shop-results` slot and `data-view` presentation boundary,
  truthful result range, `ProductGrid` delegation, a recoverable empty state,
  and real-link pagination with the active page exposed through
  `aria-current="page"`. Grid/list styling is responsive; it has no client
  state or catalog mutation. Real usage: `/shop`.
- **`Pagination`**: Server-safe navigation composition. `PaginationLink`,
  `PaginationPrevious`, and `PaginationNext` render native anchors styled with
  the shared button variants; they never override link semantics. The active
  page alone receives `aria-current="page"`. Real usage: Shop result pages.

### Phase 4 Product Detail Blocks

- **`ProductDetail`**: Server block for the two-column summary. It composes the
  gallery, one product `h1`, shared USD `Money`, product copy, options, and
  factual ID/category metadata without inventing availability or policies.
- **`ProductGallery`**: Focused client leaf accepting readonly media. It shows
  one responsive lead image and native thumbnail buttons with `aria-pressed`;
  a user selection updates the lead and one polite status. Empty input renders
  a useful `Empty` state. A changed lead-media identity resets selection and
  clears announcements, including when returning to an earlier product. Native
  section props and accessible naming remain customizable in every state.
- **`ProductOptions`**: Focused client leaf composing the certified size,
  finish, and quantity controls. Optional groups render only when data exists.
  Quantity is bounded 1–10. Add-to-cart submits the valid configured catalog
  selection to the cart provider and its result is announced politely;
  an optional allowlisted `comparisonHref` renders the real Compare link.
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
  totals are derived from immutable fixtures. Its polite live region announces
  ordinary cart changes. Reloading deliberately starts a new empty cart.
- **`CartDrawer`**: Client leaf built on the existing named Base UI Sheet.
  Empty and populated states retain the primitive's modal focus mechanics. A
  populated drawer renders local product media, configured selection labels,
  product links, removal controls, an integer-cent subtotal, and a real Cart
  link. Checkout is visibly unavailable until the route exists.
- **`CartContent`**: Client route content that uses a semantic desktop table
  and labelled mobile line-item groups below `768px`. Both use the certified
  controlled `QuantityInput`; removal returns focus to its cart-items heading.

### Phase 4 Home Editorial Blocks

- **`InspirationSection`**: Server block owning the cream band, concise Compfi
  copy, and real `/shop` action. It passes only four serializable slide records
  into the interactive leaf. Stable slot: `inspiration-section`.
- **`InspirationCarousel`**: Client leaf accepting `readonly
  InspirationSlide[]`. It composes the certified carousel primitive, tracks
  `select` and `reInit`, exposes previous/next and four labelled dots, and
  announces one polite atomic status. Dots carry `aria-current`; controls stay
  mounted at disabled boundaries; nested links retain arrow keys. Reduced
  motion uses Embla's jump path. An empty collection renders no carousel.
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
- **Accessibility**: Image link has the fixture product name; media retains the fixture alt; title is an `h3`; previous price has a screen-reader label; the redundant desktop-only `View product` link appears on hover and `:focus-within`, never as the sole path to a product.
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
  - Detects and throws on duplicate option values in development.
  - Gracefully handles empty and non-existent controlled values.
  - Forwards `ref` and native DOM attributes.
- **Slot**: `data-slot="size-selector"`, `data-slot="size-option"`.
- **Real Usage**: Bed, dining table, and sofa sizing on product detail page.
