import { cn } from "@shared/utils/cn";

export interface SessionDetailsBentoProps {
  readonly purposeTitle: string;
  readonly purposeText: string;
  readonly attendeesTitle: string;
  readonly attendeesLabel: string;
  readonly equipmentTitle: string;
  readonly equipmentTags: readonly { label: string; icon?: string }[];
  readonly className?: string;
}

export function SessionDetailsBento({
  purposeTitle,
  purposeText,
  attendeesTitle,
  attendeesLabel,
  equipmentTitle,
  equipmentTags,
  className,
}: Readonly<SessionDetailsBentoProps>) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      <div className="bg-surface-container-low p-6 rounded-xl">
        <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">
          {purposeTitle}
        </h3>
        <p className="text-primary font-semibold text-lg leading-snug">{purposeText}</p>
      </div>

      <div className="bg-surface-container-low p-6 rounded-xl">
        <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">
          {attendeesTitle}
        </h3>
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            groups
          </span>
          <p className="text-primary font-semibold text-lg">{attendeesLabel}</p>
        </div>
      </div>

      <div className="bg-surface-container-low p-6 rounded-xl md:col-span-2">
        <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">
          {equipmentTitle}
        </h3>
        <div className="flex flex-wrap gap-3">
          {equipmentTags.map((tag) => (
            <span
              key={tag.label}
              className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest rounded-md text-sm font-medium text-primary"
            >
              {tag.icon ? (
                <span className="material-symbols-outlined text-sm">{tag.icon}</span>
              ) : null}
              {tag.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

