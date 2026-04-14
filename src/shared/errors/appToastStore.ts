import { create } from "zustand";

export interface AppToastItem {
  id: number;
  tone?: "error" | "success";
  titleI18nKey: string;
  message: string;
  traceId?: string;
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
