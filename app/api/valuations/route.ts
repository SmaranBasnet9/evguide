import { NextResponse } from "next/server";
import {
  buildValuationLeadMessage,
  parseValuationPayload,
} from "@/lib/valuations";
import { notifySecurityEvent } from "@/lib/security/alerts";
import { applyRateLimit } from "@/lib/security/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

function isMissingValuationsTableError(message: string | null | undefined) {
  if (!message) {
    return false;
  }

  return (
    message.includes("Could not find the table 'public.valuations'") ||
    message.includes('relation "valuations" does not exist')
  );
}

function isMissingLeadsTableError(message: string | null | undefined) {
  if (!message) {
    return false;
  }

  return (
    message.includes("Could not find the table 'public.leads'") ||
    message.includes('relation "leads" does not exist')
  );
}

function buildVehicleQueryModelLabel(vehicleModel: string, vehicleVariant: string) {
  const trimmedModel = vehicleModel.trim();
  const trimmedVariant = vehicleVariant.trim();

  if (!trimmedVariant) {
    return trimmedModel;
  }

  return `${trimmedModel} ${trimmedVariant}`.trim();
}

export async function POST(request: Request) {
  const rateLimit = applyRateLimit(request, "valuations", 8, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    await notifySecurityEvent({
      type: "rate-limit",
      message: "Valuation submissions exceeded rate limit.",
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

  const parsed = parseValuationPayload(body);
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
      .from("valuations")
      .insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        registration_number: parsed.data.registration_number,
        vehicle_model: parsed.data.vehicle_model,
        vehicle_color: parsed.data.vehicle_color,
        vehicle_variant: parsed.data.vehicle_variant,
        purchase_year: parsed.data.purchase_year,
        owner_history: parsed.data.owner_history,
        current_user_count: parsed.data.current_user_count,
        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      if (isMissingValuationsTableError(error.message)) {
        const fallbackInsert = await admin
          .from("leads")
          .insert({
            name: parsed.data.name,
            email: parsed.data.email,
            phone: parsed.data.phone,
            vehicle_id: null,
            interest_type: "sell",
            budget: null,
            message: buildValuationLeadMessage(parsed.data),
            status: "new",
          })
          .select("id")
          .single();

        if (fallbackInsert.error) {
          console.error(
            "[valuations] fallback insert failed:",
            fallbackInsert.error.message,
          );

          if (isMissingLeadsTableError(fallbackInsert.error.message)) {
            const vehicleQueryInsert = await admin
              .from("vehicle_queries")
              .insert({
                preference_id: null,
                user_id: null,
                ev_id: "sell-valuation",
                ev_brand: "Sell a Car",
                ev_model_name: buildVehicleQueryModelLabel(
                  parsed.data.vehicle_model,
                  parsed.data.vehicle_variant,
                ),
                score: 0,
                rank: 0,
                full_name: parsed.data.name,
                email: parsed.data.email,
                phone: parsed.data.phone,
                notes: buildValuationLeadMessage(parsed.data),
                status: "new",
              })
              .select("id")
              .single();

            if (vehicleQueryInsert.error) {
              console.error(
                "[valuations] vehicle_queries fallback insert failed:",
                vehicleQueryInsert.error.message,
              );
            } else {
              return NextResponse.json(
                {
                  success: true,
                  id: vehicleQueryInsert.data.id,
                  storedIn: "vehicle_queries",
                },
                { status: 201 },
              );
            }
          }

          if (
            isMissingLeadsTableError(fallbackInsert.error.message) &&
            process.env.NODE_ENV !== "production"
          ) {
            return NextResponse.json(
              {
                error:
                  "Database setup incomplete. Run supabase/manual/006_create_leads.sql and supabase/manual/010_create_valuations.sql in your Supabase project.",
              },
              { status: 503 },
            );
          }

          return NextResponse.json(
            { error: "Unable to save your valuation request right now." },
            { status: 500 },
          );
        }

        return NextResponse.json(
          { success: true, id: fallbackInsert.data.id, storedIn: "leads" },
          { status: 201 },
        );
      }

      console.error("[valuations] failed to insert valuation:", error.message);
      return NextResponse.json(
        { error: "Unable to save your valuation request right now." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (error) {
    console.error("[valuations] unexpected error:", error);
    return NextResponse.json(
      { error: "Unable to save your valuation request right now." },
      { status: 500 },
    );
  }
}
