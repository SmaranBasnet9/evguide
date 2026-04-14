import { NextResponse } from "next/server";
import { parseFinanceEnquiryPayload } from "@/lib/finance-enquiries";
import { notifySecurityEvent } from "@/lib/security/alerts";
import { applyRateLimit } from "@/lib/security/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

function isMissingFinanceTableError(message: string | null | undefined) {
  if (!message) {
    return false;
  }

  return (
    message.includes("Could not find the table 'public.finance_enquiries'") ||
    message.includes("relation \"finance_enquiries\" does not exist")
  );
}

function buildFallbackNotes(data: ReturnType<typeof parseFinanceEnquiryPayload>["data"]) {
  if (!data) {
    return "Finance enquiry captured via fallback consultation flow.";
  }

  return [
    "Finance enquiry captured via fallback consultation flow.",
    `Bank: ${data.selected_bank} (${data.selected_bank_interest_rate}% APR)`,
    `Vehicle: ${data.vehicle_name}`,
    `Vehicle price: £${Math.round(data.vehicle_price).toLocaleString("en-GB")}`,
    `Down payment: £${Math.round(data.down_payment).toLocaleString("en-GB")}`,
    `Insurance cost (monthly): £${Math.round(data.insurance_cost).toLocaleString("en-GB")}`,
    `Processing fee: £${Math.round(data.processing_fee).toLocaleString("en-GB")}`,
    `Loan duration: ${data.loan_years} years`,
    `Monthly EMI: £${Math.round(data.monthly_emi).toLocaleString("en-GB")}`,
    `Total payable: £${Math.round(data.total_payable).toLocaleString("en-GB")}`,
  ].join("\n");
}

export async function POST(request: Request) {
  const rateLimit = applyRateLimit(request, "finance-enquiries", 8, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    await notifySecurityEvent({
      type: "rate-limit",
      message: "Finance enquiry submissions exceeded rate limit.",
    });

    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = parseFinanceEnquiryPayload(body);
  if (!parsed.data) {
    return NextResponse.json(
      {
        error: parsed.error ?? "Please review the form and try again.",
        fieldErrors: parsed.fieldErrors ?? {},
      },
      { status: 400 },
    );
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("finance_enquiries")
      .insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        selected_bank: parsed.data.selected_bank,
        selected_bank_interest_rate: parsed.data.selected_bank_interest_rate,
        vehicle_id: parsed.data.vehicle_id,
        vehicle_name: parsed.data.vehicle_name,
        vehicle_price: parsed.data.vehicle_price,
        down_payment: parsed.data.down_payment,
        insurance_cost: parsed.data.insurance_cost,
        processing_fee: parsed.data.processing_fee,
        total_insurance_cost: parsed.data.total_insurance_cost,
        loan_years: parsed.data.loan_years,
        monthly_emi: parsed.data.monthly_emi,
        total_payable: parsed.data.total_payable,
        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      if (isMissingFinanceTableError(error.message)) {
        console.warn(
          "[finance-enquiries] finance_enquiries unavailable, falling back to consultation_requests",
        );

        const fallbackInsert = await admin
          .from("consultation_requests")
          .insert({
            user_id: null,
            full_name: parsed.data.name,
            email: parsed.data.email,
            phone: parsed.data.phone,
            sector: "bank",
            bank_name: parsed.data.selected_bank,
            ev_model_id: null,
            ev_model_label: parsed.data.vehicle_name,
            preferred_time: null,
            notes: buildFallbackNotes(parsed.data),
            status: "pending",
          })
          .select("id")
          .single();

        if (fallbackInsert.error) {
          console.error(
            "[finance-enquiries] fallback insert failed:",
            fallbackInsert.error.code,
            fallbackInsert.error.message,
            fallbackInsert.error.details,
          );
          const devDetail =
            process.env.NODE_ENV !== "production" ? ` (${fallbackInsert.error.message})` : "";
          return NextResponse.json(
            { error: `Unable to save your finance enquiry right now.${devDetail}` },
            { status: 500 },
          );
        }

        return NextResponse.json(
          { success: true, id: fallbackInsert.data.id, storedIn: "consultation_requests" },
          { status: 201 },
        );
      }

      console.error("[finance-enquiries] DB insert failed:", error.code, error.message, error.details);
      const devDetail = process.env.NODE_ENV !== "production" ? ` (${error.message})` : "";
      return NextResponse.json(
        { error: `Unable to save your finance enquiry right now.${devDetail}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[finance-enquiries] unexpected error:", message);
    const devDetail = process.env.NODE_ENV !== "production" ? ` (${message})` : "";
    return NextResponse.json(
      { error: `Unable to save your finance enquiry right now.${devDetail}` },
      { status: 500 },
    );
  }
}
