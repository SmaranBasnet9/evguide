import Link from "next/link";

const ACTIONS = [
  {
    icon: "⚡",
    title: "Compare EVs",
    desc: "Side-by-side specs, range, price, and charging times for all major models.",
    href: "/compare",
    iconBg: "bg-blue-50 text-blue-600 border-blue-100",
    cta: "text-blue-600",
  },
  {
    icon: "£",
    title: "Calculate EMI",
    desc: "Estimate monthly payments instantly with your deposit, tenure, and APR.",
    href: "/finance",
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    cta: "text-emerald-600",
  },
  {
    icon: "🏦",
    title: "Loan Offers",
    desc: "Browse the latest UK bank EV finance rates and apply in minutes.",
    href: "/finance",
    iconBg: "bg-purple-50 text-purple-600 border-purple-100",
    cta: "text-purple-600",
  },
  {
    icon: "★",
    title: "Owner Reviews",
    desc: "Trusted, verified stories from real UK EV owners — no paid posts.",
    href: "/blog",
    iconBg: "bg-amber-50 text-amber-600 border-amber-100",
    cta: "text-amber-600",
  },
];

export default function QuickActionsSection() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ACTIONS.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl border text-xl ${action.iconBg}`}
              >
                {action.icon}
              </span>
              <div>
                <p className="font-bold text-slate-900">{action.title}</p>
                <p className="mt-1 text-sm leading-5 text-slate-500">{action.desc}</p>
              </div>
              <p className={`mt-auto text-sm font-semibold transition group-hover:underline ${action.cta}`}>
                Get started →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
