/**
 * VehicleImagePlaceholder
 *
 * Renders a dark placeholder in place of a vehicle hero image.
 * Used whenever heroImage is empty or missing.
 * Maintains the same aspect ratio as the vehicle card image slots.
 */

import { Car } from "lucide-react";

interface Props {
  brand?: string;
  model?: string;
  className?: string;
}

export default function VehicleImagePlaceholder({ brand, model, className = "" }: Props) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 bg-zinc-900 ${className}`}
      aria-label={brand && model ? `${brand} ${model}` : "Vehicle image"}
    >
      <Car className="h-10 w-10 text-zinc-700" strokeWidth={1.2} />
      {brand && (
        <p className="text-xs font-medium text-zinc-600 tracking-wide">{brand}</p>
      )}
    </div>
  );
}
