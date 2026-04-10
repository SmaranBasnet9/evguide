"use client";

import { usePathname } from "next/navigation";
import { useCookieConsent } from "@/components/legal/CookieConsentProvider";

type CookieSettingsButtonProps = {
  className?: string;
};

export default function CookieSettingsButton({ className }: CookieSettingsButtonProps) {
  const { openSettings } = useCookieConsent();
  const pathname = usePathname() || "/";
  const href = "/cookies#manage-cookie-settings";

  return (
    <a
      href={href}
      onClick={(event) => {
        if (pathname === "/cookies") {
          event.preventDefault();
          openSettings();
          return;
        }

        openSettings();

        window.setTimeout(() => {
          const banner = document.getElementById("cookie-banner");
          if (!banner) {
            window.location.assign(href);
          }
        }, 120);
      }}
      className={className}
    >
      Cookie settings
    </a>
  );
}
