import Link from "next/link";

import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const initials = site.name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toLowerCase();

  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn("group inline-flex items-center gap-2", className)}
    >
      <span
        aria-hidden
        className="bg-foreground text-background flex size-7 items-center justify-center rounded-md font-mono text-[11px] font-semibold tracking-tight"
      >
        {initials || "me"}
      </span>
      <span className="text-foreground text-sm font-medium tracking-tight">{site.name}</span>
    </Link>
  );
}
