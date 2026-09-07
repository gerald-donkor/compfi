import * as React from "react"

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

export function PageHero({ title, breadcrumbs }: { title: string; breadcrumbs: readonly BreadcrumbItemData[] }) {
  return (
    <section className="surface-wash flex min-h-45 items-center py-8 text-center" data-slot="page-hero">
      <Container className="flex max-w-3xl flex-col items-center gap-3">
        <h1 className="type-heading-xl">{title}</h1>
        <Breadcrumb>
          <BreadcrumbList className="justify-center">
            {breadcrumbs.map((item, index) => {
              const isCurrent = index === breadcrumbs.length - 1
              return (
                <React.Fragment key={`${item.label}-${index}`}>
                  <BreadcrumbItem>
                    {isCurrent || !item.href ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
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
