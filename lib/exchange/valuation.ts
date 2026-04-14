/**
 * Exchange Valuation Engine
 *
 * Primary path:  Claude AI — uses UK market context + structured tool output.
 * Fallback path: Rule-based engine — deterministic, zero latency.
 *
 * Public API:
 *   getExchangeValuation(params)  — async, tries AI first, falls back to rules
 *   calculateExchangeValuation()  — sync rule-based (kept for tests / admin tools)
 */

import Anthropic from "@anthropic-ai/sdk";
import type {
  ExchangeCondition,
  ExchangeFuelType,
  ExchangeOwnershipType,
  ExchangeValuationResult,
  ValuationConfidence,
} from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Shared input type
// ─────────────────────────────────────────────────────────────────────────────

export interface ValuationParams {
  vehicleYear:      number;
  fuelType:         ExchangeFuelType;
  brand?:           string | null;
  model?:           string | null;
  mileage?:         number | null;
  condition?:       ExchangeCondition | null;
  ownershipType?:   ExchangeOwnershipType | null;
  accidentHistory?: boolean;
  serviceHistory?:  boolean;
  insuranceValid?:  boolean;
  registrationYear?: number | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule-based engine (sync fallback)
// ─────────────────────────────────────────────────────────────────────────────

const BASE_CATEGORY_VALUE: Record<ExchangeFuelType, number> = {
  ev:      22_000,
  hybrid:  16_000,
  petrol:  14_000,
  diesel:  12_000,
  other:   10_000,
};

function ageRetentionFactor(vehicleYear: number): number {
  const age = new Date().getFullYear() - vehicleYear;
  if (age <= 0) return 1.0;
  if (age === 1) return 0.78;
  if (age === 2) return 0.68;
  if (age === 3) return 0.60;
  if (age === 4) return 0.52;
  if (age === 5) return 0.45;
  if (age === 6) return 0.38;
  if (age === 7) return 0.32;
  if (age === 8) return 0.26;
  if (age <= 10) return 0.20;
  if (age <= 13) return 0.14;
  return 0.09;
}

function mileageFactor(km: number): number {
  if (km < 15_000) return 1.05;
  if (km < 40_000) return 1.00;
  if (km < 80_000) return 0.92;
  if (km < 120_000) return 0.82;
  if (km < 160_000) return 0.70;
  if (km < 200_000) return 0.58;
  return 0.44;
}

const CONDITION_FACTOR: Record<ExchangeCondition, number> = {
  excellent: 1.08,
  good:      1.00,
  average:   0.86,
  poor:      0.68,
};

const OWNERSHIP_FACTOR: Record<ExchangeOwnershipType, number> = {
  first_owner:       1.04,
  second_owner:      1.00,
  third_owner_plus:  0.90,
};

function deriveRulesConfidence(params: ValuationParams): ValuationConfidence {
  let score = 0;
  if (params.mileage != null)          score++;
  if (params.condition != null)        score++;
  if (params.ownershipType != null)    score++;
  if (params.registrationYear != null) score++;
  if (params.serviceHistory)           score++;
  if (score >= 4) return "high";
  if (score >= 2) return "medium";
  return "low";
}

/** Synchronous rule-based engine. Always available as a fallback. */
export function calculateExchangeValuation(
  params: ValuationParams
): ExchangeValuationResult {
  const notes: string[] = [];
  const base      = BASE_CATEGORY_VALUE[params.fuelType];
  const ageFactor = ageRetentionFactor(params.vehicleYear);
  const age       = new Date().getFullYear() - params.vehicleYear;

  notes.push(
    `${age}-year-old vehicle — ${Math.round(ageFactor * 100)}% of base retained after age depreciation.`
  );

  const mileKm       = params.mileage ?? 80_000;
  const mileageMult  = mileageFactor(mileKm);
  if (params.mileage == null) {
    notes.push("Mileage not provided — average assumed.");
  } else if (mileKm < 15_000) {
    notes.push("Low mileage — small premium applied.");
  } else if (mileKm > 120_000) {
    notes.push("High mileage — significant reduction applied.");
  }

  const condMult = params.condition != null ? CONDITION_FACTOR[params.condition] : 0.92;
  if (params.condition == null) {
    notes.push("Condition not specified — slightly below average assumed.");
  } else if (params.condition === "poor") {
    notes.push("Poor condition — substantial reduction applied.");
  } else if (params.condition === "excellent") {
    notes.push("Excellent condition — premium applied.");
  }

  const ownMult = params.ownershipType != null ? OWNERSHIP_FACTOR[params.ownershipType] : 0.96;
  if (params.ownershipType === "third_owner_plus") notes.push("Third+ owner — reduction applied.");
  else if (params.ownershipType === "first_owner") notes.push("First owner — small premium applied.");

  const accidentPenalty   = params.accidentHistory ? 0.82 : 1.0;
  const serviceBonusFactor = params.serviceHistory  ? 1.04 : 1.0;

  if (params.accidentHistory) notes.push("Accident history declared — 18% reduction applied.");
  if (params.serviceHistory)  notes.push("Full service history — small premium applied.");
  else                         notes.push("No service history — no premium.");

  if (params.fuelType === "ev")     notes.push("EV — higher base reflects UK EV retention.");
  if (params.fuelType === "diesel") notes.push("Diesel — softened UK market reflected in base.");

  const rawValue = base * ageFactor * mileageMult * condMult * ownMult * accidentPenalty * serviceBonusFactor;
  const estimatedValue = Math.round(rawValue / 50) * 50;

  notes.push("Instant estimate only. Consultant will review before a final offer is made.");

  return { estimatedValue, confidence: deriveRulesConfidence(params), notes };
}

// ─────────────────────────────────────────────────────────────────────────────
// Claude AI engine
// ─────────────────────────────────────────────────────────────────────────────

/** Tool schema that forces Claude to respond with a structured valuation */
const VALUATION_TOOL: Anthropic.Tool = {
  name: "submit_valuation",
  description:
    "Submit the calculated exchange valuation for the vehicle. Always call this tool with your final answer.",
  input_schema: {
    type: "object" as const,
    properties: {
      estimated_value: {
        type: "number",
        description:
          "Estimated UK trade/exchange value in GBP, rounded to nearest £50. Must be a positive integer.",
      },
      confidence: {
        type: "string",
        enum: ["low", "medium", "high"],
        description:
          "Confidence band. 'high' when make/model/mileage/condition are all known. 'low' when key data is missing.",
      },
      notes: {
        type: "array",
        items: { type: "string" },
        description:
          "2–5 plain-English bullet points explaining the key factors that drove this valuation. Each note should be one sentence.",
        minItems: 2,
        maxItems: 5,
      },
    },
    required: ["estimated_value", "confidence", "notes"],
  },
};

/** Build a concise prompt from the valuation params */
function buildPrompt(params: ValuationParams, ruleBasedAnchor: number): string {
  const age  = new Date().getFullYear() - params.vehicleYear;
  const lines: string[] = [
    `Vehicle: ${params.brand ?? "Unknown make"} ${params.model ?? "unknown model"}, ${params.vehicleYear} (${age} years old)`,
    `Fuel type: ${params.fuelType}`,
    `Mileage: ${params.mileage != null ? `${params.mileage.toLocaleString()} km` : "not provided"}`,
    `Condition: ${params.condition ?? "not specified"}`,
    `Ownership: ${params.ownershipType?.replace(/_/g, " ") ?? "not specified"}`,
    `Accident history: ${params.accidentHistory ? "YES" : "no"}`,
    `Service history available: ${params.serviceHistory ? "yes" : "NO"}`,
    `Insurance currently valid: ${params.insuranceValid ? "yes" : "no"}`,
  ];

  return (
    `You are a UK used-car valuation specialist. Estimate the trade/exchange value of the following vehicle for a UK EV dealership.\n\n` +
    `${lines.join("\n")}\n\n` +
    `A rule-based system estimates the value at approximately £${ruleBasedAnchor.toLocaleString()}. ` +
    `Adjust up or down based on your knowledge of current 2026 UK used-car market conditions for this specific make and model. ` +
    `Focus on realistic wholesale / part-exchange values, not retail. ` +
    `Call the submit_valuation tool with your answer.`
  );
}

/** AI-powered valuation. Returns null if the API call fails or is unavailable. */
async function calculateExchangeValuationAI(
  params: ValuationParams,
  ruleBasedAnchor: number
): Promise<ExchangeValuationResult | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null; // not configured — skip to fallback

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model:      "claude-haiku-4-5-20251001", // fast + cheap for automated backend calls
    max_tokens: 512,
    tools:      [VALUATION_TOOL],
    tool_choice: { type: "any" },
    messages: [
      { role: "user", content: buildPrompt(params, ruleBasedAnchor) },
    ],
  });

  // Extract the tool call result
  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );
  if (!toolUse || toolUse.name !== "submit_valuation") return null;

  const input = toolUse.input as {
    estimated_value: number;
    confidence: string;
    notes: string[];
  };

  // Sanity-check: reject clearly wrong values
  if (
    typeof input.estimated_value !== "number" ||
    input.estimated_value < 100 ||
    input.estimated_value > 200_000 ||
    !Array.isArray(input.notes) ||
    input.notes.length === 0
  ) {
    return null;
  }

  const estimatedValue   = Math.round(input.estimated_value / 50) * 50;
  const confidence       = (["low", "medium", "high"].includes(input.confidence)
    ? input.confidence
    : "medium") as ValuationConfidence;
  const notes            = input.notes.slice(0, 5);

  notes.push("Valuation powered by AI market analysis. Final offer confirmed after inspection.");

  return { estimatedValue, confidence, notes };
}

// ─────────────────────────────────────────────────────────────────────────────
// Public async entry point (used by the API route)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Attempt AI valuation, fall back to the rule-based engine on any error.
 * Always resolves — never throws.
 */
export async function getExchangeValuation(
  params: ValuationParams
): Promise<ExchangeValuationResult & { source: "ai" | "rules" }> {
  // Always compute the rule-based value first:
  // 1. Used as the anchor / sanity-check for the AI prompt.
  // 2. Returned immediately if AI is unavailable or fails.
  const rulesResult = calculateExchangeValuation(params);

  try {
    const aiResult = await Promise.race([
      calculateExchangeValuationAI(params, rulesResult.estimatedValue),
      // Hard timeout — the form submit cannot wait more than 8 seconds
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 8_000)),
    ]);

    if (aiResult) {
      return { ...aiResult, source: "ai" };
    }
  } catch (err) {
    // Log but never surface to the user — fall through to rules
    console.warn("[exchange-valuation] AI call failed, using rule-based fallback:", err);
  }

  return { ...rulesResult, source: "rules" };
}
