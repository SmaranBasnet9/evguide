function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className ?? ""}`} />;
}
export default function AdminUsersLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-72" />
      </div>
      {["Super Admin", "Admins", "Users"].map((section) => (
        <div key={section} className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {Array.from({ length: section === "Users" ? 8 : 2 }).map((_, i) => (
              <div key={i} className="flex gap-4 border-b border-gray-100 px-6 py-4">
                <Skeleton className="h-4 w-28" /><Skeleton className="h-4 w-40" /><Skeleton className="h-4 w-20" /><Skeleton className="ml-auto h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
