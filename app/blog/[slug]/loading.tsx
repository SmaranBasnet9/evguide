export default function ArticleLoading() {
  return (
    <main className="min-h-screen bg-[#F8FAF9] text-[#1A1A1A]">
      <div className="fixed inset-x-0 top-0 z-50 h-16 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-xl" />

      <div className="animate-pulse">
        <div className="aspect-[21/8] w-full bg-[#E8F8F5]" />
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 space-y-4">
          <div className="h-4 w-24 rounded-full bg-[#E8F8F5]" />
          <div className="h-10 w-full rounded-2xl bg-[#E5E7EB]" />
          <div className="h-10 w-4/5 rounded-2xl bg-[#E5E7EB]" />
          <div className="flex gap-3 pt-2">
            <div className="h-4 w-28 rounded bg-[#F8FAF9]" />
            <div className="h-4 w-20 rounded bg-[#F8FAF9]" />
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-full rounded bg-[#E5E7EB]" />
              <div className="h-4 w-5/6 rounded bg-[#E5E7EB]" />
              <div className="h-4 w-full rounded bg-[#E5E7EB]" />
              <div className="h-4 w-3/4 rounded bg-[#F8FAF9]" />
            </div>
          ))}

          <div className="my-8 rounded-[2rem] border border-[#E5E7EB] bg-white p-6 space-y-4">
            <div className="h-5 w-48 rounded-lg bg-[#E8F8F5]" />
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-[1.5rem] bg-[#F8FAF9]" />
              ))}
            </div>
          </div>

          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-full rounded bg-[#E5E7EB]" />
              <div className="h-4 w-4/5 rounded bg-[#E5E7EB]" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
