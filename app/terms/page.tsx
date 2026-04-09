import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";
import { companyProfile } from "@/lib/legal/company";

export const metadata: Metadata = {
  title: `Terms of Service | ${companyProfile.brandName}`,
  description: `Terms governing use of ${companyProfile.brandName}.`,
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-300">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Terms of Service"
      intro={`${companyProfile.brandName} provides EV research, comparison, recommendation, and affordability tools. These terms set out the basis on which you may use the service.`}
    >
      <Section title="Service scope">
        <p>The platform is designed to help users research electric vehicles, compare options, and understand indicative affordability or ownership scenarios.</p>
        <p>Unless expressly stated otherwise, the service does not provide regulated financial advice, legal advice, credit broking, or binding offers from lenders, dealers, or manufacturers.</p>
      </Section>

      <Section title="Illustrative information only">
        <p>Vehicle rankings, AI Match outputs, finance estimates, monthly cost examples, and lender-profile comparisons are indicative research tools only.</p>
        <p>You should verify any finance, availability, price, incentive, or suitability information independently before making a purchase or credit decision.</p>
      </Section>

      <Section title="Accounts and acceptable use">
        <p>You must provide accurate information when creating an account or submitting consultation or test-drive requests.</p>
        <p>You must not misuse the service, attempt to access restricted areas without permission, reverse engineer protected systems unlawfully, or submit harmful or fraudulent content.</p>
      </Section>

      <Section title="Intellectual property">
        <p>We and our licensors retain rights in the software, design, content, and branding of the service, except where third-party content is clearly identified.</p>
      </Section>

      <Section title="Liability">
        <p>To the extent permitted by law, the service is provided on an “as is” basis and we do not guarantee uninterrupted availability, perfect accuracy, or suitability for every purpose.</p>
        <p>Nothing in these terms excludes liability that cannot be excluded under applicable law.</p>
      </Section>

      <Section title="Governing law">
        <p>These terms are governed by the laws of {companyProfile.jurisdiction} unless mandatory local law requires otherwise.</p>
      </Section>
    </LegalPageShell>
  );
}
