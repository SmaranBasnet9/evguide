"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import ConsultationWizard from "@/components/consultation/ConsultationWizard";
import type { ConsultationFormState } from "@/types/consultation";

interface Props {
  open: boolean;
  onClose: () => void;
  onComplete?: (consultationId: string | null, state: ConsultationFormState) => void;
}

export default function ConsultationModal({ open, onClose, onComplete }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="EV Consultation"
        className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-white/10 bg-surface-base shadow-[0_0_80px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-transform duration-300 ease-in-out sm:w-[600px] lg:w-[680px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">EV Consultation</span>
            <span className="rounded-full bg-brand/20 px-2 py-0.5 text-[11px] font-semibold text-brand">
              Free
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close consultation"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/50 transition hover:border-white/20 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable wizard content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <ConsultationWizard
            onComplete={onComplete}
            onClose={onClose}
          />
        </div>
      </div>
    </>,
    document.body,
  );
}
