"use client";

import { useMemo, useState } from "react";
import LeadCaptureModal from "./LeadCaptureModal";
import type { EVModel } from "@/types";

interface CompareLeadCaptureButtonProps {
  modelA: EVModel;
  modelB: EVModel;
}

export default function CompareLeadCaptureButton({
  modelA,
  modelB,
}: CompareLeadCaptureButtonProps) {
  const [open, setOpen] = useState(false);
  const vehicleLabel = useMemo(
    () => `${modelA.brand} ${modelA.model} vs ${modelB.brand} ${modelB.model}`,
    [modelA.brand, modelA.model, modelB.brand, modelB.model],
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 font-bold text-white transition-all hover:bg-white/10 sm:w-auto"
      >
        Compare & Enquire
      </button>

      <LeadCaptureModal
        open={open}
        onClose={() => setOpen(false)}
        interestType="compare"
        title="Compare and enquire"
        description="Capture a high-intent comparison lead while the user still has both options side by side."
        submitLabel="Compare & Enquire"
        vehicleLabel={vehicleLabel}
        defaultMessage={`I am deciding between ${modelA.brand} ${modelA.model} and ${modelB.brand} ${modelB.model}. Please help me choose.`}
      />
    </>
  );
}
