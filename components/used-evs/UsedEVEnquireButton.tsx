"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import EnquiryModal from "@/components/enquiry/EnquiryModal";

interface Props {
  vehicleLabel: string;
}

export default function UsedEVEnquireButton({ vehicleLabel }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition hover:bg-brand-hover"
      >
        <MessageSquare className="h-4 w-4" /> Enquire
      </button>

      {open && (
        <EnquiryModal
          context={{ vehicleLabel, defaultType: "Vehicle Quote" }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
