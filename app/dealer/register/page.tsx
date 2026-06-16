"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const FONT = "system-ui, -apple-system, sans-serif";

const iStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "12px",
  padding: "12px 16px",
  color: "#ffffff",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: FONT,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "rgba(255,255,255,0.6)",
  fontSize: "13px",
  fontWeight: "600",
  marginBottom: "8px",
  fontFamily: FONT,
};

const DOCS = [
  { key: "company_registration",  label: "Company registration document", required: true  },
  { key: "proof_of_address",      label: "Trading address proof",          required: true  },
  { key: "motor_trade_insurance", label: "Motor trade insurance",           required: true  },
  { key: "vat_certificate",       label: "VAT certificate",                 required: false },
  { key: "fca_authorisation",     label: "FCA authorisation",               required: false },
] as const;

type DocKey = (typeof DOCS)[number]["key"];

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label} {required && <span style={{ color: "#1FBF9F" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function focus(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "#1FBF9F";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(31,191,159,0.15)";
}
function blur(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
  e.currentTarget.style.boxShadow = "none";
}

export default function DealerRegisterPage() {
  const supabase = createClient();

  const [form, setForm] = useState({
    email:        "",
    password:     "",
    confirmPw:    "",
    contactName:  "",
    companyName:  "",
    phone:        "",
    addressLine1: "",
    addressLine2: "",
    city:         "",
    postcode:     "",
    companyRegistrationNumber: "",
    vatNumber:    "",
    tradingName:  "",
    fcaFrn:       "",
    website:      "",
  });
  const [docs, setDocs] = useState<Record<DocKey, File | null>>({
    company_registration:  null,
    proof_of_address:      null,
    motor_trade_insurance: null,
    vat_certificate:       null,
    fca_authorisation:     null,
  });

  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState("");
  const [step,      setStep]      = useState<"form" | "uploading">("form");

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const setDoc = (k: DocKey) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDocs((p) => ({ ...p, [k]: e.target.files?.[0] ?? null }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPw) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    const missingDoc = DOCS.find((d) => d.required && !docs[d.key]);
    if (missingDoc) {
      setError(`${missingDoc.label} is required.`);
      return;
    }

    setLoading(true);

    // Step 1 — create auth user + dealer_profiles
    const res = await fetch("/api/dealer/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email:        form.email,
        password:     form.password,
        contactName:  form.contactName,
        companyName:  form.companyName,
        phone:        form.phone,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city:         form.city,
        postcode:     form.postcode,
        companyRegistrationNumber: form.companyRegistrationNumber,
        vatNumber:    form.vatNumber,
        tradingName:  form.tradingName,
        fcaFrn:       form.fcaFrn,
        website:      form.website,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    // Step 2 — sign in so the document upload API can authenticate
    setStep("uploading");
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (signInErr) {
      // Account created but couldn't sign in for docs — still show success
      setLoading(false);
      setSubmitted(true);
      return;
    }

    // Step 3 — upload documents
    for (const doc of DOCS) {
      const file = docs[doc.key];
      if (!file) continue;

      const fd = new FormData();
      fd.append("documentType", doc.key);
      fd.append("file", file);

      const upRes = await fetch("/api/dealer/documents", { method: "POST", body: fd });
      if (!upRes.ok) {
        const upData = await upRes.json().catch(() => ({}));
        setError(upData.error ?? "Application saved but a document upload failed. You can contact support to re-upload.");
        setLoading(false);
        setSubmitted(true); // still show success — profile was created
        return;
      }
    }

    // Sign out — they're pending_approval; they'll see pending screen if they log in
    await supabase.auth.signOut();

    setLoading(false);
    setSubmitted(true);
  }

  /* ───────────── Success screen ───────────── */
  if (submitted) {
    return (
      <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }} className="flex items-center justify-center px-4 py-16">
        <div style={{ width: "100%", maxWidth: "480px", textAlign: "center" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "rgba(31,191,159,0.15)", border: "1px solid rgba(31,191,159,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1FBF9F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h1 style={{ color: "#ffffff", fontSize: "28px", fontWeight: "800", letterSpacing: "-0.5px", margin: "0 0 12px", fontFamily: FONT }}>
            Application submitted
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", lineHeight: "1.7", margin: "0 0 32px", fontFamily: FONT }}>
            Your dealer application and verification documents have been received.
            We aim to review applications within <strong style={{ color: "rgba(255,255,255,0.8)" }}>2 business days</strong> and will email you at{" "}
            <strong style={{ color: "#1FBF9F" }}>{form.email}</strong>.
          </p>
          {error && (
            <p style={{ backgroundColor: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: "12px", padding: "12px 16px", color: "#fcd34d", fontSize: "13px", marginBottom: "24px", fontFamily: FONT }}>
              Note: {error}
            </p>
          )}
          <Link
            href="/"
            style={{ display: "inline-block", backgroundColor: "#1FBF9F", color: "#ffffff", borderRadius: "12px", padding: "14px 32px", fontSize: "15px", fontWeight: "700", textDecoration: "none", fontFamily: FONT }}
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  /* ───────────── Registration form ───────────── */
  return (
    <main style={{ backgroundColor: "#0D0D0D", minHeight: "100vh" }} className="px-4 py-16">
      <div style={{ width: "100%", maxWidth: "640px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "52px", height: "52px", backgroundColor: "#1FBF9F", borderRadius: "14px", marginBottom: "18px" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <p style={{ color: "#1FBF9F", fontSize: "12px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 6px", fontFamily: FONT }}>EV Guide · Dealer Network</p>
          <h1 style={{ color: "#ffffff", fontSize: "30px", fontWeight: "800", letterSpacing: "-0.5px", margin: "0 0 8px", fontFamily: FONT }}>Apply to become a dealer</h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", margin: 0, fontFamily: FONT }}>
            Create your account and submit your business details. We review applications within 2 business days.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

          {/* ── Section 1: Account credentials ── */}
          <section style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px" }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 20px", fontFamily: FONT }}>Account credentials</p>
            <div style={{ display: "grid", gap: "16px" }}>
              <Field label="Your full name" required>
                <input type="text" value={form.contactName} onChange={set("contactName")} required placeholder="John Smith" style={iStyle} onFocus={focus} onBlur={blur} />
              </Field>
              <Field label="Email address" required>
                <input type="email" value={form.email} onChange={set("email")} required placeholder="dealer@yourcompany.co.uk" style={iStyle} onFocus={focus} onBlur={blur} />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field label="Password" required>
                  <input type="password" value={form.password} onChange={set("password")} required minLength={8} placeholder="Min. 8 characters" style={iStyle} onFocus={focus} onBlur={blur} />
                </Field>
                <Field label="Confirm password" required>
                  <input type="password" value={form.confirmPw} onChange={set("confirmPw")} required placeholder="Re-enter password" style={iStyle} onFocus={focus} onBlur={blur} />
                </Field>
              </div>
            </div>
          </section>

          {/* ── Section 2: Business details ── */}
          <section style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px" }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 20px", fontFamily: FONT }}>Business details</p>
            <div style={{ display: "grid", gap: "16px" }}>
              <Field label="Company name" required>
                <input type="text" value={form.companyName} onChange={set("companyName")} required placeholder="EV Motors Ltd" style={iStyle} onFocus={focus} onBlur={blur} />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field label="Business phone" required>
                  <input type="tel" value={form.phone} onChange={set("phone")} required placeholder="+44 20 7946 0958" style={iStyle} onFocus={focus} onBlur={blur} />
                </Field>
                <Field label="Trading name">
                  <input type="text" value={form.tradingName} onChange={set("tradingName")} placeholder="Optional" style={iStyle} onFocus={focus} onBlur={blur} />
                </Field>
              </div>
              <Field label="Address line 1" required>
                <input type="text" value={form.addressLine1} onChange={set("addressLine1")} required placeholder="123 High Street" style={iStyle} onFocus={focus} onBlur={blur} />
              </Field>
              <Field label="Address line 2">
                <input type="text" value={form.addressLine2} onChange={set("addressLine2")} placeholder="Optional" style={iStyle} onFocus={focus} onBlur={blur} />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field label="City" required>
                  <input type="text" value={form.city} onChange={set("city")} required placeholder="London" style={iStyle} onFocus={focus} onBlur={blur} />
                </Field>
                <Field label="Postcode" required>
                  <input type="text" value={form.postcode} onChange={set("postcode")} required placeholder="SW1A 1AA" style={iStyle} onFocus={focus} onBlur={blur} />
                </Field>
              </div>
              <Field label="Company registration number" required>
                <input type="text" value={form.companyRegistrationNumber} onChange={set("companyRegistrationNumber")} required placeholder="12345678" style={iStyle} onFocus={focus} onBlur={blur} />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <Field label="VAT number">
                  <input type="text" value={form.vatNumber} onChange={set("vatNumber")} placeholder="GB123456789" style={iStyle} onFocus={focus} onBlur={blur} />
                </Field>
                <Field label="FCA/FRN number">
                  <input type="text" value={form.fcaFrn} onChange={set("fcaFrn")} placeholder="Optional" style={iStyle} onFocus={focus} onBlur={blur} />
                </Field>
              </div>
              <Field label="Website">
                <input type="url" value={form.website} onChange={set("website")} placeholder="https://evmotors.co.uk" style={iStyle} onFocus={focus} onBlur={blur} />
              </Field>
            </div>
          </section>

          {/* ── Section 3: Verification documents ── */}
          <section style={{ backgroundColor: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px" }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 8px", fontFamily: FONT }}>Verification documents</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: "0 0 20px", fontFamily: FONT }}>Upload PDF, JPEG, PNG or WebP · Max 8 MB per file</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {DOCS.map((doc) => (
                <label
                  key={doc.key}
                  style={{
                    display: "block",
                    border: `1px solid ${docs[doc.key] ? "rgba(31,191,159,0.4)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "12px",
                    padding: "14px 16px",
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                    backgroundColor: docs[doc.key] ? "rgba(31,191,159,0.05)" : "rgba(255,255,255,0.02)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                    <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", fontWeight: "600", fontFamily: FONT }}>{doc.label}</span>
                    <span style={{ color: doc.required ? "rgba(31,191,159,0.8)" : "rgba(255,255,255,0.3)", fontSize: "11px", fontWeight: "700", flexShrink: 0, fontFamily: FONT }}>
                      {doc.required ? "Required" : "Optional"}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="application/pdf,image/jpeg,image/png,image/webp"
                    onChange={setDoc(doc.key)}
                    className="mt-3 block w-full text-xs text-white/50 file:mr-3 file:rounded-xl file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
                  />
                  {docs[doc.key] && (
                    <p style={{ color: "#1FBF9F", fontSize: "12px", margin: "6px 0 0", fontFamily: FONT }}>
                      ✓ {docs[doc.key]?.name}
                    </p>
                  )}
                </label>
              ))}
            </div>
          </section>

          {/* Error */}
          {error && !submitted && (
            <div style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "14px 16px", color: "#fca5a5", fontSize: "13px", fontFamily: FONT }}>
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
              padding: "16px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: FONT,
              letterSpacing: "-0.2px",
              transition: "background-color 0.15s",
            }}
          >
            {loading
              ? step === "uploading"
                ? "Uploading documents…"
                : "Creating account…"
              : "Submit dealer application"}
          </button>

          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: "13px", fontFamily: FONT, margin: 0 }}>
            Already have an account?{" "}
            <Link href="/dealer-login" style={{ color: "#1FBF9F", fontWeight: "600", textDecoration: "none" }}>
              Sign in to Dealer Portal
            </Link>
          </p>

          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: "12px", fontFamily: FONT, margin: 0 }}>
            By submitting you agree to our{" "}
            <Link href="/terms" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "underline" }}>Terms of Service</Link>.
          </p>
        </form>
      </div>
    </main>
  );
}
