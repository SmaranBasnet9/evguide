"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  ShieldCheck,
  Car,
  Plus,
  FileText,
  MessageSquare,
  Globe,
  Tag,
  MapPin,
  Users,
  Kanban,
  Sparkles,
  CalendarCheck,
  UserCheck,
  ClipboardList,
  ArrowLeftRight,
  CreditCard,
  Shield,
  UserCog,
  TrendingUp,
  Gavel,
  Car as CarUsed,
  HeartPulse,
  Truck,
  Code2,
  DatabaseZap,
  Building2,
  CarFront,
  ExternalLink,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PendingCounts = {
  consultations:   number;
  vehicleQueries:  number;
  leads:           number;
  financeRequests: number;
  exchange:        number;
  feedback:        number;
  dealerAccounts:  number;
  dealerListings:  number;
};

type NavLink = {
  href:    string;
  label:   string;
  icon:    LucideIcon;
  exact?:  boolean;
  badge?:  keyof PendingCounts;
};
type NavSection = "general" | "content" | "vehicles" | "dealers" | "finance" | "platform";

// ── Nav sections ──────────────────────────────────────────────────────────────

const SECTION_META: Record<NavSection, { label: string }> = {
  general:  { label: "General" },
  content:  { label: "Content" },
  vehicles: { label: "Vehicles & CRM" },
  dealers:  { label: "Dealer Management" },
  finance:  { label: "Finance" },
  platform: { label: "Platform" },
};

const SECTION_LINKS: Record<NavSection, NavLink[]> = {
  general: [
    { href: "/admin",       label: "Dashboard",    icon: LayoutDashboard, exact: true },
    { href: "/admin/audit", label: "System Audit", icon: ShieldCheck },
  ],
  content: [
    { href: "/admin/evs",          label: "EV Models",      icon: Car },
    { href: "/admin/evs/new",      label: "Add New EV",     icon: Plus },
    { href: "/admin/accessories",  label: "Accessories",    icon: Shield },
    { href: "/admin/blog",         label: "Blog Posts",     icon: FileText },
    { href: "/admin/feedback",     label: "Feedback",       icon: MessageSquare, badge: "feedback" },
    { href: "/admin/seo",          label: "SEO Management", icon: Globe },
    { href: "/admin/seo/keywords", label: "SEO Keywords",   icon: Tag },
    { href: "/admin/geo",          label: "GEO Regions",    icon: MapPin },
  ],
  vehicles: [
    { href: "/admin/enquiries",        label: "Enquiries",          icon: MessageSquare,  badge: "consultations" },
    { href: "/admin/leads",           label: "Lead Pipeline",      icon: Users,          badge: "leads" },
    { href: "/admin/pipeline",        label: "Pipeline Board",     icon: Kanban },
    { href: "/admin/recommendations", label: "AI Recommendations", icon: Sparkles },
    { href: "/admin/consultations",   label: "Vehicle Consultancy", icon: CalendarCheck,  badge: "consultations" },
    { href: "/admin/crm",             label: "CRM Journey",        icon: UserCheck },
    { href: "/admin/vehicle-queries", label: "Vehicle Queries",    icon: ClipboardList,  badge: "vehicleQueries" },
    { href: "/admin/exchange",        label: "Exchange Requests",  icon: ArrowLeftRight, badge: "exchange" },
    { href: "/admin/test-drives",     label: "Test Drives",        icon: CalendarCheck },
    { href: "/admin/used-listings",   label: "Used Listings",      icon: CarUsed },
    { href: "/admin/battery-reports", label: "Battery Reports",    icon: HeartPulse },
    { href: "/admin/fleet-enquiries", label: "Fleet Enquiries",    icon: Truck },
  ],
  dealers: [
    { href: "/admin/dealers",             label: "All Dealers",        icon: Building2,  badge: "dealerAccounts" },
    { href: "/admin/dealers/new",         label: "Create Dealer",      icon: Plus },
    { href: "/admin/dealer-listings",     label: "Dealer Vehicles",    icon: CarFront,   badge: "dealerListings" },
    { href: "/admin/dealer-bids",         label: "Dealer Bids",        icon: Gavel },
    { href: "/admin/dealer-applications", label: "Dealer Partners",    icon: Code2 },
  ],
  finance: [
    { href: "/admin/finance-requests", label: "Finance Requests", icon: CreditCard, badge: "financeRequests" },
  ],
  platform: [
    { href: "/admin/staff",         label: "Staff & Access",  icon: Shield },
    { href: "/admin/users",         label: "Users & Access",  icon: UserCog },
    { href: "/admin/data-insights", label: "Data Insights",   icon: DatabaseZap },
    { href: "/admin/business-plan", label: "Business Plan",   icon: TrendingUp },
  ],
};

// ── Department → visible sections ─────────────────────────────────────────────

function getVisibleSections(role: string, department: string | null): NavSection[] {
  if (role === "super_admin") {
    return ["general", "content", "vehicles", "dealers", "finance", "platform"];
  }
  if (department === "management") {
    return ["general", "content", "vehicles", "dealers", "finance"];
  }
  switch (department) {
    case "sales":
    case "support":
      return ["general", "vehicles", "dealers"];
    case "operations":
      return ["general", "vehicles", "dealers", "finance"];
    case "finance":
      return ["general", "finance"];
    case "technical":
    case "marketing":
      return ["general", "content"];
    default:
      return ["general", "content", "vehicles", "dealers", "finance"];
  }
}

// ── Badge pill ────────────────────────────────────────────────────────────────

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500/90 px-1.5 text-[10px] font-bold leading-none text-white tabular-nums">
      {count > 99 ? "99+" : count}
    </span>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  role:          string;
  department:    string | null;
  pendingCounts: PendingCounts;
}

export default function AdminSidebar({ role, department, pendingCounts }: Props) {
  const pathname = usePathname();
  const router   = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin-login");
    router.refresh();
  }

  const visibleSections = getVisibleSections(role, department);
  const isSuperAdmin    = role === "super_admin";

  // Total unread for the header dot
  const totalPending = Object.values(pendingCounts).reduce((a, b) => a + b, 0);

  return (
    <aside className="flex w-60 flex-col border-r border-white/10 bg-surface-panel px-4 py-8">
      {/* Brand */}
      <div className="mb-8 px-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
          {isSuperAdmin ? "Super Admin" : "Admin Panel"}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-lg font-bold text-white">EV Guide</p>
          {totalPending > 0 && (
            <span className="flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-surface-panel" aria-label={`${totalPending} pending items`} />
          )}
        </div>
        {!isSuperAdmin && department && (
          <p className="mt-0.5 text-xs capitalize text-white/40">{department}</p>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto">
        {visibleSections.map((sectionKey) => {
          const links = SECTION_LINKS[sectionKey];
          const meta  = SECTION_META[sectionKey];
          return (
            <div key={sectionKey}>
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                {meta.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {links.map(({ href, label, icon: Icon, exact, badge }) => {
                  const active     = exact ? pathname === href : pathname.startsWith(href);
                  const badgeCount = badge ? pendingCounts[badge] : 0;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                        active
                          ? "border-l-2 border-brand bg-brand/10 text-brand"
                          : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 truncate">{label}</span>
                      <Badge count={badgeCount} />
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-white/10 pt-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-white/60 transition-colors duration-150 hover:bg-white/[0.06] hover:text-white"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          View Site
        </Link>
        <button
          onClick={handleSignOut}
          className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-400 transition-colors duration-150 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
