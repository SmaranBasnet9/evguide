import type { EVReview } from "@/data/evReviews";
import EVReviewCard from "@/components/EVReviewCard";
import EVReviewSummary from "@/components/EVReviewSummary";

type Props = {
  modelName: string;
  reviews: EVReview[];
};

export default function EVReviewsSection({ modelName, reviews }: Props) {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">Owner Feedback</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">{modelName} reviews</h2>
            <p className="mt-2 text-sm text-slate-600">Real-world impressions from daily EV ownership.</p>
          </div>

          <div className="w-full max-w-xs">
            <EVReviewSummary reviews={reviews} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <EVReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
