import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getExchangeValuation } from "@/lib/exchange/valuation";
import type { ExchangeSubmissionPayload } from "@/types";

export async function POST(request: Request) {
  try {
    const body: ExchangeSubmissionPayload = await request.json();

    // ── Basic validation ─────────────────────────────────────────────────────
    if (!body.customer_name?.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!body.phone?.trim()) {
      return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
    }
    if (!body.email?.trim() || !body.email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }
    if (!body.current_vehicle_brand?.trim()) {
      return NextResponse.json({ error: "Current vehicle brand is required." }, { status: 400 });
    }
    if (!body.current_vehicle_model?.trim()) {
      return NextResponse.json({ error: "Current vehicle model is required." }, { status: 400 });
    }
    if (!body.current_vehicle_year || body.current_vehicle_year < 1980 || body.current_vehicle_year > new Date().getFullYear()) {
      return NextResponse.json({ error: "Valid vehicle year is required." }, { status: 400 });
    }
    if (!body.fuel_type) {
      return NextResponse.json({ error: "Fuel type is required." }, { status: 400 });
    }

    // ── Run instant valuation (AI-powered, rule-based fallback) ─────────────
    const valuation = await getExchangeValuation({
      vehicleYear:      body.current_vehicle_year,
      fuelType:         body.fuel_type,
      brand:            body.current_vehicle_brand,
      model:            body.current_vehicle_model,
      mileage:          body.mileage ?? null,
      condition:        body.condition ?? null,
      ownershipType:    body.ownership_type ?? null,
      accidentHistory:  body.accident_history ?? false,
      serviceHistory:   body.service_history ?? false,
      insuranceValid:   body.insurance_valid ?? false,
      registrationYear: body.registration_year ?? null,
    });

    // ── Insert exchange request ──────────────────────────────────────────────
    const admin = createAdminClient();

    const { data: inserted, error: insertError } = await admin
      .from("exchange_requests")
      .insert({
        customer_name:            body.customer_name.trim(),
        phone:                    body.phone.trim(),
        email:                    body.email.trim().toLowerCase(),
        city:                     body.city?.trim() ?? null,
        preferred_contact_method: body.preferred_contact_method ?? "phone",

        current_vehicle_brand:    body.current_vehicle_brand.trim(),
        current_vehicle_model:    body.current_vehicle_model.trim(),
        current_vehicle_year:     body.current_vehicle_year,
        registration_year:        body.registration_year ?? null,
        fuel_type:                body.fuel_type,
        transmission:             body.transmission ?? null,
        ownership_type:           body.ownership_type ?? null,
        mileage:                  body.mileage ?? null,
        registration_number:      body.registration_number?.trim() ?? null,
        condition:                body.condition ?? null,
        accident_history:         body.accident_history ?? false,
        service_history:          body.service_history ?? false,
        insurance_valid:          body.insurance_valid ?? false,
        vehicle_color:            body.vehicle_color?.trim() ?? null,
        number_of_keys:           body.number_of_keys ?? 1,
        vehicle_location:         body.vehicle_location?.trim() ?? null,
        expected_value:           body.expected_value ?? null,
        remarks:                  body.remarks?.trim() ?? null,

        target_ev_id:             body.target_ev_id ?? null,
        target_ev_slug:           body.target_ev_slug ?? null,
        target_ev_brand:          body.target_ev_brand ?? null,
        target_ev_model:          body.target_ev_model ?? null,
        target_ev_price:          body.target_ev_price ?? null,
        target_ev_image:          body.target_ev_image ?? null,

        estimated_value:          valuation.estimatedValue,
        valuation_confidence:     valuation.confidence,
        valuation_notes:          valuation.notes.join(" | "),

        source_page:              body.source_page ?? null,
        submitted_from:           request.headers.get("user-agent")?.slice(0, 200) ?? null,
        status:                   "new",
        priority:                 "medium",
        is_read:                  false,
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      console.error("[exchange-requests] insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save your request. Please try again." },
        { status: 500 }
      );
    }

    const exchangeId = inserted.id;

    // ── Attach uploaded images (if any) ─────────────────────────────────────
    if (body.uploaded_images && body.uploaded_images.length > 0) {
      const imageRows = body.uploaded_images.map((img) => ({
        exchange_request_id: exchangeId,
        image_type:          img.image_type,
        file_url:            img.file_url,
      }));
      await admin.from("exchange_request_images").insert(imageRows);
    }

    // ── Log first activity entry ─────────────────────────────────────────────
    await admin.from("exchange_request_activity").insert({
      exchange_request_id: exchangeId,
      action_type:         "submitted",
      new_status:          "new",
      note:                "Exchange request submitted via website.",
      created_by:          "system",
    });

    return NextResponse.json(
      {
        id:               exchangeId,
        estimated_value:  valuation.estimatedValue,
        confidence:       valuation.confidence,
        notes:            valuation.notes,
        valuation_source: valuation.source, // "ai" | "rules"
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[exchange-requests] unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
