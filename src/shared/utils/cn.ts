/**
 * Utility function to merge class names conditionally
 * Similar to classnames or clsx
 */
export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};
