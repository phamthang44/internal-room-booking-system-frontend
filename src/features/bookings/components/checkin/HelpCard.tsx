import { cn } from "@shared/utils/cn";

export interface HelpCardAction {
  readonly label: string;
  readonly icon: string;
  readonly onClick?: () => void;
}

export interface HelpCardProps {
  readonly title: string;
  readonly subtitle: string;
  readonly actions: readonly HelpCardAction[];
  readonly className?: string;
}

export function HelpCard({ title, subtitle, actions, className }: Readonly<HelpCardProps>) {
  return (
    <div
      className={cn(
        "bg-primary text-white p-8 rounded-xl shadow-lg relative overflow-hidden",
        className,
      )}
    >
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-on-primary-container text-sm mb-6 leading-relaxed">{subtitle}</p>
        <div className="space-y-3">
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={a.onClick}
              className="w-full text-left flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all group"
            >
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                {a.icon}
              </span>
              <span className="font-medium">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
    </div>
  );
}

