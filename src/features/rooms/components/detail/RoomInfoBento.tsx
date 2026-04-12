// ─────────────────────────────────────────────────────────────────────────────
// RoomInfoBento — Bento-style detail cards: Capacity, Location, Equipment
// ─────────────────────────────────────────────────────────────────────────────
import {
  Users,
  MapPin,
  Cpu,
  Projector,
  PenLine,
  Volume2,
  Video,
  Wind,
  Monitor,
} from "lucide-react";
import { useI18n } from "@shared/i18n/useI18n";
import { cn } from "@shared/utils/cn";
import type { RoomDetail, EquipmentDetail } from "../../types/roomDetail.types";

const ICON_MAP: Record<string, React.ElementType> = {
  Projector,
  PenLine,
  Volume2,
  Video,
  Wind,
  Monitor,
  Cpu,
};

const EquipmentIcon = ({
  iconName,
  className,
}: {
  iconName: string;
  className?: string;
}) => {
  const Icon = ICON_MAP[iconName] ?? Cpu;
  return <Icon size={28} strokeWidth={1.5} className={className} />;
};

const InfoCard = ({
  icon,
  label,
  children,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_24px_rgba(24,28,30,0.04)] transition-shadow hover:shadow-[0_12px_32px_rgba(24,28,30,0.08)]",
      className
    )}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-fixed/60">
        {icon}
      </div>
      <span className="font-headline font-bold text-on-surface text-sm uppercase tracking-widest">
        {label}
      </span>
    </div>
    {children}
  </div>
);

const EquipmentPill = ({ item }: { item: EquipmentDetail }) => (
  <div className="flex flex-col items-center gap-2 p-4 bg-surface rounded-xl text-center group hover:bg-surface-container transition-colors duration-200">
    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-fixed/40 group-hover:bg-primary-fixed/60 transition-colors">
      <EquipmentIcon iconName={item.icon} className="text-on-primary-fixed-variant" />
    </div>
    <span className="text-sm font-bold text-on-surface leading-tight">{item.name}</span>
    {item.description && (
      <span className="text-[11px] text-on-surface-variant leading-snug">
        {item.description}
      </span>
    )}
  </div>
);

interface RoomInfoBentoProps {
  room: RoomDetail;
  className?: string;
}

export const RoomInfoBento = ({ room, className }: RoomInfoBentoProps) => {
  const { t } = useI18n();

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 gap-4">
        <InfoCard
          icon={<Users size={20} className="text-on-primary-fixed-variant" strokeWidth={1.5} />}
          label={t("roomDetail.capacity")}
        >
          <p className="text-4xl font-headline font-black text-primary leading-none">
            {room.capacity}
          </p>
          <p className="text-sm text-on-surface-variant mt-0.5 font-medium">{t("roomDetail.seats")}</p>
        </InfoCard>

        <InfoCard
          icon={<MapPin size={20} className="text-on-primary-fixed-variant" strokeWidth={1.5} />}
          label={t("roomDetail.location")}
        >
          <p className="text-lg font-headline font-bold text-secondary leading-tight">
            {room.building.name}
          </p>
          {(room.building.address || room.addressBuildingLocation) && (
            <p className="text-sm text-on-surface-variant mt-0.5">
              {room.building.address || room.addressBuildingLocation}
            </p>
          )}
        </InfoCard>
      </div>

      {room.equipments.length > 0 && (
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_24px_rgba(24,28,30,0.04)]">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-fixed/60">
              <Cpu size={20} className="text-on-primary-fixed-variant" strokeWidth={1.5} />
            </div>
            <span className="font-headline font-bold text-on-surface text-sm uppercase tracking-widest">
              {t("roomDetail.equipment")}
            </span>
          </div>
          <div
            className={cn(
              "grid gap-3",
              room.equipments.length === 1
                ? "grid-cols-1"
                : room.equipments.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-2 sm:grid-cols-3"
            )}
          >
            {room.equipments.map((item) => (
              <EquipmentPill key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
