import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";
import VehicleDiscovery from "@/components/vehicles/VehicleDiscovery";
import { getAllEVs } from "@/lib/evs";
import {
  buildPersonalizedVehicleCards,
  getVehicleListingContext,
} from "@/lib/vehicles/personalized-listing";
import { evModels } from "@/data/evModels";

export const metadata = {
  title: "Vehicles | Find the Best EV for Your Budget",
  description:
    "Explore EVs with clearer deal signals, monthly cost estimates, and fit guidance designed for UK buyers.",
};

export default async function VehiclesPage() {
  const dbVehicles = await getAllEVs();
  const vehicles = dbVehicles.length > 0 ? dbVehicles : evModels;
  const listingContext = await getVehicleListingContext(vehicles);
  const personalizedVehicles = buildPersonalizedVehicleCards(vehicles, listingContext);

  return (
    <main className="min-h-screen bg-[#0B0B0B]">
      <PremiumNavbar />
      <div className="pt-24 pb-20">
        <VehicleDiscovery
          vehicles={personalizedVehicles}
          segment={listingContext.segment}
        />
      </div>
      <PremiumFooter />
    </main>
  );
}
