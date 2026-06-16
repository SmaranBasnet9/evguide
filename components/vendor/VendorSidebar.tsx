"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Car, MessageSquare, User, LogOut, Building2, ShieldCheck,
} from "lucide-react";

interface Props {
  companyName: string;
  pendingEnquiries: number;
}

const NAV = [
  { href: "/vendor",            label: "Dashboard",   icon: LayoutDashboard, exact: true },
  { href: "/vendor/listings",   label: "Listings",    icon: Car },
  { href: "/vendor/enquiries",  label: "Enquiries",   icon: MessageSquare },
  { href: "/vendor/profile",    label: "Profile",     icon: User },
];

export default function VendorSidebar({ companyName, pendingEnquiries }: Props) {
  const path = usePathname();

  function isActive(href: string, exact?: boolean) {
    return exact ? path === href : path.startsWith(href);
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10">
          <Building2 className="h-5 w-5 text-brand" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-gray-900">{companyName}</p>
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            <p className="text-[10px] font-semibold text-emerald-600">Verified Vendor</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-brand/10 text-brand"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </div>
              {label === "Enquiries" && pendingEnquiries > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-bold text-white">
                  {pendingEnquiries > 99 ? "99+" : pendingEnquiries}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
        >
          <LogOut className="h-4 w-4" /> Back to EV Guide
        </Link>
      </div>
    </aside>
  );
}
