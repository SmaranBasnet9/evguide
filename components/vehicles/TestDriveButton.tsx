"use client";

import { CalendarCheck } from "lucide-react";

interface Props {
  vehicleId: string;
}

export default function TestDriveButton({ vehicleId }: Props) {
  function handleClick() {
    window.dispatchEvent(
      new CustomEvent("open-test-drive", { detail: { carId: vehicleId } }),
    );
  }

  return (
    <button
      onClick={handleClick}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand/20 bg-brand/8 py-3 text-sm font-semibold text-brand transition hover:bg-brand/15"
    >
      <CalendarCheck className="h-4 w-4" />
      Book a test drive
    </button>
  );
}
