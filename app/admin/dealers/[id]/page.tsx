export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminDealerStatusButton from "@/components/AdminDealerStatusButton";
import AdminDealerResetPassword from "@/components/admin/AdminDealerResetPassword";
import { ArrowLeft, Car, FileText, MessageSquare, ShieldCheck } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

const STATUS_STYLES: Record<string, string> = {
  pending_approval: "border-amber-200 bg-amber-50 text-amber-700",
  approved:         "border-brand/20 bg-brand/10 text-brand",
  rejected:         "border-red-200 bg-red-50 text-red-600",
  suspended:        "border-orange-200 bg-orange-50 text-orange-700",
};

const REQUIRED_DOCUMENTS = [
  { key: "company_registration", label: "Company registration" },
  { key: "proof_of_address", label: "Trading address proof" },
  { key: "motor_trade_insurance", label: "Motor trade insurance" },
];

const DOCUMENT_LABELS: Record<string, string> = {
  company_registration: "Company registration",
  proof_of_address: "Trading address proof",
  motor_trade_insurance: "Motor trade insurance",
  vat_certificate: "VAT certificate",
  fca_authorisation: "FCA authorisation",
  stock_ownership: "Stock ownership proof",
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

  const [{ count: totalListings }, { count: liveListings }, { count: pendingListings }, { count: totalEnquiries }] =
    await Promise.all([
      admin.from("dealer_listings").select("*", { count: "exact", head: true }).eq("dealer_id", id),
      admin.from("dealer_listings").select("*", { count: "exact", head: true }).eq("dealer_id", id).eq("status", "live"),
      admin.from("dealer_listings").select("*", { count: "exact", head: true }).eq("dealer_id", id).eq("status", "pending"),
      admin.from("dealer_enquiries").select("*", { count: "exact", head: true }).eq("dealer_id", id),
    ]);

  const { data: listings } = await admin
    .from("dealer_listings")
    .select("id, brand, model, year, price, mileage, status, created_at")
    .eq("dealer_id", id)
    .order("created_at", { ascending: false })
    .limit(10);

  // dealer_documents table may not exist yet (see PENDING_MIGRATIONS.sql)
  const documentsResult = await admin
    .from("dealer_documents")
    .select("id, document_type, file_name, file_url, mime_type, file_size, status, created_at")
    .eq("dealer_id", id)
    .order("created_at", { ascending: false });
  const documents = documentsResult.error ? null : documentsResult.data;

  const submittedDocumentTypes = new Set((documents ?? []).map((doc) => doc.document_type));
  const missingRequiredDocuments = REQUIRED_DOCUMENTS.filter((doc) => !submittedDocumentTypes.has(doc.key));

  const LISTING_STATUS: Record<string, string> = {
    draft:    "text-gray-400",
    pending:  "text-amber-700",
    live:     "text-brand",
    rejected: "text-red-600",
  };

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/dealers"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        All Dealers
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{dealer.company_name}</h1>
            <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[dealer.status] ?? ""}`}>
              {dealer.status.replace(/_/g, " ")}
            </span>
          </div>
          <p className="mt-1 text-gray-500">
            {dealer.contact_name} · {dealer.email} · {dealer.phone}
          </p>
          <p className="text-sm text-gray-400">
            {dealer.address_line1}{dealer.address_line2 ? `, ${dealer.address_line2}` : ""}, {dealer.city}, {dealer.postcode}
            {dealer.fca_frn ? ` · FCA: ${dealer.fca_frn}` : ""}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <AdminDealerStatusButton
            dealerProfileId={dealer.id}
            userId={dealer.user_id}
            currentStatus={dealer.status}
          />
          <AdminDealerResetPassword dealerId={dealer.id} />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Listings", value: totalListings ?? 0, icon: Car },
          { label: "Live",           value: liveListings   ?? 0, icon: Car },
          { label: "Pending Review", value: pendingListings ?? 0, icon: Car },
          { label: "Enquiries",      value: totalEnquiries  ?? 0, icon: MessageSquare },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{label}</p>
              <Icon className="h-3.5 w-3.5 text-gray-300" />
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Verification */}
      <div className="mt-10 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand" />
            <h2 className="text-lg font-semibold text-gray-900">Vendor Verification</h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <p className="text-[10px] uppercase tracking-wider text-gray-400">Company registration</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {dealer.company_registration_number || "Missing"}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <p className="text-[10px] uppercase tracking-wider text-gray-400">VAT / trading name</p>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {[dealer.vat_number, dealer.trading_name].filter(Boolean).join(" | ") || "Not supplied"}
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {REQUIRED_DOCUMENTS.map((doc) => {
              const complete = submittedDocumentTypes.has(doc.key);
              return (
                <div key={doc.key} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <span className="text-sm font-medium text-gray-700">{doc.label}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${complete ? "bg-brand/10 text-brand" : "bg-amber-50 text-amber-700"}`}>
                    {complete ? "Submitted" : "Missing"}
                  </span>
                </div>
              );
            })}
          </div>
          {missingRequiredDocuments.length > 0 ? (
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Approval is blocked until {missingRequiredDocuments.map((doc) => doc.label).join(", ")} are submitted.
            </p>
          ) : (
            <p className="mt-4 rounded-xl border border-brand/20 bg-brand/10 px-4 py-3 text-sm text-brand">
              Required documents are present. Admin can approve after manual checks.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand" />
            <h2 className="text-lg font-semibold text-gray-900">Submitted Documents</h2>
          </div>
          <div className="mt-5 space-y-3">
            {!documents || documents.length === 0 ? (
              <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-400">
                No verification documents have been uploaded.
              </p>
            ) : (
              documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 transition hover:border-brand/30 hover:bg-brand/5"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-gray-900">
                      {DOCUMENT_LABELS[doc.document_type] ?? doc.document_type}
                    </span>
                    <span className="block truncate text-xs text-gray-400">
                      {doc.file_name} | {(Number(doc.file_size) / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold capitalize text-gray-500">
                    {doc.status}
                  </span>
                </a>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Listings */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Vehicle Listings</h2>
          <Link
            href="/admin/dealer-listings"
            className="text-sm text-brand hover:text-brand-hover"
          >
            Review pending →
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {!listings || listings.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-400">No listings yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-left">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Vehicle</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Price</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Mileage</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Status</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Added</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((l) => (
                    <tr key={l.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-900">
                        {l.year} {l.brand} {l.model}
                      </td>
                      <td className="px-5 py-3 text-gray-600">£{Number(l.price).toLocaleString()}</td>
                      <td className="px-5 py-3 text-gray-600">{Number(l.mileage).toLocaleString()} mi</td>
                      <td className={`px-5 py-3 font-medium capitalize ${LISTING_STATUS[l.status] ?? "text-gray-400"}`}>
                        {l.status}
                      </td>
                      <td className="px-5 py-3 text-gray-400">
                        {new Date(l.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
