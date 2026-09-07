import * as React from "react"
import { cn } from "cn"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Container } from "@/components/layout/container"
import { Link } from "@/components/ui/link"

export type BreadcrumbItemData = { label: string; href?: string }

export type PageHeroProps = {
  title: string
  breadcrumbs: readonly BreadcrumbItemData[]
  size?: "banner" | "breadcrumb"
}

export function PageHero({ title, breadcrumbs, size = "banner" }: PageHeroProps) {
  return (
    <section
      className={cn(
        "surface-wash flex items-center py-8 text-center",
        size === "banner"
          ? "min-h-(--chrome-page-hero-banner-height)"
          : "min-h-(--chrome-page-hero-breadcrumb-height)"
      )}
      data-slot="page-hero"
      data-size={size}
    >
      <Container className="flex max-w-3xl flex-col items-center gap-3">
        <h1 className="type-heading-xl">{title}</h1>
        <Breadcrumb>
          <BreadcrumbList className="justify-center">
            {breadcrumbs.map((item, index) => {
              const isCurrent = index === breadcrumbs.length - 1
              return (
                <React.Fragment key={`${item.label}-${index}`}>
                  <BreadcrumbItem>
                    {isCurrent ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : !item.href ? (
                      <span className="text-foreground">{item.label}</span>
                    ) : (
                      <BreadcrumbLink render={<Link href={item.href} variant="default" />}>{item.label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isCurrent && <BreadcrumbSeparator />}
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </Container>
    </section>
  )
}
