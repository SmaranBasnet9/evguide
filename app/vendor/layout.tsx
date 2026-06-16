export const dynamic = "force-dynamic";

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VendorSidebar from "@/components/vendor/VendorSidebar";

export default async function VendorLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/vendor");

  const { data: profile } = await supabase
    .from("profiles")
    .select("vendor_status")
    .eq("id", user.id)
    .single();

  const status = profile?.vendor_status;

  // No vendor registration at all
  if (!status) redirect("/vendor/register");

  // Pending — show holding screen
  if (status === "pending") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
            <span className="text-2xl">⏳</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Application Under Review</h1>
          <p className="mt-2 text-sm text-gray-600">
            We&apos;re verifying your documents and company details. This typically takes 1–2 business days. We&apos;ll email you at {user.email} once a decision has been made.
          </p>
        </div>
      </div>
    );
  }

  // Rejected
  if (status === "rejected") {
    const { data: vendor } = await supabase
      .from("vendors")
      .select("rejection_reason, rejection_notes")
      .eq("user_id", user.id)
      .maybeSingle();
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
            <span className="text-2xl">✗</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Application Not Approved</h1>
          {vendor?.rejection_reason && (
            <p className="mt-2 text-sm text-gray-700"><strong>Reason:</strong> {vendor.rejection_reason}</p>
          )}
          {vendor?.rejection_notes && (
            <p className="mt-1 text-sm text-gray-600">{vendor.rejection_notes}</p>
          )}
          <p className="mt-4 text-xs text-gray-500">
            Questions? Contact us at{" "}
            <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`} className="text-brand underline">
              {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Suspended
  if (status === "suspended") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md rounded-2xl border border-orange-200 bg-orange-50 p-8 text-center">
          <h1 className="text-xl font-bold text-gray-900">Account Suspended</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your vendor account has been suspended. Please contact{" "}
            <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`} className="text-brand underline">
              support
            </a>{" "}
            for assistance.
          </p>
        </div>
      </div>
    );
  }

  // Verified vendor — load full portal
  const { data: vendor } = await supabase
    .from("vendors")
    .select("id, company_name")
    .eq("user_id", user.id)
    .single();

  if (!vendor) redirect("/vendor/register");

  const { count: pendingEnquiries } = await supabase
    .from("vendor_enquiries")
    .select("*", { count: "exact", head: true })
    .eq("vendor_id", vendor.id)
    .eq("is_read", false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <VendorSidebar companyName={vendor.company_name} pendingEnquiries={pendingEnquiries ?? 0} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
