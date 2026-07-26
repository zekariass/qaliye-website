interface PageSkeletonProps {
  rows?: number;
  hasHeader?: boolean;
}

function SkeletonBar({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-[#E5E5EA] rounded animate-pulse ${className}`} />
  );
}

export function PageSkeleton({ rows = 8, hasHeader = true }: PageSkeletonProps) {
  return (
    <div className="space-y-4">
      {hasHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <SkeletonBar className="h-6 w-40" />
            <SkeletonBar className="h-4 w-64" />
          </div>
          <SkeletonBar className="h-9 w-28" />
        </div>
      )}
      <div className="bg-white border border-[#E5E5EA] rounded-xl overflow-hidden">
        <div className="border-b border-[#E5E5EA] p-4 flex gap-3">
          <SkeletonBar className="h-9 w-64" />
          <SkeletonBar className="h-9 w-32" />
          <SkeletonBar className="h-9 w-32" />
        </div>
        <div className="divide-y divide-[#E5E5EA]">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-4">
              <SkeletonBar className="h-8 w-8 rounded-full shrink-0" />
              <SkeletonBar className="h-4 w-40" />
              <SkeletonBar className="h-4 w-28 ml-auto" />
              <SkeletonBar className="h-5 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-white border border-[#E5E5EA] rounded-xl p-5 space-y-3 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBar key={i} className={`h-4 ${i === 0 ? "w-1/2" : "w-3/4"}`} />
      ))}
    </div>
  );
}

export function MetricSkeleton() {
  return (
    <div className="bg-white border border-[#E5E5EA] rounded-xl p-5 animate-pulse space-y-2">
      <SkeletonBar className="h-4 w-24" />
      <SkeletonBar className="h-8 w-16" />
      <SkeletonBar className="h-3 w-32" />
    </div>
  );
}
