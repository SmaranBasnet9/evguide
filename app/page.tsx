import { Suspense } from "react";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import HeroSection from "@/components/home/HeroSection";
import HeroFeaturedCard, {
  HeroFeaturedCardSkeleton,
} from "@/components/home/HeroFeaturedCard";
import BrowseByBudget from "@/components/home/BrowseByBudget";
import FeaturedEVs from "@/components/home/FeaturedEVs";
import dynamic from "next/dynamic";

const UsedEVsSection           = dynamic(() => import("@/components/home/UsedEVsSection"));
const DealerMarketplacePreview = dynamic(() => import("@/components/home/DealerMarketplacePreview"));
const NewsletterSection        = dynamic(() => import("@/components/home/NewsletterSection"));
const FinalCTA                 = dynamic(() => import("@/components/home/FinalCTA"));
const PremiumFooter            = dynamic(() => import("@/components/home/PremiumFooter"));

import EVAccessories from "@/components/home/EVAccessories";
import { getTopSellingEVs } from "@/lib/evs";
import { getAllAccessoriesWithProducts } from "@/lib/accessories";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 1800;

// ── Server data fetchers ────────────────────────────────────────────────────

async function HomeHeroFeaturedCard() {
  const evModels = await getTopSellingEVs();
  return <HeroFeaturedCard model={evModels[0] ?? null} />;
}

async function HomeFeaturedEVsSection() {
  const evModels = await getTopSellingEVs();
  return <FeaturedEVs models={evModels} />;
}

async function HomeDealerPreviewSection() {
  try {
    const supabase = createAdminClient();
    const { data: listings } = await supabase
      .from("dealer_listings")
      .select("id, brand, model, year, price, mileage, images, location")
      .eq("status", "live")
      .order("created_at", { ascending: false })
      .limit(6);
    if (!listings || listings.length === 0) return null;
    return <DealerMarketplacePreview listings={listings} />;
  } catch {
    return null;
  }
}

async function HomeAccessoriesSection() {
  const data = await getAllAccessoriesWithProducts();
  return <EVAccessories data={data} />;
}

// ── Skeleton ────────────────────────────────────────────────────────────────

function CardsSkeleton() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-4 w-24 animate-pulse rounded-full bg-gray-200" />
        <div className="mt-3 h-8 max-w-xs animate-pulse rounded-xl bg-gray-100" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[380px] animate-pulse rounded-[1.75rem] bg-gray-100" />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white font-sans text-gray-900 selection:bg-brand/20">
      <PremiumNavbar />

      {/* 1 · Hero — full-screen search */}
      <HeroSection
        featuredCard={
          <Suspense fallback={<HeroFeaturedCardSkeleton />}>
            <HomeHeroFeaturedCard />
          </Suspense>
        }
      />

      {/* 3 · Browse by Budget — Carwow-style horizontal budget cards */}
      <BrowseByBudget />

      {/* 4 · Featured EVs — "Electric is trending" deal cards */}
      <Suspense fallback={<CardsSkeleton />}>
        <HomeFeaturedEVsSection />
      </Suspense>

      {/* 6 · Used EVs — hover-reveal portrait cards */}
      <UsedEVsSection />

      {/* 7 · Dealer Marketplace — live verified dealer stock */}
      <Suspense fallback={null}>
        <HomeDealerPreviewSection />
      </Suspense>

      {/* 8 · EV & Hybrid Accessories */}
      <Suspense fallback={null}>
        <HomeAccessoriesSection />
      </Suspense>

      {/* 9 · Newsletter — email signup */}
      <NewsletterSection />

      {/* 11 · Final CTA — emotional close */}
      <FinalCTA />

      <PremiumFooter />
    </main>
  );
}
