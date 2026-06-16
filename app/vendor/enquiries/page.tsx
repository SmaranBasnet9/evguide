export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MessageSquare, Mail, MailOpen, Car } from "lucide-react";
import MarkReadButton from "@/components/vendor/MarkReadButton";

export default async function VendorEnquiriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/vendor/enquiries");

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!vendor) redirect("/vendor");

  const { data: enquiries } = await supabase
    .from("vendor_enquiries")
    .select("id, name, email, phone, message, is_read, created_at, listing_id, vendor_listings(make, model, year)")
    .eq("vendor_id", vendor.id)
    .order("created_at", { ascending: false });

  const unread = enquiries?.filter((e) => !e.is_read).length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Enquiries</h1>
          <p className="mt-1 text-sm text-gray-500">
            {enquiries?.length ?? 0} total{unread > 0 ? ` · ${unread} unread` : ""}
          </p>
        </div>
      </div>

      {(!enquiries || enquiries.length === 0) ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
            <MessageSquare className="h-6 w-6 text-gray-400" />
          </div>
          <h2 className="font-bold text-gray-900">No enquiries yet</h2>
          <p className="mt-1 text-sm text-gray-500">Buyer messages will appear here when you have live listings.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {enquiries.map((e) => {
            const listing = Array.isArray(e.vendor_listings) ? e.vendor_listings[0] : e.vendor_listings;
            return (
              <div key={e.id} className={`rounded-2xl border bg-white p-5 shadow-sm transition ${e.is_read ? "border-gray-200" : "border-brand/30 ring-1 ring-brand/10"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${e.is_read ? "bg-gray-100" : "bg-brand/10"}`}>
                      {e.is_read
                        ? <MailOpen className="h-4 w-4 text-gray-400" />
                        : <Mail className="h-4 w-4 text-brand" />
                      }
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="font-bold text-gray-900">{e.name}</span>
                        {!e.is_read && (
                          <span className="rounded-full bg-brand px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">New</span>
                        )}
                      </div>
                      <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-gray-500">
                        <a href={`mailto:${e.email}`} className="hover:text-brand hover:underline">{e.email}</a>
                        {e.phone && <span>{e.phone}</span>}
                        <span>{new Date(e.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      {listing && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-gray-600">
                          <Car className="h-3.5 w-3.5 flex-shrink-0" />
                          {listing.year} {listing.make} {listing.model}
                        </div>
                      )}
                      {e.message && (
                        <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{e.message}</p>
                      )}
                    </div>
                  </div>
                  {!e.is_read && <MarkReadButton enquiryId={e.id} />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
