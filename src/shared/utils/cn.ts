import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge class names conditionally
 * Supports tailwind-merge for complex Shadcn layouts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
