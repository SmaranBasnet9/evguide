export default function CarDetailLoading() {
  return (
    <main className="min-h-screen bg-[#F8FAF9] text-[#1A1A1A]">
      <div className="h-20 border-b border-[#E5E7EB] bg-white" />

      <section className="pt-24">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-2 animate-pulse">
            <div className="h-4 w-16 rounded bg-[#E5E7EB]" />
            <div className="h-4 w-2 rounded bg-[#E5E7EB]" />
            <div className="h-4 w-20 rounded bg-[#E5E7EB]" />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start xl:grid-cols-[1fr_460px]">
            <div className="aspect-[16/9] w-full animate-pulse overflow-hidden rounded-[2rem] bg-[#E8F8F5]" />

            <div className="flex flex-col gap-5 animate-pulse rounded-[2rem] border border-[#E5E7EB] bg-white p-6 lg:p-7">
              <div className="space-y-3">
                <div className="h-3 w-20 rounded bg-[#E5E7EB]" />
                <div className="h-9 w-48 rounded-xl bg-[#E5E7EB]" />
                <div className="h-11 w-36 rounded-xl bg-[#E8F8F5]" />
                <div className="h-3 w-32 rounded bg-[#E5E7EB]" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-[#F8FAF9]" />
                <div className="h-4 w-5/6 rounded bg-[#F8FAF9]" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-xl bg-[#F8FAF9]" />
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <div className="h-11 flex-1 rounded-xl bg-[#E8F8F5]" />
                <div className="h-11 flex-1 rounded-xl bg-[#E5E7EB]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 border-t border-[#E5E7EB] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 animate-pulse">
          <div className="mb-6 space-y-2">
            <div className="h-3 w-28 rounded bg-[#E8F8F5]" />
            <div className="h-8 w-72 rounded-xl bg-[#E5E7EB]" />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-48 rounded-[1.75rem] bg-[#F8FAF9]" />
            <div className="h-48 rounded-[1.75rem] bg-[#F8FAF9]" />
          </div>
        </div>
      </section>

      <section className="border-t border-[#E5E7EB] bg-[#F8FAF9]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 animate-pulse">
          <div className="mb-8 space-y-2">
            <div className="h-3 w-20 rounded bg-[#E8F8F5]" />
            <div className="h-8 w-48 rounded-xl bg-[#E5E7EB]" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-24 rounded-[1.25rem] bg-white" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
