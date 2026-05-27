export const dynamic = "force-dynamic";

import { createAdminClient } from "@/lib/supabase/admin";
import TestDriveBookingsTable from "@/components/dealer/TestDriveBookingsTable";
import type { TestDriveBookingRow } from "@/types";

async function getBookings(): Promise<TestDriveBookingRow[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("test_drive_bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/test-drives]", error.message);
    return [];
  }
  return (data ?? []) as TestDriveBookingRow[];
}

const STATUS_COUNTS = (bookings: TestDriveBookingRow[]) => ({
  total: bookings.length,
  requested: bookings.filter((b) => b.status === "requested").length,
  reviewing: bookings.filter((b) => b.status === "reviewing").length,
  scheduled: bookings.filter((b) => b.status === "scheduled").length,
  completed: bookings.filter((b) => b.status === "completed").length,
});

export default async function TestDrivesAdminPage() {
  const bookings = await getBookings();
  const counts = STATUS_COUNTS(bookings);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Test Drive Bookings</h1>
        <p className="mt-1 text-sm text-white/50">
          Manage all test drive requests. Forward to dealers or update booking status.
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total requests", value: counts.total, color: "text-white" },
          { label: "Awaiting action", value: counts.requested, color: "text-amber-400" },
          { label: "Reviewing", value: counts.reviewing, color: "text-blue-400" },
          { label: "Scheduled", value: counts.scheduled, color: "text-brand" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/8 bg-white/[0.04] px-5 py-4"
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="mt-1 text-xs text-white/40">{stat.label}</p>
          </div>
        ))}
      </div>

      <TestDriveBookingsTable bookings={bookings} title="All Test Drive Requests" />
    </div>
  );
}
