import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/sign-in", "/sign-up"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
