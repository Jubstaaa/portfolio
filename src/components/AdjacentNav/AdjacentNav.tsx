import Link from "next/link";

export interface AdjacentNavProps {
  prev?: { path: string; title: string };
  next?: { path: string; title: string };
  ariaLabel: string;
}

export function AdjacentNav({ prev, next, ariaLabel }: AdjacentNavProps) {
  if (!prev && !next) return null;
  return (
    <nav
      aria-label={ariaLabel}
      className="hairline grid grid-cols-1 gap-4 border-t pt-8 md:grid-cols-2"
    >
      {prev ? (
        <Link
          href={prev.path}
          className="hover:text-foreground transition-token text-muted-foreground group block space-y-1"
        >
          <span className="text-xs tracking-[0.18em] uppercase">← prev</span>
          <span className="text-foreground group-hover:text-accent transition-token block truncate">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={next.path}
          className="hover:text-foreground transition-token text-muted-foreground group block space-y-1 md:text-right"
        >
          <span className="text-xs tracking-[0.18em] uppercase">next →</span>
          <span className="text-foreground group-hover:text-accent transition-token block truncate">
            {next.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
