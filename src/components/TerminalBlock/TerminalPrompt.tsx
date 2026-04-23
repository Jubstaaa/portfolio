import { cn } from "@/lib/utils";

export interface TerminalPromptProps {
  className?: string;
}

export function TerminalPrompt({ className }: TerminalPromptProps) {
  return (
    <p aria-hidden className={cn("text-foreground pt-1", className)}>
      <span className="text-accent mr-2 select-none">❯</span>
      <span className="cursor-blink select-none">_</span>
    </p>
  );
}
