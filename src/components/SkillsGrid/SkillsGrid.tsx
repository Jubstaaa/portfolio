import { getSkillsByCategory, type Skill } from "@/lib/content";
import { cn } from "@/lib/utils";

const CATEGORY_LABEL: Record<Skill["category"], string> = {
  lang: "languages",
  frontend: "frontend",
  backend: "backend",
  devops: "devops",
  design: "design",
  other: "other",
};

const CATEGORY_ORDER: Skill["category"][] = [
  "lang",
  "frontend",
  "backend",
  "devops",
  "design",
  "other",
];

export interface SkillsGridProps {
  className?: string;
}

export function SkillsGrid({ className }: SkillsGridProps) {
  const buckets = getSkillsByCategory();
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
              {(buckets[cat] ?? []).map((skill) => (
                <li key={skill.name}>{skill.name}</li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}
