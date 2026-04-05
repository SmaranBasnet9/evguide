import Link from "next/link";
import type { Review } from "@/lib/reviews";

type Props = {
  reviews: Review[];
};

function renderStars(rating: number) {
  return "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);
}

export default function VerifiedOwnerReviewsSection({ reviews }: Props) {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">Verified Owner Reviews</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">What real EV owners are saying</h2>
            <p className="mt-2 text-sm text-slate-600">Approved reviews submitted by verified users.</p>
          </div>

          <Link href="/appointment" className="text-sm font-semibold text-blue-600 hover:underline">
            View all reviews →
          </Link>
        </div>

        {reviews.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            No approved owner reviews yet.
          </div>
        ) : (
          <div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
            {reviews.map((review) => (
              <article key={review.id} className="w-[320px] shrink-0 snap-start rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-900">{review.authorLabel}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {review.brand ?? "EV"} {review.model ?? "Owner"}
                </p>
                <p className="mt-3 text-sm font-semibold text-amber-600">{renderStars(review.overallRating)}</p>
                <h3 className="mt-3 text-base font-bold text-slate-900">{review.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{review.description}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
