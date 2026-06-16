"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Building2, Eye, EyeOff, Check, Lock, User } from "lucide-react";

type DealerProfile = {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  postcode: string;
  fca_frn: string | null;
  website: string | null;
  // Extended columns (added by PENDING_MIGRATIONS.sql)
  company_registration_number?: string | null;
  vat_number?: string | null;
  trading_name?: string | null;
  status: string;
  created_at: string;
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  approved:         { label: "Approved",         color: "#1FBF9F" },
  pending_approval: { label: "Pending review",   color: "#f59e0b" },
  rejected:         { label: "Rejected",         color: "#ef4444" },
  suspended:        { label: "Suspended",        color: "#f97316" },
};

export default function DealerSettingsClient({
  profile,
  userEmail,
}: {
  profile: DealerProfile;
  userEmail: string;
}) {
  const supabase = createClient();

  // password change state
  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [showCur,    setShowCur]    = useState(false);
  const [showNew,    setShowNew]    = useState(false);
  const [pwLoading,  setPwLoading]  = useState(false);
  const [pwError,    setPwError]    = useState("");
  const [pwSuccess,  setPwSuccess]  = useState(false);

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwSuccess(false);

    if (newPw !== confirmPw) { setPwError("New passwords do not match."); return; }
    if (newPw.length < 8)    { setPwError("New password must be at least 8 characters."); return; }
    if (newPw === currentPw) { setPwError("New password must be different from your current password."); return; }

    setPwLoading(true);

    // Re-authenticate with current password to verify identity
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: currentPw,
    });

    if (signInErr) {
      setPwError("Current password is incorrect.");
      setPwLoading(false);
      return;
    }

    // Update to new password
    const { error: updateErr } = await supabase.auth.updateUser({ password: newPw });

    if (updateErr) {
      setPwError(updateErr.message);
      setPwLoading(false);
      return;
    }

    setPwSuccess(true);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setPwLoading(false);
    setTimeout(() => setPwSuccess(false), 4000);
  }

  const status = STATUS_LABEL[profile.status] ?? { label: profile.status, color: "rgba(255,255,255,0.4)" };

  const FONT = "system-ui, -apple-system, sans-serif";

  return (
    <div style={{ maxWidth: "720px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ color: "#ffffff", fontSize: "28px", fontWeight: "800", letterSpacing: "-0.5px", margin: "0 0 6px", fontFamily: FONT }}>Settings</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0, fontFamily: FONT }}>Manage your dealer account</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* ── Dealer profile info ── */}
        <section style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "rgba(31,191,159,0.15)", border: "1px solid rgba(31,191,159,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Building2 style={{ width: "16px", height: "16px", color: "#1FBF9F" }} />
            </div>
            <div>
              <h2 style={{ color: "#ffffff", fontSize: "15px", fontWeight: "700", margin: 0, fontFamily: FONT }}>Business profile</h2>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", margin: 0, fontFamily: FONT }}>Read-only — contact support to update</p>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <span style={{ backgroundColor: `${status.color}18`, border: `1px solid ${status.color}40`, borderRadius: "20px", padding: "4px 12px", color: status.color, fontSize: "12px", fontWeight: "700", fontFamily: FONT }}>
                {status.label}
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { label: "Company name",  value: profile.company_name },
              { label: "Contact name",  value: profile.contact_name },
              { label: "Business email", value: profile.email },
              { label: "Phone",          value: profile.phone },
              { label: "Address",        value: [profile.address_line1, profile.address_line2, profile.city, profile.postcode].filter(Boolean).join(", ") },
              ...(profile.company_registration_number != null ? [{ label: "Company reg. number", value: profile.company_registration_number || "—" }] : []),
              ...(profile.vat_number        != null ? [{ label: "VAT number",   value: profile.vat_number        || "—" }] : []),
              ...(profile.trading_name      != null ? [{ label: "Trading name", value: profile.trading_name      || "—" }] : []),
              { label: "FCA/FRN", value: profile.fca_frn   ?? "—" },
              { label: "Website", value: profile.website   ?? "—" },
            ].map(({ label, value }) => (
              <div key={label} style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "12px 14px" }}>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 4px", fontFamily: FONT }}>{label}</p>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", fontWeight: "600", margin: 0, fontFamily: FONT, wordBreak: "break-word" }}>{value}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "16px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "12px 14px" }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 4px", fontFamily: FONT }}>Login email</p>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", fontWeight: "600", margin: 0, fontFamily: FONT }}>{userEmail}</p>
          </div>

          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", margin: "16px 0 0", fontFamily: FONT }}>
            Member since {new Date(profile.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.
            To update business details, email <span style={{ color: "rgba(255,255,255,0.5)" }}>support@evguide.co.uk</span>.
          </p>
        </section>

        {/* ── Change password ── */}
        <section style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "rgba(31,191,159,0.15)", border: "1px solid rgba(31,191,159,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lock style={{ width: "16px", height: "16px", color: "#1FBF9F" }} />
            </div>
            <div>
              <h2 style={{ color: "#ffffff", fontSize: "15px", fontWeight: "700", margin: 0, fontFamily: FONT }}>Change password</h2>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", margin: 0, fontFamily: FONT }}>Update your login password</p>
            </div>
          </div>

          {pwSuccess && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "rgba(31,191,159,0.1)", border: "1px solid rgba(31,191,159,0.3)", borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
              <Check style={{ width: "16px", height: "16px", color: "#1FBF9F", flexShrink: 0 }} />
              <p style={{ color: "#1FBF9F", fontSize: "14px", fontWeight: "600", margin: 0, fontFamily: FONT }}>Password updated successfully.</p>
            </div>
          )}

          <form onSubmit={handlePasswordChange} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Current password */}
            <div>
              <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: "600", marginBottom: "8px", fontFamily: FONT }}>
                Current password <span style={{ color: "#1FBF9F" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showCur ? "text" : "password"}
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  required
                  placeholder="Your current password"
                  style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "12px 44px 12px 16px", color: "#ffffff", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: FONT }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#1FBF9F"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(31,191,159,0.15)"; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowCur((v) => !v)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 0 }}>
                  {showCur ? <EyeOff style={{ width: "16px", height: "16px" }} /> : <Eye style={{ width: "16px", height: "16px" }} />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div>
              <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: "600", marginBottom: "8px", fontFamily: FONT }}>
                New password <span style={{ color: "#1FBF9F" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showNew ? "text" : "password"}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "12px 44px 12px 16px", color: "#ffffff", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: FONT }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#1FBF9F"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(31,191,159,0.15)"; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowNew((v) => !v)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 0 }}>
                  {showNew ? <EyeOff style={{ width: "16px", height: "16px" }} /> : <Eye style={{ width: "16px", height: "16px" }} />}
                </button>
              </div>
            </div>

            {/* Confirm new password */}
            <div>
              <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: "600", marginBottom: "8px", fontFamily: FONT }}>
                Confirm new password <span style={{ color: "#1FBF9F" }}>*</span>
              </label>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                required
                placeholder="Re-enter new password"
                style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px", padding: "12px 16px", color: "#ffffff", fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: FONT }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#1FBF9F"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(31,191,159,0.15)"; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            {pwError && (
              <div style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "12px 16px", color: "#fca5a5", fontSize: "13px", fontFamily: FONT }}>
                {pwError}
              </div>
            )}

            <button
              type="submit"
              disabled={pwLoading || !currentPw || !newPw || !confirmPw}
              style={{
                width: "100%",
                backgroundColor: pwLoading ? "rgba(31,191,159,0.5)" : "#1FBF9F",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                padding: "14px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: pwLoading || !currentPw || !newPw || !confirmPw ? "not-allowed" : "pointer",
                fontFamily: FONT,
                opacity: !currentPw || !newPw || !confirmPw ? 0.5 : 1,
                transition: "background-color 0.15s",
              }}
            >
              {pwLoading ? "Updating password…" : "Update password"}
            </button>

            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", textAlign: "center", margin: 0, fontFamily: FONT }}>
              Forgot your current password?{" "}
              <a href="/dealer-forgot-password" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "underline" }}>
                Reset via email
              </a>
            </p>
          </form>
        </section>

        {/* ── Account info ── */}
        <section style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "rgba(31,191,159,0.15)", border: "1px solid rgba(31,191,159,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User style={{ width: "16px", height: "16px", color: "#1FBF9F" }} />
            </div>
            <h2 style={{ color: "#ffffff", fontSize: "15px", fontWeight: "700", margin: 0, fontFamily: FONT }}>Account</h2>
          </div>
          <div style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "14px 16px" }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 4px", fontFamily: FONT }}>Login email</p>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: "600", margin: 0, fontFamily: FONT }}>{userEmail}</p>
          </div>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", margin: "12px 0 0", fontFamily: FONT }}>
            To change your login email address, contact <span style={{ color: "rgba(255,255,255,0.45)" }}>support@evguide.co.uk</span>.
          </p>
        </section>

      </div>
    </div>
  );
}
