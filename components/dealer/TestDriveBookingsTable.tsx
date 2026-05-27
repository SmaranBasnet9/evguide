import AdminTestDriveForwardButton from "@/components/AdminTestDriveForwardButton";
import type { TestDriveBookingRow } from "@/types";

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_STYLES: Record<TestDriveBookingRow["status"], string> = {
  requested: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  reviewing: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  scheduled: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  completed: "bg-white/10 text-white/50 border-white/10",
  cancelled: "bg-rose-500/15 text-rose-400 border-rose-500/20",
};

export default function TestDriveBookingsTable({
  bookings,
  title = "Test Drive Bookings",
}: {
  bookings: TestDriveBookingRow[];
  title?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>

      {bookings.length === 0 ? (
        <div className="px-5 py-10 text-sm text-white/40">No test-drive bookings yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03] text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Customer</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Vehicle</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Requested Slot</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Location</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Submitted</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Dealer Forward</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.04]">
                  <td className="px-4 py-4">
                    <p className="font-medium text-white">{booking.full_name}</p>
                    <p className="text-xs text-white/40">{booking.email}</p>
                    <p className="text-xs text-white/40">{booking.phone}</p>
                  </td>
                  <td className="px-4 py-4 text-white/70">{booking.ev_model_label ?? "-"}</td>
                  <td className="px-4 py-4 text-white/70">
                    {booking.preferred_date} at {booking.preferred_time_slot}
                  </td>
                  <td className="px-4 py-4 text-white/70">
                    <p>{booking.preferred_location}</p>
                    {booking.current_vehicle && (
                      <p className="mt-1 text-xs text-white/40">Current: {booking.current_vehicle}</p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[booking.status]}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-white/50">{formatDate(booking.created_at)}</td>
                  <td className="px-4 py-4 align-top">
                    <AdminTestDriveForwardButton
                      id={booking.id}
                      vehicleLabel={booking.ev_model_label}
                      customerName={booking.full_name}
                      customerEmail={booking.email}
                      location={booking.preferred_location}
                      preferredDate={booking.preferred_date}
                      preferredTimeSlot={booking.preferred_time_slot}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
