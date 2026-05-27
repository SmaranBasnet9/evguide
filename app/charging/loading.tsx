export default function ChargingLoading() {
  return (
    <main className="min-h-screen bg-surface-base">
      <div className="h-20 border-b border-white/8 bg-surface-base/80" />

      <div className="animate-pulse px-6 pt-32 pb-20 text-center">
        <div className="mx-auto max-w-3xl space-y-5">
          <div className="mx-auto h-7 w-40 rounded-full bg-brand/20" />
          <div className="mx-auto h-14 w-3/4 rounded-2xl bg-white/[0.08]" />
          <div className="mx-auto h-5 w-1/2 rounded bg-white/[0.04]" />
          <div className="mx-auto h-11 w-36 rounded-full bg-brand/20" />
          <div className="mx-auto h-12 max-w-xl rounded-full bg-white/[0.08]" />
        </div>
      </div>
    </main>
  );
}
