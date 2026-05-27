export const dynamic = "force-dynamic";
export const metadata = { title: "Leads | Dealer Portal" };

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DealerLeadsInbox, { type Enquiry } from "@/components/dealer/DealerLeadsInbox";

export default async function DealerEnquiriesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dealer/enquiries");

  const { data: dealerProfile } = await supabase
    .from("dealer_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!dealerProfile) redirect("/dealer");

  const { data: rawEnquiries } = await supabase
    .from("dealer_enquiries")
    .select("id, full_name, email, phone, message, is_read, created_at, listing_id")
    .eq("dealer_id", dealerProfile.id)
    .order("created_at", { ascending: false });

  // Fetch listing names for enquiry rows
  const listingIds = [...new Set((rawEnquiries ?? []).map((e) => e.listing_id))];
  const { data: listings } = listingIds.length > 0
    ? await supabase
        .from("dealer_listings")
        .select("id, brand, model, year")
        .in("id", listingIds)
    : { data: [] };

  const listingMap = Object.fromEntries((listings ?? []).map((l) => [l.id, l]));

  const enquiries: Enquiry[] = (rawEnquiries ?? []).map((e) => ({
    id:         e.id,
    full_name:  e.full_name,
    email:      e.email,
    phone:      e.phone ?? null,
    message:    e.message ?? null,
    is_read:    e.is_read,
    created_at: e.created_at,
    listing_id: e.listing_id,
    listing:    listingMap[e.listing_id] ?? null,
  }));

  return (
    <div className="mx-auto max-w-6xl">
      <DealerLeadsInbox initialEnquiries={enquiries} />
    </div>
  );
}
