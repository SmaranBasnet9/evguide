import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedVehicles.map((vehicle) => (
              <article
                key={vehicle.id}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <Link href={`/cars/${vehicle.id}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image
                      src={vehicle.heroImage}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      fill
                      unoptimized
                      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-800">
                      {vehicle.rangeKm} km range
                    </span>
                  </div>
                </Link>

                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    {vehicle.brand}
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-slate-900">{vehicle.model}</h2>
                  <p className="mt-1 text-xl font-bold text-slate-900">£{vehicle.price.toLocaleString()}</p>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="rounded-xl bg-slate-50 px-2 py-2">
                      Battery: <span className="font-semibold text-slate-900">{vehicle.batteryKWh} kWh</span>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-2 py-2">
                      Power: <span className="font-semibold text-slate-900">{vehicle.motorCapacityKw} kW</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/cars/${vehicle.id}`}
                      className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                    >
                      View
                    </Link>
                    <Link
                      href={`/finance?car=${vehicle.id}`}
                      className="flex-1 rounded-xl bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Finance
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
