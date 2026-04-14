export default function ChargingLoading() {
  return (
    <main className="min-h-screen bg-[#F8FAF9]">
      <div className="h-20 border-b border-[#E5E7EB] bg-white" />

      {/* Hero skeleton */}
      <div
        className="animate-pulse px-6 pt-32 pb-20 text-center"
        style={{ background: "linear-gradient(135deg, #E8F8F5 0%, #FFFFFF 60%)" }}
      >
        <div className="mx-auto max-w-3xl space-y-5">
          <div className="mx-auto h-7 w-40 rounded-full bg-[#D1F2EB]" />
          <div className="mx-auto h-14 w-3/4 rounded-2xl bg-[#E5E7EB]" />
          <div className="mx-auto h-5 w-1/2 rounded bg-[#F8FAF9]" />
          <div className="mx-auto h-11 w-36 rounded-full bg-[#D1F2EB]" />
          <div className="mx-auto h-12 max-w-xl rounded-full bg-[#E5E7EB]" />
        </div>
      </div>
    </main>
  );
}
