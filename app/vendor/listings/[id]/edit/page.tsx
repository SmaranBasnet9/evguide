export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import VendorListingForm from "@/components/vendor/VendorListingForm";

export default async function EditVendorListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/vendor/listings/${id}/edit`);

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!vendor) redirect("/vendor");

  const { data: listing } = await supabase
    .from("vendor_listings")
    .select("*")
    .eq("id", id)
    .eq("vendor_id", vendor.id)
    .eq("is_deleted", false)
    .single();
  if (!listing) notFound();

  if (listing.status === "live" || listing.status === "pending_review") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/vendor/listings" className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:text-gray-900">
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-black text-gray-900">Edit Listing</h1>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
          <p className="font-semibold">Editing not available</p>
          <p className="mt-1 text-sm">This listing is currently {listing.status === "live" ? "live" : "under review"} and cannot be edited. Pause or wait for it to be rejected before making changes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/vendor/listings" className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-gray-300 hover:text-gray-900">
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Edit Listing</h1>
          <p className="text-sm text-gray-500">{listing.year} {listing.make} {listing.model}</p>
        </div>
      </div>

      <VendorListingForm initialData={listing} listingId={id} />
    </div>
  );
}
