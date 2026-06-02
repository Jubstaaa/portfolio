import { cn } from "@/lib/utils";
import { TerminalCaret } from "./TerminalCaret";

export interface TerminalLineProps {
  command: string;
  className?: string;
  children?: React.ReactNode;
}

export function TerminalLine({ command, className, children }: TerminalLineProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex">
        <TerminalCaret />
        <span className="text-foreground min-w-0 break-all">{command}</span>
      </div>
      {children ? (
        <div className="text-foreground space-y-0.5 pl-[2ch] break-words">{children}</div>
      ) : null}
    </div>
  );
}
