"use client";

import { Check, Copy } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function CodeBlock({ className, children, ...rest }: HTMLAttributes<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const onCopy = useCallback(() => {
    const text = preRef.current?.innerText ?? "";
    if (!text) return;
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 1600);
    });
  }, []);

  return (
    <div className="group relative my-6">
      <pre
        ref={preRef}
        className={cn(
          "hairline overflow-x-auto rounded-md border bg-[color:var(--muted)] p-4 text-[0.85rem] leading-relaxed",
          className,
        )}
        {...rest}
      >
        {children}
      </pre>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="hairline text-muted-foreground hover:text-foreground bg-background absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded border opacity-0 transition-opacity duration-[var(--duration-fast)] group-hover:opacity-100 focus-visible:opacity-100"
      >
        {copied ? (
          <Check aria-hidden className="text-success size-3.5" strokeWidth={2} />
        ) : (
          <Copy aria-hidden className="size-3.5" strokeWidth={1.75} />
        )}
      </button>
    </div>
  );
}
