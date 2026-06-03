import { cn } from "@/lib/utils";

export type StatusTone = "success" | "warning" | "danger" | "muted";

export interface StatusDotProps {
  tone?: StatusTone;
  className?: string;
}

const toneClass: Record<StatusTone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
  muted: "text-muted-foreground",
};

export function StatusDot({ tone = "success", className }: StatusDotProps) {
  return (
    <span aria-hidden className={cn("mr-2 select-none", toneClass[tone], className)}>
      ●
    </span>
  );
}
