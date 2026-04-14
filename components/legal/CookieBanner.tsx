"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
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
    const secure = window.location.protocol === "https:";
    document.cookie = [
      name + "=",
      "Max-Age=0",
      "Path=/",
      "SameSite=Lax",
      secure ? "Secure" : "",
    ].filter(Boolean).join("; ");
  }

  function scheduleAfterPaint(task) {
    if (typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(() => {
        window.setTimeout(task, 0);
      });
      return;
    }

    window.setTimeout(task, 0);
  }

  function hideBanner() {
    const banner = document.getElementById("cookie-banner");
    if (!banner) return;
    banner.setAttribute("data-native-closed", "1");
    banner.style.opacity = "0";
    banner.style.pointerEvents = "none";
    banner.style.transform = "translateY(24px)";
    window.setTimeout(() => {
      if (banner) banner.style.display = "none";
    }, 0);
  }

  function clearNonEssentialState(preferences) {
    if (!preferences.analytics) {
      try {
        window.localStorage.removeItem(firstVisitKey);
      } catch {}
    }

    if (!preferences.analytics && !preferences.personalization) {
      try {
        window.localStorage.removeItem(trackingSessionIdKey);
      } catch {}
      clearCookie(trackingSessionIdKey);
    }
  }

  function persistConsent(preferences) {
    const serialized = JSON.stringify(preferences);

    try {
      window.localStorage.setItem(consentStorageKey, serialized);
    } catch {}

    setCookie(consentCookieKey, serialized, consentMaxAgeSeconds);

    try {
      window.localStorage.setItem(dismissedStorageKey, "1");
    } catch {}

    setCookie(dismissedCookieKey, "1", consentMaxAgeSeconds);
    clearNonEssentialState(preferences);
  }

  function broadcastConsent(preferences) {
    try {
      window.dispatchEvent(new CustomEvent(consentEvent, { detail: preferences }));
    } catch {}
  }

  function notifyServer(preferences, method) {
    const body = JSON.stringify({
      analytics: preferences.analytics,
      personalization: preferences.personalization,
      method,
    });

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon("/api/consent", blob);
        return;
      }
    } catch {}

    try {
      fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    } catch {}
  }

  function applyDecision(action) {
    if (action !== "accept-all" && action !== "reject-non-essential") {
      return;
    }

    const preferences = {
      essential: true,
      analytics: action === "accept-all",
      personalization: action === "accept-all",
      timestamp: Date.now(),
      version: consentVersion,
    };

    hideBanner();
    persistConsent(preferences);
    scheduleAfterPaint(() => {
      broadcastConsent(preferences);
      notifyServer(
        preferences,
        action === "accept-all" ? "banner_accept_all" : "banner_reject",
      );
    });
  }

  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element
      ? event.target.closest("[data-cookie-action]")
      : null;

    if (!target) return;

    const action = target.getAttribute("data-cookie-action");
    if (!action) return;

    if (action === "customize-settings") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
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

  const shouldShowBanner = !hasMadeChoice || isSettingsOpen;
  const isAdminSurface = pathname.startsWith("/admin") || pathname === "/admin-login";
  const heading = useMemo(
    () => (hasMadeChoice ? "Manage your privacy choices" : "Help us improve EVGuide"),
    [hasMadeChoice],
  );

  useEffect(() => {
    if (isSettingsOpen || !hasMadeChoice) {
      decisionHandledRef.current = false;
    }
  }, [hasMadeChoice, isSettingsOpen]);

  function scheduleConsentAction(action: () => void) {
    if (typeof window === "undefined") {
      action();
      return;
    }

    if (typeof window.requestAnimationFrame === "function") {
      window.requestAnimationFrame(() => {
        window.setTimeout(action, 0);
      });
      return;
    }

    window.setTimeout(action, 0);
  }

  function hideBannerImmediately() {
    if (decisionHandledRef.current) {
      return false;
    }

    decisionHandledRef.current = true;
    setIsDismissed(true);

    const banner = bannerRef.current;
    if (banner) {
      banner.style.opacity = "0";
      banner.style.pointerEvents = "none";
      banner.style.transform = "translateY(24px)";
    }

    return true;
  }

  function handleDecision(action: () => void) {
    if (!hideBannerImmediately()) {
      return;
    }

    scheduleConsentAction(action);
  }

  const isLocallyClosed = isDismissed && !isSettingsOpen;

  if (isAdminSurface || isLocallyClosed || !shouldShowBanner) {
    return null;
  }

  return (
    <div
      id="cookie-banner"
      ref={bannerRef}
      data-native-closed="0"
      className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-[#0E1113]/95 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:inset-x-6"
    >
      <script dangerouslySetInnerHTML={{ __html: COOKIE_BANNER_NATIVE_SCRIPT }} />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">Privacy choices</p>
            <h2 className="mt-2 text-xl font-semibold text-white">{heading}</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Essential cookies stay active so login, security, and core platform behaviour keep working.
              With your permission, we can also use analytics and personalization storage to measure usage,
              remember AI Match context, and tailor EV recommendations. Read our{" "}
              <Link href="/cookies" className="text-emerald-300 transition hover:text-emerald-200">
                Cookie Policy
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-emerald-300 transition hover:text-emerald-200">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {hasMadeChoice && (
            <button
              id="cookie-close"
              type="button"
              onClick={closeSettings}
              className="self-start rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              Close
            </button>
          )}
        </div>

        {!isSettingsOpen && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="cookie-accept-all"
              data-cookie-action="accept-all"
              type="button"
              onClick={() => handleDecision(acceptAll)}
              className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
            >
              Accept All
            </button>
            <button
              id="cookie-reject-non-essential"
              data-cookie-action="reject-non-essential"
              type="button"
              onClick={() => handleDecision(rejectNonEssential)}
              className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            >
              Reject Non-Essential
            </button>
            <a
              id="cookie-customize"
              data-cookie-action="customize-settings"
              href="/cookies#manage-cookie-settings"
              className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/15"
            >
              Customize Settings
            </a>
          </div>
        )}

        {isSettingsOpen && (
          <div className="grid gap-4 rounded-[1.75rem] border border-white/8 bg-black/20 p-4 md:grid-cols-3">
            <ConsentCard
              title="Essential"
              description="Authentication, session, and security cookies required for the product to operate."
              enabled
              locked
            />
            <ConsentCard
              title="Analytics"
              description="Page tracking and behavioural analytics used to understand product usage and improve journeys."
              enabled={draftAnalytics}
              onToggle={() => setDraftAnalytics((current) => !current)}
            />
            <ConsentCard
              title="Personalization / AI"
              description="AI Match preferences, recommendation memory, and user profiling features that tailor the experience."
              enabled={draftPersonalization}
              onToggle={() => setDraftPersonalization((current) => !current)}
            />
            <div className="md:col-span-3 flex flex-wrap items-center gap-3 pt-2">
              <button
                id="cookie-save-preferences"
                type="button"
                onPointerDown={() =>
                  handleDecision(() =>
                    savePreferences({
                      analytics: draftAnalytics,
                      personalization: draftPersonalization,
                    }),
                  )
                }
                onClick={() =>
                  handleDecision(() =>
                    savePreferences({
                      analytics: draftAnalytics,
                      personalization: draftPersonalization,
                    }),
                  )
                }
                className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
              >
                Save Preferences
              </button>
              <button
                id="cookie-settings-accept-all"
                data-cookie-action="accept-all"
                type="button"
                onClick={() => handleDecision(acceptAll)}
                className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                Accept All
              </button>
              <button
                id="cookie-settings-reject"
                data-cookie-action="reject-non-essential"
                type="button"
                onClick={() => handleDecision(rejectNonEssential)}
                className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                Reject Non-Essential
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
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
    <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{description}</p>
        </div>
        <button
          type="button"
          onClick={locked ? undefined : onToggle}
          disabled={locked}
          aria-pressed={enabled}
          className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border transition ${
            enabled
              ? "border-emerald-400/40 bg-emerald-500/80"
              : "border-white/10 bg-white/[0.06]"
          } ${locked ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
        >
          <span
            className={`inline-block h-6 w-6 rounded-full bg-white shadow transition ${
              enabled ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </button>
      </div>
      {locked && <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Always active</p>}
    </div>
  );
}
