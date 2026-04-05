"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminEVDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const res = await fetch(`/api/evs/${id}`, { method: "DELETE" });
    setLoading(false);

    if (res.ok) {
      router.refresh();
    } else {
      const { error } = await res.json();
      alert(error ?? "Failed to delete.");
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs font-semibold text-slate-500 hover:underline"
        >
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs font-semibold text-red-500 hover:underline"
    >
      Delete
    </button>
  );
}
