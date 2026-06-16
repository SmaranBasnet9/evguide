export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Car, Eye, Users, CheckCircle, PauseCircle, TrendingUp } from "lucide-react";

export default async function VendorDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/vendor");

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id, company_name")
    .eq("user_id", user.id)
    .single();
  if (!vendor) redirect("/vendor/register");

  // Fetch listing stats
  const [
    { count: total },
    { count: live },
    { count: pending },
    { count: sold },
    { count: draft },
    { count: unreadLeads },
  ] = await Promise.all([
    supabase.from("vendor_listings").select("*", { count: "exact", head: true }).eq("vendor_id", vendor.id).eq("is_deleted", false),
    supabase.from("vendor_listings").select("*", { count: "exact", head: true }).eq("vendor_id", vendor.id).eq("status", "live").eq("is_deleted", false),
    supabase.from("vendor_listings").select("*", { count: "exact", head: true }).eq("vendor_id", vendor.id).eq("status", "pending_review").eq("is_deleted", false),
    supabase.from("vendor_listings").select("*", { count: "exact", head: true }).eq("vendor_id", vendor.id).eq("status", "sold").eq("is_deleted", false),
    supabase.from("vendor_listings").select("*", { count: "exact", head: true }).eq("vendor_id", vendor.id).eq("status", "draft").eq("is_deleted", false),
    supabase.from("vendor_enquiries").select("*", { count: "exact", head: true }).eq("vendor_id", vendor.id).eq("is_read", false),
  ]);

  const stats = [
    { label: "Total Listings",   value: total ?? 0,      icon: Car,          color: "text-gray-700",    bg: "bg-gray-100" },
    { label: "Live",             value: live ?? 0,       icon: CheckCircle,  color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pending Review",   value: pending ?? 0,    icon: TrendingUp,   color: "text-amber-600",   bg: "bg-amber-50" },
    { label: "Draft",            value: draft ?? 0,      icon: PauseCircle,  color: "text-blue-600",    bg: "bg-blue-50" },
    { label: "Sold",             value: sold ?? 0,       icon: CheckCircle,  color: "text-brand",       bg: "bg-brand/10" },
    { label: "New Enquiries",    value: unreadLeads ?? 0, icon: Users,        color: "text-purple-600",  bg: "bg-purple-50" },
  ];

  // Recent listings
  const { data: recentListings } = await supabase
    .from("vendor_listings")
    .select("id, make, model, year, price, status, images, created_at")
    .eq("vendor_id", vendor.id)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back, {vendor.company_name}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="mt-0.5 text-xs font-medium text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <a href="/vendor/listings/new" className="flex items-center gap-3 rounded-2xl border border-brand/20 bg-brand/5 p-5 transition hover:bg-brand/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Add New Listing</p>
            <p className="text-xs text-gray-500">Upload a vehicle for review</p>
          </div>
        </a>
        <a href="/vendor/enquiries" className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand/30">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-gray-900">View Enquiries</p>
            <p className="text-xs text-gray-500">
              {(unreadLeads ?? 0) > 0 ? `${unreadLeads} unread` : "All caught up"}
            </p>
          </div>
        </a>
        <a href="/vendor/listings" className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand/30">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
            <Eye className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Manage Listings</p>
            <p className="text-xs text-gray-500">{live ?? 0} live right now</p>
          </div>
        </a>
      </div>

      {/* Recent listings table */}
      {(recentListings?.length ?? 0) > 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Recent Listings</h2>
            <a href="/vendor/listings" className="text-sm font-semibold text-brand hover:underline">View all →</a>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">Vehicle</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentListings?.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{l.year} {l.make} {l.model}</td>
                  <td className="px-6 py-3 text-gray-600">£{Number(l.price).toLocaleString()}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      l.status === "live"           ? "bg-emerald-50 text-emerald-700" :
                      l.status === "pending_review" ? "bg-amber-50 text-amber-700" :
                      l.status === "sold"           ? "bg-blue-50 text-blue-700" :
                      l.status === "draft"          ? "bg-gray-100 text-gray-600" :
                      "bg-red-50 text-red-700"
                    }`}>{l.status.replace("_", " ")}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
