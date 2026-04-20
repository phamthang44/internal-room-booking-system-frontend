import { useCallback, useMemo, useState } from "react";

export type ApprovalTabKey = "PENDING" | "APPROVED" | "REJECTED";

export interface RejectDialogState {
  open: boolean;
  bookingId: number | null;
  /** When bulk rejecting, apply to all selected ids. */
  bulkIds: number[] | null;
}

export interface UseApprovalsUiValue {
  tab: ApprovalTabKey;
  setTab: (tab: ApprovalTabKey) => void;

  page: number;
  setPage: (page: number) => void;
  size: number;
  setSize: (size: number) => void;

  selectedIds: ReadonlySet<number>;
  selectedCount: number;
  isSelected: (id: number) => boolean;
  toggleSelected: (id: number) => void;
  clearSelection: () => void;
  setAllSelected: (ids: number[], selected: boolean) => void;

  rejectDialog: RejectDialogState;
  openRejectDialog: (bookingId: number) => void;
  openBulkRejectDialog: (ids: number[]) => void;
  closeRejectDialog: () => void;
}

export function useApprovalsUi(): UseApprovalsUiValue {
  const [tab, setTab] = useState<ApprovalTabKey>("PENDING");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(12);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());
  const [rejectDialog, setRejectDialog] = useState<RejectDialogState>({
    open: false,
    bookingId: null,
    bulkIds: null,
  });

  const isSelected = useCallback(
    (id: number) => selectedIds.has(id),
    [selectedIds],
  );

  const toggleSelected = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const setAllSelected = useCallback((ids: number[], selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        if (selected) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  }, []);

  const openRejectDialog = useCallback((bookingId: number) => {
    setRejectDialog({ open: true, bookingId, bulkIds: null });
  }, []);

  const openBulkRejectDialog = useCallback((ids: number[]) => {
    setRejectDialog({ open: true, bookingId: null, bulkIds: ids });
  }, []);

  const closeRejectDialog = useCallback(() => {
    setRejectDialog({ open: false, bookingId: null, bulkIds: null });
  }, []);

  const selectedCount = useMemo(() => selectedIds.size, [selectedIds.size]);

  return {
    tab,
    setTab: (next) => {
      setTab(next);
      setPage(1);
      clearSelection();
    },
    page,
    setPage: (p) => setPage(Math.max(1, p)),
    size,
    setSize: (s) => setSize(Math.max(1, s)),
    selectedIds,
    selectedCount,
    isSelected,
    toggleSelected,
    clearSelection,
    setAllSelected,
    rejectDialog,
    openRejectDialog,
    openBulkRejectDialog,
    closeRejectDialog,
  };
}

