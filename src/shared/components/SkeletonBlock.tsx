import { cn } from "@shared/utils/cn";

interface SkeletonBlockProps {
  className?: string;
}

export const SkeletonBlock = ({ className }: SkeletonBlockProps) => (
  <div
    className={cn(
      "animate-pulse rounded-xl bg-surface-container-high",
      className
    )}
  />
);
