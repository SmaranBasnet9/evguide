"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Footer() {
  const supabase = useMemo(() => createClient(), []);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDealer, setIsDealer] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadAuth() {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        const user = data.user;
        setIsLoggedIn(Boolean(user));
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role, dealer_status")
            .eq("id", user.id)
            .single();
          if (mounted) {
            setIsDealer(profile?.role === "dealer" || profile?.dealer_status === "approved");
          }
        }
      } catch {
        if (mounted) setIsLoggedIn(false);
      }
    }

    loadAuth();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      setIsLoggedIn(Boolean(session?.user));
      if (!session?.user) { setIsDealer(false); return; }
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, dealer_status")
          .eq("id", session.user.id)
          .single();
        if (mounted) setIsDealer(profile?.role === "dealer" || profile?.dealer_status === "approved");
      } catch { if (mounted) setIsDealer(false); }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <h3 className="text-xl font-bold text-slate-900">EV Guide</h3>
        <p className="mt-2 text-sm text-slate-600">
          EV news, comparisons, finance tools, and insights.
        </p>

        <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-600">
          <Link href="/">Home</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/finance">Finance</Link>
          <Link href="/appointment">Reviews</Link>
          {isDealer && (
            <Link href="/dealer" className="font-semibold text-blue-600 hover:text-blue-700">
              Dealer Portal
            </Link>
          )}
          {!isLoggedIn && (
            <Link href="/dealer-login" className="font-semibold text-blue-600 hover:text-blue-700">
              Dealer Login
            </Link>
          )}
          {!isLoggedIn && <Link href="/login">Sign In</Link>}
          {!isLoggedIn && <Link href="/signup">Sign Up</Link>}
        </div>

        <p className="mt-6 text-xs text-slate-400">
          © 2026 EV Guide
        </p>
      </div>
    </footer>
  );
}