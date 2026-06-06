function Sk({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className ?? ""}`} />;
}
export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2"><Sk className="h-8 w-40" /><Sk className="h-4 w-32" /></div>
        <Sk className="h-10 w-36 rounded-xl" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-3"><Sk className="h-4 w-28" /></div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-gray-100 px-6 py-4">
            <Sk className="h-4 w-48" /><Sk className="h-4 w-20" /><Sk className="h-4 w-24" />
            <Sk className="ml-auto h-6 w-14 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
