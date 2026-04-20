import { cn } from "@shared/utils/cn";

export interface BulkActionBarProps {
  readonly selectedCount: number;
  readonly onApprove: () => void;
  readonly onReject: () => void;
  readonly onClear: () => void;
  readonly disabled?: boolean;
}

export function BulkActionBar({
  selectedCount,
  onApprove,
  onReject,
  onClear,
  disabled,
}: BulkActionBarProps) {
  if (selectedCount <= 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[60] w-[calc(100%-3rem)] max-w-2xl -translate-x-1/2 rounded-2xl bg-slate-900 p-4 text-white shadow-2xl ring-1 ring-white/10">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1 text-xs font-black uppercase tracking-widest text-blue-300">
            {selectedCount} Selected
          </div>
          <p className="hidden text-sm font-medium text-slate-300 sm:block">
            Apply action to selected requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={disabled}
            onClick={onApprove}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-bold transition-all shadow-lg",
              "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20",
              disabled && "opacity-60 pointer-events-none",
            )}
          >
            <span className="material-symbols-outlined text-sm">done_all</span>
            Approve
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={onReject}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-bold transition-all shadow-lg",
              "bg-rose-600 hover:bg-rose-700 shadow-rose-900/20",
              disabled && "opacity-60 pointer-events-none",
            )}
          >
            <span className="material-symbols-outlined text-sm">block</span>
            Reject
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={onClear}
            className={cn(
              "rounded-lg p-2 text-slate-400 hover:text-white transition-colors",
              disabled && "opacity-60 pointer-events-none",
            )}
            title="Clear selection"
            aria-label="Clear selection"
          >
            <span className="material-symbols-outlined">clear</span>
          </button>
        </div>
      </div>
    </div>
  );
}

