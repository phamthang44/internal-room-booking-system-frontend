import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";

export type StatusChipVariant =
  | "confirmed"
  | "pending"
  | "cancelled"
  | "rejected"
  | "available"
  | "occupied"
  | "maintenance";

const variantStyles: Record<StatusChipVariant, string> = {
  confirmed:
    "bg-emerald-50/90 text-emerald-700 border border-emerald-200/60",
  pending:
    "bg-amber-50/90 text-amber-700 border border-amber-200/60",
  cancelled:
    "bg-rose-50/90 text-rose-700 border border-rose-200/60",
  rejected:
    "bg-rose-50/90 text-rose-700 border border-rose-200/60",
  available:
    "bg-emerald-50/90 text-emerald-700 border border-emerald-200/60",
  occupied:
    "bg-rose-50/90 text-rose-700 border border-rose-200/60",
  maintenance:
    "bg-amber-50/90 text-amber-700 border border-amber-200/60",
};

interface StatusChipProps {
  status: StatusChipVariant;
  className?: string;
}

export const StatusChip = ({ status, className }: StatusChipProps) => {
  const { t } = useI18n();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold font-body whitespace-nowrap shrink-0",
        variantStyles[status],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75 shrink-0" />
      {t(`rooms.status.${status}`)}
    </span>
  );
};
