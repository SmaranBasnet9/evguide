import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import VerifiedOwnerReviewsSection from "@/components/VerifiedOwnerReviewsSection";
import ApprovedFeedbackStories from "@/components/ApprovedFeedbackStories";
import { getApprovedReviewsForCar, getLatestApprovedReviews } from "@/lib/reviews";
import { getApprovedFeedbackStories, getApprovedFeedbackStoriesForModel } from "@/lib/feedback";
import { createPublicServerClient } from "@/lib/supabase/public-server";
import { evModels } from "@/data/evModels";

export const metadata = {
  title: "EV Reviews - Real Owner Stories | EV Guide",
  description:
    "Read verified EV owner reviews and real-world feedback from drivers across the UK.",
};

type ReviewsPageProps = {
  searchParams: Promise<{
    car?: string;
  }>;
};

type VehicleForReviews = {
  id: string;
  brand: string;
  model: string;
};

async function getVehicleForReviews(id: string): Promise<VehicleForReviews | null> {
  const staticModel = evModels.find((item) => item.id === id);
  if (staticModel) {
    return { id: staticModel.id, brand: staticModel.brand, model: staticModel.model };
  }

  const supabase = createPublicServerClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("ev_models")
    .select("id, brand, model")
    .eq("id", id)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    brand: data.brand,
    model: data.model,
  };
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const { car } = await searchParams;
  const selectedVehicle = car ? await getVehicleForReviews(car) : null;

  const [latestReviews, allStories] = await Promise.all([
    getLatestApprovedReviews(30),
    getApprovedFeedbackStories(18),
  ]);

  let reviews = latestReviews.slice(0, 12);
  let stories = allStories.slice(0, 9);
  let relatedReviews = latestReviews.slice(12, 20);

  if (selectedVehicle) {
    const [selectedReviews, selectedStories] = await Promise.all([
      getApprovedReviewsForCar(selectedVehicle.id, selectedVehicle.brand, selectedVehicle.model, 24),
      getApprovedFeedbackStoriesForModel(selectedVehicle.brand, selectedVehicle.model, 12),
    ]);

    reviews = selectedReviews.length > 0 ? selectedReviews : latestReviews.slice(0, 12);
    stories = selectedStories.length > 0 ? selectedStories : allStories.slice(0, 9);
    relatedReviews = latestReviews
      .filter((review) => review.carId !== selectedVehicle.id)
      .filter((review) => {
        const brand = (review.brand ?? "").toLowerCase();
        return brand === selectedVehicle.brand.toLowerCase();
      })
      .slice(0, 8);

    if (relatedReviews.length === 0) {
      relatedReviews = latestReviews
        .filter((review) => review.carId !== selectedVehicle.id)
        .slice(0, 8);
    }
  }

  const modelList = evModels.map(({ id, brand, model }) => ({ id, brand, model }));

  return (
    <main className="min-h-screen bg-surface-base text-white">
      <PremiumNavbar />

      {/* Hero */}
      <section className="border-b border-white/8 pt-24">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-sm font-semibold text-brand">EV Guide Reviews</p>
          <h1 className="mt-2 text-4xl font-bold text-white">
            {selectedVehicle
              ? `${selectedVehicle.brand} ${selectedVehicle.model} reviews`
              : "Real stories from real EV owners"}
          </h1>
          <p className="mt-4 max-w-2xl text-white/60">
            {selectedVehicle
              ? "Read complete owner reviews for this vehicle, then explore related owner feedback to compare real-world experiences."
              : "Verified reviews and honest experiences from drivers who made the switch to electric. No advertising, no bias - just real-world insight."}
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
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4"
              >
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="mt-0.5 text-sm text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified DB reviews */}
      <VerifiedOwnerReviewsSection reviews={reviews} />

      {selectedVehicle ? (
        <section className="border-t border-white/8">
          <div className="mx-auto max-w-7xl px-6 py-14">
            <p className="text-sm font-semibold text-brand">Related Reviews</p>
            <h2 className="mt-2 text-3xl font-bold text-white">
              More owner experiences you may like
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Similar EV feedback to help you compare before making a decision.
            </p>
            <VerifiedOwnerReviewsSection reviews={relatedReviews} />
          </div>
        </section>
      ) : null}

      {/* Approved feedback stories + write-your-own */}
      <section className="border-t border-white/8">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <p className="text-sm font-semibold text-brand">Owner Experiences</p>
          <h2 className="mt-2 text-3xl font-bold text-white">
            What EV owners are saying
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Anonymized feedback submitted by verified EV users.
          </p>
          <ApprovedFeedbackStories stories={stories} models={modelList} />
        </div>
      </section>

      {/* CTA banner */}
      <section className="border-t border-white/8">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <h2 className="text-2xl font-bold text-white">
            Not sure which EV is right for you?
          </h2>
          <p className="mt-3 text-white/60">
            Use the&nbsp;
            <span className="font-semibold text-brand">Book Appointment</span>
            &nbsp;button in the bottom-right corner to speak to one of our EV experts - completely free.
          </p>
        </div>
      </section>

      <PremiumFooter />
    </main>
  );
}

