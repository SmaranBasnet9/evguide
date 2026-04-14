export default function ChargingLoadingState() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-[2rem] border border-[#E5E7EB] bg-white p-6"
        >
          {/* Header */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 rounded bg-[#E8F8F5]" />
              <div className="h-5 w-3/4 rounded-lg bg-[#E5E7EB]" />
            </div>
            <div className="h-7 w-24 rounded-full bg-[#F8FAF9]" />
          </div>

          {/* Address */}
          <div className="mb-4 flex gap-2">
            <div className="mt-0.5 h-4 w-4 shrink-0 rounded bg-[#E8F8F5]" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-full rounded bg-[#F8FAF9]" />
              <div className="h-3 w-2/3 rounded bg-[#F8FAF9]" />
            </div>
          </div>

          {/* Stats */}
          <div className="mb-5 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-20 rounded-xl bg-[#F8FAF9]" />
            ))}
          </div>

          {/* CTA */}
          <div className="h-10 rounded-xl bg-[#E8F8F5]" />
        </div>
      ))}
    </div>
  );
}
