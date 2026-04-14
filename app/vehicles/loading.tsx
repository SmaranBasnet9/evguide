export default function VehiclesLoading() {
  return (
    <main className="min-h-screen bg-[#F8FAF9]">
      {/* Navbar placeholder */}
      <div className="h-16 border-b border-[#E5E7EB] bg-white" />

      <div className="mx-auto max-w-screen-2xl px-4 pt-24 pb-20 sm:px-6 lg:px-8">
        {/* Hero banner skeleton */}
        <div className="mb-12 animate-pulse overflow-hidden rounded-[2.5rem] border border-[#E5E7EB] bg-white px-6 py-20 sm:px-12 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6 max-w-2xl">
              <div className="h-6 w-48 rounded-full bg-[#E8F8F5]" />
              <div className="space-y-3">
                <div className="h-12 w-full rounded-2xl bg-[#F8FAF9]" />
                <div className="h-12 w-3/4 rounded-2xl bg-[#F8FAF9]" />
              </div>
              <div className="h-5 w-full max-w-xl rounded-xl bg-[#E5E7EB]" />
              <div className="flex gap-3">
                <div className="h-9 w-36 rounded-full bg-[#E5E7EB]" />
                <div className="h-9 w-36 rounded-full bg-[#E5E7EB]" />
                <div className="h-9 w-36 rounded-full bg-[#E5E7EB]" />
              </div>
              <div className="h-14 w-full max-w-xl rounded-2xl bg-[#E5E7EB]" />
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-12">
          {/* Sidebar skeleton */}
          <div className="hidden animate-pulse space-y-6 lg:block">
            <div className="rounded-[2rem] border border-[#E5E7EB] bg-white p-6">
              <div className="mb-6 h-10 w-full rounded-xl bg-[#E8F8F5]" />
              <div className="space-y-4">
                <div className="h-4 w-24 rounded bg-[#E5E7EB]" />
                <div className="h-2 w-full rounded-full bg-[#E5E7EB]" />
                <div className="h-4 w-24 rounded bg-[#E5E7EB] pt-2" />
                <div className="flex gap-2">
                  <div className="h-8 flex-1 rounded-lg bg-[#E8F8F5]" />
                  <div className="h-8 flex-1 rounded-lg bg-[#E8F8F5]" />
                  <div className="h-8 flex-1 rounded-lg bg-[#E8F8F5]" />
                </div>
                <div className="h-4 w-24 rounded bg-[#E5E7EB] pt-2" />
                <div className="space-y-2">
                  <div className="h-10 w-full rounded-xl bg-[#F8FAF9]" />
                  <div className="h-10 w-full rounded-xl bg-[#F8FAF9]" />
                  <div className="h-10 w-full rounded-xl bg-[#F8FAF9]" />
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle cards skeleton */}
          <div className="space-y-10">
            <VehicleSkeletonSection />
            <VehicleSkeletonSection />
          </div>
        </div>
      </div>
    </main>
  );
}

function VehicleSkeletonSection() {
  return (
    <section className="mb-16 animate-pulse">
      <div className="mb-8 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-[#E8F8F5]" />
        <div className="space-y-2">
          <div className="h-6 w-56 rounded-xl bg-[#E5E7EB]" />
          <div className="h-4 w-80 rounded-xl bg-[#F8FAF9]" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <VehicleCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

function VehicleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-white p-3">
      <div className="aspect-[4/3] w-full rounded-[1.5rem] bg-[#F8FAF9]" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-3 w-16 rounded bg-[#E5E7EB]" />
            <div className="h-6 w-32 rounded-lg bg-[#E5E7EB]" />
          </div>
          <div className="space-y-2 text-right">
            <div className="h-5 w-20 rounded-lg bg-[#E8F8F5]" />
            <div className="h-3 w-16 rounded bg-[#E5E7EB]" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-[1.25rem] border border-[#E5E7EB] bg-[#F8FAF9] p-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="h-4 w-4 rounded bg-[#E5E7EB]" />
              <div className="h-4 w-10 rounded bg-[#E5E7EB]" />
              <div className="h-2 w-8 rounded bg-[#E5E7EB]" />
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-1">
          <div className="h-10 flex-1 rounded-xl bg-[#E8F8F5]" />
          <div className="h-10 w-20 rounded-xl bg-[#E5E7EB]" />
        </div>
      </div>
    </div>
  );
}
