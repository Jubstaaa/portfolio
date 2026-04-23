import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  as?: "h1" | "h2" | "h3";
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  className?: string;
}

export function SectionHeading({
  as: Tag = "h2",
  eyebrow,
  title,
  description,
  align = "start",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "text-center", "space-y-3", className)}>
      {eyebrow ? (
        <p className="text-muted-foreground font-mono text-xs tracking-[0.18em] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <Tag className="text-foreground max-w-2xl text-balance">{title}</Tag>
      {description ? (
        <p className="text-muted-foreground prose-max text-balance">{description}</p>
      ) : null}
    </div>
  );
}
