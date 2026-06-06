function Sk({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className ?? ""}`} />;
}
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="space-y-2"><Sk className="h-8 w-44" /><Sk className="h-4 w-36" /></div>
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => <Sk key={i} className="h-20 rounded-2xl" />)}
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex gap-4 border-b border-gray-100 bg-gray-50 px-6 py-3">
          {Array.from({ length: 5 }).map((_, i) => <Sk key={i} className="h-4 w-20" />)}
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-gray-100 px-6 py-4">
            <Sk className="h-4 w-32" /><Sk className="h-4 w-24" /><Sk className="h-12 w-12 rounded-full" />
            <Sk className="ml-auto h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
