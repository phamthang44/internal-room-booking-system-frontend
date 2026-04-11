// ─────────────────────────────────────────────────────────────────────────────
// RoomDetailSkeleton — Shimmer loading state for the Room Detail page
// ─────────────────────────────────────────────────────────────────────────────

const Shimmer = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse rounded-xl bg-surface-container ${className ?? ""}`}
  />
);

export const RoomDetailSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
    {/* Left column */}
    <div className="lg:col-span-7 space-y-5">
      {/* Hero */}
      <Shimmer className="w-full aspect-[16/9] rounded-2xl" />
      {/* Bento */}
      <div className="grid grid-cols-2 gap-4">
        <Shimmer className="h-32" />
        <Shimmer className="h-32" />
      </div>
      <Shimmer className="h-48" />
    </div>
    {/* Right column / sidebar */}
    <div className="lg:col-span-5 space-y-4">
      <Shimmer className="h-24 rounded-2xl" />
      <Shimmer className="h-48 rounded-2xl" />
      <Shimmer className="h-20 rounded-2xl" />
      <Shimmer className="h-14 rounded-2xl" />
    </div>
  </div>
);
