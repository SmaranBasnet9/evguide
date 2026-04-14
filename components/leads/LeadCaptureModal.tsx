"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CalendarRange, CarFront, HandCoins, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { type LeadFieldErrorKey, type LeadInterestType } from "@/lib/leads";

type LeadFormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
  budget: string;
};

interface LeadCaptureModalProps {
  open: boolean;
  onClose: () => void;
  interestType: LeadInterestType;
  title: string;
  description: string;
  submitLabel: string;
  vehicleId?: string | null;
  vehicleLabel?: string | null;
  defaultMessage?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getInitialForm(defaultMessage = ""): LeadFormValues {
  return {
    name: "",
    email: "",
    phone: "",
    message: defaultMessage,
    budget: "",
  };
}

function getLeadEyebrow(interestType: LeadInterestType) {
  switch (interestType) {
    case "test_drive":
      return "Test drive lead";
    case "finance":
      return "Finance lead";
    default:
      return "Comparison lead";
  }
}

function getLeadIcon(interestType: LeadInterestType) {
  switch (interestType) {
    case "test_drive":
      return CalendarRange;
    case "finance":
      return HandCoins;
    default:
      return CarFront;
  }
}

export default function LeadCaptureModal({
  open,
  onClose,
  interestType,
  title,
  description,
  submitLabel,
  vehicleId = null,
  vehicleLabel = null,
  defaultMessage = "",
}: LeadCaptureModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const supabase = useMemo(() => createClient(), []);
  const [form, setForm] = useState<LeadFormValues>(() => getInitialForm(defaultMessage));
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<LeadFieldErrorKey, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const showBudget = interestType === "finance";
  const Icon = getLeadIcon(interestType);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm(getInitialForm(defaultMessage));
    setFieldErrors({});
    setServerError(null);
    setSuccess(false);
  }, [defaultMessage, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let active = true;

    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (!active || !user) {
        return;
      }

      const displayName =
        (user.user_metadata?.full_name as string | undefined) ||
        (user.user_metadata?.name as string | undefined) ||
        "";

      setForm((current) => ({
        ...current,
        name: current.name || displayName,
        email: current.email || user.email || "",
      }));
    });

    return () => {
      active = false;
    };
  }, [open, supabase]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  });

  function handleClose() {
    if (submitting) {
      return;
    }

    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    setForm(getInitialForm(defaultMessage));
    setFieldErrors({});
    setServerError(null);
    setSuccess(false);
    onClose();
  }

  function handleChange<K extends keyof LeadFormValues>(key: K, value: LeadFormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }));

    if (fieldErrors[key as LeadFieldErrorKey]) {
      setFieldErrors((current) => {
        const next = { ...current };
        delete next[key as LeadFieldErrorKey];
        return next;
      });
    }

    if (serverError) {
      setServerError(null);
    }
  }

  function validateForm() {
    const errors: Partial<Record<LeadFieldErrorKey, string>> = {};

    if (form.name.trim().length < 2) {
      errors.name = "Please enter your name.";
    }

    if (!EMAIL_REGEX.test(form.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (form.phone.trim().length < 7) {
      errors.phone = "Please enter a valid phone number.";
    }

    if (showBudget) {
      const trimmedBudget = form.budget.trim();
      if (trimmedBudget) {
        const parsedBudget = Number.parseFloat(trimmedBudget.replace(/[^\d.]/g, ""));
        if (!Number.isFinite(parsedBudget) || parsedBudget < 0) {
          errors.budget = "Budget must be a valid number.";
        }
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          vehicle_id: vehicleId,
          vehicle_label: vehicleLabel,
          interest_type: interestType,
          budget: showBudget && form.budget.trim() ? form.budget : null,
          message: form.message.trim() || null,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setFieldErrors(payload?.fieldErrors ?? {});
        setServerError(payload?.error ?? "Unable to send your request right now.");
        return;
      }

      setSuccess(true);
      setForm(getInitialForm(defaultMessage));

      closeTimeoutRef.current = window.setTimeout(() => {
        handleClose();
      }, 1600);
    } catch {
      setServerError("Unable to send your request right now.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleOverlayClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === overlayRef.current) {
      handleClose();
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 px-4 backdrop-blur-md"
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B0F12] shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
        <div className="flex items-start justify-between border-b border-white/8 bg-white/[0.03] px-6 py-5 md:px-8">
          <div className="pr-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
              {getLeadEyebrow(interestType)}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-zinc-400">{description}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition hover:border-white/20 hover:text-white"
            aria-label="Close lead capture modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {success ? (
          <div className="px-6 py-12 text-center md:px-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
              <Icon className="h-7 w-7" />
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-white">Request received</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-zinc-400">
              Your details are safely captured and the team can follow up on this lead shortly.
            </p>
          </div>
        ) : (
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6 md:px-8">
              <InputField
                label="Full name"
                value={form.name}
                onChange={(value) => handleChange("name", value)}
                placeholder="Jane Smith"
                error={fieldErrors.name}
                required
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(value) => handleChange("email", value)}
                  placeholder="jane@example.com"
                  error={fieldErrors.email}
                  required
                />
                <InputField
                  label="Phone"
                  type="tel"
                  value={form.phone}
                  onChange={(value) => handleChange("phone", value)}
                  placeholder="+44 7700 000000"
                  error={fieldErrors.phone}
                  required
                />
              </div>

              {showBudget ? (
                <InputField
                  label="Budget"
                  type="text"
                  value={form.budget}
                  onChange={(value) => handleChange("budget", value)}
                  placeholder="35000"
                  error={fieldErrors.budget}
                />
              ) : null}

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Message
                  <span className="ml-1 text-zinc-500">(optional)</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(event) => handleChange("message", event.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-[1.25rem] border border-white/10 bg-[#0F1518] px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400/35"
                  placeholder="Tell us what matters most so the follow-up feels relevant."
                />
              </div>

              {serverError ? (
                <div className="rounded-[1.25rem] border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                  {serverError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting..." : submitLabel}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="border-t border-white/8 bg-white/[0.02] px-6 py-6 md:px-8 lg:border-l lg:border-t-0">
              <div className="rounded-[1.75rem] border border-white/8 bg-black/20 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-emerald-300">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                  Lead context
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {vehicleLabel ?? "General EV enquiry"}
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  We only ask for the details needed to capture a high-intent follow-up cleanly and keep the next step friction-light.
                </p>
              </div>

              <div className="mt-5 rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                  What happens next
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-400">
                  <li>We store the lead securely in Supabase.</li>
                  <li>The request is tagged for the correct intent type.</li>
                  <li>Your form resets automatically after submission.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
        {required ? <span className="ml-1 text-emerald-300">*</span> : null}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        className={`w-full rounded-[1.25rem] border bg-[#0F1518] px-4 py-3 text-sm text-white outline-none transition ${
          error ? "border-rose-400/40" : "border-white/10 focus:border-emerald-400/35"
        }`}
      />
      {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
