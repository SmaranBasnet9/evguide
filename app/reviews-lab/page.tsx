import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EVReviewsSection from "@/components/EVReviewsSection";
import { getReviewsForModel } from "@/data/evReviews";
import { evModels } from "@/data/evModels";

export default function ReviewsLabPage() {
  const model = evModels.find((item) => item.id === "tesla-model-3") ?? evModels[0];
  const reviews = getReviewsForModel(model.id);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <p className="text-sm font-semibold text-blue-600">Component Test</p>
          <h1 className="mt-2 text-4xl font-bold">EV Review Components Lab</h1>
          <p className="mt-3 text-slate-600">Standalone page to test review cards and summary before integration.</p>
        </div>
      </section>

      <EVReviewsSection modelName={`${model.brand} ${model.model}`} reviews={reviews} />
      <Footer />
    </main>
  );
}
