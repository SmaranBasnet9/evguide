export default function AppointmentLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="h-16 border-b border-slate-200 bg-white" />
      <div className="mx-auto max-w-7xl px-6 py-16 animate-pulse">
        <div className="mb-10 space-y-3">
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="h-10 w-72 rounded-2xl bg-slate-200" />
          <div className="h-5 w-96 rounded-xl bg-slate-200" />
        </div>
        <div className="grid gap-6 sm:grid-cols-3 mb-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-200" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-200" />
          ))}
        </div>
      </div>
    </main>
  );
}
