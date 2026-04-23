import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  as?: "h1" | "h2" | "h3";
  title: string;
  number?: string;
  description?: string;
  className?: string;
}

export function SectionHeading({
  as: Tag = "h2",
  title,
  number,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("relative space-y-3", className)}>
      {number ? (
        <span
          aria-hidden
          className="text-muted-foreground absolute top-0 -left-10 hidden text-xs md:block"
        >
          {number}
        </span>
      ) : null}
      <Tag className="text-foreground flex items-baseline gap-2 text-lg font-normal">
        <span aria-hidden className="text-muted-foreground select-none">
          #
        </span>
        <span>{title}</span>
      </Tag>
      <hr className="hairline m-0 h-px border-0 bg-[color-mix(in_oklch,var(--border)_70%,transparent)]" />
      {description ? (
        <p className="text-muted-foreground prose-max text-sm">{description}</p>
      ) : null}
    </div>
  );
}
