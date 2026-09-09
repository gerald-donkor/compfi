import type { ComponentProps } from "react"
import Image from "next/image"
import { cn } from "cn"

import { Container } from "@/components/layout/container"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import type { CatalogProduct } from "@/types/commerce"

export interface ProductInformationProps extends ComponentProps<"section"> {
  product: CatalogProduct
}

export function ProductInformation({
  product,
  className,
  "aria-label": ariaLabel = "Product information",
  ...props
}: ProductInformationProps) {
  return (
    <section
      {...props}
      className={cn("product-detail-information", className)}
      aria-label={ariaLabel}
      data-slot="product-information"
    >
      <Container>
        <Tabs defaultValue="description" className="gap-8">
          <TabsList variant="line" aria-label="Product information">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="max-w-4xl type-body text-muted-foreground">
            <p>{product.detailDescription}</p>
          </TabsContent>
          <TabsContent value="details">
            <dl className="grid max-w-xl grid-cols-[max-content_1fr] gap-x-6 gap-y-3 type-body text-muted-foreground">
              <dt>Product ID</dt>
              <dd>{product.id}</dd>
              <dt>Category</dt>
              <dd className="capitalize">{product.category}</dd>
              {product.sizes?.length ? <><dt>Sizes</dt><dd>{product.sizes.map((option) => option.label).join(", ")}</dd></> : null}
              {product.finishes?.length ? <><dt>Finishes</dt><dd>{product.finishes.map((option) => option.label).join(", ")}</dd></> : null}
            </dl>
          </TabsContent>
        </Tabs>

        <div className="product-detail-information__media" data-slot="product-information-media">
          {product.gallery.slice(1).map((media) => (
            <div key={media.path} className="product-detail-information__frame">
              <Image
                src={media.path}
                alt={media.alt}
                width={media.width}
                height={media.height}
                sizes="(min-width: 1280px) 605px, (min-width: 768px) calc(50vw - 48px), calc(100vw - 40px)"
                className="size-full object-cover"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
