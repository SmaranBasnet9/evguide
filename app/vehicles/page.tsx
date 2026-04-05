import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AllVehiclesGrid from "@/components/AllVehiclesGrid";
import { getAllEVs } from "@/lib/evs";
import { evModels } from "@/data/evModels";

export const metadata = {
  title: "All Vehicles | EV Guide",
  description: "Browse all electric vehicles in one place.",
};

export default async function VehiclesPage() {
  const dbVehicles = await getAllEVs();
  const vehicles = dbVehicles.length > 0 ? dbVehicles : evModels;

  const sortedVehicles = [...vehicles].sort((a, b) => a.price - b.price);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <p className="text-sm font-semibold text-blue-600">All EV Inventory</p>
          <h1 className="mt-2 text-4xl font-bold">Shop Electric Vehicles</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Browse every EV model, compare prices and range, and jump into detailed specs before
            making your shortlist.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-600">{sortedVehicles.length} vehicles available</p>
            <Link
              href="/compare"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Compare Vehicles
            </Link>
          </div>

          <AllVehiclesGrid vehicles={sortedVehicles} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
