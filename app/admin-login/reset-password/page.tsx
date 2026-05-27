"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

type Stage = "exchanging" | "form" | "success" | "error";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [stage, setStage] = useState<Stage>("exchanging");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Exchange the PKCE code from the email link for a valid session
  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setErrorMsg("No reset code found. Please request a new password reset link.");
      setStage("error");
      return;
    }

    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) {
          setErrorMsg(error.message);
          setStage("error");
        } else {
          setStage("form");
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      setStage("success");
    }
  };

  return (
    <main className="min-h-screen bg-surface-base px-6 py-16 text-white">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_32px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">

        {stage === "exchanging" && (
          <>
            <h1 className="text-3xl font-bold">Verifying link</h1>
            <p className="mt-2 text-sm text-white/60">Checking your reset token...</p>
            <div className="mt-8 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-brand" />
            </div>
          </>
        )}

        {stage === "error" && (
          <>
            <div className="flex items-center gap-3">
              <XCircle className="h-7 w-7 shrink-0 text-red-400" />
              <h1 className="text-2xl font-bold">Link expired</h1>
            </div>
            <p className="mt-3 text-sm text-white/60">{errorMsg}</p>
            <a
              href="/admin-login/forgot-password"
              className="mt-6 inline-block w-full rounded-xl bg-brand px-5 py-3 text-center font-semibold text-white hover:bg-brand-hover"
            >
              Request new reset link
            </a>
            <div className="mt-4 text-center">
              <a href="/admin-login" className="text-sm text-white/40 hover:text-white/70 transition-colors">
                Back to sign in
              </a>
            </div>
          </>
        )}

        {stage === "form" && (
          <>
            <h1 className="text-3xl font-bold">Set new password</h1>
            <p className="mt-2 text-sm text-white/60">
              Choose a strong password for your admin account.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm text-white/60">New password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 pr-11 text-white placeholder:text-white/40 focus:border-brand focus:outline-none"
                    placeholder="Min. 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/60">Confirm password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 pr-11 text-white placeholder:text-white/40 focus:border-brand focus:outline-none"
                    placeholder="Re-enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {errorMsg ? <p className="text-sm text-red-400">{errorMsg}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-hover disabled:opacity-60"
              >
                {loading ? "Updating..." : "Set new password"}
              </button>
            </form>
          </>
        )}

        {stage === "success" && (
          <>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-7 w-7 shrink-0 text-brand" />
              <h1 className="text-2xl font-bold">Password updated</h1>
            </div>
            <p className="mt-3 text-sm text-white/60">
              Your password has been changed. You can now sign in with your new password.
            </p>
            <button
              onClick={() => router.push("/admin-login")}
              className="mt-6 w-full rounded-xl bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-hover"
            >
              Go to sign in
            </button>
          </>
        )}
      </div>
    </main>
  );
}
