import type { MetadataRoute } from "next"

/**
 * Generates the robots.txt file for search engine crawlers
 *
 * This configuration allows all search engines to crawl the entire site
 * and provides the sitemap location for better indexing
 *
 * @returns {MetadataRoute.Robots} Robots configuration object
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/workout/new"],
    },
    sitemap: "https://yourworkoutapp.com/sitemap.xml",
  }
}
