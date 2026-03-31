import { useEffect, useRef, useState } from "react";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import { useRoomFilterStore } from "../hooks/useRoomFilterStore";

interface SearchBarProps {
  className?: string;
}

export const SearchBar = ({ className }: SearchBarProps) => {
  const { search, setSearch } = useRoomFilterStore();
  const { t } = useI18n();
  const [localValue, setLocalValue] = useState(search);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounce: commit to store 350ms after last keystroke
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(localValue), 350);
    return () => clearTimeout(debounceRef.current);
  }, [localValue, setSearch]);

  return (
    <div className={cn("relative", className)}>
      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant">
        search
      </span>
      <input
        id="room-search-input"
        type="text"
        placeholder={t("rooms.search.placeholder")}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest py-2.5 pl-10 pr-10 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
      />
      {localValue && (
        <button
          onClick={() => {
            setLocalValue("");
            setSearch("");
          }}
          aria-label={t("rooms.search.clearLabel")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}
    </div>
  );
};
