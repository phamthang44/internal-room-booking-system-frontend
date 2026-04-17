import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@shared/utils/cn";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-on-surface",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md border border-outline-variant/40 hover:bg-surface-variant transition-colors",
          "text-on-surface",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "grid grid-cols-7 gap-0",
        head_cell:
          "text-on-surface-variant/70 rounded-md w-9 h-9 font-normal text-[0.8rem] flex items-center justify-center",
        row: "grid grid-cols-7 gap-0 w-full",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-surface-variant/50 [&:has([aria-selected])]:bg-surface-variant first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md transition-all bg-surface-variant/30 hover:bg-surface-variant hover:text-on-surface hover:font-medium flex items-center justify-center cursor-pointer text-on-surface",
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-on-primary hover:bg-primary hover:text-on-primary focus:bg-primary focus:text-on-primary font-bold shadow-sm",
        day_today:
          "bg-surface-variant text-on-surface border border-outline-variant/40",
        day_outside:
          "day-outside text-on-surface-variant/40 opacity-50 aria-selected:bg-surface-variant/50 aria-selected:text-on-surface-variant/50 aria-selected:opacity-30",
        day_disabled: "text-on-surface-variant/30 opacity-50",
        day_range_middle:
          "aria-selected:bg-surface-variant aria-selected:text-on-surface",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
