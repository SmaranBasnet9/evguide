import Link from "next/link";
import { Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";

export default async function PremiumNavbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-[#E5E7EB] bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-[#1FBF9F]" />
            <Link href="/" className="text-xl font-bold tracking-tight text-[#1A1A1A] transition-colors hover:text-[#1FBF9F]">
              EVGuide<span className="text-[#1FBF9F]"> AI</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/vehicles" className="text-sm font-medium text-[#374151] transition-colors hover:text-[#1FBF9F]">Vehicles</Link>
            <Link href="/compare" className="text-sm font-medium text-[#374151] transition-colors hover:text-[#1FBF9F]">Compare</Link>
            <Link href="/finance" className="text-sm font-medium text-[#374151] transition-colors hover:text-[#1FBF9F]">Finance</Link>
            <Link href="/charging" className="text-sm font-medium text-[#374151] transition-colors hover:text-[#1FBF9F]">Charging</Link>
            <Link href="/exchange" className="text-sm font-semibold text-amber-600 transition-colors hover:text-amber-700">Exchange</Link>
            <Link href="/ai-match" className="text-sm font-medium text-[#374151] transition-colors hover:text-[#1FBF9F]">AI Match</Link>
            <Link href="/blog" className="text-sm font-medium text-[#374151] transition-colors hover:text-[#1FBF9F]">Blog</Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <form action={signOut}>
                <button
                  type="submit"
                  className="hidden text-sm font-medium text-[#374151] transition-colors hover:text-red-500 sm:block"
                >
                  Log out
                </button>
              </form>
            ) : (
              <Link href="/login" className="hidden text-sm font-medium text-[#374151] transition-colors hover:text-[#1FBF9F] sm:block">
                Log in
              </Link>
            )}
            <Link href="/ai-match" className="rounded-full bg-[#1FBF9F] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#17A589] shadow-md">
              Start Match
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
