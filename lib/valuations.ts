export const VALUATION_OWNER_HISTORY = [
  "first_owner",
  "second_owner",
  "third_plus",
] as const;

export const SELL_VALUATION_FALLBACK_EV_ID = "sell-valuation";
export const SELL_VALUATION_FALLBACK_BRAND = "Sell a Car";

export type ValuationOwnerHistory = (typeof VALUATION_OWNER_HISTORY)[number];

export type ValuationFieldErrorKey =
  | "name"
  | "email"
  | "phone"
  | "registration_number"
  | "vehicle_model"
  | "vehicle_color"
  | "vehicle_variant"
  | "purchase_year"
  | "owner_history"
  | "current_user_count";

export interface ValuationPayload {
  name: string;
  email: string;
  phone: string;
  registration_number: string;
  vehicle_model: string;
  vehicle_color: string;
  vehicle_variant: string;
  purchase_year: number;
  owner_history: ValuationOwnerHistory;
  current_user_count: number;
}

export interface ParsedValuationPayloadResult {
  data?: ValuationPayload;
  error?: string;
  fieldErrors?: Partial<Record<ValuationFieldErrorKey, string>>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return Number.NaN;
  }

  const sanitized = value.trim().replace(/[^\d.-]/g, "");
  if (!sanitized) {
    return Number.NaN;
  }

  const parsed = Number.parseFloat(sanitized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export function isValuationOwnerHistory(value: unknown): value is ValuationOwnerHistory {
  return (
    typeof value === "string" &&
    VALUATION_OWNER_HISTORY.includes(value as ValuationOwnerHistory)
  );
}

export function isSellValuationVehicleQuery(input: {
  ev_id?: string | null;
  ev_brand?: string | null;
}) {
  return (
    input.ev_id === SELL_VALUATION_FALLBACK_EV_ID ||
    input.ev_brand === SELL_VALUATION_FALLBACK_BRAND
  );
}

export function isMissingSupabaseTableError(
  message: string | null | undefined,
  table: string,
) {
  if (!message) {
    return false;
  }

  return (
    message.includes(`Could not find the table 'public.${table}'`) ||
    message.includes(`relation "${table}" does not exist`) ||
    message.includes(`relation "public.${table}" does not exist`)
  );
}

export function parseValuationNotes(notes: string | null | undefined) {
  const result: Record<string, string> = {};

  if (!notes) {
    return result;
  }

  for (const line of notes.split("\n")) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (key) {
      result[key] = value;
    }
  }

  return result;
}

export function buildValuationLeadMessage(data: ValuationPayload) {
  const ownerHistoryLabel =
    data.owner_history === "first_owner"
      ? "First owner"
      : data.owner_history === "second_owner"
        ? "Second owner"
        : "Third+ owner";

  return [
    `Registration number: ${data.registration_number}`,
    `Vehicle model: ${data.vehicle_model}`,
    `Vehicle color: ${data.vehicle_color}`,
    `Vehicle variant: ${data.vehicle_variant}`,
    `Purchase year: ${data.purchase_year}`,
    `Owner history: ${ownerHistoryLabel}`,
    `Seat count: ${data.current_user_count}`,
  ].join("\n");
}

export function parseValuationPayload(
  raw: Record<string, unknown>,
): ParsedValuationPayloadResult {
  const fieldErrors: Partial<Record<ValuationFieldErrorKey, string>> = {};
  const currentYear = new Date().getFullYear();

  const name = normalizeText(raw.name);
  const email = normalizeText(raw.email).toLowerCase();
  const phone = normalizeText(raw.phone);
  const registrationNumber = normalizeText(raw.registration_number).toUpperCase();
  const vehicleModel = normalizeText(raw.vehicle_model);
  const vehicleColor = normalizeText(raw.vehicle_color);
  const vehicleVariant = normalizeText(raw.vehicle_variant);
  const purchaseYear = normalizeNumber(raw.purchase_year);
  const ownerHistory = raw.owner_history;
  const currentUserCount = normalizeNumber(raw.current_user_count);

  if (name.length < 2) {
    fieldErrors.name = "Please enter your name.";
  }

  if (!EMAIL_REGEX.test(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }

  if (phone.length < 7) {
    fieldErrors.phone = "Please enter a valid phone number.";
  }

  if (registrationNumber.length < 2) {
    fieldErrors.registration_number = "Please enter the registration number.";
  }

  if (vehicleModel.length < 2) {
    fieldErrors.vehicle_model = "Please enter the vehicle model.";
  }

  if (vehicleColor.length < 2) {
    fieldErrors.vehicle_color = "Please enter the vehicle color.";
  }

  if (vehicleVariant.length < 2) {
    fieldErrors.vehicle_variant = "Please enter the vehicle variant.";
  }

  if (
    !Number.isInteger(purchaseYear) ||
    purchaseYear < 1990 ||
    purchaseYear > currentYear + 1
  ) {
    fieldErrors.purchase_year = "Please enter a valid purchase year.";
  }

  if (!isValuationOwnerHistory(ownerHistory)) {
    fieldErrors.owner_history = "Please choose the owner history.";
  }

  if (
    !Number.isInteger(currentUserCount) ||
    currentUserCount < 1 ||
    currentUserCount > 10
  ) {
    fieldErrors.current_user_count = "Please enter the seat count.";
  }

  if (!isValuationOwnerHistory(ownerHistory) || Object.keys(fieldErrors).length > 0) {
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
      registration_number: registrationNumber,
      vehicle_model: vehicleModel,
      vehicle_color: vehicleColor,
      vehicle_variant: vehicleVariant,
      purchase_year: purchaseYear,
      owner_history: ownerHistory,
      current_user_count: currentUserCount,
    },
  };
}
