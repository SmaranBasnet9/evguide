export default function AssistantLoading() {
  return (
    <main className="min-h-screen bg-surface-base text-white">
      <div className="h-16 border-b border-white/8 bg-surface-base/80" />
      <div className="mx-auto max-w-4xl px-6 py-16 animate-pulse space-y-6">
        <div className="h-4 w-24 rounded bg-white/[0.06]" />
        <div className="h-10 w-64 rounded-2xl bg-white/[0.08]" />
        <div className="h-4 w-80 rounded bg-white/[0.06]" />
        <div className="mt-10 space-y-4 rounded-2xl border border-white/10 bg-white/[0.04] p-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 w-full rounded-xl bg-white/[0.06]" />
          ))}
          <div className="h-12 w-40 rounded-xl bg-white/[0.08] mt-4" />
        </div>
      </div>
    </main>
  );
}
