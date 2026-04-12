// ─────────────────────────────────────────────────────────────────────────────
// RoomHeroImage — Hero section with room image/gradient, title and back button
// ─────────────────────────────────────────────────────────────────────────────
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, MapPin } from "lucide-react";
import { cn } from "@shared/utils/cn";
import type { RoomDetail } from "../../types/roomDetail.types";

interface RoomHeroImageProps {
  room: RoomDetail;
  className?: string;
}

export const RoomHeroImage = ({ room, className }: RoomHeroImageProps) => {
  const navigate = useNavigate();
  const locationLine = [room.building.name, room.building.address].filter(Boolean).join(" · ");

  return (
    <div className={cn("relative group overflow-hidden rounded-2xl", className)}>
      {room.imageUrl ? (
        <img
          src={room.imageUrl}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div
          className="w-full h-full min-h-[320px]"
          style={{ background: room.imageGradient }}
        >
          <div className="absolute top-8 right-12 w-48 h-48 rounded-full bg-white/5 blur-3xl animate-pulse" />
          <div className="absolute bottom-12 left-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <button
        onClick={() => navigate(-1)}
        aria-label="Back to rooms"
        className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-all duration-200 z-10"
      >
        <ArrowLeft size={15} strokeWidth={2.5} />
        <span className="hidden sm:inline">Rooms</span>
      </button>

      <div className="absolute bottom-6 left-6 right-6 text-white z-10">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {room.roomType?.name && (
            <span className="px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-widest">
              {room.roomType.name}
            </span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-headline font-extrabold tracking-tight leading-tight drop-shadow-lg">
          {room.name}
        </h1>
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <span className="flex items-center gap-1.5 text-white/90 text-sm font-medium">
            <MapPin size={14} />
            {locationLine}
          </span>
          <span className="flex items-center gap-1.5 text-white/90 text-sm font-medium">
            <Users size={14} />
            {room.capacity} Seats
          </span>
        </div>
      </div>
    </div>
  );
};
