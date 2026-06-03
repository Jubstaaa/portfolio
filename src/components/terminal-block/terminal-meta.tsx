import { cn } from "@/lib/utils";

export interface TerminalMetaProps {
  path: string;
  branch?: string;
  className?: string;
}

export function TerminalMeta({ path, branch, className }: TerminalMetaProps) {
  return (
    <p className={cn("text-muted-foreground text-sm", className)}>
      <span className="text-foreground">{path}</span>
      {branch ? (
        <>
          {" on "}
          <span>{branch}</span>
        </>
      ) : null}
    </p>
  );
}
