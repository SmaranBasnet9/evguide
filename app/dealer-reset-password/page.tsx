"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DealerResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState("");
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenHash = params.get("token_hash");
    const type = params.get("type");

    if (tokenHash && type === "recovery") {
      supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" })
        .then(({ error: err }) => {
          if (err) setError("Reset link is invalid or has expired. Please request a new one.");
          setVerifying(false);
        });
    } else {
      // Hash fragment flow — listen for event
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") setVerifying(false);
      });
      // Show form anyway after brief wait so token in hash can be processed
      const t = setTimeout(() => setVerifying(false), 1500);
      return () => { subscription.unsubscribe(); clearTimeout(t); };
    }
  }, [supabase]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8)  { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setError("");

    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) { setError(err.message); setLoading(false); return; }

    setDone(true);
    setTimeout(() => router.push("/dealer-login"), 2500);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", backgroundColor: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px",
    padding: "12px 16px", color: "#ffffff", fontSize: "14px",
    outline: "none", boxSizing: "border-box", fontFamily: "system-ui, sans-serif",
  };

  return (
    <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }} className="flex items-center justify-center px-4 py-16">
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div className="mb-8 text-center">
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "56px", height: "56px", backgroundColor: "#1FBF9F", borderRadius: "16px", marginBottom: "16px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 style={{ color: "#ffffff", fontSize: "24px", fontWeight: "800", letterSpacing: "-0.5px", margin: "0 0 6px 0", fontFamily: "system-ui, sans-serif" }}>New Password</h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", margin: 0, fontFamily: "system-ui, sans-serif" }}>Dealer Portal · EV Guide</p>
        </div>

        <div style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "32px" }}>
          {done ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "48px", height: "48px", backgroundColor: "rgba(31,191,159,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1FBF9F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p style={{ color: "#ffffff", fontWeight: "700", fontSize: "16px", margin: "0 0 8px", fontFamily: "system-ui, sans-serif" }}>Password updated!</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0, fontFamily: "system-ui, sans-serif" }}>Redirecting to dealer login…</p>
            </div>
          ) : verifying ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0, fontFamily: "system-ui, sans-serif" }}>Verifying reset link…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: "600", marginBottom: "8px", fontFamily: "system-ui, sans-serif" }}>New password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="Min. 8 characters" style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#1FBF9F"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(31,191,159,0.15)"; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: "600", marginBottom: "8px", fontFamily: "system-ui, sans-serif" }}>Confirm password</label>
                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required placeholder="Re-enter password" style={inputStyle}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#1FBF9F"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(31,191,159,0.15)"; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
              {error && <div style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "12px 16px", color: "#fca5a5", fontSize: "13px", fontFamily: "system-ui, sans-serif" }}>{error}</div>}
              <button type="submit" disabled={loading}
                style={{ width: "100%", backgroundColor: loading ? "rgba(31,191,159,0.5)" : "#1FBF9F", color: "#ffffff", border: "none", borderRadius: "12px", padding: "14px", fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", fontFamily: "system-ui, sans-serif" }}
              >
                {loading ? "Updating…" : "Set New Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
