import { cn } from "@/lib/utils";

export interface TerminalBlockProps {
  className?: string;
  children: React.ReactNode;
}

export function TerminalBlock({ className, children }: TerminalBlockProps) {
  return (
    <div
      className={cn(
        "prose-max text-foreground flex flex-col gap-3 text-[0.95rem] leading-relaxed",
        className,
      )}
    >
      {children}
    </div>
  );
}
