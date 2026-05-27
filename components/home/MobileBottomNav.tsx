"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, GitCompare, Sparkles, ArrowLeftRight } from "lucide-react";

const NAV_ITEMS = [
  { href: "/vehicles", label: "Vehicles", Icon: Car },
  { href: "/compare", label: "Compare", Icon: GitCompare },
  { href: "/ai-match", label: "AI Match", Icon: Sparkles },
  { href: "/exchange", label: "Exchange", Icon: ArrowLeftRight },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full md:hidden">
      <div className="mx-3 mb-3 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.10)]">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className="relative flex flex-col items-center gap-1 px-4 py-1.5"
              >
                {active && (
                  <span className="absolute inset-0 rounded-xl bg-brand/10" />
                )}
                <Icon
                  className={`relative h-5 w-5 transition-colors ${
                    active ? "text-brand" : "text-gray-400"
                  }`}
                />
                <span
                  className={`relative text-[10px] font-medium transition-colors ${
                    active ? "text-brand" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
