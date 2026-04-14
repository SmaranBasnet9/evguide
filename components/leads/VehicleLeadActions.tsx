"use client";

import { useMemo, useState } from "react";
import { CalendarRange, HandCoins } from "lucide-react";
import LeadCaptureModal from "./LeadCaptureModal";
import type { LeadInterestType } from "@/lib/leads";
import type { EVModel } from "@/types";

interface VehicleLeadActionsProps {
  vehicle: Pick<EVModel, "id" | "brand" | "model">;
}

export default function VehicleLeadActions({ vehicle }: VehicleLeadActionsProps) {
  const [activeModal, setActiveModal] = useState<LeadInterestType | null>(null);
  const vehicleLabel = useMemo(() => `${vehicle.brand} ${vehicle.model}`, [vehicle.brand, vehicle.model]);

  return (
    <>
      <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-[#0D1316] p-5 text-white shadow-[0_20px_70px_rgba(0,0,0,0.18)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
          Lead capture
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-white">Turn interest into a next step</h3>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Use a fast premium lead form for test drive demand or finance intent without interrupting the research journey.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setActiveModal("test_drive")}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
          >
            <CalendarRange className="h-4 w-4" />
            Book Test Drive
          </button>
          <button
            type="button"
            onClick={() => setActiveModal("finance")}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <HandCoins className="h-4 w-4" />
            Get Finance Quote
          </button>
        </div>
      </div>

      <LeadCaptureModal
        open={activeModal === "test_drive"}
        onClose={() => setActiveModal(null)}
        interestType="test_drive"
        title="Book a test drive lead"
        description="Capture a high-intent test drive request for this EV in one fast step."
        submitLabel="Book Test Drive"
        vehicleId={vehicle.id}
        vehicleLabel={vehicleLabel}
        defaultMessage={`I would like to book a test drive for the ${vehicleLabel}.`}
      />

      <LeadCaptureModal
        open={activeModal === "finance"}
        onClose={() => setActiveModal(null)}
        interestType="finance"
        title="Get a finance quote"
        description="Collect quote-ready details for a finance follow-up without sending the user through a heavy flow."
        submitLabel="Get Finance Quote"
        vehicleId={vehicle.id}
        vehicleLabel={vehicleLabel}
        defaultMessage={`I would like a finance quote for the ${vehicleLabel}.`}
      />
    </>
  );
}
