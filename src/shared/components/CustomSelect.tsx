import { useState, useRef, useEffect } from "react";
import { cn } from "@shared/utils/cn";
import { useI18n } from "../i18n/useI18n";

export interface CustomSelectOption {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  value: string | number;
  options: CustomSelectOption[];
  onChange: (val: any) => void;
  icon?: string;
  className?: string;
  placeholder?: string;
  menuClassName?: string;
}

export function CustomSelect({
  value,
  options,
  onChange,
  icon,
  className,
  placeholder,
  menuClassName
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault(); 
          setIsOpen(!isOpen);
        }}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border py-2 text-sm text-on-surface transition-all focus:outline-none focus:ring-2 focus:ring-primary/20",
          isOpen ? "border-primary bg-surface" : "border-outline-variant bg-surface hover:border-primary/40",
          icon ? "pl-8 pr-3" : "px-3"
        )}
      >
        {icon && (
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant pointer-events-none">
            {icon}
          </span>
        )}
        <span className="truncate">{t(selectedOption?.label ?? placeholder ?? "")}</span>
        <span
          className={cn(
            "material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-200 pointer-events-none",
            isOpen ? "rotate-180" : ""
          )}
        >
          expand_more
        </span>
      </button>

      {/* Dropdown Menu */}
      <div
        className={cn(
          "absolute left-0 right-0 top-[calc(100%+4px)] z-50 origin-top overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-lg transition-all duration-200 ease-out",
          isOpen ? "scale-y-100 opacity-100" : "scale-y-95 opacity-0 pointer-events-none",
          menuClassName
        )}
      >
        <ul className="max-h-60 overflow-y-auto py-1">
          {options.map((option) => (
            <li
              key={option.value}
              onMouseDown={(e) => {
                e.preventDefault(); 
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-surface-container",
                value === option.value
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-on-surface"
              )}
            >
              {t(option.label)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
