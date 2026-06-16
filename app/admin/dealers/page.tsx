export const dynamic = "force-dynamic";

import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminDealerStatusButton from "@/components/AdminDealerStatusButton";
import { Plus, Building2 } from "lucide-react";

async function getDealers() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("dealer_profiles")
    .select("id, company_name, contact_name, email, phone, city, postcode, fca_frn, website, status, rejection_reason, created_at, user_id")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[admin/dealers]", error.message);
    return [];
  }

  const dealers = data ?? [];

  const counts = await Promise.all(
    dealers.map((dealer) =>
      admin.from("dealer_listings").select("*", { count: "exact", head: true }).eq("dealer_id", dealer.id),
    ),
  );

  return dealers.map((dealer, i) => ({ ...dealer, listingCount: counts[i].count ?? 0 }));
}

const STATUS_STYLES: Record<string, string> = {
  pending_approval: "border-amber-200 bg-amber-50 text-amber-700",
  approved:         "border-brand/20 bg-brand/10 text-brand",
  rejected:         "border-red-200 bg-red-50 text-red-600",
  suspended:        "border-orange-200 bg-orange-50 text-orange-700",
};

export default async function AdminDealersPage() {
  const dealers = await getDealers();

  const pending  = dealers.filter((d) => d.status === "pending_approval").length;
  const approved = dealers.filter((d) => d.status === "approved").length;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-brand">Dealer Management</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">All Dealers</h1>
          <p className="mt-1 text-gray-500">
            {dealers.length} total · {pending} pending approval · {approved} active
          </p>
        </div>
        <Link
          href="/admin/dealers/new"
          className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
        >
          <Plus className="h-4 w-4" />
          Create Dealer
        </Link>
      </div>

      <div className="mt-8">
        {dealers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-24 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white">
              <Building2 className="h-6 w-6 text-gray-400" />
            </div>
            <p className="mt-4 text-gray-500">No dealers yet.</p>
            <Link
              href="/admin/dealers/new"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              <Plus className="h-4 w-4" />
              Create your first dealer
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {dealers.map((dealer) => (
              <div
                key={dealer.id}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-base font-semibold text-gray-900">{dealer.company_name}</h2>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[dealer.status] ?? STATUS_STYLES.pending_approval}`}
                      >
                        {dealer.status.replace(/_/g, " ")}
                      </span>
                      <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                        {dealer.listingCount} {dealer.listingCount === 1 ? "vehicle" : "vehicles"} listed
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {dealer.contact_name} · {dealer.email} · {dealer.phone}
                    </p>
                    <p className="text-sm text-gray-400">
                      {dealer.city}, {dealer.postcode}
                      {dealer.fca_frn ? ` · FCA: ${dealer.fca_frn}` : ""}
                      {dealer.website ? ` · ${dealer.website}` : ""}
                    </p>
                    {dealer.rejection_reason ? (
                      <p className="mt-1 text-xs text-red-600">
                        Reason: {dealer.rejection_reason}
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs text-gray-400">
                      Created {new Date(dealer.created_at).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/dealers/${dealer.id}`}
                      className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                      View
                    </Link>
                    <AdminDealerStatusButton
                      dealerProfileId={dealer.id}
                      userId={dealer.user_id}
                      currentStatus={dealer.status}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
