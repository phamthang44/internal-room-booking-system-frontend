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
          "workspace-field",
          "text-on-surface placeholder:text-on-surface-variant/70",
          "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
          isError
            ? "is-error"
            : "",
          isLoading && "opacity-50 cursor-wait",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
