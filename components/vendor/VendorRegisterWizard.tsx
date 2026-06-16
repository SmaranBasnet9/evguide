"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, User, Phone, Mail, MapPin, Globe, FileText,
  Upload, CheckCircle2, ArrowRight, ArrowLeft, Loader2, ShieldCheck, X,
} from "lucide-react";

const STEPS = ["Company Info", "Documents", "Review & Submit"];

const BUSINESS_TYPES = [
  { value: "dealership",     label: "Car Dealership" },
  { value: "private_seller", label: "Private Seller" },
  { value: "fleet",          label: "Fleet Operator" },
  { value: "leasing",        label: "Leasing Company" },
  { value: "auction",        label: "Auction House" },
  { value: "other",          label: "Other" },
];

const DOCUMENT_TYPES = [
  { key: "company_registration",    label: "Company Registration Certificate", required: true },
  { key: "business_license",        label: "Business Licence",                 required: true },
  { key: "government_id",           label: "Government-Issued ID",             required: true },
  { key: "vat_registration",        label: "VAT Registration Document",        required: false },
  { key: "proof_of_address",        label: "Proof of Address",                 required: true },
  { key: "dealership_authorization", label: "Dealership Authorisation",        required: false },
];

const inputCls = "w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition";
const labelCls = "block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5";

interface UploadedDoc { key: string; file: File; url?: string; uploading?: boolean; error?: string; }

export default function VendorRegisterWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [, setVendorId] = useState<string | null>(null);

  // Step 1 — Company Info
  const [form, setForm] = useState({
    companyName: "", businessType: "", contactPerson: "", email: "",
    phone: "", addressLine1: "", addressLine2: "", city: "", postcode: "",
    website: "", vatNumber: "", companyRegistrationNumber: "",
  });

  // Step 2 — Documents
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  function setField(k: keyof typeof form, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  // ── Step 1 submit ────────────────────────────────────────────────────────────
  async function submitStep1(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const required = ["companyName", "businessType", "contactPerson", "email", "phone", "addressLine1", "city", "postcode"] as const;
    for (const f of required) {
      if (!form[f].trim()) { setError("Please fill in all required fields."); return; }
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/vendor/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Registration failed. Please try again."); return; }
      setVendorId(data.vendorId);
      setStep(1);
    } catch { setError("Network error. Please try again."); }
    finally { setSubmitting(false); }
  }

  // ── Document upload ───────────────────────────────────────────────────────────
  async function uploadDoc(docKey: string, file: File) {
    setDocs((prev) => {
      const existing = prev.find((d) => d.key === docKey);
      if (existing) return prev.map((d) => d.key === docKey ? { ...d, file, uploading: true, error: "" } : d);
      return [...prev, { key: docKey, file, uploading: true }];
    });

    const fd = new FormData();
    fd.append("file", file);
    fd.append("documentType", docKey);

    try {
      const res = await fetch("/api/vendor/documents", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setDocs((prev) => prev.map((d) => d.key === docKey ? { ...d, uploading: false, error: data.error ?? "Upload failed." } : d));
      } else {
        setDocs((prev) => prev.map((d) => d.key === docKey ? { ...d, uploading: false, url: data.url, error: "" } : d));
      }
    } catch {
      setDocs((prev) => prev.map((d) => d.key === docKey ? { ...d, uploading: false, error: "Network error." } : d));
    }
  }

  function removeDoc(docKey: string) {
    setDocs((prev) => prev.filter((d) => d.key !== docKey));
  }

  // ── Step 2 — check required docs uploaded ────────────────────────────────────
  function proceedToReview() {
    setError("");
    const requiredKeys = DOCUMENT_TYPES.filter((d) => d.required).map((d) => d.key);
    const uploadedKeys = docs.filter((d) => d.url).map((d) => d.key);
    const missing = requiredKeys.filter((k) => !uploadedKeys.includes(k));
    if (missing.length) {
      const missingLabels = missing.map((k) => DOCUMENT_TYPES.find((d) => d.key === k)?.label).join(", ");
      setError(`Please upload the following required documents: ${missingLabels}`);
      return;
    }
    setStep(2);
  }

  // ── Final submit (step 3) ────────────────────────────────────────────────────
  async function finalSubmit() {
    router.push("/vendor");
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-2xl px-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/10">
          <Building2 className="h-7 w-7 text-brand" />
        </div>
        <h1 className="text-3xl font-black text-gray-900">Become a Vendor</h1>
        <p className="mt-2 text-gray-500">Join EV Guide&apos;s verified marketplace. List your vehicles, reach thousands of buyers.</p>
      </div>

      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {STEPS.map((label, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${
              idx < step ? "bg-brand text-white" : idx === step ? "border-2 border-brand bg-white text-brand" : "bg-gray-200 text-gray-400"
            }`}>
              {idx < step ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
            </div>
            <span className={`hidden text-xs font-semibold sm:block ${idx === step ? "text-brand" : "text-gray-400"}`}>{label}</span>
            {idx < STEPS.length - 1 && <div className={`h-px w-8 ${idx < step ? "bg-brand" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

        {/* ── STEP 1: Company Info ── */}
        {step === 0 && (
          <form onSubmit={submitStep1} className="space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Company Information</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelCls}>Company Name *</label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input value={form.companyName} onChange={(e) => setField("companyName", e.target.value)} placeholder="Acme EV Motors Ltd" className={inputCls + " pl-10"} />
                </div>
              </div>

              <div className="col-span-2">
                <label className={labelCls}>Business Type *</label>
                <select value={form.businessType} onChange={(e) => setField("businessType", e.target.value)} className={inputCls}>
                  <option value="">Select type…</option>
                  {BUSINESS_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Contact Person *</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input value={form.contactPerson} onChange={(e) => setField("contactPerson", e.target.value)} placeholder="Jane Smith" className={inputCls + " pl-10"} />
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Phone Number *</label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+44 7700 900000" className={inputCls + " pl-10"} />
                </div>
              </div>

              <div className="col-span-2">
                <label className={labelCls}>Business Email *</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="info@acmeev.co.uk" className={inputCls + " pl-10"} />
                </div>
              </div>

              <div className="col-span-2">
                <label className={labelCls}>Address Line 1 *</label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input value={form.addressLine1} onChange={(e) => setField("addressLine1", e.target.value)} placeholder="123 EV Street" className={inputCls + " pl-10"} />
                </div>
              </div>

              <div className="col-span-2">
                <label className={labelCls}>Address Line 2</label>
                <input value={form.addressLine2} onChange={(e) => setField("addressLine2", e.target.value)} placeholder="Suite / Floor (optional)" className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>City *</label>
                <input value={form.city} onChange={(e) => setField("city", e.target.value)} placeholder="Manchester" className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Postcode *</label>
                <input value={form.postcode} onChange={(e) => setField("postcode", e.target.value)} placeholder="M1 1AE" className={inputCls} />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>Website</label>
                <div className="relative">
                  <Globe className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input value={form.website} onChange={(e) => setField("website", e.target.value)} placeholder="https://acmeev.co.uk" className={inputCls + " pl-10"} />
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className={labelCls}>VAT Number</label>
                <input value={form.vatNumber} onChange={(e) => setField("vatNumber", e.target.value)} placeholder="GB 123 456 789 (optional)" className={inputCls} />
              </div>

              <div className="col-span-2">
                <label className={labelCls}>Company Registration Number</label>
                <input value={form.companyRegistrationNumber} onChange={(e) => setField("companyRegistrationNumber", e.target.value)} placeholder="12345678 (Companies House)" className={inputCls} />
              </div>
            </div>

            {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand/90 disabled:opacity-60">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : <>Continue to Documents <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
        )}

        {/* ── STEP 2: Documents ── */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-gray-900">Verification Documents</h2>
            <p className="text-sm text-gray-500">Upload the documents below to verify your business. PDF, JPG or PNG — max 10 MB each.</p>

            <div className="space-y-3">
              {DOCUMENT_TYPES.map(({ key, label, required }) => {
                const uploaded = docs.find((d) => d.key === key);
                return (
                  <div key={key} className={`flex items-center justify-between rounded-xl border p-4 transition ${
                    uploaded?.url ? "border-emerald-200 bg-emerald-50" : "border-gray-200 bg-gray-50"
                  }`}>
                    <div className="flex items-center gap-3">
                      {uploaded?.url
                        ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                        : <FileText className="h-5 w-5 text-gray-400 shrink-0" />
                      }
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{label}</p>
                        {required && !uploaded?.url && <p className="text-[10px] text-red-500 font-medium">Required</p>}
                        {uploaded?.url && <p className="text-[10px] text-emerald-600 font-medium">{uploaded.file.name}</p>}
                        {uploaded?.error && <p className="text-[10px] text-red-500">{uploaded.error}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {uploaded?.uploading && <Loader2 className="h-4 w-4 animate-spin text-brand" />}
                      {uploaded?.url && (
                        <button type="button" onClick={() => removeDoc(key)} className="text-gray-400 hover:text-red-500">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                      {!uploaded?.url && !uploaded?.uploading && (
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[key]?.click()}
                          className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-brand hover:text-brand"
                        >
                          <Upload className="h-3.5 w-3.5" /> Upload
                        </button>
                      )}
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        ref={(el) => { fileInputRefs.current[key] = el; }}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) uploadDoc(key, f);
                          e.target.value = "";
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

            <div className="flex gap-3">
              <button type="button" onClick={() => { setStep(0); setError(""); }} className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button type="button" onClick={proceedToReview} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-white transition hover:bg-brand/90">
                Review Application <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Review ── */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Review & Submit</h2>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-5 w-5 text-brand" />
                <p className="font-semibold text-gray-900">Application Summary</p>
              </div>
              {[
                ["Company", form.companyName],
                ["Type",    BUSINESS_TYPES.find((t) => t.value === form.businessType)?.label ?? form.businessType],
                ["Contact", form.contactPerson],
                ["Email",   form.email],
                ["Phone",   form.phone],
                ["Address", [form.addressLine1, form.city, form.postcode].filter(Boolean).join(", ")],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium text-gray-900 text-right max-w-[60%] truncate">{v}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-3">
                <p className="text-xs font-semibold text-gray-500 mb-2">Documents uploaded</p>
                {docs.filter((d) => d.url).map((d) => (
                  <div key={d.key} className="flex items-center gap-2 text-xs text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" />
                    {DOCUMENT_TYPES.find((dt) => dt.key === d.key)?.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              After submission, our team will review your application within 1–2 business days. You&apos;ll receive an email once a decision has been made.
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => { setStep(1); setError(""); }} className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button
                type="button"
                onClick={finalSubmit}
                disabled={submitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-bold text-white transition hover:bg-brand/90 disabled:opacity-60"
              >
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : <>Submit Application <CheckCircle2 className="h-4 w-4" /></>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
