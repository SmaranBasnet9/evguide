export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DealerSettingsClient from "@/components/dealer/DealerSettingsClient";

export default async function DealerSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dealer-login");

  const { data: dealerProfile } = await supabase
    .from("dealer_profiles")
    .select("id, company_name, contact_name, email, phone, address_line1, address_line2, city, postcode, fca_frn, website, status, created_at")
    .eq("user_id", user.id)
    .single();

  if (!dealerProfile) redirect("/");

  return (
    <DealerSettingsClient
      profile={dealerProfile}
      userEmail={user.email ?? ""}
    />
  );
}
