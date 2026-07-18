/**
 * Generic skeleton loader block. Used for loading states across dashboards
 * so content doesn't jump when real data arrives.
 */
export default function Skeleton({ className = "h-4 w-full" }) {
  return <div className={`skeleton rounded-md ${className}`} role="presentation" />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-stadium-border bg-stadium-surface p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-3 w-full" />
    </div>
  );
}
