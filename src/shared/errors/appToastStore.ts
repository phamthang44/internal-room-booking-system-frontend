import { create } from "zustand";

export type AppToastTone = "error" | "success" | "info" | "warning";

export interface AppToastItem {
  id: number;
  tone?: AppToastTone;
  /** When set, shown instead of `t(titleI18nKey)` (e.g. server-localized titles). */
  plainTitle?: string;
  titleI18nKey: string;
  message: string;
  traceId?: string;
  /** Navigate to booking detail when the toast body is activated. */
  bookingId?: number;
  /** Material Symbols icon name; defaults by tone when omitted. */
  materialIcon?: string;
  /** Subtle pulse on the leading icon (e.g. check-in). */
  pulseAccent?: boolean;
  /** Short line under the message (e.g. relative time from `timestamp`). */
  caption?: string;
}

interface AppToastState {
  toasts: AppToastItem[];
  push: (item: Omit<AppToastItem, "id">) => void;
  remove: (id: number) => void;
}

let idSeq = 0;
const DEDUPE_MS = 2500;
let lastPushFingerprint = "";
let lastPushAt = 0;

function fingerprintToast(item: Omit<AppToastItem, "id">): string {
  const title = item.plainTitle ?? item.titleI18nKey;
  const booking = item.bookingId == null ? "" : String(item.bookingId);
  const icon = item.materialIcon ?? "";
  const caption = item.caption ?? "";
  const trace = item.traceId ?? "";
  return `${item.tone ?? ""}|${title}|${item.message}|${booking}|${icon}|${caption}|${trace}`;
}

export const useAppToastStore = create<AppToastState>((set) => ({
  toasts: [],
  push: (item) => {
    const fp = fingerprintToast(item);
    const now = Date.now();
    if (fp === lastPushFingerprint && now - lastPushAt < DEDUPE_MS) {
      return;
    }
    lastPushFingerprint = fp;
    lastPushAt = now;

    const id = ++idSeq;
    set((s) => ({ toasts: [...s.toasts, { ...item, id }] }));
  },
  remove: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
