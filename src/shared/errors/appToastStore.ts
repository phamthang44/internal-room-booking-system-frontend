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

export const useAppToastStore = create<AppToastState>((set) => ({
  toasts: [],
  push: (item) => {
    const id = ++idSeq;
    set((s) => ({ toasts: [...s.toasts, { ...item, id }] }));
  },
  remove: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
