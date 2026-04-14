export interface FinanceEnquiryPayload {
  name: string;
  email: string;
  phone: string;
  selected_bank: string;
  selected_bank_interest_rate: number;
  vehicle_id: string;
  vehicle_name: string;
  vehicle_price: number;
  down_payment: number;
  insurance_cost: number;
  processing_fee: number;
  total_insurance_cost: number;
  loan_years: number;
  monthly_emi: number;
  total_payable: number;
}

type FinanceEnquiryFieldErrorKey =
  | "name"
  | "email"
  | "phone"
  | "selected_bank"
  | "vehicle_id"
  | "down_payment"
  | "insurance_cost"
  | "loan_years";

export interface ParsedFinanceEnquiryResult {
  data?: FinanceEnquiryPayload;
  error?: string;
  fieldErrors?: Partial<Record<FinanceEnquiryFieldErrorKey, string>>;
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

export function parseFinanceEnquiryPayload(
  raw: Record<string, unknown>,
): ParsedFinanceEnquiryResult {
  const fieldErrors: Partial<Record<FinanceEnquiryFieldErrorKey, string>> = {};
  const name = normalizeText(raw.name);
  const email = normalizeText(raw.email).toLowerCase();
  const phone = normalizeText(raw.phone);
  const selectedBank = normalizeText(raw.selected_bank);
  const vehicleId = normalizeText(raw.vehicle_id);
  const vehicleName = normalizeText(raw.vehicle_name);
  const selectedBankInterestRate = normalizeNumber(raw.selected_bank_interest_rate);
  const vehiclePrice = normalizeNumber(raw.vehicle_price);
  const downPayment = normalizeNumber(raw.down_payment);
  const insuranceCost = normalizeNumber(raw.insurance_cost);
  const processingFee = normalizeNumber(raw.processing_fee);
  const totalInsuranceCost = normalizeNumber(raw.total_insurance_cost);
  const loanYears = normalizeNumber(raw.loan_years);
  const monthlyEmi = normalizeNumber(raw.monthly_emi);
  const totalPayable = normalizeNumber(raw.total_payable);

  if (name.length < 2) {
    fieldErrors.name = "Please enter your name.";
  }

  if (!EMAIL_REGEX.test(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }

  if (phone.length < 7) {
    fieldErrors.phone = "Please enter a valid phone number.";
  }

  if (!selectedBank) {
    fieldErrors.selected_bank = "Please select a bank.";
  }

  if (!vehicleId || !vehicleName) {
    fieldErrors.vehicle_id = "Please select a vehicle.";
  }

  if (!Number.isFinite(downPayment) || downPayment < 0) {
    fieldErrors.down_payment = "Please enter a valid down payment.";
  }

  if (!Number.isFinite(insuranceCost) || insuranceCost < 0) {
    fieldErrors.insurance_cost = "Please enter a valid insurance cost.";
  }

  if (!Number.isFinite(loanYears) || loanYears < 1) {
    fieldErrors.loan_years = "Please choose a valid loan duration.";
  }

  const numericValues = [
    selectedBankInterestRate,
    vehiclePrice,
    processingFee,
    totalInsuranceCost,
    monthlyEmi,
    totalPayable,
  ];

  if (numericValues.some((value) => !Number.isFinite(value) || value < 0)) {
    return {
      error: "The finance summary contains invalid values.",
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
      selected_bank: selectedBank,
      selected_bank_interest_rate: selectedBankInterestRate,
      vehicle_id: vehicleId,
      vehicle_name: vehicleName,
      vehicle_price: vehiclePrice,
      down_payment: downPayment,
      insurance_cost: insuranceCost,
      processing_fee: processingFee,
      total_insurance_cost: totalInsuranceCost,
      loan_years: Math.round(loanYears),
      monthly_emi: monthlyEmi,
      total_payable: totalPayable,
    },
  };
}
