export default function AppointmentLoading() {
  return (
    <main className="min-h-screen bg-surface-base">
      <div className="h-16 border-b border-white/8 bg-surface-base/80" />
      <div className="mx-auto max-w-7xl px-6 py-16 animate-pulse">
        <div className="mb-10 space-y-3">
          <div className="h-4 w-24 rounded bg-white/[0.06]" />
          <div className="h-10 w-72 rounded-2xl bg-white/[0.08]" />
          <div className="h-5 w-96 rounded-xl bg-white/[0.06]" />
        </div>
        <div className="grid gap-6 sm:grid-cols-3 mb-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/[0.06]" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-white/[0.06]" />
          ))}
        </div>
      </div>
    </main>
  );
}
