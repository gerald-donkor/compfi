"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowRightIcon, SearchIcon, XIcon } from "lucide-react"

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
import { searchStorefront, type SearchResults } from "@/lib/search"

export interface HeaderSearchProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  triggerClassName?: string
}

const popularSearches = ["Sofa", "Chair", "Table", "Bed", "Bench", "Wood", "Interior"] as const

const browseRooms = [
  { name: "Dining Room", href: "/shop?category=dining" },
  { name: "Living Room", href: "/shop?category=living" },
  { name: "Bedroom", href: "/shop?category=bedroom" },
] as const

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

  // Focus management on dialog open
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
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
      if (activeIndex >= 0 && activeItemRef.current) {
        event.preventDefault()
        activeItemRef.current.click()
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
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIndex(-1)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search furniture, rooms, articles..."
            aria-label="Search furniture and articles"
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
              className="flex size-9 min-h-9 min-w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-compfi-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-compfi-brand-focus transition-colors"
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
            /* Open default state: suggestions & room browsing */
            <div className="p-5 space-y-6">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="inline-flex min-h-9 items-center rounded-full bg-wash px-3.5 py-1.5 text-xs font-medium text-compfi-ink hover:bg-compfi-border hover:text-compfi-brand-action transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-compfi-brand-focus"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-compfi-border pt-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                  Browse Rooms
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {browseRooms.map((room) => (
                    <Link
                      key={room.name}
                      href={room.href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-11 items-center justify-between rounded-lg border border-compfi-border bg-wash/50 px-3.5 py-2 text-sm font-medium text-compfi-ink hover:border-compfi-brand-action hover:bg-wash transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-compfi-brand-focus"
                    >
                      <span>{room.name}</span>
                      <ArrowRightIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    </Link>
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
            <div className="p-4 divide-y divide-compfi-border">
              {results.products.length > 0 && (
                <div className="pb-4 first:pt-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                    Products ({results.products.length})
                  </p>
                  <ul role="list" className="space-y-1">
                    {results.products.map((product, idx) => {
                      const isSelected = activeIndex === idx
                      return (
                        <li key={product.id} role="listitem">
                          <Link
                            ref={isSelected ? activeItemRef : null}
                            href={product.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "group flex items-center gap-3.5 rounded-lg p-2.5 transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-compfi-brand-focus",
                              isSelected ? "bg-wash text-foreground" : "hover:bg-wash/70 text-compfi-ink"
                            )}
                          >
                            <Image
                              src={product.imageSrc}
                              alt={product.imageAlt}
                              width={56}
                              height={56}
                              className="size-14 shrink-0 rounded-control object-cover bg-wash"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="truncate text-sm font-medium text-foreground group-hover:text-compfi-brand-action transition-colors">
                                  {product.title}
                                </span>
                                {product.badge && (
                                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4.5">
                                    {product.badge}
                                  </Badge>
                                )}
                              </div>
                              <p className="truncate text-xs text-muted-foreground mt-0.5">
                                {product.subtitle}
                              </p>
                            </div>
                            {product.priceFormatted && (
                              <span className="shrink-0 text-sm font-semibold text-primary">
                                {product.priceFormatted}
                              </span>
                            )}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {results.articles.length > 0 && (
                <div className="pt-4 first:pt-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                    Editorial Articles ({results.articles.length})
                  </p>
                  <ul role="list" className="space-y-1">
                    {results.articles.map((article, idx) => {
                      const itemIndex = results.products.length + idx
                      const isSelected = activeIndex === itemIndex
                      return (
                        <li key={article.id} role="listitem">
                          <Link
                            ref={isSelected ? activeItemRef : null}
                            href={article.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "group flex items-center gap-3.5 rounded-lg p-2.5 transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-compfi-brand-focus",
                              isSelected ? "bg-wash text-foreground" : "hover:bg-wash/70 text-compfi-ink"
                            )}
                          >
                            <Image
                              src={article.imageSrc}
                              alt={article.imageAlt}
                              width={56}
                              height={56}
                              className="size-14 shrink-0 rounded-control object-cover bg-wash"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="truncate text-sm font-medium text-foreground group-hover:text-compfi-brand-action transition-colors">
                                  {article.title}
                                </span>
                                {article.badge && (
                                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 h-4.5">
                                    {article.badge}
                                  </Badge>
                                )}
                              </div>
                              <p className="truncate text-xs text-muted-foreground mt-0.5">
                                {article.subtitle}
                              </p>
                            </div>
                            <span className="shrink-0 text-xs font-medium text-muted-foreground">
                              Article
                            </span>
                          </Link>
                        </li>
                      )
                    })}
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
