import { LabeledGrid } from "@/components/labeled-grid";
import { getStacksByCategory, type Stack } from "@/lib/content";

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
  const groups = CATEGORY_ORDER.filter((cat) => (buckets[cat] ?? []).length > 0).map((cat) => ({
    label: CATEGORY_LABEL[cat],
    items: (buckets[cat] ?? []).map((stack) => stack.name),
  }));

  return <LabeledGrid groups={groups} {...(className ? { className } : {})} />;
}
