import { cn } from "@shared/utils/cn";

export interface LocationPreviewCardProps {
  readonly imageUrl: string;
  readonly imageAlt: string;
  readonly title: string;
  readonly description: string;
  readonly ctaLabel: string;
  readonly onCtaClick?: () => void;
  readonly className?: string;
}

export function LocationPreviewCard({
  imageUrl,
  imageAlt,
  title,
  description,
  ctaLabel,
  onCtaClick,
  className,
}: Readonly<LocationPreviewCardProps>) {
  return (
    <div className={cn("bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm", className)}>
      <div className="h-48 w-full bg-slate-200">
        <img alt={imageAlt} className="w-full h-full object-cover" src={imageUrl} />
      </div>
      <div className="p-6">
        <h3 className="font-bold text-primary mb-1">{title}</h3>
        <p className="text-on-surface-variant text-sm mb-4">{description}</p>
        <button
          type="button"
          onClick={onCtaClick}
          className="inline-flex items-center gap-2 text-primary text-sm font-bold hover:underline"
        >
          <span className="material-symbols-outlined text-sm">map</span>
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}

