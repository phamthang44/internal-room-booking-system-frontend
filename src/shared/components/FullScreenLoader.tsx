import { useEffect, useState } from "react";
import { useI18n } from "@shared/i18n/useI18n";
import { LoadingIndicator } from "./LoadingIndicator";

export interface FullScreenLoaderProps {
  /** i18n key, e.g. "common.loading.restoringSession" */
  readonly messageKey?: string;
}

export function FullScreenLoader({
  messageKey = "common.loading.title",
}: FullScreenLoaderProps) {
  const { t } = useI18n();
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Fast session restores should not flash a spinner or announce a transient status.
    // This only delays the indicator; the route can render as soon as auth is ready.
    const timer = window.setTimeout(() => setShowIndicator(true), 400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div aria-busy="true" className="flex min-h-[100dvh] items-center justify-center bg-surface">
      {showIndicator && <LoadingIndicator title={t(messageKey)} />}
    </div>
  );
}

