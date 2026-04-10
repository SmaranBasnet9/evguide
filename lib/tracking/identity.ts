import type { TrackingIdentity as BaseTrackingIdentity } from "@/lib/tracking/identity-shared";
import { canUseNonEssentialStorage } from "@/lib/privacy/consent";

export type TrackingIdentity = BaseTrackingIdentity & {
  isAnonymous: boolean;
};

type GetTrackingIdentityInput = {
  authenticatedUserId?: string | null;
  incomingSessionId?: string | null;
};

export const TRACKING_SESSION_ID_KEY = "evguide_tracking_session_id";
const SESSION_STORAGE_KEY = TRACKING_SESSION_ID_KEY;
const SESSION_COOKIE_KEY = TRACKING_SESSION_ID_KEY;

function createSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

function parseSessionId(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function readSessionIdFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const entries = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(Boolean);

  for (const entry of entries) {
    if (!entry.startsWith(`${SESSION_COOKIE_KEY}=`)) continue;
    const rawValue = entry.slice(SESSION_COOKIE_KEY.length + 1);
    return parseSessionId(decodeURIComponent(rawValue));
  }

  return null;
}

function writeSessionIdCookie(sessionId: string): void {
  if (typeof document === "undefined") return;

  // 30 days — short-lived session identity for returning visitor continuity.
  const maxAgeSeconds = 30 * 24 * 60 * 60;
  const secure = typeof window !== "undefined" && window.location.protocol === "https:";

  document.cookie = [
    `${SESSION_COOKIE_KEY}=${encodeURIComponent(sessionId)}`,
    "Path=/",
    `Max-Age=${maxAgeSeconds}`,
    "SameSite=Lax",
    secure ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export function getOrCreateAnonymousSessionId(): string {
  if (typeof window === "undefined") {
    // On server-side execution we cannot persist storage; caller should pass incoming session_id.
    return createSessionId();
  }

  if (!canUseNonEssentialStorage()) {
    return "";
  }

  let fromStorage: string | null = null;
  try {
    fromStorage = parseSessionId(window.localStorage.getItem(SESSION_STORAGE_KEY));
  } catch {
    fromStorage = null;
  }
  if (fromStorage) {
    writeSessionIdCookie(fromStorage);
    return fromStorage;
  }

  const fromCookie = readSessionIdFromCookie();
  if (fromCookie) {
    try {
      window.localStorage.setItem(SESSION_STORAGE_KEY, fromCookie);
    } catch {
      // Fall back to cookie-only storage in restricted environments.
    }
    return fromCookie;
  }

  const next = createSessionId();
  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, next);
  } catch {
    // Fall back to cookie-only storage in restricted environments.
  }
  writeSessionIdCookie(next);
  return next;
}

/**
 * Returns the tracking identity for both client and server flows.
 *
 * Priority:
 * 1) Authenticated user id (if present)
 * 2) Incoming anonymous session id (server/API path)
 * 3) Browser-persisted anonymous session id (client path)
 */
export function getTrackingIdentity(input?: GetTrackingIdentityInput): TrackingIdentity | null {
  const authenticatedUserId = parseSessionId(input?.authenticatedUserId ?? null);
  if (authenticatedUserId) {
    return {
      userId: authenticatedUserId,
      sessionId: null,
      isAnonymous: false,
    };
  }

  const incomingSessionId = parseSessionId(input?.incomingSessionId ?? null);
  if (incomingSessionId) {
    return {
      userId: null,
      sessionId: incomingSessionId,
      isAnonymous: true,
    };
  }

  if (typeof window !== "undefined") {
    if (!canUseNonEssentialStorage()) {
      return null;
    }

    return {
      userId: null,
      sessionId: getOrCreateAnonymousSessionId(),
      isAnonymous: true,
    };
  }

  return null;
}
