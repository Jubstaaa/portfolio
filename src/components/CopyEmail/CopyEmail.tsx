"use client";

import { Check, Copy } from "lucide-react";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

export interface CopyEmailProps {
  email: string;
  className?: string;
}

export function CopyEmail({ email, className }: CopyEmailProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <a
        href={`mailto:${email}`}
        className="text-foreground hover:text-accent transition-token underline underline-offset-4"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={() => copy(email)}
        aria-label={copied ? "Email copied" : "Copy email"}
        className="hairline text-muted-foreground hover:text-foreground transition-token inline-flex size-7 items-center justify-center rounded border"
      >
        {copied ? (
          <Check aria-hidden className="text-success size-3.5" strokeWidth={2} />
        ) : (
          <Copy aria-hidden className="size-3.5" strokeWidth={1.75} />
        )}
      </button>
      <span
        aria-live="polite"
        className={cn(
          "text-success text-xs transition-opacity",
          copied ? "opacity-100" : "opacity-0",
        )}
      >
        copied
      </span>
    </div>
  );
}
