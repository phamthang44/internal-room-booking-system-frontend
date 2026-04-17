import { cn } from "@shared/utils/cn";
import {
  CustomSelect,
  type CustomSelectOption,
} from "@shared/components/CustomSelect";
import type { AdminRoomStatus } from "../types/adminRooms.api.types";

export function AdminRoomAuditStatusModal(props: {
  open: boolean;
  roomName: string;
  nextStatus: AdminRoomStatus;
  statusOptions: readonly CustomSelectOption[];
  isPending: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
  onClose: () => void;
  onChangeStatus: (next: AdminRoomStatus) => void;
  onConfirm: () => void;
  confirmDisabled: boolean;
}) {
  const {
    open,
    roomName,
    nextStatus,
    statusOptions,
    isPending,
    t,
    onClose,
    onChangeStatus,
    onConfirm,
    confirmDisabled,
  } = props;

  if (!open) return null;

  const showWarning = nextStatus === "INACTIVE" || nextStatus === "MAINTENANCE";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={() => !isPending && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-white/20 bg-white/40 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-headline text-lg font-bold text-on-surface">
          {t("adminRooms.list.statusDialog.title")}
        </h2>
        <p className="mt-1 text-sm text-on-surface-variant">{roomName}</p>

        <div className="mt-4 space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            {t("adminRooms.list.statusDialog.selectLabel")}
          </label>
          <CustomSelect
            value={nextStatus}
            options={statusOptions as CustomSelectOption[]}
            onChange={(val) => onChangeStatus(val as AdminRoomStatus)}
            className="w-full"
            menuClassName="z-[60]"
            disabled={isPending}
          />
        </div>

        {showWarning ? (
          <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">
            {t("adminRooms.list.statusDialog.bookingWarning")}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold text-on-surface-variant transition-colors",
              "hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              "disabled:opacity-50",
            )}
            onClick={onClose}
            disabled={isPending}
          >
            {t("adminRooms.list.statusDialog.cancel")}
          </button>
          <button
            type="button"
            className={cn(
              "rounded-xl bg-primary px-4 py-2 text-sm font-bold text-on-primary shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-opacity",
              "hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              "disabled:opacity-50",
            )}
            disabled={isPending || confirmDisabled}
            onClick={onConfirm}
          >
            {isPending
              ? t("adminRooms.list.statusDialog.saving")
              : t("adminRooms.list.statusDialog.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}

