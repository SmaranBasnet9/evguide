function Sk({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className ?? ""}`} />;
}
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="space-y-2"><Sk className="h-8 w-44" /><Sk className="h-4 w-36" /></div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-4 space-y-3">
            <Sk className="h-5 w-24" />
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="rounded-xl border border-gray-100 p-3 space-y-1.5">
                <Sk className="h-4 w-28" /><Sk className="h-3 w-20" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
