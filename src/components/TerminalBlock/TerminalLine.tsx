import { cn } from "@/lib/utils";

export interface TerminalLineProps {
  command: string;
  className?: string;
  children?: React.ReactNode;
}

export function TerminalLine({ command, className, children }: TerminalLineProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <p className="pl-[2ch] -indent-[2ch] break-words">
        <span aria-hidden className="text-accent inline-block w-[2ch] select-none">
          ❯
        </span>
        <span className="text-foreground">{command}</span>
      </p>
      {children ? (
        <div className="text-foreground space-y-0.5 pl-[2ch] break-words">{children}</div>
      ) : null}
    </div>
  );
}
