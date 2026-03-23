import type { ReactNode } from "react";
import { cn } from "../utils/cn";

interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  hint?: string;
}

export const FormField = ({
  label,
  error,
  required,
  children,
  className,
  hint,
}: FormFieldProps) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label className="text-sm font-medium text-on-surface">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="text-xs text-on-surface-variant">{hint}</p>}
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
};
