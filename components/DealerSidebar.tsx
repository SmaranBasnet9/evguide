"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Car, Plus, MessageSquare, LayoutDashboard, LogOut, BarChart2, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/dealer",              label: "Dashboard",    icon: LayoutDashboard, exact: true },
  { href: "/dealer/vehicles",     label: "My Vehicles",  icon: Car },
  { href: "/dealer/vehicles/new", label: "Add Vehicle",  icon: Plus },
  { href: "/dealer/enquiries",    label: "Enquiries",    icon: MessageSquare, badge: true },
  { href: "/dealer/analytics",    label: "Analytics",    icon: BarChart2 },
  { href: "/dealer/settings",     label: "Settings",     icon: Settings },
];

type Props = {
  companyName: string;
  pendingEnquiries: number;
};

export default function DealerSidebar({ companyName, pendingEnquiries }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="flex w-64 flex-col border-r border-white/[0.06] bg-white/[0.02] px-4 py-6">
      {/* Logo / brand */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand/30 bg-brand/10">
          <Building2 className="h-4 w-4 text-brand" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{companyName}</p>
          <p className="text-xs text-white/40">Dealer Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {NAV.map(({ href, label, icon: Icon, exact, badge }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-brand/15 text-brand"
                  : "text-white/60 hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {badge && pendingEnquiries > 0 ? (
                <span className="rounded-full bg-brand px-1.5 py-0.5 text-xs font-semibold text-white">
                  {pendingEnquiries}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/40 transition hover:bg-white/[0.05] hover:text-red-400"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        Sign out
      </button>
    </aside>
  );
}
