import type { EVModel } from "@/types";
import type { FeaturedBlogPost } from "@/lib/blog";

export interface InlineEVRecommendation {
  model: EVModel;
  monthlyCost: number;
  dealScore: number;
  summary: string;
}

export type ArticleBlock =
  | {
      type: "heading";
      id: string;
      title: string;
      level?: 2 | 3;
      eyebrow?: string;
    }
  | {
      type: "paragraph";
      id: string;
      content: string;
      lead?: boolean;
    }
  | {
      type: "list";
      id: string;
      title?: string;
      items: string[];
    }
  | {
      type: "insight";
      id: string;
      title: string;
      content: string;
    }
  | {
      type: "evs";
      id: string;
      title: string;
      description: string;
      items: InlineEVRecommendation[];
    }
  | {
      type: "cta";
      id: string;
      title: string;
      description: string;
      primaryLabel: string;
      primaryHref: string;
      secondaryLabel?: string;
      secondaryHref?: string;
    }
  | {
      type: "compare";
      id: string;
      title: string;
      description: string;
      compareHref: string;
      viewHref: string;
    }
  | {
      type: "finance";
      id: string;
      title: string;
      description: string;
      href: string;
    };

export interface ArticleHeroData {
  category: string;
  title: string;
  subtitle: string;
  author: string;
  readTime: string;
  publishedAt: string;
  image: string;
  geoLocation?: string | null;
}

export interface RelatedArticleItem {
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  image: string | null;
  category: string;
}

export interface ArticleContentProps {
  blocks: ArticleBlock[];
}

export interface RelatedArticlesProps {
  articles: RelatedArticleItem[];
}

export interface ArticlePageModel {
  hero: ArticleHeroData;
  blocks: ArticleBlock[];
  relatedArticles: RelatedArticleItem[];
  finalCta: {
    title: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  sourcePost: FeaturedBlogPost;
}
