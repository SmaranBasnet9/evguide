"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function PremiumNavbar() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  return (
    <nav
      className={`fixed top-0 z-50 w-full backdrop-blur-2xl transition-all duration-300 ${
        scrolled
          ? "border-b border-white/8 bg-white/[0.06] shadow-[0_1px_0_0_rgba(255,255,255,0.04),0_8px_32px_rgba(0,0,0,0.4)]"
          : "border-b border-transparent bg-white/[0.02]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            {/* Custom EV bolt logo mark */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect width="28" height="28" rx="8" fill="#1FBF9F" />
              <path d="M16 4L8 15.5H14L12 24L20 12.5H14L16 4Z" fill="white" />
            </svg>
            <span className="text-lg font-bold tracking-tight text-white transition-colors group-hover:text-brand">
              EVGuide
            </span>
          </Link>

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
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(31,191,159,0.3)] transition-all hover:bg-brand-hover hover:shadow-[0_0_28px_rgba(31,191,159,0.4)] sm:px-5"
            >
              Start Match
            </Link>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-white/60 transition hover:border-white/20 hover:text-white md:hidden"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="border-t border-white/8 bg-white/[0.06] backdrop-blur-2xl md:hidden"
          >
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
              <nav className="flex flex-col gap-1">
                {[
                  { href: "/vehicles", label: "Vehicles" },
                  { href: "/compare", label: "Compare" },
                  { href: "/finance", label: "Finance" },
                  { href: "/charging", label: "Charging" },
                  { href: "/blog", label: "Blog" },
                  { href: "/exchange", label: "Exchange", accent: true },
                ].map(({ href, label, accent }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${accent ? "text-amber-400 hover:bg-amber-400/10" : "text-white/70 hover:bg-white/[0.06] hover:text-white"}`}
                  >
                    {label}
                  </Link>
                ))}
                <div className="mt-2 border-t border-white/8 pt-2">
                  {!authLoading && (
                    isLoggedIn ? (
                      <button
                        type="button"
                        onClick={() => { handleSignOut(); setMenuOpen(false); }}
                        className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-400/80 transition hover:bg-red-400/10 hover:text-red-400"
                      >
                        Log out
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-xl px-4 py-3 text-sm font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white"
                      >
                        Log in
                      </Link>
                    )
                  )}
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
