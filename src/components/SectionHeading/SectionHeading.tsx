import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  as?: "h1" | "h2" | "h3";
  title: string;
  number?: string;
  description?: string;
  className?: string;
}

const RULE = "─".repeat(240);

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
      <div aria-hidden className="term-rule overflow-hidden text-sm leading-none whitespace-nowrap">
        {RULE}
      </div>
      {description ? (
        <p className="text-muted-foreground prose-max text-sm">{description}</p>
      ) : null}
    </div>
  );
}
