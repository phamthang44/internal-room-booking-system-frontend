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

  useEffect(() => { clearTimeout(debounceRef.current); setLocalValue(search); }, [search]);
  useEffect(() => () => clearTimeout(debounceRef.current), []);

  return (
    <div className={cn("relative", className)}>
      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant">
        search
      </span>
      <input
        id="room-search-input"
        type="search"
        aria-label={t("rooms.search.placeholder")}
        placeholder={t("rooms.search.placeholder")}
        value={localValue}
        onChange={(event) => {
          const value = event.target.value;
          setLocalValue(value);
          clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => setSearch(value), 350);
        }}
        className="workspace-field room-search-field"
      />
      {localValue && (
        <button
          onClick={() => {
            clearTimeout(debounceRef.current);
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
