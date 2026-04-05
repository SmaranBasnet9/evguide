"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  description?: string;
};

export default function LoginModal({
  open,
  onClose,
  onSuccess,
  title = "Sign in required",
  description = "Log in to continue with this action.",
}: LoginModalProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!open) {
    return null;
  }

  const handlePasswordLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setMessage("");
    onSuccess?.();
    onClose();
    router.refresh();
  };

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.href,
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-cyan-300/20 bg-[radial-gradient(140%_120%_at_20%_0%,rgba(56,189,248,0.18),transparent_45%),radial-gradient(120%_140%_at_100%_0%,rgba(14,165,233,0.12),transparent_55%),#0f172a] p-6 shadow-[0_0_35px_rgba(56,189,248,0.2)]">
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">EV Guide Secure Access</p>
            <h3 className="mt-2 text-2xl font-bold text-white">{title}</h3>
            <p className="mt-1 text-sm text-slate-300">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-600 px-3 py-1 text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            Close
          </button>
        </div>

        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full rounded-2xl border border-slate-500/40 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full rounded-2xl border border-slate-500/40 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-600" />
          <p className="text-xs uppercase tracking-wider text-slate-400">or continue with</p>
          <div className="h-px flex-1 bg-slate-600" />
        </div>

        <div className="grid gap-3">
          <button
            type="button"
            onClick={() => handleOAuthLogin("google")}
            disabled={loading}
            className="rounded-2xl border border-slate-500/40 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-100 hover:border-cyan-300 hover:bg-slate-800 disabled:opacity-60"
          >
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuthLogin("apple")}
            disabled={loading}
            className="rounded-2xl border border-slate-500/40 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-100 hover:border-cyan-300 hover:bg-slate-800 disabled:opacity-60"
          >
            Continue with Apple
          </button>
        </div>

        {message ? <p className="mt-4 text-sm text-rose-300">{message}</p> : null}
      </div>
    </div>
  );
}
