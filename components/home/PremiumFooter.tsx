import Link from "next/link";
import { Globe, Mail, MessageCircle, Zap } from "lucide-react";

function EvGuideLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="28" height="28" rx="8" fill="#1FBF9F" />
      <path d="M16 4L8 15.5H14L12 24L20 12.5H14L16 4Z" fill="white" />
    </svg>
  );
}
import CookieSettingsButton from "@/components/legal/CookieSettingsButton";
import GradientDivider from "@/components/design-system/GradientDivider";

const LINKS = {
  Platform: [
    { href: "/vehicles", label: "Vehicles" },
    { href: "/compare", label: "Compare EVs" },
    { href: "/ai-match", label: "AI Match" },
    { href: "/finance", label: "Check affordability" },
    { href: "/charging", label: "Charging" },
    { href: "/exchange", label: "Exchange" },
  ],
  Resources: [
    { href: "/blog", label: "Blog" },
    { href: "/blog", label: "Buying Guides" },
    { href: "/finance", label: "Affordability Tools" },
    { href: "/support", label: "Support" },
  ],
  Company: [
    { href: "/support", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/cookies", label: "Cookie Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export default function PremiumFooter() {
  return (
    <footer className="border-t border-white/6 bg-[#080808] pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">

          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="mb-6 flex items-center gap-2">
              <EvGuideLogo />
              <span className="text-xl font-bold tracking-tight text-white">EVGuide</span>
            </Link>
            <p className="mb-8 max-w-sm text-sm leading-7 text-white/40">
              The premium EV decision platform for UK buyers. Use AI Match, Compare EVs, and
              finance tools to choose with confidence.
            </p>
            <div className="flex items-center gap-3">
              {[MessageCircle, Globe, Mail].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-white/[0.04] text-white/40 transition-all hover:border-brand/30 hover:bg-brand/10 hover:text-brand"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="mb-6 text-sm font-semibold text-white">{heading}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/40 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                {heading === "Company" && (
                  <li>
                    <CookieSettingsButton className="text-sm text-white/40 transition-colors hover:text-white" />
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        <GradientDivider color="muted" />

        <div className="mt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-white/25">
            &copy; {new Date().getFullYear()} EVGuide. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-white/25">
            Built for smarter EV decisions
            <Zap className="h-3 w-3 text-brand" />
          </div>
        </div>
      </div>
    </footer>
  );
}
