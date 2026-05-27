import { unstable_cache } from "next/cache";
import { createPublicServerClient } from "@/lib/supabase/public-server";
import { createAdminClient } from "@/lib/supabase/admin";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AccessoryCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  displayOrder: number;
}

export interface Accessory {
  id: string;
  categoryId: string;
  categorySlug: string;
  name: string;
  slug: string;
  description: string | null;
  brand: string | null;
  priceGbp: number | null;
  imageUrl: string | null;
  affiliateUrl: string | null;
  badge: string | null;
  rating: number | null;
  reviewCount: number;
  isFeatured: boolean;
  compatibleWith: string[];
  displayOrder: number;
}

export interface CategoryWithProducts {
  category: AccessoryCategory;
  products: Accessory[];
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function mapCategory(row: Record<string, unknown>): AccessoryCategory {
  return {
    id:           String(row.id),
    slug:         String(row.slug),
    name:         String(row.name),
    description:  row.description != null ? String(row.description) : null,
    icon:         row.icon != null ? String(row.icon) : null,
    displayOrder: Number(row.display_order ?? 0),
  };
}

function mapAccessory(row: Record<string, unknown>, categorySlug: string): Accessory {
  return {
    id:             String(row.id),
    categoryId:     String(row.category_id),
    categorySlug,
    name:           String(row.name),
    slug:           String(row.slug),
    description:    row.description != null ? String(row.description) : null,
    brand:          row.brand != null ? String(row.brand) : null,
    priceGbp:       row.price_gbp != null ? Number(row.price_gbp) : null,
    imageUrl:       row.image_url != null ? String(row.image_url) : null,
    affiliateUrl:   row.affiliate_url != null ? String(row.affiliate_url) : null,
    badge:          row.badge != null ? String(row.badge) : null,
    rating:         row.rating != null ? Number(row.rating) : null,
    reviewCount:    Number(row.review_count ?? 0),
    isFeatured:     Boolean(row.is_featured),
    compatibleWith: Array.isArray(row.compatible_with) ? (row.compatible_with as string[]) : [],
    displayOrder:   Number(row.display_order ?? 0),
  };
}

// ── Queries ───────────────────────────────────────────────────────────────────

async function fetchCategories(): Promise<AccessoryCategory[]> {
  const supabase = createPublicServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("accessory_categories")
    .select("id, slug, name, description, icon, display_order")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[accessories] fetchCategories error:", error.message);
    return [];
  }
  return (data ?? []).map((r) => mapCategory(r as Record<string, unknown>));
}

async function fetchProductsByCategory(
  categoryId: string,
  categorySlug: string,
  limit = 3,
): Promise<Accessory[]> {
  const supabase = createPublicServerClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("accessories")
    .select("id, category_id, name, slug, description, brand, price_gbp, image_url, affiliate_url, badge, rating, review_count, is_featured, compatible_with, display_order")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("[accessories] fetchProductsByCategory error:", error.message);
    return [];
  }
  return (data ?? []).map((r) => mapAccessory(r as Record<string, unknown>, categorySlug));
}

async function fetchAllCategoriesWithProducts(previewCount = 3): Promise<CategoryWithProducts[]> {
  const categories = await fetchCategories();
  const results = await Promise.all(
    categories.map(async (cat) => ({
      category: cat,
      products: await fetchProductsByCategory(cat.id, cat.slug, previewCount),
    })),
  );
  return results;
}

// ── Cached exports ────────────────────────────────────────────────────────────

export const getAccessoryCategories = unstable_cache(
  fetchCategories,
  ["accessory-categories"],
  { revalidate: 3600, tags: ["accessories"] },
);

export const getAllAccessoriesWithProducts = unstable_cache(
  () => fetchAllCategoriesWithProducts(3),
  ["accessories-homepage"],
  { revalidate: 3600, tags: ["accessories"] },
);

export const getAllAccessoriesForPage = unstable_cache(
  () => fetchAllCategoriesWithProducts(50),
  ["accessories-page"],
  { revalidate: 3600, tags: ["accessories"] },
);

export async function getProductsByCategory(
  slug: string,
  limit = 50,
): Promise<{ category: AccessoryCategory | null; products: Accessory[] }> {
  const supabase = createPublicServerClient();
  if (!supabase) return { category: null, products: [] };
  const { data: catRow } = await supabase
    .from("accessory_categories")
    .select("id, slug, name, description, icon, display_order")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!catRow) return { category: null, products: [] };
  const category = mapCategory(catRow as Record<string, unknown>);
  const products = await fetchProductsByCategory(category.id, category.slug, limit);
  return { category, products };
}

// ── Admin mutations ───────────────────────────────────────────────────────────

export async function adminGetAllAccessories() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("accessories")
    .select("*, accessory_categories(slug)")
    .order("category_id")
    .order("display_order");

  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => {
    const catSlug = (r as Record<string, unknown> & { accessory_categories?: { slug: string } })
      .accessory_categories?.slug ?? "";
    return mapAccessory(r as Record<string, unknown>, catSlug);
  });
}
