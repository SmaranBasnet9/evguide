export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Car, CheckCircle, Clock, MessageSquare, Plus } from "lucide-react";

export const metadata = { title: "Dealer Dashboard | EV Guide" };

export default async function DealerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dealer");

  const { data: dealerProfile } = await supabase
    .from("dealer_profiles")
    .select("id, company_name, contact_name")
    .eq("user_id", user.id)
    .single();

  if (!dealerProfile) redirect("/");

  const [
    { count: totalListings },
    { count: liveListings },
    { count: pendingListings },
    { count: unreadEnquiries },
  ] = await Promise.all([
    supabase
      .from("dealer_listings")
      .select("*", { count: "exact", head: true })
      .eq("dealer_id", dealerProfile.id),
    supabase
      .from("dealer_listings")
      .select("*", { count: "exact", head: true })
      .eq("dealer_id", dealerProfile.id)
      .eq("status", "live"),
    supabase
      .from("dealer_listings")
      .select("*", { count: "exact", head: true })
      .eq("dealer_id", dealerProfile.id)
      .eq("status", "pending"),
    supabase
      .from("dealer_enquiries")
      .select("*", { count: "exact", head: true })
      .eq("dealer_id", dealerProfile.id)
      .eq("is_read", false),
  ]);

  const stats = [
    { label: "Total Listings",     value: totalListings   ?? 0, icon: Car,           href: "/dealer/vehicles" },
    { label: "Live",               value: liveListings    ?? 0, icon: CheckCircle,   href: "/dealer/vehicles" },
    { label: "Pending Review",     value: pendingListings ?? 0, icon: Clock,         href: "/dealer/vehicles" },
    { label: "Unread Enquiries",   value: unreadEnquiries ?? 0, icon: MessageSquare, href: "/dealer/enquiries" },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-brand">Dealer Portal</p>
          <h1 className="mt-1 text-3xl font-bold text-white">{dealerProfile.company_name}</h1>
          <p className="mt-1 text-white/50">Welcome back, {dealerProfile.contact_name}</p>
        </div>
        <Link
          href="/dealer/vehicles/new"
          className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
        >
          <Plus className="h-4 w-4" />
          Add Vehicle
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-brand/25 hover:bg-white/[0.07]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/50">{label}</p>
              <Icon className="h-4 w-4 text-white/30 transition group-hover:text-brand" />
            </div>
            <p className="mt-3 text-3xl font-bold text-white">{value}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white">Quick actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link
            href="/dealer/vehicles/new"
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-brand/25 hover:bg-white/[0.07]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand/20 bg-brand/10">
              <Plus className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="font-semibold text-white">Add a new vehicle</p>
              <p className="text-sm text-white/50">Submit a listing for review</p>
            </div>
          </Link>
          <Link
            href="/dealer/enquiries"
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-brand/25 hover:bg-white/[0.07]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
              <MessageSquare className="h-5 w-5 text-white/60" />
            </div>
            <div>
              <p className="font-semibold text-white">View enquiries</p>
              <p className="text-sm text-white/50">
                {(unreadEnquiries ?? 0) > 0
                  ? `${unreadEnquiries} unread message${(unreadEnquiries ?? 0) !== 1 ? "s" : ""}`
                  : "No new messages"}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
