import { LabeledGrid } from "@/components/labeled-grid";
import { getSkillsByCategory, type Skill } from "@/lib/content";

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
  const groups = CATEGORY_ORDER.filter((cat) => (buckets[cat] ?? []).length > 0).map((cat) => ({
    label: CATEGORY_LABEL[cat],
    items: (buckets[cat] ?? []).map((skill) => skill.name),
  }));

  return <LabeledGrid groups={groups} {...(className ? { className } : {})} />;
}
