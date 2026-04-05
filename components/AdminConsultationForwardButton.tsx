"use client";

import { useState } from "react";

export default function AdminConsultationForwardButton({
  id,
  sector,
  bankName,
  applicantName,
  applicantEmail,
  applicantPhone,
  selectedVehicle,
  preferredTime,
  notes,
}: {
  id: string;
  sector: string;
  bankName: string | null;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string | null;
  selectedVehicle: string | null;
  preferredTime: string | null;
  notes: string | null;
}) {
  const [emailTo, setEmailTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  if (sector !== "bank" || !bankName) {
    return null;
  }

  async function forward() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const target = emailTo.trim();
      if (!target) {
        setError("Recipient email is required.");
        return;
      }

      const subject = `EV Guide Inquiry - ${bankName} Loan Consultation - ${applicantName}`;
      const body = [
        `On behalf of EV Guide, we are forwarding a customer inquiry for ${bankName} loan consultation.`,
        "",
        "The user is trying to make an inquiry about the bank loan of the selected vehicle.",
        "",
        `Bank: ${bankName}`,
        `Selected Vehicle: ${selectedVehicle ?? "Not specified by the user"}`,
        `Applicant Name: ${applicantName}`,
        `Applicant Email: ${applicantEmail}`,
        `Applicant Phone: ${applicantPhone ?? "Not provided"}`,
        `Preferred Meeting Time: ${preferredTime ?? "Not provided"}`,
        `Notes: ${notes ?? "No additional notes"}`,
        `Reference ID: ${id}`,
      ].join("\n");

      window.location.href = `mailto:${encodeURIComponent(target)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      const res = await fetch("/api/admin/consultations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "contacted" }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(payload.error || "Email draft opened, but status update failed.");
        return;
      }

      setMessage(`Email draft opened for ${target}. Status updated to Contacted.`);
    } catch {
      setError("Network error while forwarding consultation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2 space-y-2">
      <p className="text-[11px] font-medium text-slate-500">
        Testing mode: enter recipient email manually
      </p>
      <input
        type="email"
        value={emailTo}
        onChange={(e) => setEmailTo(e.target.value)}
        placeholder="Enter your email for test forwarding"
        className="w-56 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs text-slate-700 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-200"
      />
      <button
        type="button"
        onClick={forward}
        disabled={loading || !emailTo.trim()}
        className="rounded-lg border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Preparing..." : "Open Email Draft"}
      </button>
      {message ? <p className="mt-1 text-xs text-emerald-700">{message}</p> : null}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
