import Link from "next/link";

import { site } from "@/lib/content";

export function NavLinks() {
  return (
    <p className="flex flex-wrap gap-x-6 gap-y-1">
      {site.nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="hover:text-accent transition-token underline-offset-4 hover:underline"
        >
          .{item.href}
        </Link>
      ))}
    </p>
  );
}
