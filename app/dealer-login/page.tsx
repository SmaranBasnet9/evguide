"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function DealerLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, dealer_status")
      .eq("id", authData.user.id)
      .single();

    const isDealer =
      profile?.role === "dealer" ||
      profile?.dealer_status === "approved" ||
      profile?.dealer_status === "pending_approval";

    if (!isDealer) {
      await supabase.auth.signOut();
      setError("This account does not have dealer access. Contact support or apply below.");
      setLoading(false);
      return;
    }

    void fetch("/api/user/session-log", { method: "POST", headers: { "Content-Type": "application/json" } }).catch(() => null);
    router.push("/dealer");
    router.refresh();
  }

  return (
    <main
      style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }}
      className="flex items-center justify-center px-4 py-16"
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo mark */}
        <div className="mb-8 text-center">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              backgroundColor: "#1FBF9F",
              borderRadius: "16px",
              marginBottom: "16px",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <h1 style={{ color: "#ffffff", fontSize: "24px", fontWeight: "800", letterSpacing: "-0.5px", margin: "0 0 6px 0", fontFamily: "system-ui, -apple-system, sans-serif" }}>
            Dealer Portal
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", margin: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
            Sign in to manage your listings
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: "#1A1A1A",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "32px",
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Email */}
            <div>
              <label
                style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: "600", marginBottom: "8px", fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="dealer@example.com"
                style={{
                  width: "100%",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#1FBF9F"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(31,191,159,0.15)"; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: "600", marginBottom: "8px", fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  color: "#ffffff",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#1FBF9F"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(31,191,159,0.15)"; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  backgroundColor: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  color: "#fca5a5",
                  fontSize: "13px",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: loading ? "rgba(31,191,159,0.5)" : "#1FBF9F",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                padding: "14px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "system-ui, -apple-system, sans-serif",
                letterSpacing: "-0.2px",
                transition: "background-color 0.15s",
              }}
            >
              {loading ? "Signing in…" : "Sign in to Dealer Portal"}
            </button>
          </form>

          {/* Links */}
          <div
            style={{
              marginTop: "24px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
              <Link href="/dealer-forgot-password" style={{ color: "rgba(255,255,255,0.55)", fontWeight: "600", textDecoration: "none" }}>
                Forgot your password?
              </Link>
            </p>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: "0 0 6px", fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: "600" }}>
                New to EV Guide?
              </p>
              <Link
                href="/dealer/register"
                style={{
                  display: "block",
                  textAlign: "center",
                  border: "1px solid rgba(31,191,159,0.4)",
                  borderRadius: "12px",
                  padding: "11px",
                  color: "#1FBF9F",
                  fontWeight: "700",
                  fontSize: "14px",
                  textDecoration: "none",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  transition: "background-color 0.15s",
                }}
              >
                Apply to become a dealer →
              </Link>
            </div>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", margin: 0, fontFamily: "system-ui, -apple-system, sans-serif", textAlign: "center" }}>
              Regular user?{" "}
              <Link href="/login" style={{ color: "rgba(255,255,255,0.5)", fontWeight: "600", textDecoration: "none" }}>
                Go to main sign in
              </Link>
            </p>
          </div>
        </div>

        {/* EV Guide branding */}
        <p style={{ textAlign: "center", marginTop: "24px", color: "rgba(255,255,255,0.2)", fontSize: "12px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
          EV Guide · Dealer Platform
        </p>
      </div>
    </main>
  );
}
