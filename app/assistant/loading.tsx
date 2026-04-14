export default function AssistantLoading() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="h-16 border-b border-slate-200 bg-white" />
      <div className="mx-auto max-w-4xl px-6 py-16 animate-pulse space-y-6">
        <div className="h-4 w-24 rounded bg-slate-200" />
        <div className="h-10 w-64 rounded-2xl bg-slate-200" />
        <div className="h-4 w-80 rounded bg-slate-200" />
        <div className="mt-10 space-y-4 rounded-2xl border border-slate-200 bg-white p-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 w-full rounded-xl bg-slate-100" />
          ))}
          <div className="h-12 w-40 rounded-xl bg-slate-200 mt-4" />
        </div>
      </div>
    </main>
  );
}
