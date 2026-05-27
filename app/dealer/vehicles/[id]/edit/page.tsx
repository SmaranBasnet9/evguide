export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DealerVehicleForm from "@/components/DealerVehicleForm";

type Props = { params: Promise<{ id: string }> };

export const metadata = { title: "Edit Vehicle | Dealer Portal" };

export default async function DealerEditVehiclePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: dealerProfile } = await supabase
    .from("dealer_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!dealerProfile) redirect("/dealer");

  const { data: listing } = await supabase
    .from("dealer_listings")
    .select("*")
    .eq("id", id)
    .eq("dealer_id", dealerProfile.id)
    .single();

  if (!listing) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold text-brand">Dealer Portal</p>
      <h1 className="mt-1 text-3xl font-bold text-white">Edit listing</h1>
      <p className="mt-1 text-white/50">
        {listing.year} {listing.brand} {listing.model}
      </p>
      <div className="mt-8">
        <DealerVehicleForm mode="edit" listing={listing} />
      </div>
    </div>
  );
}
