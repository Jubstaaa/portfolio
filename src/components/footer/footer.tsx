import { site } from "@/lib/content";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="hairline border-t">
      <div className="container-default text-muted-foreground flex h-14 items-center justify-between text-xs">
        <p>
          <span className="text-foreground">{site.name}</span> · portfolio · {year}
        </p>
        <a
          href="/feed.xml"
          target="_blank"
          rel="noreferrer noopener"
          className="hover:text-foreground transition-token inline-flex items-center gap-1"
        >
          rss
          <span aria-hidden className="select-none">
            ↗
          </span>
        </a>
      </div>
    </footer>
  );
}
