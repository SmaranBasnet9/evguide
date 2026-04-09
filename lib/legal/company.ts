export const companyProfile = {
  brandName: process.env.NEXT_PUBLIC_BRAND_NAME ?? "EVGuide AI",
  legalName: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "EVGuide AI Ltd",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@evguide.ai",
  privacyEmail: process.env.NEXT_PUBLIC_PRIVACY_EMAIL ?? "privacy@evguide.ai",
  registeredAddress:
    process.env.NEXT_PUBLIC_COMPANY_ADDRESS ??
    "Registered office details to be added before public launch.",
  jurisdiction: process.env.NEXT_PUBLIC_LEGAL_JURISDICTION ?? "England and Wales",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.evguide.ai",
};
