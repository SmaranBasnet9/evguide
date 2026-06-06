function Sk({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className ?? ""}`} />;
}
export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-2"><Sk className="h-8 w-40" /><Sk className="h-4 w-52" /></div>
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => <Sk key={i} className="h-24 rounded-2xl" />)}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
            <Sk className="h-2 w-2 rounded-full" />
            <Sk className="h-4 w-24" /><Sk className="h-4 w-40" /><Sk className="ml-auto h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
