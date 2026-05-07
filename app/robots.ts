import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/admin-login/", "/api/", "/reviews-lab/"],
      },
    ],
    sitemap: "https://evguide.co.uk/sitemap.xml",
  };
}
