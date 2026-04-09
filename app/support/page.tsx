import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";
import { companyProfile } from "@/lib/legal/company";

export const metadata: Metadata = {
  title: `Support and Contact | ${companyProfile.brandName}`,
  description: `Contact and support information for ${companyProfile.brandName}.`,
};

export default function SupportPage() {
  return (
    <LegalPageShell
      eyebrow="Support"
      title="Contact and Support"
      intro="Use this page for customer support, privacy questions, and complaints handling."
    >
      <section>
        <h2 className="text-2xl font-semibold text-white">Contact</h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
          <p>
            General support:
            {" "}
            <a href={`mailto:${companyProfile.supportEmail}`} className="text-emerald-300 hover:text-emerald-200">
              {companyProfile.supportEmail}
            </a>
          </p>
          <p>
            Privacy and data requests:
            {" "}
            <a href={`mailto:${companyProfile.privacyEmail}`} className="text-emerald-300 hover:text-emerald-200">
              {companyProfile.privacyEmail}
            </a>
          </p>
          <p>Registered address: {companyProfile.registeredAddress}</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-white">Complaints</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-300">
          <p>If you have a complaint about the service, contact us first at {companyProfile.supportEmail} with enough detail for us to investigate and respond.</p>
          <p>If your complaint relates to privacy or data rights, contact {companyProfile.privacyEmail}. If you remain dissatisfied, you may have the right to complain to the UK Information Commissioner&apos;s Office.</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-white">Launch checklist note</h2>
        <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-300">
          <p>Before public launch, make sure the legal name, registered address, and support contacts on this page reflect your final company entity and operational setup.</p>
        </div>
      </section>
    </LegalPageShell>
  );
}
