import { useI18n } from "@shared/i18n/useI18n";

export interface FullScreenLoaderProps {
  /** i18n key, e.g. "common.loading.restoringSession" */
  readonly messageKey?: string;
}

export function FullScreenLoader({
  messageKey = "common.loading.title",
}: FullScreenLoaderProps) {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="flex items-center gap-3 text-on-surface-variant">
        <span className="material-symbols-outlined animate-spin">
          progress_activity
        </span>
        <span className="text-sm font-medium">{t(messageKey)}</span>
      </div>
    </div>
  );
}

