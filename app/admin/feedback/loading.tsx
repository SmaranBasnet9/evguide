function Sk({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className ?? ""}`} />;
}
export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-2"><Sk className="h-8 w-40" /><Sk className="h-4 w-56" /></div>
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-4">
            <Sk className="h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <Sk className="h-4 w-32" />
              <Sk className="h-4 w-full" />
              <Sk className="h-4 w-3/4" />
            </div>
            <Sk className="h-8 w-20 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
