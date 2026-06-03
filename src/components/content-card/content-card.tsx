import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface ContentCardProps {
  href: string;
  meta: ReactNode;
  title: string;
  description: string;
  tags?: ReactNode;
  className?: string;
}

export function ContentCard({ href, meta, title, description, tags, className }: ContentCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "hairline group transition-token block border-b py-6 transition-[border-color]",
        className,
      )}
    >
      <p className="text-muted-foreground flex flex-wrap items-center gap-x-3 text-xs">{meta}</p>
      <h2 className="text-foreground group-hover:text-accent transition-token mt-2 text-lg font-semibold tracking-tight">
        {title}
      </h2>
      <p className="text-muted-foreground mt-1 max-w-prose text-sm">{description}</p>
      {tags ? (
        <p className="text-muted-foreground mt-2 flex flex-wrap gap-x-3 text-xs">{tags}</p>
      ) : null}
    </Link>
  );
}
