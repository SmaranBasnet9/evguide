export default function BlogLoading() {
  return (
    <main className="min-h-screen bg-[#F8FAF9] text-[#1A1A1A]">
      <div className="fixed inset-x-0 top-0 z-50 h-16 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-xl" />

      <div className="mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8 animate-pulse">
        <div className="mb-16 space-y-4">
          <div className="h-6 w-40 rounded-full bg-[#E8F8F5]" />
          <div className="h-12 w-3/4 rounded-2xl bg-[#E5E7EB]" />
          <div className="h-5 w-1/2 rounded-xl bg-[#F8FAF9]" />
        </div>

        <div className="mb-12 overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-white">
          <div className="aspect-[21/9] w-full bg-[#F8FAF9]" />
          <div className="p-8 space-y-4">
            <div className="h-4 w-24 rounded-full bg-[#E8F8F5]" />
            <div className="h-8 w-3/4 rounded-xl bg-[#E5E7EB]" />
            <div className="h-4 w-full rounded-lg bg-[#F8FAF9]" />
            <div className="h-4 w-2/3 rounded-lg bg-[#F8FAF9]" />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-[1.75rem] border border-[#E5E7EB] bg-white">
              <div className="aspect-[16/10] w-full bg-[#F8FAF9]" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-20 rounded-full bg-[#E8F8F5]" />
                <div className="h-5 w-full rounded-lg bg-[#E5E7EB]" />
                <div className="h-5 w-3/4 rounded-lg bg-[#E5E7EB]" />
                <div className="h-3 w-1/2 rounded bg-[#F8FAF9]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
