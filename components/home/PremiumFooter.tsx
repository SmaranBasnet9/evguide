import Link from "next/link";
import { Apple, Globe, Lock, Mail, MessageCircle, ShieldCheck, Smartphone, Zap } from "lucide-react";
import CookieSettingsButton from "@/components/legal/CookieSettingsButton";
import GradientDivider from "@/components/design-system/GradientDivider";
import FooterNewsletter from "@/components/home/FooterNewsletter";

function EvGuideLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="28" height="28" rx="8" fill="#1FBF9F" />
      <path d="M16 4L8 15.5H14L12 24L20 12.5H14L16 4Z" fill="white" />
    </svg>
  );
}

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
    { href: "/blog?category=buying-guides", label: "Buying Guides" },
    { href: "/finance?section=tools", label: "Affordability Tools" },
    { href: "/support", label: "Support" },
  ],
  Company: [
    { href: "/support", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/cookies", label: "Cookie Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/accessibility", label: "Accessibility" },
    { href: "https://status.evguide.co.uk", label: "Status", external: true },
  ],
};

const SOCIAL_LINKS = [
  { Icon: MessageCircle, label: "Chat with us" },
  { Icon: Globe, label: "Visit our website" },
  { Icon: Mail, label: "Email us" },
];

const TRUST_BADGES = [
  { Icon: ShieldCheck, label: "Secure & Private", sub: "Bank-grade encryption" },
  { Icon: Lock, label: "UK Company", sub: "Registered in England & Wales" },
  { Icon: Globe, label: "Finance info only", sub: "Not a financial adviser" },
];

export default function PremiumFooter() {
  return (
    <footer className="border-t border-white/6 bg-[#080808] pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Newsletter banner */}
        <div className="mb-16 flex flex-col gap-6 rounded-2xl border border-white/6 bg-white/[0.02] px-8 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="mb-1 text-base font-semibold text-white">Stay up to date</h3>
            <p className="text-sm text-white/40">EV news, buying guides, and new features — no spam.</p>
          </div>
          <FooterNewsletter />
        </div>

        {/* Main link grid */}
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

            {/* Social links */}
            <div className="mb-8 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ Icon, label }) => (
                <Link
                  key={label}
                  href="#"
                  aria-label={label}
                  onClick={(e) => e.preventDefault()}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-white/[0.04] text-white/40 transition-all hover:border-brand/30 hover:bg-brand/10 hover:text-brand"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>

            {/* App download placeholders */}
            <div className="flex flex-wrap gap-2">
              {[
                { Icon: Apple, label: "App Store" },
                { Icon: Smartphone, label: "Google Play" },
              ].map(({ Icon, label }) => (
                <span
                  key={label}
                  title="Coming soon"
                  className="flex cursor-default items-center gap-1.5 rounded-lg border border-white/6 bg-white/[0.03] px-3 py-1.5 text-xs text-white/20 select-none"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                  <span className="rounded bg-white/6 px-1 py-px text-[10px] text-white/15">Soon</span>
                </span>
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
                      {...("external" in link && link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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

        {/* Trust badges */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TRUST_BADGES.map(({ Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-3">
              <Icon className="h-4 w-4 shrink-0 text-brand/60" />
              <div>
                <p className="text-xs font-medium text-white/60">{label}</p>
                <p className="text-xs text-white/25">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        <GradientDivider color="muted" />

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-white/25">
              &copy; {new Date().getFullYear()} EVGuide Ltd. All rights reserved. Proudly built in the UK.
            </p>
            <div className="flex items-center gap-2 text-sm text-white/25">
              Built for smarter EV decisions
              <Zap className="h-3 w-3 text-brand" />
            </div>
          </div>
          {/* FCA disclaimer */}
          <p className="text-center text-xs leading-5 text-white/15 md:text-left">
            EVGuide is not a financial adviser. Finance comparisons and affordability estimates are for illustrative
            purposes only and do not constitute financial advice. EV range figures are manufacturer estimates under
            standardised test conditions and may vary in real-world use.
          </p>
        </div>

      </div>
    </footer>
  );
}
