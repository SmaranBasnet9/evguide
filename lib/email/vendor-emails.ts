import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const FROM = () => process.env.RESEND_FROM_EMAIL ?? "EV Guide <noreply@evguide.co.uk>";
const SUPPORT = () => process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "";

// ── Admin notifications ───────────────────────────────────────────────────────

export async function sendVendorApplicationEmail(
  adminEmail: string,
  data: { companyName: string; contactPerson: string; email: string; vendorId: string },
) {
  const resend = getResend();
  if (!resend) return;
  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/vendors/${data.vendorId}`;
  await resend.emails.send({
    from: FROM(),
    to: adminEmail || SUPPORT(),
    subject: `New Vendor Application: ${data.companyName}`,
    html: `
      <h2>New Vendor Application Received</h2>
      <p><strong>Company:</strong> ${data.companyName}</p>
      <p><strong>Contact:</strong> ${data.contactPerson}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><a href="${adminUrl}">Review Application →</a></p>
    `,
  }).catch(() => null);
}

export async function sendNewVendorListingEmail(
  data: { make: string; model: string; year: number; vendorName: string; listingId: string },
) {
  const resend = getResend();
  if (!resend || !SUPPORT()) return;
  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/vendor-listings/${data.listingId}`;
  await resend.emails.send({
    from: FROM(),
    to: SUPPORT(),
    subject: `New Vendor Listing Pending: ${data.year} ${data.make} ${data.model}`,
    html: `
      <h2>New Listing Pending Review</h2>
      <p><strong>Vehicle:</strong> ${data.year} ${data.make} ${data.model}</p>
      <p><strong>Vendor:</strong> ${data.vendorName}</p>
      <p><a href="${adminUrl}">Review Listing →</a></p>
    `,
  }).catch(() => null);
}

// ── Vendor notifications ──────────────────────────────────────────────────────

export async function sendVendorApprovedEmail(vendorEmail: string, companyName: string) {
  const resend = getResend();
  if (!resend) return;
  const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/vendor`;
  await resend.emails.send({
    from: FROM(),
    to: vendorEmail,
    subject: "Your EV Guide Vendor Account is Approved",
    html: `
      <h2>Congratulations, ${companyName}!</h2>
      <p>Your vendor application has been <strong>approved</strong>. You can now log in and start listing vehicles.</p>
      <p><a href="${dashboardUrl}" style="background:#1FBF9F;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Go to Vendor Dashboard →</a></p>
      <p style="margin-top:24px;color:#6b7280;font-size:14px;">EV Guide · UK's Premier EV Marketplace</p>
    `,
  }).catch(() => null);
}

export async function sendVendorRejectedEmail(
  vendorEmail: string,
  companyName: string,
  reason: string,
  notes?: string,
) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM(),
    to: vendorEmail,
    subject: "Update on Your EV Guide Vendor Application",
    html: `
      <h2>Application Update — ${companyName}</h2>
      <p>After reviewing your application, we are unable to approve it at this time.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      ${notes ? `<p><strong>Additional notes:</strong> ${notes}</p>` : ""}
      <p>If you believe this is an error, please contact <a href="mailto:${SUPPORT()}">${SUPPORT()}</a>.</p>
    `,
  }).catch(() => null);
}

export async function sendVendorInfoRequestEmail(
  vendorEmail: string,
  companyName: string,
  message: string,
) {
  const resend = getResend();
  if (!resend) return;
  const docsUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/vendor/register`;
  await resend.emails.send({
    from: FROM(),
    to: vendorEmail,
    subject: "Additional Information Required — EV Guide Vendor Application",
    html: `
      <h2>Additional Information Required</h2>
      <p>Hello ${companyName},</p>
      <p>Our team has reviewed your application and requires some additional information:</p>
      <blockquote style="border-left:4px solid #1FBF9F;padding-left:16px;color:#374151;">${message}</blockquote>
      <p><a href="${docsUrl}">Upload Documents →</a></p>
    `,
  }).catch(() => null);
}

export async function sendListingApprovedEmail(
  vendorEmail: string,
  listing: { make: string; model: string; year: number; id: string },
) {
  const resend = getResend();
  if (!resend) return;
  const listingUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/vendor/listings`;
  await resend.emails.send({
    from: FROM(),
    to: vendorEmail,
    subject: `Listing Approved: ${listing.year} ${listing.make} ${listing.model}`,
    html: `
      <h2>Your listing is now live!</h2>
      <p><strong>${listing.year} ${listing.make} ${listing.model}</strong> has been approved and published to EV Guide.</p>
      <p><a href="${listingUrl}">View your listings →</a></p>
    `,
  }).catch(() => null);
}

export async function sendListingRejectedEmail(
  vendorEmail: string,
  listing: { make: string; model: string; year: number },
  reason: string,
) {
  const resend = getResend();
  if (!resend) return;
  const editUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/vendor/listings`;
  await resend.emails.send({
    from: FROM(),
    to: vendorEmail,
    subject: `Listing Update: ${listing.year} ${listing.make} ${listing.model}`,
    html: `
      <h2>Listing Could Not Be Published</h2>
      <p>Your listing for <strong>${listing.year} ${listing.make} ${listing.model}</strong> was not approved.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>Please update your listing and resubmit. <a href="${editUrl}">Edit Listings →</a></p>
    `,
  }).catch(() => null);
}
