import type { Experience } from "@/lib/content";
import { cn } from "@/lib/utils";

function formatMonth(value: string | undefined): string {
  if (!value) return "present";
  const [year, month] = value.split("-");
  const monthName = new Date(`${year}-${month}-01T00:00:00Z`).toLocaleString("en", {
    month: "short",
  });
  return `${monthName.toLowerCase()} ${year}`;
}

export interface TimelineProps {
  items: Experience[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cn("flex flex-col", className)}>
      {items.map((exp) => (
        <li
          key={exp.slug}
          className="hairline grid grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-2 border-b py-6 last:border-b-0 md:grid-cols-[14rem,minmax(0,1fr)]"
        >
          <div className="text-muted-foreground flex items-start gap-3 text-xs">
            <span className="font-mono tracking-tight">
              {formatMonth(exp.start)} — {formatMonth(exp.end)}
            </span>
          </div>
          <div className="space-y-1.5">
            <p className="text-foreground">
              {exp.company}
              <span aria-hidden className="text-muted-foreground mx-2 select-none">
                ·
              </span>
              <span className="text-muted-foreground">{exp.role}</span>
            </p>
            <p className="text-muted-foreground text-xs">
              {exp.location}
              {exp.remote ? (
                <>
                  <span aria-hidden className="mx-2 select-none">
                    ·
                  </span>
                  remote
                </>
              ) : null}
            </p>
            {exp.summary ? (
              <p className="text-muted-foreground max-w-prose text-sm">{exp.summary}</p>
            ) : null}
            {exp.highlights.length > 0 ? (
              <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
                {exp.highlights.map((h) => (
                  <li
                    key={h}
                    className="pl-[1.5ch] before:mr-[0.5ch] before:-ml-[1.5ch] before:content-['→'] before:select-none"
                  >
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
          </div>
        </li>
      ))}
    </ol>
  );
}
