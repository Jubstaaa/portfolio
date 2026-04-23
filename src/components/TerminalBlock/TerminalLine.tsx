import { cn } from "@/lib/utils";

export interface TerminalLineProps {
  command: string;
  className?: string;
  children?: React.ReactNode;
}

export function TerminalLine({ command, className, children }: TerminalLineProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <p>
        <span aria-hidden className="text-accent mr-2 select-none">
          ❯
        </span>
        <span className="text-foreground">{command}</span>
      </p>
      {children ? <div className="text-foreground space-y-0.5 pl-[2ch]">{children}</div> : null}
    </div>
  );
}
