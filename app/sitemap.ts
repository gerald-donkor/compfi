import type { MetadataRoute } from "next";
import { catalogProducts } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://compfi.com";
  const lastModified = new Date();

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
