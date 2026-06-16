import type { Metadata } from "next";
import Link from "next/link";
import { Battery, Shield, CheckCircle, Zap, Plus } from "lucide-react";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import UsedEVsClientWrapper from "@/components/used-evs/UsedEVsClientWrapper";
import { usedEvListings, type UsedEVListing } from "@/data/usedEvListings";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Used EVs for Sale UK — Battery Health Verified | EVGuide",
  description: "Buy used electric cars with battery health reports, real-world range data, and ULEZ status. Data AutoTrader doesn't show.",
};


async function getListings(): Promise<UsedEVListing[]> {
  return usedEvListings.filter((l) => l.status === "active");
}

type DealerListing = {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  colour?: string | null;
  images?: string[];
  range_km?: number | null;
  battery_kwh?: number | null;
  location?: string | null;
  body_type?: string | null;
  dealer_id: string;
};

async function getDealerListings(): Promise<DealerListing[]> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("dealer_listings")
      .select("id, brand, model, year, price, mileage, colour, images, range_km, battery_kwh, location, body_type, dealer_id")
      .eq("status", "live")
      .eq("condition", "used")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

async function getDealerNames(dealerIds: string[]): Promise<Record<string, string>> {
  if (dealerIds.length === 0) return {};
  const admin = createAdminClient();
  const { data } = await admin
    .from("dealer_profiles")
    .select("id, company_name, city")
    .in("id", dealerIds);
  return Object.fromEntries((data ?? []).map((d) => [d.id, `${d.company_name} · ${d.city}`]));
}

export default async function UsedEVsPage() {
  const [listings, dealerListings] = await Promise.all([getListings(), getDealerListings()]);
  const dealerNameMap = await getDealerNames([...new Set(dealerListings.map((l) => l.dealer_id))]);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <PremiumNavbar />

      <div className="mx-auto max-w-6xl px-4 pt-24 pb-20">

        {/* Hero */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Used EVs</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Battery health verified<br className="sm:hidden" /> used electric cars</h1>
              <p className="mt-2 text-sm text-gray-500">
                Every listing shows battery SOH%, real-world range, ULEZ status and charging spec.<br className="hidden sm:block" />
                Data AutoTrader and Carwow don&apos;t show.
              </p>
            </div>
            <Link
              href="/used-evs/sell"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover shrink-0"
            >
              <Plus className="h-4 w-4" />
              List your EV
            </Link>
          </div>
        </div>

        {/* EV advantage strip */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Battery,     label: "Battery health %",  sub: "State of health on every listing" },
            { icon: Shield,      label: "ULEZ verified",     sub: "Confirmed compliant status" },
            { icon: Zap,         label: "Real-world range",  sub: "Not WLTP — actual UK miles" },
            { icon: CheckCircle, label: "Service history",   sub: "Full or partial, clearly marked" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <Icon className="mb-2 h-4 w-4 text-brand" />
              <p className="text-xs font-semibold text-gray-900">{label}</p>
              <p className="mt-0.5 text-[11px] text-gray-400">{sub}</p>
            </div>
          ))}
        </div>

        {/* Client-side search, filter, sort + all listings */}
        <UsedEVsClientWrapper
          listings={listings}
          dealerListings={dealerListings}
          dealerNameMap={dealerNameMap}
        />

      </div>

      <PremiumFooter />
    </main>
  );
}
