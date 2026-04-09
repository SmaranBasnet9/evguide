import type { Metadata } from "next";
import LegalPageShell from "@/components/legal/LegalPageShell";
import { companyProfile } from "@/lib/legal/company";

export const metadata: Metadata = {
  title: `Privacy Policy | ${companyProfile.brandName}`,
  description: `How ${companyProfile.brandName} collects, uses, stores, and protects personal data for UK users.`,
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

export default function PrivacyPage() {
  return (
    <LegalPageShell
      eyebrow="Legal"
      title="Privacy Policy"
      intro={`${companyProfile.brandName} is an EV research and decision platform. This page explains what personal data we collect, why we use it, and the choices available to you. It is written for UK users and should be reviewed alongside our Cookie Policy and Terms of Service.`}
    >
      <Section title="Who controls your data">
        <p>{companyProfile.legalName} is the controller for the personal data described in this policy.</p>
        <p>
          Contact:
          {" "}
          <a className="text-emerald-300 hover:text-emerald-200" href={`mailto:${companyProfile.privacyEmail}`}>
            {companyProfile.privacyEmail}
          </a>
        </p>
        <p>Registered address: {companyProfile.registeredAddress}</p>
      </Section>

      <Section title="What we collect">
        <p>We may collect identity and contact data such as name, email address, phone number, and account details when you create an account or request support, consultations, or test drives.</p>
        <p>We collect EV preference and journey data such as budget ranges, charging preferences, shortlist actions, comparison behavior, and affordability inputs when you use product tools.</p>
        <p>We may collect technical and usage data such as page views, engagement signals, and anonymous session identifiers only where analytics consent has been given.</p>
      </Section>

      <Section title="How we use personal data">
        <p>We use personal data to provide the service, run user accounts, deliver recommendation and comparison journeys, respond to support requests, and manage booked consultations or test-drive requests.</p>
        <p>We use preference and behavior data to personalise results, improve relevance, and understand which product flows are working. We do not claim that these outputs are financial, legal, or regulated advice.</p>
        <p>Where you have consented, we use analytics data to measure performance, improve usability, and understand the effectiveness of content and conversion journeys.</p>
      </Section>

      <Section title="Lawful bases">
        <p>We typically rely on contract or pre-contract steps when you ask us to create an account, provide product functionality, or handle a consultation or test-drive request.</p>
        <p>We rely on legitimate interests for core service security, fraud prevention, debugging, and limited operational record keeping.</p>
        <p>We rely on consent for non-essential analytics cookies and similar technologies.</p>
      </Section>

      <Section title="Profiling and AI-supported decisions">
        <p>Our platform uses rules, scoring, and AI-supported logic to rank vehicles, infer likely preferences, and tailor content or next steps. This includes signals such as affordability ranges, comparison activity, and stated preferences.</p>
        <p>These outputs are designed to support research and product personalisation. They are not binding decisions, credit approvals, or legal determinations.</p>
        <p>If you want information about the main factors used in profiling or want us to review a concern manually, contact us at {companyProfile.privacyEmail}.</p>
      </Section>

      <Section title="Sharing">
        <p>We share data with service providers that help us operate the platform, such as hosting, authentication, email delivery, and database providers, subject to contractual controls.</p>
        <p>We do not sell personal data. If we introduce dealer, lender, or partner referrals later, we recommend disclosing that relationship clearly before launch of that feature.</p>
      </Section>

      <Section title="Retention">
        <p>Account and consultation records are kept for as long as needed to provide the service, handle disputes, and meet legal or operational requirements.</p>
        <p>Analytics and behavioural records should be reviewed regularly and deleted or anonymised when no longer needed for the purposes described above.</p>
      </Section>

      <Section title="Your rights">
        <p>You may have rights to access, correct, erase, restrict, object to certain processing, and request portability under UK data protection law.</p>
        <p>You may withdraw analytics consent at any time by changing your cookie choice.</p>
        <p>You also have the right to complain to the UK Information Commissioner&apos;s Office if you believe your data has been handled unlawfully.</p>
      </Section>
    </LegalPageShell>
  );
}
