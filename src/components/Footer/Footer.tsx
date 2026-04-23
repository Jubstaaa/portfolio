import Link from "next/link";

import { site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t">
      <div className="container-default flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <p className="text-muted-foreground text-sm">
          © {year} {site.name}
        </p>
        <nav aria-label="Footer">
          <ul className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-foreground transition-token">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href="/feed.xml" className="hover:text-foreground transition-token">
                RSS
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
