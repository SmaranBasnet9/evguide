import Link from "next/link";
import {
  Zap, BarChart3, Shield, CheckCircle,
  ArrowRight, Sparkles, TrendingUp, Users, ListChecks,
} from "lucide-react";
import PremiumNavbar from "@/components/home/PremiumNavbar";
import PremiumFooter from "@/components/home/PremiumFooter";

const STEPS = [
  {
    icon: Users,
    title: "1. Register your dealership",
    desc: "Create a dealer account with your company details and verification documents.",
  },
  {
    icon: ListChecks,
    title: "2. Get approved & list stock",
    desc: "Our team reviews your application, then you can list new and used EVs with full specs, charging data, and images.",
  },
  {
    icon: TrendingUp,
    title: "3. Reach EV buyers",
    desc: "Your live listings appear on the EVGuide marketplace and homepage, matched to buyers via our EV-native AI.",
  },
];

const BENEFITS = [
  { icon: Sparkles,   title: "EV-native marketplace",  desc: "Buyers are matched to your stock using range, charging, and running-cost intelligence — not just price and mileage." },
  { icon: TrendingUp, title: "Qualified leads",         desc: "Enquiries and test-drive requests land directly in your dealer dashboard, ready to action." },
  { icon: BarChart3,  title: "Inventory & analytics",   desc: "Track views, enquiries, and listing performance for every vehicle you list." },
  { icon: Shield,     title: "Verified & trusted",      desc: "All dealers are verified before going live, building buyer trust in your listings." },
];

export default function DealersPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <PremiumNavbar />

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-20">

        {/* Hero */}
        <div className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/8 px-4 py-2 text-xs font-semibold text-brand mb-6">
            <Zap className="h-3.5 w-3.5" />
            EVGuide for Dealers
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight leading-tight text-gray-900">
            List your EV stock on the UK&apos;s EV-specialist marketplace.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500 leading-relaxed">
            Reach buyers who are actively comparing range, charging speed, and running costs — not just generic listings. Manage your inventory, enquiries, and test drives from one dealer dashboard.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dealer/register"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              Register your dealership <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dealer-login"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-6 py-3 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:text-gray-900"
            >
              Already a dealer? Sign in
            </Link>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-14">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">How it works</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">Get listed in three steps</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 border border-brand/20">
                  <Icon className="h-5 w-5 text-brand" />
                </div>
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="mt-2 text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-14">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">Why EVGuide</p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900">Built for EV-first selling</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <Icon className="mb-3 h-5 w-5 text-brand/70" />
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="mt-2 text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What you can list */}
        <div className="mb-14 rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
          <CheckCircle className="mx-auto mb-3 h-8 w-8 text-brand/70" />
          <h2 className="text-xl font-bold text-gray-900">List both new and used EVs</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-gray-500">
            New stock appears in the main vehicle catalogue and homepage; used stock appears on the Used EVs marketplace. Each listing can include range, charging specs, VIN, and condition — and updates instantly once approved.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center pt-2">
          <Link
            href="/dealer/register"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-4 text-base font-bold text-white transition hover:bg-brand-hover"
          >
            Register your dealership <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-xs text-gray-400">Free to register · Verification required before listings go live</p>
        </div>

      </div>

      <PremiumFooter />
    </main>
  );
}
