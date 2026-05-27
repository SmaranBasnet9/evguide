"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import DealerBidModal from "@/components/vehicles/DealerBidModal";

interface Props {
  vehicle: { id: string; brand: string; model: string; price: number };
}

export default function VehicleQuoteButton({ vehicle }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
      >
        <MessageSquare className="h-4 w-4" />
        Get dealer quotes — no haggle
      </button>

      {open && (
        <DealerBidModal vehicle={vehicle} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
