"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function PremiumNavbar() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAuth() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (mounted) {
          setIsLoggedIn(Boolean(user));
        }
      } catch {
        if (mounted) {
          setIsLoggedIn(false);
        }
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    }

    loadAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session?.user));
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/8 bg-[#0A0A0A]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-brand" />
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-white transition-colors hover:text-brand"
            >
              EVGuide
            </Link>
          </div>

          <div className="hidden items-center gap-7 md:flex">
            {[
              { href: "/vehicles", label: "Vehicles" },
              { href: "/compare", label: "Compare" },
              { href: "/finance", label: "Finance" },
              { href: "/charging", label: "Charging" },
              { href: "/blog", label: "Blog" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/exchange"
              className="text-sm font-semibold text-amber-400 transition-colors hover:text-amber-300"
            >
              Exchange
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {!authLoading &&
              (isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="hidden text-sm font-medium text-white/50 transition-colors hover:text-red-400 sm:block"
                >
                  Log out
                </button>
              ) : (
                <Link
                  href="/login"
                  className="hidden text-sm font-medium text-white/50 transition-colors hover:text-white sm:block"
                >
                  Log in
                </Link>
              ))}

            <Link
              href="/ai-match"
              className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(31,191,159,0.3)] transition-all hover:bg-brand-hover hover:shadow-[0_0_28px_rgba(31,191,159,0.4)]"
            >
              Start Match
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
