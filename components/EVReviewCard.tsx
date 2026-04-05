import type { EVReview } from "@/data/evReviews";

type Props = {
  review: EVReview;
};

function toStars(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export default function EVReviewCard({ review }: Props) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">{review.author}</p>
          <p className="mt-1 text-xs text-slate-500">{review.ownershipMonths} months ownership</p>
        </div>
        <p className="text-sm font-semibold text-amber-600">{toStars(review.rating)}</p>
      </div>

      <h4 className="mt-4 text-lg font-bold text-slate-900">{review.title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-700">{review.comment}</p>

      <div className="mt-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
        {review.useCase}
      </div>
    </article>
  );
}
