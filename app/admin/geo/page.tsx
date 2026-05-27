import Link from "next/link";
import { getAllGeoRegions } from "@/lib/geo";
import AdminGeoDeleteButton from "../../../components/AdminGeoDeleteButton";

const typeColors: Record<string, string> = {
  city: "bg-blue-50 text-blue-700",
  county: "bg-purple-50 text-purple-700",
  region: "bg-amber-50 text-amber-700",
  country: "bg-green-50 text-green-700",
};

export default async function AdminGeoPage() {
  const regions = await getAllGeoRegions();

  const byType = regions.reduce<Record<string, number>>(
    (acc, region) => ({ ...acc, [region.region_type]: (acc[region.region_type] ?? 0) + 1 }),
    {},
  );

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">GEO Management</h1>
          <p className="mt-1 text-white/50">
            {regions.length} region{regions.length !== 1 ? "s" : ""} configured
          </p>
        </div>
        <Link
          href="/admin/geo/new"
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Add Region
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {(["city", "county", "region", "country"] as const).map((type) => (
          <div key={type} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-sm">
            <p className="text-2xl font-bold text-white">{byType[type] ?? 0}</p>
            <p className="mt-0.5 text-sm capitalize text-white/50">
              {type === "city"
                ? "Cities"
                : type === "county"
                  ? "Counties"
                  : type === "region"
                    ? "Regions"
                    : "Countries"}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        {regions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] py-20 text-center">
            <p className="text-white/50">No geographic regions configured yet.</p>
            <Link
              href="/admin/geo/new"
              className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Add your first region
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.03] text-left">
                  <th className="px-6 py-3 font-semibold text-white/60">Order</th>
                  <th className="px-6 py-3 font-semibold text-white/60">Name</th>
                  <th className="px-6 py-3 font-semibold text-white/60">Slug</th>
                  <th className="px-6 py-3 font-semibold text-white/60">Type</th>
                  <th className="px-6 py-3 font-semibold text-white/60">Country</th>
                  <th className="px-6 py-3 font-semibold text-white/60">Coordinates</th>
                  <th className="px-6 py-3 font-semibold text-white/60">Status</th>
                  <th className="px-6 py-3 font-semibold text-white/60"></th>
                </tr>
              </thead>
              <tbody>
                {regions.map((region) => (
                  <tr
                    key={region.id}
                    className="border-b border-white/[0.06] last:border-b-0 hover:bg-white/[0.03]"
                  >
                    <td className="px-6 py-4 text-center text-white/50">{region.sort_order}</td>
                    <td className="px-6 py-4 font-medium text-white">{region.name}</td>
                    <td className="px-6 py-4">
                      <code className="rounded bg-white/[0.05] px-2 py-0.5 text-xs font-mono text-white/80">
                        {region.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${typeColors[region.region_type] ?? "bg-white/[0.05] text-white/60"}`}
                      >
                        {region.region_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/60">{region.country}</td>
                    <td className="px-6 py-4 text-xs text-white/50">
                      {region.lat != null && region.lng != null
                        ? `${region.lat}, ${region.lng}`
                        : <span className="text-white/30">-</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          region.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-white/[0.05] text-white/50"
                        }`}
                      >
                        {region.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/geo/${region.id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </Link>
                        <AdminGeoDeleteButton id={region.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-5">
        <h2 className="text-sm font-semibold text-green-900">How GEO regions work</h2>
        <p className="mt-1 text-sm text-green-700">
          Geographic regions are used for dealer targeting, location-based EV availability, and
          personalised landing pages. Each region has a unique slug used in URLs like
          <code className="mx-1 rounded bg-green-100 px-1 font-mono text-xs">/evs/greater-london</code>.
          Coordinates are used for distance calculations and map pins.
        </p>
      </div>
    </div>
  );
}
