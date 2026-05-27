function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-white/[0.06] ${className ?? ""}`} />;
}
export default function AdminEVsLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
        <div className="border-b border-white/[0.06] bg-white/[0.03] px-6 py-3 flex gap-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-4 w-16" />)}
        </div>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex gap-6 border-b border-white/[0.06] px-6 py-4">
            <Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-16" /><Skeleton className="ml-auto h-4 w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}
