"use client";

import { useEffect } from "react";

// Supabase's internal WebSocket (realtime) rejects with a DOM Event object when
// the connection fails, which Next.js dev overlay shows as "[object Event]".
// This is a non-fatal transport error — suppress it globally.
export default function SuppressRealtimeErrors() {
  useEffect(() => {
    function handleUnhandledRejection(e: PromiseRejectionEvent) {
      const reason = e.reason;
      if (reason instanceof Event || (reason && typeof reason === "object" && !(reason instanceof Error))) {
        e.preventDefault();
      }
    }
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => window.removeEventListener("unhandledrejection", handleUnhandledRejection);
  }, []);
  return null;
}
