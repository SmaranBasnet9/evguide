import { Suspense } from "react";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import HeroSection from "@/components/home/HeroSection";
import BrowseByBudget from "@/components/home/BrowseByBudget";
import FeaturedEVs from "@/components/home/FeaturedEVs";
import dynamic from "next/dynamic";

const UsedEVsSection    = dynamic(() => import("@/components/home/UsedEVsSection"));
const NewsletterSection = dynamic(() => import("@/components/home/NewsletterSection"));
const FinalCTA          = dynamic(() => import("@/components/home/FinalCTA"));
const PremiumFooter     = dynamic(() => import("@/components/home/PremiumFooter"));

import Testimonials from "@/components/home/Testimonials";
import { getTopSellingEVs } from "@/lib/evs";
import { createAdminClient } from "@/lib/supabase/admin";
import { mapDealerListingToUsedEV } from "@/lib/dealer/mapToUsedEVListing";

export const revalidate = 1800;

// ── Server data fetchers ────────────────────────────────────────────────────

async function HomeFeaturedEVsSection() {
  const evModels = await getTopSellingEVs();
  return <FeaturedEVs models={evModels} />;
}

// Live "used" dealer stock is folded into the Used EVs section below —
// no separate "dealer marketplace" branding on the homepage.
async function fetchLiveUsedDealerListings() {
  try {
    const supabase = createAdminClient();
    const { data: listings } = await supabase
      .from("dealer_listings")
      .select("id, brand, model, year, price, mileage, colour, description, images, range_km, battery_kwh, dc_charge_kw")
      .eq("status", "live")
      .eq("condition", "used")
      .order("created_at", { ascending: false })
      .limit(6);
    return (listings ?? []).filter((l) => l.images && l.images.length > 0);
  } catch {
    return [];
  }
}

async function HomeUsedEVsSection() {
  const listings = await fetchLiveUsedDealerListings();
  return <UsedEVsSection extraListings={listings.map(mapDealerListingToUsedEV)} />;
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
      <HeroSection />

      {/* 3 · Browse by Budget — Carwow-style horizontal budget cards */}
      <BrowseByBudget />

      {/* 4 · Featured EVs — "Electric is trending" deal cards */}
      <Suspense fallback={<CardsSkeleton />}>
        <HomeFeaturedEVsSection />
      </Suspense>

      {/* 6 · Used EVs — hover-reveal portrait cards (incl. live dealer stock) */}
      <Suspense fallback={null}>
        <HomeUsedEVsSection />
      </Suspense>

      {/* 8 · User Reviews — horizontal scroll with avatars */}
      <Testimonials />

      {/* 9 · Newsletter — email signup */}
      <NewsletterSection />

      {/* 11 · Final CTA — emotional close */}
      <FinalCTA />

      <PremiumFooter />
    </main>
  );
}
