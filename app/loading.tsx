// Home page loading skeleton — shown while server fetches EV models + blog posts
export default function HomeLoading() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8FAF9]">
      {/* Navbar placeholder */}
      <div className="fixed inset-x-0 top-0 z-50 h-16 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-xl" />

      {/* Hero skeleton */}
      <section className="relative flex min-h-[92vh] items-center pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="mx-auto mb-10 max-w-3xl text-center space-y-4">
            <div className="mx-auto h-7 w-72 rounded-full bg-[#E8F8F5]" />
            <div className="space-y-3">
              <div className="mx-auto h-14 w-full max-w-xl rounded-2xl bg-[#F8FAF9]" />
              <div className="mx-auto h-14 w-3/4 rounded-2xl bg-[#F8FAF9]" />
            </div>
            <div className="mx-auto h-5 w-96 rounded-xl bg-[#E5E7EB]" />
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="h-[320px] rounded-[2rem] bg-[#E8F8F5]" />
            <div className="h-[320px] rounded-[2rem] bg-[#E8F8F5]" />
          </div>
        </div>
      </section>
    </main>
  );
}
