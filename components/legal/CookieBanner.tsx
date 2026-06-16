"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCookieConsent } from "@/components/legal/CookieConsentProvider";
import {
  CONSENT_MAX_AGE_SECONDS,
  COOKIE_BANNER_DISMISSED_COOKIE_KEY,
  COOKIE_BANNER_DISMISSED_STORAGE_KEY,
  COOKIE_CONSENT_COOKIE_KEY,
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
  CURRENT_CONSENT_VERSION,
  FIRST_VISIT_STORAGE_KEY,
  hasDismissedCookieBanner,
  TRACKING_SESSION_ID_KEY,
} from "@/lib/privacy/consent";
import { Shield, X, ChevronDown } from "lucide-react";

// ── Native script: runs before React hydration so the banner can be hidden
// immediately if consent already exists — eliminates flash of unwanted banner.
const COOKIE_BANNER_NATIVE_SCRIPT = `
(() => {
  if (window.__evguideCookieBannerNativeBound) return;
  window.__evguideCookieBannerNativeBound = true;

  const consentCookieKey = ${JSON.stringify(COOKIE_CONSENT_COOKIE_KEY)};
  const consentStorageKey = ${JSON.stringify(COOKIE_CONSENT_STORAGE_KEY)};
  const consentEvent = ${JSON.stringify(COOKIE_CONSENT_EVENT)};
  const dismissedCookieKey = ${JSON.stringify(COOKIE_BANNER_DISMISSED_COOKIE_KEY)};
  const dismissedStorageKey = ${JSON.stringify(COOKIE_BANNER_DISMISSED_STORAGE_KEY)};
  const trackingSessionIdKey = ${JSON.stringify(TRACKING_SESSION_ID_KEY)};
  const firstVisitKey = ${JSON.stringify(FIRST_VISIT_STORAGE_KEY)};
  const consentVersion = ${JSON.stringify(CURRENT_CONSENT_VERSION)};
  const consentMaxAgeSeconds = ${String(CONSENT_MAX_AGE_SECONDS)};

  function setCookie(name, value, maxAgeSeconds) {
    const secure = window.location.protocol === "https:";
    document.cookie = [
      name + "=" + encodeURIComponent(value),
      "Max-Age=" + maxAgeSeconds,
      "Path=/",
      "SameSite=Lax",
      secure ? "Secure" : "",
    ].filter(Boolean).join("; ");
  }

  function clearCookie(name) {
    document.cookie = [
      name + "=",
      "Max-Age=0",
      "Path=/",
      "SameSite=Lax",
    ].join("; ");
  }

  function hideBanner() {
    const banner = document.getElementById("cookie-banner");
    if (!banner) return;
    banner.setAttribute("data-native-closed", "1");
    banner.style.opacity = "0";
    banner.style.transform = "translateY(20px)";
    banner.style.pointerEvents = "none";
    window.setTimeout(() => { if (banner) banner.style.display = "none"; }, 320);
  }

  function clearNonEssentialState(prefs) {
    if (!prefs.analytics) {
      try { window.localStorage.removeItem(firstVisitKey); } catch {}
    }
    if (!prefs.analytics && !prefs.personalization) {
      try { window.localStorage.removeItem(trackingSessionIdKey); } catch {}
      clearCookie(trackingSessionIdKey);
    }
  }

  function persistConsent(prefs) {
    const s = JSON.stringify(prefs);
    try { window.localStorage.setItem(consentStorageKey, s); } catch {}
    setCookie(consentCookieKey, s, consentMaxAgeSeconds);
    try { window.localStorage.setItem(dismissedStorageKey, "1"); } catch {}
    setCookie(dismissedCookieKey, "1", consentMaxAgeSeconds);
    clearNonEssentialState(prefs);
  }

  function broadcastConsent(prefs) {
    try { window.dispatchEvent(new CustomEvent(consentEvent, { detail: prefs })); } catch {}
  }

  function notifyServer(prefs, method) {
    const body = JSON.stringify({ analytics: prefs.analytics, personalization: prefs.personalization, method });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/consent", new Blob([body], { type: "application/json" }));
        return;
      }
    } catch {}
    try { fetch("/api/consent", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {}); } catch {}
  }

  function applyDecision(action) {
    if (action !== "accept-all" && action !== "reject-non-essential") return;
    const prefs = {
      essential: true,
      analytics: action === "accept-all",
      personalization: action === "accept-all",
      timestamp: Date.now(),
      version: consentVersion,
    };
    hideBanner();
    persistConsent(prefs);
    requestAnimationFrame(() => {
      setTimeout(() => {
        broadcastConsent(prefs);
        notifyServer(prefs, action === "accept-all" ? "banner_accept_all" : "banner_reject");
      }, 0);
    });
  }

  document.addEventListener("click", (e) => {
    const target = e.target instanceof Element ? e.target.closest("[data-cookie-action]") : null;
    if (!target) return;
    const action = target.getAttribute("data-cookie-action");
    if (!action || action === "customize-settings") return;
    e.preventDefault();
    e.stopPropagation();
    applyDecision(action);
  }, true);
})();
`;

export default function CookieBanner() {
  const pathname = usePathname() || "/";
  const {
    preferences,
    hasMadeChoice,
    isSettingsOpen,
    acceptAll,
    rejectNonEssential,
    savePreferences,
    closeSettings,
  } = useCookieConsent();

  const bannerRef = useRef<HTMLDivElement | null>(null);
  const decisionHandledRef = useRef(false);
  const [draftAnalytics, setDraftAnalytics] = useState(preferences.analytics);
  const [draftPersonalization, setDraftPersonalization] = useState(preferences.personalization);
  const [isDismissed, setIsDismissed] = useState(() => hasDismissedCookieBanner());
  const [visible, setVisible] = useState(false);

  // Sync drafts when settings panel opens — adjust state during render
  // (react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes)
  // rather than in an effect, to avoid an extra cascading render.
  const [prevSettingsOpen, setPrevSettingsOpen] = useState(isSettingsOpen);
  if (isSettingsOpen !== prevSettingsOpen) {
    setPrevSettingsOpen(isSettingsOpen);
    if (isSettingsOpen) {
      setDraftAnalytics(preferences.analytics);
      setDraftPersonalization(preferences.personalization);
    }
  }

  // Re-allow decision after settings re-open
  useEffect(() => {
    if (isSettingsOpen || !hasMadeChoice) {
      decisionHandledRef.current = false;
    }
  }, [hasMadeChoice, isSettingsOpen]);

  // Trigger entrance animation after mount
  useEffect(() => {
    if (!isDismissed && (!hasMadeChoice || isSettingsOpen)) {
      const t = setTimeout(() => setVisible(true), 120);
      return () => clearTimeout(t);
    }
  }, [isDismissed, hasMadeChoice, isSettingsOpen]);

  const isAdminSurface = pathname.startsWith("/admin") || pathname === "/admin-login";
  const isLocallyClosed = isDismissed && !isSettingsOpen;

  if (isAdminSurface || isLocallyClosed || (!hasMadeChoice === false && !isSettingsOpen)) {
    // Don't render when not needed
    if (hasMadeChoice && !isSettingsOpen) return null;
  }
  if (isAdminSurface || isLocallyClosed) return null;
  if (hasMadeChoice && !isSettingsOpen) return null;

  function hideBannerImmediately() {
    if (decisionHandledRef.current) return false;
    decisionHandledRef.current = true;
    setIsDismissed(true);
    const banner = bannerRef.current;
    if (banner) {
      banner.style.opacity = "0";
      banner.style.transform = "translateY(20px)";
      banner.style.pointerEvents = "none";
    }
    return true;
  }

  function handleDecision(action: () => void) {
    if (!hideBannerImmediately()) return;
    requestAnimationFrame(() => setTimeout(action, 0));
  }

  return (
    <>
      {/* Backdrop — subtle overlay on mobile */}
      <div
        className={`fixed inset-0 z-[69] bg-black/10 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      <div
        id="cookie-banner"
        ref={bannerRef}
        role="dialog"
        aria-modal="false"
        aria-label="Cookie consent"
        data-native-closed="0"
        className={`fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-4xl transition-all duration-300 ease-out sm:inset-x-4 sm:bottom-4 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"
        }`}
      >
        <script dangerouslySetInnerHTML={{ __html: COOKIE_BANNER_NATIVE_SCRIPT }} />

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
          {/* Top accent line */}
          <div className="h-1 w-full bg-gradient-to-r from-brand via-brand/60 to-transparent" />

          <div className="p-4 sm:p-5">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10">
                  <Shield className="h-4 w-4 text-brand" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand">Privacy</p>
                  <h2 className="text-sm font-bold text-gray-900 leading-snug">
                    {hasMadeChoice ? "Manage your privacy choices" : "We value your privacy"}
                  </h2>
                </div>
              </div>
              {hasMadeChoice && (
                <button
                  type="button"
                  onClick={closeSettings}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                  aria-label="Close privacy settings"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Body text */}
            <p className="mt-3 text-xs leading-relaxed text-gray-500">
              We use essential cookies to keep the site working. With your permission, we also use analytics to improve EVGuide
              and personalization to remember your AI Match preferences.{" "}
              <Link href="/cookies" className="text-brand font-medium transition hover:text-brand-hover underline underline-offset-2">
                Cookie Policy
              </Link>{" "}
              ·{" "}
              <Link href="/privacy" className="text-brand font-medium transition hover:text-brand-hover underline underline-offset-2">
                Privacy Policy
              </Link>
            </p>

            {/* Action buttons — default view */}
            {!isSettingsOpen && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  id="cookie-accept-all"
                  data-cookie-action="accept-all"
                  type="button"
                  onClick={() => handleDecision(acceptAll)}
                  className="rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
                >
                  Accept All
                </button>
                <button
                  id="cookie-reject-non-essential"
                  data-cookie-action="reject-non-essential"
                  type="button"
                  onClick={() => handleDecision(rejectNonEssential)}
                  className="rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5 text-xs font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-400"
                >
                  Essential Only
                </button>
                <a
                  id="cookie-customize"
                  data-cookie-action="customize-settings"
                  href="/cookies#manage-cookie-settings"
                  className="inline-flex items-center gap-1 rounded-full px-4 py-2.5 text-xs font-semibold text-gray-400 transition hover:text-gray-700"
                >
                  Customize <ChevronDown className="h-3 w-3" />
                </a>
              </div>
            )}

            {/* Settings panel */}
            {isSettingsOpen && (
              <div className="mt-4 space-y-3">
                <div className="grid gap-2.5 sm:grid-cols-3">
                  <ConsentCard
                    title="Essential"
                    description="Login, security & core platform — always on."
                    enabled
                    locked
                  />
                  <ConsentCard
                    title="Analytics"
                    description="Page tracking to understand how EVGuide is used."
                    enabled={draftAnalytics}
                    onToggle={() => setDraftAnalytics((v) => !v)}
                  />
                  <ConsentCard
                    title="Personalization"
                    description="AI Match memory and tailored EV recommendations."
                    enabled={draftPersonalization}
                    onToggle={() => setDraftPersonalization((v) => !v)}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    id="cookie-save-preferences"
                    type="button"
                    onClick={() =>
                      handleDecision(() =>
                        savePreferences({ analytics: draftAnalytics, personalization: draftPersonalization }),
                      )
                    }
                    className="rounded-full bg-brand px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-brand-hover"
                  >
                    Save Preferences
                  </button>
                  <button
                    id="cookie-settings-accept-all"
                    data-cookie-action="accept-all"
                    type="button"
                    onClick={() => handleDecision(acceptAll)}
                    className="rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Accept All
                  </button>
                  <button
                    id="cookie-settings-reject"
                    data-cookie-action="reject-non-essential"
                    type="button"
                    onClick={() => handleDecision(rejectNonEssential)}
                    className="rounded-full border border-gray-200 bg-gray-50 px-5 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Essential Only
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function ConsentCard({
  title,
  description,
  enabled,
  locked,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  locked?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-900">{title}</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-gray-400">{description}</p>
        </div>
        <button
          type="button"
          onClick={locked ? undefined : onToggle}
          disabled={locked}
          aria-pressed={enabled}
          aria-label={`${title} cookies ${enabled ? "enabled" : "disabled"}${locked ? " (required)" : ""}`}
          className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors duration-200 ${
            enabled
              ? "border-brand/40 bg-brand"
              : "border-gray-200 bg-gray-200"
          } ${locked ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              enabled ? "translate-x-6" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
      {locked && (
        <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-brand/70">Always active</p>
      )}
    </div>
  );
}
