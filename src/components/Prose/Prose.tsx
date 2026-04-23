import { cn } from "@/lib/utils";

export interface ProseProps {
  className?: string;
  children: React.ReactNode;
}

export function Prose({ className, children }: ProseProps) {
  return <div className={cn("prose-max text-foreground", className)}>{children}</div>;
}
