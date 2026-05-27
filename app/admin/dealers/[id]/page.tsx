export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminDealerStatusButton from "@/components/AdminDealerStatusButton";
import { ArrowLeft, Car, MessageSquare } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

const STATUS_STYLES: Record<string, string> = {
  pending_approval: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  approved:         "border-brand/20 bg-brand/10 text-brand",
  rejected:         "border-red-500/20 bg-red-500/10 text-red-400",
  suspended:        "border-orange-500/20 bg-orange-500/10 text-orange-300",
};

export default async function AdminDealerDetailPage({ params }: Props) {
  const { id } = await params;
  const admin = createAdminClient();

  const { data: dealer, error } = await admin
    .from("dealer_profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !dealer) notFound();

  // Stats
  const [{ count: totalListings }, { count: liveListings }, { count: pendingListings }, { count: totalEnquiries }] =
    await Promise.all([
      admin.from("dealer_listings").select("*", { count: "exact", head: true }).eq("dealer_id", id),
      admin.from("dealer_listings").select("*", { count: "exact", head: true }).eq("dealer_id", id).eq("status", "live"),
      admin.from("dealer_listings").select("*", { count: "exact", head: true }).eq("dealer_id", id).eq("status", "pending"),
      admin.from("dealer_enquiries").select("*", { count: "exact", head: true }).eq("dealer_id", id),
    ]);

  // Recent listings
  const { data: listings } = await admin
    .from("dealer_listings")
    .select("id, brand, model, year, price, mileage, status, created_at")
    .eq("dealer_id", id)
    .order("created_at", { ascending: false })
    .limit(10);

  const LISTING_STATUS: Record<string, string> = {
    draft:    "text-white/40",
    pending:  "text-amber-300",
    live:     "text-brand",
    rejected: "text-red-400",
  };

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/dealers"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        All Dealers
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{dealer.company_name}</h1>
            <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[dealer.status] ?? ""}`}>
              {dealer.status.replace(/_/g, " ")}
            </span>
          </div>
          <p className="mt-1 text-white/50">
            {dealer.contact_name} · {dealer.email} · {dealer.phone}
          </p>
          <p className="text-sm text-white/40">
            {dealer.address_line1}{dealer.address_line2 ? `, ${dealer.address_line2}` : ""}, {dealer.city}, {dealer.postcode}
            {dealer.fca_frn ? ` · FCA: ${dealer.fca_frn}` : ""}
          </p>
        </div>
        <AdminDealerStatusButton
          dealerProfileId={dealer.id}
          userId={dealer.user_id}
          currentStatus={dealer.status}
        />
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Listings", value: totalListings ?? 0, icon: Car },
          { label: "Live",           value: liveListings   ?? 0, icon: Car },
          { label: "Pending Review", value: pendingListings ?? 0, icon: Car },
          { label: "Enquiries",      value: totalEnquiries  ?? 0, icon: MessageSquare },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/50">{label}</p>
              <Icon className="h-3.5 w-3.5 text-white/20" />
            </div>
            <p className="mt-2 text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Listings */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Vehicle Listings</h2>
          <Link
            href={`/admin/dealer-listings`}
            className="text-sm text-brand hover:text-brand-hover"
          >
            Review pending →
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          {!listings || listings.length === 0 ? (
            <p className="py-12 text-center text-sm text-white/40">No listings yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-left">
                  <th className="px-5 py-3 font-semibold text-white/40">Vehicle</th>
                  <th className="px-5 py-3 font-semibold text-white/40">Price</th>
                  <th className="px-5 py-3 font-semibold text-white/40">Mileage</th>
                  <th className="px-5 py-3 font-semibold text-white/40">Status</th>
                  <th className="px-5 py-3 font-semibold text-white/40">Added</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((l) => (
                  <tr key={l.id} className="border-b border-white/[0.04] last:border-0">
                    <td className="px-5 py-3 font-medium text-white">
                      {l.year} {l.brand} {l.model}
                    </td>
                    <td className="px-5 py-3 text-white/60">£{Number(l.price).toLocaleString()}</td>
                    <td className="px-5 py-3 text-white/60">{Number(l.mileage).toLocaleString()} mi</td>
                    <td className={`px-5 py-3 font-medium capitalize ${LISTING_STATUS[l.status] ?? "text-white/40"}`}>
                      {l.status}
                    </td>
                    <td className="px-5 py-3 text-white/40">
                      {new Date(l.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
