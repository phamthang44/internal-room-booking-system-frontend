import { useState, useRef, useEffect, useId } from "react";
import { cn } from "@shared/utils/cn";
import { useI18n } from "../i18n/useI18n";

export interface CustomSelectOption {
  value: string | number;
  label: string;
  displayLabel?: string;
}
interface CustomSelectProps {
  value: string | number;
  options: CustomSelectOption[];
  onChange: (val: any) => void;
  icon?: string;
  className?: string;
  triggerClassName?: string;
  placeholder?: string;
  menuClassName?: string;
  isError?: boolean;
  dataField?: string;
  disabled?: boolean;
  id?: string;
  ariaLabel?: string;
  describedBy?: string;
}

export function CustomSelect({ value, options, onChange, icon, className, triggerClassName, placeholder, menuClassName, isError = false, dataField, disabled = false, id, ariaLabel, describedBy }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const typeAhead = useRef({ text: "", time: 0 });
  const listId = useId();
  const { t } = useI18n();
  const selectedIndex = options.findIndex(option => option.value === value);
  const selectedOption = options[selectedIndex];

  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);
  useEffect(() => { if (disabled) setIsOpen(false); }, [disabled]);
  useEffect(() => {
    if (!isOpen) return;
    const option = document.getElementById(`${listId}-${activeIndex}`);
    const list = option?.parentElement;
    if (!option || !list) return;
    const itemBox = option.getBoundingClientRect();
    const listBox = list.getBoundingClientRect();
    if (itemBox.top < listBox.top) list.scrollTop -= listBox.top - itemBox.top;
    else if (itemBox.bottom > listBox.bottom) list.scrollTop += itemBox.bottom - listBox.bottom;
  }, [isOpen, activeIndex, listId]);

  return <div ref={wrapperRef} className={cn("custom-select", className)} data-field={dataField}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setIsOpen(false); }}>
    <button ref={triggerRef} id={id} type="button" role="combobox" disabled={disabled}
      aria-label={ariaLabel} aria-describedby={describedBy} aria-expanded={isOpen} aria-haspopup="listbox"
      aria-controls={isOpen ? listId : undefined} aria-activedescendant={isOpen && options.length ? `${listId}-${activeIndex}` : undefined}
      aria-invalid={isError || undefined}
      onClick={() => { setActiveIndex(Math.max(0, selectedIndex)); setIsOpen(!isOpen); }}
      onKeyDown={event => {
        if (event.key === "Escape") { if (isOpen) { event.preventDefault(); event.stopPropagation(); setIsOpen(false); } return; }
        if (event.key === "Tab") { setIsOpen(false); return; }
        if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          const initial = Math.max(0, selectedIndex);
          setActiveIndex(event.key === "Home" ? 0 : event.key === "End" ? Math.max(0, options.length - 1) : !isOpen ? initial : Math.max(0, Math.min(options.length - 1, activeIndex + (event.key === "ArrowDown" ? 1 : -1))));
          setIsOpen(true); return;
        }
        if ((event.key === "Enter" || event.key === " ") && isOpen) {
          event.preventDefault();
          if (options[activeIndex]) onChange(options[activeIndex].value);
          setIsOpen(false); return;
        }
        if (event.key.length === 1 && event.key !== " " && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const now = Date.now();
          const text = (now - typeAhead.current.time < 700 ? typeAhead.current.text : "") + event.key.toLocaleLowerCase();
          typeAhead.current = { text, time: now };
          const index = options.findIndex(option => t(option.label).toLocaleLowerCase().startsWith(text));
          if (index >= 0) { event.preventDefault(); setActiveIndex(index); setIsOpen(true); }
        }
      }}
      className={cn("select-trigger", isError && "is-error", !selectedOption && "is-placeholder", triggerClassName)}>
      {icon && <span aria-hidden="true" className="material-symbols-outlined select-leading-icon">{icon}</span>}
      <span className="min-w-0 flex-1 truncate text-left">{t(selectedOption?.displayLabel ?? selectedOption?.label ?? placeholder ?? "")}</span>
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cn("select-chevron", isOpen && "is-open")}><path d="m6 9 6 6 6-6" /></svg>
    </button>
    {isOpen && <div className={cn("select-menu", menuClassName)}>
      <ul id={listId} role="listbox" aria-label={ariaLabel}>
        {options.map((option, index) => <li key={option.value} id={`${listId}-${index}`} role="option" aria-selected={value === option.value}
          onPointerDown={event => event.preventDefault()}
          onPointerMove={() => setActiveIndex(index)}
          onClick={() => { onChange(option.value); setIsOpen(false); triggerRef.current?.focus(); }}
          className={cn("select-option", activeIndex === index && "is-highlighted")}>
          <span>{t(option.label)}</span>
          {value === option.value && <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m5 12 4 4L19 6" /></svg>}
        </li>)}
      </ul>
    </div>}
  </div>;
}
