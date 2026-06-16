import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

function escapeCSV(value: string | null | undefined): string {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  const role = profile?.role as string | undefined;
  if (role !== "admin" && role !== "super_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to   = searchParams.get("to");

  const admin = createAdminClient();
  let query = admin
    .from("consultation_requests")
    .select("id, full_name, email, phone, sector, ev_model_label, notes, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (from) query = query.gte("created_at", `${from}T00:00:00.000Z`);
  if (to)   query = query.lte("created_at", `${to}T23:59:59.999Z`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = data ?? [];
  const headers = ["ID", "Full Name", "Email", "Phone", "Topic", "Message", "Status", "Received"];
  const csvLines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        escapeCSV(r.id),
        escapeCSV(r.full_name),
        escapeCSV(r.email),
        escapeCSV(r.phone),
        escapeCSV(r.ev_model_label ?? "General"),
        escapeCSV(r.notes),
        escapeCSV(r.status),
        escapeCSV(new Date(r.created_at).toLocaleString("en-GB")),
      ].join(",")
    ),
  ];

  const filename = `enquiries${from ? `_from_${from}` : ""}${to ? `_to_${to}` : ""}.csv`;

  return new NextResponse(csvLines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
