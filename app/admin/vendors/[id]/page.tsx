export const dynamic = "force-dynamic";

import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Building2, FileText, Car } from "lucide-react";
import VendorActionForm from "@/components/admin/VendorActionForm";

const STATUS_BADGE: Record<string, string> = {
  verified:  "bg-emerald-50 text-emerald-700",
  pending:   "bg-amber-50 text-amber-700",
  rejected:  "bg-red-50 text-red-700",
  suspended: "bg-orange-50 text-orange-700",
};

const DOC_LABEL: Record<string, string> = {
  company_registration:   "Company Registration",
  business_license:       "Business License",
  government_id:          "Government ID",
  vat_registration:       "VAT Registration",
  proof_of_address:       "Proof of Address",
  dealership_authorization: "Dealership Authorization",
};

export default async function AdminVendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const adminClient = createAdminClient();

  const { data: vendor } = await adminClient
    .from("vendors")
    .select("*, vendor_permissions(*)")
    .eq("id", id)
    .single();

  if (!vendor) notFound();

  const [{ data: documents }, { data: listings }, { data: auditLogs }] = await Promise.all([
    adminClient.from("vendor_documents").select("*").eq("vendor_id", id).order("created_at", { ascending: false }),
    adminClient.from("vendor_listings").select("id, make, model, year, status, price, created_at").eq("vendor_id", id).eq("is_deleted", false).order("created_at", { ascending: false }).limit(10),
    adminClient.from("vendor_audit_logs").select("*").eq("vendor_id", id).order("created_at", { ascending: false }).limit(20),
  ]);

  const perms = Array.isArray(vendor.vendor_permissions) ? vendor.vendor_permissions[0] : vendor.vendor_permissions;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/vendors" className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:text-gray-900">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-gray-900">{vendor.company_name}</h1>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_BADGE[vendor.status] ?? "bg-gray-100 text-gray-600"}`}>
              {vendor.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">{vendor.email} · {vendor.contact_person}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: vendor info + documents */}
        <div className="space-y-5 lg:col-span-2">
          {/* Company Details */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2"><Building2 className="h-4 w-4 text-gray-400" /> Company Details</h2>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">Business Type</dt><dd className="mt-0.5 capitalize text-gray-900">{vendor.business_type?.replace(/_/g, " ")}</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">Phone</dt><dd className="mt-0.5 text-gray-900">{vendor.phone}</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">Address</dt><dd className="mt-0.5 text-gray-900">{[vendor.address_line1, vendor.city, vendor.postcode].filter(Boolean).join(", ")}</dd></div>
              {vendor.website && <div><dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">Website</dt><dd className="mt-0.5"><a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline truncate block">{vendor.website}</a></dd></div>}
              {vendor.vat_number && <div><dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">VAT Number</dt><dd className="mt-0.5 text-gray-900">{vendor.vat_number}</dd></div>}
              {vendor.company_registration_number && <div><dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">Reg Number</dt><dd className="mt-0.5 text-gray-900">{vendor.company_registration_number}</dd></div>}
              <div><dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">Max Listings</dt><dd className="mt-0.5 text-gray-900">{perms?.max_active_listings ?? 20}</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">Can Publish</dt><dd className="mt-0.5 text-gray-900">{perms?.can_publish_listings ? "Yes" : "No"}</dd></div>
            </dl>
          </section>

          {/* Documents */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2"><FileText className="h-4 w-4 text-gray-400" /> Documents ({documents?.length ?? 0})</h2>
            {(!documents || documents.length === 0) ? (
              <p className="text-sm text-gray-400">No documents uploaded yet.</p>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{DOC_LABEL[doc.document_type] ?? doc.document_type}</p>
                      <p className="text-xs text-gray-400">{new Date(doc.created_at).toLocaleDateString("en-GB")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        doc.status === "accepted" ? "bg-emerald-50 text-emerald-700" :
                        doc.status === "rejected" ? "bg-red-50 text-red-700" :
                        "bg-amber-50 text-amber-700"
                      }`}>{doc.status}</span>
                      {doc.file_url && (
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-brand hover:underline">View</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Listings */}
          {listings && listings.length > 0 && (
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2"><Car className="h-4 w-4 text-gray-400" /> Recent Listings</h2>
              <div className="space-y-1">
                {listings.map((l) => (
                  <div key={l.id} className="flex items-center justify-between rounded-xl px-4 py-2.5 hover:bg-gray-50">
                    <span className="text-sm text-gray-900">{l.year} {l.make} {l.model}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-700">£{Number(l.price).toLocaleString()}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        l.status === "live" ? "bg-emerald-50 text-emerald-700" :
                        l.status === "pending_review" ? "bg-amber-50 text-amber-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>{l.status.replace(/_/g, " ")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right: actions + audit trail */}
        <div className="space-y-5">
          <VendorActionForm vendorId={id} currentStatus={vendor.status} />

          {/* Audit Log */}
          {auditLogs && auditLogs.length > 0 && (
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
              <h2 className="font-bold text-gray-900 text-sm">Audit Log</h2>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {auditLogs.map((log) => (
                  <div key={log.id} className="border-l-2 border-gray-200 pl-3 text-xs">
                    <p className="font-semibold capitalize text-gray-700">{log.action.replace(/_/g, " ")}</p>
                    {log.notes && <p className="text-gray-500">{log.notes}</p>}
                    <p className="text-gray-400">{new Date(log.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
