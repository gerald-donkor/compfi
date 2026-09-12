"use client"

import * as React from "react"
import { MenuIcon, SearchIcon, UserIcon, XIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { Show, SignInButton, UserButton } from "@clerk/nextjs"

import { cn } from "cn"

import { CartDrawer } from "@/components/chrome/cart-drawer"
import { HeaderSearch } from "@/components/chrome/header-search"
import { IconButton } from "@/components/ui/icon-button"
import { Link } from "@/components/ui/link"

type NavigationItem = { href: string; label: string }

const mobileAuthItemClasses =
  "flex min-h-11 w-full items-center gap-3 px-1 text-left font-medium text-compfi-ink hover:text-compfi-brand-action transition-colors"

export function HeaderControls({ navigation }: { navigation: readonly NavigationItem[] }) {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const menuButton = React.useRef<HTMLButtonElement>(null)
  const pathname = usePathname()

  React.useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [menuOpen])

  return (
    <>
      <nav aria-label="Primary" className="hidden lg:block">
        <ul className="flex items-center gap-8 xl:gap-12">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                variant="default"
                aria-current={pathname === item.href ? "page" : undefined}
                className="min-h-11 min-w-11 px-1 no-underline"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center justify-end gap-0.5 sm:gap-1">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <IconButton
              icon={UserIcon}
              label="Sign in to account"
              variant="ghost"
              className="min-h-11 min-w-11"
            />
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <div className="flex min-h-11 min-w-11 items-center justify-center">
            <UserButton
              userProfileMode="navigation"
              userProfileUrl="/account"
              aria-label="Open user account menu"
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-7 w-7",
                  userButtonTrigger:
                    "min-h-11 min-w-11 rounded-full p-1 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-compfi-brand-focus",
                },
              }}
            />
          </div>
        </Show>
        <HeaderSearch open={searchOpen} onOpenChange={setSearchOpen} />
        <CartDrawer />
        <IconButton
          ref={menuButton}
          icon={menuOpen ? XIcon : MenuIcon}
          label={menuOpen ? "Close menu" : "Open menu"}
          variant="ghost"
          aria-expanded={menuOpen}
          aria-controls="mobile-primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="lg:hidden"
        />
      </div>

      <nav
        id="mobile-primary-navigation"
        aria-label="Primary"
        hidden={!menuOpen}
        className="col-span-2 border-t border-compfi-border py-3 lg:hidden"
      >
        <ul className="flex flex-col">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                variant="default"
                aria-current={pathname === item.href ? "page" : undefined}
                className="min-h-11 min-w-11 w-full px-1 no-underline"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="border-t border-compfi-border pt-2 mt-2">
            <button
              type="button"
              className={mobileAuthItemClasses}
              onClick={() => {
                setMenuOpen(false)
                setSearchOpen(true)
              }}
            >
              <SearchIcon className="h-5 w-5 text-compfi-brand" aria-hidden="true" />
              <span>Search</span>
            </button>
          </li>
          <li>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className={mobileAuthItemClasses}
                  onClick={() => setMenuOpen(false)}
                >
                  <UserIcon className="h-5 w-5 text-compfi-brand" aria-hidden="true" />
                  <span>Sign in</span>
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <Link
                href="/account"
                variant="default"
                aria-current={pathname === "/account" ? "page" : undefined}
                className={cn(mobileAuthItemClasses, "no-underline")}
                onClick={() => setMenuOpen(false)}
              >
                <UserIcon className="h-5 w-5 text-compfi-brand" aria-hidden="true" />
                <span>My Account</span>
              </Link>
            </Show>
          </li>
        </ul>
      </nav>
    </>
  )
}

