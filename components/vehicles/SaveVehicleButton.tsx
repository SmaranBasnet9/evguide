"use client";

/**
 * SaveVehicleButton
 *
 * Allows users to save/unsave an EV to their shortlist.
 * Works for both authenticated users and anonymous sessions.
 * State is optimistic — UI updates immediately, server call in background.
 */

import { useState } from "react";
import { Heart } from "lucide-react";

interface Props {
  vehicleId: string;
  vehicleLabel: string;
  vehiclePrice: number;
  initialSaved?: boolean;
  variant?: "icon" | "button";
}

export default function SaveVehicleButton({
  vehicleId,
  vehicleLabel,
  vehiclePrice,
  initialSaved = false,
  variant = "icon",
}: Props) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (loading) return;
    const newState = !saved;
    setSaved(newState); // optimistic
    setLoading(true);

    try {
      const res = await fetch("/api/saved-vehicles", {
        method: newState ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId, vehicleLabel, vehiclePrice }),
      });
      if (!res.ok) {
        setSaved(!newState); // revert on failure
      }
    } catch {
      setSaved(!newState); // revert on network error
    } finally {
      setLoading(false);
    }
  }

  if (variant === "button") {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
          saved
            ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        }`}
        aria-label={saved ? "Remove from saved" : "Save this EV"}
      >
        <Heart
          className={`h-4 w-4 transition-colors ${saved ? "fill-rose-500 text-rose-500" : "text-slate-400"}`}
        />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  // Icon variant
  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
        saved
          ? "border-rose-500/30 bg-rose-500/15 hover:bg-rose-500/25"
          : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
      aria-label={saved ? "Remove from saved" : "Save this EV"}
      title={saved ? "Remove from shortlist" : "Save to shortlist"}
    >
      <Heart
        className={`h-4 w-4 transition-colors ${saved ? "fill-rose-400 text-rose-400" : "text-zinc-400"}`}
      />
    </button>
  );
}
