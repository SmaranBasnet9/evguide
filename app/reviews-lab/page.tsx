import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import EVReviewsSection from "@/components/EVReviewsSection";
import { getReviewsForModel } from "@/data/evReviews";
import { evModels } from "@/data/evModels";

export default function ReviewsLabPage() {
  const model = evModels.find((item) => item.id === "tesla-model-3") ?? evModels[0];
  const reviews = getReviewsForModel(model.id);

  return (
    <main className="min-h-screen bg-surface-base text-white">
      <PremiumNavbar />
      <section className="border-b border-white/8 pt-24">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <p className="text-sm font-semibold text-brand">Component Test</p>
          <h1 className="mt-2 text-4xl font-bold text-white">EV Review Components Lab</h1>
          <p className="mt-3 text-white/60">Standalone page to test review cards and summary before integration.</p>
        </div>
      </section>

      <EVReviewsSection modelName={`${model.brand} ${model.model}`} reviews={reviews} />
      <PremiumFooter />
    </main>
  );
}
