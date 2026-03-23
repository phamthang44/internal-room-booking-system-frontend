import type { ReactNode } from "react";
import { cn } from "../utils/cn";

interface ErrorMessageProps {
  children?: ReactNode;
  className?: string;
}

export const ErrorMessage = ({ children, className }: ErrorMessageProps) => {
  if (!children) return null;

  return (
    <div className={cn("text-error text-sm mt-1", className)}>{children}</div>
  );
};
