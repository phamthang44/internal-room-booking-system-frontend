import { useI18n } from "@shared/i18n/useI18n";
import { LoadingIndicator } from "./LoadingIndicator";

export type SpaFallBackProps = {
  title?: string;
  subtitle?: string;
};

export const SpaFallBack = ({ title, subtitle }: SpaFallBackProps) => {
  const { t } = useI18n();

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-surface">
      <LoadingIndicator title={title ?? t("common.loading.title")} subtitle={subtitle} />
    </div>
  );
};

export default SpaFallBack;
