import { useState, type ReactNode } from "react";
import { cn } from "@shared/utils/cn";

interface FilterGroupProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export const FilterGroup = ({
  title,
  children,
  defaultOpen = true,
}: FilterGroupProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-outline-variant/20 py-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-1 text-sm font-semibold text-on-surface"
      >
        {title}
        <span
          className={cn(
            "material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-200",
            open ? "rotate-180" : ""
          )}
        >
          expand_more
        </span>
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
};
