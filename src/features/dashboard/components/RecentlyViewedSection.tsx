import { Link } from "react-router-dom";
import { useI18n } from "@shared/i18n/useI18n";
import { SkeletonBlock } from "@shared/components/SkeletonBlock";
import type { RecentRoom } from "../types/dashboard.types";

interface RecentRoomCardProps {
  room: RecentRoom;
}

const RecentRoomCard = ({ room }: RecentRoomCardProps) => (
  <Link
    to={`/rooms/${room.id}`}
    className="group flex min-w-[200px] flex-col gap-2 rounded-2xl bg-surface-container-lowest p-4 shadow-[0_2px_12px_rgba(24,28,30,0.06)] transition-shadow hover:shadow-[0_4px_20px_rgba(24,28,30,0.1)]"
  >
    <div className="h-20 w-full rounded-xl bg-gradient-to-br from-primary to-primary-container" />
    <div className="space-y-0.5">
      <p className="font-headline text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
        {room.name}
      </p>
      <div className="flex items-center gap-1 text-xs text-on-surface-variant">
        <span className="material-symbols-outlined text-[14px]">location_on</span>
        <span className="truncate">
          {room.building}, {room.floor}
        </span>
      </div>
    </div>
  </Link>
);

const CardSkeleton = () => (
  <div className="flex min-w-[200px] flex-col gap-2 rounded-2xl bg-surface-container-lowest p-4">
    <SkeletonBlock className="h-20 w-full rounded-xl" />
    <SkeletonBlock className="h-4 w-3/4" />
    <SkeletonBlock className="h-3 w-1/2" />
  </div>
);

interface RecentlyViewedSectionProps {
  rooms?: RecentRoom[];
  isLoading: boolean;
}

export const RecentlyViewedSection = ({
  rooms,
  isLoading,
}: RecentlyViewedSectionProps) => {
  const { t } = useI18n();

  return (
    <section>
      <div className="mb-4">
        <h2 className="font-headline text-lg font-semibold text-on-surface">
          {t("dashboard.recentRooms.title")}
        </h2>
        <p className="text-sm text-on-surface-variant">
          {t("dashboard.recentRooms.subtitle")}
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : rooms?.length ? (
          rooms.map((room) => <RecentRoomCard key={room.id} room={room} />)
        ) : (
          <p className="py-6 text-sm text-on-surface-variant">
            {t("dashboard.recentRooms.empty")}
          </p>
        )}
      </div>
    </section>
  );
};
