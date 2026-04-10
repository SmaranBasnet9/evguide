export type CookieConsentPreferences = {
  essential: true;
  analytics: boolean;
  personalization: boolean;
  timestamp: number;
  version: string;
};

export const COOKIE_CONSENT_COOKIE_KEY = "cookie_consent";
export const COOKIE_CONSENT_STORAGE_KEY = "cookie_consent";
export const COOKIE_CONSENT_EVENT = "evguide-cookie-consent-changed";
export const COOKIE_BANNER_DISMISSED_COOKIE_KEY = "cookie_banner_dismissed";
export const COOKIE_BANNER_DISMISSED_STORAGE_KEY = "cookie_banner_dismissed";
export const TRACKING_SESSION_ID_KEY = "evguide_tracking_session_id";
export const FIRST_VISIT_STORAGE_KEY = "evguide_first_visit_at";

/** Bump this when the cookie policy materially changes to re-prompt users. */
export const CURRENT_CONSENT_VERSION = "1";

/** 6 months in seconds — consent cookie lifetime. */
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

const DEFAULT_CONSENT: CookieConsentPreferences = {
  essential: true,
  analytics: false,
  personalization: false,
  timestamp: 0,
  version: CURRENT_CONSENT_VERSION,
};

type CookieGetter =
  | { get(name: string): { value?: string } | undefined }
  | { get(name: string): string | undefined };

function normalizeConsent(input: Partial<CookieConsentPreferences> | null | undefined): CookieConsentPreferences {
  // Coerce legacy numeric version (1) to string ("1") for backward compat.
  let version = CURRENT_CONSENT_VERSION;
  if (input?.version !== undefined && input.version !== null) {
    version = String(input.version);
  }

  return {
    essential: true,
    analytics: Boolean(input?.analytics),
    personalization: Boolean(input?.personalization),
    timestamp:
      typeof input?.timestamp === "number" && Number.isFinite(input.timestamp)
        ? input.timestamp
        : Date.now(),
    version,
  };
}

function parseConsentValue(value: string | null | undefined): CookieConsentPreferences | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<CookieConsentPreferences>;
    return normalizeConsent(parsed);
  } catch {
    return null;
  }
}

function readCookieValueFromDocument(cookieKey: string) {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${cookieKey}=`));

  return cookie ? cookie.split("=").slice(1).join("=") : null;
}

function clearCookie(name: string) {
  if (typeof document === "undefined") return;

  const secure = typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = [
    `${name}=`,
    "Path=/",
    "Max-Age=0",
    "SameSite=Lax",
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

function writeCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;

  const secure = typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = [
    `${name}=${encodeURIComponent(value)}`,
    `Max-Age=${maxAgeSeconds}`,
    "Path=/",
    "SameSite=Lax",
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export function getDefaultConsentPreferences(): CookieConsentPreferences {
  return { ...DEFAULT_CONSENT };
}

export function buildConsentPreferences(input: Partial<CookieConsentPreferences>): CookieConsentPreferences {
  return normalizeConsent(input);
}

export function readConsentFromCookieHeader(cookieHeader: string | null | undefined) {
  if (!cookieHeader) return null;

  const cookieValue = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_CONSENT_COOKIE_KEY}=`))
    ?.slice(COOKIE_CONSENT_COOKIE_KEY.length + 1);

  return parseConsentValue(cookieValue);
}

export function readConsentFromCookieStore(cookieStore: CookieGetter) {
  const entry = cookieStore.get(COOKIE_CONSENT_COOKIE_KEY);
  const value = typeof entry === "string" ? entry : entry?.value;
  return parseConsentValue(value);
}

export function readClientConsent(): CookieConsentPreferences | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    const parsedStored = parseConsentValue(stored);
    if (parsedStored) return parsedStored;
  } catch {
    // Fall through to cookie-based storage.
  }

  return parseConsentValue(readCookieValueFromDocument(COOKIE_CONSENT_COOKIE_KEY));
}

export function getClientConsentOrDefault() {
  return readClientConsent() ?? getDefaultConsentPreferences();
}

export function hasDismissedCookieBanner() {
  if (typeof window === "undefined") return false;

  try {
    const stored = window.localStorage.getItem(COOKIE_BANNER_DISMISSED_STORAGE_KEY);
    if (stored === "1") return true;
  } catch {
    // Fall through to cookie lookup.
  }

  return readCookieValueFromDocument(COOKIE_BANNER_DISMISSED_COOKIE_KEY) === "1";
}

export function setCookieBannerDismissed(dismissed: boolean) {
  if (typeof window === "undefined") return;

  try {
    if (dismissed) {
      window.localStorage.setItem(COOKIE_BANNER_DISMISSED_STORAGE_KEY, "1");
    } else {
      window.localStorage.removeItem(COOKIE_BANNER_DISMISSED_STORAGE_KEY);
    }
  } catch {
    // Ignore storage write failures and rely on cookies instead.
  }

  if (dismissed) {
    writeCookie(COOKIE_BANNER_DISMISSED_COOKIE_KEY, "1", CONSENT_MAX_AGE_SECONDS);
  } else {
    clearCookie(COOKIE_BANNER_DISMISSED_COOKIE_KEY);
  }
}

export function hasConsentDecision(preferences: CookieConsentPreferences | null) {
  return Boolean(preferences && preferences.timestamp > 0);
}

/**
 * Returns true if the stored consent is usable — i.e. a choice was made,
 * the version matches the current policy, and it hasn't expired.
 */
export function isConsentValid(preferences: CookieConsentPreferences | null): boolean {
  if (!preferences || preferences.timestamp <= 0) return false;
  if (String(preferences.version) !== CURRENT_CONSENT_VERSION) return false;

  // Check expiry: consent older than CONSENT_MAX_AGE_SECONDS is stale.
  const ageMs = Date.now() - preferences.timestamp;
  if (ageMs > CONSENT_MAX_AGE_SECONDS * 1000) return false;

  return true;
}

/**
 * Returns true when the consent banner should be re-shown because the
 * stored consent is outdated (version mismatch) or has expired.
 */
export function needsConsentRefresh(preferences: CookieConsentPreferences | null): boolean {
  return !isConsentValid(preferences);
}

export function hasAnalyticsConsent(preferences?: CookieConsentPreferences | null) {
  return Boolean((preferences ?? readClientConsent())?.analytics);
}

export function hasPersonalizationConsent(preferences?: CookieConsentPreferences | null) {
  return Boolean((preferences ?? readClientConsent())?.personalization);
}

export function canUseNonEssentialStorage(preferences?: CookieConsentPreferences | null) {
  const value = preferences ?? readClientConsent();
  return Boolean(value?.analytics || value?.personalization);
}

export function clearNonEssentialClientState(preferences: CookieConsentPreferences) {
  if (typeof window === "undefined") return;

  if (!preferences.analytics) {
    try {
      window.localStorage.removeItem(FIRST_VISIT_STORAGE_KEY);
    } catch {
      // Ignore storage cleanup issues.
    }
  }

  if (!canUseNonEssentialStorage(preferences)) {
    try {
      window.localStorage.removeItem(TRACKING_SESSION_ID_KEY);
    } catch {
      // Ignore storage cleanup issues.
    }

    clearCookie(TRACKING_SESSION_ID_KEY);
  }
}

export function writeClientConsent(input: Partial<CookieConsentPreferences>) {
  if (typeof window === "undefined" || typeof document === "undefined") return getDefaultConsentPreferences();

  const nextPreferences = normalizeConsent(input);
  const serialized = encodeURIComponent(JSON.stringify(nextPreferences));

  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(nextPreferences));
  } catch {
    // Ignore storage write failures and rely on cookies instead.
  }

  document.cookie = [
    `${COOKIE_CONSENT_COOKIE_KEY}=${serialized}`,
    `Max-Age=${CONSENT_MAX_AGE_SECONDS}`,
    "Path=/",
    "SameSite=Lax",
    window.location.protocol === "https:" ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  setCookieBannerDismissed(true);
  clearNonEssentialClientState(nextPreferences);

  try {
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: nextPreferences }));
  } catch {
    // Ignore dispatch issues in older or restricted environments.
  }

  return nextPreferences;
}
