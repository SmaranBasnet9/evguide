"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function DealerForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dealer-reset-password`,
    });

    if (err) { setError(err.message); setLoading(false); return; }
    setSent(true);
    setLoading(false);
  }

  return (
    <main
      style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}
      className="flex items-center justify-center px-4 py-16"
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div className="mb-8 text-center">
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "56px", height: "56px", backgroundColor: "#1FBF9F", borderRadius: "16px", marginBottom: "16px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 style={{ color: "#ffffff", fontSize: "24px", fontWeight: "800", letterSpacing: "-0.5px", margin: "0 0 6px 0", fontFamily: "system-ui, -apple-system, sans-serif" }}>
            Reset Password
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", margin: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
            Dealer Portal · EV Guide
          </p>
        </div>

        <div style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "32px" }}>
          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "48px", height: "48px", backgroundColor: "rgba(31,191,159,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1FBF9F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p style={{ color: "#ffffff", fontWeight: "700", fontSize: "16px", margin: "0 0 8px", fontFamily: "system-ui, sans-serif" }}>Check your email</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: "0 0 24px", fontFamily: "system-ui, sans-serif" }}>
                We sent a password reset link to <strong style={{ color: "rgba(255,255,255,0.8)" }}>{email}</strong>
              </p>
              <Link href="/dealer-login" style={{ color: "#1FBF9F", fontWeight: "600", fontSize: "14px", textDecoration: "none", fontFamily: "system-ui, sans-serif" }}>
                ← Back to Dealer Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", margin: 0, fontFamily: "system-ui, sans-serif" }}>
                Enter your dealer account email and we&apos;ll send a reset link.
              </p>
              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: "600", marginBottom: "8px", fontFamily: "system-ui, sans-serif" }}>Email address</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="dealer@example.com"
                  style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "12px 16px", color: "#ffffff", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "system-ui, sans-serif" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#1FBF9F"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(31,191,159,0.15)"; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
              {error && <div style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "12px 16px", color: "#fca5a5", fontSize: "13px", fontFamily: "system-ui, sans-serif" }}>{error}</div>}
              <button type="submit" disabled={loading}
                style={{ width: "100%", backgroundColor: loading ? "rgba(31,191,159,0.5)" : "#1FBF9F", color: "#ffffff", border: "none", borderRadius: "12px", padding: "14px", fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", fontFamily: "system-ui, sans-serif" }}
              >
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
              <Link href="/dealer-login" style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "13px", textDecoration: "none", fontFamily: "system-ui, sans-serif" }}>
                ← Back to Dealer Login
              </Link>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
