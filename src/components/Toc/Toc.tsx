import type { Post } from "@/lib/content";
import { cn } from "@/lib/utils";

export interface TocProps {
  items: Post["toc"];
  className?: string;
}

function TocList({ items, className }: TocProps) {
  if (items.length === 0) return null;
  return (
    <ul className={cn("space-y-1.5 text-sm", className)}>
      {items.map((item) => (
        <li key={item.url}>
          <a
            href={item.url}
            className="text-muted-foreground hover:text-foreground transition-token block"
          >
            {item.title}
          </a>
          {item.items.length > 0 ? (
            <TocList items={item.items} className="mt-1.5 space-y-1 pl-3" />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function Toc({ items, className }: TocProps) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Table of contents" className={cn("space-y-3", className)}>
      <p className="text-muted-foreground text-xs tracking-[0.18em] uppercase">on this page</p>
      <TocList items={items} />
    </nav>
  );
}
