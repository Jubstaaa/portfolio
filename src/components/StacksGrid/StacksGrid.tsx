import { getStacksByCategory, type Stack } from "@/lib/content";
import { cn } from "@/lib/utils";

const CATEGORY_LABEL: Record<Stack["category"], string> = {
  framework: "frameworks",
  library: "libraries",
  lang: "languages",
  infra: "infra",
  tooling: "tooling",
  design: "design",
};

const CATEGORY_ORDER: Stack["category"][] = [
  "lang",
  "framework",
  "library",
  "design",
  "tooling",
  "infra",
];

export interface StacksGridProps {
  className?: string;
}

export function StacksGrid({ className }: StacksGridProps) {
  const buckets = getStacksByCategory();
  const present = CATEGORY_ORDER.filter((cat) => (buckets[cat] ?? []).length > 0);

  return (
    <dl className={cn("grid gap-x-10 gap-y-6 md:grid-cols-2", className)}>
      {present.map((cat) => (
        <div key={cat} className="space-y-2">
          <dt className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
            {CATEGORY_LABEL[cat]}
          </dt>
          <dd>
            <ul className="text-foreground flex flex-wrap gap-x-3 gap-y-1 text-sm">
              {(buckets[cat] ?? []).map((stack) => (
                <li key={stack.name}>{stack.name}</li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}
