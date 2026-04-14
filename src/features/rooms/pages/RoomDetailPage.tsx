// ─────────────────────────────────────────────────────────────────────────────
// RoomDetailPage — Main page: 7/12 + 5/12 asymmetric layout
// Route: /rooms/:roomId
// ─────────────────────────────────────────────────────────────────────────────
import { useParams } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { AppLayout } from "@shared/components/AppLayout";
import { useI18n } from "@shared/i18n/useI18n";
import { useRoomDetail } from "../hooks/useRoomDetail";
import { RoomHeroImage } from "../components/detail/RoomHeroImage";
import { RoomInfoBento } from "../components/detail/RoomInfoBento";
import { BookingSidebar } from "../components/detail/BookingSidebar";
import { RoomDetailSkeleton } from "../components/detail/RoomDetailSkeleton";

export const RoomDetailPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { t } = useI18n();

  const { data: room, isLoading, isError, refetch } = useRoomDetail(roomId ?? "");

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        {/* ── Loading skeleton ── */}
        {isLoading && <RoomDetailSkeleton />}

        {/* ── Error state ── */}
        {isError && !isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-error-container/20 flex items-center justify-center">
              <RefreshCw size={28} className="text-error" />
            </div>
            <div>
              <p className="font-headline font-bold text-on-surface text-xl">
                {t("roomDetail.error.loadFailed")}
              </p>
              <p className="text-on-surface-variant text-sm mt-1">
                {t("rooms.error.loadFailed")}
              </p>
            </div>
            <button
              onClick={() => void refetch()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-headline font-bold hover:opacity-90 active:scale-95 transition-all"
            >
              <RefreshCw size={16} />
              {t("roomDetail.error.retry")}
            </button>
          </div>
        )}

        {/* ── Main content ── */}
        {room && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left column: Room details (7/12) */}
            <section className="lg:col-span-7 space-y-6">
              {/* Hero image / gradient */}
              <RoomHeroImage room={room} className="aspect-[16/9]" />

              {/* Info bento grid */}
              <RoomInfoBento room={room} />
            </section>

            {/* Right column: Booking sidebar (5/12, sticky) */}
            <aside className="lg:col-span-5 lg:sticky lg:top-24">
              <BookingSidebar room={room} />
            </aside>
          </div>
        )}
      </div>
    </AppLayout>
  );
};
