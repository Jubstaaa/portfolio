import type { Education } from "@/lib/content";
import { cn } from "@/lib/utils";

function formatMonth(value: string | undefined): string {
  if (!value) return "present";
  const [year, month] = value.split("-");
  const monthName = new Date(`${year}-${month}-01T00:00:00Z`).toLocaleString("en", {
    month: "short",
  });
  return `${monthName.toLowerCase()} ${year}`;
}

export interface EducationListProps {
  items: Education[];
  className?: string;
}

export function EducationList({ items, className }: EducationListProps) {
  return (
    <ol className={cn("flex flex-col", className)}>
      {items.map((edu) => (
        <li
          key={edu.slug}
          className="hairline grid grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-2 border-b py-6 last:border-b-0 md:grid-cols-[14rem,minmax(0,1fr)]"
        >
          <div className="text-muted-foreground font-mono text-xs tracking-tight">
            {formatMonth(edu.start)} — {formatMonth(edu.end)}
          </div>
          <div className="space-y-1.5">
            <p className="text-foreground">{edu.school}</p>
            <p className="text-muted-foreground text-xs">
              {edu.degree}
              {edu.field ? (
                <>
                  <span aria-hidden className="mx-2 select-none">
                    ·
                  </span>
                  {edu.field}
                </>
              ) : null}
              {edu.location ? (
                <>
                  <span aria-hidden className="mx-2 select-none">
                    ·
                  </span>
                  {edu.location}
                </>
              ) : null}
            </p>
            {edu.notes ? (
              <p className="text-muted-foreground max-w-prose text-sm">{edu.notes}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
