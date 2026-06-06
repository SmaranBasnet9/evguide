function Sk({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className ?? ""}`} />;
}
export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2"><Sk className="h-8 w-44" /><Sk className="h-4 w-36" /></div>
        <Sk className="h-10 w-36 rounded-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-4 space-y-2">
            <Sk className="h-5 w-32" /><Sk className="h-4 w-24" /><Sk className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
