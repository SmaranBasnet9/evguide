import type { Metadata } from "next";
import PremiumFooter from "@/components/home/PremiumFooter";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import RecommendationForm from "@/components/recommendation/RecommendationForm";

export const metadata: Metadata = {
  title: "AI Match | EV Guide",
  description:
    "Answer a few guided questions and get a calm, confidence-building EV shortlist with match score, monthly cost, and clear reasons why each model fits.",
};

export default function RecommendPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#07090B] text-zinc-100">
      <PremiumNavbar />
      <RecommendationForm />
      <PremiumFooter />
    </main>
  );
}
