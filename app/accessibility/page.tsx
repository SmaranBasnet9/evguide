import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";
import { companyProfile } from "@/lib/legal/company";

export const metadata: Metadata = {
  title: `Accessibility Statement | ${companyProfile.brandName}`,
  description: `Accessibility commitment and known issues for ${companyProfile.brandName}.`,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-300">{children}</div>
    </section>
  );
}

export default function AccessibilityPage() {
  return (
    <LegalPageShell
      eyebrow="Accessibility"
      title="Accessibility Statement"
      intro={`${companyProfile.brandName} is committed to making this website accessible to as many people as possible. This statement applies to content published on ${companyProfile.siteUrl}.`}
    >
      <Section title="Our commitment">
        <p>
          We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. We continually
          review the platform and work to fix issues as they are identified.
        </p>
        <p>
          This platform is designed to work with modern screen readers, keyboard navigation, and
          browser zoom up to 200% without loss of content or functionality.
        </p>
      </Section>

      <Section title="Known issues">
        <p>
          We are aware of the following areas that may not yet fully meet WCAG 2.1 AA criteria:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Some interactive data visualisations (comparison charts, cost calculators) may have limited
            screen reader support. We are working to add ARIA labels and table-based alternatives.</li>
          <li>Third-party map embeds used in the charging finder may have limited keyboard accessibility.</li>
          <li>Some image carousels on used EV listings may not announce slide position to screen readers.</li>
        </ul>
        <p>
          We plan to address these issues in a future release. If you encounter a barrier not listed
          here, please contact us so we can prioritise a fix.
        </p>
      </Section>

      <Section title="Technical information">
        <p>
          {companyProfile.brandName} is built using Next.js and React. The site uses semantic HTML5
          elements, ARIA landmarks, and focus management for modal dialogs. Colour contrast ratios
          for body text meet the 4.5:1 minimum ratio required by WCAG 2.1 AA.
        </p>
        <p>
          This site has been tested with:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>NVDA + Chrome on Windows</li>
          <li>VoiceOver + Safari on macOS and iOS</li>
          <li>Keyboard-only navigation on Chrome and Firefox</li>
        </ul>
      </Section>

      <Section title="Feedback and contact">
        <p>
          If you experience any difficulty accessing content on this site, please contact us and we
          will respond within five working days:
        </p>
        <p>
          Email:{" "}
          <a
            href={`mailto:${companyProfile.supportEmail}`}
            className="text-emerald-300 hover:text-emerald-200"
          >
            {companyProfile.supportEmail}
          </a>
        </p>
        <p>
          We aim to acknowledge accessibility reports within 2 working days and provide a resolution
          or workaround within 10 working days where technically feasible.
        </p>
      </Section>

      <Section title="Enforcement">
        <p>
          If you are not satisfied with our response, you can contact the Equality Advisory and
          Support Service (EASS) at{" "}
          <a
            href="https://www.equalityadvisoryservice.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-300 hover:text-emerald-200"
          >
            www.equalityadvisoryservice.com
          </a>
          .
        </p>
      </Section>

      <Section title="Last reviewed">
        <p>This statement was last reviewed on 16 May 2026.</p>
      </Section>
    </LegalPageShell>
  );
}
