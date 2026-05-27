import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import VehicleDiscovery from "@/components/vehicles/VehicleDiscovery";
import { getAllEVs } from "@/lib/evs";
import {
  buildPersonalizedVehicleCards,
  type VehicleListingContext,
} from "@/lib/vehicles/personalized-listing";
import { evModels } from "@/data/evModels";
import type { AllVehiclesFilters, EVModel } from "@/types";
import { defaultFilters } from "@/lib/vehicles/filter";

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
    new Promise<EVModel[]>((resolve) => setTimeout(() => resolve([]), 1500)),
  ]);
  return dbVehicles.length > 0 ? dbVehicles : evModels;
}

function paramsToFilters(
  params: Record<string, string | string[] | undefined>,
): Partial<AllVehiclesFilters> {
  const f: Partial<AllVehiclesFilters> = {};
  const str = (k: string) => {
    const v = params[k];
    return typeof v === "string" ? v : undefined;
  };

  const q = str("q");
  if (q) f.search = q;

  const maxPrice = str("maxPrice");
  if (maxPrice) f.budgetMax = parseInt(maxPrice, 10);

  const minPrice = str("minPrice");
  if (minPrice) f.budgetMin = parseInt(minPrice, 10);

  const bodyType = str("bodyType");
  if (bodyType) f.bodyType = bodyType;

  const brand = str("brand");
  if (brand) f.brand = brand;

  const rangeMin = str("rangeMin");
  if (rangeMin) f.rangeMin = parseInt(rangeMin, 10);

  const dcMin = str("chargingSpeedDcMin");
  if (dcMin) f.chargingSpeedDcMin = parseInt(dcMin, 10);

  const sort = str("sort");
  const validSorts = ["recommended","price_low","price_high","range","newest","best_value"] as const;
  if (sort && (validSorts as readonly string[]).includes(sort)) {
    f.sort = sort as AllVehiclesFilters["sort"];
  }

  return f;
}

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const vehicles = await getVehiclesForListing();
  const personalizedVehicles = buildPersonalizedVehicleCards(vehicles, defaultListingContext);
  const initialFilters: AllVehiclesFilters = {
    ...defaultFilters(),
    ...paramsToFilters(params),
  };

  return (
    <main className="min-h-screen bg-white">
      <PremiumNavbar />
      <div className="pt-24 pb-20">
        <VehicleDiscovery
          vehicles={personalizedVehicles}
          segment={defaultListingContext.segment}
          initialFilters={initialFilters}
        />
      </div>
      <PremiumFooter />
    </main>
  );
}
