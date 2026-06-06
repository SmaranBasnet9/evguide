export const dynamic = "force-dynamic";

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminSidebar from "@/components/AdminSidebar";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin-login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role as string | undefined;
  if (error || (role !== "admin" && role !== "super_admin")) {
    redirect("/");
  }

  // department column is added via manual migration — graceful fallback if not yet applied
  const { data: deptData } = await supabase
    .from("profiles")
    .select("department")
    .eq("id", user.id)
    .single();
  const department = (deptData?.department as string | null) ?? null;

  // Pending counts for sidebar badges — best-effort, no auth bypass needed
  const [
    { count: pendingConsultations },
    { count: newVehicleQueries },
    { count: newLeads },
    { count: newFinanceRequests },
    { count: pendingExchange },
    { count: pendingFeedback },
    { count: pendingDealerAccounts },
    { count: pendingDealerListings },
  ] = await Promise.all([
    supabase
      .from("consultation_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("vehicle_queries")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("crm_leads")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    adminClient
      .from("finance_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    adminClient
      .from("exchange_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("user_ev_feedback")
      .select("*", { count: "exact", head: true })
      .eq("is_approved", false),
    adminClient
      .from("dealer_profiles")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending_approval"),
    adminClient
      .from("dealer_listings")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  const pendingCounts = {
    consultations:   pendingConsultations   ?? 0,
    vehicleQueries:  newVehicleQueries      ?? 0,
    leads:           newLeads               ?? 0,
    financeRequests: newFinanceRequests     ?? 0,
    exchange:        pendingExchange        ?? 0,
    feedback:        pendingFeedback        ?? 0,
    dealerAccounts:  pendingDealerAccounts  ?? 0,
    dealerListings:  pendingDealerListings  ?? 0,
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <AdminSidebar role={role!} department={department} pendingCounts={pendingCounts} />
      <main className="flex-1 overflow-y-auto p-4 pt-[calc(3.5rem+1.25rem)] md:p-8 lg:p-8 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
