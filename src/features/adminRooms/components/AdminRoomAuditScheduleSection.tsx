import { cn } from "@shared/utils/cn";

type Slot = {
  slotId: number;
  slotName: string;
  startTime: string;
  endTime: string;
  status: "AVAILABLE" | "PENDING";
  isAvailable: boolean;
  currentBookingId?: number;
};

type Availability = { date: string; slots: Slot[] };

function slotStatusBadgeClass(
  status: "AVAILABLE" | "PENDING" | undefined,
  isAvailable: boolean | undefined,
) {
  if (status === "PENDING") return "bg-amber-50 text-amber-900";
  if (isAvailable === false) return "bg-error-container text-error";
  return "bg-tertiary-fixed text-on-tertiary-fixed-variant";
}

export function AdminRoomAuditScheduleSection(props: {
  availabilities: Availability[];
  selectedAvailability: Availability | null;
  onSelectDay: (dayIso: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatIsoDay: (iso: string) => string;
  formatIsoDayShort: (iso: string) => string;
  formatTime: (time: string) => string;
  slotStatusLabel: (slot: Slot) => string;
  scheduleDateLabel: string;
}) {
  const {
    availabilities,
    selectedAvailability,
    onSelectDay,
    t,
    formatIsoDay,
    formatIsoDayShort,
    formatTime,
    slotStatusLabel,
    scheduleDateLabel,
  } = props;

  const headerDateLabel = selectedAvailability?.date
    ? formatIsoDay(selectedAvailability.date)
    : scheduleDateLabel;

  const availableCount =
    selectedAvailability?.slots?.filter(
      (s) => s.isAvailable && s.status === "AVAILABLE",
    ).length ?? 0;
  const pendingCount =
    selectedAvailability?.slots?.filter((s) => s.status === "PENDING").length ??
    0;
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <section className="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-[0_12px_36px_rgba(0,0,0,0.10)] backdrop-blur-xl lg:col-span-5">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-headline text-lg font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary">
              calendar_month
            </span>
            {t("adminRooms.audit.availability.title")}
          </h2>
        </div>

        <p className="mb-3 text-xs font-medium text-on-surface-variant">
          {scheduleDateLabel}
        </p>

        <div className="flex flex-wrap gap-2">
          {availabilities.length === 0 ? (
            <span className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-[10px] font-semibold text-on-surface-variant backdrop-blur-md">
              {t("adminRooms.audit.loading")}
            </span>
          ) : (
            availabilities.slice(0, 14).map((a) => {
              const active = (selectedAvailability?.date ?? null) === a.date;
              const slotCount = a.slots?.length ?? 0;
              const availableCount = (a.slots ?? []).filter(
                (s) => s.isAvailable && s.status === "AVAILABLE",
              ).length;

              return (
                <button
                  key={a.date}
                  type="button"
                  onClick={() => onSelectDay(a.date)}
                  className={cn(
                    "group inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                    active
                      ? "border-primary/40 bg-primary/15 text-on-surface"
                      : "border-white/15 bg-white/10 text-on-surface-variant hover:bg-white/15",
                  )}
                  aria-pressed={active}
                  title={formatIsoDay(a.date)}
                >
                  <span className="font-bold text-on-surface">
                    {formatIsoDayShort(a.date)}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold",
                      availableCount > 0
                        ? "bg-tertiary-fixed/70 text-on-tertiary-fixed-variant"
                        : "bg-amber-50 text-amber-900",
                    )}
                  >
                    {availableCount}/{slotCount}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-[0_12px_36px_rgba(0,0,0,0.10)] backdrop-blur-xl lg:col-span-7">
        <div className="flex flex-col gap-4">
          {/* Header structure: TimeSlot: Date → status dots → summary */}
          <div className="space-y-2">
            <div className="-mx-1 overflow-x-auto px-1 pb-0.5 [scrollbar-width:thin]">
              <h2 className="flex w-max items-center gap-2 font-headline text-on-surface sm:gap-3">
                <span
                  className="material-symbols-outlined shrink-0 text-[22px] leading-none text-primary"
                  aria-hidden="true"
                >
                  schedule
                </span>
                <span className="whitespace-nowrap text-base font-bold sm:text-lg">
                  {t("rooms.filters.timeSlot")}
                </span>
                <span
                  className="select-none whitespace-nowrap text-on-surface-variant/60"
                  aria-hidden="true"
                >
                  :
                </span>
                <span className="whitespace-nowrap text-base font-semibold tabular-nums sm:text-lg">
                  {headerDateLabel}
                </span>
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-on-surface-variant">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-tertiary-fixed" />
                {t("adminRooms.audit.timeSlots.available")}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                {t("adminRooms.audit.timeSlots.pendingAudit")}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-error" />
                {t("roomDetail.slots.occupied")}
              </span>
            </div>

            {selectedAvailability?.slots?.length ? (
              <p className="text-xs text-on-surface-variant">
                {availableCount} {t("adminRooms.audit.timeSlots.available")} •{" "}
                {pendingCount} {t("adminRooms.audit.timeSlots.pendingAudit")}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            {availabilities.length === 0 ? (
              <div className="rounded-xl border border-white/15 bg-white/10 p-4 text-sm text-on-surface-variant backdrop-blur-md">
                {t("adminRooms.audit.loading")}
              </div>
            ) : !selectedAvailability ? (
              <div className="rounded-xl border border-white/15 bg-white/10 p-4 text-sm text-on-surface-variant backdrop-blur-md">
                —
              </div>
            ) : (selectedAvailability.slots ?? []).length === 0 ? (
              <div className="rounded-xl border border-white/15 bg-white/10 p-4 text-sm text-on-surface-variant backdrop-blur-md">
                {t("roomDetail.booking.noSlotsForDay")}
              </div>
            ) : (
              (selectedAvailability.slots ?? []).map((slot) => (
                <div
                  key={`${selectedAvailability.date}:${slot.slotId}`}
                  className="group overflow-hidden rounded-xl border border-white/15 bg-white/10 backdrop-blur-md"
                >
                  <div className="flex items-stretch gap-3 p-4">
                    <div
                      className={cn(
                        "w-1.5 shrink-0 rounded-full",
                        slot.status === "PENDING"
                          ? "bg-amber-400/90"
                          : slot.isAvailable
                            ? "bg-tertiary-fixed/90"
                            : "bg-error/80",
                      )}
                      aria-hidden="true"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-sm font-extrabold text-on-surface tabular-nums">
                          {formatTime(slot.startTime)} –{" "}
                          {formatTime(slot.endTime)}
                        </p>
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
                            slotStatusBadgeClass(slot.status, slot.isAvailable),
                          )}
                        >
                          {slot.status === "PENDING"
                            ? t("roomDetail.slots.pending")
                            : slot.isAvailable
                              ? t("roomDetail.slots.available")
                              : t("roomDetail.slots.occupied")}
                        </span>
                      </div>

                      <p
                        className="mt-0.5 truncate text-xs font-medium text-on-surface-variant"
                        title={slot.slotName}
                      >
                        {slot.slotName}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-on-surface-variant">
                        <span className="inline-flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                            info
                          </span>
                          {slotStatusLabel(slot)}
                        </span>
                        {slot.currentBookingId != null ? (
                          <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md">
                            #{slot.currentBookingId}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

