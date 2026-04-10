"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  buildConsentPreferences,
  COOKIE_CONSENT_EVENT,
  getClientConsentOrDefault,
  isConsentValid,
  readClientConsent,
  type CookieConsentPreferences,
  writeClientConsent,
} from "@/lib/privacy/consent";

type CookieConsentContextValue = {
  preferences: CookieConsentPreferences;
  hasMadeChoice: boolean;
  isSettingsOpen: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (input: Pick<CookieConsentPreferences, "analytics" | "personalization">) => void;
  openSettings: () => void;
  closeSettings: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

/**
 * Sends the consent decision to the server for audit logging.
 * Fire-and-forget — never blocks the UI.
 */
function postConsentToServer(
  analytics: boolean,
  personalization: boolean,
  method: string,
): void {
  try {
    void fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analytics, personalization, method }),
      keepalive: true,
    });
  } catch {
    // Audit logging failure is non-fatal.
  }
}

/**
 * Determines whether the user has made a valid consent choice.
 * Returns false if the consent is missing, expired, or uses an outdated version.
 */
function hasValidConsent(preferences: CookieConsentPreferences | null): boolean {
  return isConsentValid(preferences);
}

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<CookieConsentPreferences>(() => getClientConsentOrDefault());
  const [hasMadeChoice, setHasMadeChoice] = useState<boolean>(() => hasValidConsent(readClientConsent()));
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    function syncFromStorage() {
      const latest = readClientConsent();
      setPreferences(latest ?? getClientConsentOrDefault());
      setHasMadeChoice(hasValidConsent(latest));
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === "cookie_consent") {
        syncFromStorage();
      }
    }

    function handleConsentChange() {
      syncFromStorage();
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
    };
  }, []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      preferences,
      hasMadeChoice,
      isSettingsOpen,
      acceptAll() {
        const next = writeClientConsent({
          analytics: true,
          personalization: true,
        });
        setPreferences(next);
        setHasMadeChoice(true);
        setIsSettingsOpen(false);
        postConsentToServer(true, true, "banner_accept_all");
      },
      rejectNonEssential() {
        const next = writeClientConsent({
          analytics: false,
          personalization: false,
        });
        setPreferences(next);
        setHasMadeChoice(true);
        setIsSettingsOpen(false);
        postConsentToServer(false, false, "banner_reject");
      },
      savePreferences(input) {
        const next = writeClientConsent(buildConsentPreferences(input));
        setPreferences(next);
        setHasMadeChoice(true);
        setIsSettingsOpen(false);
        postConsentToServer(input.analytics, input.personalization, "banner_custom");
      },
      openSettings() {
        setIsSettingsOpen(true);
      },
      closeSettings() {
        setIsSettingsOpen(false);
      },
    }),
    [hasMadeChoice, isSettingsOpen, preferences],
  );

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);

  if (!context) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }

  return context;
}
