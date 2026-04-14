import Link from "next/link";
import Image from "next/image";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminExchangeActions from "@/components/exchange/AdminExchangeActions";
import type {
  ExchangeRequestRow,
  ExchangeRequestImageRow,
  ExchangeRequestActivityRow,
  ExchangeStatus,
} from "@/types";

// ── Data fetch ────────────────────────────────────────────────────────────────

async function getExchangeDetail(id: string): Promise<{
  request: ExchangeRequestRow;
  images: ExchangeRequestImageRow[];
  activity: ExchangeRequestActivityRow[];
} | null> {
  const admin = createAdminClient();

  const [reqRes, imgRes, actRes] = await Promise.all([
    admin.from("exchange_requests").select("*").eq("id", id).single(),
    admin.from("exchange_request_images").select("*").eq("exchange_request_id", id).order("created_at"),
    admin.from("exchange_request_activity").select("*").eq("exchange_request_id", id).order("created_at", { ascending: false }),
  ]);

  if (reqRes.error || !reqRes.data) return null;

  // Mark as read
  if (!reqRes.data.is_read) {
    await admin.from("exchange_requests").update({ is_read: true }).eq("id", id);
  }

  return {
    request:  reqRes.data as ExchangeRequestRow,
    images:   (imgRes.data ?? []) as ExchangeRequestImageRow[],
    activity: (actRes.data ?? []) as ExchangeRequestActivityRow[],
  };
}

// ── Status/priority metadata ──────────────────────────────────────────────────

const STATUS_LABELS: Record<ExchangeStatus, string> = {
  new:                  "New",
  contacted:            "Contacted",
  valuation_reviewed:   "Valuation Reviewed",
  inspection_scheduled: "Inspection Scheduled",
  offer_sent:           "Offer Sent",
  converted:            "Converted",
  rejected:             "Rejected",
  archived:             "Archived",
};

const STATUS_COLORS: Record<ExchangeStatus, string> = {
  new:                  "bg-blue-100 text-blue-700",
  contacted:            "bg-cyan-100 text-cyan-700",
  valuation_reviewed:   "bg-violet-100 text-violet-700",
  inspection_scheduled: "bg-amber-100 text-amber-700",
  offer_sent:           "bg-orange-100 text-orange-700",
  converted:            "bg-emerald-100 text-emerald-700",
  rejected:             "bg-red-100 text-red-700",
  archived:             "bg-slate-100 text-slate-500",
};

// ── Page ──────────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminExchangeDetailPage({ params }: Props) {
  // Auth guard
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin-login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");

  const { id } = await params;
  const detail = await getExchangeDetail(id);
  if (!detail) notFound();

  const { request: r, images, activity } = detail;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Back + header */}
      <div>
        <Link
          href="/admin/exchange"
          className="text-sm text-slate-500 hover:text-blue-600"
        >
          ← Exchange Requests
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {r.customer_name}
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {r.email} · {r.phone}
              {r.city ? ` · ${r.city}` : ""}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Submitted {new Date(r.created_at).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[r.status as ExchangeStatus]}`}>
              {STATUS_LABELS[r.status as ExchangeStatus] ?? r.status}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
              r.priority === "urgent" ? "bg-red-100 text-red-700" :
              r.priority === "high"   ? "bg-amber-100 text-amber-700" :
              r.priority === "medium" ? "bg-blue-100 text-blue-700" :
              "bg-slate-100 text-slate-600"
            }`}>
              {r.priority} priority
            </span>
            {r.assigned_to && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                Assigned: {r.assigned_to}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Left column */}
        <div className="space-y-5">
          {/* Current vehicle */}
          <Card title="Current Vehicle">
            <Grid2>
              <DetailRow label="Brand / Model" value={`${r.current_vehicle_brand} ${r.current_vehicle_model}`} />
              <DetailRow label="Year" value={String(r.current_vehicle_year)} />
              <DetailRow label="Fuel type" value={r.fuel_type} capitalize />
              <DetailRow label="Transmission" value={r.transmission ?? "—"} capitalize />
              <DetailRow label="Ownership" value={r.ownership_type?.replace(/_/g, " ") ?? "—"} capitalize />
              <DetailRow label="Mileage" value={r.mileage != null ? `${r.mileage.toLocaleString()} km` : "—"} />
              <DetailRow label="Registration number" value={r.registration_number ?? "—"} />
              <DetailRow label="Registration year" value={r.registration_year != null ? String(r.registration_year) : "—"} />
              <DetailRow label="Condition" value={r.condition ?? "—"} capitalize />
              <DetailRow label="Colour" value={r.vehicle_color ?? "—"} />
              <DetailRow label="Keys" value={r.number_of_keys != null ? String(r.number_of_keys) : "1"} />
              <DetailRow label="Vehicle location" value={r.vehicle_location ?? "—"} />
            </Grid2>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <FlagBadge label="Accident history" active={r.accident_history} danger />
              <FlagBadge label="Service history" active={r.service_history} />
              <FlagBadge label="Insurance valid" active={r.insurance_valid} />
            </div>
            {r.remarks && (
              <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500">Customer remarks</p>
                <p className="mt-1 text-sm text-slate-700">{r.remarks}</p>
              </div>
            )}
          </Card>

          {/* Target EV */}
          {r.target_ev_brand && (
            <Card title="Desired EV">
              <div className="flex items-center gap-4">
                {r.target_ev_image && (
                  <div className="relative h-16 w-24 overflow-hidden rounded-xl bg-slate-100 flex-shrink-0">
                    <Image src={r.target_ev_image} alt={r.target_ev_model ?? ""} fill className="object-cover" unoptimized />
                  </div>
                )}
                <div>
                  <p className="text-lg font-bold text-slate-900">
                    {r.target_ev_brand} {r.target_ev_model}
                  </p>
                  {r.target_ev_price != null && (
                    <p className="text-sm text-slate-500">
                      Listed at £{Number(r.target_ev_price).toLocaleString()}
                    </p>
                  )}
                  {r.target_ev_id && (
                    <Link
                      href={`/cars/${r.target_ev_id}`}
                      target="_blank"
                      className="mt-1 text-xs text-blue-600 hover:underline"
                    >
                      View listing →
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Valuation */}
          <Card title="Valuation">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border-2 border-blue-100 bg-blue-50 p-4">
                <p className="text-xs font-semibold text-blue-500">System estimate</p>
                <p className="mt-1 text-3xl font-black text-blue-700">
                  {r.estimated_value != null
                    ? `£${Number(r.estimated_value).toLocaleString()}`
                    : "—"}
                </p>
                <p className="text-xs text-slate-500 capitalize">
                  {r.valuation_confidence ?? "unknown"} confidence
                </p>
              </div>
              <div className="rounded-2xl border-2 border-emerald-100 bg-emerald-50 p-4">
                <p className="text-xs font-semibold text-emerald-600">Final offer</p>
                <p className="mt-1 text-3xl font-black text-emerald-700">
                  {r.final_offer_value != null
                    ? `£${Number(r.final_offer_value).toLocaleString()}`
                    : "Not set"}
                </p>
                <p className="text-xs text-slate-500">Set by admin after review</p>
              </div>
            </div>
            {r.expected_value != null && (
              <p className="mt-2 text-xs text-slate-500">
                Customer expectation: £{Number(r.expected_value).toLocaleString()}
              </p>
            )}
            {r.valuation_notes && (
              <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500">Valuation notes</p>
                <ul className="mt-1 space-y-0.5">
                  {r.valuation_notes.split(" | ").map((note, i) => (
                    <li key={i} className="text-xs text-slate-600">• {note}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          {/* Photos */}
          {images.length > 0 && (
            <Card title={`Vehicle Photos (${images.length})`}>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {images.map((img) => (
                  <a
                    key={img.id}
                    href={img.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block overflow-hidden rounded-xl border border-slate-100"
                  >
                    <div className="relative aspect-[4/3] bg-slate-100">
                      <Image
                        src={img.file_url}
                        alt={img.image_type}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                        unoptimized
                      />
                    </div>
                    <p className="bg-slate-50 px-2 py-1 text-center text-[10px] capitalize text-slate-500">
                      {img.image_type}
                    </p>
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Activity timeline */}
          <Card title="Activity Timeline">
            {activity.length === 0 ? (
              <p className="text-sm text-slate-400">No activity logged yet.</p>
            ) : (
              <ol className="relative border-l border-slate-200 pl-5 space-y-4">
                {activity.map((entry) => (
                  <li key={entry.id} className="relative">
                    <div className="absolute -left-[22px] top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-slate-300" />
                    <p className="text-xs text-slate-400">
                      {new Date(entry.created_at).toLocaleString("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                      {entry.created_by ? ` · ${entry.created_by}` : ""}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-slate-800 capitalize">
                      {entry.action_type.replace(/_/g, " ")}
                      {entry.old_status && entry.new_status
                        ? ` — ${entry.old_status} → ${entry.new_status}`
                        : ""}
                    </p>
                    {entry.note && (
                      <p className="mt-0.5 text-xs text-slate-500">{entry.note}</p>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        {/* Right column — Actions panel */}
        <div className="space-y-5">
          <AdminExchangeActions
            id={r.id}
            currentStatus={r.status}
            currentPriority={r.priority}
            assignedTo={r.assigned_to ?? ""}
            adminNotes={r.admin_notes ?? ""}
            finalOfferValue={r.final_offer_value != null ? String(r.final_offer_value) : ""}
          />

          {/* Contact info card */}
          <Card title="Contact Details">
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-500">Name:</span> {r.customer_name}</p>
              <p><span className="text-slate-500">Phone:</span> {r.phone}</p>
              <p><span className="text-slate-500">Email:</span> {r.email}</p>
              {r.city && <p><span className="text-slate-500">City:</span> {r.city}</p>}
              <p>
                <span className="text-slate-500">Preferred contact:</span>{" "}
                <span className="capitalize">{r.preferred_contact_method ?? "phone"}</span>
              </p>
            </div>
          </Card>

          {/* Meta */}
          <Card title="Submission Info">
            <div className="space-y-1.5 text-xs text-slate-500">
              <p>ID: <span className="font-mono text-slate-700">{r.id.slice(0, 8)}…</span></p>
              {r.source_page && <p>Source: {r.source_page}</p>}
              <p>Submitted: {new Date(r.created_at).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })}</p>
              <p>Last updated: {new Date(r.updated_at).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short" })}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 border-b border-slate-100 pb-3 text-sm font-bold text-slate-700">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">{children}</div>;
}

function DetailRow({
  label,
  value,
  capitalize = false,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="flex flex-col py-1 border-b border-slate-50 last:border-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`text-sm font-medium text-slate-800 ${capitalize ? "capitalize" : ""}`}>{value}</p>
    </div>
  );
}

function FlagBadge({
  label,
  active,
  danger = false,
}: {
  label: string;
  active: boolean;
  danger?: boolean;
}) {
  const activeClass = danger && active
    ? "bg-red-100 text-red-700 border-red-200"
    : active
    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : "bg-slate-100 text-slate-400 border-slate-200";

  return (
    <div className={`rounded-xl border px-3 py-2 text-center text-xs font-semibold ${activeClass}`}>
      {active ? "✓" : "✗"} {label}
    </div>
  );
}
