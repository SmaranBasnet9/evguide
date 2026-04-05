import type { ApprovedFeedbackStory } from "@/lib/feedback";
import type { Review } from "@/lib/reviews";
import ApprovedFeedbackStories from "@/components/ApprovedFeedbackStories";
import Link from "next/link";

const stories = [
  {
    title: "Why drivers switch to EVs",
    text: "Owners often mention lower running costs, silent driving, easier city commuting, and less maintenance.",
  },
  {
    title: "What people love most",
    text: "Fast charging, instant torque, smart tech, and lower daily fuel spending are the most common reasons.",
  },
  {
    title: "Real buyer mindset",
    text: "Most buyers compare range, affordability, charging speed, and long-term reliability before choosing a model.",
  },
];

type Props = {
  feedbackStories: ApprovedFeedbackStory[];
  models: Array<{
    id: string;
    brand: string;
    model: string;
  }>;
  verifiedReviews?: Review[];
};

function renderStars(rating: number) {
  return "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);
}

export default function StoriesSection({ feedbackStories, models, verifiedReviews = [] }: Props) {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <p className="text-sm font-semibold text-blue-600">Feedback & Stories</p>
        <h2 className="mt-2 text-3xl font-bold">
          Why EVs are winning people over
        </h2>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {stories.slice(0, 2).map((story) => (
            <div
              key={story.title}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
            >
              <h3 className="text-lg font-semibold">{story.title}</h3>
              <p className="mt-3 text-sm text-slate-600">{story.text}</p>
              <Link href="/blog" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">
                Read more →
              </Link>
            </div>
          ))}
        </div>

        {verifiedReviews.length > 0 && (
          <div className="mt-12">
            <p className="text-sm font-semibold text-blue-600">Verified Owner Reviews</p>
            <h3 className="mt-1 text-2xl font-bold text-slate-900">What real EV owners are saying</h3>
            <p className="mt-1 text-sm text-slate-600">Approved reviews submitted by verified users.</p>
            <div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
              {verifiedReviews.map((review) => (
                <article key={review.id} className="w-[320px] shrink-0 snap-start rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-sm font-semibold text-slate-900">{review.authorLabel}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {review.brand ?? "EV"} {review.model ?? "Owner"}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-amber-600">{renderStars(review.overallRating)}</p>
                  <h4 className="mt-3 text-base font-bold text-slate-900">{review.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{review.description}</p>
                </article>
              ))}
            </div>
          </div>
        )}

        <ApprovedFeedbackStories stories={feedbackStories} models={models} />
      </div>
    </section>
  );
}
