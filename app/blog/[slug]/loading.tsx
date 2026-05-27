export default function ArticleLoading() {
  return (
    <main className="min-h-screen bg-surface-base text-white">
      <div className="fixed inset-x-0 top-0 z-50 h-16 border-b border-white/8 bg-surface-base/80 backdrop-blur-xl" />

      <div className="animate-pulse">
        <div className="aspect-[21/8] w-full bg-white/[0.04]" />
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 space-y-4">
          <div className="h-4 w-24 rounded-full bg-white/[0.06]" />
          <div className="h-10 w-full rounded-2xl bg-white/[0.08]" />
          <div className="h-10 w-4/5 rounded-2xl bg-white/[0.08]" />
          <div className="flex gap-3 pt-2">
            <div className="h-4 w-28 rounded bg-white/[0.04]" />
            <div className="h-4 w-20 rounded bg-white/[0.04]" />
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-full rounded bg-white/[0.06]" />
              <div className="h-4 w-5/6 rounded bg-white/[0.06]" />
              <div className="h-4 w-full rounded bg-white/[0.06]" />
              <div className="h-4 w-3/4 rounded bg-white/[0.04]" />
            </div>
          ))}

          <div className="my-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 space-y-4">
            <div className="h-5 w-48 rounded-lg bg-white/[0.06]" />
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-[1.5rem] bg-white/[0.04]" />
              ))}
            </div>
          </div>

          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-full rounded bg-white/[0.06]" />
              <div className="h-4 w-4/5 rounded bg-white/[0.06]" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
