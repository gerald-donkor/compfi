import type { MetadataRoute } from "next";
import { catalogProducts } from "@/lib/catalog";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-12T00:00:00.000Z");

  const staticPaths = [
    { path: "", changeFrequency: "daily" as const, priority: 1.0 },
    { path: "/shop", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/cart", changeFrequency: "weekly" as const, priority: 0.7 },
    { path: "/checkout", changeFrequency: "weekly" as const, priority: 0.7 },
    { path: "/contact", changeFrequency: "weekly" as const, priority: 0.7 },
    { path: "/blog", changeFrequency: "weekly" as const, priority: 0.7 },
    { path: "/comparison", changeFrequency: "weekly" as const, priority: 0.7 },
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.map((item) => ({
    url: `${siteUrl}${item.path}`,
    lastModified,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));

  const productRoutes: MetadataRoute.Sitemap = catalogProducts.map((product) => ({
    url: `${siteUrl}/shop/${product.slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
