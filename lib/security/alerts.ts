import { Resend } from "resend";

const sentCooldown = new Map<string, number>();
const ALERT_COOLDOWN_MS = 10 * 60 * 1000;

export async function notifySecurityEvent(event: {
  type: string;
  message: string;
  details?: Record<string, unknown>;
}) {
  const now = Date.now();
  const cacheKey = `${event.type}:${event.message}`;
  const previous = sentCooldown.get(cacheKey);

  if (previous && now - previous < ALERT_COOLDOWN_MS) {
    return;
  }

  sentCooldown.set(cacheKey, now);

  console.warn("[security]", event.type, event.message, event.details ?? {});

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!resendKey || !to || !from) {
    return;
  }

  try {
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from,
      to,
      subject: `[Security] ${event.type}`,
      text: `${event.message}\n\n${JSON.stringify(event.details ?? {}, null, 2)}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown alert delivery error";
    console.warn("[security] failed to deliver alert email", message);
  }
}
