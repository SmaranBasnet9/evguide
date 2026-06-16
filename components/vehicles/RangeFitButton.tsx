"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

interface Props {
  vehicleId: string;
}

export default function RangeFitButton({ vehicleId }: Props) {
  return (
    <Link
      href={`/range-fit?ev=${vehicleId}`}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand/20 bg-brand/8 py-3 text-sm font-semibold text-brand transition hover:bg-brand/15"
    >
      <Zap className="h-4 w-4" />
      Try Range Fit — does it suit your routes?
    </Link>
  );
}
