function Sk({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className ?? ""}`} />;
}
export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2"><Sk className="h-8 w-40" /><Sk className="h-4 w-52" /></div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4">
            <Sk className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1.5"><Sk className="h-4 w-36" /><Sk className="h-3 w-24" /></div>
            <Sk className="h-6 w-20 rounded-full" />
            <Sk className="h-8 w-24 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
