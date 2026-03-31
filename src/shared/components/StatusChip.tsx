import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";

export type StatusChipVariant =
  | "confirmed"
  | "pending"
  | "cancelled"
  | "available"
  | "occupied"
  | "maintenance";

const variantStyles: Record<StatusChipVariant, string> = {
  confirmed:
    "bg-tertiary-fixed/20 text-on-tertiary-container border border-tertiary-fixed/30",
  pending:
    "bg-secondary-container text-on-secondary-container border border-secondary-fixed-dim/40",
  cancelled:
    "bg-error-container text-on-error-container border border-error/20",
  available:
    "bg-tertiary-fixed/20 text-on-tertiary-container border border-tertiary-fixed/30",
  occupied:
    "bg-error-container text-on-error-container border border-error/20",
  maintenance:
    "bg-surface-container text-on-surface-variant border border-outline-variant",
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
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium font-body",
        variantStyles[status],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {t(`rooms.status.${status}`)}
    </span>
  );
};
