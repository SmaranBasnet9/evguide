"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo: `${window.location.origin}/admin-login/reset-password` }
    );

    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage("Check your email for a reset link");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-surface-base px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_32px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <h1 className="text-3xl font-bold">Reset password</h1>
        <p className="mt-2 text-sm text-white/60">
          Enter your admin email and we&apos;ll send you a reset link.
        </p>

        {message ? (
          <div className="mt-8 rounded-xl border border-brand/30 bg-brand/10 px-4 py-4 text-sm text-brand">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-white/60">Email</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white placeholder:text-white/40 focus:border-brand focus:outline-none"
                placeholder="admin@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}
          </form>
        )}

        <div className="mt-6 text-center">
          <a href="/admin-login" className="text-sm text-white/40 hover:text-white/70 transition-colors">
            Back to sign in
          </a>
        </div>
      </div>
    </main>
  );
}
