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

type PageHeroBaseProps = Omit<React.ComponentProps<"section">, "title"> & {
  breadcrumbs: readonly BreadcrumbItemData[]
}

export type PageHeroProps = PageHeroBaseProps &
  (
    | { variant?: "banner"; title: string }
    | { variant: "compact-breadcrumb"; title?: never }
  )

export function PageHero({
  breadcrumbs,
  variant = "banner",
  title,
  className,
  ...props
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "surface-wash flex items-center",
        variant === "banner"
          ? "min-h-(--chrome-page-hero-banner-height)"
          : "min-h-(--product-detail-breadcrumb-height)",
        className
      )}
      data-slot="page-hero"
      data-variant={variant}
      {...props}
    >
      <Container
        className={cn(
          "flex flex-col",
          variant === "banner"
            ? "max-w-3xl items-center gap-3 text-center"
            : "items-start"
        )}
      >
        {variant === "banner" ? <h1 className="type-heading-xl">{title}</h1> : null}
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
