export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import VendorRegisterWizard from "@/components/vendor/VendorRegisterWizard";

export default async function VendorRegisterPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/vendor/register");

  const { data: profile } = await supabase
    .from("profiles")
    .select("vendor_status")
    .eq("id", user.id)
    .single();

  // Already applied — send to portal (layout handles state screens)
  if (profile?.vendor_status) redirect("/vendor");

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <VendorRegisterWizard />
    </div>
  );
}
