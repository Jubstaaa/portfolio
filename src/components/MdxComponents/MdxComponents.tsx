import Link from "next/link";
import type { AnchorHTMLAttributes, HTMLAttributes, ImgHTMLAttributes } from "react";

import { CodeBlock } from "@/components/CodeBlock";
import { cn } from "@/lib/utils";

const RULE = "─".repeat(240);

function isExternal(href: string | undefined): boolean {
  if (!href) return false;
  return /^https?:\/\//.test(href) || href.startsWith("mailto:");
}

function Anchor({ href, children, className, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = isExternal(href);
  const linkClass = cn(
    "text-foreground hover:text-accent transition-token underline underline-offset-4",
    className,
  );
  if (!href) return <span className={linkClass}>{children}</span>;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={linkClass} {...rest}>
        {children}
        <span aria-hidden className="text-muted-foreground ml-1 select-none">
          ↗
        </span>
      </a>
    );
  }
  return (
    <Link href={href} className={linkClass}>
      {children}
    </Link>
  );
}

function H1({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn("text-foreground mt-10 mb-4 text-xl font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function H2({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-foreground mt-10 mb-3 text-lg font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function H3({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-foreground mt-8 mb-2 text-base font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function H4({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={cn("text-foreground mt-6 mb-2 text-sm font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function P({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-foreground mb-4 leading-relaxed", className)} {...props} />;
}

function Ul({ className, ...props }: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn("text-foreground mb-4 list-none space-y-1.5 pl-0", className)}
      data-mdx-list="bullet"
      {...props}
    />
  );
}

function Ol({ className, ...props }: HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      className={cn("text-foreground mb-4 list-decimal space-y-1.5 pl-5", className)}
      {...props}
    />
  );
}

function Li({ className, ...props }: HTMLAttributes<HTMLLIElement>) {
  return (
    <li
      className={cn(
        "before:text-muted-foreground relative pl-[1.5ch] before:absolute before:left-0 before:content-['→'] before:select-none data-[ordered=true]:pl-0 data-[ordered=true]:before:content-none",
        className,
      )}
      {...props}
    />
  );
}

function Hr() {
  return (
    <hr className="hairline my-8 h-px border-0 bg-[color-mix(in_oklch,var(--border)_70%,transparent)]" />
  );
}

function Blockquote({ className, ...props }: HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn(
        "text-muted-foreground my-4 border-l-2 pl-4 italic before:content-none",
        className,
      )}
      {...props}
    />
  );
}

function InlineCode({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn("bg-muted text-foreground rounded px-1.5 py-0.5 text-[0.9em]", className)}
      {...props}
    />
  );
}

function Pre(props: HTMLAttributes<HTMLPreElement>) {
  return <CodeBlock {...props} />;
}

type CalloutTone = "note" | "warn";

function Callout({
  tone = "note",
  label,
  children,
}: {
  tone?: CalloutTone;
  label?: string;
  children: React.ReactNode;
}) {
  const labelText = label ?? tone;
  const labelClass = tone === "warn" ? "text-warning" : "text-muted-foreground";
  return (
    <aside
      className={cn(
        "my-6 text-sm leading-relaxed",
        tone === "warn" ? "text-foreground" : "text-foreground",
      )}
      data-callout={tone}
    >
      <div className="text-muted-foreground flex items-baseline gap-2 text-sm leading-none">
        <span aria-hidden className="select-none">
          ╭─
        </span>
        <span className={cn("text-xs tracking-[0.18em] uppercase", labelClass)}>{labelText}</span>
        <span
          aria-hidden
          className="term-rule flex-1 overflow-hidden whitespace-nowrap select-none"
        >
          {RULE}
        </span>
        <span aria-hidden className="select-none">
          ╮
        </span>
      </div>
      <div className="px-1 py-3">{children}</div>
      <div className="text-muted-foreground flex items-baseline gap-2 text-sm leading-none">
        <span aria-hidden className="select-none">
          ╰
        </span>
        <span
          aria-hidden
          className="term-rule flex-1 overflow-hidden whitespace-nowrap select-none"
        >
          {RULE}
        </span>
        <span aria-hidden className="select-none">
          ╯
        </span>
      </div>
    </aside>
  );
}

function Note({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <Callout tone="note" {...(label !== undefined ? { label } : {})}>
      {children}
    </Callout>
  );
}

function Warn({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <Callout tone="warn" {...(label !== undefined ? { label } : {})}>
      {children}
    </Callout>
  );
}

function Img({ alt = "", src, className, ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cn("my-6 w-full", className)}
      {...rest}
    />
  );
}

function Strong({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <strong className={cn("text-foreground font-semibold", className)} {...props} />;
}

function Em({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <em className={cn("italic", className)} {...props} />;
}

export const mdxComponents = {
  a: Anchor,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  p: P,
  ul: Ul,
  ol: Ol,
  li: Li,
  hr: Hr,
  blockquote: Blockquote,
  code: InlineCode,
  pre: Pre,
  img: Img,
  strong: Strong,
  em: Em,
  Note,
  Warn,
} as const;
