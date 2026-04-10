"use client";

import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_EVENT,
  getClientConsentOrDefault,
  hasPersonalizationConsent,
} from "@/lib/privacy/consent";
import type { UserIntentProfileRow } from "@/types";

export type UseIntentProfileResult = {
  profile: UserIntentProfileRow | null;
  /** true only during the initial fetch — callers should show generic content */
  loading: boolean;
};

/**
 * Fetches the current user's intent profile from /api/me/intent once on mount.
 *
 * The profile will be null when:
 *  - The user has no behavioral history yet (new visitor)
 *  - The initial fetch is still in flight (loading === true)
 *  - The network request failed (silent degradation)
 *
 * Components consuming this hook must always render sensible generic content
 * as the default/loading state.
 */
export function useIntentProfile(): UseIntentProfileResult {
  const [profile, setProfile] = useState<UserIntentProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [personalizationEnabled, setPersonalizationEnabled] = useState(() =>
    hasPersonalizationConsent(getClientConsentOrDefault()),
  );

  useEffect(() => {
    function syncConsent() {
      setPersonalizationEnabled(hasPersonalizationConsent(getClientConsentOrDefault()));
    }

    syncConsent();
    window.addEventListener(COOKIE_CONSENT_EVENT, syncConsent);
    window.addEventListener("storage", syncConsent);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, syncConsent);
      window.removeEventListener("storage", syncConsent);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!personalizationEnabled) {
      return () => {
        cancelled = true;
      };
    }

    fetch("/api/me/intent", { credentials: "same-origin" })
      .then((res) => {
        if (!res.ok) return null;
        return res.json() as Promise<{ profile: UserIntentProfileRow | null }>;
      })
      .then((data) => {
        if (!cancelled) setProfile(data?.profile ?? null);
      })
      .catch(() => {
        // Profile fetch failure is non-fatal — components fall back to generic content.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [personalizationEnabled]);

  return {
    profile: personalizationEnabled ? profile : null,
    loading: personalizationEnabled ? loading : false,
  };
}
