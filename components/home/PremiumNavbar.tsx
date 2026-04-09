import Link from "next/link";
import { Zap } from "lucide-react";

export default function PremiumNavbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0B0B0B]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-emerald-400" />
            <Link href="/" className="text-xl font-bold tracking-tight text-white transition-colors hover:text-emerald-400">
              EVGuide<span className="text-emerald-400"> AI</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/vehicles" className="text-sm font-medium text-zinc-300 transition-colors hover:text-emerald-400">Vehicles</Link>
            <Link href="/compare" className="text-sm font-medium text-zinc-300 transition-colors hover:text-emerald-400">Compare</Link>
            <Link href="/finance" className="text-sm font-medium text-zinc-300 transition-colors hover:text-emerald-400">Finance</Link>
            <Link href="/ai-match" className="text-sm font-medium text-zinc-300 transition-colors hover:text-emerald-400">AI Match</Link>
            <Link href="/blog" className="text-sm font-medium text-zinc-300 transition-colors hover:text-emerald-400">Blog</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden text-sm font-medium text-zinc-300 transition-colors hover:text-white sm:block">
              Log in
            </Link>
            <Link href="/ai-match" className="rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.28)] hover:shadow-[0_0_28px_rgba(16,185,129,0.38)]">
              Start AI Match
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
