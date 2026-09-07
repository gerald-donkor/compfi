# Compfi Component Inventory & Specifications

Status: Phase 2 certified; implemented, tested, and verified.

This document owns the public component contracts, APIs, states, and accessibility requirements for Compfi primitives and foundation components.

---

## 1. Scope & Audit Status

### Phase 3 Shared Chrome Blocks

- **`SiteHeader` / `HeaderControls`**: The server-safe header owns brand and
  desktop structure. The focused client controls leaf owns current-route
  semantics, mobile menu state, Escape/focus-return behavior, and composes the
  cart drawer. Desktop navigation is hidden rather than duplicated on mobile.
- **`PageHero`**: Server-safe title/breadcrumb block with the explicit
  `BreadcrumbItemData` record (`label`, optional internal `href`). The final
  item is non-interactive and has `aria-current="page"`.
- **`BenefitsStrip`**: Server-safe four-item content block. Icons are
  decorative; content records use an icon component, title, and description.
- **`SiteFooter`**: Server-safe navigation block with non-claiming Compfi copy
  and 44px minimum link targets. It does not model newsletter submission.
- **`CartDrawer`**: Focused client leaf with controlled open state only. It
  composes Base UI's modal Sheet; title and descriptive empty state are always
  present. The audited Sheet adaptation uses a 20% scrim, flat 550px maximum
  side sheet, viewport-safe width, overscroll containment, reduced-motion-safe
  transition, focus trapping, Escape/backdrop dismissal, and focus return.

### Certified Phase 2 Components
The following components have been fully audited, styled to Compfi's measured design tokens, verified for accessibility (WCAG 2.2 AA floor), and tested in automated JSDOM suites and real-browser rendering:

- **Actions & Display**: `Button`, `IconButton`, `Link`, `Badge`, `Separator`
- **Forms**: `FieldSet`, `FieldLegend`, `FieldGroup`, `Field`, `FieldContent`, `FieldLabel`, `FieldTitle`, `FieldDescription`, `FieldSeparator`, `FieldError`, `Label`, `Input`, `Textarea`, `Select`
- **Layout**: `Section`, `Stack`, `Cluster`, `Container`
- **Product Foundations**: `Money`, `QuantityInput`, `ColorSelector` / `ColorSwatch`, `SizeSelector`

### Existing Uncertified Components
Generated components outside this certified inventory (including accordion, alert-dialog, avatar, breadcrumb, calendar, card, carousel, chart, checkbox, collapsible, combobox, command, context-menu, dialog, drawer, dropdown-menu, empty, hover-card, input-group, input-otp, item, kbd, marker, menubar, message-scroller, message, native-select, navigation-menu, pagination, popover, progress, questionnaire, radio-group, resizable, scroll-area, sheet, sidebar, skeleton, slider, switch, table, tabs, tooltip) remain committed in the repository as pre-existing base files. They are **not yet certified** and will be audited and adapted as future owning phases require them.

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
