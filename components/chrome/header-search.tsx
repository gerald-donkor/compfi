"use client"

import * as React from "react"
import Image from "next/image"
import { SearchIcon, XIcon } from "lucide-react"

import { cn } from "cn"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { IconButton } from "@/components/ui/icon-button"
import { Link } from "@/components/ui/link"
import { searchStorefront, type SearchResultItem, type SearchResults } from "@/lib/search"

export interface HeaderSearchProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  triggerClassName?: string
}

const suggestedCategories = ["Dining", "Living", "Bedroom"] as const
const popularSearches = ["Sofa", "Chair", "Table", "Bed", "Bench", "Wood", "Interior"] as const

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const trimmed = query.trim()
  if (!trimmed) return <>{text}</>

  const terms = trimmed
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))

  if (terms.length === 0) return <>{text}</>

  const regex = new RegExp(`(${terms.join("|")})`, "gi")
  const parts = text.split(regex)
  const isMatchTerm = new RegExp(`^(?:${terms.join("|")})$`, "i")

  return (
    <>
      {parts.map((part, i) =>
        isMatchTerm.test(part) ? (
          <mark key={i} className="bg-wash font-semibold text-compfi-ink rounded-xs px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}

interface SearchResultRowProps {
  item: SearchResultItem
  isSelected: boolean
  activeItemRef: React.RefObject<HTMLAnchorElement | null>
  query: string
  onSelect: () => void
}

function SearchResultRow({
  item,
  isSelected,
  activeItemRef,
  query,
  onSelect,
}: SearchResultRowProps) {
  return (
    <li role="none">
      <Link
        id={item.id}
        ref={isSelected ? activeItemRef : null}
        href={item.href}
        role="option"
        aria-selected={isSelected}
        onClick={onSelect}
        className={cn(
          "group flex min-h-11 items-center gap-3.5 rounded-lg p-2.5 transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-compfi-brand-focus",
          isSelected ? "bg-wash text-foreground" : "hover:bg-wash/70 text-compfi-ink"
        )}
      >
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          width={56}
          height={56}
          className="size-14 shrink-0 rounded-control object-cover bg-wash"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium text-foreground group-hover:text-compfi-brand-action transition-colors">
              <HighlightMatch text={item.title} query={query} />
            </span>
            {item.badge && (
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4.5">
                {item.badge}
              </Badge>
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground mt-0.5">
            {item.subtitle}
          </p>
        </div>
        {item.priceFormatted ? (
          <span className="shrink-0 text-sm font-semibold text-primary">
            {item.priceFormatted}
          </span>
        ) : (
          <span className="shrink-0 text-xs font-medium text-muted-foreground">
            Article
          </span>
        )}
      </Link>
    </li>
  )
}

export function HeaderSearch({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  triggerClassName,
}: HeaderSearchProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [activeIndex, setActiveIndex] = React.useState(-1)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setQuery("")
        setActiveIndex(-1)
      }
      if (!isControlled) {
        setInternalOpen(nextOpen)
      }
      controlledOnOpenChange?.(nextOpen)
    },
    [isControlled, controlledOnOpenChange]
  )

  const deferredQuery = React.useDeferredValue(query)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const activeItemRef = React.useRef<HTMLAnchorElement>(null)

  const results: SearchResults = React.useMemo(() => {
    return searchStorefront(deferredQuery)
  }, [deferredQuery])

  const allItems = React.useMemo(() => {
    return [...results.products, ...results.articles]
  }, [results.products, results.articles])

  // Focus input when dialog opens
  React.useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  // Scroll active item into view during keyboard navigation
  React.useEffect(() => {
    if (activeIndex >= 0 && activeItemRef.current) {
      activeItemRef.current.scrollIntoView?.({ block: "nearest" })
    }
  }, [activeIndex])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (allItems.length === 0) return
      setActiveIndex((prev) => (prev + 1) % allItems.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      if (allItems.length === 0) return
      setActiveIndex((prev) => (prev <= 0 ? allItems.length - 1 : prev - 1))
    } else if (event.key === "Enter") {
      event.preventDefault()
      if (activeIndex >= 0 && activeItemRef.current) {
        activeItemRef.current.click()
      } else if (allItems.length > 0) {
        // Instant Enter submission fallback to first result
        const firstLink = document.getElementById(allItems[0].id) as HTMLAnchorElement | null
        firstLink?.click()
      }
    }
  }

  const liveStatusText = React.useMemo(() => {
    const trimmed = deferredQuery.trim()
    if (!trimmed) return ""
    if (results.totalCount === 0) {
      return `0 search results found for ${trimmed}`
    }
    return `${results.products.length} ${
      results.products.length === 1 ? "product" : "products"
    } and ${results.articles.length} ${
      results.articles.length === 1 ? "article" : "articles"
    } found for ${trimmed}`
  }, [deferredQuery, results])

  const activeDescendantId = activeIndex >= 0 && activeIndex < allItems.length ? allItems[activeIndex].id : undefined

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <IconButton
            icon={SearchIcon}
            label="Search Compfi"
            variant="ghost"
            className={cn("min-h-11 min-w-11", triggerClassName)}
          />
        }
      />

      <DialogContent
        data-slot="header-search"
        showCloseButton={false}
        className="top-[10%] sm:top-1/2 translate-y-0 sm:-translate-y-1/2 flex flex-col p-0 gap-0 sm:max-w-2xl max-h-[82vh] overflow-hidden bg-background border border-compfi-border shadow-2xl rounded-2xl"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search Compfi</DialogTitle>
          <DialogDescription>
            Search furniture products, rooms, and editorial articles across Compfi storefront.
          </DialogDescription>
        </DialogHeader>

        {/* Live region for screen-reader search status */}
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {liveStatusText}
        </div>

        {/* Top search bar with search input, clear button, and accessible close button */}
        <div className="flex items-center gap-2 border-b border-compfi-border px-3 sm:px-4 py-2 bg-background">
          <SearchIcon className="size-5 shrink-0 text-muted-foreground ml-1" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls="search-results-list"
            aria-autocomplete="list"
            aria-activedescendant={activeDescendantId}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIndex(-1)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search furniture, rooms, articles..."
            aria-label="Search furniture and articles"
            autoFocus
            autoComplete="off"
            spellCheck={false}
            className="h-11 w-full bg-transparent text-sm sm:text-base text-compfi-ink placeholder:text-muted-foreground focus:outline-none"
          />

          {query.trim() && (
            <button
              type="button"
              onClick={() => {
                setQuery("")
                setActiveIndex(-1)
                inputRef.current?.focus()
              }}
              aria-label="Clear search input"
              className="flex size-11 min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-compfi-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-compfi-brand-focus transition-colors"
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          )}

          <DialogClose
            render={
              <IconButton
                icon={XIcon}
                label="Close search"
                variant="ghost"
                className="min-h-11 min-w-11 shrink-0"
              />
            }
          />
        </div>

        {/* Body content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {!query.trim() ? (
            /* Open default state: suggestions & category chips */
            <div className="p-5 space-y-6">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                  Suggested Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setQuery(category)}
                      className="inline-flex min-h-11 items-center rounded-full bg-wash px-4 py-2 text-xs font-medium text-compfi-ink hover:bg-compfi-border hover:text-compfi-brand-action transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-compfi-brand-focus"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-compfi-border pt-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="inline-flex min-h-11 items-center rounded-full bg-wash px-4 py-2 text-xs font-medium text-compfi-ink hover:bg-compfi-border hover:text-compfi-brand-action transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-compfi-brand-focus"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : results.totalCount === 0 ? (
            /* Empty state when no matches found */
            <div className="p-8">
              <Empty className="border-0 p-0">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <SearchIcon className="size-5" aria-hidden="true" />
                  </EmptyMedia>
                  <EmptyTitle className="type-heading-sm">
                    No results found for &ldquo;{query.trim()}&rdquo;
                  </EmptyTitle>
                  <EmptyDescription>
                    Try searching for another term like &ldquo;chair&rdquo;, &ldquo;table&rdquo;, &ldquo;sofa&rdquo;, or explore our shop.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent className="mt-4">
                  <Link
                    href="/shop"
                    onClick={() => setOpen(false)}
                    className={buttonVariants({ variant: "default", size: "default" })}
                  >
                    <span className="text-primary-foreground">Browse all furniture</span>
                  </Link>
                </EmptyContent>
              </Empty>
            </div>
          ) : (
            /* Results listing */
            <div id="search-results-list" role="listbox" aria-label="Search results" className="p-4 divide-y divide-compfi-border">
              {results.products.length > 0 && (
                <div className="pb-4 first:pt-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                    Products ({results.products.length})
                  </p>
                  <ul role="presentation" className="space-y-1">
                    {results.products.map((product, idx) => (
                      <SearchResultRow
                        key={product.id}
                        item={product}
                        isSelected={activeIndex === idx}
                        activeItemRef={activeItemRef}
                        query={query}
                        onSelect={() => setOpen(false)}
                      />
                    ))}
                  </ul>
                </div>
              )}

              {results.articles.length > 0 && (
                <div className="pt-4 first:pt-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                    Editorial Articles ({results.articles.length})
                  </p>
                  <ul role="presentation" className="space-y-1">
                    {results.articles.map((article, idx) => (
                      <SearchResultRow
                        key={article.id}
                        item={article}
                        isSelected={activeIndex === results.products.length + idx}
                        activeItemRef={activeItemRef}
                        query={query}
                        onSelect={() => setOpen(false)}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop keyboard navigation shortcut hint footer */}
        <div className="hidden sm:flex items-center justify-between border-t border-compfi-border bg-wash/60 px-4 py-2.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-compfi-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-compfi-ink shadow-xs">
                ↑
              </kbd>
              <kbd className="rounded border border-compfi-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-compfi-ink shadow-xs">
                ↓
              </kbd>
              <span>Navigate</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-compfi-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-compfi-ink shadow-xs">
                ↵
              </kbd>
              <span>Select</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-compfi-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-compfi-ink shadow-xs">
                ESC
              </kbd>
              <span>Close</span>
            </span>
          </div>

          {results.totalCount > 0 && (
            <span>
              {results.totalCount} {results.totalCount === 1 ? "result" : "results"}
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
