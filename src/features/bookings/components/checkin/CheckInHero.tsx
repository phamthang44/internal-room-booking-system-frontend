import { cn } from "@shared/utils/cn";

export interface CheckInHeroProps {
  readonly title: string;
  readonly subtitle: string;
  readonly className?: string;
}

export function CheckInHero({ title, subtitle, className }: Readonly<CheckInHeroProps>) {
  return (
    <div className={cn("mx-auto max-w-4xl text-center", className)}>
      <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4 font-headline">
        {title}
      </h1>
      <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">{subtitle}</p>
    </div>
  );
}

