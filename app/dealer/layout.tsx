export const dynamic = "force-dynamic";

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DealerSidebar from "@/components/DealerSidebar";
import DealerPendingScreen from "@/components/dealer/DealerPendingScreen";
import DealerRejectedScreen from "@/components/dealer/DealerRejectedScreen";

export default async function DealerLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dealer");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, dealer_status")
    .eq("id", user.id)
    .single();

  const isApprovedDealer =
    profile?.role === "dealer" ||
    profile?.dealer_status === "approved" ||
    profile?.dealer_status === "pending_approval" ||
    profile?.dealer_status === "rejected";

  // Not a dealer at all — redirect home
  if (!isApprovedDealer) {
    redirect("/");
  }

  // Pending approval — show holding screen
  if (profile?.dealer_status === "pending_approval" && profile?.role !== "dealer" && profile?.dealer_status !== "approved") {
    return <DealerPendingScreen />;
  }

  // Rejected — show rejection screen
  if (profile?.dealer_status === "rejected") {
    const { data: dealerRow } = await supabase
      .from("dealer_profiles")
      .select("rejection_reason")
      .eq("user_id", user.id)
      .maybeSingle();
    return <DealerRejectedScreen reason={dealerRow?.rejection_reason} />;
  }

  // Suspended
  if (profile?.dealer_status === "suspended") {
    return (
      <DealerRejectedScreen reason="Your account has been suspended. Please contact support." />
    );
  }

  // Fully approved dealer
  const { data: dealerProfile } = await supabase
    .from("dealer_profiles")
    .select("id, company_name")
    .eq("user_id", user.id)
    .single();

  if (!dealerProfile) redirect("/");

  // Unread enquiry count for sidebar badge
  const { count: pendingEnquiries } = await supabase
    .from("dealer_enquiries")
    .select("*", { count: "exact", head: true })
    .eq("dealer_id", dealerProfile.id)
    .eq("is_read", false);

  return (
    <div className="flex min-h-screen text-white" style={{ backgroundColor: "#0D0D0D" }}>
      <DealerSidebar
        companyName={dealerProfile.company_name}
        pendingEnquiries={pendingEnquiries ?? 0}
      />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
