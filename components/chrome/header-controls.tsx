"use client"

import * as React from "react"
import { MenuIcon, XIcon } from "lucide-react"
import { usePathname } from "next/navigation"

import { CartDrawer } from "@/components/chrome/cart-drawer"
import { IconButton } from "@/components/ui/icon-button"
import { Link } from "@/components/ui/link"

type NavigationItem = { href: string; label: string }

export function HeaderControls({ navigation }: { navigation: readonly NavigationItem[] }) {
  const [menuOpen, setMenuOpen] = React.useState(false)
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
                className="min-h-11 px-1 no-underline"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center justify-end gap-1">
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
                className="min-h-11 w-full px-1 no-underline"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
