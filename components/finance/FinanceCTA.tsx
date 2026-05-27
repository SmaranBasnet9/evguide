import Link from "next/link";
import { ArrowRight, Bot, CarFront, HandCoins } from "lucide-react";

const actions = [
  {
    title: "Request a guided finance follow-up",
    description: "Share your interest and we can help you move from estimate to a real-world next step.",
    href: "/recommend",
    icon: HandCoins,
    primary: true,
  },
  {
    title: "Start Match",
    description: "Let the platform suggest the EV and structure that fits your budget best.",
    href: "/assistant",
    icon: Bot,
    primary: false,
  },
  {
    title: "Compare Finance-Friendly EVs",
    description: "Explore lower-pressure alternatives without losing momentum.",
    href: "/vehicles",
    icon: CarFront,
    primary: false,
  },
];

export default function FinanceCTA() {
  return (
    <section className="bg-white py-16 pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-[2.5rem] border border-gray-200 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-8 shadow-lg md:p-12">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
              Next Step
            </span>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-gray-900 md:text-5xl">
              Turn the affordability signal into action.
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              You now have an indicative monthly cost. The next move is refining the shortlist,
              checking real-world affordability, or asking for a follow-up conversation.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className={`group rounded-[2rem] border p-6 transition duration-300 ${
                    action.primary
                      ? "border-emerald-300 bg-emerald-50 hover:bg-emerald-100"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-gray-900">{action.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-500">{action.description}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
                    Continue
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
