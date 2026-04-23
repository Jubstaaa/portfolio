import Link from "next/link";

import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="hairline mt-24 border-t">
      <div className="container-default text-muted-foreground flex h-14 items-center justify-between text-xs">
        <p>
          <span className="text-foreground">{site.handle}</span> · {year} · built with next
        </p>
        <Link
          href="/feed.xml"
          className="hover:text-foreground transition-token inline-flex items-center gap-1"
        >
          rss
          <span aria-hidden className="select-none">
            ↗
          </span>
        </Link>
      </div>
    </footer>
  );
}
