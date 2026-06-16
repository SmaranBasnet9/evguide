export const dynamic = "force-dynamic";

import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { Clock, FileText } from "lucide-react";

export default async function AdminVendorApplicationsPage() {
  const adminClient = createAdminClient();

  const { data: vendors } = await adminClient
    .from("vendors")
    .select("id, company_name, email, business_type, city, postcode, created_at, contact_person")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Pending Applications</h1>
        <p className="mt-1 text-sm text-gray-500">
          {vendors?.length ?? 0} vendor{vendors?.length !== 1 ? "s" : ""} awaiting review · oldest first
        </p>
      </div>

      {(!vendors || vendors.length === 0) ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-16 text-center">
          <Clock className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <h2 className="font-bold text-gray-900">No pending applications</h2>
          <p className="mt-1 text-sm text-gray-500">All caught up.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {vendors.map((v) => (
            <div key={v.id} className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-gray-900">{v.company_name}</h2>
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">Pending</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-gray-500">
                    <span>{v.contact_person}</span>
                    <a href={`mailto:${v.email}`} className="hover:text-brand hover:underline">{v.email}</a>
                    {v.city && <span>{v.city}{v.postcode ? ` ${v.postcode}` : ""}</span>}
                    <span className="capitalize">{v.business_type?.replace(/_/g, " ")}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Applied {new Date(v.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <Link
                  href={`/admin/vendors/${v.id}`}
                  className="flex-shrink-0 flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand/90"
                >
                  <FileText className="h-4 w-4" />
                  Review
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
