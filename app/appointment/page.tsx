import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VerifiedOwnerReviewsSection from "@/components/VerifiedOwnerReviewsSection";
import ApprovedFeedbackStories from "@/components/ApprovedFeedbackStories";
import { getLatestApprovedReviews } from "@/lib/reviews";
import { getApprovedFeedbackStories } from "@/lib/feedback";
import { evModels } from "@/data/evModels";

export const metadata = {
  title: "EV Reviews - Real Owner Stories | EV Guide",
  description:
    "Read verified EV owner reviews and real-world feedback from drivers across the UK.",
};

export default async function ReviewsPage() {
  const [reviews, stories] = await Promise.all([
    getLatestApprovedReviews(12),
    getApprovedFeedbackStories(9),
  ]);

  const modelList = evModels.map(({ id, brand, model }) => ({ id, brand, model }));

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-sm font-semibold text-blue-600">EV Guide Reviews</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Real stories from real EV owners
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            Verified reviews and honest experiences from drivers who made the switch
            to electric. No advertising, no bias - just real-world insight.
          </p>

          {/* Stats strip */}
          <div className="mt-10 flex flex-wrap gap-6">
            {[
              { label: "Verified Reviews", value: reviews.length > 0 ? `${reviews.length}+` : "Growing" },
              { label: "Owner Stories", value: stories.length > 0 ? `${stories.length}+` : "Growing" },
              { label: "EV Models Covered", value: `${modelList.length}+` },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4"
              >
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="mt-0.5 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified DB reviews */}
      <VerifiedOwnerReviewsSection reviews={reviews} />

      {/* Approved feedback stories + write-your-own */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <p className="text-sm font-semibold text-blue-600">Owner Experiences</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            What EV owners are saying
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Anonymized feedback submitted by verified EV users.
          </p>
          <ApprovedFeedbackStories stories={stories} models={modelList} />
        </div>
      </section>

      {/* CTA banner */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Not sure which EV is right for you?
          </h2>
          <p className="mt-3 text-slate-600">
            Use the&nbsp;
            <span className="font-semibold text-blue-600">Book Appointment</span>
            &nbsp;button in the bottom-right corner to speak to one of our EV experts - completely free.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

