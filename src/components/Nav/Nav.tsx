import Link from "next/link";

import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { site } from "@/lib/site";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur">
      <div className="absolute inset-0 -z-10 bg-[color-mix(in_oklch,var(--background)_80%,transparent)]" />
      <div className="container-default flex h-16 items-center justify-between">
        <Logo />
        <nav aria-label="Primary">
          <ul className="text-muted-foreground flex items-center gap-1 text-sm">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-token hover:bg-muted/60 inline-flex h-9 items-center rounded-md px-3"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
