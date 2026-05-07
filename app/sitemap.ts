import type { MetadataRoute } from "next";
import { getAllEVs } from "@/lib/evs";
import { getAllBlogPosts } from "@/lib/blog";

const BASE_URL = "https://evguide.co.uk";

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: BASE_URL,                          priority: 1.0,  changeFrequency: "daily" },
  { url: `${BASE_URL}/vehicles`,            priority: 0.95, changeFrequency: "daily" },
  { url: `${BASE_URL}/compare`,             priority: 0.9,  changeFrequency: "weekly" },
  { url: `${BASE_URL}/ai-match`,            priority: 0.9,  changeFrequency: "weekly" },
  { url: `${BASE_URL}/finance`,             priority: 0.8,  changeFrequency: "weekly" },
  { url: `${BASE_URL}/charging`,            priority: 0.75, changeFrequency: "weekly" },
  { url: `${BASE_URL}/exchange`,            priority: 0.75, changeFrequency: "weekly" },
  { url: `${BASE_URL}/blog`,               priority: 0.8,  changeFrequency: "daily" },
  { url: `${BASE_URL}/privacy`,            priority: 0.2,  changeFrequency: "yearly" },
  { url: `${BASE_URL}/terms`,              priority: 0.2,  changeFrequency: "yearly" },
  { url: `${BASE_URL}/cookies`,            priority: 0.2,  changeFrequency: "yearly" },
  { url: `${BASE_URL}/support`,            priority: 0.4,  changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [evs, posts] = await Promise.all([
    getAllEVs().catch(() => []),
    getAllBlogPosts().catch(() => []),
  ]);

  const vehiclePages: MetadataRoute.Sitemap = evs.map((ev) => ({
    url: `${BASE_URL}/cars/${ev.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Programmatic compare pairs — top 10 models × each other
  const topEvs = evs.slice(0, 10);
  const comparePages: MetadataRoute.Sitemap = [];
  for (let i = 0; i < topEvs.length; i++) {
    for (let j = i + 1; j < topEvs.length; j++) {
      comparePages.push({
        url: `${BASE_URL}/compare?carA=${topEvs[i]!.id}&carB=${topEvs[j]!.id}`,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [...STATIC_PAGES, ...vehiclePages, ...comparePages, ...blogPages];
}
