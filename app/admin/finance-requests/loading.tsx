function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-white/[0.06] ${className ?? ""}`} />;
}
export default function FinanceRequestsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-56" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b border-white/[0.06] px-4 py-3">
            <Skeleton className="h-4 w-28" /><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
