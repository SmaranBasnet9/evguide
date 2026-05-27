import Link from "next/link";
import { notFound } from "next/navigation";
import CrmLeadActions from "@/components/dealer/CrmLeadActions";
import TestDriveBookingsTable from "@/components/dealer/TestDriveBookingsTable";
import { getCrmLeadDetails } from "@/lib/crm";
import type { UserEventType } from "@/types";

const EVENT_LABELS: Partial<Record<UserEventType, string>> = {
  page_view: "Page view",
  car_view: "Vehicle detail viewed",
  engagement_milestone: "Engagement milestone",
  recommendation_started: "Recommendation journey started",
  recommendation_completed: "Recommendation journey completed",
  emi_used: "EMI tool used",
  compare_clicked: "Vehicle compare used",
  price_filter_used: "Price filter used",
  loan_offer_clicked: "Bank offer clicked",
  repeat_visit: "Repeat visit detected",
  consultation_started: "Consultation journey started",
  consultation_submitted: "Consultation submitted",
  finance_apply_clicked: "Finance application intent",
  test_drive_clicked: "Test drive CTA clicked",
  reserve_clicked: "Reserve CTA clicked",
};

function formatDate(value: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function summarizeEventValue(value: Record<string, unknown> | null): string {
  if (!value) return "";
  return Object.entries(value)
    .slice(0, 4)
    .map(([key, item]) => `${key}: ${String(item)}`)
    .join(" • ");
}

export default async function AdminCrmLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { lead, crm, notes, events, testDriveBookings } = await getCrmLeadDetails(id);

  if (!lead) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/crm" className="text-sm font-medium text-blue-600 hover:underline">
            Back to CRM
          </Link>
          <p className="mt-3 text-sm font-semibold text-blue-600">Lead workspace</p>
          <h1 className="mt-1 text-3xl font-extrabold text-white">{lead.displayId}</h1>
          <p className="mt-2 max-w-3xl text-white/50">
            Journey stage: <strong className="font-semibold text-white/80">{lead.journey_stage}</strong>.
            {" "}
            {lead.journey_stage_reason}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/50 shadow-sm">
          <p>Intent score: <strong className="text-white">{lead.intent_score}</strong></p>
          <p className="mt-1">CRM status: <strong className="text-white">{lead.crm_status}</strong></p>
          <p className="mt-1">Priority: <strong className="text-white">{lead.crm_priority}</strong></p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-sm">
          <p className="text-sm text-white/50">Top interest</p>
          <p className="mt-2 text-xl font-bold text-white">{lead.strongestCarLabel ?? "-"}</p>
          <p className="mt-1 text-xs text-white/40">{lead.favorite_brand ?? "No favorite brand inferred"}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-sm">
          <p className="text-sm text-white/50">Research depth</p>
          <p className="mt-2 text-xl font-bold text-white">{lead.total_page_views} page views</p>
          <p className="mt-1 text-xs text-white/40">{lead.primary_paths.join(" • ") || "No path pattern yet"}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-sm">
          <p className="text-sm text-white/50">Buyer style</p>
          <p className="mt-2 text-xl font-bold text-white">{lead.inferred_buyer_style ?? "Not enough signal"}</p>
          <p className="mt-1 text-xs text-white/40">{lead.inferred_buyer_style_reason ?? "No stable inference yet."}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-sm">
          <p className="text-sm text-white/50">Last active</p>
          <p className="mt-2 text-xl font-bold text-white">{formatDate(lead.last_activity_at)}</p>
          <p className="mt-1 text-xs text-white/40">Follow-up: {formatDate(lead.next_follow_up_at)}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-sm">
            <h2 className="text-lg font-bold text-white">Journey timeline</h2>
            <div className="mt-4 space-y-3">
              {events.length === 0 ? (
                <p className="text-sm text-white/50">No raw activity events found for this lead yet.</p>
              ) : (
                events.map((event) => (
                  <div key={event.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-white">
                        {EVENT_LABELS[event.event_type] ?? event.event_type}
                      </p>
                      <p className="text-xs text-white/40">{formatDate(event.created_at)}</p>
                    </div>
                    <p className="mt-1 text-xs text-white/50">
                      Path: {event.page_path ?? "-"}{event.car_id ? ` • car ${event.car_id}` : ""}
                    </p>
                    {summarizeEventValue(event.event_value) && (
                      <p className="mt-2 text-xs text-white/50">{summarizeEventValue(event.event_value)}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-sm">
            <h2 className="text-lg font-bold text-white">CRM notes</h2>
            <div className="mt-4 space-y-3">
              {notes.length === 0 ? (
                <p className="text-sm text-white/50">No notes added yet.</p>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                    <p className="text-sm text-white/80">{note.body}</p>
                    <p className="mt-2 text-xs text-white/40">{formatDate(note.created_at)}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <TestDriveBookingsTable bookings={testDriveBookings} title="Lead Test Drive Bookings" />
        </div>

        <div className="space-y-6">
          <CrmLeadActions profileId={lead.id} crm={crm} />

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-sm">
            <h2 className="text-lg font-bold text-white">Qualification hints</h2>
            <ul className="mt-4 space-y-2 text-sm text-white/50">
              <li>Authenticated: {lead.isAuthenticated ? "Yes" : "No"}</li>
              <li>Predicted buy window: {lead.predicted_buy_window}</li>
              <li>Affordability band: {lead.estimated_affordability_band}</li>
              <li>Conversions recorded: {lead.total_conversion_events}</li>
              <li>Owner: {lead.crm_owner_name ?? "Unassigned"}</li>
              <li>Tags: {lead.crm_tags.length > 0 ? lead.crm_tags.join(", ") : "None"}</li>
            </ul>
            {crm?.qualification_notes && (
              <p className="mt-4 rounded-2xl bg-white/[0.03] p-4 text-sm text-white/60">
                {crm.qualification_notes}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
