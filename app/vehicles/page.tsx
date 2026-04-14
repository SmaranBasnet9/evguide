import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import VehicleDiscovery from "@/components/vehicles/VehicleDiscovery";
import { getAllEVs } from "@/lib/evs";
import {
  buildPersonalizedVehicleCards,
  type VehicleListingContext,
} from "@/lib/vehicles/personalized-listing";
import { evModels } from "@/data/evModels";
import type { EVModel } from "@/types";

export const metadata = {
  title: "Vehicles | Find the Best EV for Your Budget",
  description:
    "Explore EVs with clearer deal signals, monthly cost estimates, and fit guidance designed for UK buyers.",
};

const defaultListingContext: VehicleListingContext = {
  segment: "casual",
  preferredTier: "affordable",
  financeFocused: false,
  compareClicks: 0,
  emiUsageCount: 0,
  viewCount: 0,
};

async function getVehiclesForListing(): Promise<EVModel[]> {
  const dbVehicles = await Promise.race<EVModel[]>([
    getAllEVs(),
    new Promise<EVModel[]>((resolve) => {
      setTimeout(() => resolve([]), 1500);
    }),
  ]);

  return dbVehicles.length > 0 ? dbVehicles : evModels;
}

export default async function VehiclesPage() {
  const vehicles = await getVehiclesForListing();
  // Skip server-side personalization so the page can render faster and more reliably.
  const personalizedVehicles = buildPersonalizedVehicleCards(vehicles, defaultListingContext);

  return (
    <main className="min-h-screen bg-[#F8FAF9]">
      <PremiumNavbar />
      <div className="pt-24 pb-20">
        <VehicleDiscovery
          vehicles={personalizedVehicles}
          segment={defaultListingContext.segment}
        />
      </div>
      <PremiumFooter />
    </main>
  );
}
