import { TimelineRow } from "@/components/TimelineRow";
import type { Experience } from "@/lib/content";
import { formatMonth } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface TimelineProps {
  items: Experience[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cn("flex flex-col", className)}>
      {items.map((exp) => (
        <TimelineRow
          key={exp.slug}
          dateRange={`${formatMonth(exp.start)} — ${formatMonth(exp.end)}`}
        >
          <p className="text-foreground">
            {exp.company}
            <span aria-hidden className="text-muted-foreground mx-2 select-none">
              ·
            </span>
            <span className="text-muted-foreground">{exp.role}</span>
          </p>
          <p className="text-muted-foreground text-xs">{exp.location}</p>
          {exp.summary ? (
            <p className="text-muted-foreground max-w-prose text-sm">{exp.summary}</p>
          ) : null}
          {exp.highlights.length > 0 ? (
            <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
              {exp.highlights.map((h) => (
                <li key={h} className="arrow-bullet">
                  {h}
                </li>
              ))}
            </ul>
          ) : null}
          {exp.stack.length > 0 ? (
            <p className="text-muted-foreground mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
              {exp.stack.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </p>
          ) : null}
        </TimelineRow>
      ))}
    </ol>
  );
}
