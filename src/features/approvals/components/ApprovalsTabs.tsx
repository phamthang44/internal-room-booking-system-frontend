import { cn } from "@shared/utils/cn";
import type { ApprovalTabKey } from "@/hooks/useApprovalsUi";
import { useI18n } from "@shared/i18n/useI18n";
import { motion } from "framer-motion";

export interface ApprovalsTabsProps {
  readonly active: ApprovalTabKey;
  readonly onChange: (tab: ApprovalTabKey) => void;
  readonly counts?: Partial<Record<ApprovalTabKey, number>>;
}

const ORDER: ApprovalTabKey[] = ["PENDING", "APPROVED", "REJECTED", "HISTORY"];

const labelFor = (k: ApprovalTabKey): string => {
  if (k === "PENDING") return "approvals.tabs.pending";
  if (k === "APPROVED") return "approvals.tabs.approved";
  if (k === "REJECTED") return "approvals.tabs.rejected";
  return "approvals.tabs.history";
};

export function ApprovalsTabs({ active, onChange, counts = {} }: ApprovalsTabsProps) {
  const { t } = useI18n();

  return (
    <div className="relative flex w-full items-center gap-1 rounded-2xl bg-surface-container-low p-1.5 shadow-inner-sm md:w-auto">
      {ORDER.map((k) => {
        const isActive = active === k;
        const count = counts[k];
        const label = t(labelFor(k));

        return (
          <button
            key={k}
            type="button"
            onClick={() => onChange(k)}
            className={cn(
              "relative flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-300 md:flex-initial",
              isActive
                ? "text-primary"
                : "text-on-surface-variant/70 hover:bg-surface-container-high hover:text-on-surface",
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 z-0 rounded-xl bg-surface-container-lowest shadow-sm"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{label}</span>
            {typeof count === "number" && (
              <span
                className={cn(
                  "relative z-10 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-black tracking-tight transition-colors",
                  isActive
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-highest text-on-surface-variant",
                )}
              >
                {count > 99 ? "99+" : count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

