export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import VendorListingForm from "@/components/vendor/VendorListingForm";

export default async function NewVendorListingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/vendor/listings/new");

  const { data: profile } = await supabase
    .from("profiles")
    .select("vendor_status")
    .eq("id", user.id)
    .single();

  if (profile?.vendor_status !== "verified") redirect("/vendor");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/vendor/listings" className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:text-gray-900">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Add New Listing</h1>
          <p className="text-sm text-gray-500">Fill in the vehicle details, then submit for review.</p>
        </div>
      </div>

      <VendorListingForm />
    </div>
  );
}
