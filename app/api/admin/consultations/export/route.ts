import { requireAdmin } from "@/lib/security/admin";
import { createAdminClient } from "@/lib/supabase/admin";

function escapeCsvCell(value: unknown): string {
  const str = value == null ? "" : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function rowToCsv(row: Record<string, unknown>): string {
  return Object.values(row).map(escapeCsvCell).join(",");
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("consultation_requests")
    .select("id, full_name, email, phone, sector, bank_name, ev_model_label, preferred_time, notes, status, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  const headers = ["id", "full_name", "email", "phone", "sector", "bank_name", "ev_model_label", "preferred_time", "notes", "status", "created_at"];
  const lines = [
    headers.join(","),
    ...(data ?? []).map((row) => rowToCsv(row as Record<string, unknown>)),
  ];
  const csv = lines.join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="consultations-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
