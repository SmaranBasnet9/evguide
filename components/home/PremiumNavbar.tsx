"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function PremiumNavbar() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let rafId: number;
    function onScroll() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setScrolled(window.scrollY > 16));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(rafId); };
  }, []);

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

  const NAV_LINKS = [
    { href: "/vehicles",  label: "Vehicles" },
    { href: "/used-evs",  label: "Used EVs" },
    { href: "/finance",   label: "Finance" },
    { href: "/charging",  label: "Charging" },
    { href: "/compare",   label: "Compare" },
  ];

  return (
    <nav
      className={`fixed top-0 z-50 w-full backdrop-blur-2xl transition-all duration-300 ${
        scrolled
          ? "border-b border-gray-200 bg-white/95 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
          : "border-b border-transparent bg-white/80"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="group flex shrink-0 items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect width="28" height="28" rx="8" fill="var(--brand)" />
              <path d="M16 4L8 15.5H14L12 24L20 12.5H14L16 4Z" fill="white" />
            </svg>
            <span className="text-lg font-bold tracking-tight text-gray-900 transition-colors group-hover:text-brand">
              EVGuide
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
              >
                {label}
              </Link>
            ))}
            <Link href="/exchange" className="text-sm font-semibold text-amber-500 transition-colors hover:text-amber-600">
              Exchange
            </Link>
          </div>

          {/* Desktop right actions */}
          <div className="hidden items-center gap-3 md:flex">
            {!authLoading && (
              isLoggedIn ? (
                <button type="button" onClick={handleSignOut} className="text-sm font-medium text-gray-400 transition-colors hover:text-red-500">
                  Log out
                </button>
              ) : (
                <Link href="/login" className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">
                  Log in
                </Link>
              )
            )}
            <Link
              href="/ai-match"
              className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(31,191,159,0.25)] transition-all hover:bg-brand-hover"
            >
              Start Match
            </Link>
          </div>

          {/* Mobile: hamburger only */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500 transition hover:border-gray-300 hover:text-gray-900 md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile full-screen menu */}
      <div
        className={`border-t border-gray-200 bg-white md:hidden transition-all duration-150 ease-out ${
          menuOpen ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-1 absolute w-full -z-10"
        }`}
      >
            <div className="px-4 pb-6 pt-4">
              {/* Primary CTA */}
              <Link
                href="/ai-match"
                onClick={() => setMenuOpen(false)}
                className="mb-4 flex w-full items-center justify-center rounded-2xl bg-brand py-3.5 text-sm font-bold text-white shadow-[0_0_24px_rgba(31,191,159,0.25)]"
              >
                Start AI Match
              </Link>

              {/* Nav links */}
              <nav className="flex flex-col">
                {NAV_LINKS.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center border-b border-gray-100 py-3.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                  >
                    {label}
                  </Link>
                ))}
                <Link
                  href="/exchange"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center border-b border-gray-100 py-3.5 text-sm font-semibold text-amber-500"
                >
                  Exchange
                </Link>
              </nav>

              {/* Auth */}
              <div className="mt-4">
                {!authLoading && (
                  isLoggedIn ? (
                    <button
                      type="button"
                      onClick={() => { handleSignOut(); setMenuOpen(false); }}
                      className="w-full rounded-xl border border-red-200 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
                    >
                      Log out
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full rounded-xl border border-gray-200 py-3 text-center text-sm font-medium text-gray-500 transition hover:border-gray-300 hover:text-gray-900"
                    >
                      Log in
                    </Link>
                  )
                )}
              </div>
            </div>
      </div>
    </nav>
  );
}
