import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import { useRoomDetail } from "../hooks/useRoomDetail";
import { BookingSidebar } from "./detail/BookingSidebar";

export interface AvailabilityDrawerProps {
  open: boolean;
  roomId: string | null;
  onClose: () => void;
}

export const AvailabilityDrawer = ({ open, roomId, onClose }: AvailabilityDrawerProps) => {
  const { t } = useI18n();

  const enabled = open && !!roomId;
  const { data: room, isLoading, isError, refetch } = useRoomDetail(enabled ? roomId! : "");

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]" role="presentation">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
        onMouseDown={onClose}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("rooms.card.checkAvailability")}
        className={cn(
          "absolute inset-y-0 right-0 w-full max-w-[440px]",
          "bg-surface shadow-2xl border-l border-outline-variant/20",
          "flex flex-col"
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-outline-variant/20 px-5 py-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
              {t("rooms.card.checkAvailability")}
            </p>
            <p className="truncate font-headline text-sm font-extrabold text-on-surface">
              {room?.name ?? t("rooms.pageTitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {isLoading && (
            <div className="rounded-2xl bg-surface-container-lowest p-6">
              <p className="text-sm text-on-surface-variant">{t("common.loading.title")}</p>
            </div>
          )}

          {isError && !isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-error-container/10 p-6 text-center">
              <RefreshCw size={22} className="text-error" />
              <p className="text-sm font-semibold text-on-surface">
                {t("roomDetail.error.loadFailed")}
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-on-primary hover:opacity-90"
              >
                {t("roomDetail.error.retry")}
              </button>
            </div>
          )}

          {room && !isLoading && (
            <BookingSidebar room={room} />
          )}
        </div>
      </div>
    </div>
  );
};

