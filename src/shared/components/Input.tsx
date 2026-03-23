import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "../utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
  isLoading?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ isError, isLoading, className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        disabled={isLoading || props.disabled}
        className={cn(
          "w-full px-4 py-3 rounded-lg border-2 transition-all duration-200",
          "text-on-surface placeholder-on-surface-variant",
          "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
          isError
            ? "border-error bg-error/5"
            : "border-outline-variant bg-surface hover:border-outline",
          isLoading && "opacity-50 cursor-wait",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
