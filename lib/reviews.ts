import { createClient } from "@/lib/supabase/server";
import type { EVReview } from "@/data/evReviews";

// ─── Public types ─────────────────────────────────────────────────────────────

/**
 * Structured review record stored in the `reviews` table.
 * All fields that can be submitted via ReviewForm map here.
 *
 * Expected DB schema:
 * ```sql
 * CREATE TABLE reviews (
 *   id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *   car_id           text NOT NULL,        -- e.g. 'byd-atto-3', matches evModels[].id
 *   brand            text,
 *   model            text,
 *   author_label     text,                 -- anonymised display name
 *   overall_rating   smallint NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
 *   range_rating     smallint CHECK (range_rating BETWEEN 1 AND 5),
 *   comfort_rating   smallint CHECK (comfort_rating BETWEEN 1 AND 5),
 *   value_rating     smallint CHECK (value_rating BETWEEN 1 AND 5),
 *   title            text NOT NULL,
 *   description      text NOT NULL,
 *   pros             text[],
 *   cons             text[],
 *   usage_type       text,
 *   ownership_months smallint,
 *   is_approved      boolean NOT NULL DEFAULT false,
 *   created_at       timestamptz NOT NULL DEFAULT now()
 * );
 * ```
 */
export type Review = {
  id: string;
  carId: string;
  brand: string | null;
  model: string | null;
  authorLabel: string;
  overallRating: number;
  rangeRating: number | null;
  comfortRating: number | null;
  valueRating: number | null;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  usageType: string | null;
  ownershipMonths: number | null;
  createdAt: string;
};

// ─── Internal DB row shape ────────────────────────────────────────────────────

type RawReviewRow = {
  id: string;
  car_id: string;
  brand: string | null;
  model: string | null;
  author_label: string | null;
  overall_rating: number;
  range_rating: number | null;
  comfort_rating: number | null;
  value_rating: number | null;
  title: string;
  description: string;
  pros: string[] | null;
  cons: string[] | null;
  usage_type: string | null;
  ownership_months: number | null;
  created_at: string;
};

const REVIEW_COLUMNS =
  "id, car_id, brand, model, author_label, overall_rating, range_rating, comfort_rating, value_rating, title, description, pros, cons, usage_type, ownership_months, created_at";

// ─── Mapping helpers ──────────────────────────────────────────────────────────

function mapRow(row: RawReviewRow): Review {
  return {
    id: row.id,
    carId: row.car_id,
    brand: row.brand ?? null,
    model: row.model ?? null,
    authorLabel: row.author_label ?? "EV Owner",
    overallRating: row.overall_rating,
    rangeRating: row.range_rating ?? null,
    comfortRating: row.comfort_rating ?? null,
    valueRating: row.value_rating ?? null,
    title: row.title,
    description: row.description,
    pros: row.pros ?? [],
    cons: row.cons ?? [],
    usageType: row.usage_type ?? null,
    ownershipMonths: row.ownership_months ?? null,
    createdAt: row.created_at,
  };
}

/**
 * Converts a structured `Review` (DB-backed) to the `EVReview` shape used
 * by existing UI components (`EVReviewCard`, `EVReviewSummary`, `EVReviewsSection`).
 */
export function reviewToEVReview(review: Review): EVReview {
  return {
    id: review.id,
    author: review.authorLabel,
    rating: review.overallRating,
    title: review.title,
    comment: review.description,
    ownershipMonths: review.ownershipMonths ?? 0,
    useCase: review.usageType ?? "EV ownership",
  };
}

// ─── Data fetchers ────────────────────────────────────────────────────────────

/**
 * Fetches approved reviews for a car from the dedicated `reviews` table.
 *
 * Lookup strategy:
 * 1. Match by exact `car_id` slug (e.g. `"byd-atto-3"`).
 * 2. If no results, fall back to case-insensitive brand + model text match.
 *    (brand/model values come from trusted static evModels data — no injection risk.)
 *
 * Returns an empty array on DB error so the caller can fall back to static data.
 */
export async function getApprovedReviewsForCar(
  carId: string,
  brand: string,
  model: string,
  limit = 6
): Promise<Review[]> {
  const supabase = await createClient();

  // Primary lookup: exact car_id slug
  const { data: byId, error: errById } = await supabase
    .from("reviews")
    .select(REVIEW_COLUMNS)
    .eq("is_approved", true)
    .eq("car_id", carId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (errById) {
    console.error("[reviews] Error fetching by car_id:", errById.message);
  }

  if (byId && byId.length > 0) {
    return (byId as RawReviewRow[]).map(mapRow);
  }

  // Fallback lookup: brand + model text match
  const { data: byModel, error: errByModel } = await supabase
    .from("reviews")
    .select(REVIEW_COLUMNS)
    .eq("is_approved", true)
    .ilike("brand", `%${brand}%`)
    .ilike("model", `%${model}%`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (errByModel) {
    console.error("[reviews] Error fetching by brand/model:", errByModel.message);
  }

  return (byModel as RawReviewRow[] | null)?.map(mapRow) ?? [];
}

export async function getLatestApprovedReviews(limit = 6): Promise<Review[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select(REVIEW_COLUMNS)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    if (error) {
      console.error("[reviews] Error fetching latest approved reviews:", error.message);
    }
    return [];
  }

  return (data as RawReviewRow[]).map(mapRow);
}
