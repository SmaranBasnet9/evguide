import type { EVReview } from "@/data/evReviews";

type Props = {
  reviews: EVReview[];
};

function toStars(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export default function EVReviewSummary({ reviews }: Props) {
  const count = reviews.length;
  const average = count > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / count
    : 0;

  const rounded = Math.round(average * 10) / 10;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Owner rating</p>
      <p className="mt-2 text-4xl font-bold text-slate-900">{rounded.toFixed(1)}</p>
      <p className="mt-1 text-amber-600">{toStars(Math.round(average || 0))}</p>
      <p className="mt-2 text-sm text-slate-600">Based on {count} user review{count === 1 ? "" : "s"}.</p>
    </div>
  );
}
