import PremiumNavbar from "@/components/home/PremiumNavbar";
import HeroSection from "@/components/home/HeroSection";
import TrustStrip from "@/components/home/TrustStrip";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedEVs from "@/components/home/FeaturedEVs";
import AIRecommendation from "@/components/home/AIRecommendation";
import FinancePreview from "@/components/home/FinancePreview";
import Testimonials from "@/components/home/Testimonials";
import BlogPreview from "@/components/home/BlogPreview";
import FinalCTA from "@/components/home/FinalCTA";
import PremiumFooter from "@/components/home/PremiumFooter";

import { getTopSellingEVs } from "@/lib/evs";
import { getFeaturedBlogPosts } from "@/lib/blog";

export default async function HomePage() {
  const [featuredPosts, evModels] = await Promise.all([
    getFeaturedBlogPosts(3),
    getTopSellingEVs(),
  ]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0B0B0B] font-sans text-zinc-100 selection:bg-emerald-500/30">
      <PremiumNavbar />
      <HeroSection models={evModels.slice(0, 3)} />
      <TrustStrip />
      <HowItWorks />
      <FeaturedEVs models={evModels} />
      <AIRecommendation />
      <FinancePreview />
      <Testimonials />
      <BlogPreview posts={featuredPosts} />
      <FinalCTA />
      <PremiumFooter />
    </main>
  );
}
