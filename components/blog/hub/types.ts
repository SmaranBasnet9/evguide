export const BLOG_CATEGORIES = [
  "All",
  "Buying Guides",
  "Comparisons",
  "Charging",
  "Finance",
  "News",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export interface BlogHubArticle {
  id: string;
  href: string;
  slug?: string;
  title: string;
  excerpt: string;
  description?: string;
  category: Exclude<BlogCategory, "All">;
  image: string;
  readTime: string;
  publishedAt: string;
  author?: string;
  featured?: boolean;
}

export interface BlogHeroProps {
  query: string;
  onQueryChange: (value: string) => void;
  activeCategory: BlogCategory;
  onCategoryChange: (value: BlogCategory) => void;
  quickCategories: Exclude<BlogCategory, "All">[];
}
