"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";

import { cn } from "@/lib/utils";

export interface ProjectFiltersProps {
  categories: string[];
  stacks: string[];
  className?: string;
}

const CATEGORY_LABEL: Record<string, string> = {
  all: "all",
  web: "web",
  mobile: "mobile",
  tool: "tool",
  library: "library",
  other: "other",
};

export function ProjectFilters({ categories, stacks, className }: ProjectFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const currentCategory = searchParams.get("category") ?? "all";
  const currentStacks = useMemo(
    () => new Set((searchParams.get("stack") ?? "").split(",").filter(Boolean)),
    [searchParams],
  );

  const push = useCallback(
    (next: URLSearchParams) => {
      const query = next.toString();
      const href = query ? `${pathname}?${query}` : pathname;
      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    },
    [pathname, router],
  );

  const onSelectCategory = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value === "all") next.delete("category");
      else next.set("category", value);
      push(next);
    },
    [push, searchParams],
  );

  const onToggleStack = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams.toString());
      const updated = new Set(currentStacks);
      if (updated.has(value)) updated.delete(value);
      else updated.add(value);
      if (updated.size === 0) next.delete("stack");
      else next.set("stack", Array.from(updated).join(","));
      push(next);
    },
    [push, searchParams, currentStacks],
  );

  const onReset = useCallback(() => {
    push(new URLSearchParams());
  }, [push]);

  const categoryOptions = ["all", ...categories];
  const isFiltered = currentCategory !== "all" || currentStacks.size > 0;

  return (
    <div
      data-pending={pending ? "" : undefined}
      className={cn("flex flex-col gap-4 data-[pending]:opacity-70", className)}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          aria-hidden
          className="text-muted-foreground mr-1 font-mono text-xs tracking-[0.18em] uppercase"
        >
          category
        </span>
        {categoryOptions.map((cat) => {
          const active = currentCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              aria-pressed={active}
              className={cn(
                "hairline transition-token inline-flex h-7 items-center rounded-full border px-3 text-xs",
                active
                  ? "border-accent text-accent"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {CATEGORY_LABEL[cat] ?? cat}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span
          aria-hidden
          className="text-muted-foreground mr-1 font-mono text-xs tracking-[0.18em] uppercase"
        >
          stack
        </span>
        {stacks.map((stack) => {
          const active = currentStacks.has(stack);
          return (
            <button
              key={stack}
              type="button"
              onClick={() => onToggleStack(stack)}
              aria-pressed={active}
              className={cn(
                "hairline transition-token inline-flex h-7 items-center rounded-full border px-3 text-xs",
                active
                  ? "border-accent text-accent"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {stack}
            </button>
          );
        })}
        {isFiltered ? (
          <button
            type="button"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground transition-token ml-2 text-xs underline underline-offset-4"
          >
            reset
          </button>
        ) : null}
      </div>
    </div>
  );
}
