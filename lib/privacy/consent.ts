export type ConsentState = "granted" | "denied" | "unset";

export const ANALYTICS_CONSENT_KEY = "evguide_analytics_consent";

export function readAnalyticsConsent(): ConsentState {
  if (typeof window === "undefined") return "unset";

  const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  if (value === "granted" || value === "denied") return value;
  return "unset";
}

export function writeAnalyticsConsent(value: Exclude<ConsentState, "unset">) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
}

export function hasAnalyticsConsent() {
  return readAnalyticsConsent() === "granted";
}
