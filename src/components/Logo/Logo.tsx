import Link from "next/link";

import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn(
        "text-foreground hover:text-accent transition-token text-sm tracking-tight",
        className,
      )}
    >
      ~/{site.handle}
    </Link>
  );
}
