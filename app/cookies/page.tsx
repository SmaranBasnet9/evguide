import type { Metadata } from "next";
import CookieSettingsButton from "@/components/legal/CookieSettingsButton";
import LegalPageShell from "@/components/legal/LegalPageShell";
import { companyProfile } from "@/lib/legal/company";

export const metadata: Metadata = {
  title: `Cookie Policy | ${companyProfile.brandName}`,
  description: `How ${companyProfile.brandName} uses cookies, local storage, and consent controls.`,
};

function Row({ name, purpose, essential }: { name: string; purpose: string; essential: string }) {
  return (
    <div className="grid gap-3 rounded-[1.5rem] border border-white/8 bg-black/20 p-4 sm:grid-cols-[1fr_2fr_0.8fr]">
      <div className="font-medium text-white">{name}</div>
      <div className="text-sm leading-7 text-zinc-300">{purpose}</div>
      <div className="text-sm text-zinc-400">{essential}</div>
    </div>
  );
}

export default function CookiesPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Cookie Policy"
      intro="This page explains how EVGuide uses cookies, local storage, and similar technologies, and how you can control analytics and personalization choices."
    >
      <section>
        <h2 className="text-2xl font-semibold text-white">How we use cookies</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-300">
          <p>We use essential technologies where needed to run login sessions, security, fraud protection, and core product behaviour.</p>
          <p>We only use non-essential analytics and personalization storage when you have actively chosen to allow those categories through our consent controls.</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-white">Current categories</h2>
        <div className="mt-4 space-y-3">
          <Row
            name="Authentication and session cookies"
            purpose="Used by core account, authentication, and platform security features."
            essential="Essential"
          />
          <Row
            name="Consent preference cookie"
            purpose="Stores your cookie choices so EVGuide can remember whether analytics and personalization are allowed."
            essential="Essential"
          />
          <Row
            name="Analytics storage"
            purpose="Used to measure visits, engagement, and conversion journeys only where analytics consent has been granted."
            essential="Non-essential"
          />
          <Row
            name="Personalization and AI storage"
            purpose="Used to remember AI Match preferences, recommendation memory, and profiling-related product features only where personalization consent has been granted."
            essential="Non-essential"
          />
        </div>
      </section>

      <section id="manage-cookie-settings">
        <h2 className="text-2xl font-semibold text-white">How to change your choice</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-300">
          <p>You can accept all, reject non-essential technologies, or choose categories individually from the consent banner.</p>
          <p>After making a choice, you can reopen the settings panel at any time from the site footer.</p>
          <div>
            <CookieSettingsButton className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/15" />
          </div>
          <p>You can also clear cookies and local storage through your browser settings.</p>
        </div>
      </section>
    </LegalPageShell>
  );
}
