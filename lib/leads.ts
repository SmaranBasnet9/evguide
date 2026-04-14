export const LEAD_INTEREST_TYPES = ["test_drive", "finance", "compare", "sell", "quote"] as const;

export type LeadInterestType = (typeof LEAD_INTEREST_TYPES)[number];

export type LeadFieldErrorKey =
  | "name"
  | "email"
  | "phone"
  | "budget"
  | "interest_type";

export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  vehicle_id: string | null;
  vehicle_label: string | null;
  interest_type: LeadInterestType;
  budget: number | null;
  message: string | null;
}

export interface ParsedLeadPayloadResult {
  data?: LeadPayload;
  error?: string;
  fieldErrors?: Partial<Record<LeadFieldErrorKey, string>>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNullableText(value: unknown) {
  const normalized = normalizeText(value);
  return normalized.length > 0 ? normalized : null;
}

function normalizeBudget(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const sanitized = trimmed.replace(/[^\d.]/g, "");
  if (!sanitized) {
    return Number.NaN;
  }

  const parsed = Number.parseFloat(sanitized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export function isLeadInterestType(value: unknown): value is LeadInterestType {
  return typeof value === "string" && LEAD_INTEREST_TYPES.includes(value as LeadInterestType);
}

export function isUuid(value: string | null | undefined) {
  return typeof value === "string" && UUID_REGEX.test(value.trim());
}

export function buildLeadMessage(message: string | null, vehicleLabel: string | null) {
  const lines = [message?.trim(), vehicleLabel ? `Vehicle context: ${vehicleLabel}` : null].filter(Boolean);
  if (lines.length === 0) {
    return null;
  }

  return lines.join("\n\n");
}

export function parseLeadPayload(raw: Record<string, unknown>): ParsedLeadPayloadResult {
  const fieldErrors: Partial<Record<LeadFieldErrorKey, string>> = {};
  const name = normalizeText(raw.name);
  const email = normalizeText(raw.email).toLowerCase();
  const phone = normalizeText(raw.phone);
  const vehicleLabel = normalizeNullableText(raw.vehicle_label);
  const interestType = raw.interest_type;
  const rawVehicleId = normalizeNullableText(raw.vehicle_id);
  const budget = normalizeBudget(raw.budget);
  const message = normalizeNullableText(raw.message);

  if (name.length < 2) {
    fieldErrors.name = "Please enter your name.";
  }

  if (!EMAIL_REGEX.test(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }

  if (phone.length < 7) {
    fieldErrors.phone = "Please enter a valid phone number.";
  }

  if (!isLeadInterestType(interestType)) {
    fieldErrors.interest_type = "Please choose a valid lead type.";
  }

  if (budget !== null && (!Number.isFinite(budget) || budget < 0)) {
    fieldErrors.budget = "Budget must be a valid number.";
  }

  if (!isLeadInterestType(interestType)) {
    return {
      error: "Please correct the highlighted fields.",
      fieldErrors,
    };
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      error: "Please correct the highlighted fields.",
      fieldErrors,
    };
  }

  return {
    data: {
      name,
      email,
      phone,
      vehicle_id: isUuid(rawVehicleId) ? rawVehicleId : null,
      vehicle_label: vehicleLabel,
      interest_type: interestType,
      budget,
      message: buildLeadMessage(message, vehicleLabel),
    },
  };
}
