import { cn } from "@shared/utils/cn";
import type { ApprovalTabKey } from "@/hooks/useApprovalsUi";
import { useI18n } from "@shared/i18n/useI18n";

export interface ApprovalsTabsProps {
  readonly active: ApprovalTabKey;
  readonly onChange: (tab: ApprovalTabKey) => void;
  readonly counts?: Partial<Record<ApprovalTabKey, number>>;
}

const ORDER: ApprovalTabKey[] = ["PENDING", "APPROVED", "REJECTED"];

const labelFor = (k: ApprovalTabKey): string => {
  if (k === "PENDING") return "approvals.tabs.pending";
  if (k === "APPROVED") return "approvals.tabs.approved";
  return "approvals.tabs.rejected";
};

export function ApprovalsTabs({ active, onChange, counts = {} }: ApprovalsTabsProps) {
  const { t } = useI18n();
  return (
    <div className="flex rounded-xl bg-surface-container-low p-1">
      {ORDER.map((k) => {
        const isActive = active === k;
        const count = counts[k];
        const label = `${t(labelFor(k))}${typeof count === "number" ? ` (${count})` : ""}`;
        return (
          <button
            key={k}
            type="button"
            onClick={() => onChange(k)}
            className={cn(
              "px-6 py-2 text-sm font-semibold transition-colors rounded-lg",
              isActive
                ? "bg-surface-container-lowest shadow-sm text-primary font-bold"
                : "text-on-surface-variant hover:text-on-surface",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

